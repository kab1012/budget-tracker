
import { User, Category, Transaction, Budget, FinancialSummary } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if it exists
api.interceptors.request.use((config: any) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth endpoints
export const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login/', { email, password });
    return response.data;
};

export const register = async (email: string, password: string, first_name: string, last_name: string) => {
    const response = await api.post('/auth/register/', { email, password, first_name, last_name });
    return response.data;
};

export const updateProfile = async (data: {
    first_name: string;
    last_name: string;
    email: string;
    current_password?: string;
    new_password?: string;
}) => {
    const response = await api.put('/auth/profile/', data);
    return response.data;
};

// Category endpoints
export const getCategories = async () => {
    const response = await api.get<Category[]>('/categories/');
    return response.data;
};

export const createCategory = async (data: { name: string; description: string }) => {
    const response = await api.post<Category>('/categories/', data);
    return response.data;
};

export const updateCategory = async (id: number, data: { name: string; description: string }) => {
    const response = await api.put<Category>(`/categories/${id}/`, data);
    return response.data;
};

export const deleteCategory = async (id: number) => {
    await api.delete(`/categories/${id}/`);
};

// Transaction endpoints
export const getTransactions = async () => {
    const response = await api.get<Transaction[]>('/transactions/');
    return response.data;
};

export const createTransaction = async (data: {
    category: number;
    amount: number;
    type: 'income' | 'expense';
    description: string;
    date: string;
}) => {
    const response = await api.post<Transaction>('/transactions/', data);
    return response.data;
};

export const updateTransaction = async (id: number, data: {
    category: number;
    amount: number;
    type: 'income' | 'expense';
    description: string;
    date: string;
}) => {
    const response = await api.put<Transaction>(`/transactions/${id}/`, data);
    return response.data;
};

export const deleteTransaction = async (id: number) => {
    await api.delete(`/transactions/${id}/`);
};

export const getFinancialSummary = async () => {
    const response = await api.get<FinancialSummary>('/summary/');
    return response.data;
};

// Budget endpoints
export const getBudgets = async () => {
    const response = await api.get<Budget[]>('/budgets/');
    return response.data;
};

export const createBudget = async (data: {
    category: number;
    amount: number;
    month: string;
}) => {
    const response = await api.post<Budget>('/budgets/', data);
    return response.data;
};

export const updateBudget = async (id: number, data: {
    category: number;
    amount: number;
    month: string;
}) => {
    const response = await api.put<Budget>(`/budgets/${id}/`, data);
    return response.data;
};

export const deleteBudget = async (id: number) => {
    await api.delete(`/budgets/${id}/`);
}; 