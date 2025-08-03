import { useState } from 'react'
import { View } from 'react-native'
import { BalancePainel } from '../components/layout/balance-painel'
import { ExpenseManager } from '../components/layout/expense-manager'
import { Header } from '../components/layout/header'
import { NavMonths } from '../components/layout/nav-months'
import { NewButton } from '../components/ui/button'
import { CustomModal } from '../components/ui/modal'
import { colors } from '../themes'
import { globalStyles } from '../themes/styles'
import { homeStyles } from './home.styles'

export default function Home() {
    const [isModalVisible, setModalVisible] = useState(false);

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
                    onPress={() => setModalVisible(true)}
                    style={homeStyles.buttonPlus}
                />
                <CustomModal 
                 visible={isModalVisible}
                 onClose={() => setModalVisible(false)}
                 />
            </View>
        </>
    )
}
