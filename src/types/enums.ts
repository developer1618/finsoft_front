/**
 * User roles in the system
 */
export enum UserRole {
    ADMIN = 'admin',
    MANAGER = 'manager',
}

/**
 * Debt payment statuses
 */
export enum DebtStatus {
    UNPAID = 'Неоплачено',
    PARTIALLY_PAID = 'Частично оплачено',
    PAID = 'Оплачено',
}

/**
 * Chinese cargo statuses
 */
export enum CargoStatus {
    ORDERED_IN_CHINA = 'Заказано в Китае',
    RECEIVED_IN_DUSHANBE = 'Принято в Душанбе',
}

/**
 * Payment methods
 */
export enum PaymentMethod {
    CASH = 'Наличные',
    BANK = 'Банк',
    TRANSFER = 'Перевод',
    CARD = 'Карта',
}

/**
 * Currency types
 */
export enum Currency {
    TJS = 'сом',
    USD = '$',
    CNY = '¥',
}

/**
 * Transaction types
 */
export enum TransactionType {
    INCOME = 'Доход',
    EXPENSE = 'Расход',
}

/**
 * Warehouse locations
 */
export enum WarehouseLocation {
    CAPSULE = 'Склад Капсула',
    CUP = 'Склад Стакан',
}
