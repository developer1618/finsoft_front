/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: Record<string, string[]>;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        currentPage: number;
        lastPage: number;
        perPage: number;
        total: number;
        from: number;
        to: number;
    };
    links?: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
}

/**
 * API error structure
 */
export interface ApiError {
    message: string;
    statusCode: number;
    errors?: Record<string, string[]>;
    timestamp?: string;
}

/**
 * Login request payload
 */
export interface LoginRequest {
    email: string;
    password: string;
    remember?: boolean;
}

/**
 * Login response
 */
export interface LoginResponse {
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
        avatar?: string;
    };
    token: string;
    refreshToken?: string;
    expiresIn?: number;
}

/**
 * Refresh token request
 */
export interface RefreshTokenRequest {
    refreshToken: string;
}

/**
 * Partial payment request
 */
export interface PartialPaymentRequest {
    debtId: string;
    amount: number;
    currency: string;
    method: string;
    date: string;
    note?: string;
}

/**
 * Filter parameters for list queries
 */
export interface FilterParams {
    page?: number;
    perPage?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    dateFrom?: string;
    dateTo?: string;
    status?: string;
    type?: string;
    [key: string]: any;
}

/**
 * HTTP methods
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Request configuration
 */
export interface RequestConfig {
    headers?: Record<string, string>;
    params?: Record<string, any>;
    timeout?: number;
    withCredentials?: boolean;
}
