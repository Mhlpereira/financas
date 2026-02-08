import { useUIStore } from '@/src/store/useUI.store'
import {
    useWorkDaysStore,
    WorkEntry
} from '@/src/store/useWorkDays.store'
import { colors } from '@/src/themes'
import { formatCurrencySimple } from '@/src/utils/formatCurrency'
import { useMemo, useState } from 'react'
import {
    Alert,
    FlatList,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars'
import Icon from 'react-native-vector-icons/AntDesign'
import { styles } from './calendar-page.style'

LocaleConfig.locales['pt-br'] = {
    monthNames: [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro',
    ],
    monthNamesShort: [
        'Jan',
        'Fev',
        'Mar',
        'Abr',
        'Mai',
        'Jun',
        'Jul',
        'Ago',
        'Set',
        'Out',
        'Nov',
        'Dez',
    ],
    dayNames: [
        'Domingo',
        'Segunda',
        'Terça',
        'Quarta',
        'Quinta',
        'Sexta',
        'Sábado',
    ],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    today: 'Hoje',
}
LocaleConfig.defaultLocale = 'pt-br'

export function CalendarPage() {
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
    const [company, setCompany] = useState('')
    const [amount, setAmount] = useState('')

    const currentMonthStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`

    const monthWorkDays = useMemo(
        () => getWorkDaysByMonth(selectedMonth, selectedYear),
        [workDays, selectedMonth, selectedYear],
    )

    const monthTotal = useMemo(
        () => getMonthlyTotal(selectedMonth, selectedYear),
        [workDays, selectedMonth, selectedYear],
    )

    const totalWorkDays = useMemo(() => {
        const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate()
        let count = 0
        for (let d = 1; d <= daysInMonth; d++) {
            const day = new Date(selectedYear, selectedMonth - 1, d).getDay()
            if (day !== 0 && day !== 6) count++
        }
        return count
    }, [selectedMonth, selectedYear])

    const selectedDayData = useMemo(() => {
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

    const handleAddEntry = () => {
        if (!selectedDate) return
        if (!company.trim()) {
            Alert.alert('Atenção', 'Informe o nome da empresa/cliente.')
            return
        }
        const value = parseFloat(amount.replace(',', '.'))
        if (isNaN(value) || value <= 0) {
            Alert.alert('Atenção', 'Informe um valor válido.')
            return
        }

        addEntry(selectedDate, company.trim(), value)
        setCompany('')
        setAmount('')
        setIsModalOpen(false)
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

    const formatDate = (dateStr: string) => {
        const [y, m, d] = dateStr.split('-')
        return `${d}/${m}/${y}`
    }

    const renderEntry = ({ item }: { item: WorkEntry }) => (
        <View style={styles.entryCard}>
            <View style={styles.entryIcon}>
                <Icon name="team" size={16} color={colors.primary} />
            </View>
            <View style={styles.entryContent}>
                <Text style={styles.entryCompany}>{item.company}</Text>
                <Text style={styles.entryAmount}>
                    {formatCurrencySimple(item.amount)}
                </Text>
            </View>
            <TouchableOpacity
                style={styles.entryDelete}
                onPress={() => handleRemoveEntry(item.id)}
            >
                <Icon name="close" size={14} color={colors.danger} />
            </TouchableOpacity>
        </View>
    )

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Icon name="calendar" size={22} color="#1f2937" />
                    <Text style={styles.headerTitle}>Dias Trabalhados</Text>
                </View>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Dias</Text>
                    <Text style={[styles.statValue, styles.statValueHighlight]}>
                        {monthWorkDays.length}
                    </Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Dias úteis</Text>
                    <Text style={styles.statValue}>{totalWorkDays}</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Total</Text>
                    <Text
                        style={[
                            styles.statValue,
                            { fontSize: 16 },
                            styles.statValueHighlight,
                        ]}
                    >
                        {formatCurrencySimple(monthTotal)}
                    </Text>
                </View>
            </View>

            <View style={styles.calendarContainer}>
                <Calendar
                    current={`${currentMonthStr}-01`}
                    onDayPress={handleDayPress}
                    onMonthChange={handleMonthChange}
                    markedDates={markedDates}
                    firstDay={1}
                    enableSwipeMonths
                    theme={{
                        backgroundColor: colors.surface,
                        calendarBackground: colors.surface,
                        textSectionTitleColor: colors.textSecondary,
                        selectedDayBackgroundColor: colors.success,
                        selectedDayTextColor: colors.white,
                        todayTextColor: colors.primary,
                        dayTextColor: colors.text,
                        textDisabledColor: colors.gray300,
                        arrowColor: colors.primary,
                        monthTextColor: colors.text,
                        textMonthFontWeight: '700',
                        textMonthFontSize: 16,
                        textDayFontSize: 14,
                        textDayHeaderFontSize: 12,
                    }}
                />
            </View>

            {selectedDate && (
                <View style={styles.dayDetailContainer}>
                    <View style={styles.dayDetailHeader}>
                        <Text style={styles.dayDetailTitle}>
                            📅 {formatDate(selectedDate)}
                        </Text>
                        <TouchableOpacity
                            style={styles.addEntryButton}
                            onPress={() => setIsModalOpen(true)}
                        >
                            <Icon name="plus" size={14} color={colors.white} />
                            <Text style={styles.addEntryButtonText}>
                                Adicionar
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {selectedDayData && selectedDayData.entries.length > 0 ? (
                        <>
                            <FlatList
                                data={selectedDayData.entries}
                                keyExtractor={(item) => item.id}
                                renderItem={renderEntry}
                                scrollEnabled={false}
                            />
                            <View style={styles.dayTotalRow}>
                                <Text style={styles.dayTotalLabel}>
                                    Total do dia
                                </Text>
                                <Text style={styles.dayTotalValue}>
                                    {formatCurrencySimple(selectedDayTotal)}
                                </Text>
                            </View>
                        </>
                    ) : (
                        <View style={styles.emptyDay}>
                            <Icon
                                name="inbox"
                                size={32}
                                color={colors.gray300}
                            />
                            <Text style={styles.emptyDayText}>
                                Nenhum trabalho registrado
                            </Text>
                        </View>
                    )}
                </View>
            )}

            {!selectedDate && (
                <View style={styles.infoContainer}>
                    <Text style={styles.infoTitle}>💡 Como usar</Text>
                    <Text style={styles.infoText}>
                        Toque em um dia para ver ou adicionar trabalhos.
                        {'\n'}Cada dia pode ter vários trabalhos com empresa e
                        valor.
                    </Text>
                </View>
            )}

            <Modal
                visible={isModalOpen}
                transparent
                animationType="slide"
                onRequestClose={() => setIsModalOpen(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                Novo Trabalho —{' '}
                                {selectedDate && formatDate(selectedDate)}
                            </Text>
                            <TouchableOpacity
                                onPress={() => setIsModalOpen(false)}
                            >
                                <Icon
                                    name="close"
                                    size={20}
                                    color={colors.text}
                                />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.inputLabel}>Empresa / Cliente</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: Wimed, XDevh..."
                            placeholderTextColor={colors.gray400}
                            value={company}
                            onChangeText={setCompany}
                        />

                        <Text style={styles.inputLabel}>Valor (R$)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: 150,00"
                            placeholderTextColor={colors.gray400}
                            keyboardType="decimal-pad"
                            value={amount}
                            onChangeText={setAmount}
                        />

                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={handleAddEntry}
                        >
                            <Icon name="check" size={16} color={colors.white} />
                            <Text style={styles.modalButtonText}>
                                Adicionar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    )
}
