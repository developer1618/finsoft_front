import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ChineseCargo, WorkshopItem, FilterParams, ApiError } from '../types';
import { cargoService, workshopService } from '../services';

/**
 * Workshops Store
 * Manages workshop production and Chinese cargo
 */
export const useWorkshopsStore = defineStore('workshops', () => {
    // State
    const cargoItems = ref<ChineseCargo[]>([]);
    const workshopItems = ref<WorkshopItem[]>([]);
    const currentCargo = ref<ChineseCargo | null>(null);
    const currentWorkshopItem = ref<WorkshopItem | null>(null);
    const loading = ref(false);
    const error = ref<ApiError | null>(null);
    const totalPages = ref(1);
    const currentPage = ref(1);
    const perPage = ref(10);
    const totalItems = ref(0);

    // Getters
    const orderedCargo = computed(() =>
        cargoItems.value.filter(item => item.status === 'Заказано в Китае')
    );

    const receivedCargo = computed(() =>
        cargoItems.value.filter(item => item.status === 'Принято в Душанбе')
    );

    const capsuleItems = computed(() =>
        workshopItems.value.filter(item => item.workshopType === 'capsule')
    );

    const cupItems = computed(() =>
        workshopItems.value.filter(item => item.workshopType === 'cup')
    );

    const totalCargoWeight = computed(() =>
        cargoItems.value.reduce((sum, item) => sum + item.weight, 0)
    );

    const totalCapsuleProduction = computed(() =>
        capsuleItems.value.reduce((sum, item) => sum + item.quantity, 0)
    );

    const totalCupProduction = computed(() =>
        cupItems.value.reduce((sum, item) => sum + item.quantity, 0)
    );

    // Cargo Actions
    async function fetchCargo(params?: FilterParams) {
        loading.value = true;
        error.value = null;

        try {
            const response = await cargoService.getAll(params);

            if (response.success && response.data) {
                cargoItems.value = response.data.data;
                totalPages.value = response.data.meta.lastPage;
                currentPage.value = response.data.meta.currentPage;
                perPage.value = response.data.meta.perPage;
                totalItems.value = response.data.meta.total;
            }
        } catch (err) {
            error.value = err as ApiError;
            console.error('Failed to fetch cargo:', err);
        } finally {
            loading.value = false;
        }
    }

    async function createCargo(cargoData: Partial<ChineseCargo>) {
        loading.value = true;
        error.value = null;

        try {
            const response = await cargoService.create(cargoData);

            if (response.success && response.data) {
                cargoItems.value.unshift(response.data);
                return response.data;
            }
        } catch (err) {
            error.value = err as ApiError;
            console.error('Failed to create cargo:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function updateCargo(id: string, cargoData: Partial<ChineseCargo>) {
        loading.value = true;
        error.value = null;

        try {
            const response = await cargoService.update(id, cargoData);

            if (response.success && response.data) {
                const index = cargoItems.value.findIndex(item => item.id === id);
                if (index !== -1) {
                    cargoItems.value[index] = response.data;
                }
                return response.data;
            }
        } catch (err) {
            error.value = err as ApiError;
            console.error('Failed to update cargo:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function deleteCargo(id: string) {
        loading.value = true;
        error.value = null;

        try {
            const response = await cargoService.delete(id);

            if (response.success) {
                cargoItems.value = cargoItems.value.filter(item => item.id !== id);
            }
        } catch (err) {
            error.value = err as ApiError;
            console.error('Failed to delete cargo:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    // Workshop Actions
    async function fetchWorkshopItems(params?: FilterParams) {
        loading.value = true;
        error.value = null;

        try {
            const response = await workshopService.getAll(params);

            if (response.success && response.data) {
                workshopItems.value = response.data.data;
            }
        } catch (err) {
            error.value = err as ApiError;
            console.error('Failed to fetch workshop items:', err);
        } finally {
            loading.value = false;
        }
    }

    async function fetchCapsuleItems(params?: FilterParams) {
        loading.value = true;
        error.value = null;

        try {
            const response = await workshopService.getCapsuleItems(params);

            if (response.success && response.data) {
                const capsuleData = response.data.data;
                // Update only capsule items in the main array
                workshopItems.value = [
                    ...workshopItems.value.filter(item => item.workshopType !== 'capsule'),
                    ...capsuleData
                ];
            }
        } catch (err) {
            error.value = err as ApiError;
            console.error('Failed to fetch capsule items:', err);
        } finally {
            loading.value = false;
        }
    }

    async function fetchCupItems(params?: FilterParams) {
        loading.value = true;
        error.value = null;

        try {
            const response = await workshopService.getCupItems(params);

            if (response.success && response.data) {
                const cupData = response.data.data;
                // Update only cup items in the main array
                workshopItems.value = [
                    ...workshopItems.value.filter(item => item.workshopType !== 'cup'),
                    ...cupData
                ];
            }
        } catch (err) {
            error.value = err as ApiError;
            console.error('Failed to fetch cup items:', err);
        } finally {
            loading.value = false;
        }
    }

    async function createWorkshopItem(itemData: Partial<WorkshopItem>) {
        loading.value = true;
        error.value = null;

        try {
            const response = await workshopService.create(itemData);

            if (response.success && response.data) {
                workshopItems.value.unshift(response.data);
                return response.data;
            }
        } catch (err) {
            error.value = err as ApiError;
            console.error('Failed to create workshop item:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function updateWorkshopItem(id: string, itemData: Partial<WorkshopItem>) {
        loading.value = true;
        error.value = null;

        try {
            const response = await workshopService.update(id, itemData);

            if (response.success && response.data) {
                const index = workshopItems.value.findIndex(item => item.id === id);
                if (index !== -1) {
                    workshopItems.value[index] = response.data;
                }
                return response.data;
            }
        } catch (err) {
            error.value = err as ApiError;
            console.error('Failed to update workshop item:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function deleteWorkshopItem(id: string) {
        loading.value = true;
        error.value = null;

        try {
            const response = await workshopService.delete(id);

            if (response.success) {
                workshopItems.value = workshopItems.value.filter(item => item.id !== id);
            }
        } catch (err) {
            error.value = err as ApiError;
            console.error('Failed to delete workshop item:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    function clearError() {
        error.value = null;
    }

    function resetStore() {
        cargoItems.value = [];
        workshopItems.value = [];
        currentCargo.value = null;
        currentWorkshopItem.value = null;
        loading.value = false;
        error.value = null;
        totalPages.value = 1;
        currentPage.value = 1;
        perPage.value = 10;
        totalItems.value = 0;
    }

    return {
        // State
        cargoItems,
        workshopItems,
        currentCargo,
        currentWorkshopItem,
        loading,
        error,
        totalPages,
        currentPage,
        perPage,
        totalItems,

        // Getters
        orderedCargo,
        receivedCargo,
        capsuleItems,
        cupItems,
        totalCargoWeight,
        totalCapsuleProduction,
        totalCupProduction,

        // Actions
        fetchCargo,
        createCargo,
        updateCargo,
        deleteCargo,
        fetchWorkshopItems,
        fetchCapsuleItems,
        fetchCupItems,
        createWorkshopItem,
        updateWorkshopItem,
        deleteWorkshopItem,
        clearError,
        resetStore,
    };
});
