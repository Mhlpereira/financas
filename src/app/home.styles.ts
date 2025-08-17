import { colors } from '@/src/themes';
import { Dimensions, StyleSheet } from 'react-native';

const { height } = Dimensions.get('window');
const bottomSpace = height * 0.08; // 8% da altura da tela para evitar o menu do android

export const homeStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 16,
    },
    buttonPlus: {
        position: "absolute",
        borderRadius: 28,
        width: 56,
        height: 56,
        bottom: bottomSpace,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.primary,
        elevation: 8,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        zIndex: 99,
    },
    section: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
});