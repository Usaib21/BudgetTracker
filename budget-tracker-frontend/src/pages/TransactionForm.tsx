// src/pages/TransactionForm.tsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import Form from '../components/form/Form';
import ComponentCard from '../components/form/ComponentCard';
import Label from '../components/form/Label';
import Input from '../components/form/inputField';
import Select from '../components/form/Select';
import useFormValidation from '../hooks/useFormValidation';
import Message from '../components/Messages';
import Button from '../components/form/Button';
import Checkbox from '../components/form/input/Checkbox';
import api from '../api/axios';
import { Category } from '../types';
import DatePicker from '../components/form/date-picker';
import PageBreadcrumb from '../components/common/PageBreadCrumb';

interface TransactionFormData {
    category_id: string;
    amount: string;
    date: string;
    note: string;
    is_income: boolean;
}

const validationRules = {
    category_id: { isRequired: true, labelName: 'Category' },
    amount: {
        isRequired: true,
        labelName: 'Amount',
        custom: (value: string) => {
            if (value && parseFloat(value) <= 0) {
                return 'Amount must be greater than 0';
            }
            return null;
        },
    },
    date: { isRequired: true, labelName: 'Date' },
};

export default function TransactionForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{
        type: 'success' | 'error';
        message: string;
        description?: string;
    } | null>(null);

    const fetchedFor = useRef<Record<string, boolean>>({}); // track fetch state per id (or "new")

    const {
        formData,
        errors,
        handleChange,
        handleBlur,
        handleCustomChange,
        setFormData,
        handleSubmit,
    } = useFormValidation<TransactionFormData>(
        {
            category_id: '',
            amount: '',
            date: new Date().toISOString().split('T')[0],
            note: '',
            is_income: false,
        },
        validationRules
    );

    useEffect(() => {
        const key = id ?? '__new__';
        if (fetchedFor.current[key]) {
            // Already fetched for this id/new form — skip
            return;
        }
        // mark as fetched so we don't call again for same key
        fetchedFor.current[key] = true;

        async function loadData() {
            setLoading(true);
            try {
                const categoriesResponse = await api.get('finance/categories/');

                // Normalize response -> results / data / direct array
                let newCategories: any = categoriesResponse.data;
                if (newCategories && typeof newCategories === 'object') {
                    if (Array.isArray(newCategories.results)) newCategories = newCategories.results;
                    else if (Array.isArray(newCategories.data)) newCategories = newCategories.data;
                }
                if (!Array.isArray(newCategories)) newCategories = [];

                // Keep values as strings for consistent comparison with formData.category_id
                newCategories = newCategories.map((c: any) => ({ ...c, id: c.id, name: c.name, type: c.type }));

                // We'll append missing selected category (if any) before setting state
                if (id) {
                    const transactionResponse = await api.get(`finance/transactions/${id}/`);
                    const transaction = transactionResponse.data;

                    // figure out category id (could be number or object)
                    const cat = (transaction as any).category;
                    let catIdStr = '';
                    if (cat !== null && cat !== undefined) {
                        if (typeof cat === 'object') catIdStr = String(cat.id ?? '');
                        else catIdStr = String(cat);
                    }

                    // Append missing category detail if category id exists but not in list
                    if (catIdStr) {
                        const exists = newCategories.find((c: any) => String(c.id) === catIdStr);
                        if (!exists) {
                            try {
                                const catRes = await api.get(`finance/categories/${catIdStr}/`);
                                let singleCat: any = catRes.data;
                                // Normalize if wrapped (unlikely for detail endpoints)
                                if (singleCat && typeof singleCat === 'object' && Array.isArray(singleCat.results)) {
                                    singleCat = singleCat.results[0];
                                }
                                if (singleCat && singleCat.id) {
                                    newCategories = [...newCategories, singleCat];
                                }
                            } catch (err) {
                                console.warn('[TransactionForm] could not fetch missing category detail', err);
                            }
                        }

                        // set categories state first (so Select options exist),
                        // then set formData.category_id as the string value
                        setCategories(newCategories);
                        setFormData({
                            category_id: catIdStr, // ensure string, not number
                            amount: transaction.amount?.toString() || '',
                            date: transaction.date || new Date().toISOString().split('T')[0],
                            note: transaction.note || '',
                            is_income: !!transaction.is_income,
                        });

                        setLoading(false);
                        return;
                    } else {
                        // no category for this transaction - continue to set categories & formData below
                        setFormData({
                            category_id: '',
                            amount: transaction.amount?.toString() || '',
                            date: transaction.date || new Date().toISOString().split('T')[0],
                            note: transaction.note || '',
                            is_income: !!transaction.is_income,
                        });
                    }
                }

                // default: no edit id or no category to append
                setCategories(newCategories);
            } catch (error: any) {
                console.error('Error loading data:', error);
                setAlert({
                    type: 'error',
                    message: 'Failed to load data',
                    description: error.response?.data?.detail || error.message,
                });
            } finally {
                setLoading(false);
            }
        }

        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, setFormData]);

    // Clear selected category if it doesn't match the currently selected transaction type
    useEffect(() => {
        if (!formData.category_id) return;
        const selected = categories.find((c) => String(c.id) === String(formData.category_id));
        if (selected && selected.type !== (formData.is_income ? 'income' : 'expense')) {
            // Clear selected category to avoid type mismatch
            setFormData({
                ...formData,
                category_id: '',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.is_income]);

    const onSubmit = async (data: TransactionFormData) => {
        setLoading(true);
        setAlert(null);

        try {
            const payload = {
                // keep payload as 'category' like your current backend expects;
                // if your serializer expects 'category_id' instead, change this key accordingly
                category_id: data.category_id ? parseInt(data.category_id) : null,
                amount: parseFloat(data.amount),
                date: data.date,
                note: data.note,
                is_income: data.is_income,
            };

            if (id) {
                await api.put(`finance/transactions/${id}/`, payload);
                setAlert({
                    type: 'success',
                    message: 'Transaction updated successfully!',
                });
            } else {
                await api.post('finance/transactions/', payload);
                setAlert({
                    type: 'success',
                    message: 'Transaction created successfully!',
                });
            }

            // Redirect after success
            setTimeout(() => {
                navigate('/transactions');
            }, 1500);
        } catch (error: any) {
            console.error('Error saving transaction:', error);
            setAlert({
                type: 'error',
                message: `Failed to ${id ? 'update' : 'create'} transaction`,
                description: error.response?.data?.detail || error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    // Filtering logic:
    // - if no category is selected (new transaction), show ALL categories
    // - always include the currently selected category (so edits don't hide it)
    // - otherwise show categories that match the selected transaction type
    const filteredCategories = Array.isArray(categories)
        ? categories.filter((category) => {
            if (!formData.category_id) return true;
            if (String(category.id) === String(formData.category_id)) return true;
            return formData.is_income ? category.type === 'income' : category.type === 'expense';
        })
        : [];

    const categoryOptions = filteredCategories.map((category) => ({
        value: category.id.toString(),
        label: `${category.name} (${category.type})`,
    }));

    // Add a simple loading state
    if (loading && categories.length === 0) {
        return (
            <div className="page-bar p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading transaction form...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-bar p-8">
            {/* Alert Message */}
            {alert && (
                <Message type={alert.type} message={alert.message} description={alert.description} onClose={() => setAlert(null)} />
            )}

            <PageBreadcrumb pageTitle={id ? 'Update Transaction' : 'Add New Transaction'} />

            <ComponentCard title={id ? 'Edit Transaction' : 'Add Transaction'} className="mx-auto mt-4 max-w-2xl">
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-6">
                        {/* Transaction Type Toggle */}
                        <div className="mb-4.5">
                            <Label htmlFor="is_income">Transaction Type</Label>
                            <div className="flex items-center gap-4 mt-2">
                                <Checkbox
                                    id="is_income"
                                    checked={formData.is_income}
                                    onChange={(checked) => !id && handleCustomChange("is_income", checked)} // ✅ Disable change when editing
                                    label={formData.is_income ? "Income" : "Expense"}
                                    disabled={!!id} // ✅ Disable checkbox in edit mode
                                />
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${formData.is_income
                                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                        }`}
                                >
                                    {formData.is_income ? "Income" : "Expense"}
                                </span>
                            </div>
                        </div>


                        {/* Category */}
                        <div className="mb-4.5">
                            <Label htmlFor="category_id">
                                Category <span className="text-red-500">*</span>
                            </Label>


                            <Select
                                id="category_id"
                                name="category_id"
                                value={String(formData.category_id) || ""}
                                onChange={(value) => handleCustomChange("category_id", value)}
                                options={categoryOptions}
                                placeholder="Select a category"
                            />
                            {errors.category_id && <span className="text-sm text-red-500 mt-1 block">{errors.category_id}</span>}
                        </div>

                        {/* Amount */}
                        <div className="mb-4.5">
                            <Label htmlFor="amount">
                                Amount <span className="text-red-500">*</span>
                            </Label>
                            <Input id="amount" name="amount" type="number" placeholder="0.00" value={formData.amount} onChange={handleChange} onBlur={() => handleBlur('amount')} disabled={loading} />
                            {errors.amount && <span className="text-sm text-red-500 mt-1 block">{errors.amount}</span>}
                        </div>

                        {/* Date */}
                        <div className="mb-4.5">
                            <Label htmlFor="date">
                                Date <span className="text-red-500">*</span></Label>
                            <DatePicker
                                id="date"
                                name="date"
                                value={formData.date || ''}
                                onChange={(value) => handleCustomChange('date', value)}
                                onBlur={() => handleBlur('date')}
                            />
                            {errors.date && <span className="text-sm text-red-500">{errors.date}</span>}
                        </div>

                        {/* Note */}
                        <div className="mb-4.5">
                            <Label htmlFor="note">Note</Label>
                            <Input id="note" name="note" type="text" placeholder="Add a note (optional)" value={formData.note} onChange={handleChange} disabled={loading} multiline rows={3} />
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                            <Button type="button" variant="outline" onClick={() => navigate('/transactions')} disabled={loading}>
                                Cancel
                            </Button>

                            <Button type="submit" variant="primary" size="md" loading={loading} disabled={loading || categories.length === 0}>
                                {loading ? 'Saving...' : id ? 'Update Transaction' : 'Create Transaction'}
                            </Button>
                        </div>
                    </div>
                </Form>
            </ComponentCard>
        </div>
    );
}
