import { colors } from "@/src/themes";
import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
    card:{
        marginVertical: 4,
        backgroundColor: colors.secondary,
        elevation: 4,
        padding: 8,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        backgroundColor: colors.primary,
    },
    row: {
        flexDirection: "row",
        alignItems: "flex-start",
        padding: 8,
        backgroundColor: colors.secondary,
    },
    descriptionCol: {
        flex: 2,
        flexDirection: "column",
        justifyContent: "flex-start",
    },
    valueCol: {
        flex: 1,
        flexDirection: "column",
        alignItems: "flex-end",
        justifyContent: "flex-start",
    },
    description: {
        fontSize: 16,
        fontWeight: "bold",
        color: colors.fourth,
    },
    value: {
        color: "colors.black",
        textAlign: "right",
        fontWeight: "bold",
    },
    installment: {
        color: "#fff",
        textAlign: "right",
        fontSize: 12,
    },
    date: {
        color: "#fff",
        textAlign: "left",
        fontSize: 12,
    },
});