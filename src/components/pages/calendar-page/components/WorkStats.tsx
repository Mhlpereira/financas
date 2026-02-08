import { formatCurrencySimple } from '@/src/utils/formatCurrency'
import { Text, View } from 'react-native'
import { styles } from '../calendar-page.style'

interface WorkStatsProps {
    workedDays: number
    businessDays: number
    monthTotal: number
}

export function WorkStats({
    workedDays,
    businessDays,
    monthTotal,
}: WorkStatsProps) {
    return (
        <View style={styles.statsContainer}>
            <View style={styles.statCard}>
                <Text style={styles.statLabel}>Dias</Text>
                <Text style={[styles.statValue, styles.statValueHighlight]}>
                    {workedDays}
                </Text>
            </View>
            <View style={styles.statCard}>
                <Text style={styles.statLabel}>Dias úteis</Text>
                <Text style={styles.statValue}>{businessDays}</Text>
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
    )
}
