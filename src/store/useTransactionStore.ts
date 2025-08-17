import uuid from 'react-native-uuid';
import { create } from "zustand";
import { Transaction } from "../shared/interfaces/transaction.interface";
import { TransactionState } from "../shared/interfaces/transactionState.interface";

export const useTransactionStore = create<TransactionState>((set) => ({
    transactions: [], 
    addTransaction: (transaction: Transaction) =>
        set((state) => ({
            transactions: [...state.transactions, transaction],
        })),
    removeTransaction: (transactionId: string) =>
        set((state) => ({
            transactions: state.transactions.filter(transaction => transaction.id !== transactionId),
        })),
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