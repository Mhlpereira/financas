import { Dimensions, StyleSheet } from 'react-native';


const { height } = Dimensions.get('window');
const bottomSpace = height * 0.08; // 8% da altura da tela para evitar o menu do android

export const homeStyles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
    buttonPlus: {
        position: "absolute",
        borderRadius: 32,
        width: 56,
        height: 56,
        bottom: bottomSpace,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99, // colocar em cima de outros componentes
    }
})