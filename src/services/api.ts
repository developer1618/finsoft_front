import axios, type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import type { ApiResponse, ApiError } from '../types/api';

/**
 * API Client Configuration
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const API_TIMEOUT = 30000; // 30 seconds

/**
 * Create axios instance with default configuration
 */
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true, // For CSRF cookies
});

/**
 * Request interceptor - Add authentication token
 */
apiClient.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const authData = localStorage.getItem('finsoft_auth_user');
        if (authData) {
            try {
                const user = JSON.parse(authData);
                if (user.token) {
                    config.headers.Authorization = `Bearer ${user.token}`;
                }
            } catch (error) {
                console.error('Failed to parse auth data:', error);
            }
        }

        // Add CSRF token if available
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (csrfToken) {
            config.headers['X-CSRF-TOKEN'] = csrfToken;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response interceptor - Handle errors globally
 */
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Handle 401 Unauthorized - Token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh token
                const authData = localStorage.getItem('finsoft_auth_user');
                if (authData) {
                    const user = JSON.parse(authData);
                    if (user.refreshToken) {
                        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                            refreshToken: user.refreshToken,
                        });

                        const { token } = response.data;
                        user.token = token;
                        localStorage.setItem('finsoft_auth_user', JSON.stringify(user));

                        // Retry original request with new token
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        return apiClient(originalRequest);
                    }
                }
            } catch (refreshError) {
                // Refresh failed, logout user
                localStorage.removeItem('finsoft_auth_user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // Handle 403 Forbidden
        if (error.response?.status === 403) {
            console.error('Access forbidden:', error.response.data);
        }

        // Handle 500 Server Error
        if (error.response?.status === 500) {
            console.error('Server error:', error.response.data);
        }

        // Handle network errors
        if (!error.response) {
            console.error('Network error:', error.message);
        }

        return Promise.reject(error);
    }
);

/**
 * Generic GET request
 */
export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
        const response = await apiClient.get<ApiResponse<T>>(url, config);
        return response.data;
    } catch (error) {
        throw handleApiError(error as AxiosError<ApiError>);
    }
}

/**
 * Generic POST request
 */
export async function post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
    try {
        const response = await apiClient.post<ApiResponse<T>>(url, data, config);
        return response.data;
    } catch (error) {
        throw handleApiError(error as AxiosError<ApiError>);
    }
}

/**
 * Generic PUT request
 */
export async function put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
    try {
        const response = await apiClient.put<ApiResponse<T>>(url, data, config);
        return response.data;
    } catch (error) {
        throw handleApiError(error as AxiosError<ApiError>);
    }
}

/**
 * Generic PATCH request
 */
export async function patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
    try {
        const response = await apiClient.patch<ApiResponse<T>>(url, data, config);
        return response.data;
    } catch (error) {
        throw handleApiError(error as AxiosError<ApiError>);
    }
}

/**
 * Generic DELETE request
 */
export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
        const response = await apiClient.delete<ApiResponse<T>>(url, config);
        return response.data;
    } catch (error) {
        throw handleApiError(error as AxiosError<ApiError>);
    }
}

/**
 * Handle API errors and format them consistently
 */
function handleApiError(error: AxiosError<ApiError>): ApiError {
    if (error.response) {
        // Server responded with error
        return {
            message: error.response.data?.message || 'An error occurred',
            statusCode: error.response.status,
            errors: error.response.data?.errors,
            timestamp: new Date().toISOString(),
        };
    } else if (error.request) {
        // Request made but no response
        return {
            message: 'No response from server. Please check your connection.',
            statusCode: 0,
            timestamp: new Date().toISOString(),
        };
    } else {
        // Error in request setup
        return {
            message: error.message || 'An unexpected error occurred',
            statusCode: 0,
            timestamp: new Date().toISOString(),
        };
    }
}

/**
 * Export the axios instance for advanced usage
 */
export { apiClient };

/**
 * Default export with all methods
 */
export default {
    get,
    post,
    put,
    patch,
    delete: del,
    client: apiClient,
};
