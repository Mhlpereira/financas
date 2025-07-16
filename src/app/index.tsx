import { View } from "react-native";
import { Header } from "../components/header";
import { globalStyles } from "../themes/styles";

export default function Home(){
    return (
        <>
        <View style={globalStyles.container}>
            <Header/>
        </View>
        </>
    )
}
