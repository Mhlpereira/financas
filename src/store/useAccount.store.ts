import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { MMKVStorageService } from '../services/MMKVStorage.service'

interface Account {
    salary: number
    cycleStartDay: number
    initialBalance?: number
}

interface AccountStore {
    account: Account
    setSalary: (salary: number) => void
    setCycleStartDay: (day: number) => void
    setInitialBalance: (balance: number) => void
    updateAccount: (data: Partial<Account>) => void
}

export const useAccountStore = create<AccountStore>()(
    persist(
        (set) => ({
            account: {
                salary: 0,
                cycleStartDay: 1,
                initialBalance: 0,
            },
            setSalary: (salary) =>
                set((state) => ({
                    account: { ...state.account, salary },
                })),
            setCycleStartDay: (day) =>
                set((state) => ({
                    account: { ...state.account, cycleStartDay: day },
                })),
            setInitialBalance: (balance) =>
                set((state) => ({
                    account: { ...state.account, initialBalance: balance },
                })),
            updateAccount: (data) =>
                set((state) => ({
                    account: { ...state.account, ...data },
                })),
        }),
        {
            name: 'account-storage',
            storage: createJSONStorage(() => new MMKVStorageService()),
        },
    ),
)
