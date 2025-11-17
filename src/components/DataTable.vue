<template>
  <div class="space-y-6">
    <!-- Заголовок и кнопка -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-base/7 font-semibold text-gray-900">{{ title }}</h2>
        <p class="mt-1 text-sm/6 text-gray-600">{{ description }}</p>
      </div>
      <button
        @click="openAddModal"
        class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        + Добавить
      </button>
    </div>

    <!-- Фильтр и поиск -->
    <div class="flex gap-4 flex-wrap">
      <div class="flex-1 min-w-64">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Поиск..."
          class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
        />
      </div>
      <select
        v-model="selectedFilter"
        class="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
      >
        <option value="">Все статусы</option>
        <option value="active">Активные</option>
        <option value="inactive">Неактивные</option>
        <option value="pending">В ожидании</option>
      </select>
      <button
        @click="resetFilters"
        class="inline-flex items-center rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Сброс
      </button>
    </div>

    <!-- Таблица -->
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
              class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
            >
              Действия
            </th>
          </tr>
          <!-- Строка фильтров -->
          <tr class="bg-gray-100 border-t border-gray-200">
            <td
              v-for="header in headers"
              :key="`filter-${header}`"
              class="px-6 py-2"
            >
              <input
                v-if="header === 'Дата'"
                v-model="columnFilters[header]"
                type="date"
                class="w-full rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
              <input
                v-else
                v-model="columnFilters[header]"
                type="text"
                :placeholder="`Поиск ${header.toLowerCase()}...`"
                class="w-full rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </td>
            <td class="px-6 py-2">
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
            <td class="px-6 py-4 text-sm">
              <div class="flex gap-3">
                <button
                  @click="openEditModal(row)"
                  class="text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 p-1.5 rounded transition-colors"
                  title="Редактировать"
                >
                  <PencilIcon class="w-4 h-4" />
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

    <!-- Пагинация -->
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

  <!-- AddModal -->
  <AddModal
    :isOpen="showAddModal"
    title="Добавить новую запись"
    :headers="headers"
    @close="showAddModal = false"
    @confirm="handleAddConfirm"
  />

  <!-- EditModal -->
  <EditModal
    :isOpen="showEditModal"
    title="Редактировать запись"
    :headers="headers"
    :initialData="selectedRow || {}"
    @close="showEditModal = false"
    @confirm="handleEditConfirm"
  />

  <!-- DeleteModal -->
  <DeleteModal
    :isOpen="showDeleteModal"
    title="Удалить запись"
    @close="showDeleteModal = false"
    @confirm="handleDeleteConfirm"
  />
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { PencilIcon, TrashIcon } from "@heroicons/vue/24/outline";
import AddModal from "./AddModal.vue";
import EditModal from "./EditModal.vue";
import DeleteModal from "./DeleteModal.vue";

interface Props {
  title: string;
  description: string;
  headers: string[];
  data: Record<string, any>[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  add: [data: Record<string, any>];
  edit: [data: Record<string, any>];
  delete: [data: Record<string, any>];
}>();

const currentPage = ref(1);
const itemsPerPage = ref(10);
const searchQuery = ref("");
const selectedFilter = ref("");
const columnFilters = ref<Record<string, string>>({});

// Инициализация фильтров для каждого столбца
props.headers.forEach((header) => {
  columnFilters.value[header] = "";
});

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
        // Для дат сравниваем в формате YYYY-MM-DD
        result = result.filter((row) => {
          const rowDate = String(row[header]);
          return rowDate === filterValue;
        });
      } else {
        // Для остальных полей используем поиск по содержимому
        const query = filterValue.toLowerCase();
        result = result.filter((row) =>
          String(row[header]).toLowerCase().includes(query)
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
  showAddModal.value = true;
};

const openEditModal = (row: Record<string, any>) => {
  selectedRow.value = row;
  showEditModal.value = true;
};

const openDeleteModal = (row: Record<string, any>) => {
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

const resetFilters = () => {
  searchQuery.value = "";
  selectedFilter.value = "";
  resetColumnFilters();
  currentPage.value = 1;
};

const resetColumnFilters = () => {
  Object.keys(columnFilters.value).forEach((key) => {
    columnFilters.value[key] = "";
  });
};

const formatDate = (date: string): string => {
  if (!date) return "";
  // Преобразуем дату из формата YYYY-MM-DD в DD.MM.YYYY
  const [year, month, day] = date.split("-");
  return `${day}.${month}.${year}`;
};

const getStatusClass = (status: string) => {
  const baseClass =
    "inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ";
  switch (status) {
    case "active":
    case "Активные":
      return baseClass + "bg-green-100 text-green-800";
    case "inactive":
    case "Неактивные":
      return baseClass + "bg-red-100 text-red-800";
    case "pending":
    case "В ожидании":
      return baseClass + "bg-yellow-100 text-yellow-800";
    default:
      return baseClass + "bg-gray-100 text-gray-800";
  }
};
</script>
