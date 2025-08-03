import { View } from "react-native";
import { BalancePainel } from "../components/layout/balance-painel";
import { ExpenseManager } from "../components/layout/expense-manager";
import { Header } from "../components/layout/header";
import { NewButton } from "../components/ui/button";
import { colors } from "../themes";
import { globalStyles } from "../themes/styles";

export default function Home(){
    return (
        <>
        <View style={globalStyles.container}>
            <Header/>
            <BalancePainel/>
            <ExpenseManager/>
            <NewButton bText="Income" bgColor={colors.fourth} onPress={() => {}}/>
            <NewButton bText="Expenses" bgColor={colors.expense} onPress={() => {}}/>
        </View>
        </>
    )
}
