import { colors } from "@/src/themes";
import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
    balancePainel: {
        flex: 1,
        padding: 20,
        backgroundColor: colors.black,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
}); 