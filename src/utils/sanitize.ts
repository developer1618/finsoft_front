/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeHtml(input: string): string {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

/**
 * Sanitize object values recursively
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
    const sanitized = {} as T;

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];

            if (typeof value === 'string') {
                sanitized[key] = sanitizeHtml(value) as any;
            } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                sanitized[key] = sanitizeObject(value);
            } else if (Array.isArray(value)) {
                sanitized[key] = value.map((item: any) =>
                    typeof item === 'string' ? sanitizeHtml(item) :
                        typeof item === 'object' ? sanitizeObject(item) : item
                ) as any;
            } else {
                sanitized[key] = value;
            }
        }
    }

    return sanitized;
}

/**
 * Remove potentially dangerous characters
 */
export function stripDangerousChars(input: string): string {
    return input.replace(/[<>"'`]/g, '');
}

/**
 * Escape special characters for use in regex
 */
export function escapeRegex(input: string): string {
    return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
