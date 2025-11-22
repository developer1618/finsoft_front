<template>
  <DataTable
    title="Расходы Ваъзоб"
    description="Управление расходами Ваъзоб"
    :headers="['Дата', 'Описание', 'Тип', 'Сумма']"
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
    Дата: "2025-11-15",
    Описание: "Закупка полимерного сырья",
    Сумма: "12 500 TJS",
  },
  {
    Дата: "2025-11-14",
    Описание: "Оплата транспортировки до Варзоба",
    Сумма: "3 100 TJS",
  },
  {
    Дата: "2025-11-13",
    Описание: "Коммунальные услуги производства",
    Сумма: "2 450 TJS",
  },
  {
    Дата: "2025-11-12",
    Описание: "Закупка упаковочных материалов",
    Сумма: "5 300 TJS",
  },
  {
    Дата: "2025-11-11",
    Описание: "Зарплата смены Варзоб",
    Сумма: "18 000 TJS",
  },
  {
    Дата: "2025-11-10",
    Описание: "Техническое обслуживание оборудования",
    Сумма: "4 750 TJS",
  },
  {
    Дата: "2025-11-09",
    Описание: "Логистика расходных материалов",
    Сумма: "2 900 TJS",
  },
  {
    Дата: "2025-11-08",
    Описание: "Ремонт производственной линии",
    Сумма: "6 400 TJS",
  },
  {
    Дата: "2025-11-07",
    Описание: "Авансовый платеж поставщику",
    Сумма: "7 800 TJS",
  },
  {
    Дата: "2025-11-06",
    Описание: "Страхование партии сырья",
    Сумма: "1 950 TJS",
  },
]);

const handleAdd = () => {
  alert("Добавление новой записи расхода Варзоб пока недоступно");
};

const handleEdit = (row: Record<string, any>) => {
  alert(`Редактирование расхода Варзоб: ${JSON.stringify(row)}`);
};

const handleDelete = (row: Record<string, any>) => {
  const index = tableData.value.findIndex((item) => item === row);
  if (index > -1) {
    tableData.value.splice(index, 1);
  }
};
</script>
