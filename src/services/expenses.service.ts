import { get, post, put, del } from './api';
import type { Transaction, VarzobExpense, ApiResponse, PaginatedResponse, FilterParams } from '../types';

/**
 * Expenses and Income API Service
 */
export const expensesService = {
    /**
     * Get all transactions (income/expense) with optional filters
     */
    async getAll(params?: FilterParams): Promise<ApiResponse<PaginatedResponse<Transaction>>> {
        return get<PaginatedResponse<Transaction>>('/transactions', { params });
    },

    /**
     * Get a single transaction by ID
     */
    async getById(id: string): Promise<ApiResponse<Transaction>> {
        return get<Transaction>(`/transactions/${id}`);
    },

    /**
     * Create a new transaction
     */
    async create(transaction: Partial<Transaction>): Promise<ApiResponse<Transaction>> {
        return post<Transaction>('/transactions', transaction);
    },

    /**
     * Update an existing transaction
     */
    async update(id: string, transaction: Partial<Transaction>): Promise<ApiResponse<Transaction>> {
        return put<Transaction>(`/transactions/${id}`, transaction);
    },

    /**
     * Delete a transaction
     */
    async delete(id: string): Promise<ApiResponse<void>> {
        return del<void>(`/transactions/${id}`);
    },

    /**
     * Get Varzob expenses
     */
    async getVarzobExpenses(params?: FilterParams): Promise<ApiResponse<PaginatedResponse<VarzobExpense>>> {
        return get<PaginatedResponse<VarzobExpense>>('/varzob-expenses', { params });
    },

    /**
     * Create Varzob expense
     */
    async createVarzobExpense(expense: Partial<VarzobExpense>): Promise<ApiResponse<VarzobExpense>> {
        return post<VarzobExpense>('/varzob-expenses', expense);
    },

    /**
     * Update Varzob expense
     */
    async updateVarzobExpense(id: string, expense: Partial<VarzobExpense>): Promise<ApiResponse<VarzobExpense>> {
        return put<VarzobExpense>(`/varzob-expenses/${id}`, expense);
    },

    /**
     * Delete Varzob expense
     */
    async deleteVarzobExpense(id: string): Promise<ApiResponse<void>> {
        return del<void>(`/varzob-expenses/${id}`);
    },
};
