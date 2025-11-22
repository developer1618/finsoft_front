<template>
  <div class="space-y-6">
    <div
      class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h2 class="text-base/7 font-semibold text-gray-900">{{ title }}</h2>
        <p class="mt-1 text-sm/6 text-gray-600">{{ description }}</p>
      </div>
      <div class="flex items-center gap-3">
        <div v-if="isManagerView" class="flex items-center gap-2">
          <select
            v-model="periodFilter"
            class="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
          >
            <option value="all">Все данные</option>
            <option value="today">За сегодня</option>
            <option value="week">Эта неделя</option>
            <option value="month">Этот месяц</option>
            <option value="year">Этот год</option>
            <option value="yearSelect">Выбрать год</option>
          </select>
          <select
            v-if="periodFilter === 'yearSelect'"
            v-model="selectedYear"
            class="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
          >
            <option v-for="year in availableYears" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
          <div
            class="bg-linear-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg px-4 py-2.5 flex items-center gap-2 shadow-sm"
          >
            <div class="flex flex-col gap-0.5">
              <span class="font-bold text-indigo-900 text-base"> Итог: {{
                filteredSummary
              }}</span>
            </div>
          </div>
        </div>
        <button
          v-else
          @click="exportToWord"
          class="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Экспорт в Word
        </button>
        <button
          v-if="canManage"
          @click="openAddModal"
          class="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
        >
          + Добавить
        </button>
      </div>
    </div>

    <div class="overflow-x-auto rounded-lg border border-gray-200">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="header in headers"
              :key="header"
              class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
            >
              {{ header }}
            </th>
            <th
              v-if="canManage"
              class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
            >
              Действия
            </th>
          </tr>
          <tr class="bg-gray-100 border-t border-gray-200">
            <td
              v-for="header in headers"
              :key="`filter-${header}`"
              class="px-6 py-2"
            >
              <FlatPickr
                v-if="header === 'Дата'"
                :model-value="columnFilters[header] || ''"
                @update:model-value="(value) => updateDateFilter(header, value)"
                @input="handleDateFilterMask"
                :config="dateFilterConfig"
                placeholder="дд.мм.гггг"
                class="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
              <select
                v-else-if="header === 'Статус'"
                v-model="columnFilters[header]"
                class="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              >
                <option value="">Все</option>
                <option value="Заказано в Китае">Заказано в Китае</option>
                <option value="Принято в Душанбе">Принято в Душанбе</option>
              </select>
              <select
                v-else-if="header === 'Тип'"
                v-model="columnFilters[header]"
                class="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              >
                <option value="">Все</option>
                <option value="Доход">Доход</option>
                <option value="Расход">Расход</option>
              </select>
              <select
                v-else-if="header === 'Расположение'"
                v-model="columnFilters[header]"
                class="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              >
                <option value="">Все</option>
                <option
                  v-for="option in warehouseLocations"
                  :key="option"
                  :value="option"
                >
                  {{ option }}
                </option>
              </select>
              <input
                v-else
                v-model="columnFilters[header]"
                type="text"
                :placeholder="`Поиск ${header.toLowerCase()}...`"
                class="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </td>
            <td v-if="canManage" class="px-6 py-2">
              <button
                @click="resetColumnFilters"
                class="text-xs text-gray-600 hover:text-gray-900 underline"
              >
                Очистить
              </button>
            </td>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr
            v-for="(row, idx) in paginatedData"
            :key="idx"
            class="hover:bg-gray-50"
          >
            <td
              v-for="(header, headerIdx) in headers"
              :key="headerIdx"
              class="px-6 py-4 text-sm text-gray-900"
            >
              <span
                v-if="header === 'Статус'"
                :class="getStatusClass(row[header])"
              >
                {{ row[header] }}
              </span>
              <span v-else-if="header === 'Дата'">
                {{ formatDate(row[header]) }}
              </span>
              <span v-else>{{ row[header] }}</span>
            </td>
            <td v-if="canManage" class="px-6 py-4 text-sm">
              <div class="flex gap-3">
                <button
                  @click="openEditModal(row)"
                  class="text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 p-1.5 rounded transition-colors"
                  title="Редактировать"
                >
                  <PencilSquareIcon class="w-4 h-4" />
                </button>
                <button
                  @click="openDeleteModal(row)"
                  class="text-red-600 hover:text-red-900 hover:bg-red-50 p-1.5 rounded transition-colors"
                  title="Удалить"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex items-center justify-between">
      <div class="text-sm text-gray-600">
        Показано {{ (currentPage - 1) * itemsPerPage + 1 }} -
        {{ Math.min(currentPage * itemsPerPage, filteredData.length) }} из
        {{ filteredData.length }}
      </div>
      <div class="flex gap-2 items-center">
        <button
          @click="previousPage"
          :disabled="currentPage === 1"
          class="inline-flex items-center justify-center rounded-md border border-gray-300 px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Предыдущая страница"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div class="flex items-center gap-1">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="goToPage(page)"
            :class="[
              'px-3 py-2 text-sm font-medium rounded-md',
              page === currentPage
                ? 'bg-indigo-600 text-white'
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50',
            ]"
          >
            {{ page }}
          </button>
        </div>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="inline-flex items-center justify-center rounded-md border border-gray-300 px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Следующая страница"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>

  <template v-if="canManage">
    <AddModal
      :isOpen="showAddModal"
      title="Добавить новую запись"
      :headers="headers"
      @close="showAddModal = false"
      @confirm="handleAddConfirm"
    />

    <EditModal
      :isOpen="showEditModal"
      title="Редактировать запись"
      :headers="headers"
      :initialData="selectedRow || {}"
      @close="showEditModal = false"
      @confirm="handleEditConfirm"
    />

    <DeleteModal
      :isOpen="showDeleteModal"
      title="Удалить запись"
      @close="showDeleteModal = false"
      @confirm="handleDeleteConfirm"
    />
  </template>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { PencilSquareIcon, TrashIcon } from "@heroicons/vue/24/outline";
