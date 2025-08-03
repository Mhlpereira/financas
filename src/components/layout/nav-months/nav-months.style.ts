import { colors } from '@/src/themes';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    scrollContainer: {
        flexDirection: 'row',
    },
    monthButton: {
        width: 80,
        alignItems: 'center',
    },
    monthText: {
        fontSize: 16,
        padding: 8,
        color: colors.black,
    },
    monthTextSelected: {
        fontWeight: 'bold',
        color: colors.fourth,
        borderBottomWidth: 2,
        borderBottomColor: colors.fourth,
    },
    icon: {
        paddingHorizontal: 8,
    },
});