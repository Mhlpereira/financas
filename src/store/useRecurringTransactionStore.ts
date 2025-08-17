import uuid from 'react-native-uuid';
import { create } from "zustand";
import { RecurrenceType, RecurringTransaction } from "../shared/interfaces/recurringTransaction.interface";
import { Transaction } from "../shared/interfaces/transaction.interface";

interface RecurringTransactionState {
    recurringTransactions: RecurringTransaction[];
    addRecurringTransaction: (transaction: RecurringTransaction) => void;
    removeRecurringTransaction: (transactionId: string) => void;
    updateRecurringTransaction: (transactionId: string, transaction: Partial<RecurringTransaction>) => void;
    generateTransactionsForMonth: (month: number, year: number) => Transaction[];
}

export const useRecurringTransactionStore = create<RecurringTransactionState>((set, get) => ({
    recurringTransactions: [],
    
    addRecurringTransaction: (transaction: RecurringTransaction) =>
        set((state) => ({
            recurringTransactions: [...state.recurringTransactions, transaction],
        })),
    
    removeRecurringTransaction: (transactionId: string) =>
        set((state) => ({
            recurringTransactions: state.recurringTransactions.filter(
                transaction => transaction.id !== transactionId
            ),
        })),
    
    updateRecurringTransaction: (transactionId: string, updatedData: Partial<RecurringTransaction>) =>
        set((state) => ({
            recurringTransactions: state.recurringTransactions.map(transaction =>
                transaction.id === transactionId
                    ? { ...transaction, ...updatedData, updatedAt: new Date() }
                    : transaction
            ),
        })),
    
    generateTransactionsForMonth: (month: number, year: number): Transaction[] => {
        const { recurringTransactions } = get();
        const generatedTransactions: Transaction[] = [];
        
        recurringTransactions.forEach(recurring => {
            if (!recurring.isActive) return;
            
            const targetDate = new Date(year, month - 1, 1);
            const startDate = new Date(recurring.startDate);
            const endDate = recurring.endDate ? new Date(recurring.endDate) : null;
            
            if (targetDate < startDate) return;
            if (endDate && targetDate > endDate) return;
            
            let transactionDate: Date | null = null;
            
            switch (recurring.recurrenceType) {
                case RecurrenceType.MONTHLY:
                    if (recurring.dayOfMonth) {
                        const day = Math.min(recurring.dayOfMonth, new Date(year, month, 0).getDate());
                        transactionDate = new Date(year, month - 1, day);
                    }
                    break;
                    
                case RecurrenceType.YEARLY:
                    if (recurring.monthOfYear === month && recurring.dayOfMonth) {
                        const day = Math.min(recurring.dayOfMonth, new Date(year, month, 0).getDate());
                        transactionDate = new Date(year, month - 1, day);
                    }
                    break;
                    
                case RecurrenceType.WEEKLY:
                    const firstDay = new Date(year, month - 1, 1);
                    const lastDay = new Date(year, month, 0);
                    let currentDate = new Date(firstDay);
                    
                    while (currentDate <= lastDay) {
                        if (currentDate.getDay() === recurring.dayOfWeek) {
                            const weeklyTransaction: Transaction = {
                                id: uuid.v4() as string,
                                type: recurring.type,
                                title: `${recurring.title} (Recorrente)`,
                                amount: recurring.amount,
                                date: new Date(currentDate),
                                notes: recurring.notes,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            };
                            generatedTransactions.push(weeklyTransaction);
                        }
                        currentDate.setDate(currentDate.getDate() + 1);
                    }
                    return; 
            }
            
            if (transactionDate) {
                const transaction: Transaction = {
                    id: uuid.v4() as string,
                    type: recurring.type,
                    title: `${recurring.title} (Recorrente)`,
                    amount: recurring.amount,
                    date: transactionDate,
                    notes: recurring.notes,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                generatedTransactions.push(transaction);
            }
        });
        
        return generatedTransactions;
    },
}));
