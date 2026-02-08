import { WorkDay, WorkEntry } from '@/src/store/useWorkDays.store'
import { colors } from '@/src/themes'
import { formatCurrencySimple } from '@/src/utils/formatCurrency'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
import { formatDate } from '../../../../shared/helpers/utils'
import { styles } from '../calendar-page.style'

interface DayDetailProps {
    date: string
    dayData: WorkDay | undefined
    dayTotal: number
    onAddPress: () => void
    onRemoveEntry: (entryId: string) => void
}

function EntryItem({
    entry,
    onRemove,
}: {
    entry: WorkEntry
    onRemove: (id: string) => void
}) {
    return (
        <View style={styles.entryCard}>
            <View style={styles.entryIcon}>
                <Icon name="team" size={16} color={colors.primary} />
            </View>
            <View style={styles.entryContent}>
                <Text style={styles.entryCompany}>{entry.company}</Text>
                <Text style={styles.entryAmount}>
                    {formatCurrencySimple(entry.amount)}
                </Text>
            </View>
            <TouchableOpacity
                style={styles.entryDelete}
                onPress={() => onRemove(entry.id)}
            >
                <Icon name="close" size={14} color={colors.danger} />
            </TouchableOpacity>
        </View>
    )
}

export function DayDetail({
    date,
    dayData,
    dayTotal,
    onAddPress,
    onRemoveEntry,
}: DayDetailProps) {
    const hasEntries = dayData && dayData.entries.length > 0

    return (
        <View style={styles.dayDetailContainer}>
            <View style={styles.dayDetailHeader}>
                <Text style={styles.dayDetailTitle}>📅 {formatDate(date)}</Text>
                <TouchableOpacity
                    style={styles.addEntryButton}
                    onPress={onAddPress}
                >
                    <Icon name="plus" size={14} color={colors.white} />
                    <Text style={styles.addEntryButtonText}>Adicionar</Text>
                </TouchableOpacity>
            </View>

            {hasEntries ? (
                <>
                    <FlatList
                        data={dayData.entries}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <EntryItem entry={item} onRemove={onRemoveEntry} />
                        )}
                        scrollEnabled={false}
                    />
                    <View style={styles.dayTotalRow}>
                        <Text style={styles.dayTotalLabel}>Total do dia</Text>
                        <Text style={styles.dayTotalValue}>
                            {formatCurrencySimple(dayTotal)}
                        </Text>
                    </View>
                </>
            ) : (
                <View style={styles.emptyDay}>
                    <Icon name="inbox" size={32} color={colors.gray300} />
                    <Text style={styles.emptyDayText}>
                        Nenhum trabalho registrado
                    </Text>
                </View>
            )}
        </View>
    )
}
