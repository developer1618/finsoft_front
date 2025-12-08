import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import type { ApiResponse, ApiError } from '../types/api';

const resolveApiBaseUrl = (): string => {
    const envUrl = import.meta.env.VITE_API_BASE_URL;
    if (envUrl) {
        return envUrl;
    }

    if (typeof window !== 'undefined') {
        return `${window.location.origin}/api`;
    }

    return 'http://localhost:8000/api';
};

const API_BASE_URL = resolveApiBaseUrl();
const API_TIMEOUT = 30000;
const STORAGE_KEY = 'finsoft_auth_user';

const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: false,
});

apiClient.interceptors.request.use(
    (config) => {
        const authData = localStorage.getItem(STORAGE_KEY);
        if (authData) {
            try {
                const user = JSON.parse(authData);
                if (user.token) {
                    config.headers.Authorization = `Bearer ${user.token}`;
                }
            } catch {
                localStorage.removeItem(STORAGE_KEY);
            }
        }

        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (csrfToken) {
            config.headers['X-CSRF-TOKEN'] = csrfToken;
        }

        const xsrfToken = document.querySelector('meta[name="xsrf-token"]')?.getAttribute('content');
        if (xsrfToken) {
            config.headers['X-XSRF-TOKEN'] = xsrfToken;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const authData = localStorage.getItem(STORAGE_KEY);
                if (authData) {
                    const user = JSON.parse(authData);
                    if (user.refreshToken) {
                        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                            refreshToken: user.refreshToken,
                        });

                        const { token } = response.data;
                        user.token = token;
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));

                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        return apiClient(originalRequest);
                    }
                }
            } catch {
                localStorage.removeItem(STORAGE_KEY);
                window.location.href = '/login';
                return Promise.reject(error);
            }

            localStorage.removeItem(STORAGE_KEY);
            window.location.href = '/login';
        }

        if (error.response?.status === 403) {
            console.error('Доступ запрещён');
        }

        if (error.response?.status === 429) {
            console.error('Слишком много запросов');
        }

        return Promise.reject(error);
    }
);

function normalizeApiResponse<T>(payload: unknown): ApiResponse<T> {
    if (payload && typeof payload === 'object') {
        const payloadObj = payload as Record<string, unknown>;

        if ('success' in payloadObj && typeof payloadObj.success === 'boolean') {
            return {
                success: payloadObj.success,
                data: payloadObj.data as T | undefined,
                message: payloadObj.message as string | undefined,
                errors: payloadObj.errors as Record<string, string[]> | undefined,
            };
        }

        if ('data' in payloadObj) {
            return {
                success: true,
                data: payloadObj.data as T,
                message: payloadObj.message as string | undefined,
                errors: payloadObj.errors as Record<string, string[]> | undefined,
            };
        }
    }

    return {
        success: true,
        data: payload as T,
    };
}

export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
        const response = await apiClient.get(url, config);
        return normalizeApiResponse<T>(response.data);
    } catch (error) {
        throw handleApiError(error as AxiosError<ApiError>);
    }
}

export async function post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
    try {
        const response = await apiClient.post(url, data, config);
        return normalizeApiResponse<T>(response.data);
    } catch (error) {
        throw handleApiError(error as AxiosError<ApiError>);
    }
}

export async function put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
    try {
        const response = await apiClient.put(url, data, config);
        return normalizeApiResponse<T>(response.data);
    } catch (error) {
        throw handleApiError(error as AxiosError<ApiError>);
    }
}

export async function patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
    try {
        const response = await apiClient.patch(url, data, config);
        return normalizeApiResponse<T>(response.data);
    } catch (error) {
        throw handleApiError(error as AxiosError<ApiError>);
    }
}

export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
        const response = await apiClient.delete(url, config);
        return normalizeApiResponse<T>(response.data);
    } catch (error) {
        throw handleApiError(error as AxiosError<ApiError>);
    }
}

function handleApiError(error: AxiosError<ApiError>): ApiError {
    if (error.response) {
        return {
            message: error.response.data?.message || 'Произошла ошибка на сервере',
            statusCode: error.response.status,
            errors: error.response.data?.errors,
            timestamp: new Date().toISOString(),
        };
    }

    if (error.request) {
        return {
            message: 'Нет ответа от сервера. Проверьте подключение.',
            statusCode: 0,
            timestamp: new Date().toISOString(),
        };
    }

    return {
        message: error.message || 'Не удалось выполнить запрос',
        statusCode: 0,
        timestamp: new Date().toISOString(),
    };
}

export { apiClient };

export default {
    get,
    post,
    put,
    patch,
    delete: del,
    client: apiClient,
};
