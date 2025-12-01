import { get, post, put, del } from './api';
import type { WarehouseItem, ApiResponse, PaginatedResponse, FilterParams } from '../types';

/**
 * Warehouse API Service
 */
export const warehouseService = {
    /**
     * Get all warehouse items with optional filters
     */
    async getAll(params?: FilterParams): Promise<ApiResponse<PaginatedResponse<WarehouseItem>>> {
        return get<PaginatedResponse<WarehouseItem>>('/warehouse', { params });
    },

    /**
     * Get a single warehouse item by ID
     */
    async getById(id: string): Promise<ApiResponse<WarehouseItem>> {
        return get<WarehouseItem>(`/warehouse/${id}`);
    },

    /**
     * Create a new warehouse item
     */
    async create(item: Partial<WarehouseItem>): Promise<ApiResponse<WarehouseItem>> {
        return post<WarehouseItem>('/warehouse', item);
    },

    /**
     * Update an existing warehouse item
     */
    async update(id: string, item: Partial<WarehouseItem>): Promise<ApiResponse<WarehouseItem>> {
        return put<WarehouseItem>(`/warehouse/${id}`, item);
    },

    /**
     * Delete a warehouse item
     */
    async delete(id: string): Promise<ApiResponse<void>> {
        return del<void>(`/warehouse/${id}`);
    },

    /**
     * Get factory warehouse items
     */
    async getFactoryItems(params?: FilterParams): Promise<ApiResponse<PaginatedResponse<WarehouseItem>>> {
        return get<PaginatedResponse<WarehouseItem>>('/warehouse/factory', { params });
    },
};
