import { colors } from "@/src/themes";
import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
    balancePainel: {
        padding: 16,
        backgroundColor: colors.black,
        borderRadius: 8,
        elevation: 2,
    },
    mesAno: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
        textAlign: "center",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    col: {
        alignItems: "center",
        flex: 1,
    },
    label: {
        fontSize: 14,
        color: "#888",
    },
    valor: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    titulo:{
        fontSize: 30,
        fontWeight: "bold",
        color: colors.expense,
        textAlign: "left",
        marginBottom: 16,
    }    ,
    disponivel: {
        fontSize: 24,
        color: colors.expense,
        fontWeight: "bold",
        textAlign: "left",
        marginBottom: 16,
    },
});