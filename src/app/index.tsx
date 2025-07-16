import { View } from "react-native";
import { NewButton } from "../components/button";
import { Header } from "../components/header";
import { colors } from "../themes";
import { globalStyles } from "../themes/styles";

export default function Home(){
    return (
        <>
        <View style={globalStyles.container}>
            <Header/>
            <NewButton bText="Income" bgColor={colors.fourth} onPress={() => {}}/>
            <NewButton bText="Expenses" bgColor={colors.expense} onPress={() => {}}/>
        </View>
        </>
    )
}
