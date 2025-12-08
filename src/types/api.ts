export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: Record<string, string[]>;
}

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

export interface ApiError {
    message: string;
    statusCode: number;
    errors?: Record<string, string[]>;
    timestamp?: string;
}

export interface LoginRequest {
    username: string;
    password: string;
    remember?: boolean;
}

export interface LoginResponse {
    user: {
        id: string;
        username: string;
        email?: string;
        firstName: string;
        lastName: string;
        role: string;
        avatar?: string;
    };
    token: string;
    refreshToken?: string;
    expiresIn?: number;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface PartialPaymentRequest {
    debtId: string;
    amount: number;
    currency: string;
    method: string;
    date: string;
    note?: string;
}

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
    [key: string]: unknown;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestConfig {
    headers?: Record<string, string>;
    params?: Record<string, unknown>;
    timeout?: number;
    withCredentials?: boolean;
}
