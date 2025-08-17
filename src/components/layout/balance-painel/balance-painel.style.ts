import { colors } from "@/src/themes";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    balancePainel: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 20,
        marginVertical: 16,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
        borderWidth: 1,
        borderColor: colors.border,
    },
    
    mesAno: {
        fontSize: 18,
        fontWeight: "600",
        color: colors.text,
        textAlign: "center",
        marginBottom: 20,
    },
    
    disponivelContainer: {
        alignItems: "center",
        marginBottom: 20,
        padding: 16,
        backgroundColor: colors.gray50,
        borderRadius: 12,
    },
    
    titulo: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: "center",
        marginBottom: 8,
        fontWeight: "500",
    },
    
    disponivel: {
        fontSize: 28,
        fontWeight: "bold",
        color: colors.primary,
        textAlign: "center",
    },
    
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 16,
    },
    
    col: {
        flex: 1,
        alignItems: "center",
        padding: 12,
        backgroundColor: colors.background,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
    },
    
    label: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 4,
        fontWeight: "500",
        textTransform: "uppercase",
    },
    
    valor: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.text,
    },
    
    valorReceita: {
        color: colors.success,
    },
    
    valorDespesa: {
        color: colors.danger,
    },
});