import { Text, View } from 'react-native'
import { styles } from './expense-manager.style'

const expense = [
    {id: 1, description: 'Aluguel', value: 1200, installment:"8/12" , date: '2025-08-01'},
    {id: 2, description: 'Internet', value: 200, installment: "0" , date: '2025-08-05'},
    {id: 3, description: 'Supermercado', value: 500, installment: "0" , date: '2025-08-10'},
    {id:4, description: 'memória ram', value: 300, installment: "2/4" , date: '2025-08-15'},
]

export function ExpenseManager() {
    return (
    <View>
        <View style={styles.header}>
            <Text>Despesa</Text>
            <Text>Valor</Text>
            <Text>Parcelas</Text>
            <Text>Data</Text>
        </View>
        {expense.map(item => (
            <View key={item.id} style={styles.row}>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.value}>R$ {item.value.toFixed(2).replace('.', ',')}</Text>
                <Text style={styles.installment}>{item.installment}</Text>
                <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
            </View>
        ))}
    </View>
    )
}
