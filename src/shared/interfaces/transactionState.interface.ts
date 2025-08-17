import { RecurringTransaction } from "./recurringTransaction.interface"
import { Transaction } from "./transaction.interface"

export interface TransactionState {
  transactions: Transaction[]
  recurringTransactions: RecurringTransaction[]
  addTransaction: (transaction: Transaction) => void
  removeTransaction: (transactionId: string) => void
  addTransactionWithInstallments: (transaction: Transaction, installments: number) => void
  addRecurringTransaction: (transaction: RecurringTransaction) => void
  removeRecurringTransaction: (transactionId: string) => void
  generateRecurringTransactions: (month: number, year: number) => void
}