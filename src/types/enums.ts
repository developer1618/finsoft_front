export enum UserRole {
    ADMIN = 'admin',
    MANAGER = 'manager',
}

export enum DebtStatus {
    UNPAID = 'Неоплачено',
    PARTIALLY_PAID = 'Частично оплачено',
    PAID = 'Оплачено',
}

export enum CargoStatus {
    ORDERED_IN_CHINA = 'Заказано в Китае',
    RECEIVED_IN_DUSHANBE = 'Принято в Душанбе',
}

export enum PaymentMethod {
    CASH = 'Наличные',
    BANK = 'Банк',
    TRANSFER = 'Перевод',
    CARD = 'Карта',
}

export enum Currency {
    TJS = 'сом',
    USD = '$',
    CNY = '¥',
}

export enum TransactionType {
    INCOME = 'Доход',
    EXPENSE = 'Расход',
}

export enum WarehouseLocation {
    CAPSULE = 'Склад Капсула',
    CUP = 'Склад Стакан',
    FACTORY = 'Склад Завод',
}
