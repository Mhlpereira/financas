import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { MMKVStorageService } from '../services/MMKVStorage.service'

type Page = 'home' | 'user' | 'expenses' | 'calendar'

interface UIStore {
    // navigation
    currentPage: Page
    setCurrentPage: (page: Page) => void

    // user
    userName: string
    setUserName: (name: string) => void

    // month/year
    selectedMonth: number
    selectedYear: number
    selectedDate: string
    isAddModalOpen: boolean
    setSelectedMonth: (month: number) => void
    setSelectedYear: (year: number) => void
    setSelectedDate: (date: string) => void
    navigateMonth: (direction: 'prev' | 'next') => void
    openAddModal: () => void
    closeAddModal: () => void
    toggleAddModal: () => void
}

const today = new Date()

export const useUIStore = create<UIStore>()(
    persist(
        (set) => ({
            currentPage: 'home',
            setCurrentPage: (page) => set({ currentPage: page }),

            userName: '',
            setUserName: (name) => set({ userName: name }),

            selectedMonth: today.getMonth() + 1,
            selectedYear: today.getFullYear(),
            selectedDate: '',
            isAddModalOpen: false,
            setSelectedMonth: (month) => set({ selectedMonth: month }),
            setSelectedYear: (year) => set({ selectedYear: year }),
            setSelectedDate: (date) => set({ selectedDate: date }),
            navigateMonth: (direction) =>
                set((state) => {
                    if (direction === 'next') {
                        const isDecember = state.selectedMonth === 12
                        return {
                            selectedMonth: isDecember
                                ? 1
                                : state.selectedMonth + 1,
                            selectedYear: isDecember
                                ? state.selectedYear + 1
                                : state.selectedYear,
                        }
                    }
                    const isJanuary = state.selectedMonth === 1
                    return {
                        selectedMonth: isJanuary ? 12 : state.selectedMonth - 1,
                        selectedYear: isJanuary
                            ? state.selectedYear - 1
                            : state.selectedYear,
                    }
                }),
            openAddModal: () => set({ isAddModalOpen: true }),
            closeAddModal: () => set({ isAddModalOpen: false }),
            toggleAddModal: () =>
                set((state) => ({ isAddModalOpen: !state.isAddModalOpen })),
        }),
        {
            name: 'ui-storage',
            version: 2,
            storage: createJSONStorage(() => new MMKVStorageService()),
            partialize: (state) => ({
                userName: state.userName,
            }),
        },
    ),
)
