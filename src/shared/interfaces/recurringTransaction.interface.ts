import { TransactionType } from "../enums/transaction.enum";

export enum RecurrenceType {
    MONTHLY = 'monthly',
    WEEKLY = 'weekly',
    YEARLY = 'yearly'
}

export interface RecurringTransaction {
    id: string;
    type: TransactionType;
    title: string;
    amount: number;
    recurrenceType: RecurrenceType;
    dayOfMonth?: number; 
    dayOfWeek?: number; 
    monthOfYear?: number; 
    isActive: boolean;
    startDate: Date;
    endDate?: Date; 
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
