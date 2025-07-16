import { Text, TouchableOpacity } from "react-native";
import { styles } from "./button.style";

interface Props {
    bText: string;
    onPress: () => void;
    bgColor: string;
}

export function NewButton({bText, onPress, bgColor}: Props) {
    return (
        <TouchableOpacity style={[styles.button, { backgroundColor: bgColor }]} onPress={onPress}>
            <Text style={styles.buttonText}>{bText}</Text>
        </TouchableOpacity>
    )
}