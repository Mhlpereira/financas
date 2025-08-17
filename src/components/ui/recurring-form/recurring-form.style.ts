import { colors } from '@/src/themes';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
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
    
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        gap: 12,
    },
    
    button: {
        flex: 1,
    },
    
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 12,
        marginTop: 8,
    },
    
    recurrenceContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    
    recurrenceButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.gray50,
    },
    
    recurrenceButtonSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    
    recurrenceText: {
        fontSize: 14,
        color: colors.text,
    },
    
    recurrenceTextSelected: {
        color: colors.white,
    },
    
    dateInputContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingVertical: 8,
    },
    
    switchLabel: {
        fontSize: 16,
        color: colors.text,
    },
});
