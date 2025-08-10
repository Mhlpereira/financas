import { Transaction } from "./transaction.interface"

export interface TransactionState {
  transactions: Transaction[]
  addTransaction: (transaction: Transaction) => void
}