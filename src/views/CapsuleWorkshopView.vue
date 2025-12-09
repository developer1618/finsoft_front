<template>
  <DataTable
    title="Цех капсулы"
    description="Управление операциями цеха капсулы"
    :headers="['Дата', 'Название продукта', 'Количество']"
    :data="tableData"
    :is-manager-view="isManagerView"
    :product-options="['23 грамм', '28 грамм', '32 грамм']"
    @add="handleAdd"
    @edit="handleEdit"
    @delete="handleDelete"
  />
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import DataTable from "../components/DataTable.vue";
import { getCurrentRole } from "../stores/auth";
import { useWorkshopsStore } from "../stores/workshops";
import { storeToRefs } from "pinia";

const workshopsStore = useWorkshopsStore();
const { capsuleItems } = storeToRefs(workshopsStore);

const tableData = computed(() => {
  return capsuleItems.value.map((item) => ({
    id: item.id,
    Дата: item.date,
    "Название продукта": item.productName,
    Количество: `${item.quantity} ${item.unit}`,
    original: item,
  }));
});

const isManagerView = computed(() => getCurrentRole() === "manager");

onMounted(() => {
  workshopsStore.fetchCapsuleItems();
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
    
    if (!data['Дата'] || !data['Название продукта']) {
      alert('Заполните все обязательные поля');
      return;
    }

    await workshopsStore.createWorkshopItem({
      date: data['Дата'],
      productName: data['Название продукта'],
      quantity,
      unit,
      workshopType: 'capsule',
      shift: 'day',
      operator: '',
      note: ''
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
    
    if (!data['Дата'] || !data['Название продукта']) {
      alert('Заполните все обязательные поля');
      return;
    }

    await workshopsStore.updateWorkshopItem(id, {
      date: data['Дата'],
      productName: data['Название продукта'],
      quantity,
      unit,
      workshopType: 'capsule',
      shift: data.original?.shift || 'day',
      operator: data.original?.operator || '',
      note: data.original?.note || ''
    });
  } catch (e: any) {
    alert(e?.message || "Ошибка при обновлении");
  }
};

const handleDelete = async (row: Record<string, any>) => {
  try {
    await workshopsStore.deleteWorkshopItem(row.original.id);
  } catch {
    alert("Ошибка при удалении");
  }
};
</script>
