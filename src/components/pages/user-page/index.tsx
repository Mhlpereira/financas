import React, { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSalaryStore } from "../../../store/useSalaryStore";
import { colors } from "../../../themes";
import { formatCurrency } from "../../../utils/formatCurrency";
import { NewButton } from "../../ui/button";
import { CustomModal } from "../../ui/modal";
import { SalaryForm } from "../../ui/salary-form";

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
        fontWeight: "bold",
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
        fontWeight: "bold",
        color: colors.success,
        marginBottom: 8,
    },
    salaryDate: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    actionButtons: {
        flexDirection: "row",
        gap: 12,
    },
    editButton: {
        flex: 1,
    },
    deleteButton: {
        flex: 1,
    },
    noSalaryContainer: {
        alignItems: "center",
        padding: 20,
    },
    noSalaryText: {
        fontSize: 16,
        color: colors.textSecondary,
        marginBottom: 16,
        textAlign: "center",
    },
    addButton: {
        minWidth: 160,
    },
});

export const UserPage: React.FC = () => {
    const { salary, updateSalary, deleteSalary, getSalary } = useSalaryStore();
    const [showSalaryForm, setShowSalaryForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const loadSalary = useCallback(async () => {
        await getSalary();
    }, [getSalary]);

    useEffect(() => {
        loadSalary();
    }, [loadSalary]);

    const handleAddSalary = () => {
        setIsEditing(false);
        setShowSalaryForm(true);
    };

    const handleEditSalary = () => {
        setIsEditing(true);
        setShowSalaryForm(true);
    };

    const handleDeleteSalary = () => {
        Alert.alert(
            "Excluir Salário",
            "Tem certeza que deseja excluir o salário cadastrado?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: () => {
                        deleteSalary();
                        Alert.alert("Sucesso", "Salário excluído com sucesso.");
                    }
                }
            ]
        );
    };

    const handleSaveSalary = (amount: number) => {
        updateSalary(amount);
        setShowSalaryForm(false);
        Alert.alert("Sucesso", isEditing ? "Salário atualizado com sucesso." : "Salário adicionado com sucesso.");
    };

    const handleCancelForm = () => {
        setShowSalaryForm(false);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Salário</Text>
                
                {salary ? (
                    <View style={styles.salaryContainer}>
                        <View style={styles.salaryInfo}>
                            <Text style={styles.salaryLabel}>Salário Atual:</Text>
                            <Text style={styles.salaryValue}>
                                {formatCurrency(salary.amount)}
                            </Text>
                            <Text style={styles.salaryDate}>
                                Atualizado em: {new Date(salary.updatedAt).toLocaleDateString('pt-BR')}
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
                title={isEditing ? "Editar Salário" : "Adicionar Salário"}
            >
                <SalaryForm
                    initialAmount={isEditing && salary ? salary.amount : 0}
                    onSave={handleSaveSalary}
                    onCancel={handleCancelForm}
                    isEditing={isEditing}
                />
            </CustomModal>
        </ScrollView>
    );
};
