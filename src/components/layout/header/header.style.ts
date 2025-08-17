import { colors } from "@/src/themes";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.primary,
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        elevation: 8,
        shadowColor: colors.gray600,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    greeting: {
        flex: 1,
    },
    welcomeText: {
        fontSize: 14,
        color: colors.white,
        opacity: 0.8,
        marginBottom: 4,
    },
    userName: {
        fontSize: 24,
        fontWeight: "700",
        color: colors.white,
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.primaryLight,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: colors.white,
    },
    avatarText: {
        fontSize: 18,
        fontWeight: "600",
        color: colors.white,
    },
});