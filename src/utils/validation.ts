import { z } from 'zod';

export const loginSchema = z.object({
    username: z.string().min(1, 'Логин обязателен').max(50, 'Логин слишком длинный'),
    password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
});

export const debtSchema = z.object({
    date: z.string().min(1, 'Дата обязательна'),
    client: z.string().min(1, 'Клиент обязателен').max(100, 'Имя клиента слишком длинное'),
    product: z.string().min(1, 'Товар обязателен').max(200, 'Название товара слишком длинное'),
    totalAmount: z.number().positive('Сумма должна быть положительной'),
    currency: z.string().min(1, 'Валюта обязательна'),
    note: z.string().max(500, 'Примечание слишком длинное').optional(),
});

export const partialPaymentSchema = z.object({
    amount: z.number().positive('Сумма должна быть положительной'),
    currency: z.string().min(1, 'Валюта обязательна'),
    method: z.string().min(1, 'Метод оплаты обязателен'),
    date: z.string().min(1, 'Дата обязательна'),
    note: z.string().max(500, 'Примечание слишком длинное').optional(),
});

export const warehouseItemSchema = z.object({
    date: z.string().min(1, 'Дата обязательна'),
    name: z.string().min(1, 'Название обязательно').max(200, 'Название слишком длинное'),
    quantity: z.number().positive('Количество должно быть положительным'),
    unit: z.string().min(1, 'Единица измерения обязательна'),
    location: z.string().min(1, 'Расположение обязательно'),
    supplier: z.string().max(100, 'Имя поставщика слишком длинное').optional(),
    price: z.number().positive().optional(),
    currency: z.string().optional(),
    note: z.string().max(500, 'Примечание слишком длинное').optional(),
});

export const transactionSchema = z.object({
    date: z.string().min(1, 'Дата обязательна'),
    type: z.string().refine((val) => val === 'Доход' || val === 'Расход', {
        message: 'Тип должен быть Доход или Расход',
    }),
    category: z.string().min(1, 'Категория обязательна').max(100, 'Категория слишком длинная'),
    amount: z.number().positive('Сумма должна быть положительной'),
    currency: z.string().min(1, 'Валюта обязательна'),
    description: z.string().min(1, 'Описание обязательно').max(500, 'Описание слишком длинное'),
    paymentMethod: z.string().optional(),
    recipient: z.string().max(100, 'Имя получателя слишком длинное').optional(),
});

export const cargoSchema = z.object({
    date: z.string().min(1, 'Дата обязательна'),
    name: z.string().min(1, 'Название обязательно').max(200, 'Название слишком длинное'),
    weight: z.number().positive('Вес должен быть положительным'),
    unit: z.string().min(1, 'Единица измерения обязательна'),
    status: z.string().refine((val) => val === 'Заказано в Китае' || val === 'Принято в Душанбе', {
        message: 'Неверный статус',
    }),
    trackingNumber: z.string().max(50, 'Трек-номер слишком длинный').optional(),
    supplier: z.string().max(100, 'Имя поставщика слишком длинное').optional(),
    cost: z.number().positive().optional(),
    currency: z.string().optional(),
    note: z.string().max(500, 'Примечание слишком длинное').optional(),
});

export const workshopItemSchema = z.object({
    date: z.string().min(1, 'Дата обязательна'),
    productName: z.string().min(1, 'Название продукта обязательно').max(200, 'Название слишком длинное'),
    quantity: z.number().positive('Количество должно быть положительным'),
    unit: z.string().min(1, 'Единица измерения обязательна'),
    workshopType: z.string().refine((val) => val === 'capsule' || val === 'cup', {
        message: 'Тип цеха должен быть capsule или cup',
    }),
    shift: z.string().max(50, 'Название смены слишком длинное').optional(),
    operator: z.string().max(100, 'Имя оператора слишком длинное').optional(),
    note: z.string().max(500, 'Примечание слишком длинное').optional(),
});

export const userSchema = z.object({
    username: z.string().min(1, 'Логин обязателен').max(50, 'Логин слишком длинный'),
    email: z.string().email('Неверный формат email'),
    firstName: z.string().min(1, 'Имя обязательно').max(50, 'Имя слишком длинное'),
    lastName: z.string().min(1, 'Фамилия обязательна').max(50, 'Фамилия слишком длинная'),
    password: z.string().min(6, 'Пароль должен быть не менее 6 символов').optional(),
    role: z.string().refine((val) => val === 'admin' || val === 'manager', {
        message: 'Роль должна быть admin или manager',
    }),
});

export const passwordSchema = z.object({
    currentPassword: z.string().min(1, 'Текущий пароль обязателен'),
    newPassword: z.string().min(6, 'Новый пароль должен быть не менее 6 символов'),
    confirmPassword: z.string().min(1, 'Подтверждение пароля обязательно'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
});

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
        return { success: false, errors: { _error: 'Ошибка валидации' } };
    }
}
