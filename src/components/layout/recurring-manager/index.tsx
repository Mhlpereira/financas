import { useRecurringTransactionStore } from '@/src/store/useRecurringTransactionStore';
import { formatCurrencySimple } from '@/src/utils/formatCurrency';
import { useState } from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { RecurrenceType } from '../../../shared/interfaces/recurringTransaction.interface';
import { CustomModal } from '../../ui/modal';
import { RecurringTransactionForm } from '../../ui/recurring-form';
import { styles } from './recurring-manager.style';

export function RecurringManager() {
    const [isModalVisible, setModalVisible] = useState(false);
    const recurringTransactions = useRecurringTransactionStore(state => state.recurringTransactions);
    const removeRecurringTransaction = useRecurringTransactionStore(state => state.removeRecurringTransaction);
    const updateRecurringTransaction = useRecurringTransactionStore(state => state.updateRecurringTransaction);

    const getRecurrenceText = (recurrence: RecurrenceType, dayOfMonth?: number, dayOfWeek?: number, monthOfYear?: number) => {
        switch (recurrence) {
            case RecurrenceType.MONTHLY:
                return `Todo dia ${dayOfMonth || 1} do mês`;
            case RecurrenceType.WEEKLY:
                const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
                return `Toda ${days[dayOfWeek || 0]}`;
            case RecurrenceType.YEARLY:
                const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
                return `Todo ${dayOfMonth || 1} de ${months[(monthOfYear || 1) - 1]}`;
            default:
                return 'Recorrente';
        }
    };

    const handleToggleActive = (id: string, currentStatus: boolean) => {
        updateRecurringTransaction(id, { isActive: !currentStatus });
    };

    const handleDeleteTransaction = (item: any) => {
        Alert.alert(
            "Excluir transação recorrente",
            `Você deseja excluir "${item.title}"?`,
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

    const renderRecurringItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.row}>
                <View style={[
                    styles.iconContainer,
                    item.type === 'income' ? styles.salaryIcon : styles.expenseIcon
                ]}>
                    <Icon 
                        name={item.type === 'income' ? 'dollarcircle' : 'minuscircle'} 
                        size={20} 
                        color={item.type === 'income' ? '#059669' : '#dc2626'} 
                    />
                </View>
                
                <View style={styles.contentContainer}>
                    <View style={styles.descriptionCol}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.recurrenceInfo}>
                            {getRecurrenceText(item.recurrenceType, item.dayOfMonth, item.dayOfWeek, item.monthOfYear)}
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
                        </View>
                        
                        <TouchableOpacity 
                            style={[styles.toggleButton, item.isActive && styles.activeToggle]}
                            onPress={() => handleToggleActive(item.id, item.isActive)}
                        >
                            <Icon 
                                name={item.isActive ? "checkcircle" : "closecircle"} 
                                size={16} 
                                color={item.isActive ? "#059669" : "#6b7280"} 
                            />
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={styles.deleteButton}
                            onPress={() => handleDeleteTransaction(item)}
                        >
                            <Icon name="delete" size={16} color="#dc2626" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );

    const renderEmptyList = () => (
        <View style={styles.emptyContainer}>
            <Icon name="clockcircle" size={48} color="#9ca3af" />
            <Text style={styles.emptyText}>
                Nenhuma transação recorrente configurada
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Icon name="clockcircle" size={24} color="#1f2937" />
                <Text style={styles.headerTitle}>Transações Recorrentes</Text>
            </View>
            
            <FlatList
                data={recurringTransactions}
                keyExtractor={item => item.id}
                renderItem={renderRecurringItem}
                ListEmptyComponent={renderEmptyList}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />

            <TouchableOpacity 
                style={styles.addButton}
                onPress={() => setModalVisible(true)}
            >
                <Icon name="plus" size={24} color="#ffffff" />
            </TouchableOpacity>
            
            <CustomModal 
                visible={isModalVisible}
                onClose={() => setModalVisible(false)}
                title="Nova Transação Recorrente"
            >
                <RecurringTransactionForm onSuccess={() => setModalVisible(false)} />
            </CustomModal>
        </View>
    );
}
