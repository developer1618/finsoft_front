import { get, post, put, del } from './api';
import type { CashierOperation, ApiResponse, PaginatedResponse, FilterParams } from '../types';

export const cashierService = {
    async getAll(params?: FilterParams): Promise<ApiResponse<PaginatedResponse<CashierOperation>>> {
        return get<PaginatedResponse<CashierOperation>>('/cashier', { params });
    },

    async getById(id: string): Promise<ApiResponse<CashierOperation>> {
        return get<CashierOperation>(`/cashier/${encodeURIComponent(id)}`);
    },

    async create(operation: Partial<CashierOperation>): Promise<ApiResponse<CashierOperation>> {
        return post<CashierOperation>('/cashier', operation);
    },

    async update(id: string, operation: Partial<CashierOperation>): Promise<ApiResponse<CashierOperation>> {
        return put<CashierOperation>(`/cashier/${encodeURIComponent(id)}`, operation);
    },

    async delete(id: string): Promise<ApiResponse<void>> {
        return del<void>(`/cashier/${encodeURIComponent(id)}`);
    },
};
