import { useUIStore } from '../stores/ui';
import type { ToastType } from '../stores/ui';

/**
 * Composable for showing toast notifications
 */
export function useNotification() {
    const uiStore = useUIStore();

    const notify = (type: ToastType, message: string, duration?: number) => {
        return uiStore.showToast(type, message, duration);
    };

    const success = (message: string, duration?: number) => {
        return uiStore.success(message, duration);
    };

    const error = (message: string, duration?: number) => {
        return uiStore.error(message, duration);
    };

    const warning = (message: string, duration?: number) => {
        return uiStore.warning(message, duration);
    };

    const info = (message: string, duration?: number) => {
        return uiStore.info(message, duration);
    };

    return {
        notify,
        success,
        error,
        warning,
        info,
    };
}
