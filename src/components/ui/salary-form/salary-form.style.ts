import { StyleSheet } from "react-native";
import { colors } from "../../../themes";

export const styles = StyleSheet.create({
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
