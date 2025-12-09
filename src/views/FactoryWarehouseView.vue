<template>
  <DataTable
    title="Склад завод"
    description="Запасы центрального завода"
    :headers="['Дата', 'Название товара', 'Количество']"
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
import { useWarehouseStore } from "../stores/warehouse";
import { storeToRefs } from "pinia";
import { WarehouseLocation } from "../types";

const warehouseStore = useWarehouseStore();
const { factoryItems } = storeToRefs(warehouseStore);

const tableData = computed(() => {
  return factoryItems.value.map((item) => ({
    id: item.id,
    Дата: item.date,
    "Название товара": item.name,
    Количество: `${item.quantity} ${item.unit}`,
    original: item,
  }));
});

const isManagerView = computed(() => getCurrentRole() === "manager");

onMounted(() => {
  warehouseStore.fetchFactoryItems();
});

const parseQuantity = (value: string) => {
  if (!value) return { quantity: 0, unit: 'шт' };
  
  const trimmed = value.trim();
  const parts = trimmed.split(' ');
  const firstPart = parts[0] ?? '0';
  const quantity = parseFloat(firstPart.replace(',', '.')) || 0;
  const unit = parts[1] || 'шт';
  
  return { quantity, unit };
};

const handleAdd = async (data: Record<string, any>) => {
  try {
    const { quantity, unit } = parseQuantity(data['Количество'] || '');
    
    if (!data['Дата'] || !data['Название товара']) {
      alert('Заполните все обязательные поля');
      return;
    }

    await warehouseStore.createItem({
      date: data['Дата'],
      name: data['Название товара'],
      quantity,
      unit,
      location: WarehouseLocation.FACTORY
    });
  } catch (e: any) {
    alert(e?.message || "Ошибка при создании");
  }
};

const handleEdit = async (data: Record<string, any>) => {
  try {
    const { quantity, unit } = parseQuantity(data['Количество'] || '');
    const id = data.original?.id || data.id;
    
    if (!id) {
      alert('Ошибка: ID записи не найден');
      return;
    }
    
    if (!data['Дата'] || !data['Название товара']) {
      alert('Заполните все обязательные поля');
      return;
    }

    await warehouseStore.updateItem(id, {
      date: data['Дата'],
      name: data['Название товара'],
      quantity,
      unit,
      location: WarehouseLocation.FACTORY
    });
  } catch (e: any) {
    alert(e?.message || "Ошибка при обновлении");
  }
};

const handleDelete = async (row: Record<string, any>) => {
  try {
    await warehouseStore.deleteItem(row.original.id);
  } catch {
    alert("Ошибка при удалении");
  }
};
</script>
