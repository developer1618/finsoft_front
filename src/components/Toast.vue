<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <TransitionGroup
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform translate-x-full opacity-0"
        enter-to-class="transform translate-x-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform translate-x-0 opacity-100"
        leave-to-class="transform translate-x-full opacity-0"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'flex items-center gap-3 p-4 rounded-lg shadow-lg',
            toastClasses[toast.type],
          ]"
        >
          <component :is="toastIcons[toast.type]" class="h-5 w-5 flex-shrink-0" />
          <p class="text-sm font-medium flex-1">{{ toast.message }}</p>
          <button
            @click="removeToast(toast.id)"
            class="flex-shrink-0 hover:opacity-75 transition-opacity"
          >
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUIStore } from '../stores/ui';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline';

const uiStore = useUIStore();
const { toasts } = storeToRefs(uiStore);
const { removeToast } = uiStore;

const toastClasses = {
  success: 'bg-green-50 text-green-800 border border-green-200',
  error: 'bg-red-50 text-red-800 border border-red-200',
  warning: 'bg-amber-50 text-amber-800 border border-amber-200',
  info: 'bg-blue-50 text-blue-800 border border-blue-200',
};

const toastIcons = {
  success: CheckCircleIcon,
  error: ExclamationCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
};
</script>
