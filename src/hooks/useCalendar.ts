import { useUIStore } from '@/src/store/useUI.store'
import { useWorkDaysStore, WorkDay } from '@/src/store/useWorkDays.store'
import { colors } from '@/src/themes'
import { useMemo, useState } from 'react'
import { Alert } from 'react-native'
import { DateData } from 'react-native-calendars'

export function useCalendar() {
    const selectedMonth = useUIStore((s) => s.selectedMonth)
    const selectedYear = useUIStore((s) => s.selectedYear)
    const setSelectedMonth = useUIStore((s) => s.setSelectedMonth)
    const setSelectedYear = useUIStore((s) => s.setSelectedYear)

    const workDays = useWorkDaysStore((s) => s.workDays)
    const addEntry = useWorkDaysStore((s) => s.addEntry)
    const removeEntry = useWorkDaysStore((s) => s.removeEntry)
    const getWorkDaysByMonth = useWorkDaysStore((s) => s.getWorkDaysByMonth)
    const getMonthlyTotal = useWorkDaysStore((s) => s.getMonthlyTotal)

    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const currentMonthStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`

    const monthWorkDays = useMemo(
        () => getWorkDaysByMonth(selectedMonth, selectedYear),
        [workDays, selectedMonth, selectedYear],
    )

    const monthTotal = useMemo(
        () => getMonthlyTotal(selectedMonth, selectedYear),
        [workDays, selectedMonth, selectedYear],
    )

    const totalBusinessDays = useMemo(() => {
        const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate()
        let count = 0
        for (let d = 1; d <= daysInMonth; d++) {
            const day = new Date(selectedYear, selectedMonth - 1, d).getDay()
            if (day !== 0 && day !== 6) count++
        }
        return count
    }, [selectedMonth, selectedYear])

    const selectedDayData = useMemo<WorkDay | undefined>(() => {
        if (!selectedDate) return undefined
        return workDays.find((d) => d.date === selectedDate)
    }, [workDays, selectedDate])

    const selectedDayTotal = useMemo(() => {
        if (!selectedDayData) return 0
        return selectedDayData.entries.reduce((s, e) => s + e.amount, 0)
    }, [selectedDayData])

    const markedDates = useMemo(() => {
        const marks: Record<string, any> = {}

        monthWorkDays.forEach((day) => {
            marks[day.date] = {
                selected: true,
                selectedColor: colors.success,
                selectedTextColor: colors.white,
            }
        })

        if (selectedDate) {
            marks[selectedDate] = {
                ...(marks[selectedDate] || {}),
                selected: true,
                selectedColor: marks[selectedDate]
                    ? colors.primaryDark
                    : colors.primary,
                selectedTextColor: colors.white,
            }
        }

        const todayStr = new Date().toISOString().split('T')[0]
        if (marks[todayStr]) {
            marks[todayStr] = {
                ...marks[todayStr],
                marked: true,
                dotColor: colors.warning,
            }
        } else {
            marks[todayStr] = {
                marked: true,
                dotColor: colors.primary,
            }
        }

        return marks
    }, [monthWorkDays, selectedDate])

    const handleDayPress = (day: DateData) => {
        setSelectedDate(day.dateString)
    }

    const handleMonthChange = (date: DateData) => {
        setSelectedMonth(date.month)
        setSelectedYear(date.year)
        setSelectedDate(null)
    }

    const handleAddEntry = (company: string, amount: string) => {
        if (!selectedDate) return false
        if (!company.trim()) {
            Alert.alert('Atenção', 'Informe o nome da empresa/cliente.')
            return false
        }
        const value = parseFloat(amount.replace(',', '.'))
        if (isNaN(value) || value <= 0) {
            Alert.alert('Atenção', 'Informe um valor válido.')
            return false
        }

        addEntry(selectedDate, company.trim(), value)
        return true
    }

    const handleRemoveEntry = (entryId: string) => {
        if (!selectedDate) return
        Alert.alert('Excluir', 'Deseja remover este trabalho?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Excluir',
                style: 'destructive',
                onPress: () => removeEntry(selectedDate, entryId),
            },
        ])
    }

    return {
        currentMonthStr,
        selectedDate,
        isModalOpen,
        setIsModalOpen,
        monthWorkDays,
        monthTotal,
        totalBusinessDays,
        selectedDayData,
        selectedDayTotal,
        markedDates,
        handleDayPress,
        handleMonthChange,
        handleAddEntry,
        handleRemoveEntry,
    }
}
