import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { WarehouseItem, FilterParams, ApiError } from '../types';
import { WarehouseLocation } from '../types';
import { warehouseService } from '../services';

export const useWarehouseStore = defineStore('warehouse', () => {
    const items = ref<WarehouseItem[]>([]);
    const factoryItems = ref<WarehouseItem[]>([]);
    const currentItem = ref<WarehouseItem | null>(null);
    const loading = ref(false);
    const error = ref<ApiError | null>(null);
    const totalPages = ref(1);
    const currentPage = ref(1);
    const perPage = ref(10);
    const totalItems = ref(0);

    const capsuleWarehouseItems = computed(() =>
        items.value.filter(item => item.location === 'Склад Капсула')
    );

    const cupWarehouseItems = computed(() =>
        items.value.filter(item => item.location === 'Склад Стакан')
    );

    const totalItemsCount = computed(() => items.value.length);

    const lowStockItems = computed(() =>
        items.value.filter(item => item.quantity < 10)
    );

    async function fetchItems(params?: FilterParams) {
        loading.value = true;
        error.value = null;

        try {
            const response = await warehouseService.getAll(params);

            if (response.success && response.data) {
                items.value = response.data.data;
                totalPages.value = response.data.meta.lastPage;
                currentPage.value = response.data.meta.currentPage;
                perPage.value = response.data.meta.perPage;
                totalItems.value = response.data.meta.total;
            }
        } catch (err) {
            error.value = err as ApiError;
        } finally {
            loading.value = false;
        }
    }

    async function fetchFactoryItems(params?: FilterParams) {
        loading.value = true;
        error.value = null;

        try {
            const response = await warehouseService.getFactoryItems(params);

            if (response.success && response.data) {
                factoryItems.value = response.data.data;
            }
        } catch (err) {
            error.value = err as ApiError;
        } finally {
            loading.value = false;
        }
    }

    async function fetchItemById(id: string) {
        loading.value = true;
        error.value = null;

        try {
            const response = await warehouseService.getById(id);

            if (response.success && response.data) {
                currentItem.value = response.data;
                return response.data;
            }
        } catch (err) {
            error.value = err as ApiError;
        } finally {
            loading.value = false;
        }
    }

    async function createItem(itemData: Partial<WarehouseItem>) {
        loading.value = true;
        error.value = null;

        try {
            const response = await warehouseService.create(itemData);

            if (response.success && response.data) {
                items.value.unshift(response.data);
                // Also add to factoryItems if it's a factory warehouse item
                if (response.data.location === WarehouseLocation.FACTORY) {
                    factoryItems.value.unshift(response.data);
                }
                return response.data;
            }
        } catch (err) {
            error.value = err as ApiError;
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function updateItem(id: string, itemData: Partial<WarehouseItem>) {
        loading.value = true;
        error.value = null;

        try {
            const response = await warehouseService.update(id, itemData);

            if (response.success && response.data) {
                const index = items.value.findIndex(item => item.id === id);
                if (index !== -1) {
                    items.value[index] = response.data;
                }
                // Also update in factoryItems if it's a factory warehouse item
                const factoryIndex = factoryItems.value.findIndex(item => item.id === id);
                if (factoryIndex !== -1) {
                    factoryItems.value[factoryIndex] = response.data;
                }
                return response.data;
            }
        } catch (err) {
            error.value = err as ApiError;
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function deleteItem(id: string) {
        loading.value = true;
        error.value = null;

        try {
            const response = await warehouseService.delete(id);

            if (response.success) {
                items.value = items.value.filter(item => item.id !== id);
                // Also remove from factoryItems
                factoryItems.value = factoryItems.value.filter(item => item.id !== id);
            }
        } catch (err) {
            error.value = err as ApiError;
            throw err;
        } finally {
            loading.value = false;
        }
    }

    function clearError() {
        error.value = null;
    }

    function resetStore() {
        items.value = [];
        factoryItems.value = [];
        currentItem.value = null;
        loading.value = false;
        error.value = null;
        totalPages.value = 1;
        currentPage.value = 1;
        perPage.value = 10;
        totalItems.value = 0;
    }

    return {
        items,
        factoryItems,
        currentItem,
        loading,
        error,
        totalPages,
        currentPage,
        perPage,
        totalItems,
        capsuleWarehouseItems,
        cupWarehouseItems,
        totalItemsCount,
        lowStockItems,
        fetchItems,
        fetchFactoryItems,
        fetchItemById,
        createItem,
        updateItem,
        deleteItem,
        clearError,
        resetStore,
    };
});
