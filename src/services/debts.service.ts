import { get, post, put, del } from './api';
import type { Debt, PaymentEntry, ApiResponse, PaginatedResponse, FilterParams } from '../types';

/**
 * Debts API Service
 */
export const debtsService = {
    /**
     * Get all debts with optional filters
     */
    async getAll(params?: FilterParams): Promise<ApiResponse<PaginatedResponse<Debt>>> {
        return get<PaginatedResponse<Debt>>('/debts', { params });
    },

    /**
     * Get a single debt by ID
     */
    async getById(id: string): Promise<ApiResponse<Debt>> {
        return get<Debt>(`/debts/${id}`);
    },

    /**
     * Create a new debt
     */
    async create(debt: Partial<Debt>): Promise<ApiResponse<Debt>> {
        return post<Debt>('/debts', debt);
    },

    /**
     * Update an existing debt
     */
    async update(id: string, debt: Partial<Debt>): Promise<ApiResponse<Debt>> {
        return put<Debt>(`/debts/${id}`, debt);
    },

    /**
     * Delete a debt
     */
    async delete(id: string): Promise<ApiResponse<void>> {
        return del<void>(`/debts/${id}`);
    },

    /**
     * Make a partial payment on a debt
     */
    async makePartialPayment(
        debtId: string,
        payment: Partial<PaymentEntry>
    ): Promise<ApiResponse<Debt>> {
        return post<Debt>(`/debts/${debtId}/payments`, payment);
    },

    /**
     * Get payment history for a debt
     */
    async getPaymentHistory(debtId: string): Promise<ApiResponse<PaymentEntry[]>> {
        return get<PaymentEntry[]>(`/debts/${debtId}/payments`);
    },
};
