import uuid from 'react-native-uuid'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { MMKVStorageService } from '../services/MMKVStorage.service'

export interface WorkEntry {
    id: string
    company: string
    amount: number
}

export interface WorkDay {
    date: string
    entries: WorkEntry[]
}

interface WorkDaysStore {
    workDays: WorkDay[]
    addEntry: (date: string, company: string, amount: number) => void
    removeEntry: (date: string, entryId: string) => void
    removeWorkDay: (date: string) => void
    getWorkDay: (date: string) => WorkDay | undefined
    getWorkDaysByMonth: (month: number, year: number) => WorkDay[]
    getMonthlyTotal: (month: number, year: number) => number
    clearAllWorkDays: () => void
}

export const useWorkDaysStore = create<WorkDaysStore>()(
    persist(
        (set, get) => ({
            workDays: [],

            addEntry: (date, company, amount) =>
                set((state) => {
                    const entry: WorkEntry = {
                        id: uuid.v4() as string,
                        company,
                        amount,
                    }
                    const existing = state.workDays.find((d) => d.date === date)
                    if (existing) {
                        return {
                            workDays: state.workDays.map((d) =>
                                d.date === date
                                    ? {
                                          ...d,
                                          entries: [...d.entries, entry],
                                      }
                                    : d,
                            ),
                        }
                    }
                    return {
                        workDays: [
                            ...state.workDays,
                            { date, entries: [entry] },
                        ],
                    }
                }),

            removeEntry: (date, entryId) =>
                set((state) => {
                    const day = state.workDays.find((d) => d.date === date)
                    if (!day) return state

                    const newEntries = day.entries.filter(
                        (e) => e.id !== entryId,
                    )
                    if (newEntries.length === 0) {
                        return {
                            workDays: state.workDays.filter(
                                (d) => d.date !== date,
                            ),
                        }
                    }
                    return {
                        workDays: state.workDays.map((d) =>
                            d.date === date ? { ...d, entries: newEntries } : d,
                        ),
                    }
                }),

            removeWorkDay: (date) =>
                set((state) => ({
                    workDays: state.workDays.filter((d) => d.date !== date),
                })),

            getWorkDay: (date) => {
                return get().workDays.find((d) => d.date === date)
            },

            getWorkDaysByMonth: (month, year) => {
                return get().workDays.filter((d) => {
                    const date = new Date(d.date)
                    return (
                        date.getMonth() + 1 === month &&
                        date.getFullYear() === year
                    )
                })
            },

            getMonthlyTotal: (month, year) => {
                return get()
                    .getWorkDaysByMonth(month, year)
                    .reduce(
                        (sum, day) =>
                            sum + day.entries.reduce((s, e) => s + e.amount, 0),
                        0,
                    )
            },

            clearAllWorkDays: () => set({ workDays: [] }),
        }),
        {
            name: 'workdays-storage',
            storage: createJSONStorage(() => new MMKVStorageService()),
        },
    ),
)
