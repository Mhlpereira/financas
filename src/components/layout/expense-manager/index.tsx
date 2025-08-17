import { useTransactionStore } from '@/src/store/useTransactionStore';
import { formatCurrencySimple } from '@/src/utils/formatCurrency';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './expense-manager.style';

interface ExpenseManagerProps {
    selectedMonth: number;
}

export function ExpenseManager({ selectedMonth }: ExpenseManagerProps) {
    const transactions = useTransactionStore(state => state.transactions);
    
    const filteredTransactions = transactions.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate.getMonth() + 1 === selectedMonth;
    });

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <Text style={styles.description}>Lançamentos</Text>
                <Text style={[styles.value, { textAlign: 'right', flex: 1 }]}>
                    {filteredTransactions.length} 
                </Text>
            </View>
            <FlatList
                data={filteredTransactions}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onPress={() => {}}>
                        <View style={styles.row}>
                            <View style={styles.descriptionCol}>
                                <Text style={styles.description}>{item.title}</Text>
                                <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
                            </View>
                            <View style={styles.valueCol}>
                                <Text style={styles.value}>{formatCurrencySimple(item.amount)}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                initialNumToRender={5} 
            />
        </View>
    );
}
