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
import { ref, computed } from "vue";
import DataTable from "../components/DataTable.vue";
import { getCurrentRole } from "../stores/auth";

const tableData = ref([
  {
    Дата: "2025-11-20",
    "Название товара": "Полимерное сырье P-45",
    Количество: "12 тонн",
  },
  {
    Дата: "2025-11-19",
    "Название товара": "Стальной штамп",
    Количество: "3 шт",
  },
  {
    Дата: "2025-11-18",
    "Название товара": "Пищевые добавки",
    Количество: "980 кг",
  },
  {
    Дата: "2025-11-17",
    "Название товара": "Гофрокороба",
    Количество: "4 500 шт",
  },
  {
    Дата: "2025-11-16",
    "Название товара": "Тара для жидкостей",
    Количество: "1 200 шт",
  },
  {
    Дата: "2025-11-15",
    "Название товара": "Ремкомплект пресса",
    Количество: "5 комплектов",
  },
  {
    Дата: "2025-11-14",
    "Название товара": "Пищевой спирт",
    Количество: "2 000 л",
  },
  {
    Дата: "2025-11-13",
    "Название товара": "Контейнеры евро-паллет",
    Количество: "260 шт",
  },
  {
    Дата: "2025-11-12",
    "Название товара": "Этикетки экспорт",
    Количество: "35 000 шт",
  },
  {
    Дата: "2025-11-11",
    "Название товара": "Алюминиевые крышки",
    Количество: "18 000 шт",
  },
]);

const isManagerView = computed(() => getCurrentRole() === "manager");

const handleAdd = () => {
  alert(
    "Функция добавления: откроется форма для добавления нового товара на склад завода"
  );
};

const handleEdit = (row: Record<string, any>) => {
  alert(`Редактирование: ${JSON.stringify(row)}`);
};

const handleDelete = (row: Record<string, any>) => {
  const index = tableData.value.findIndex((item) => item === row);
  if (index > -1) {
    tableData.value.splice(index, 1);
  }
};
</script>
