import { TransactionType } from '@/src/shared/enums/transaction.enum'
import { useTransactionStore } from '@/src/store/useTransactionStore'
import { formatCurrencySimple } from '@/src/utils/formatCurrency'
import React from 'react'
import { Text, View } from 'react-native'
import { styles } from './balance-painel.style'

interface BalancePainelProps {
    selectedMonth: number;
}

const monthNames = [
    '', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export function BalancePainel({ selectedMonth }: BalancePainelProps) {
    const transactions = useTransactionStore(state => state.transactions);
    const generateRecurringTransactions = useTransactionStore(state => state.generateRecurringTransactions);
    
    React.useEffect(() => {
        const currentYear = new Date().getFullYear();
        generateRecurringTransactions(selectedMonth, currentYear);
    }, [selectedMonth, generateRecurringTransactions]);
    
    const monthTransactions = transactions.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate.getMonth() + 1 === selectedMonth;
    });
    
    const valorRecebido = monthTransactions
        .filter(t => t.type === TransactionType.INCOME)
        .reduce((sum, t) => sum + t.amount, 0);
        
    const valorUsado = monthTransactions
        .filter(t => t.type === TransactionType.EXPENSE)
        .reduce((sum, t) => sum + t.amount, 0);
        
    const disponivel = valorRecebido - valorUsado;
    
    const mesAno = `${monthNames[selectedMonth]}/${new Date().getFullYear()}`;

    return (
        <>
            <View style={styles.balancePainel}>
                <Text style={styles.mesAno}>{mesAno}</Text>
                
                <View style={styles.disponivelContainer}>
                    <Text style={styles.titulo}>Disponível</Text>
                    <Text style={styles.disponivel}>
                        {formatCurrencySimple(disponivel)}
                    </Text>
                </View>
                
                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.label}>Receitas</Text>
                        <Text style={[styles.valor, styles.valorReceita]}>
                            {formatCurrencySimple(valorRecebido)}
                        </Text>
                    </View>
                    <View style={styles.col}>
                        <Text style={styles.label}>Despesas</Text>
                        <Text style={[styles.valor, styles.valorDespesa]}>
                            {formatCurrencySimple(valorUsado)}
                        </Text>
                    </View>
                </View>
            </View>
        </>
    )
}
