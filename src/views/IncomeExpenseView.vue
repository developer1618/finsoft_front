<template>
  <DataTable
    title="Доход / Расход"
    description="Управление доходами и расходами"
    :headers="['Дата', 'Описание', 'Тип', 'Сумма']"
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
import type { TransactionType, Currency } from "../types";

const expensesStore = useExpensesStore();
const { transactions } = storeToRefs(expensesStore);

const formatAmount = (value: number, currency: string): string =>
  `${value.toLocaleString("ru-RU")} ${currency}`;

const tableData = computed(() => {
  return transactions.value.map((t) => ({
    id: t.id,
    Дата: t.date,
    Описание: t.description,
    Тип: t.type,
    Сумма: formatAmount(t.amount, t.currency),
    original: t,
  }));
});

const isManagerView = computed(() => getCurrentRole() === "manager");

onMounted(() => {
  expensesStore.fetchTransactions();
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
    
    if (!data['Дата'] || !data['Описание'] || !data['Тип']) {
      alert('Заполните все обязательные поля');
      return;
    }

    await expensesStore.createTransaction({
      date: data['Дата'],
      description: data['Описание'],
      type: data['Тип'] as TransactionType,
      amount,
      currency,
      category: 'Разное'
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
    
    if (!data['Дата'] || !data['Описание'] || !data['Тип']) {
      alert('Заполните все обязательные поля');
      return;
    }

    await expensesStore.updateTransaction(id, {
      date: data['Дата'],
      description: data['Описание'],
      type: data['Тип'] as TransactionType,
      amount,
      currency,
      category: 'Разное'
    });
  } catch (e: any) {
    alert(e?.message || "Ошибка при обновлении");
  }
};

const handleDelete = async (row: Record<string, any>) => {
  try {
    await expensesStore.deleteTransaction(row.original.id);
  } catch {
    alert("Ошибка при удалении");
  }
};
</script>
