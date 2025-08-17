import uuid from 'react-native-uuid';
import { create } from "zustand";
import { RecurrenceType, RecurringTransaction } from "../shared/interfaces/recurringTransaction.interface";
import { Transaction } from "../shared/interfaces/transaction.interface";
import { TransactionState } from "../shared/interfaces/transactionState.interface";

export const useTransactionStore = create<TransactionState>((set, get) => ({
    transactions: [], 
    recurringTransactions: [],
    
    addTransaction: (transaction: Transaction) =>
        set((state) => ({
            transactions: [...state.transactions, transaction],
        })),
        
    removeTransaction: (transactionId: string) =>
        set((state) => ({
            transactions: state.transactions.filter(transaction => transaction.id !== transactionId),
        })),
        
    addRecurringTransaction: (recurringTransaction: RecurringTransaction) =>
        set((state) => ({
            recurringTransactions: [...state.recurringTransactions, recurringTransaction],
        })),
        
    removeRecurringTransaction: (transactionId: string) =>
        set((state) => ({
            recurringTransactions: state.recurringTransactions.filter(transaction => transaction.id !== transactionId),
        })),
        
    generateRecurringTransactions: (month: number, year: number) => {
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
        
        if (generatedTransactions.length > 0) {
            set((state) => ({
                transactions: [...state.transactions, ...generatedTransactions],
            }));
        }
    },
    
    addTransactionWithInstallments: (transaction: Transaction, installments: number) =>
        set((state) => {
            const newTransactions: Transaction[] = [];
            const installmentAmount = transaction.amount / installments;
            
            for (let i = 0; i < installments; i++) {
                const installmentDate = new Date(transaction.date);
                installmentDate.setMonth(installmentDate.getMonth() + i);
                
                const installmentTransaction: Transaction = {
                    ...transaction,
                    id: uuid.v4() as string,
                    amount: installmentAmount,
                    date: installmentDate,
                    title: `${transaction.title} (${i + 1}/${installments})`,
                    isInstalment: true,
                    installments: [{
                        instalmentNumber: i + 1,
                        amount: installmentAmount,
                        dueDate: installmentDate,
                        paid: false,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }]
                };
                newTransactions.push(installmentTransaction);
            }
            
            return {
                transactions: [...state.transactions, ...newTransactions],
            };
        }),
}));