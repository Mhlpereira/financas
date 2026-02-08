import { Frequency, TransactionType } from '../enums/transaction.enum'

export interface Transaction {
    id: string
    description: string
    amount: number
    type: TransactionType
    frequency: Frequency
    startDate: string
    installments?: number
    currentInstallment?: number
    parentId?: string
    notes?: string
    createdAt: string
    updatedAt: string
}
