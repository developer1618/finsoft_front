import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Transaction, VarzobExpense, FilterParams, ApiError } from '../types';
import { expensesService } from '../services';

/**
 * Expenses Store
 * Manages income and expense transactions
 */
export const useExpensesStore = defineStore('expenses', () => {
    // State
    const transactions = ref<Transaction[]>([]);
    const varzobExpenses = ref<VarzobExpense[]>([]);
    const currentTransaction = ref<Transaction | null>(null);
    const loading = ref(false);
    const error = ref<ApiError | null>(null);
    const totalPages = ref(1);
    const currentPage = ref(1);
    const perPage = ref(10);
    const totalItems = ref(0);

    // Getters
    const incomeTransactions = computed(() =>
        transactions.value.filter(t => t.type === 'Доход')
    );

    const expenseTransactions = computed(() =>
        transactions.value.filter(t => t.type === 'Расход')
    );

    const totalIncome = computed(() =>
        incomeTransactions.value.reduce((sum, t) => sum + t.amount, 0)
    );

    const totalExpense = computed(() =>
        expenseTransactions.value.reduce((sum, t) => sum + t.amount, 0)
    );

    const netProfit = computed(() => totalIncome.value - totalExpense.value);

    const totalVarzobExpense = computed(() =>
        varzobExpenses.value.reduce((sum, e) => sum + e.amount, 0)
    );

    // Actions
    async function fetchTransactions(params?: FilterParams) {
        loading.value = true;
        error.value = null;

        try {
            const response = await expensesService.getAll(params);

            if (response.success && response.data) {
                transactions.value = response.data.data;
                totalPages.value = response.data.meta.lastPage;
                currentPage.value = response.data.meta.currentPage;
                perPage.value = response.data.meta.perPage;
                totalItems.value = response.data.meta.total;
            }
        } catch (err) {
            error.value = err as ApiError;
            console.error('Failed to fetch transactions:', err);
        } finally {
            loading.value = false;
        }
    }

    async function fetchVarzobExpenses(params?: FilterParams) {
        loading.value = true;
        error.value = null;

        try {
            const response = await expensesService.getVarzobExpenses(params);

            if (response.success && response.data) {
                varzobExpenses.value = response.data.data;
            }
        } catch (err) {
            error.value = err as ApiError;
            console.error('Failed to fetch Varzob expenses:', err);
        } finally {
            loading.value = false;
        }
    }

    async function fetchTransactionById(id: string) {
        loading.value = true;
        error.value = null;

        try {
            const response = await expensesService.getById(id);

            if (response.success && response.data) {
                currentTransaction.value = response.data;
                return response.data;
            }
        } catch (err) {
            error.value = err as ApiError;
            console.error('Failed to fetch transaction:', err);
        } finally {
            loading.value = false;
        }
    }

    async function createTransaction(transactionData: Partial<Transaction>) {
        loading.value = true;
        error.value = null;

        try {
            const response = await expensesService.create(transactionData);

            if (response.success && response.data) {
                transactions.value.unshift(response.data);
                return response.data;
            }
        } catch (err) {
            error.value = err as ApiError;
            console.error('Failed to create transaction:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function updateTransaction(id: string, transactionData: Partial<Transaction>) {
        loading.value = true;
        error.value = null;

        try {
            const response = await expensesService.update(id, transactionData);

            if (response.success && response.data) {
                const index = transactions.value.findIndex(t => t.id === id);
                if (index !== -1) {
                    transactions.value[index] = response.data;
                }
                return response.data;
            }
        } catch (err) {
            error.value = err as ApiError;
            console.error('Failed to update transaction:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function deleteTransaction(id: string) {
        loading.value = true;
        error.value = null;

        try {
            const response = await expensesService.delete(id);

            if (response.success) {
                transactions.value = transactions.value.filter(t => t.id !== id);
            }
        } catch (err) {
            error.value = err as ApiError;
            console.error('Failed to delete transaction:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function createVarzobExpense(expenseData: Partial<VarzobExpense>) {
        loading.value = true;
        error.value = null;

        try {
            const response = await expensesService.createVarzobExpense(expenseData);

            if (response.success && response.data) {
                varzobExpenses.value.unshift(response.data);
                return response.data;
            }
        } catch (err) {
            error.value = err as ApiError;
            console.error('Failed to create Varzob expense:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function updateVarzobExpense(id: string, expenseData: Partial<VarzobExpense>) {
        loading.value = true;
        error.value = null;

        try {
            const response = await expensesService.updateVarzobExpense(id, expenseData);

            if (response.success && response.data) {
                const index = varzobExpenses.value.findIndex(e => e.id === id);
                if (index !== -1) {
                    varzobExpenses.value[index] = response.data;
                }
                return response.data;
            }
        } catch (err) {
            error.value = err as ApiError;
            console.error('Failed to update Varzob expense:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function deleteVarzobExpense(id: string) {
        loading.value = true;
        error.value = null;

        try {
            const response = await expensesService.deleteVarzobExpense(id);

            if (response.success) {
                varzobExpenses.value = varzobExpenses.value.filter(e => e.id !== id);
            }
        } catch (err) {
            error.value = err as ApiError;
            console.error('Failed to delete Varzob expense:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    function clearError() {
        error.value = null;
    }

    function resetStore() {
        transactions.value = [];
        varzobExpenses.value = [];
        currentTransaction.value = null;
        loading.value = false;
        error.value = null;
        totalPages.value = 1;
        currentPage.value = 1;
        perPage.value = 10;
        totalItems.value = 0;
    }

    return {
        // State
        transactions,
        varzobExpenses,
        currentTransaction,
        loading,
        error,
        totalPages,
        currentPage,
        perPage,
        totalItems,

        // Getters
        incomeTransactions,
        expenseTransactions,
        totalIncome,
        totalExpense,
        netProfit,
        totalVarzobExpense,

        // Actions
        fetchTransactions,
        fetchVarzobExpenses,
        fetchTransactionById,
        createTransaction,
        updateTransaction,
        deleteTransaction,
        createVarzobExpense,
        updateVarzobExpense,
        deleteVarzobExpense,
        clearError,
        resetStore,
    };
});
