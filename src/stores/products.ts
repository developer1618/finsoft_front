import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../services/api';

export interface Product {
    id: string;
    name: string;
    unit: string;
    price: number;
    createdAt?: string;
    updatedAt?: string;
}

export type ProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

export const useProductsStore = defineStore('products', () => {
    const products = ref<Product[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const totalProducts = computed(() => products.value.length);

    const fetchProducts = async () => {
        loading.value = true;
        error.value = null;
        try {
            const response = await api.get<{ data: Product[] }>('/products');
            if (response.success && response.data) {
                products.value = (response.data as any).data || response.data;
            }
        } catch (e: any) {
            error.value = e?.message || 'Ошибка загрузки товаров';
        } finally {
            loading.value = false;
        }
    };

    const createProduct = async (input: ProductInput) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await api.post<Product>('/products', input);
            if (response.success && response.data) {
                products.value.push(response.data);
            }
            return response.data;
        } catch (e: any) {
            error.value = e?.message || 'Ошибка создания товара';
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const updateProduct = async (id: string, input: Partial<ProductInput>) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await api.put<Product>(`/products/${id}`, input);
            if (response.success && response.data) {
                const index = products.value.findIndex((p) => p.id === id);
                if (index !== -1) {
                    products.value[index] = response.data;
                }
            }
            return response.data;
        } catch (e: any) {
            error.value = e?.message || 'Ошибка обновления товара';
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const deleteProduct = async (id: string) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await api.delete(`/products/${id}`);
            if (response.success) {
                products.value = products.value.filter((p) => p.id !== id);
            }
        } catch (e: any) {
            error.value = e?.message || 'Ошибка удаления товара';
            throw e;
        } finally {
            loading.value = false;
        }
    };

    return {
        products,
        loading,
        error,
        totalProducts,
        fetchProducts,
        createProduct,
        updateProduct,
        deleteProduct,
    };
});
