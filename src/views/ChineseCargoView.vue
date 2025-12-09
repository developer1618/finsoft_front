<template>
  <DataTable
    title="Китайские грузы"
    description="Управление китайскими грузами"
    :headers="['Дата', 'Название груза', 'Количество', 'Статус']"
    :data="tableData"
    :is-manager-view="isManagerView"
    :status-options="statusOptions"
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
import { CargoStatus, Currency } from "../types";

const workshopsStore = useWorkshopsStore();
const { cargoItems } = storeToRefs(workshopsStore);

const statusOptions = ["Незаказано", "Заказано в Китае", "Принято в Душанбе"];

const tableData = computed(() => {
  return cargoItems.value.map((item) => ({
    id: item.id,
    Дата: item.date,
    "Название груза": item.name,
    "Количество": `${item.weight} ${item.unit}`,
    Статус: item.status,
    original: item,
  }));
});

const isManagerView = computed(() => getCurrentRole() === "manager");

onMounted(() => {
  workshopsStore.fetchCargo();
});

const parseWeight = (value: string) => {
  if (!value) return { weight: 0, unit: 'кг' };
  
  const trimmed = value.trim();
  const parts = trimmed.split(' ');
  const firstPart = parts[0] ?? '0';
  const weight = parseFloat(firstPart.replace(',', '.')) || 0;
  const unit = parts[1] || 'кг';
  
  return { weight, unit };
};

const handleAdd = async (data: Record<string, any>) => {
  try {
    const { weight, unit } = parseWeight(data['Количество'] || '');
    
    if (!data['Дата'] || !data['Название груза']) {
      alert('Заполните все обязательные поля');
      return;
    }

    await workshopsStore.createCargo({
      date: data['Дата'],
      name: data['Название груза'],
      weight,
      unit,
      status: (data['Статус'] as CargoStatus) || 'Заказано в Китае',
      trackingNumber: '',
      supplier: '',
      cost: 0,
      currency: Currency.USD,
      note: ''
    });
  } catch (e: any) {
    alert(e?.message || "Ошибка при создании");
  }
};

const handleEdit = async (data: Record<string, any>) => {
  try {
    const { weight, unit } = parseWeight(data['Количество'] || '');
    const id = data.original?.id || data.id;
    
    if (!id) {
      alert('Ошибка: ID записи не найден');
      return;
    }
    
    if (!data['Дата'] || !data['Название груза']) {
      alert('Заполните все обязательные поля');
      return;
    }

    await workshopsStore.updateCargo(id, {
      date: data['Дата'],
      name: data['Название груза'],
      weight,
      unit,
      status: (data['Статус'] as CargoStatus) || 'Заказано в Китае',
      trackingNumber: data.original?.trackingNumber || '',
      supplier: data.original?.supplier || '',
      cost: data.original?.cost || 0,
      currency: data.original?.currency || Currency.USD,
      note: data.original?.note || ''
    });
  } catch (e: any) {
    alert(e?.message || "Ошибка при обновлении");
  }
};

const handleDelete = async (row: Record<string, any>) => {
  try {
    await workshopsStore.deleteCargo(row.original.id);
  } catch {
    alert("Ошибка при удалении");
  }
};
</script>
