import { colors } from "@/src/themes";
import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
    button:{
        justifyContent: 'center',
        width: "100%",
        height: 50,
        borderRadius: 5,
        alignItems: 'center'
    },
    buttonText:{
        color: colors.black,
        fontSize: 16,
        fontWeight: 'bold'
    }
})