import { TransactionType } from '@/src/shared/enums/transaction.enum'
import { Transaction } from '@/src/shared/interfaces/transaction.interface'
import { useTransactionStore } from '@/src/store/useTransactionStore'
import { getToday } from '@/src/utils/getToday'
import { maskDate } from '@/src/utils/mask/maskDate'
import React from 'react'
import { Controller, FieldValues, useForm } from 'react-hook-form'
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native'
import uuid from 'react-native-uuid'
import Icon from 'react-native-vector-icons/AntDesign'
import { NewButton } from '../button'
import { styles } from './expense-form.style'

interface ExpenseFormProps {
    onSuccess?: () => void;
    selectedMonth?: number;
}

const CATEGORIES = [
    { id: 'food', name: 'Alimentação', icon: 'twitter' },
    { id: 'transport', name: 'Transporte', icon: 'car' },
    { id: 'health', name: 'Saúde', icon: 'medicinebox' },
    { id: 'education', name: 'Educação', icon: 'book' },
    { id: 'entertainment', name: 'Entretenimento', icon: 'playcircleo' },
    { id: 'shopping', name: 'Compras', icon: 'shoppingcart' },
    { id: 'bills', name: 'Contas', icon: 'filetext1' },
    { id: 'other', name: 'Outros', icon: 'ellipsis1' },
];

