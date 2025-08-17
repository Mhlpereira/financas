import { StyleSheet } from "react-native"
import { colors } from "."

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 16,
    },
    
    // Componentes de card
    card: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        marginVertical: 4,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: colors.border,
    },
    
    // Textos
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 8,
    },
    
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 4,
    },
    
    body: {
        fontSize: 16,
        color: colors.text,
        lineHeight: 24,
    },
    
    caption: {
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 20,
    },
    
    // Inputs
    input: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: colors.text,
        marginBottom: 8,
    },
    
    inputFocused: {
        borderColor: colors.primary,
        borderWidth: 2,
    },
    
    // Botões
    buttonPrimary: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    
    buttonSecondary: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    
    buttonSuccess: {
        backgroundColor: colors.success,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    
    buttonDanger: {
        backgroundColor: colors.danger,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    
    // Textos dos botões
    buttonTextPrimary: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    
    buttonTextSecondary: {
        color: colors.text,
        fontSize: 16,
        fontWeight: '600',
    },
    
    // Layouts
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    
    spaceBetween: {
        justifyContent: 'space-between',
    },
    
    center: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    
    // Espaçamentos
    mb8: { marginBottom: 8 },
    mb16: { marginBottom: 16 },
    mb24: { marginBottom: 24 },
    mt8: { marginTop: 8 },
    mt16: { marginTop: 16 },
    mt24: { marginTop: 24 },
    
    // Cores de fundo
    bgPrimary: { backgroundColor: colors.primary },
    bgSecondary: { backgroundColor: colors.secondary },
    bgSuccess: { backgroundColor: colors.success },
    bgDanger: { backgroundColor: colors.danger },
    bgSurface: { backgroundColor: colors.surface },
})