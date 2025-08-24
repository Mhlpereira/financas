import { TransactionType } from '@/src/shared/enums/transaction.enum'
import { RecurrenceType, RecurringTransaction } from '@/src/shared/interfaces/recurringTransaction.interface'
import { useRecurringTransactionStore } from '@/src/store/useRecurringTransactionStore'
import { getToday } from '@/src/utils/getToday'
import { maskDate } from '@/src/utils/mask/maskDate'
import React from 'react'
import { Controller, FieldValues, useForm } from 'react-hook-form'
import { Switch, Text, TextInput, TouchableOpacity, View } from 'react-native'
import uuid from 'react-native-uuid'
import { NewButton } from '../button'
import { styles } from './recurring-form.style'

interface RecurringTransactionFormProps {
    onSuccess?: () => void;
}

export function RecurringTransactionForm({ onSuccess }: RecurringTransactionFormProps) {
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<FieldValues>({
        defaultValues: {
            startDate: getToday(),
            isActive: true,
            recurrenceType: RecurrenceType.MONTHLY,
            dayOfMonth: 1,
            dayOfWeek: 1,
            monthOfYear: 1,
            hasEndDate: false,
        },
    })

    const addRecurringTransaction = useRecurringTransactionStore((state) => state.addRecurringTransaction);
    
    const [type, setType] = React.useState<TransactionType>(TransactionType.INCOME)
    const [recurrenceType, setRecurrenceType] = React.useState<RecurrenceType>(RecurrenceType.MONTHLY)
    
    const watchHasEndDate = watch('hasEndDate')

    const onSubmit = async (data: any) => {
        let startDate = new Date();
        if (data.startDate) {
            const [day, month, year] = data.startDate.split('/');
            startDate = new Date(year, month - 1, day);
        }
        
        let endDate: Date | undefined;
        if (data.hasEndDate && data.endDate) {
            const [day, month, year] = data.endDate.split('/');
            endDate = new Date(year, month - 1, day);
        }
        
        const recurringTransaction: RecurringTransaction = {
            id: uuid.v4() as string,
            type,
            title: data.title,
            amount: Number(data.amount),
            recurrenceType,
            dayOfMonth: recurrenceType === RecurrenceType.MONTHLY || recurrenceType === RecurrenceType.YEARLY ? Number(data.dayOfMonth) : undefined,
            dayOfWeek: recurrenceType === RecurrenceType.WEEKLY ? Number(data.dayOfWeek) : undefined,
            monthOfYear: recurrenceType === RecurrenceType.YEARLY ? Number(data.monthOfYear) : undefined,
            isActive: data.isActive,
            startDate,
            endDate,
            notes: data.notes,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        addRecurringTransaction(recurringTransaction);

        reset({
            title: '',
            amount: '',
            startDate: getToday(),
            isActive: true,
            recurrenceType: RecurrenceType.MONTHLY,
            dayOfMonth: 1,
            dayOfWeek: 1,
            monthOfYear: 1,
            hasEndDate: false,
            endDate: '',
            notes: '',
        });

        setType(TransactionType.INCOME);
        setRecurrenceType(RecurrenceType.MONTHLY);

        if (onSuccess) {
            onSuccess();
        }
    };

    const recurrenceOptions = [
        { value: RecurrenceType.MONTHLY, label: 'Mensal' },
        { value: RecurrenceType.WEEKLY, label: 'Semanal' },
        { value: RecurrenceType.YEARLY, label: 'Anual' },
    ];

    const weekDays = [
        { value: 0, label: 'Domingo' },
        { value: 1, label: 'Segunda' },
        { value: 2, label: 'Terça' },
        { value: 3, label: 'Quarta' },
        { value: 4, label: 'Quinta' },
        { value: 5, label: 'Sexta' },
        { value: 6, label: 'Sábado' },
    ];

    const months = [
        { value: 1, label: 'Janeiro' },
        { value: 2, label: 'Fevereiro' },
        { value: 3, label: 'Março' },
        { value: 4, label: 'Abril' },
        { value: 5, label: 'Maio' },
        { value: 6, label: 'Junho' },
        { value: 7, label: 'Julho' },
        { value: 8, label: 'Agosto' },
        { value: 9, label: 'Setembro' },
        { value: 10, label: 'Outubro' },
        { value: 11, label: 'Novembro' },
        { value: 12, label: 'Dezembro' },
    ];

    return (
        <View style={styles.container}>
            <Controller
                control={control}
                name="title"
                rules={{ required: 'Nome é obrigatório' }}
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        placeholder="Nome da transação (ex: Salário, Aluguel)"
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

            <Controller
                control={control}
                name="amount"
                rules={{
                    required: 'Valor é obrigatório',
                    pattern: {
                        value: /^[0-9]+$/,
                        message: 'Valor deve ser um número',
                    },
                }}
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        placeholder="Valor"
                        value={value}
                        onChangeText={onChange}
                        keyboardType="numeric"
                        style={styles.input}
                    />
                )}
            />
            {errors.amount && (
                <Text style={styles.errorText}>
                    {String(errors.amount.message)}
                </Text>
            )}

            <Text style={styles.sectionTitle}>Tipo de Transação</Text>
            <View style={styles.buttonContainer}>
                <NewButton
                    bText="Entrada (Salário)"
                    iconName="plus"
                    onPress={() => setType(TransactionType.INCOME)}
                    variant={type === TransactionType.INCOME ? "success" : "secondary"}
                    style={styles.button}
                />
                <NewButton
                    bText="Saída (Gasto)"
                    iconName="minus"
                    onPress={() => setType(TransactionType.EXPENSE)}
                    variant={type === TransactionType.EXPENSE ? "danger" : "secondary"}
                    style={styles.button}
                />
            </View>

            <Text style={styles.sectionTitle}>Frequência</Text>
            <View style={styles.recurrenceContainer}>
                {recurrenceOptions.map((option) => (
                    <TouchableOpacity
                        key={option.value}
                        style={[
                            styles.recurrenceButton,
                            recurrenceType === option.value && styles.recurrenceButtonSelected
                        ]}
                        onPress={() => setRecurrenceType(option.value)}
                    >
                        <Text style={[
                            styles.recurrenceText,
                            recurrenceType === option.value && styles.recurrenceTextSelected
                        ]}>
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {recurrenceType === RecurrenceType.MONTHLY && (
                <Controller
                    control={control}
                    name="dayOfMonth"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            placeholder="Dia do mês (1-31)"
                            value={String(value)}
                            onChangeText={onChange}
                            keyboardType="numeric"
                            style={styles.input}
                        />
                    )}
                />
            )}

            {recurrenceType === RecurrenceType.WEEKLY && (
                <Controller
                    control={control}
                    name="dayOfWeek"
                    render={({ field: { onChange, value } }) => (
                        <View style={styles.recurrenceContainer}>
                            {weekDays.map((day) => (
                                <TouchableOpacity
                                    key={day.value}
                                    style={[
                                        styles.recurrenceButton,
                                        value === day.value && styles.recurrenceButtonSelected
                                    ]}
                                    onPress={() => onChange(day.value)}
                                >
                                    <Text style={[
                                        styles.recurrenceText,
                                        value === day.value && styles.recurrenceTextSelected
                                    ]}>
                                        {day.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                />
            )}

            {recurrenceType === RecurrenceType.YEARLY && (
                <View style={styles.dateInputContainer}>
                    <Controller
                        control={control}
                        name="dayOfMonth"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                placeholder="Dia"
                                value={String(value)}
                                onChangeText={onChange}
                                keyboardType="numeric"
                                style={styles.inputFlex}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="monthOfYear"
                        render={({ field: { onChange, value } }) => (
                            <View style={[styles.inputFlex, { marginBottom: 0 }]}>
                                <View style={styles.recurrenceContainer}>
                                    {months.slice(0, 6).map((month) => (
                                        <TouchableOpacity
                                            key={month.value}
                                            style={[
                                                styles.recurrenceButton,
                                                value === month.value && styles.recurrenceButtonSelected
                                            ]}
                                            onPress={() => onChange(month.value)}
                                        >
                                            <Text style={[
                                                styles.recurrenceText,
                                                value === month.value && styles.recurrenceTextSelected
                                            ]}>
                                                {month.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                <View style={styles.recurrenceContainer}>
                                    {months.slice(6).map((month) => (
                                        <TouchableOpacity
                                            key={month.value}
                                            style={[
                                                styles.recurrenceButton,
                                                value === month.value && styles.recurrenceButtonSelected
                                            ]}
                                            onPress={() => onChange(month.value)}
                                        >
                                            <Text style={[
                                                styles.recurrenceText,
                                                value === month.value && styles.recurrenceTextSelected
                                            ]}>
                                                {month.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}
                    />
                </View>
            )}

            <Controller
                control={control}
                name="startDate"
                rules={{ required: 'Data de início é obrigatória' }}
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        placeholder="Data de início"
                        value={value}
                        onChangeText={(text) => onChange(maskDate(text))}
                        keyboardType="numeric"
                        style={styles.input}
                    />
                )}
            />
            {errors.startDate && (
                <Text style={styles.errorText}>
                    {String(errors.startDate.message)}
                </Text>
            )}

            <Controller
                control={control}
                name="hasEndDate"
                render={({ field: { onChange, value } }) => (
                    <View style={styles.switchContainer}>
                        <Text style={styles.switchLabel}>Definir data de fim</Text>
                        <Switch
                            value={value}
                            onValueChange={onChange}
                        />
                    </View>
                )}
            />

            {watchHasEndDate && (
                <Controller
                    control={control}
                    name="endDate"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            placeholder="Data de fim (opcional)"
                            value={value}
                            onChangeText={(text) => onChange(maskDate(text))}
                            keyboardType="numeric"
                            style={styles.input}
                        />
                    )}
                />
            )}

            <Controller
                control={control}
                name="notes"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        placeholder="Observações (opcional)"
                        value={value}
                        onChangeText={onChange}
                        style={styles.input}
                        multiline
                        numberOfLines={3}
                    />
                )}
            />

            <Controller
                control={control}
                name="isActive"
                render={({ field: { onChange, value } }) => (
                    <View style={styles.switchContainer}>
                        <Text style={styles.switchLabel}>Ativar transação</Text>
                        <Switch
                            value={value}
                            onValueChange={onChange}
                        />
                    </View>
                )}
            />

            <NewButton
                bText="Salvar Transação Recorrente"
                onPress={handleSubmit(onSubmit)}
                variant="primary"
                style={{ marginTop: 16 }}
            />
        </View>
    )
}
