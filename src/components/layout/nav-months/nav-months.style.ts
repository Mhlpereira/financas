import { colors } from '@/src/themes';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        paddingVertical: 16,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        elevation: 2,
        shadowColor: colors.gray600,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    scrollContainer: {
        paddingHorizontal: 8,
    },
    navigationButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.gray100,
        marginHorizontal: 8,
    },
    navigationButtonDisabled: {
        backgroundColor: colors.gray50,
        opacity: 0.5,
    },
    monthButton: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginHorizontal: 4,
        borderRadius: 20,
        minWidth: 80,
        alignItems: 'center',
        backgroundColor: colors.gray50,
        borderWidth: 1,
        borderColor: colors.border,
    },
    monthButtonSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
        elevation: 3,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    monthText: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.text,
    },
    monthTextSelected: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.white,
    },
    yearText: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2,
    },
    yearTextSelected: {
        fontSize: 12,
        color: colors.white,
        opacity: 0.8,
        marginTop: 2,
    },
});