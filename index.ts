export interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
}

export interface Category {
    id: number;
    name: string;
    type: 'income' | 'expense';
    description: string;
}

export interface Transaction {
    id: number;
    category: number;
    category_name: string;
    amount: number;
    type: 'income' | 'expense';
    description: string;
    date: string;
}

export interface Budget {
    id: number;
    category: number;
    category_name: string;
    amount: number;
    month: string;
}

export interface FinancialSummary {
    total_income: number;
    total_expenses: number;
    balance: number;
    budget_vs_actual: {
        category: string;
        budget: number;
        actual: number;
    }[];
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
}

export interface RootState {
    auth: AuthState;
    categories: Category[];
    transactions: Transaction[];
    budgets: Budget[];
    summary: FinancialSummary | null;
} 