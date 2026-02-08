import { useMemo } from 'react'
import { Frequency, TransactionType } from '../shared/enums/transaction.enum'
import { useAccountStore } from '../store/useAccount.store'
import { useTransactionStore } from '../store/useTransaction.store'

export function useMonthlyTransactions(month: number, year: number) {
    const transactions = useTransactionStore((state) => state.transactions)

    return useMemo(() => {
        return transactions.filter((t) => {
            const start = new Date(t.startDate)

            switch (t.frequency) {
                case Frequency.ONE_TIME:
                    return (
                        start.getMonth() + 1 === month &&
                        start.getFullYear() === year
                    )

                case Frequency.MONTHLY: {
                    const target = new Date(year, month - 1)
                    return start <= target
                }

                case Frequency.WEEKLY: {
                    const firstDay = new Date(year, month - 1, 1)
                    const lastDay = new Date(year, month, 0)
                    return (
                        start <= lastDay &&
                        (start <= firstDay || start.getMonth() + 1 === month)
                    )
                }

                case Frequency.YEARLY:
                    return (
                        start.getMonth() + 1 === month &&
                        start.getFullYear() <= year
                    )

                default:
                    return false
            }
        })
    }, [transactions, month, year])
}

export function useMonthlyBalance(month: number, year: number) {
    const monthlyTransactions = useMonthlyTransactions(month, year)
    const salary = useAccountStore((state) => state.account.salary)

    return useMemo(() => {
        const income = monthlyTransactions
            .filter((t) => t.type === TransactionType.INCOME)
            .reduce((sum, t) => sum + t.amount, 0)

        const expense = monthlyTransactions
            .filter((t) => t.type === TransactionType.EXPENSE)
            .reduce((sum, t) => sum + t.amount, 0)

        const totalIncome = salary + income
        const balance = totalIncome - expense

        return { income, expense, salary, totalIncome, balance }
    }, [monthlyTransactions, salary])
}

export function useDailyTransactions(date: string | Date) {
    const transactions = useTransactionStore((state) => state.transactions)

    return useMemo(() => {
        const target = new Date(date)
        const targetDay = target.getDate()
        const targetMonth = target.getMonth()
        const targetYear = target.getFullYear()

        return transactions.filter((t) => {
            const start = new Date(t.startDate)

            switch (t.frequency) {
                case Frequency.ONE_TIME:
                    return (
                        start.getDate() === targetDay &&
                        start.getMonth() === targetMonth &&
                        start.getFullYear() === targetYear
                    )

                case Frequency.MONTHLY:
                    return start.getDate() === targetDay && start <= target

                case Frequency.WEEKLY: {
                    if (start > target) return false
                    return start.getDay() === target.getDay()
                }

                case Frequency.YEARLY:
                    return (
                        start.getDate() === targetDay &&
                        start.getMonth() === targetMonth &&
                        start.getFullYear() <= targetYear
                    )

                default:
                    return false
            }
        })
    }, [transactions, date])
}
