import { colors } from '@/src/themes'
import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingBottom: 20,
        paddingTop: 8,
        elevation: 10,
        shadowColor: colors.gray600,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4,
        position: 'relative',
    },
    label: {
        fontSize: 11,
        fontWeight: '500',
        color: colors.gray400,
        marginTop: 2,
    },
    activeLabel: {
        color: colors.primary,
        fontWeight: '700',
    },
    indicator: {
        position: 'absolute',
        top: -8,
        width: 24,
        height: 3,
        borderRadius: 2,
        backgroundColor: colors.primary,
    },
    activeColor: {
        color: colors.primary,
    },
    inactiveColor: {
        color: colors.gray400,
    },
})