import Flatpickr from "vue-flatpickr-component";
import { Russian } from "flatpickr/dist/l10n/ru.js";
import {
  applyDateMask,
  displayToIsoDate,
  isoToDisplayDate,
  normalizeToIsoDate,
} from "../utils/dateFormat";
import AddModal from "./AddModal.vue";
import EditModal from "./EditModal.vue";
import DeleteModal from "./DeleteModal.vue";
import { useAuth } from "../stores/auth";

interface Props {
  title: string;
  description: string;
  headers: string[];
  data: Record<string, any>[];
  canManage?: boolean;
  isManagerView?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  canManage: true,
});

const { isAdmin } = useAuth();
const canManage = computed(() => Boolean(props.canManage && isAdmin.value));

const emit = defineEmits<{
  add: [data: Record<string, any>];
  edit: [data: Record<string, any>];
  delete: [data: Record<string, any>];
}>();

const FlatPickr = Flatpickr;
const today = new Date();
const dateFilterConfig = {
  dateFormat: "d.m.Y",
  locale: Russian,
  allowInput: true,
  maxDate: today,
};

const currentPage = ref(1);
const itemsPerPage = ref(10);
const searchQuery = ref("");
const selectedFilter = ref("");
const columnFilters = ref<Record<string, string>>({});
const warehouseLocations = ["Склад Капсула", "Склад Стакан"];

// Инициализация фильтров для каждого столбца
props.headers.forEach((header) => {
  columnFilters.value[header] = "";
});

// Фильтр периодов для менеджера
const periodFilter = ref("all");
const customStartDate = ref("");
const customEndDate = ref("");

// Годы для выбора (от 2020 до текущего года)
const currentYear = new Date().getFullYear();
const availableYears = computed(() => {
  const years = [];
  for (let year = 2020; year <= currentYear; year++) {
    years.push(year);
  }
  return years.reverse(); // в обратном порядке (от новых к старым)
});
const selectedYear = ref(currentYear);

