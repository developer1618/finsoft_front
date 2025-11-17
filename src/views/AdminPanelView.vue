<template>
  <div>
    <!-- Static sidebar for desktop -->
    <div
      class="hidden bg-gray-900 ring-1 ring-white/10 lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col"
    >
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div
        class="flex grow flex-col gap-y-5 overflow-y-auto bg-black/10 px-6 pb-4"
      >
        <div class="flex h-16 shrink-0 items-center justify-center">
          <h2 class="text-white text-2xl">FinSoft</h2>
        </div>
        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <li v-for="item in navigation" :key="item.name">
                  <RouterLink
                    :to="item.href"
                    :class="[
                      item.current
                        ? 'bg-white/5 text-white'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white',
                      'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                    ]"
                  >
                    <component
                      :is="item.icon"
                      class="size-6 shrink-0"
                      aria-hidden="true"
                    />
                    {{ item.name }}
                  </RouterLink>
                </li>
              </ul>
            </li>
            <li class="mt-auto">
              <RouterLink
                to="/admin/settings"
                :class="[
                  route.path === '/admin/settings'
                    ? 'bg-white/5 text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white',
                  'group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                ]"
              >
                <Cog6ToothIcon class="size-6 shrink-0" aria-hidden="true" />
                Настройки
              </RouterLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div class="lg:pl-72">
      <div
        class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-8"
      >
        <button
          type="button"
          class="-m-2.5 p-2.5 text-gray-700 hover:text-gray-900 lg:hidden"
          @click="sidebarOpen = true"
        >
          <span class="sr-only">Открыть боковую панель</span>
          <Bars3Icon class="size-6" aria-hidden="true" />
        </button>

        <!-- Separator -->
        <div class="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true"></div>

        <div
          class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 items-center justify-end"
        >
          <div class="flex items-center gap-x-4 lg:gap-x-6">
            <!-- Separator -->
            <div
              class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
              aria-hidden="true"
            ></div>

            <!-- Profile dropdown -->
            <Menu as="div" class="relative">
              <MenuButton class="relative flex items-center">
                <span class="absolute -inset-1.5"></span>
                <span class="sr-only">Открыть меню пользователя</span>
                <img
                  class="size-8 rounded-full bg-gray-50 outline -outline-offset-1 outline-black/5"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
                <span class="hidden lg:flex lg:items-center">
                  <span
                    class="ml-4 text-sm/6 font-semibold text-gray-900"
                    aria-hidden="true"
                    >Имя Фамилия</span
                  >
                  <ChevronDownIcon
                    class="ml-2 size-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </MenuButton>
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems
                  class="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg outline outline-gray-900/5"
                >
                  <MenuItem
                    v-for="item in userNavigation"
                    :key="item.name"
                    v-slot="{ active }"
                  >
                    <RouterLink
                      :to="item.href"
                      :class="[
                        active ? 'bg-gray-50 outline-hidden' : '',
                        'block px-3 py-1 text-sm/6 text-gray-900',
                      ]"
                      >{{ item.name }}</RouterLink
                    >
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>

      <main class="py-10">
        <div class="px-4 sm:px-6 lg:px-8">
          <div v-if="route.path === '/admin'" class="space-y-12">
            <div class="border-b border-gray-900/10 pb-12">
              <h2 class="text-base/7 font-semibold text-gray-900">
                Главная панель
              </h2>
              <p class="mt-1 text-sm/6 text-gray-600">
                Обзор ключевых показателей вашего бизнеса
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Доход / Расход блок -->
              <div
                @click="router.push('/admin/income-expense')"
                class="bg-linear-to-br from-green-50 to-green-100 rounded-lg shadow-md p-6 border-l-4 border-green-500 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600">
                      Доход / Расход
                    </p>
                    <p class="text-2xl font-bold text-green-600 mt-2">
                      $45,250 / $28,750
                    </p>
                    <p class="text-xs text-gray-500 mt-1">
                      Общие суммы за месяц
                    </p>
                  </div>
                  <div class="text-4xl">💵</div>
                </div>
              </div>

              <!-- Китайские грузы блок -->
              <div
                @click="router.push('/admin/chinese-cargo')"
                class="bg-linear-to-br from-orange-50 to-orange-100 rounded-lg shadow-md p-6 border-l-4 border-orange-500 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600">
                      Китайские грузы
                    </p>
                    <p class="text-2xl font-bold text-orange-600 mt-2">
                      1,248 кг
                    </p>
                    <p class="text-xs text-gray-500 mt-1">Всего поступило</p>
                  </div>
                  <div class="text-4xl">📦</div>
                </div>
              </div>

              <!-- Цех капсулы блок -->
              <div
                @click="router.push('/admin/capsule-workshop')"
                class="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-6 border-l-4 border-blue-500 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600">Цех капсулы</p>
                    <p class="text-2xl font-bold text-blue-600 mt-2">856 шт</p>
                    <p class="text-xs text-gray-500 mt-1">Произведено</p>
                  </div>
                  <div class="text-4xl">⚙️</div>
                </div>
              </div>

              <!-- Цех стакана блок -->
              <div
                @click="router.push('/admin/cup-workshop')"
                class="bg-linear-to-br from-purple-50 to-purple-100 rounded-lg shadow-md p-6 border-l-4 border-purple-500 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600">Цех стакана</p>
                    <p class="text-2xl font-bold text-purple-600 mt-2">
                      1,234 шт
                    </p>
                    <p class="text-xs text-gray-500 mt-1">Произведено</p>
                  </div>
                  <div class="text-4xl">🥤</div>
                </div>
              </div>
            </div>
          </div>
          <RouterView v-else />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import {
  Bars3Icon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
} from "@heroicons/vue/24/outline";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";

const route = useRoute();
const router = useRouter();

const navigationBase = [
  { name: "Главная", href: "/admin", icon: HomeIcon },
  {
    name: "Доход / Расход",
    href: "/admin/income-expense",
    icon: DocumentDuplicateIcon,
  },
  {
    name: "Китайские грузы",
    href: "/admin/chinese-cargo",
    icon: FolderIcon,
  },
  {
    name: "Цех капсулы",
    href: "/admin/capsule-workshop",
    icon: HomeIcon,
  },
  {
    name: "Цех стакана",
    href: "/admin/cup-workshop",
    icon: HomeIcon,
  },
];

const navigation = computed(() =>
  navigationBase.map((item) => ({
    ...item,
    current: route.path === item.href,
  }))
);

const userNavigation = [
  { name: "Ваш профиль", href: "/admin/profile" },
  { name: "Выйти", href: "/login" },
];

const sidebarOpen = ref(false);
</script>
