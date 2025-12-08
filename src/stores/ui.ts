import { defineStore } from 'pinia';
import { ref } from 'vue';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

export const useUIStore = defineStore('ui', () => {
    const toasts = ref<Toast[]>([]);
    const loading = ref(false);
    const sidebarOpen = ref(false);
    const darkMode = ref(false);

    function showToast(type: ToastType, message: string, duration = 3000) {
        const id = crypto.randomUUID();
        const toast: Toast = { id, type, message, duration };

        toasts.value.push(toast);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }

        return id;
    }

    function removeToast(id: string) {
        toasts.value = toasts.value.filter(t => t.id !== id);
    }

    function success(message: string, duration?: number) {
        return showToast('success', message, duration);
    }

    function error(message: string, duration?: number) {
        return showToast('error', message, duration);
    }

    function warning(message: string, duration?: number) {
        return showToast('warning', message, duration);
    }

    function info(message: string, duration?: number) {
        return showToast('info', message, duration);
    }

    function clearToasts() {
        toasts.value = [];
    }

    function setLoading(value: boolean) {
        loading.value = value;
    }

    function toggleSidebar() {
        sidebarOpen.value = !sidebarOpen.value;
    }

    function closeSidebar() {
        sidebarOpen.value = false;
    }

    function openSidebar() {
        sidebarOpen.value = true;
    }

    function toggleDarkMode() {
        darkMode.value = !darkMode.value;
        localStorage.setItem('finsoft_dark_mode', darkMode.value.toString());

        if (darkMode.value) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

    function loadDarkMode() {
        const saved = localStorage.getItem('finsoft_dark_mode');
        if (saved !== null) {
            darkMode.value = saved === 'true';
            if (darkMode.value) {
                document.documentElement.classList.add('dark');
            }
        }
    }

    return {
        toasts,
        loading,
        sidebarOpen,
        darkMode,
        showToast,
        removeToast,
        success,
        error,
        warning,
        info,
        clearToasts,
        setLoading,
        toggleSidebar,
        closeSidebar,
        openSidebar,
        toggleDarkMode,
        loadDarkMode,
    };
});
