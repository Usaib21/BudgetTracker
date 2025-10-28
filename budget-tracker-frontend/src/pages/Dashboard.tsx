import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import api from '../api/axios';
import { IncomeExpenseDonut } from '../components/D3/IncomeExpenseDonut';
import { BudgetBar } from '../components/D3/BudgetBar';
import type { Summary, Transaction } from '../types';

export default function Dashboard() {
    const [summary, setSummary] = useState<Summary | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const s = await api.get('finance/summary/');
                const t = await api.get('finance/transactions/');
                setSummary(s.data);
                const allTransactions = t.data.results || [];
                setTransactions(allTransactions.slice(0, 5)); // ✅ show only latest 5
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        }
        fetchData();
    }, []);

    if (!summary)
        return (
            <div className="text-center py-10 text-gray-500 animate-pulse">
                Loading dashboard...
            </div>
        );

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-3xl font-bold text-blue-700 mb-4">Dashboard</h2>

            {/* === Overview Section === */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center justify-between">
                        <span>Income vs Expense</span>
                        <span className="text-sm font-medium text-gray-400">
                            (This Month)
                        </span>
                    </h3>
                    <IncomeExpenseDonut
                        income={summary.total_income}
                        expense={summary.total_expenses}
                    />
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center justify-between">
                        <span>Budget vs Actual</span>
                        <span className="text-sm font-medium text-gray-400">
                            (Monthly)
                        </span>
                    </h3>
                    <BudgetBar
                        budget={summary.monthly_budget}
                        actual={summary.monthly_expenses}
                    />
                </div>
            </div>

            {/* === Latest Transactions Section === */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-700">
                        Latest 5 Transactions
                    </h3>
                    <Link
                        to="/transactions"
                        className="text-blue-600 hover:text-blue-800 font-medium text-lg"
                        title="View all transactions"
                    >
                        ›
                    </Link>
                </div>

                <div className="overflow-x-auto rounded-lg">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gradient-to-r from-blue-100 to-blue-50 text-gray-700">
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Date</th>
                                <th className="p-3 text-left">Category</th>
                                <th className="p-3 text-left">Amount</th>
                                <th className="p-3 text-left">Note</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx) => (
                                <tr
                                    key={tx.id}
                                    className="border-t hover:bg-gray-50 transition-colors"
                                >
                                    <td className="p-3">{tx.id}</td>
                                    <td className="p-3">{tx.date}</td>
                                    <td className="p-3">{tx.category?.name}</td>
                                    <td
                                        className={`p-3 font-semibold ${tx.is_income ? 'text-green-600' : 'text-red-600'
                                            }`}
                                    >
                                        {tx.is_income ? '+' : '-'}
                                        {tx.amount}
                                    </td>
                                    <td className="p-3 text-gray-600">{tx.note || '-'}</td>
                                </tr>
                            ))}
                            {transactions.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="p-4 text-center text-gray-500 italic"
                                    >
                                        No recent transactions
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
