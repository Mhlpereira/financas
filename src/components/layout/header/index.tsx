import { Text, View } from "react-native";
import { useNameStore } from "../../../store/useNameStore";
import { styles } from "./header.style";

export const Header = () => {
    const { userName } = useNameStore();
    
    const getInitials = (name: string) => {
        if (!name) return "U";
        const words = name.trim().split(" ");
        if (words.length === 1) return words[0].charAt(0).toUpperCase();
        return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
    };

    const displayName = userName || "Visitante";

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.greeting}>
                    <Text style={styles.welcomeText}>Bem-vindo de volta</Text>
                    <Text style={styles.userName}>{displayName}!</Text>
                </View>
                
                <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>
                        {getInitials(displayName)}
                    </Text>
                </View>
            </View>
        </View>
    );
};

