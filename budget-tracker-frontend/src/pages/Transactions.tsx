
'use client';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import { type Transaction } from '../types';
import { Link } from 'react-router';
import ReusableTable from '../components/tables/ReusableTable';
import PageBreadcrumb from '../components/common/PageBreadCrumb';
import { useConfirmModal } from '../components/ui/modal/useConfirmModal';
import Message from '../components/Messages';
import Badge from '../components/ui/badge/Badge';
import SearchInput from '../components/form/input/SearchInput';
import FilterSelect from '../components/form/input/FilterSelect';
import Dropdown from '../components/form/input/Dropdown';

export default function Transactions() {
    const [items, setItems] = useState<Transaction[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { openModal, ConfirmModal } = useConfirmModal();
    const [alert, setAlert] = useState<{
        type: 'success' | 'error' | 'warning';
        message: string;
        description?: string;
    } | null>(null);

    const [categoriesMap, setCategoriesMap] = useState<Record<string, string>>({});
    const [categories, setCategories] = useState<Array<{ value: string; label: string }>>([]);

    // Filter states - CHANGED: using searchKey instead of searchId
    const [searchKey, setSearchKey] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedType, setSelectedType] = useState('ALL');
    const [open, setOpen] = useState(false);

    const itemsPerPage = 5;

    // Fetch categories and build id -> name map
    const fetchCategories = async () => {
        try {
            const res = await api.get('finance/categories/');
            let data: any = res.data;
            // Normalize common shapes: results / data / direct array
            if (data && typeof data === 'object') {
                if (Array.isArray(data.results)) data = data.results;
                else if (Array.isArray(data.data)) data = data.data;
            }
            if (!Array.isArray(data)) data = [];
            const map: Record<string, string> = {};
            const categoryOptions: Array<{ value: string; label: string }> = [
                { value: '', label: 'All' }
            ];

            for (const c of data) {
                if (c && (c.id !== undefined)) {
                    map[String(c.id)] = c.name || `Category ${c.id}`;
                    categoryOptions.push({
                        value: String(c.id),
                        label: c.name || `Category ${c.id}`
                    });
                }
            }
            setCategoriesMap(map);
            setCategories(categoryOptions);
        } catch (err: any) {
            console.warn('[Transactions] failed to load categories', err?.message || err);
            setCategoriesMap({});
            setCategories([{ value: '', label: 'All' }]);
        }
    };

    const buildApiUrl = (page: number) => {
        let url = `finance/transactions/`;
        const params: Record<string, any> = {
            page,
            page_size: itemsPerPage,
            limit: itemsPerPage
        };

        // Add filters to params - CHANGED: using searchKey and proper parameter names
        if (searchKey) params.searchKey = searchKey;
        if (selectedCategory) params.category = selectedCategory;
        if (selectedType && selectedType !== 'ALL') {
            params.is_income = selectedType === 'Income';
        }

        return { url, params };
    };

    const fetchTransactions = async (pageNo: number) => {
        setLoading(true);
        setError(null);

        const { url, params } = buildApiUrl(pageNo);

        const attempts: Array<{
            desc: string;
            url?: string;
            params?: Record<string, any>;
            rawUrl?: string;
        }> = [
                { desc: 'query (page=pageNo, page_size & limit)', url, params },
                { desc: 'query (page=pageNo-1 zero-based)', url, params: { ...params, page: pageNo - 1 } },
                { desc: 'query (page=pageNo only)', url, params: { page: pageNo } },
                {
                    desc: 'raw query with filters',
                    rawUrl: `finance/transactions/?page=${pageNo}&limit=${itemsPerPage}${searchKey ? `&searchKey=${encodeURIComponent(searchKey)}` : ''
                        }${selectedCategory ? `&category=${encodeURIComponent(selectedCategory)}` : ''
                        }${selectedType && selectedType !== 'ALL' ? `&is_income=${selectedType === 'Income'}` : ''
                        }`
                },
                { desc: 'path /page/{n}/', rawUrl: `finance/transactions/page/${pageNo}/` },
                { desc: 'path /{n}/', rawUrl: `finance/transactions/${pageNo}/` },
                { desc: 'base endpoint (no page param) — fallback', url, params: {} },
            ];

        let usedResponseData: any = null;
        let success = false;
        let lastErr: any = null;

        for (const attempt of attempts) {
            try {
                let res;
                if (attempt.rawUrl) {
                    res = await api.get(attempt.rawUrl);
                } else {
                    res = await api.get(attempt.url!, { params: attempt.params });
                }
                usedResponseData = res.data;
                success = true;
                break;
            } catch (err: any) {
                lastErr = err;
                console.warn(`[Transactions] attempt failed (${attempt.desc}):`, err?.response?.status || err?.message);
                // try next
            }
        }

        if (!success) {
            setError(lastErr?.message || `Failed to fetch transactions (status: ${lastErr?.response?.status || 'unknown'})`);
            setItems([]);
            setCount(0);
            setTotalPages(1);
            setLoading(false);
            return;
        }

        // Normalize response shapes
        const data = usedResponseData;
        let serverItems: Transaction[] = [];
        let totalCount = 0;
        let serverPaginated = false; // whether server returned page-specific items

        if (Array.isArray(data)) {
            serverItems = data;
            totalCount = data.length;
            serverPaginated = false;
        } else if (data && Array.isArray(data.results)) {
            serverItems = data.results;
            totalCount = typeof data.count === 'number' ? data.count : serverItems.length;
            serverPaginated = true;
        } else if (data && data.data && Array.isArray(data.data.list)) {
            serverItems = data.data.list;
            totalCount = typeof data.data.total === 'number' ? data.data.total : serverItems.length;
            serverPaginated = true;
        } else if (data && Array.isArray(data.list)) {
            serverItems = data.list;
            totalCount = typeof data.total === 'number' ? data.total : serverItems.length;
            serverPaginated = true;
        } else {
            const arr = Object.values(data || {}).find(Array.isArray) as any;
            if (Array.isArray(arr)) {
                serverItems = arr;
                totalCount = serverItems.length;
                serverPaginated = false;
            } else {
                serverItems = [];
                totalCount = 0;
                serverPaginated = false;
            }
        }

        if (!totalCount && serverItems.length) totalCount = serverItems.length;

        const serverReturnedTooMany = serverItems.length > itemsPerPage;
        const serverReturnedFullListButMarkedPaginated = serverPaginated && totalCount > itemsPerPage && serverItems.length === totalCount;

        const needClientSidePagination = !serverPaginated || serverReturnedTooMany || serverReturnedFullListButMarkedPaginated;

        let finalItems: Transaction[] = [];

        if (needClientSidePagination) {
            const fullList = serverItems;
            const start = (pageNo - 1) * itemsPerPage;
            const paged = fullList.slice(start, start + itemsPerPage);
            finalItems = paged;
        } else {
            finalItems = serverItems || [];
        }

        setItems(finalItems);
        setCount(totalCount);
        setCurrentPage(pageNo);
        setTotalPages(Math.max(1, Math.ceil((totalCount || 0) / itemsPerPage)));
        setLoading(false);
    };

    const handleDeleteTransaction = async (id: number, amount: string) => {
        openModal({
            type: 'danger',
            title: 'Delete Transaction',
            message: `Are you sure you want to delete transaction of amount ${amount}?`,
            confirmText: 'Yes, Delete',
            cancelText: 'Cancel',
            onConfirm: async () => {
                try {
                    await api.delete(`finance/transactions/${id}/`);
                    setAlert({
                        type: 'success',
                        message: 'Transaction deleted successfully',
                    });
                    fetchTransactions(currentPage);
                } catch (err: any) {
                    setAlert({
                        type: 'error',
                        message: 'Delete failed',
                        description: err.message,
                    });
                }
            },
        });
    };

    const handlePageChange = (page: number) => {
        fetchTransactions(page);
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchTransactions(1);
    };

    const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (value: string) => {
        setter(value);
        setCurrentPage(1);
    };

    const handleTypeChange = (typeValue: string) => {
        setSelectedType(typeValue);
        setCurrentPage(1);
        setOpen(false);
    };

    const handleToggle = () => {
        setOpen((prev) => !prev);
    };

    const formatDateToDDMMYYYY = (dateString: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    // Type options for dropdown
    const typeOptions = [
        { value: 'ALL', label: 'All' },
        { value: 'Income', label: 'Income' },
        { value: 'Expense', label: 'Expense' },
    ];

    const typeNames: Record<string, string> = {
        'ALL': 'All',
        'Income': 'Income',
        'Expense': 'Expense',
    };

    const typeIcons: Record<string, React.ReactNode> = {
        'ALL': (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
            </svg>
        ),
        'Income': (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
            </svg>
        ),
        'Expense': (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181" />
            </svg>
        ),
    };

    // Filter Section Component - CHANGED: using searchKey and proper placeholder
    const TransactionFilters = () => (
        <div className="grid grid-cols-12 gap-4 mb-6">
            {/* Search by ID - 6 columns */}
            <div className="col-span-12 md:col-span-6">
                <SearchInput
                    value={searchKey}
                    onChange={setSearchKey}
                    onSearch={handleSearch}
                    placeholder="Search by ID or Note..."
                />
            </div>

            {/* Filter by Category - 4 columns */}
            <div className="col-span-12 md:col-span-4">
                <FilterSelect
                    options={categories}
                    value={selectedCategory}
                    onChange={handleFilterChange(setSelectedCategory)}
                    placeholder="Filter by category"
                />
            </div>

            {/* Filter by Type - 2 columns */}
            <div className="col-span-12 md:col-span-2 flex justify-end">
                <Dropdown
                    name={typeNames[selectedType]}
                    value={typeNames[selectedType]}
                    open={open}
                    close={handleToggle}
                >
                    {typeOptions.map((option) => (
                        <li key={option.value}>
                            <button
                                onClick={() => handleTypeChange(option.value)}
                                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
                            >
                                <span className="flex-shrink-0">{typeIcons[option.value]}</span>
                                <span>{option.label}</span>
                            </button>
                        </li>
                    ))}
                </Dropdown>
            </div>
        </div>
    );

    // columns remain the same...
    const columns = [
        {
            header: 'ID',
            accessor: (transaction: Transaction) => transaction.id,
        },
        {
            header: 'Date',
            accessor: (transaction: Transaction) => formatDateToDDMMYYYY(transaction.date),
        },
        {
            header: 'Category',
            accessor: (transaction: Transaction) => {
                const cat = (transaction as any).category;
                if (!cat) return '-';
                // if the API returns nested object
                if (typeof cat === 'object') return (cat.name || '-') as any;
                // if API returns numeric id or string id -> lookup via categoriesMap
                const name = categoriesMap[String(cat)];
                return name ? name : `#${cat}`;
            },
        },
        {
            header: 'Amount',
            accessor: (transaction: Transaction) => (
                <span
                    className={`font-semibold ${transaction.is_income ? 'text-green-600' : 'text-red-600'
                        }`}
                >
                    {Number(transaction.amount).toLocaleString()}
                </span>
            ),
        },
        {
            header: 'Type',
            accessor: (transaction: Transaction) => (
                <Badge
                    variant="light"
                    color={transaction.is_income ? "success" : "error"}
                    size="sm"
                >
                    {transaction.is_income ? 'Income' : 'Expense'}
                </Badge>
            ),
        },
        {
            header: 'Note',
            accessor: (transaction: Transaction) => transaction.note || '-',
        },
        {
            header: 'Actions',
            className: 'text-center',
            accessor: (transaction: Transaction) => (
                <div className="flex items-center justify-center space-x-3.5">
                    <div className="group relative inline-block">
                        <Link
                            to={`/transactions/${transaction.id}/edit`}
                            className="hover:text-blue-500"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                />
                            </svg>
                        </Link>
                        <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-3 -translate-x-1/2 rounded bg-black px-3 py-1 text-sm font-medium whitespace-nowrap text-white opacity-0 group-hover:opacity-100">
                            <span className="absolute bottom-[-3px] left-1/2 -z-10 h-2 w-2 -translate-x-1/2 rotate-45 bg-black"></span>
                            Edit Transaction
                        </div>
                    </div>

                    <div className="group relative inline-block">
                        <button
                            className="hover:text-red-500"
                            onClick={() => handleDeleteTransaction(transaction.id, transaction.amount.toString())}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                />
                            </svg>
                        </button>
                        <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-3 -translate-x-1/2 rounded bg-black px-3 py-1 text-sm font-medium whitespace-nowrap text-white opacity-0 group-hover:opacity-100">
                            <span className="absolute bottom-[-3px] left-1/2 -z-10 h-2 w-2 -translate-x-1/2 rotate-45 bg-black"></span>
                            Delete Transaction
                        </div>
                    </div>
                </div>
            ),
        },
    ];

    // Refetch when filters change
    useEffect(() => {
        fetchTransactions(currentPage);
    }, [selectedCategory, selectedType]);

    // initialize: load categories first, then transactions
    useEffect(() => {
        (async () => {
            setLoading(true);
            await fetchCategories();
            await fetchTransactions(1);
        })();
    }, []);

    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto">
            <PageBreadcrumb pageTitle="Transactions List" />
            {loading && (
                <div className="page-bar p-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading transaction List...</p>
                        </div>
                    </div>
                </div>
            )}

            {alert && (
                <Message
                    type={alert.type}
                    message={alert.message}
                    description={alert.description}
                    onClose={() => setAlert(null)}
                />
            )}
            <ConfirmModal />
            

            {!loading && (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <Link
                            to="/transactions/new"
                            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-medium text-white shadow-lg transition hover:bg-green-700"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-5"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Add Transaction
                        </Link>
                    </div>

                    <ReusableTable
                        tableName="Financial Transactions"
                        filterSection={TransactionFilters()}
                        data={items}
                        columns={columns}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        emptyMessage="No transactions available."
                    />

                    <div className="mt-2 text-sm font-medium text-black dark:text-white">
                        Total: <b>{count}</b> Transactions
                    </div>
                </>
            )}
        </div>
    );
}