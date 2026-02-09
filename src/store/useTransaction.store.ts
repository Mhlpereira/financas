import uuid from 'react-native-uuid'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { MMKVStorageService } from '../services/MMKVStorage.service'
import { Frequency } from '../shared/enums/transaction.enum'
import { Transaction } from '../shared/interfaces/transaction.interface'
import { TransactionState } from '../shared/interfaces/transactionState.interface'

export const useTransactionStore = create<TransactionState>()(
    persist(
        (set, get) => ({
            transactions: [],

            loadData: async () => {},

            addTransaction: (data) => {
                const now = new Date().toISOString()
                const transaction: Transaction = {
                    ...data,
                    id: uuid.v4() as string,
                    createdAt: now,
                    updatedAt: now,
                }
                set((state) => ({
                    transactions: [...state.transactions, transaction],
                }))
            },

            addTransactionWithInstallments: (data, installments) => {
                const parentId = uuid.v4() as string
                const now = new Date().toISOString()
                const installmentAmount = data.amount / installments
                const newTransactions: Transaction[] = []

                for (let i = 0; i < installments; i++) {
                    const date = new Date(data.startDate)
                    date.setMonth(date.getMonth() + i)

                    newTransactions.push({
                        ...data,
                        id: uuid.v4() as string,
                        amount: installmentAmount,
                        startDate: date.toISOString(),
                        description: `${data.description} (${i + 1}/${installments})`,
                        frequency: Frequency.ONE_TIME,
                        installments,
                        currentInstallment: i + 1,
                        parentId,
                        createdAt: now,
                        updatedAt: now,
                    })
                }

                set((state) => ({
                    transactions: [...state.transactions, ...newTransactions],
                }))
            },

            updateTransaction: (id, data) =>
                set((state) => ({
                    transactions: state.transactions.map((t) =>
                        t.id === id
                            ? {
                                  ...t,
                                  ...data,
                                  updatedAt: new Date().toISOString(),
                              }
                            : t,
                    ),
                })),

            removeTransaction: (transactionId) =>
                set((state) => ({
                    transactions: state.transactions.filter(
                        (t) => t.id !== transactionId,
                    ),
                })),

            removeAllInstallments: (parentId) =>
                set((state) => ({
                    transactions: state.transactions.filter(
                        (t) => t.parentId !== parentId,
                    ),
                })),

            getTransactionsByMonth: (month, year) => {
                return get().transactions.filter((t) => {
                    const date = new Date(t.startDate)
                    return (
                        date.getMonth() + 1 === month &&
                        date.getFullYear() === year
                    )
                })
            },

            clearAllData: () => set({ transactions: [] }),
        }),
        {
            name: 'transaction-storage',
            version: 2,
            storage: createJSONStorage(() => new MMKVStorageService()),
            migrate: (persistedState: any, version: number) => {
                if (version < 2) {
                    return { transactions: [] }
                }
                return persistedState as any
            },
        },
    ),
)
