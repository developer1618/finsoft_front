<script setup lang="ts">
import { onMounted } from 'vue';
import { useUIStore } from './stores/ui';
import Toast from './components/Toast.vue';

const uiStore = useUIStore();

onMounted(() => {
  // Load dark mode preference
  uiStore.loadDarkMode();
});
</script>

<template>
  <RouterView />
  <Toast />
</template>

<style scoped></style>
