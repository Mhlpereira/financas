import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { BalancePainel } from '../components/layout/balance-painel'
import { ExpenseManager } from '../components/layout/expense-manager'
import { Header } from '../components/layout/header'
import { NavMonths } from '../components/layout/nav-months'
import { NewButton } from '../components/ui/button'
import { CustomModal } from '../components/ui/modal'
import { useTransactionStore } from '../store/useTransactionStore'
import { homeStyles } from './home.styles'

export default function Home() {
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const loadData = useTransactionStore(state => state.loadData);

    useEffect(() => {
        // Carregar dados persistidos quando o app inicializar
        loadData();
    }, [loadData]);

    return (
        <View style={homeStyles.container}>
            <Header />
            <NavMonths 
                selectedMonth={selectedMonth}
                onMonthChange={setSelectedMonth}
            />
            
            <View style={homeStyles.section}>
                <BalancePainel selectedMonth={selectedMonth} />
            </View>
            
            <View style={{ flex: 1 }}>
                <ExpenseManager selectedMonth={selectedMonth} />
            </View>

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
