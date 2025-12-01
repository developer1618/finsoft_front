import { z } from 'zod';

/**
 * Login validation schema
 */
export const loginSchema = z.object({
    email: z.string().min(1, 'Email обязателен'),
    password: z.string().min(1, 'Пароль обязателен'),
});

/**
 * Debt validation schema
 */
export const debtSchema = z.object({
    date: z.string().min(1, 'Дата обязательна'),
    client: z.string().min(1, 'Клиент обязателен'),
    product: z.string().min(1, 'Товар обязателен'),
    totalAmount: z.number().positive('Сумма должна быть положительной'),
    currency: z.string().min(1, 'Валюта обязательна'),
    note: z.string().optional(),
});

/**
 * Partial payment validation schema
 */
export const partialPaymentSchema = z.object({
    amount: z.number().positive('Сумма должна быть положительной'),
    currency: z.string().min(1, 'Валюта обязательна'),
    method: z.string().min(1, 'Метод оплаты обязателен'),
    date: z.string().min(1, 'Дата обязательна'),
    note: z.string().optional(),
});

/**
 * Warehouse item validation schema
 */
export const warehouseItemSchema = z.object({
    date: z.string().min(1, 'Дата обязательна'),
    name: z.string().min(1, 'Название обязательно'),
    quantity: z.number().positive('Количество должно быть положительным'),
    unit: z.string().min(1, 'Единица измерения обязательна'),
    location: z.string().min(1, 'Расположение обязательно'),
    supplier: z.string().optional(),
    price: z.number().positive().optional(),
    currency: z.string().optional(),
    note: z.string().optional(),
});

/**
 * Transaction validation schema
 */
export const transactionSchema = z.object({
    date: z.string().min(1, 'Дата обязательна'),
    type: z.string().refine((val) => val === 'Доход' || val === 'Расход', {
        message: 'Тип должен быть Доход или Расход',
    }),
    category: z.string().min(1, 'Категория обязательна'),
    amount: z.number().positive('Сумма должна быть положительной'),
    currency: z.string().min(1, 'Валюта обязательна'),
    description: z.string().min(1, 'Описание обязательно'),
    paymentMethod: z.string().optional(),
    recipient: z.string().optional(),
});

/**
 * Chinese cargo validation schema
 */
export const cargoSchema = z.object({
    date: z.string().min(1, 'Дата обязательна'),
    name: z.string().min(1, 'Название обязательно'),
    weight: z.number().positive('Вес должен быть положительным'),
    unit: z.string().min(1, 'Единица измерения обязательна'),
    status: z.string().refine((val) => val === 'Заказано в Китае' || val === 'Принято в Душанбе', {
        message: 'Неверный статус',
    }),
    trackingNumber: z.string().optional(),
    supplier: z.string().optional(),
    cost: z.number().positive().optional(),
    currency: z.string().optional(),
    note: z.string().optional(),
});

/**
 * Workshop item validation schema
 */
export const workshopItemSchema = z.object({
    date: z.string().min(1, 'Дата обязательна'),
    productName: z.string().min(1, 'Название продукта обязательно'),
    quantity: z.number().positive('Количество должно быть положительным'),
    unit: z.string().min(1, 'Единица измерения обязательна'),
    workshopType: z.string().refine((val) => val === 'capsule' || val === 'cup', {
        message: 'Тип цеха должен быть capsule или cup',
    }),
    shift: z.string().optional(),
    operator: z.string().optional(),
    note: z.string().optional(),
});

/**
 * Helper function to validate data
 */
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): {
    success: boolean;
    data?: T;
    errors?: Record<string, string>;
} {
    try {
        const validData = schema.parse(data);
        return { success: true, data: validData };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors: Record<string, string> = {};
            error.issues.forEach((err: z.ZodIssue) => {
                const path = err.path.join('.');
                errors[path] = err.message;
            });
            return { success: false, errors };
        }
        return { success: false, errors: { _error: 'Validation failed' } };
    }
}
