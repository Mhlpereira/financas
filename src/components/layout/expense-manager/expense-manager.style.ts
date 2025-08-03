import { colors } from "@/src/themes";
import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({

    header:{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        backgroundColor: colors.primary,
    },
    row:{
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
        backgroundColor: colors.secondary,
    },
    description:{
        flex: 2,
        fontWeight: "bold",
        
    },
    value:{
        flex: 1,
        textAlign: "right",
    },
    installment:{
        flex: 1,
        textAlign: "center",
    },
    date:{
        flex: 1,
        textAlign: "center",
    }

})