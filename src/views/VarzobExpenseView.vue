<template>
  <DataTable
    title="Расход Варзоб"
    description="Управление расходами Варзоб"
    :headers="['Дата', 'Описание', 'Сумма']"
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
import { useExpensesStore } from "../stores/expenses";
import { storeToRefs } from "pinia";
import type { Currency } from "../types";

const expensesStore = useExpensesStore();
const { varzobExpenses } = storeToRefs(expensesStore);

const formatAmount = (value: number, currency: string): string =>
  `${value.toLocaleString("ru-RU")} ${currency}`;

const tableData = computed(() => {
  return varzobExpenses.value.map((e) => ({
    id: e.id,
    Дата: e.date,
    Описание: e.description,
    Сумма: formatAmount(e.amount, e.currency),
    original: e,
  }));
});

const isManagerView = computed(() => getCurrentRole() === "manager");

onMounted(() => {
  expensesStore.fetchVarzobExpenses();
});

const parseAmount = (value: string) => {
  if (!value) return { amount: 0, currency: 'сом' as Currency };
  
  const trimmed = value.trim();
  const isDollar = trimmed.startsWith('$');
  const currency = isDollar ? '$' : 'сом';
  const amountStr = trimmed.replace(/[^\d.,]/g, '').replace(',', '.');
  
  return {
    amount: parseFloat(amountStr) || 0,
    currency: currency as Currency
  };
};

const handleAdd = async (data: Record<string, any>) => {
  try {
    const { amount, currency } = parseAmount(data['Сумма'] || '');
    
    if (!data['Дата'] || !data['Описание']) {
      alert('Заполните все обязательные поля');
      return;
    }

    await expensesStore.createVarzobExpense({
      date: data['Дата'],
      description: data['Описание'],
      amount,
      currency,
      category: 'Варзоб'
    });
  } catch (e: any) {
    alert(e?.message || "Ошибка при создании");
  }
};

const handleEdit = async (data: Record<string, any>) => {
  try {
    const { amount, currency } = parseAmount(data['Сумма'] || '');
    const id = data.original?.id || data.id;
    
    if (!id) {
      alert('Ошибка: ID записи не найден');
      return;
    }
    
    if (!data['Дата'] || !data['Описание']) {
      alert('Заполните все обязательные поля');
      return;
    }

    await expensesStore.updateVarzobExpense(id, {
      date: data['Дата'],
      description: data['Описание'],
      amount,
      currency,
      category: 'Варзоб'
    });
  } catch (e: any) {
    alert(e?.message || "Ошибка при обновлении");
  }
};

const handleDelete = async (row: Record<string, any>) => {
  try {
    await expensesStore.deleteVarzobExpense(row.original.id);
  } catch {
    alert("Ошибка при удалении");
  }
};
</script>
