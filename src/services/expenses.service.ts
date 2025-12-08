import { get, post, put, del } from './api';
import type { Transaction, VarzobExpense, ApiResponse, PaginatedResponse, FilterParams } from '../types';

export const expensesService = {
    async getAll(params?: FilterParams): Promise<ApiResponse<PaginatedResponse<Transaction>>> {
        return get<PaginatedResponse<Transaction>>('/transactions', { params });
    },

    async getById(id: string): Promise<ApiResponse<Transaction>> {
        return get<Transaction>(`/transactions/${encodeURIComponent(id)}`);
    },

    async create(transaction: Partial<Transaction>): Promise<ApiResponse<Transaction>> {
        return post<Transaction>('/transactions', transaction);
    },

    async update(id: string, transaction: Partial<Transaction>): Promise<ApiResponse<Transaction>> {
        return put<Transaction>(`/transactions/${encodeURIComponent(id)}`, transaction);
    },

    async delete(id: string): Promise<ApiResponse<void>> {
        return del<void>(`/transactions/${encodeURIComponent(id)}`);
    },

    async getVarzobExpenses(params?: FilterParams): Promise<ApiResponse<PaginatedResponse<VarzobExpense>>> {
        return get<PaginatedResponse<VarzobExpense>>('/varzob-expenses', { params });
    },

    async createVarzobExpense(expense: Partial<VarzobExpense>): Promise<ApiResponse<VarzobExpense>> {
        return post<VarzobExpense>('/varzob-expenses', expense);
    },

    async updateVarzobExpense(id: string, expense: Partial<VarzobExpense>): Promise<ApiResponse<VarzobExpense>> {
        return put<VarzobExpense>(`/varzob-expenses/${encodeURIComponent(id)}`, expense);
    },

    async deleteVarzobExpense(id: string): Promise<ApiResponse<void>> {
        return del<void>(`/varzob-expenses/${encodeURIComponent(id)}`);
    },
};
