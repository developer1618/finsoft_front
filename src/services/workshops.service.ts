import { get, post, put, del } from './api';
import type { ChineseCargo, WorkshopItem, ApiResponse, PaginatedResponse, FilterParams } from '../types';

/**
 * Chinese Cargo API Service
 */
export const cargoService = {
    /**
     * Get all cargo items with optional filters
     */
    async getAll(params?: FilterParams): Promise<ApiResponse<PaginatedResponse<ChineseCargo>>> {
        return get<PaginatedResponse<ChineseCargo>>('/chinese-cargo', { params });
    },

    /**
     * Get a single cargo item by ID
     */
    async getById(id: string): Promise<ApiResponse<ChineseCargo>> {
        return get<ChineseCargo>(`/chinese-cargo/${id}`);
    },

    /**
     * Create a new cargo item
     */
    async create(cargo: Partial<ChineseCargo>): Promise<ApiResponse<ChineseCargo>> {
        return post<ChineseCargo>('/chinese-cargo', cargo);
    },

    /**
     * Update an existing cargo item
     */
    async update(id: string, cargo: Partial<ChineseCargo>): Promise<ApiResponse<ChineseCargo>> {
        return put<ChineseCargo>(`/chinese-cargo/${id}`, cargo);
    },

    /**
     * Delete a cargo item
     */
    async delete(id: string): Promise<ApiResponse<void>> {
        return del<void>(`/chinese-cargo/${id}`);
    },
};

/**
 * Workshop API Service
 */
export const workshopService = {
    /**
     * Get all workshop items with optional filters
     */
    async getAll(params?: FilterParams): Promise<ApiResponse<PaginatedResponse<WorkshopItem>>> {
        return get<PaginatedResponse<WorkshopItem>>('/workshops', { params });
    },

    /**
     * Get capsule workshop items
     */
    async getCapsuleItems(params?: FilterParams): Promise<ApiResponse<PaginatedResponse<WorkshopItem>>> {
        return get<PaginatedResponse<WorkshopItem>>('/workshops/capsule', { params });
    },

    /**
     * Get cup workshop items
     */
    async getCupItems(params?: FilterParams): Promise<ApiResponse<PaginatedResponse<WorkshopItem>>> {
        return get<PaginatedResponse<WorkshopItem>>('/workshops/cup', { params });
    },

    /**
     * Create a new workshop item
     */
    async create(item: Partial<WorkshopItem>): Promise<ApiResponse<WorkshopItem>> {
        return post<WorkshopItem>('/workshops', item);
    },

    /**
     * Update an existing workshop item
     */
    async update(id: string, item: Partial<WorkshopItem>): Promise<ApiResponse<WorkshopItem>> {
        return put<WorkshopItem>(`/workshops/${id}`, item);
    },

    /**
     * Delete a workshop item
     */
    async delete(id: string): Promise<ApiResponse<void>> {
        return del<void>(`/workshops/${id}`);
    },
};
