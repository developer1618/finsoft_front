import { get, post, put, del } from './api';
import type { WarehouseItem, ApiResponse, PaginatedResponse, FilterParams } from '../types';

export const warehouseService = {
    async getAll(params?: FilterParams): Promise<ApiResponse<PaginatedResponse<WarehouseItem>>> {
        return get<PaginatedResponse<WarehouseItem>>('/warehouse', { params });
    },

    async getById(id: string): Promise<ApiResponse<WarehouseItem>> {
        return get<WarehouseItem>(`/warehouse/${encodeURIComponent(id)}`);
    },

    async create(item: Partial<WarehouseItem>): Promise<ApiResponse<WarehouseItem>> {
        return post<WarehouseItem>('/warehouse', item);
    },

    async update(id: string, item: Partial<WarehouseItem>): Promise<ApiResponse<WarehouseItem>> {
        return put<WarehouseItem>(`/warehouse/${encodeURIComponent(id)}`, item);
    },

    async delete(id: string): Promise<ApiResponse<void>> {
        return del<void>(`/warehouse/${encodeURIComponent(id)}`);
    },

    async getFactoryItems(params?: FilterParams): Promise<ApiResponse<PaginatedResponse<WarehouseItem>>> {
        return get<PaginatedResponse<WarehouseItem>>('/warehouse-factory', { params });
    },
};
