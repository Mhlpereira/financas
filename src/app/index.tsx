import { useRef } from 'react'
import { Animated, View } from 'react-native'
import { BalancePainel } from '../components/layout/balance-painel'
import { ExpenseManager } from '../components/layout/expense-manager'
import { Header } from '../components/layout/header'
import { NavMonths } from '../components/layout/nav-months'
import { UserPage } from '../components/pages/user-page'
import { NewButton } from '../components/ui/button'
import { CustomModal } from '../components/ui/modal'
import { useUIStore } from '../store/useUI.store'
import { homeStyles } from './home.styles'

export default function Home() {
    const currentPage = useUIStore((s) => s.currentPage)
    const isAddModalOpen = useUIStore((s) => s.isAddModalOpen)
    const openAddModal = useUIStore((s) => s.openAddModal)
    const closeAddModal = useUIStore((s) => s.closeAddModal)

    const navAnimation = useRef(new Animated.Value(1)).current
    const balanceAnimation = useRef(new Animated.Value(0)).current
    const lastScrollY = useRef(0)

    const handleScroll = (scrollY: number) => {
        const currentScrollY = scrollY
        const scrollDirection =
            currentScrollY > lastScrollY.current ? 'down' : 'up'
        const threshold = 30

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
                }),
            ]).start()
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
                }),
            ]).start()
        }

        lastScrollY.current = currentScrollY
    }

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
                                transform: [
                                    {
                                        translateY: navAnimation.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [-60, 0],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    >
                        <NavMonths />
                    </Animated.View>

                    <Animated.View
                        style={{
                            transform: [
                                {
                                    translateY: balanceAnimation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0, -50],
                                    }),
                                },
                            ],
                        }}
                    >
                        <BalancePainel />
                    </Animated.View>

                    <Animated.View
                        style={[
                            homeStyles.expenseSection,
                            {
                                transform: [
                                    {
                                        translateY:
                                            balanceAnimation.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0, -50],
                                            }),
                                    },
                                ],
                            },
                        ]}
                    >
                        <ExpenseManager onScroll={handleScroll} />
                    </Animated.View>

                    <NewButton
                        iconName="plus"
                        variant="primary"
                        onPress={openAddModal}
                        style={homeStyles.buttonPlus}
                        rounded
                    />

                    <CustomModal
                        visible={isAddModalOpen}
                        onClose={closeAddModal}
                    />
                </>
            ) : (
                <UserPage />
            )}
        </View>
    )
}
