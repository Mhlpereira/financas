import { Text, View } from "react-native";
import { useNameStore } from "../../../store/useNameStore";


export const Header = () => {
    const { userName } = useNameStore();

    return (
        <View>
            {userName? <Text>Olá, {userName}!</Text> : <Text>Olá, visitante!</Text>}
        </View>
    )
}

