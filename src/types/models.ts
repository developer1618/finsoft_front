import type { UserRole, DebtStatus, CargoStatus, PaymentMethod, Currency, TransactionType, WarehouseLocation } from './enums';

export interface BaseModel {
    id: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface User extends BaseModel {
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    avatar?: string;
}

export interface AuthUser extends User {
    token?: string;
    refreshToken?: string;
}

export interface PaymentEntry {
    id: string;
    date: string;
    amount: number;
    currency: Currency;
    method: PaymentMethod;
    note?: string;
}

export interface Debt extends BaseModel {
    date: string;
    client: string;
    product: string;
    totalAmount: number;
    remainingAmount: number;
    currency: Currency;
    status: DebtStatus;
    payments?: PaymentEntry[];
    note?: string;
}

export interface WarehouseItem extends BaseModel {
    date: string;
    name: string;
    quantity: number;
    unit: string;
    location: WarehouseLocation;
    supplier?: string;
    price?: number;
    currency?: Currency;
    note?: string;
}

export interface Transaction extends BaseModel {
    date: string;
    type: TransactionType;
    category: string;
    amount: number;
    currency: Currency;
    description: string;
    paymentMethod?: PaymentMethod;
    recipient?: string;
}

export interface ChineseCargo extends BaseModel {
    date: string;
    name: string;
    weight: number;
    unit: string;
    status: CargoStatus;
    trackingNumber?: string;
    supplier?: string;
    cost?: number;
    currency?: Currency;
    note?: string;
}

export interface WorkshopItem extends BaseModel {
    date: string;
    productName: string;
    quantity: number;
    unit: string;
    workshopType: 'capsule' | 'cup';
    shift?: string;
    operator?: string;
    note?: string;
}

export interface VarzobExpense extends BaseModel {
    date: string;
    category: string;
    amount: number;
    currency: Currency;
    description: string;
    recipient?: string;
    paymentMethod?: PaymentMethod;
}

export interface DashboardStats {
    totalIncome: number;
    totalExpense: number;
    totalDebts: number;
    warehouseItems: number;
    cargoWeight: number;
    capsuleProduction: number;
    cupProduction: number;
}

export interface MenuVisibility {
    dashboard: boolean;
    'income-expense': boolean;
    'varzob-expense': boolean;
    'chinese-cargo': boolean;
    'capsule-workshop': boolean;
    'cup-workshop': boolean;
    warehouse: boolean;
    'factory-warehouse': boolean;
    debts: boolean;
}
