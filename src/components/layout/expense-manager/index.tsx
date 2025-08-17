import { useTransactionStore } from '@/src/store/useTransactionStore';
import { formatCurrencySimple } from '@/src/utils/formatCurrency';
import { useState } from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { styles } from './expense-manager.style';

interface ExpenseManagerProps {
    selectedMonth: number;
}

export function ExpenseManager({ selectedMonth }: ExpenseManagerProps) {
    const transactions = useTransactionStore(state => state.transactions);
    const recurringTransactions = useTransactionStore(state => state.recurringTransactions);
    const removeTransaction = useTransactionStore(state => state.removeTransaction);
    const removeRecurringTransaction = useTransactionStore(state => state.removeRecurringTransaction);
    
    const [showRecurring, setShowRecurring] = useState(false);
    
    const filteredTransactions = transactions.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate.getMonth() + 1 === selectedMonth;
    });

    const filteredRecurringTransactions = recurringTransactions.filter(item => {
        // Mostrar todas as transações recorrentes independente do mês
        return true;
    });

    const handleDeleteTransaction = (item: any) => {
        Alert.alert(
            "Excluir lançamento",
            `Você deseja excluir "${item.title}"?`,
            [
                {
                    text: "Não",
                    style: "cancel"
                },
                {
                    text: "Sim",
                    style: "destructive",
                    onPress: () => removeTransaction(item.id)
                }
            ]
        );
    };

    const handleDeleteRecurringTransaction = (item: any) => {
        Alert.alert(
            "Excluir transação recorrente",
            `Você deseja excluir "${item.title}"?\nIsso impedirá a criação futura dessa transação.`,
            [
                {
                    text: "Não",
                    style: "cancel"
                },
                {
                    text: "Sim",
                    style: "destructive",
                    onPress: () => removeRecurringTransaction(item.id)
                }
            ]
        );
    };

    const renderTransactionItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.card} onPress={() => {}}>
            <View style={styles.row}>
                <View style={[
                    styles.iconContainer,
                    item.type === 'income' ? styles.incomeIcon : styles.expenseIcon
                ]}>
                    <Icon 
                        name={item.type === 'income' ? 'arrowup' : 'arrowdown'} 
                        size={20} 
                        color={item.type === 'income' ? '#059669' : '#dc2626'} 
                    />
                </View>
                
                <View style={styles.contentContainer}>
                    <View style={styles.descriptionCol}>
                        <Text style={styles.description}>{item.title}</Text>
                        <Text style={styles.date}>
                            {showRecurring 
                                ? `Recorrência: ${item.recurrenceType}` 
                                : `${new Date(item.date).toLocaleDateString('pt-BR')}${item.isInstalment ? ' • Parcelado' : ''}`
                            }
                        </Text>
                    </View>
                    
                    <View style={styles.actionsContainer}>
                        <View style={styles.valueCol}>
                            <Text style={[
                                styles.value,
                                item.type === 'income' ? styles.incomeValue : styles.expenseValue
                            ]}>
                                {item.type === 'income' ? '+' : '-'}{formatCurrencySimple(item.amount)}
                            </Text>
                            {item.isInstalment && (
                                <Text style={styles.installment}>Parcela</Text>
                            )}
                        </View>
                        
                        <TouchableOpacity 
                            style={styles.deleteButton}
                            onPress={() => showRecurring 
                                ? handleDeleteRecurringTransaction(item) 
                                : handleDeleteTransaction(item)
                            }
                        >
                            <Icon name="delete" size={16} color="#dc2626" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderEmptyList = () => (
        <View style={styles.emptyContainer}>
            <Icon name="inbox" size={48} color="#9ca3af" />
            <Text style={styles.emptyText}>
                {showRecurring 
                    ? "Nenhuma transação recorrente cadastrada"
                    : "Nenhuma transação encontrada para este mês"
                }
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Icon name="bars" size={24} color="#1f2937" />
                <Text style={styles.headerTitle}>
                    {showRecurring ? 'Recorrentes' : 'Lançamentos'}
                </Text>
                <View style={{ flex: 1 }} />
                
                <TouchableOpacity 
                    style={[styles.toggleButton, !showRecurring && styles.activeToggle]}
                    onPress={() => setShowRecurring(false)}
                >
                    <Text style={[styles.toggleText, !showRecurring && styles.activeToggleText]}>
                        Normal
                    </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.toggleButton, showRecurring && styles.activeToggle]}
                    onPress={() => setShowRecurring(true)}
                >
                    <Text style={[styles.toggleText, showRecurring && styles.activeToggleText]}>
                        Recorrente
                    </Text>
                </TouchableOpacity>
            </View>
            
            <FlatList
                data={showRecurring ? filteredRecurringTransactions : filteredTransactions}
                keyExtractor={item => item.id}
                renderItem={renderTransactionItem}
                ListEmptyComponent={renderEmptyList}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                initialNumToRender={8}
                maxToRenderPerBatch={10}
            />
        </View>
    );
}
