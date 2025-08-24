import uuid from 'react-native-uuid';
import { create } from "zustand";
import { MMKVStorageService } from '../services/MMKVStorage.service';
import { RecurrenceType, RecurringTransaction } from "../shared/interfaces/recurringTransaction.interface";
import { Transaction } from "../shared/interfaces/transaction.interface";
import { TransactionState } from "../shared/interfaces/transactionState.interface";

const storage = new MMKVStorageService();

const TRANSACTIONS_KEY = 'transactions';
const RECURRING_TRANSACTIONS_KEY = 'recurring_transactions';

const loadInitialData = async () => {
    try {
        const [transactions, recurringTransactions] = await Promise.all([
            storage.getItem<Transaction[]>(TRANSACTIONS_KEY),
            storage.getItem<RecurringTransaction[]>(RECURRING_TRANSACTIONS_KEY)
        ]);
        
        return {
            transactions: transactions || [],
            recurringTransactions: recurringTransactions || []
        };
    } catch (error) {
        console.warn('Erro ao carregar dados do storage:', error);
        return {
            transactions: [],
            recurringTransactions: []
        };
    }
};

const saveToStorage = async (key: string, data: any) => {
    try {
        await storage.setItem(key, data);
    } catch (error) {
        console.warn(`Erro ao salvar ${key} no storage:`, error);
    }
};

export const useTransactionStore = create<TransactionState>((set, get) => ({
    transactions: [], 
    recurringTransactions: [],
    
    loadData: async () => {
        const data = await loadInitialData();
        set({
            transactions: data.transactions,
            recurringTransactions: data.recurringTransactions
        });
    },
    
    addTransaction: (transaction: Transaction) =>
        set((state) => {
            const newTransactions = [...state.transactions, transaction];
            saveToStorage(TRANSACTIONS_KEY, newTransactions);
            return { transactions: newTransactions };
        }),
        
    removeTransaction: (transactionId: string) =>
        set((state) => {
            const newTransactions = state.transactions.filter(transaction => transaction.id !== transactionId);
            saveToStorage(TRANSACTIONS_KEY, newTransactions);
            return { transactions: newTransactions };
        }),
        
    addRecurringTransaction: (recurringTransaction: RecurringTransaction) =>
        set((state) => {
            const newRecurringTransactions = [...state.recurringTransactions, recurringTransaction];
            saveToStorage(RECURRING_TRANSACTIONS_KEY, newRecurringTransactions);
            return { recurringTransactions: newRecurringTransactions };
        }),
        
    removeRecurringTransaction: (transactionId: string) =>
        set((state) => {
            const newRecurringTransactions = state.recurringTransactions.filter(transaction => transaction.id !== transactionId);
            saveToStorage(RECURRING_TRANSACTIONS_KEY, newRecurringTransactions);
            return { recurringTransactions: newRecurringTransactions };
        }),
        
    removeRecurringTransactionInstance: (transactionId: string) =>
        set((state) => {
            const newTransactions = state.transactions.filter(transaction => transaction.id !== transactionId);
            saveToStorage(TRANSACTIONS_KEY, newTransactions);
            return { transactions: newTransactions };
        }),
        
    removeAllFutureRecurringTransactions: (recurringTransactionId: string, currentTransactionDate: Date) =>
        set((state) => {
            const newTransactions = state.transactions.filter(transaction => {
                if (transaction.recurringTransactionId === recurringTransactionId) {
                    const transactionDate = new Date(transaction.date);
                    return transactionDate < currentTransactionDate;
                }
                return true;
            });
            
            const newRecurringTransactions = state.recurringTransactions.filter(
                recurring => recurring.id !== recurringTransactionId
            );
            
            saveToStorage(TRANSACTIONS_KEY, newTransactions);
            saveToStorage(RECURRING_TRANSACTIONS_KEY, newRecurringTransactions);
            
            return { 
                transactions: newTransactions,
                recurringTransactions: newRecurringTransactions 
            };
        }),
        
    generateRecurringTransactions: (month: number, year: number) => {
        const { recurringTransactions, transactions } = get();
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
                const existingTransaction = transactions.find(t => 
                    t.title.includes(`${recurring.title} (Recorrente)`) &&
                    new Date(t.date).getMonth() === month - 1 &&
                    new Date(t.date).getFullYear() === year
                );
                
                if (!existingTransaction) {
                    const transaction: Transaction = {
                        id: uuid.v4() as string,
                        type: recurring.type,
                        title: `${recurring.title} (Recorrente)`,
                        amount: recurring.amount,
                        date: transactionDate,
                        notes: recurring.notes,
                        recurringTransactionId: recurring.id,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };
                    generatedTransactions.push(transaction);
                }
            }
        });
        
        if (generatedTransactions.length > 0) {
            const allTransactions = [...get().transactions, ...generatedTransactions];
            saveToStorage(TRANSACTIONS_KEY, allTransactions);
            set(() => ({
                transactions: allTransactions,
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
            
            const allTransactions = [...state.transactions, ...newTransactions];
            saveToStorage(TRANSACTIONS_KEY, allTransactions);
            
            return {
                transactions: allTransactions,
            };
        }),
        
    clearAllData: () =>
        set(() => {
            saveToStorage(TRANSACTIONS_KEY, []);
            saveToStorage(RECURRING_TRANSACTIONS_KEY, []);
            return { 
                transactions: [], 
                recurringTransactions: [] 
            };
        }),
}));