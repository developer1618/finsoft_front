<template>
  <DataTable
    title="Товары"
    description="Справочник товаров и продукции"
    :headers="['Название', 'Единица', 'Цена']"
    :data="tableData"
    :is-manager-view="isManagerView"
    @add="handleAdd"
    @edit="handleEdit"
    @delete="handleDelete"
  />
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import DataTable from "../components/DataTable.vue";
import { getCurrentRole } from "../stores/auth";
import { useProductsStore } from "../stores/products";
import { storeToRefs } from "pinia";

const productsStore = useProductsStore();
const { products } = storeToRefs(productsStore);

const formatNum = (n: number) => n.toLocaleString("ru-RU");

const tableData = computed(() => {
  return products.value.map((product) => ({
    id: product.id,
    Название: product.name,
    Единица: product.unit,
    Цена: formatNum(product.price),
    original: product,
  }));
});

const isManagerView = computed(() => getCurrentRole() === "manager");

const handleAdd = async (data: Record<string, any>) => {
  try {
    const price = parseFloat(String(data["Цена"]).replace(/\s/g, "").replace(",", ".")) || 0;

    if (!data["Название"]) {
      alert("Заполните все обязательные поля");
      return;
    }

    await productsStore.createProduct({
      name: data["Название"],
      unit: data["Единица"] || "шт",
      price,
    });
  } catch (e: any) {
    alert(e?.message || "Ошибка при создании");
  }
};

const handleEdit = async (data: Record<string, any>) => {
  try {
    const id = data.original?.id || data.id;
    const price = parseFloat(String(data["Цена"]).replace(/\s/g, "").replace(",", ".")) || 0;

    if (!id) {
      alert("Ошибка: ID записи не найден");
      return;
    }

    if (!data["Название"]) {
      alert("Заполните все обязательные поля");
      return;
    }

    await productsStore.updateProduct(id, {
      name: data["Название"],
      unit: data["Единица"] || "шт",
      price,
    });
  } catch (e: any) {
    alert(e?.message || "Ошибка при обновлении");
  }
};

const handleDelete = async (row: Record<string, any>) => {
  try {
    const id = row.original?.id || row.id;
    await productsStore.deleteProduct(id);
  } catch {
    alert("Ошибка при удалении");
  }
};

onMounted(() => {
  productsStore.fetchProducts();
});
</script>
