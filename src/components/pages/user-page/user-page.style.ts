import { StyleSheet } from "react-native";
import { colors } from "../../../themes";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        backgroundColor: colors.primary,
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: colors.white,
        textAlign: "center",
        flex: 1,
    },
    placeholder: {
        width: 40,
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
