import { TransactionType } from '@/src/shared/enums/transaction.enum'
import { Transaction } from '@/src/shared/interfaces/transaction.interface'
import { useTransactionStore } from '@/src/store/useTransactionStore'
import { getToday } from '@/src/utils/getToday'
import { maskDate } from '@/src/utils/mask/maskDate'
import React from 'react'
import { Controller, FieldValues, useForm } from 'react-hook-form'
import { Text, TextInput, View } from 'react-native'
import uuid from 'react-native-uuid'
import { NewButton } from '../button'
import { styles } from './expense-form.style'

interface ExpenseFormProps {
    onSuccess?: () => void;
}

export function ExpenseForm({ onSuccess }: ExpenseFormProps) {
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FieldValues>({
        defaultValues: {
            installments: '1',
            date: getToday(),
        },
    })

    const addTransaction = useTransactionStore((state) => state.addTransaction);
    const addTransactionWithInstallments = useTransactionStore((state) => state.addTransactionWithInstallments);

    const [type, setType] = React.useState<TransactionType>(
        TransactionType.INCOME,
    )

    const onSubmit = async (data: any) => {
        const installments = Number(data.installments);
        
        let transactionDate = new Date();
        if (data.date) {
            const [day, month, year] = data.date.split('/');
            transactionDate = new Date(year, month - 1, day);
        }
        
        const transaction: Transaction = {
            id: uuid.v4() as string,
            type,
            title: data.title,
            amount: Number(data.value),
            date: transactionDate, 
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        if (installments > 1) {
            addTransactionWithInstallments(transaction, installments);
        } else {
            addTransaction(transaction);
        }

        // Limpar o formulário após salvar
        reset({
            title: '',
            value: '',
            installments: '1',
            date: getToday(),
        });

        // Resetar o tipo para entrada
        setType(TransactionType.INCOME);

        // Chamar callback de sucesso se fornecido
        if (onSuccess) {
            onSuccess();
        }
    };

    return (
        <View>
            <Controller
                control={control}
                name="title"
                rules={{ required: 'Nome é obrigatório' }}
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
            <View style={styles.valueInstallment}>
                <Controller
                    control={control}
                    name="value"
                    rules={{
                        required: 'Valor é obrigatório',
                        pattern: {
                            value: /^[0-9]+$/,
                            message: 'Valor deve ser um número',
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
                            placeholder="Valor"
                            value={value}
                            onChangeText={onChange}
                            keyboardType="numeric"
                            style={styles.inputFlex}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="installments"
                    rules={{
                        pattern: {
                            value: /^[0-9]+$/,
                            message: 'Valor deve ser um número',
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
                            placeholder="Parcelas"
                            value={value}
                            onChangeText={onChange}
                            keyboardType="numeric"
                            style={styles.inputFlex}
                        />
                    )}
                />
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
                bText="Salvar"
                onPress={handleSubmit(onSubmit)}
                variant="primary"
                style={{ marginTop: 16 }}
            />
        </View>
    )
}
