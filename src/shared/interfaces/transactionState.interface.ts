import { Transaction } from './transaction.interface'

export interface TransactionState {
    transactions: Transaction[]
    loadData: () => Promise<void>
    addTransaction: (
        transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>,
    ) => void
    addTransactionWithInstallments: (
        transaction: Omit<
            Transaction,
            | 'id'
            | 'createdAt'
            | 'updatedAt'
            | 'installments'
            | 'currentInstallment'
            | 'parentId'
        >,
        installments: number,
    ) => void
    updateTransaction: (id: string, data: Partial<Transaction>) => void
    removeTransaction: (transactionId: string) => void
    removeAllInstallments: (parentId: string) => void
    getTransactionsByMonth: (month: number, year: number) => Transaction[]
    clearAllData: () => void
}
