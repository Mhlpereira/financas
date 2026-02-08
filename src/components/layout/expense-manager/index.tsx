import { useMonthlyTransactions } from '@/src/hooks/useTransactionSelectors'
import { Frequency, TransactionType } from '@/src/shared/enums/transaction.enum'
import { Transaction } from '@/src/shared/interfaces/transaction.interface'
import { useTransactionStore } from '@/src/store/useTransaction.store'
import { useUIStore } from '@/src/store/useUI.store'
import { formatCurrencySimple } from '@/src/utils/formatCurrency'
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
import { styles } from './expense-manager.style'

interface ExpenseManagerProps {
    onScroll?: (scrollY: number) => void
}

const frequencyLabels: Record<Frequency, string> = {
    [Frequency.ONE_TIME]: 'Único',
    [Frequency.MONTHLY]: 'Mensal',
    [Frequency.WEEKLY]: 'Semanal',
    [Frequency.YEARLY]: 'Anual',
}

export function ExpenseManager({ onScroll }: ExpenseManagerProps) {
    const selectedMonth = useUIStore((s) => s.selectedMonth)
    const selectedYear = useUIStore((s) => s.selectedYear)

    const monthlyTransactions = useMonthlyTransactions(
        selectedMonth,
        selectedYear,
    )

    const removeTransaction = useTransactionStore(
        (state) => state.removeTransaction,
    )
    const removeAllInstallments = useTransactionStore(
        (state) => state.removeAllInstallments,
    )

    const handleDeleteTransaction = (item: Transaction) => {
        if (item.parentId) {
            Alert.alert(
                'Excluir parcelamento',
                `Como você deseja excluir "${item.description}"?`,
                [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                        text: 'Apenas esta parcela',
                        style: 'default',
                        onPress: () => removeTransaction(item.id),
                    },
                    {
                        text: 'Todas as parcelas',
                        style: 'destructive',
                        onPress: () => removeAllInstallments(item.parentId!),
                    },
                ],
            )
        } else {
            Alert.alert(
                'Excluir lançamento',
                `Você deseja excluir "${item.description}"?`,
                [
                    { text: 'Não', style: 'cancel' },
                    {
                        text: 'Sim',
                        style: 'destructive',
                        onPress: () => removeTransaction(item.id),
                    },
                ],
            )
        }
    }

    const getSubtitle = (item: Transaction): string => {
        const date = new Date(item.startDate).toLocaleDateString('pt-BR')
        const parts: string[] = [date]

        if (item.frequency !== Frequency.ONE_TIME) {
            parts.push(frequencyLabels[item.frequency])
        }

        if (item.installments && item.currentInstallment) {
            parts.push(`${item.currentInstallment}/${item.installments}`)
        }

        return parts.join(' • ')
    }

    const renderTransactionItem = ({ item }: { item: Transaction }) => (
        <TouchableOpacity style={styles.card} onPress={() => {}}>
            <View style={styles.row}>
                <View
                    style={[
                        styles.iconContainer,
                        item.type === TransactionType.INCOME
                            ? styles.incomeIcon
                            : styles.expenseIcon,
                    ]}
                >
                    <Icon
                        name={
                            item.type === TransactionType.INCOME
                                ? 'arrowup'
                                : 'arrowdown'
                        }
                        size={20}
                        color={
                            item.type === TransactionType.INCOME
                                ? '#059669'
                                : '#dc2626'
                        }
                    />
                </View>

                <View style={styles.contentContainer}>
                    <View style={styles.descriptionCol}>
                        <Text style={styles.description}>
                            {item.description}
                        </Text>
                        <Text style={styles.date}>{getSubtitle(item)}</Text>
                    </View>

                    <View style={styles.actionsContainer}>
                        <View style={styles.valueCol}>
                            <Text
                                style={[
                                    styles.value,
                                    item.type === TransactionType.INCOME
                                        ? styles.incomeValue
                                        : styles.expenseValue,
                                ]}
                            >
                                {item.type === TransactionType.INCOME
                                    ? '+'
                                    : '-'}
                                {formatCurrencySimple(item.amount)}
                            </Text>
                            {item.installments && (
                                <Text style={styles.installment}>
                                    Parcela {item.currentInstallment}/
                                    {item.installments}
                                </Text>
                            )}
                        </View>

                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => handleDeleteTransaction(item)}
                        >
                            <Icon name="delete" size={18} color="#dc2626" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )

    const renderEmptyList = () => (
        <View style={styles.emptyContainer}>
            <Icon name="inbox" size={48} color="#9ca3af" />
            <Text style={styles.emptyText}>
                Nenhuma transação encontrada para este mês
            </Text>
        </View>
    )

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Icon name="bars" size={24} color="#1f2937" />
                <Text style={styles.headerTitle}>Lançamentos</Text>
            </View>

            <FlatList
                data={monthlyTransactions}
                keyExtractor={(item) => item.id}
                renderItem={renderTransactionItem}
                ListEmptyComponent={renderEmptyList}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                initialNumToRender={12}
                maxToRenderPerBatch={15}
                windowSize={10}
                removeClippedSubviews={true}
                getItemLayout={(data, index) => ({
                    length: 70,
                    offset: 70 * index,
                    index,
                })}
                onScroll={
                    onScroll
                        ? (event) => {
                              const scrollY = event.nativeEvent.contentOffset.y
                              onScroll(scrollY)
                          }
                        : undefined
                }
                scrollEventThrottle={16}
            />
        </View>
    )
}
