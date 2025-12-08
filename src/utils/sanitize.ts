const DANGEROUS_CHARS_REGEX = /[<>"'`]/g;
const HTML_ENTITIES: Record<string, string> = {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;',
};

export function sanitizeHtml(input: string): string {
    if (!input || typeof input !== 'string') {
        return '';
    }
    return input.replace(DANGEROUS_CHARS_REGEX, (char) => HTML_ENTITIES[char] || char);
}

export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
    if (!obj || typeof obj !== 'object') {
        return obj;
    }

    const sanitized = {} as T;

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];

            if (typeof value === 'string') {
                sanitized[key] = sanitizeHtml(value) as T[Extract<keyof T, string>];
            } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                sanitized[key] = sanitizeObject(value as Record<string, unknown>) as T[Extract<keyof T, string>];
            } else if (Array.isArray(value)) {
                sanitized[key] = value.map((item) => {
                    if (typeof item === 'string') {
                        return sanitizeHtml(item);
                    }
                    if (typeof item === 'object' && item !== null) {
                        return sanitizeObject(item as Record<string, unknown>);
                    }
                    return item;
                }) as T[Extract<keyof T, string>];
            } else {
                sanitized[key] = value as T[Extract<keyof T, string>];
            }
        }
    }

    return sanitized;
}

export function stripDangerousChars(input: string): string {
    if (!input || typeof input !== 'string') {
        return '';
    }
    return input.replace(DANGEROUS_CHARS_REGEX, '');
}

export function escapeRegex(input: string): string {
    if (!input || typeof input !== 'string') {
        return '';
    }
    return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function sanitizeFilename(filename: string): string {
    if (!filename || typeof filename !== 'string') {
        return 'file';
    }
    return filename
        .replace(/[^a-zA-Z0-9_\-.а-яА-ЯёЁ]/g, '_')
        .replace(/_{2,}/g, '_')
        .substring(0, 200);
}

export function validateUrl(url: string): boolean {
    if (!url || typeof url !== 'string') {
        return false;
    }
    try {
        const parsed = new URL(url);
        return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
        return false;
    }
}
