<template>
  <DataTable
    title="Долги клиентов"
    description="Контроль задолженностей и статусов оплат"
    :headers="['Дата', 'Клиент', 'Товар', 'Сумма', 'Статус']"
    :data="tableData"
    :is-manager-view="isManagerView"
    :status-options="statusOptions"
    @add="handleAdd"
    @edit="handleEdit"
    @delete="handleDelete"
  />
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import DataTable from "../components/DataTable.vue";
import { getCurrentRole } from "../stores/auth";

const statusOptions = ["Неоплачено", "Частично оплачено", "Оплачено"];

const tableData = ref([
  {
    Дата: "2025-11-16",
    Клиент: "ООО 'ВостокТрейд'",
    Товар: "Линейка ПЭТ-тар",
    Сумма: "75 000 TJS",
    Статус: "Неоплачено",
  },
  {
    Дата: "2025-11-14",
    Клиент: "ИП Сайфутдинов",
    Товар: "Крышки Twist-off",
    Сумма: "42 500 TJS",
    Статус: "Частично оплачено",
  },
  {
    Дата: "2025-11-10",
    Клиент: "ООО 'Логистик Плюс'",
    Товар: "Фитинги для линий",
    Сумма: "18 300 TJS",
    Статус: "Частично оплачено",
  },
  {
    Дата: "2025-11-05",
    Клиент: "Завод 'АлюминТадж'",
    Товар: "Композитные бочки",
    Сумма: "120 000 TJS",
    Статус: "Неоплачено",
  },
  {
    Дата: "2025-10-28",
    Клиент: "ООО 'ГрандИмпорт'",
    Товар: "Партия капсул 0.5 л",
    Сумма: "53 400 TJS",
    Статус: "Оплачено",
  },
]);

const isManagerView = computed(() => getCurrentRole() === "manager");

const handleAdd = () => {
  alert("Добавление новой задолженности: здесь появится форма добавления");
};

const handleEdit = (row: Record<string, any>) => {
  alert(`Редактирование долга: ${JSON.stringify(row)}`);
};

const handleDelete = (row: Record<string, any>) => {
  const index = tableData.value.findIndex((item) => item === row);
  if (index > -1) {
    tableData.value.splice(index, 1);
  }
};
</script>
