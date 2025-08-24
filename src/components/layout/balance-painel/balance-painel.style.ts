import { colors } from "@/src/themes";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    balancePainel: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: colors.border,
    },
    
    mesAno: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.text,
        textAlign: "center",
        marginBottom: 12,
    },
    
    disponivelContainer: {
        alignItems: "center",
        marginBottom: 12,
        padding: 12,
        backgroundColor: colors.gray50,
        borderRadius: 8,
    },
    
    titulo: {
        fontSize: 13,
        color: colors.textSecondary,
        textAlign: "center",
        marginBottom: 4,
        fontWeight: "500",
    },
    
    disponivel: {
        fontSize: 24,
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