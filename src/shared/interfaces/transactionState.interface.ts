import { Transaction } from "./transaction.interface"

export interface TransactionState {
  transactions: Transaction[]
  addTransaction: (transaction: Transaction) => void
  removeTransaction: (transactionId: string) => void
  addTransactionWithInstallments: (transaction: Transaction, installments: number) => void
}