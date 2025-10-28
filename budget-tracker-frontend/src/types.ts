// src/types.ts

export interface User {
    username: string;
    // Add more fields if needed later (e.g., email, id, role)
}

export interface Category {
    id: number;
    name: string;
    type: 'income' | 'expense';
    user: number;
}

export interface Transaction {
    id: number;
    user: number;
    category: Category;
    amount: string; // string because DRF returns decimal as string
    date: string; // YYYY-MM-DD
    note?: string;
    is_income: boolean;
    created_at?: string;
}

export interface Budget {
    id: number;
    user: number;
    month: string; // YYYY-MM-01
    amount: string;
}

export interface Summary {
    total_income: number;
    total_expenses: number;
    monthly_budget: number;
    monthly_expenses: number;
}

