import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './expense-manager.style';

const expense = [
    {
        id: 1,
        description: 'Aluguel',
        value: 1200,
        installment: '8/12',
        date: '2025-08-01',
    },
    {
        id: 2,
        description: 'Internet',
        value: 200,
        installment: '0',
        date: '2025-08-05',
    },
    {
        id: 3,
        description: 'Supermercado',
        value: 500,
        installment: '0',
        date: '2025-08-10',
    },
    {
        id: 4,
        description: 'memória ram',
        value: 300,
        installment: '2/4',
        date: '2025-08-15',
    },
    {
        id: 5,
        description: 'Conta de luz',
        value: 150,
        installment: '0',
        date: '2025-08-20',
    },
    {
        id: 6,
        description: 'Conta de água',
        value: 100,
        installment: '0',
        date: '2025-08-25',
    },
    {     id: 7,   
        description: 'Telefone',
        value: 80,
        installment: '0',
        date: '2025-08-30',
    }, 

]

export function ExpenseManager() {
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <Text style={styles.description}>Lançamentos</Text>
                <Text style={[styles.value, { textAlign: 'right', flex: 1 }]}>
                    {expense.length} 
                </Text>
            </View>
            <FlatList
                data={expense}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onPress={() => {}}>
                        <View style={styles.row}>
                            <View style={styles.descriptionCol}>
                                <Text style={styles.description}>{item.description}</Text>
                                <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
                            </View>
                            <View style={styles.valueCol}>
                                <Text style={styles.value}>R$ {item.value.toFixed(2).replace('.', ',')}</Text>
                                {item.installment !== '0' && (
                                    <Text style={styles.installment}>{item.installment}</Text>
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                initialNumToRender={5} 
            />
        </View>
    );
}
