import { colors } from '@/src/themes'
import { ScrollView, Text, View } from 'react-native'
import { Calendar, LocaleConfig } from 'react-native-calendars'
import Icon from 'react-native-vector-icons/AntDesign'
import { styles } from './calendar-page.style'
import { AddEntryModal } from './components/AddEntryModal'
import { DayDetail } from './components/DayDetail'
import { WorkStats } from './components/WorkStats'
import { useCalendar } from './useCalendar'

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
    const {
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
    } = useCalendar()

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Icon name="calendar" size={22} color="#1f2937" />
                    <Text style={styles.headerTitle}>Dias Trabalhados</Text>
                </View>
            </View>

            <WorkStats
                workedDays={monthWorkDays.length}
                businessDays={totalBusinessDays}
                monthTotal={monthTotal}
            />

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

            {selectedDate ? (
                <DayDetail
                    date={selectedDate}
                    dayData={selectedDayData}
                    dayTotal={selectedDayTotal}
                    onAddPress={() => setIsModalOpen(true)}
                    onRemoveEntry={handleRemoveEntry}
                />
            ) : (
                <View style={styles.infoContainer}>
                    <Text style={styles.infoTitle}>💡 Como usar</Text>
                    <Text style={styles.infoText}>
                        Toque em um dia para ver ou adicionar trabalhos.
                        {'\n'}Cada dia pode ter vários trabalhos com empresa e
                        valor.
                    </Text>
                </View>
            )}

            <AddEntryModal
                visible={isModalOpen}
                date={selectedDate}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddEntry}
            />
        </ScrollView>
    )
}
