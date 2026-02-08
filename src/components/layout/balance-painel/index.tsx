import { useMonthlyBalance } from '@/src/hooks/useTransactionSelectors'
import { useUIStore } from '@/src/store/useUI.store'
import { formatCurrencySimple } from '@/src/utils/formatCurrency'
import { Text, View } from 'react-native'
import { styles } from './balance-painel.style'

const monthNames = [
    '',
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
]

export function BalancePainel() {
    const selectedMonth = useUIStore((s) => s.selectedMonth)
    const selectedYear = useUIStore((s) => s.selectedYear)

    const { totalIncome, expense, balance } = useMonthlyBalance(
        selectedMonth,
        selectedYear,
    )

    const mesAno = `${monthNames[selectedMonth]}/${selectedYear}`

    return (
        <View style={styles.balancePainel}>
            <Text style={styles.mesAno}>{mesAno}</Text>

            <View style={styles.disponivelContainer}>
                <Text style={styles.titulo}>Disponível</Text>
                <Text style={styles.disponivel}>
                    {formatCurrencySimple(balance)}
                </Text>
            </View>

            <View style={styles.row}>
                <View style={styles.col}>
                    <Text style={styles.label}>Receitas</Text>
                    <Text style={[styles.valor, styles.valorReceita]}>
                        {formatCurrencySimple(totalIncome)}
                    </Text>
                </View>
                <View style={styles.col}>
                    <Text style={styles.label}>Despesas</Text>
                    <Text style={[styles.valor, styles.valorDespesa]}>
                        {formatCurrencySimple(expense)}
                    </Text>
                </View>
            </View>
        </View>
    )
}