export function ExpenseForm({ onSuccess, selectedMonth }: ExpenseFormProps) {
    const getDefaultDate = () => {
        const today = new Date();
        const currentMonth = today.getMonth() + 1; // getMonth() retorna 0-11, então +1
        const currentYear = today.getFullYear();
        
        if (selectedMonth && selectedMonth !== currentMonth) {
            const defaultDate = new Date(currentYear, selectedMonth - 1, 1);
            return defaultDate.toLocaleDateString('pt-BR');
        } else {
            return getToday();
        }
    };

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FieldValues>({
        defaultValues: {
            installments: '',
            date: getDefaultDate(),
            category: 'other',
        },
    })

    const addTransaction = useTransactionStore((state) => state.addTransaction);
    const addTransactionWithInstallments = useTransactionStore((state) => state.addTransactionWithInstallments);
    const addRecurringTransaction = useTransactionStore((state) => state.addRecurringTransaction);

    const [type, setType] = React.useState<TransactionType>(TransactionType.EXPENSE)
    const [isRecurring, setIsRecurring] = React.useState(false)
    const [showCategoryModal, setShowCategoryModal] = React.useState(false)
    const [selectedCategory, setSelectedCategory] = React.useState(CATEGORIES[0]) 

    const onSubmit = async (data: any) => {
        const installments = Number(data.installments) || 1; 

        let transactionDate = new Date();
        if (data.date) {
            const [day, month, year] = data.date.split('/');
            transactionDate = new Date(year, month - 1, day);
        }
        
        const numericValue = Number(data.value.replace(',', '.'));
        
        if (isRecurring) {
            const recurringTransaction = {
                id: uuid.v4() as string,
                type,
                title: data.title,
                amount: numericValue,
                recurrenceType: 'monthly' as any, 
                dayOfMonth: transactionDate.getDate(),
                isActive: true,
                startDate: transactionDate,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            addRecurringTransaction(recurringTransaction);
        } else {
            const transaction: Transaction = {
                id: uuid.v4() as string,
                type,
                title: data.title,
                amount: numericValue,
                date: transactionDate, 
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            if (installments > 1) {
                addTransactionWithInstallments(transaction, installments);
            } else {
                addTransaction(transaction);
            }
        }

        reset({
            title: '',
            value: '',
            installments: '1',
            date: getDefaultDate(),
            category: 'other',
        });

        setType(TransactionType.EXPENSE);
        setIsRecurring(false);
        setSelectedCategory(CATEGORIES[7]);

        if (onSuccess) {
            onSuccess();
        }
    };

    const renderCategoryModal = () => (
        <Modal
            visible={showCategoryModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowCategoryModal(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Escolher Categoria</Text>
                        <TouchableOpacity 
                            onPress={() => setShowCategoryModal(false)}
                            style={styles.closeButton}
                        >
                            <Icon name="close" size={24} color="#6b7280" />
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.categoriesGrid}>
                        {CATEGORIES.map((category) => (
                            <TouchableOpacity
                                key={category.id}
                                style={[
                                    styles.categoryItem,
                                    selectedCategory.id === category.id && styles.selectedCategory
                                ]}
                                onPress={() => {
                                    setSelectedCategory(category);
                                    setShowCategoryModal(false);
                                }}
                            >
                                <Icon 
                                    name={category.icon} 
                                    size={24} 
                                    color={selectedCategory.id === category.id ? '#fff' : '#6b7280'} 
                                />
                                <Text style={[
                                    styles.categoryText,
                                    selectedCategory.id === category.id && styles.selectedCategoryText
                                ]}>
                                    {category.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
        </Modal>
    );

    return (
        <View>
            {renderCategoryModal()}
            
            <Controller
                control={control}
                name="title"
                render={({
                    field: { onChange, value },
                }: {
                    field: { onChange: (text: string) => void; value: string }
                }) => (
                    <TextInput
                        placeholder="Nome do lançamento"
                        value={value}
                        onChangeText={onChange}
                        style={styles.input}
                    />
                )}
            />
            {errors.title && (
                <Text style={styles.errorText}>
                    {String(errors.title.message)}
                </Text>
            )}
            
            <TouchableOpacity 
                style={styles.categorySelector}
                onPress={() => setShowCategoryModal(true)}
            >
                <Icon name={selectedCategory.icon} size={20} color="#6b7280" />
                <Text style={styles.categorySelectorText}>
                    {selectedCategory.name}
                </Text>
                <Icon name="down" size={16} color="#6b7280" />
            </TouchableOpacity>
            
            <View style={styles.valueInstallment}>
                <Controller
                    control={control}
                    name="value"
                    rules={{
                        required: 'Valor é obrigatório',
                        pattern: {
                            value: /^[0-9]+([.,][0-9]{0,2})?$/,
                            message: 'Valor deve ser um número válido (ex: 13,00 ou 13.00)',
                        },
                    }}
                    render={({
                        field: { onChange, value },
                    }: {
                        field: {
                            onChange: (text: string) => void
                            value: string
                        }
                    }) => (
                        <TextInput
                            placeholder="Valor (ex: 13,00)"
                            value={value}
                            onChangeText={(text) => {
                                const cleanText = text.replace(/[^0-9.,]/g, '');
                                const normalizedText = cleanText.replace(',', '.');
                                const parts = normalizedText.split('.');
                                if (parts.length > 2) return;
                                if (parts[1] && parts[1].length > 2) return;
                                onChange(cleanText);
                            }}
                            keyboardType="numeric"
                            style={styles.inputFlex}
                        />
                    )}
                />
                {!isRecurring && (
                    <Controller
                        control={control}
                        name="installments"
                        render={({
                            field: { onChange, value },
                        }: {
                            field: {
                                onChange: (text: string) => void
                                value: string
                            }
                        }) => (
                            <TextInput
                                placeholder="Parcelas"
                                value={value}
                                onChangeText={onChange}
                                keyboardType="numeric"
                                style={styles.inputFlex}
                            />
                        )}
                    />
                )}
            </View>
            {errors.value && (
                <Text style={styles.errorText}>
                    {String(errors.value.message)}
                </Text>
            )}
            <Controller
                control={control}
                name="date"
                rules={{ required: 'Data é obrigatória' }}
                render={({
                    field: { onChange, value },
                }: {
                    field: { onChange: (text: string) => void; value: string }
                }) => (
                    <TextInput
                        placeholder="Data do lançamento"
                        value={value}
                        onChangeText={(text) => onChange(maskDate(text))}
                        keyboardType="numeric"
                        style={styles.input}
                    />
                )}
            />
            {errors.date?.message && (
                <Text style={styles.errorText}>
                    {String(errors.date.message)}
                </Text>
            )}
            
            <TouchableOpacity 
                style={styles.recurringToggle}
                onPress={() => setIsRecurring(!isRecurring)}
            >
                <Icon 
                    name={isRecurring ? "checkcircle" : "checkcircleo"} 
                    size={20} 
                    color={isRecurring ? "#22c55e" : "#6b7280"} 
                />
                <Text style={styles.recurringText}>
                    Lançamento recorrente (mensal)
                </Text>
            </TouchableOpacity>
            
            <View style={styles.buttonContainer}>
                <NewButton
                    bText="Entrada"
                    iconName="plus"
                    onPress={() => setType(TransactionType.INCOME)}
                    variant={type === TransactionType.INCOME ? "success" : "secondary"}
                    style={styles.button}
                />
                <NewButton
                    bText="Saída"
                    iconName="minus"
                    onPress={() => setType(TransactionType.EXPENSE)}
                    variant={type === TransactionType.EXPENSE ? "danger" : "secondary"}
                    style={styles.button}
                />
            </View>

            <NewButton
                bText={isRecurring ? "Salvar Recorrente" : "Salvar Lançamento"}
                iconName={isRecurring ? "clockcircle" : "check"}
                onPress={handleSubmit(onSubmit)}
                variant="primary"
                style={{ marginTop: 16 }}
            />
        </View>
    )
}
