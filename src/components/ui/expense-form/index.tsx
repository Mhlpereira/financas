import { colors } from '@/src/themes'
import { getToday } from '@/utils/getToday'
import { maskDate } from '@/utils/mask/maskDate'
import React from 'react'
import { Controller, FieldValues, useForm } from 'react-hook-form'
import { Text, TextInput, View } from 'react-native'
import { NewButton } from '../button'
import { styles } from './expense-form.style'

export function ExpenseForm() {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            installments: '1', 
            date: getToday()
    }})

    const onSubmit = (data: any) => {
        console.log('Form Data:', data)
    }

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
                        style={{
                            borderWidth: 1,
                            borderColor: 'gray',
                            padding: 8,
                            marginBottom: 8,
                        }}
                    />
                )}
            />
            {errors.title && (
                <Text style={{ color: 'red' }}>
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
                            style={{
                                flex: 1,
                                borderWidth: 1,
                                borderColor: 'gray',
                                padding: 8,
                                marginBottom: 8,
                            }}
                        />
                    )}
                />
                {errors.value && (
                    <Text style={{ color: 'red' }}>
                        {String(errors.value.message)}
                    </Text>
                )}
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
                            style={{
                                flex: 1,
                                borderWidth: 1,
                                borderColor: 'gray',
                                padding: 8,
                                marginBottom: 8,
                            }}
                        />
                    )}
                />
                {errors.value && (
                    <Text style={{ color: 'red' }}>
                        {String(errors.value.message)}
                    </Text>
                )}
            </View>
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
                        onChangeText={text => onChange(maskDate(text))}
                        keyboardType='numeric'
                        style={{
                            borderWidth: 1,
                            borderColor: 'gray',
                            padding: 8,
                            marginBottom: 8,
                        }}
                    />
                )}
            />
            {errors.date?.message && (
                <Text style={{ color: 'red' }}>
                    {String(errors.date.message)}
                </Text>
            )}
            <View style={styles.buttonContainer}>
                <NewButton
                    bText="Entrada"
                    iconName="plus"
                    onPress={handleSubmit(onSubmit)}
                    bgColor={colors.fourth}
                    iconColor={colors.primary}
                    iconSize={20}
                    style={[styles.button, { borderColor: colors.third }]}
                />
                <NewButton
                    bText="Saida"
                    iconName="minus"
                    onPress={() => console.log('Cancel')}
                    bgColor={colors.third}
                    iconColor={colors.expense}
                    iconSize={20}
                    style={[styles.button, { borderColor: colors.third }]}
                />
            </View>

            <NewButton
                bText="Salvar"
                onPress={handleSubmit(onSubmit)}
                bgColor="#4CAF50"
                iconColor="#fff"
                iconSize={20}
                style={{ marginTop: 10 }}
            />
        </View>
    )
}
