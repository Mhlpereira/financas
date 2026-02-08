import { Frequency, TransactionType } from '@/src/shared/enums/transaction.enum'
import { useTransactionStore } from '@/src/store/useTransaction.store'
import { useUIStore } from '@/src/store/useUI.store'
import { useState } from 'react'
import {
    Alert,
    ScrollView,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import { styles } from './expense-form.style'

interface ExpenseFormProps {
    onSuccess: () => void
}

const typeOptions: { label: string; value: TransactionType }[] = [
    { label: 'Despesa', value: TransactionType.EXPENSE },
    { label: 'Receita', value: TransactionType.INCOME },
]

const frequencyOptions: { label: string; value: Frequency }[] = [
    { label: 'Único', value: Frequency.ONE_TIME },
    { label: 'Mensal', value: Frequency.MONTHLY },
    { label: 'Semanal', value: Frequency.WEEKLY },
    { label: 'Anual', value: Frequency.YEARLY },
]

export function ExpenseForm({ onSuccess }: ExpenseFormProps) {
    const selectedMonth = useUIStore((s) => s.selectedMonth)
    const selectedYear = useUIStore((s) => s.selectedYear)

    const addTransaction = useTransactionStore((s) => s.addTransaction)
    const addTransactionWithInstallments = useTransactionStore(
        (s) => s.addTransactionWithInstallments,
    )

    const [description, setDescription] = useState('')
    const [amount, setAmount] = useState('')
    const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE)
    const [frequency, setFrequency] = useState<Frequency>(Frequency.ONE_TIME)
    const [isInstallment, setIsInstallment] = useState(false)
    const [installments, setInstallments] = useState('')
    const [day, setDay] = useState(new Date().getDate().toString())

    const handleAmountChange = (text: string) => {
        const numericValue = text.replace(/[^0-9]/g, '')
        setAmount(numericValue)
    }

    const getFormattedAmount = (): string => {
        const value = parseInt(amount || '0', 10) / 100
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        })
    }

    const handleSubmit = () => {
        if (!description.trim()) {
            Alert.alert('Erro', 'Informe a descrição.')
            return
        }

        const numericAmount = parseInt(amount || '0', 10) / 100
        if (numericAmount <= 0) {
            Alert.alert('Erro', 'Informe um valor válido.')
            return
        }

        const dayNum = parseInt(day, 10)
        if (isNaN(dayNum) || dayNum < 1 || dayNum > 31) {
            Alert.alert('Erro', 'Informe um dia válido (1-31).')
            return
        }

        const startDate = new Date(
            selectedYear,
            selectedMonth - 1,
            dayNum,
        ).toISOString()

        const transactionData = {
            description: description.trim(),
            amount: numericAmount,
            type,
            frequency: isInstallment ? Frequency.ONE_TIME : frequency,
            startDate,
        }

        if (isInstallment) {
            const numInstallments = parseInt(installments, 10)
            if (isNaN(numInstallments) || numInstallments < 2) {
                Alert.alert('Erro', 'Informe ao menos 2 parcelas.')
                return
            }
            addTransactionWithInstallments(transactionData, numInstallments)
        } else {
            addTransaction(transactionData)
        }

        onSuccess()
    }

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            {/* Type selector */}
            <View style={styles.buttonContainer}>
                {typeOptions.map((opt) => (
                    <TouchableOpacity
                        key={opt.value}
                        style={[
                            styles.button,
                            {
                                backgroundColor:
                                    type === opt.value ? '#3b82f6' : '#e5e7eb',
                                borderRadius: 8,
                                paddingVertical: 10,
                                alignItems: 'center',
                            },
                        ]}
                        onPress={() => setType(opt.value)}
                    >
                        <Text
                            style={{
                                color: type === opt.value ? '#fff' : '#374151',
                                fontWeight: '600',
                            }}
                        >
                            {opt.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Description */}
            <TextInput
                style={styles.input}
                placeholder="Descrição"
                placeholderTextColor="#9ca3af"
                value={description}
                onChangeText={setDescription}
            />

            {/* Amount + Day */}
            <View style={styles.valueInstallment}>
                <TextInput
                    style={styles.inputFlex}
                    placeholder="R$ 0,00"
                    placeholderTextColor="#9ca3af"
                    value={getFormattedAmount()}
                    onChangeText={handleAmountChange}
                    keyboardType="numeric"
                />
                <TextInput
                    style={[styles.input, { width: 70 }]}
                    placeholder="Dia"
                    placeholderTextColor="#9ca3af"
                    value={day}
                    onChangeText={(t) => setDay(t.replace(/[^0-9]/g, ''))}
                    keyboardType="numeric"
                    maxLength={2}
                />
            </View>

            {/* Frequency selector */}
            {!isInstallment && (
                <>
                    <Text style={styles.sectionTitle}>Frequência</Text>
                    <View style={styles.buttonContainer}>
                        {frequencyOptions.map((opt) => (
                            <TouchableOpacity
                                key={opt.value}
                                style={[
                                    styles.button,
                                    {
                                        backgroundColor:
                                            frequency === opt.value
                                                ? '#3b82f6'
                                                : '#e5e7eb',
                                        borderRadius: 8,
                                        paddingVertical: 8,
                                        paddingHorizontal: 4,
                                        alignItems: 'center',
                                    },
                                ]}
                                onPress={() => setFrequency(opt.value)}
                            >
                                <Text
                                    style={{
                                        color:
                                            frequency === opt.value
                                                ? '#fff'
                                                : '#374151',
                                        fontWeight: '600',
                                        fontSize: 12,
                                    }}
                                >
                                    {opt.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </>
            )}

            {/* Installment toggle */}
            {frequency === Frequency.ONE_TIME && (
                <View style={styles.recurringToggle}>
                    <Switch
                        value={isInstallment}
                        onValueChange={(v) => {
                            setIsInstallment(v)
                            if (v) setFrequency(Frequency.ONE_TIME)
                        }}
                        trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                        thumbColor={isInstallment ? '#3b82f6' : '#f4f3f4'}
                    />
                    <Text style={styles.recurringText}>Parcelado</Text>
                </View>
            )}

            {isInstallment && (
                <TextInput
                    style={styles.input}
                    placeholder="Nº de parcelas"
                    placeholderTextColor="#9ca3af"
                    value={installments}
                    onChangeText={(t) =>
                        setInstallments(t.replace(/[^0-9]/g, ''))
                    }
                    keyboardType="numeric"
                    maxLength={3}
                />
            )}

            {/* Submit */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[
                        styles.button,
                        {
                            backgroundColor: '#3b82f6',
                            borderRadius: 8,
                            paddingVertical: 14,
                            alignItems: 'center',
                        },
                    ]}
                    onPress={handleSubmit}
                >
                    <Text
                        style={{
                            color: '#fff',
                            fontWeight: '700',
                            fontSize: 16,
                        }}
                    >
                        Salvar
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}
