import { View } from 'react-native'
import { BalancePainel } from '../components/layout/balance-painel'
import { ExpenseManager } from '../components/layout/expense-manager'
import { Header } from '../components/layout/header'
import { NavMonths } from '../components/layout/nav-months'
import { NewButton } from '../components/ui/button'
import { colors } from '../themes'
import { globalStyles } from '../themes/styles'
import { homeStyles } from './home.styles'

export default function Home() {
    return (
        <>
            <View style={globalStyles.container}>
                <Header />
                <NavMonths />
                <BalancePainel />
                <ExpenseManager />
                <NewButton
                    iconName="plus"
                    iconColor={colors.black}
                    iconSize={24}
                    bgColor={colors.primary}
                    onPress={() => {}}
                    style={homeStyles.buttonPlus}
                />
            </View>
        </>
    )
}
