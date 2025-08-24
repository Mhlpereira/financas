import React, { useState } from "react";
import { View, Text, TextInput, Alert, StyleSheet } from "react-native";
import { NewButton } from "../../ui/button";
import { formatCurrency } from "../../../utils/formatCurrency";
import { colors } from "../../../themes";

interface ISalaryFormProps {
    initialAmount?: number;
    onSave: (amount: number) => void;
    onCancel: () => void;
    isEditing?: boolean;
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 24,
        marginHorizontal: 16,
        shadowColor: colors.gray600,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: colors.text,
        marginBottom: 24,
        textAlign: "center",
    },
    inputContainer: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.text,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        padding: 16,
        fontSize: 18,
        color: colors.text,
        backgroundColor: colors.gray50,
        fontWeight: "600",
        textAlign: "center",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
    },
    cancelButton: {
        flex: 1,
    },
    saveButton: {
        flex: 1,
    },
});

interface ISalaryFormProps {
    initialAmount?: number;
    onSave: (amount: number) => void;
    onCancel: () => void;
    isEditing?: boolean;
}

export const SalaryForm: React.FC<ISalaryFormProps> = ({
    initialAmount = 0,
    onSave,
    onCancel,
    isEditing = false
}) => {
    const [amount, setAmount] = useState(initialAmount.toString());

    const handleAmountChange = (text: string) => {
        const numericValue = text.replace(/[^0-9]/g, "");
        setAmount(numericValue);
    };

    const handleSave = () => {
        const numericAmount = parseFloat(amount);
        
        if (isNaN(numericAmount) || numericAmount <= 0) {
            Alert.alert("Erro", "Por favor, insira um valor válido para o salário.");
            return;
        }

        onSave(numericAmount);
    };

    const getFormattedValue = () => {
        const numericValue = parseFloat(amount) || 0;
        return formatCurrency(numericValue / 100);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {isEditing ? "Editar Salário" : "Adicionar Salário"}
            </Text>
            
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Valor do Salário</Text>
                <TextInput
                    style={styles.input}
                    value={getFormattedValue()}
                    onChangeText={handleAmountChange}
                    keyboardType="numeric"
                    placeholder="R$ 0,00"
                    placeholderTextColor="#9ca3af"
                />
            </View>

            <View style={styles.buttonContainer}>
                <NewButton
                    bText="Cancelar"
                    onPress={onCancel}
                    variant="secondary"
                    style={styles.cancelButton}
                />
                <NewButton
                    bText={isEditing ? "Atualizar" : "Salvar"}
                    onPress={handleSave}
                    variant="primary"
                    style={styles.saveButton}
                />
            </View>
        </View>
    );
};
