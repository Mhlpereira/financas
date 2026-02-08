import {
    useMonthlyBalance,
    useMonthlyTransactions,
} from '@/src/hooks/useTransactionSelectors'
import { Frequency, TransactionType } from '@/src/shared/enums/transaction.enum'
import { Transaction } from '@/src/shared/interfaces/transaction.interface'
import { useTransactionStore } from '@/src/store/useTransaction.store'
import { useUIStore } from '@/src/store/useUI.store'
import { formatCurrencySimple } from '@/src/utils/formatCurrency'
import { useMemo, useState } from 'react'
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
import { styles } from './expenses-page.style'

type Filter = 'all' | 'income' | 'expense' | 'installment' | 'recurring'

const frequencyLabels: Record<Frequency, string> = {
    [Frequency.ONE_TIME]: 'Única',
    [Frequency.MONTHLY]: 'Mensal',
    [Frequency.WEEKLY]: 'Semanal',
    [Frequency.YEARLY]: 'Anual',
}

export function ExpensesPage() {
    const selectedMonth = useUIStore((s) => s.selectedMonth)
    const selectedYear = useUIStore((s) => s.selectedYear)
    const removeTransaction = useTransactionStore((s) => s.removeTransaction)
    const removeAllInstallments = useTransactionStore(
        (s) => s.removeAllInstallments,
    )

    const [filter, setFilter] = useState<Filter>('all')

    const transactions = useMonthlyTransactions(selectedMonth, selectedYear)
    const { income, expense, balance } = useMonthlyBalance(
        selectedMonth,
        selectedYear,
    )

    const filteredTransactions = useMemo(() => {
        switch (filter) {
            case 'income':
                return transactions.filter(
                    (t) => t.type === TransactionType.INCOME,
                )
            case 'expense':
                return transactions.filter(
                    (t) => t.type === TransactionType.EXPENSE,
                )
            case 'installment':
                return transactions.filter((t) => t.installments)
            case 'recurring':
                return transactions.filter(
                    (t) => t.frequency !== Frequency.ONE_TIME,
                )
            default:
                return transactions
        }
    }, [transactions, filter])

    const handleDelete = (item: Transaction) => {
        if (item.parentId) {
            Alert.alert(
                'Excluir parcelamento',
                `Como deseja excluir "${item.description}"?`,
                [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                        text: 'Apenas esta',
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
                `Deseja excluir "${item.description}"?`,
                [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                        text: 'Excluir',
                        style: 'destructive',
                        onPress: () => removeTransaction(item.id),
                    },
                ],
            )
        }
    }

    const renderItem = ({ item }: { item: Transaction }) => {
        const isIncome = item.type === TransactionType.INCOME
        const date = new Date(item.startDate)
        const dateStr = date.toLocaleDateString('pt-BR')

        return (
            <View style={styles.card}>
                <View
                    style={[
                        styles.iconContainer,
                        isIncome ? styles.incomeIcon : styles.expenseIcon,
                    ]}
                >
                    <Icon
                        name={isIncome ? 'arrowup' : 'arrowdown'}
                        size={18}
                        color={isIncome ? '#059669' : '#dc2626'}
                    />
                </View>

                <View style={styles.cardContent}>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                        {item.description}
                    </Text>
                    <Text style={styles.cardSubtitle}>
                        {dateStr}
                        {item.frequency !== Frequency.ONE_TIME &&
                            ` • ${frequencyLabels[item.frequency]}`}
                    </Text>
                </View>

                <View>
                    <Text
                        style={[
                            styles.cardAmount,
                            isIncome ? styles.incomeValue : styles.expenseValue,
                        ]}
                    >
                        {isIncome ? '+' : '-'}
                        {formatCurrencySimple(item.amount)}
                    </Text>
                    {item.installments && item.currentInstallment && (
                        <Text style={styles.installmentBadge}>
                            {item.currentInstallment}/{item.installments}x
                        </Text>
                    )}
                    {item.frequency !== Frequency.ONE_TIME && (
                        <Text style={styles.frequencyBadge}>
                            {frequencyLabels[item.frequency]}
                        </Text>
                    )}
                </View>

                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(item)}
                >
                    <Icon name="delete" size={16} color="#dc2626" />
                </TouchableOpacity>
            </View>
        )
    }

    const filters: { key: Filter; label: string }[] = [
        { key: 'all', label: 'Todos' },
        { key: 'income', label: 'Receitas' },
        { key: 'expense', label: 'Despesas' },
        { key: 'installment', label: 'Parcelados' },
        { key: 'recurring', label: 'Recorrentes' },
    ]

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Icon name="wallet" size={22} color="#1f2937" />
                    <Text style={styles.headerTitle}>Lançamentos</Text>
                </View>
                <Text style={styles.cardSubtitle}>
                    {filteredTransactions.length} itens
                </Text>
            </View>

            <View style={styles.summaryContainer}>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>Receitas</Text>
                    <Text style={[styles.summaryValue, styles.incomeValue]}>
                        {formatCurrencySimple(income)}
                    </Text>
                </View>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>Despesas</Text>
                    <Text style={[styles.summaryValue, styles.expenseValue]}>
                        {formatCurrencySimple(expense)}
                    </Text>
                </View>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>Saldo</Text>
                    <Text
                        style={[
                            styles.summaryValue,
                            balance >= 0
                                ? styles.balancePositive
                                : styles.balanceNegative,
                        ]}
                    >
                        {formatCurrencySimple(balance)}
                    </Text>
                </View>
            </View>

            <View style={styles.filterContainer}>
                {filters.map((f) => (
                    <TouchableOpacity
                        key={f.key}
                        style={[
                            styles.filterButton,
                            filter === f.key && styles.filterButtonActive,
                        ]}
                        onPress={() => setFilter(f.key)}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                filter === f.key && styles.filterTextActive,
                            ]}
                        >
                            {f.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={filteredTransactions}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Icon name="inbox" size={48} color="#9ca3af" />
                        <Text style={styles.emptyText}>
                            Nenhum lançamento encontrado
                        </Text>
                    </View>
                }
            />
        </View>
    )
}
