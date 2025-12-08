import { get, post, put, del } from './api';
import type { ChineseCargo, WorkshopItem, ApiResponse, PaginatedResponse, FilterParams } from '../types';

export const cargoService = {
    async getAll(params?: FilterParams): Promise<ApiResponse<PaginatedResponse<ChineseCargo>>> {
        return get<PaginatedResponse<ChineseCargo>>('/chinese-cargo', { params });
    },

    async getById(id: string): Promise<ApiResponse<ChineseCargo>> {
        return get<ChineseCargo>(`/chinese-cargo/${encodeURIComponent(id)}`);
    },

    async create(cargo: Partial<ChineseCargo>): Promise<ApiResponse<ChineseCargo>> {
        return post<ChineseCargo>('/chinese-cargo', cargo);
    },

    async update(id: string, cargo: Partial<ChineseCargo>): Promise<ApiResponse<ChineseCargo>> {
        return put<ChineseCargo>(`/chinese-cargo/${encodeURIComponent(id)}`, cargo);
    },

    async delete(id: string): Promise<ApiResponse<void>> {
        return del<void>(`/chinese-cargo/${encodeURIComponent(id)}`);
    },
};

export const workshopService = {
    async getAll(params?: FilterParams): Promise<ApiResponse<PaginatedResponse<WorkshopItem>>> {
        return get<PaginatedResponse<WorkshopItem>>('/workshops', { params });
    },

    async getCapsuleItems(params?: FilterParams): Promise<ApiResponse<PaginatedResponse<WorkshopItem>>> {
        return get<PaginatedResponse<WorkshopItem>>('/workshops-capsule', { params });
    },

    async getCupItems(params?: FilterParams): Promise<ApiResponse<PaginatedResponse<WorkshopItem>>> {
        return get<PaginatedResponse<WorkshopItem>>('/workshops-cup', { params });
    },

    async create(item: Partial<WorkshopItem>): Promise<ApiResponse<WorkshopItem>> {
        return post<WorkshopItem>('/workshops', item);
    },

    async update(id: string, item: Partial<WorkshopItem>): Promise<ApiResponse<WorkshopItem>> {
        return put<WorkshopItem>(`/workshops/${encodeURIComponent(id)}`, item);
    },

    async delete(id: string): Promise<ApiResponse<void>> {
        return del<void>(`/workshops/${encodeURIComponent(id)}`);
    },
};
