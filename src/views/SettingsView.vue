<template>
  <div class="space-y-10">
    <div class="border-b border-gray-900/10 pb-8">
      <h2 class="text-xl font-semibold text-gray-900">Настройки</h2>
      <p class="mt-2 text-sm text-gray-600">
        Включайте или скрывайте пункты меню админ-панели
      </p>
    </div>

    <section
      class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-6"
    >
      <div>
        <h3 class="text-base font-semibold text-gray-900">Пункты меню</h3>
        <p class="text-sm text-gray-500 mt-1">
          Переключите видимость нужных разделов. Настройка применяется как к
          боковому меню, так и к карточкам на главной.
        </p>
      </div>

      <ul class="divide-y divide-gray-100">
        <li
          v-for="menu in menuOptions"
          :key="menu.id"
          class="flex items-center justify-between py-4"
        >
          <div>
            <p class="text-sm font-semibold text-gray-900">
              {{ menu.name }}
            </p>
            <p class="text-xs text-gray-500">{{ menu.description }}</p>
          </div>
          <button
            type="button"
            role="switch"
            :aria-checked="isVisible(menu.id)"
            :class="[
              'relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition-colors',
              isVisible(menu.id) ? 'bg-green-500' : 'bg-gray-200',
            ]"
            @click="toggleVisibility(menu.id)"
          >
            <span class="sr-only">Переключить раздел {{ menu.name }}</span>
            <span
              :class="[
                'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform',
                isVisible(menu.id) ? 'translate-x-5' : 'translate-x-1',
              ]"
            ></span>
          </button>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

interface MenuOption {
  id: string;
  name: string;
  description: string;
}

const MENU_VISIBILITY_KEY = "finsoft_menu_visibility";
const MENU_VISIBILITY_EVENT = "menu-visibility-changed";

const menuOptions: MenuOption[] = [
  {
    id: "dashboard",
    name: "Главная",
    description: "Карточки и обзор основных метрик",
  },
  {
    id: "income-expense",
    name: "Доход / Расход",
    description: "Учёт финансовых операций",
  },
  {
    id: "varzob-expense",
    name: "Расход Варзоб",
    description: "Отдельный контроль затрат",
  },
  {
    id: "chinese-cargo",
    name: "Китайские грузы",
    description: "Статусы поставок",
  },
  {
    id: "capsule-workshop",
    name: "Цех капсулы",
    description: "Производственные показатели",
  },
  {
    id: "cup-workshop",
    name: "Цех стакана",
    description: "Статистика по второму цеху",
  },
  {
    id: "warehouse",
    name: "Склад цех",
    description: "Остатки на складе цеха",
  },
  {
    id: "factory-warehouse",
    name: "Склад завод",
    description: "Запасы на основном складе",
  },
  {
    id: "debts",
    name: "Долги",
    description: "Управление задолженностями клиентов",
  },
];

const defaultVisibility = menuOptions.reduce<Record<string, boolean>>(
  (acc, option) => ({ ...acc, [option.id]: true }),
  {}
);

const menuVisibility = ref<Record<string, boolean>>({ ...defaultVisibility });

const loadVisibility = () => {
  if (typeof window === "undefined") {
    return;
  }
  const stored = window.localStorage.getItem(MENU_VISIBILITY_KEY);
  if (!stored) {
    return;
  }
  try {
    const parsed = JSON.parse(stored) as Record<string, boolean>;
    menuVisibility.value = { ...defaultVisibility, ...parsed };
  } catch (error) {
    console.error("Не удалось прочитать настройки меню", error);
  }
};

const persistVisibility = () => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(
    MENU_VISIBILITY_KEY,
    JSON.stringify(menuVisibility.value)
  );
  window.dispatchEvent(
    new CustomEvent(MENU_VISIBILITY_EVENT, {
      detail: { ...menuVisibility.value },
    })
  );
};

const toggleVisibility = (id: string) => {
  menuVisibility.value[id] = !menuVisibility.value[id];
};

const isVisible = (id: string) => menuVisibility.value[id] ?? true;

onMounted(() => {
  loadVisibility();
});

watch(
  menuVisibility,
  () => {
    persistVisibility();
  },
  { deep: true }
);
</script>
