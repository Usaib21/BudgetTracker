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

    const itemsPerPage = 4;

    // fetch categories and build id -> name map
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
            for (const c of data) {
                if (c && (c.id !== undefined)) {
                    map[String(c.id)] = c.name || `Category ${c.id}`;
                }
            }
            setCategoriesMap(map);
        } catch (err: any) {
            console.warn('[Transactions] failed to load categories', err?.message || err);
            setCategoriesMap({});
        }
    };

    const fetchTransactions = async (pageNo: number) => {
    setLoading(true);
    setError(null);

    const attempts: Array<{
        desc: string;
        url?: string;
        params?: Record<string, any>;
        rawUrl?: string;
    }> = [
        { desc: 'query (page=pageNo, page_size & limit)', url: 'finance/transactions/', params: { page: pageNo, page_size: itemsPerPage, limit: itemsPerPage } },
        { desc: 'query (page=pageNo-1 zero-based)', url: 'finance/transactions/', params: { page: pageNo - 1, limit: itemsPerPage } },
        { desc: 'query (page=pageNo only)', url: 'finance/transactions/', params: { page: pageNo } },
        { desc: 'raw query ?page=...&limit=...', rawUrl: `finance/transactions/?page=${pageNo}&limit=${itemsPerPage}` },
        { desc: 'path /page/{n}/', rawUrl: `finance/transactions/page/${pageNo}/` },
        { desc: 'path /{n}/', rawUrl: `finance/transactions/${pageNo}/` },
        { desc: 'base endpoint (no page param) — fallback', url: 'finance/transactions/', params: {} },
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

    const formatDateToDDMMYYYY = (dateString: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    // columns now read categoriesMap for numeric ids
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
                    className={`font-semibold ${
                        transaction.is_income ? 'text-green-600' : 'text-red-600'
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
            <PageBreadcrumb pageTitle="Transactions List" />
            
            {!loading && (
                <>
                    <div className="flex justify-between items-center mb-6">
                        {/* <h2 className="text-2xl font-bold text-blue-700">Transactions</h2> */}
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
