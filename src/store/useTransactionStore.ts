import { create } from "zustand";
import { Transaction } from "../shared/interfaces/transaction.interface";
import { TransactionState } from "../shared/interfaces/transactionState.interface";

export const useTransactionStore = create<TransactionState>((set) => ({
    transactions: [],
    addTransaction: (transaction: Transaction) =>
        set((state) => ({
            transactions: [...state.transactions, transaction],
        })),
}));