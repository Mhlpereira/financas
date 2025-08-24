import { useEffect, useRef, useState } from 'react'
import { Animated, View } from 'react-native'
import { BalancePainel } from '../components/layout/balance-painel'
import { ExpenseManager } from '../components/layout/expense-manager'
import { Header } from '../components/layout/header'
import { NavMonths } from '../components/layout/nav-months'
import { NewButton } from '../components/ui/button'
import { CustomModal } from '../components/ui/modal'
import { UserPage } from '../components/pages/user-page'
import { useTransactionStore } from '../store/useTransactionStore'
import { useNavigationStore } from '../store/useNavigationStore'
import { homeStyles } from './home.styles'

export default function Home() {
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const loadData = useTransactionStore(state => state.loadData);
    const { currentPage } = useNavigationStore();
    
    const navAnimation = useRef(new Animated.Value(1)).current;
    const balanceAnimation = useRef(new Animated.Value(0)).current;
    const lastScrollY = useRef(0);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleScroll = (scrollY: number) => {
        const currentScrollY = scrollY;
        const scrollDirection = currentScrollY > lastScrollY.current ? 'down' : 'up';
        const threshold = 30;
        
        if (scrollDirection === 'down' && currentScrollY > threshold) {
            Animated.parallel([
                Animated.timing(navAnimation, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(balanceAnimation, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                })
            ]).start();
        } else if (scrollDirection === 'up' || currentScrollY <= threshold) {
            Animated.parallel([
                Animated.timing(navAnimation, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(balanceAnimation, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                })
            ]).start();
        }
        
        lastScrollY.current = currentScrollY;
    };

    return (
        <View style={homeStyles.container}>
            <Header />
            
            {currentPage === 'home' ? (
                <>
                    <Animated.View 
                        style={[
                            homeStyles.navContainer,
                            {
                                opacity: navAnimation,
                                transform: [{
                                    translateY: navAnimation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [-60, 0],
                                    })
                                }]
                            }
                        ]}
                    >
                        <NavMonths 
                            selectedMonth={selectedMonth}
                            onMonthChange={setSelectedMonth}
                        />
                    </Animated.View>
                    
                    <Animated.View
                        style={{
                            transform: [{
                                translateY: balanceAnimation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, -50],
                                })
                            }]
                        }}
                    >
                        <BalancePainel selectedMonth={selectedMonth} />
                    </Animated.View>
                    
                    <Animated.View 
                        style={[
                            homeStyles.expenseSection,
                            {
                                transform: [{
                                    translateY: balanceAnimation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0, -50],
                                    })
                                }]
                            }
                        ]}
                    >
                        <ExpenseManager 
                            selectedMonth={selectedMonth}
                            onScroll={handleScroll}
                        />
                    </Animated.View>

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
                        selectedMonth={selectedMonth}
                    />
                </>
            ) : (
                <UserPage />
            )}
        </View>
    )
}