const getDateRange = () => {
  const now = new Date();
  let startDate = new Date(now.getFullYear(), 0, 1); // начало года
  let endDate = new Date(now.getFullYear(), 11, 31); // конец года

  if (periodFilter.value === "today") {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    startDate.setHours(0, 0, 0, 0);
    endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    endDate.setHours(23, 59, 59, 999);
  } else if (periodFilter.value === "week") {
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    startDate = new Date(now.setDate(diff));
    startDate.setHours(0, 0, 0, 0);
    endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
  } else if (periodFilter.value === "month") {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  } else if (periodFilter.value === "year") {
    startDate = new Date(now.getFullYear(), 0, 1);
    endDate = new Date(now.getFullYear(), 11, 31);
  } else if (periodFilter.value === "yearSelect") {
    const year = selectedYear.value;
    startDate = new Date(year, 0, 1);
    endDate = new Date(year, 11, 31);
  } else if (periodFilter.value === "custom") {
    if (customStartDate.value) {
      startDate = new Date(customStartDate.value);
    }
    if (customEndDate.value) {
      endDate = new Date(customEndDate.value);
    }
  }

  return { startDate, endDate };
};

const filteredSummary = computed(() => {
  if (!props.isManagerView) {
    return "";
  }

  const { startDate, endDate } = getDateRange();

  // Объект для хранения сумм по единицам измерения
  const totals: Record<string, number> = {};
  const unitOrder: string[] = []; // для сохранения порядка появления единиц

  filteredData.value.forEach((row) => {
    const dateStr = row["Дата"];
    if (dateStr) {
      const rowDate = new Date(dateStr);
      if (rowDate >= startDate && rowDate <= endDate) {
        const summaStr = row["Сумма"] || row["Количество"];
        if (summaStr) {
          // Извлекаем число и единицу измерения
          const fullStr = summaStr.toString();
          const numMatch = fullStr.match(/[\d,.-]+/);
          const num = numMatch ? parseFloat(numMatch[0].replace(",", ".")) : 0;

          // Извлекаем единицу измерения (всё после цифр)
          const unitMatch = fullStr.match(/[^\d,.\-\s]+/);
          const unit = unitMatch ? unitMatch[0].trim() : "";

          if (!isNaN(num)) {
            if (!totals[unit]) {
              totals[unit] = 0;
              unitOrder.push(unit);
            }
            totals[unit] += num;
          }
        }
      }
    }
  });

  // Форматируем вывод: показываем все единицы последовательно
  const result = unitOrder
    .map((unit) => {
      const total = totals[unit] ?? 0;
      const formatted = total.toLocaleString("ru-RU");
      return unit ? `${formatted} ${unit}` : formatted;
    })
    .join(", ");

  return result || "0";
});

const formatDatePickerValue = (
  value: string | Date | (string | Date)[] | undefined
): string => {
  if (Array.isArray(value)) {
    return formatDatePickerValue(value[0]);
  }

  if (!value) {
    return "";
  }

  if (value instanceof Date) {
    const day = `${value.getDate()}`.padStart(2, "0");
    const month = `${value.getMonth() + 1}`.padStart(2, "0");
    const year = value.getFullYear();
    return `${day}.${month}.${year}`;
  }

  return value;
};

const updateDateFilter = (
  header: string,
  value: string | Date | (string | Date)[] | undefined
) => {
  columnFilters.value[header] = formatDatePickerValue(value);
  currentPage.value = 1;
};

const handleDateFilterMask = (event: InputEvent, header: string) => {
  const target = event.target as HTMLInputElement | null;
  if (!target) {
    return;
  }

  const maskedValue = applyDateMask(target.value);
  target.value = maskedValue;
  columnFilters.value[header] = maskedValue;
};

// Модальные окна
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const selectedRow = ref<Record<string, any> | null>(null);

