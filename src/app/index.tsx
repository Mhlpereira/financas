import { useState } from 'react'
import { ScrollView, View } from 'react-native'
import { BalancePainel } from '../components/layout/balance-painel'
import { ExpenseManager } from '../components/layout/expense-manager'
import { Header } from '../components/layout/header'
import { NavMonths } from '../components/layout/nav-months'
import { NewButton } from '../components/ui/button'
import { CustomModal } from '../components/ui/modal'
import { homeStyles } from './home.styles'

export default function Home() {
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

    return (
        <View style={homeStyles.container}>
            <Header />
            <NavMonths 
                selectedMonth={selectedMonth}
                onMonthChange={setSelectedMonth}
            />
            
            <ScrollView 
                style={{ flex: 1 }}
                contentContainerStyle={homeStyles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={homeStyles.section}>
                    <BalancePainel selectedMonth={selectedMonth} />
                </View>
                
                <View style={homeStyles.section}>
                    <ExpenseManager selectedMonth={selectedMonth} />
                </View>
            </ScrollView>

            <NewButton
                iconName="plus"
                variant="primary"
                onPress={() => setModalVisible(true)}
                style={homeStyles.buttonPlus}
                rounded
            />
            
            <CustomModal 
                visible={isModalVisible}
                onClose={() => setModalVisible(false)}
            />
        </View>
    )
}
