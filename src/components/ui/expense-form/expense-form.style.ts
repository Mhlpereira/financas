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
    },
    
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 12,
        marginTop: 16,
    },
    
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    
    modalContent: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 24,
        width: '100%',
        maxHeight: '80%',
    },
    
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
    },
    
    closeButton: {
        padding: 4,
    },
    
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    
    categoryItem: {
        width: '30%',
        aspectRatio: 1,
        backgroundColor: colors.background,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    
    selectedCategory: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    
    categoryText: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 4,
        textAlign: 'center',
    },
    
    selectedCategoryText: {
        color: colors.surface,
    },
    
    categorySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 16,
    },
    
    categorySelectorText: {
        flex: 1,
        fontSize: 16,
        color: colors.text,
        marginLeft: 8,
    },
    
    recurringToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    
    recurringText: {
        fontSize: 16,
        color: colors.text,
        marginLeft: 8,
    },
});