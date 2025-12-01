import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Debt, PaymentEntry, FilterParams, ApiError } from '../types';
import { debtsService } from '../services';

/**
 * Debts Store
 * Manages debt records, payments, and related operations
 */
export const useDebtsStore = defineStore('debts', () => {
    // State
    const debts = ref<Debt[]>([]);
    const currentDebt = ref<Debt | null>(null);
    const loading = ref(false);
    const error = ref<ApiError | null>(null);
    const totalPages = ref(1);
    const currentPage = ref(1);
    const perPage = ref(10);
    const totalItems = ref(0);

    // Getters
    const unpaidDebts = computed(() =>
        debts.value.filter(debt => debt.status === 'Неоплачено')
    );

    const partiallyPaidDebts = computed(() =>
        debts.value.filter(debt => debt.status === 'Частично оплачено')
    );

    const paidDebts = computed(() =>
        debts.value.filter(debt => debt.status === 'Оплачено')
    );

    const totalDebtAmount = computed(() =>
        debts.value.reduce((sum, debt) => sum + debt.remainingAmount, 0)
    );

    // Actions
    async function fetchDebts(params?: FilterParams) {
        loading.value = true;
        error.value = null;

        try {
            const response = await debtsService.getAll(params);

            if (response.success && response.data) {
                debts.value = response.data.data;
                totalPages.value = response.data.meta.lastPage;
                currentPage.value = response.data.meta.currentPage;
                perPage.value = response.data.meta.perPage;
                totalItems.value = response.data.meta.total;
            }
        } catch (err) {
            error.value = err as ApiError;
            console.error('Failed to fetch debts:', err);
        } finally {
            loading.value = false;
        }
    }

    async function fetchDebtById(id: string) {
        loading.value = true;
        error.value = null;

        try {
            const response = await debtsService.getById(id);

            if (response.success && response.data) {
                currentDebt.value = response.data;
                return response.data;
            }
        } catch (err) {
            error.value = err as ApiError;
            console.error('Failed to fetch debt:', err);
        } finally {
            loading.value = false;
        }
    }

    async function createDebt(debtData: Partial<Debt>) {
        loading.value = true;
        error.value = null;

        try {
            const response = await debtsService.create(debtData);

            if (response.success && response.data) {
                // Optimistic update
                debts.value.unshift(response.data);
                return response.data;
            }
        } catch (err) {
            error.value = err as ApiError;
            console.error('Failed to create debt:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function updateDebt(id: string, debtData: Partial<Debt>) {
        loading.value = true;
        error.value = null;

        try {
            const response = await debtsService.update(id, debtData);

            if (response.success && response.data) {
                // Optimistic update
                const index = debts.value.findIndex(d => d.id === id);
                if (index !== -1) {
                    debts.value[index] = response.data;
                }
                return response.data;
            }
        } catch (err) {
            error.value = err as ApiError;
            console.error('Failed to update debt:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function deleteDebt(id: string) {
        loading.value = true;
        error.value = null;

        try {
            const response = await debtsService.delete(id);

            if (response.success) {
                // Optimistic update
                debts.value = debts.value.filter(d => d.id !== id);
            }
        } catch (err) {
            error.value = err as ApiError;
            console.error('Failed to delete debt:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function makePartialPayment(debtId: string, payment: Partial<PaymentEntry>) {
        loading.value = true;
        error.value = null;

        try {
            const response = await debtsService.makePartialPayment(debtId, payment);

            if (response.success && response.data) {
                // Update the debt in the list
                const index = debts.value.findIndex(d => d.id === debtId);
                if (index !== -1) {
                    debts.value[index] = response.data;
                }
                return response.data;
            }
        } catch (err) {
            error.value = err as ApiError;
            console.error('Failed to make partial payment:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function getPaymentHistory(debtId: string) {
        loading.value = true;
        error.value = null;

        try {
            const response = await debtsService.getPaymentHistory(debtId);

            if (response.success && response.data) {
                return response.data;
            }
            return [];
        } catch (err) {
            error.value = err as ApiError;
            console.error('Failed to fetch payment history:', err);
            return [];
        } finally {
            loading.value = false;
        }
    }

    function clearError() {
        error.value = null;
    }

    function resetStore() {
        debts.value = [];
        currentDebt.value = null;
        loading.value = false;
        error.value = null;
        totalPages.value = 1;
        currentPage.value = 1;
        perPage.value = 10;
        totalItems.value = 0;
    }

    return {
        // State
        debts,
        currentDebt,
        loading,
        error,
        totalPages,
        currentPage,
        perPage,
        totalItems,

        // Getters
        unpaidDebts,
        partiallyPaidDebts,
        paidDebts,
        totalDebtAmount,

        // Actions
        fetchDebts,
        fetchDebtById,
        createDebt,
        updateDebt,
        deleteDebt,
        makePartialPayment,
        getPaymentHistory,
        clearError,
        resetStore,
    };
});
