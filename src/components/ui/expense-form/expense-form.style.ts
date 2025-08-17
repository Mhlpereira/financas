import { colors } from "@/src/themes";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    input: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: colors.text,
        marginBottom: 16,
    },
    
    inputFlex: {
        flex: 1,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: colors.text,
        marginBottom: 16,
    },
    
    errorText: {
        color: colors.danger,
        fontSize: 14,
        marginBottom: 8,
        marginTop: -8,
    },
    
    valueInstallment: {
        flexDirection: 'row',
        gap: 8,
    },
    
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
        marginBottom: 16,
    },
    
    button: {
        flex: 1,
        height: 48,
    }
})