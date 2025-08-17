import { colors } from "@/src/themes";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        minHeight: 48,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    
    buttonPrimary: {
        backgroundColor: colors.primary,
    },
    
    buttonSecondary: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    
    buttonSuccess: {
        backgroundColor: colors.success,
    },
    
    buttonDanger: {
        backgroundColor: colors.danger,
    },
    
    buttonOutline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
    },
    
    buttonRounded: {
        borderRadius: 24,
        width: 48,
        height: 48,
        paddingVertical: 0,
        paddingHorizontal: 0,
    },
    
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    
    buttonTextPrimary: {
        color: colors.white,
    },
    
    buttonTextSecondary: {
        color: colors.text,
    },
    
    buttonTextSuccess: {
        color: colors.white,
    },
    
    buttonTextDanger: {
        color: colors.white,
    },
    
    iconOnly: {
        marginLeft: 0,
    },
})