const filteredData = computed(() => {
  let result = props.data;

  // Поиск по всем полям
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(query)
      )
    );
  }

  // Фильтры по столбцам
  Object.entries(columnFilters.value).forEach(([header, filterValue]) => {
    if (filterValue) {
      if (header === "Дата") {
        const targetIso = displayToIsoDate(filterValue);
        if (targetIso) {
          result = result.filter((row) => {
            const rowDate = normalizeToIsoDate(String(row[header] ?? ""));
            return rowDate === targetIso;
          });
        }
      } else {
        const query = filterValue.toLowerCase();
        result = result.filter((row) =>
          String(row[header] ?? "")
            .toLowerCase()
            .includes(query)
        );
      }
    }
  });

  // Фильтр по статусу
  if (selectedFilter.value) {
    result = result.filter((row) => row["Статус"] === selectedFilter.value);
  }

  return result;
});

const totalPages = computed(() =>
  Math.ceil(filteredData.value.length / itemsPerPage.value)
);

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredData.value.slice(start, end);
});

// Функции для модальных окон
const openAddModal = () => {
  if (!canManage.value) {
    return;
  }
  showAddModal.value = true;
};

const openEditModal = (row: Record<string, any>) => {
  if (!canManage.value) {
    return;
  }
  selectedRow.value = row;
  showEditModal.value = true;
};

const openDeleteModal = (row: Record<string, any>) => {
  if (!canManage.value) {
    return;
  }
  selectedRow.value = row;
  showDeleteModal.value = true;
};

const handleAddConfirm = (formData: Record<string, any>) => {
  emit("add", formData);
  showAddModal.value = false;
};

const handleEditConfirm = (formData: Record<string, any>) => {
  emit("edit", formData);
  showEditModal.value = false;
};

const handleDeleteConfirm = () => {
  if (selectedRow.value) {
    emit("delete", selectedRow.value);
  }
  showDeleteModal.value = false;
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const goToPage = (page: number) => {
  currentPage.value = page;
};

const resetColumnFilters = () => {
  Object.keys(columnFilters.value).forEach((key) => {
    columnFilters.value[key] = "";
  });
};

const exportToWord = () => {
  const headers = props.headers;
  const rows = filteredData.value;

  const tableHeader = headers
    .map(
      (header) =>
        `<th style="border:1px solid #d1d5db;padding:6px;text-align:left;">${header}</th>`
    )
    .join("");

  const tableBody = rows
    .map((row) => {
      const cells = headers
        .map((header) => {
          const value = row[header] ?? "";
          return `<td style="border:1px solid #e5e7eb;padding:6px;">${String(
            value
          )
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")}</td>`;
        })
        .join("");
      return `<tr>${cells}</tr>`;
    })
    .join("");

  const htmlContent = `<!DOCTYPE html><html><head><meta charset="UTF-8" /><style>
      table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; }
      th { background-color: #1d4ed8; color: #ffffff; }
    </style></head><body>
    <h2>${props.title}</h2>
    <table><thead><tr>${tableHeader}</tr></thead><tbody>${tableBody}</tbody></table>
  </body></html>`;

  const blob = new Blob([htmlContent], {
    type: "application/msword",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const fileSafeTitle = props.title.replace(/\s+/g, "_");
  link.href = url;
  link.download = `${fileSafeTitle || "table"}_${
    new Date().toISOString().split("T")[0]
  }.doc`;
  link.click();
  URL.revokeObjectURL(url);
};

const formatDate = (date: string): string => {
  return isoToDisplayDate(date);
};

const getStatusClass = (status: string) => {
  const baseClass =
    "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ";
  switch (status) {
    case "Принято в Душанбе":
      return baseClass + "bg-green-100 text-green-800";
    case "Заказано в Китае":
      return baseClass + "bg-yellow-100 text-yellow-800";
    default:
      return baseClass + "bg-gray-100 text-gray-800";
  }
};
</script>
