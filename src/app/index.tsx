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
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

    return (
        <>
            <View style={globalStyles.container}>
                <Header />
                <NavMonths 
                    selectedMonth={selectedMonth}
                    onMonthChange={setSelectedMonth}
                />
                <BalancePainel selectedMonth={selectedMonth} />
                <ExpenseManager selectedMonth={selectedMonth} />
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
