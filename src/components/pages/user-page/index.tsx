import React, { useState } from 'react'
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native'
import { useAccountStore } from '../../../store/useAccount.store'
import { useUIStore } from '../../../store/useUI.store'
import { colors } from '../../../themes'
import { formatCurrency } from '../../../utils/formatCurrency'
import { NewButton } from '../../ui/button'
import { CustomModal } from '../../ui/modal'
import { SalaryForm } from '../../ui/salary-form'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: 20,
    },
    section: {
        margin: 20,
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 20,
        shadowColor: colors.gray600,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 16,
    },
    salaryContainer: {
        gap: 16,
    },
    salaryInfo: {
        backgroundColor: colors.gray50,
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: colors.success,
    },
    salaryLabel: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    salaryValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.success,
        marginBottom: 8,
    },
    salaryDate: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    editButton: {
        flex: 1,
    },
    deleteButton: {
        flex: 1,
    },
    noSalaryContainer: {
        alignItems: 'center',
        padding: 20,
    },
    noSalaryText: {
        fontSize: 16,
        color: colors.textSecondary,
        marginBottom: 16,
        textAlign: 'center',
    },
    addButton: {
        minWidth: 160,
    },
})

export const UserPage: React.FC = () => {
    const salary = useAccountStore((s) => s.account.salary)
    const setSalary = useAccountStore((s) => s.setSalary)
    const userName = useUIStore((s) => s.userName)
    const setUserName = useUIStore((s) => s.setUserName)

    const [showSalaryForm, setShowSalaryForm] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [nameInput, setNameInput] = useState(userName)

    const handleAddSalary = () => {
        setIsEditing(false)
        setShowSalaryForm(true)
    }

    const handleEditSalary = () => {
        setIsEditing(true)
        setShowSalaryForm(true)
    }

    const handleDeleteSalary = () => {
        Alert.alert(
            'Excluir Salário',
            'Tem certeza que deseja excluir o salário cadastrado?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: () => {
                        setSalary(0)
                        Alert.alert('Sucesso', 'Salário excluído com sucesso.')
                    },
                },
            ],
        )
    }

    const handleSaveSalary = (amount: number) => {
        setSalary(amount)
        setShowSalaryForm(false)
        Alert.alert(
            'Sucesso',
            isEditing
                ? 'Salário atualizado com sucesso.'
                : 'Salário adicionado com sucesso.',
        )
    }

    const handleCancelForm = () => {
        setShowSalaryForm(false)
    }

    const handleSaveName = () => {
        setUserName(nameInput.trim())
        Alert.alert('Sucesso', 'Nome atualizado com sucesso.')
    }

    return (
        <ScrollView style={styles.container}>
            {/* Name Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Nome</Text>
                <View style={styles.salaryContainer}>
                    <TextInput
                        style={{
                            borderWidth: 1,
                            borderColor: colors.border,
                            borderRadius: 12,
                            padding: 16,
                            fontSize: 18,
                            color: colors.text,
                            backgroundColor: colors.gray50,
                            fontWeight: '600',
                            marginBottom: 12,
                        }}
                        placeholder="Seu nome"
                        placeholderTextColor={colors.textSecondary}
                        value={nameInput}
                        onChangeText={setNameInput}
                    />
                    <NewButton
                        bText="Salvar Nome"
                        onPress={handleSaveName}
                        variant="primary"
                        iconName="check"
                    />
                </View>
            </View>

            {/* Salary Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Salário</Text>

                {salary > 0 ? (
                    <View style={styles.salaryContainer}>
                        <View style={styles.salaryInfo}>
                            <Text style={styles.salaryLabel}>
                                Salário Atual:
                            </Text>
                            <Text style={styles.salaryValue}>
                                {formatCurrency(salary)}
                            </Text>
                        </View>

                        <View style={styles.actionButtons}>
                            <NewButton
                                bText="Editar"
                                onPress={handleEditSalary}
                                variant="primary"
                                iconName="edit"
                                style={styles.editButton}
                            />
                            <NewButton
                                bText="Excluir"
                                onPress={handleDeleteSalary}
                                variant="danger"
                                iconName="delete"
                                style={styles.deleteButton}
                            />
                        </View>
                    </View>
                ) : (
                    <View style={styles.noSalaryContainer}>
                        <Text style={styles.noSalaryText}>
                            Nenhum salário cadastrado
                        </Text>
                        <NewButton
                            bText="Adicionar Salário"
                            onPress={handleAddSalary}
                            variant="success"
                            iconName="plus"
                            style={styles.addButton}
                        />
                    </View>
                )}
            </View>

            <CustomModal
                visible={showSalaryForm}
                onClose={handleCancelForm}
                title={isEditing ? 'Editar Salário' : 'Adicionar Salário'}
            >
                <SalaryForm
                    initialAmount={isEditing ? salary : 0}
                    onSave={handleSaveSalary}
                    onCancel={handleCancelForm}
                    isEditing={isEditing}
                />
            </CustomModal>
        </ScrollView>
    )
}
