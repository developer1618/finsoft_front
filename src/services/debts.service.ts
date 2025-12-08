import { get, post, put, del } from './api';
import type { Debt, PaymentEntry, ApiResponse, PaginatedResponse, FilterParams } from '../types';

export const debtsService = {
    async getAll(params?: FilterParams): Promise<ApiResponse<PaginatedResponse<Debt>>> {
        return get<PaginatedResponse<Debt>>('/debts', { params });
    },

    async getById(id: string): Promise<ApiResponse<Debt>> {
        return get<Debt>(`/debts/${encodeURIComponent(id)}`);
    },

    async create(debt: Partial<Debt>): Promise<ApiResponse<Debt>> {
        return post<Debt>('/debts', debt);
    },

    async update(id: string, debt: Partial<Debt>): Promise<ApiResponse<Debt>> {
        return put<Debt>(`/debts/${encodeURIComponent(id)}`, debt);
    },

    async delete(id: string): Promise<ApiResponse<void>> {
        return del<void>(`/debts/${encodeURIComponent(id)}`);
    },

    async makePartialPayment(
        debtId: string,
        payment: Partial<PaymentEntry>
    ): Promise<ApiResponse<Debt>> {
        return post<Debt>(`/debts/${encodeURIComponent(debtId)}/payments`, payment);
    },

    async getPaymentHistory(debtId: string): Promise<ApiResponse<PaymentEntry[]>> {
        return get<PaymentEntry[]>(`/debts/${encodeURIComponent(debtId)}/payments`);
    },
};
