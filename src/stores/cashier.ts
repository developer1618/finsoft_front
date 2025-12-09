import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { CashierOperation, ApiError, FilterParams } from '../types';
import { cashierService } from '../services';

export const useCashierStore = defineStore('cashier', () => {
    const operations = ref<CashierOperation[]>([]);
    const currentOperation = ref<CashierOperation | null>(null);
    const loading = ref(false);
    const error = ref<ApiError | null>(null);
    const totalPages = ref(1);
    const currentPage = ref(1);
    const perPage = ref(10);
    const totalItems = ref(0);

    const incomeOperations = computed(() =>
        operations.value.filter(op => op.type === 'Приход')
    );

    const expenseOperations = computed(() =>
        operations.value.filter(op => op.type === 'Расход')
    );

    const totalIncomeSom = computed(() =>
        incomeOperations.value
            .filter(op => op.currency === 'сом')
            .reduce((sum, op) => sum + op.amount, 0)
    );

    const totalIncomeDollar = computed(() =>
        incomeOperations.value
            .filter(op => op.currency === '$')
            .reduce((sum, op) => sum + op.amount, 0)
    );

    const totalExpenseSom = computed(() =>
        expenseOperations.value
            .filter(op => op.currency === 'сом')
            .reduce((sum, op) => sum + op.amount, 0)
    );

    const totalExpenseDollar = computed(() =>
        expenseOperations.value
            .filter(op => op.currency === '$')
            .reduce((sum, op) => sum + op.amount, 0)
    );

    const balanceSom = computed(() => totalIncomeSom.value - totalExpenseSom.value);
    const balanceDollar = computed(() => totalIncomeDollar.value - totalExpenseDollar.value);

    const todayOperationsCount = computed(() => {
        const today = new Date().toISOString().slice(0, 10);
        return operations.value.filter(op => op.date === today).length;
    });

    async function fetchOperations(params?: FilterParams) {
        loading.value = true;
        error.value = null;

        try {
            const response = await cashierService.getAll(params);

            if (response.success && response.data) {
                operations.value = response.data.data;
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

    async function fetchOperationById(id: string) {
        loading.value = true;
        error.value = null;

        try {
            const response = await cashierService.getById(id);

            if (response.success && response.data) {
                currentOperation.value = response.data;
                return response.data;
            }
        } catch (err) {
            error.value = err as ApiError;
        } finally {
            loading.value = false;
        }
    }

    async function createOperation(operationData: Partial<CashierOperation>) {
        loading.value = true;
        error.value = null;

        try {
            const response = await cashierService.create(operationData);

            if (response.success && response.data) {
                operations.value.unshift(response.data);
                return response.data;
            }
        } catch (err) {
            error.value = err as ApiError;
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function updateOperation(id: string, operationData: Partial<CashierOperation>) {
        loading.value = true;
        error.value = null;

        try {
            const response = await cashierService.update(id, operationData);

            if (response.success && response.data) {
                const index = operations.value.findIndex(op => op.id === id);
                if (index !== -1) {
                    operations.value[index] = response.data;
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

    async function deleteOperation(id: string) {
        loading.value = true;
        error.value = null;

        try {
            const response = await cashierService.delete(id);

            if (response.success) {
                operations.value = operations.value.filter(op => op.id !== id);
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
        operations.value = [];
        currentOperation.value = null;
        loading.value = false;
        error.value = null;
        totalPages.value = 1;
        currentPage.value = 1;
        perPage.value = 10;
        totalItems.value = 0;
    }

    return {
        operations,
        currentOperation,
        loading,
        error,
        totalPages,
        currentPage,
        perPage,
        totalItems,
        incomeOperations,
        expenseOperations,
        totalIncomeSom,
        totalIncomeDollar,
        totalExpenseSom,
        totalExpenseDollar,
        balanceSom,
        balanceDollar,
        todayOperationsCount,
        fetchOperations,
        fetchOperationById,
        createOperation,
        updateOperation,
        deleteOperation,
        clearError,
        resetStore,
    };
});
