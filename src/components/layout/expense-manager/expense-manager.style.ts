import { colors } from "@/src/themes";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        elevation: 2,
        shadowColor: colors.gray600,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: colors.text,
        marginLeft: 12,
    },
    listContainer: {
        padding: 16,
    },
    card: {
        marginVertical: 6,
        backgroundColor: colors.surface,
        borderRadius: 12,
        elevation: 3,
        shadowColor: colors.gray600,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    incomeIcon: {
        backgroundColor: colors.successLight,
    },
    expenseIcon: {
        backgroundColor: colors.dangerLight,
    },
    contentContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    descriptionCol: {
        flex: 1,
        paddingRight: 12,
    },
    valueCol: {
        alignItems: "flex-end",
    },
    description: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.text,
        marginBottom: 2,
    },
    date: {
        fontSize: 13,
        color: colors.textSecondary,
    },
    value: {
        fontSize: 16,
        fontWeight: "700",
        textAlign: "right",
        marginBottom: 2,
    },
    incomeValue: {
        color: colors.success,
    },
    expenseValue: {
        color: colors.danger,
    },
    installment: {
        fontSize: 12,
        color: colors.textSecondary,
        textAlign: "right",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: "center",
        marginTop: 12,
    },
    deleteButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.dangerLight,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 12,
    },
    actionsContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
});