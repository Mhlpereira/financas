import { useUIStore } from '@/src/store/useUI.store'
import { Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
import { styles } from './bottom-nav.style'

type Page = 'home' | 'calendar' | 'expenses'

const tabs: { page: Page; icon: string; label: string }[] = [
    { page: 'home', icon: 'home', label: 'Início' },
    { page: 'calendar', icon: 'calendar', label: 'Calendário' },
    { page: 'expenses', icon: 'barschart', label: 'Extrato' },
]

export function BottomNav() {
    const currentPage = useUIStore((s) => s.currentPage)
    const setCurrentPage = useUIStore((s) => s.setCurrentPage)

    if (currentPage === 'user') return null

    return (
        <View style={styles.container}>
            {tabs.map((tab) => {
                const isActive = currentPage === tab.page
                return (
                    <TouchableOpacity
                        key={tab.page}
                        style={styles.tab}
                        onPress={() => setCurrentPage(tab.page)}
                        activeOpacity={0.7}
                    >
                        <Icon
                            name={tab.icon}
                            size={22}
                            color={
                                isActive
                                    ? styles.activeColor.color
                                    : styles.inactiveColor.color
                            }
                        />
                        <Text
                            style={[
                                styles.label,
                                isActive && styles.activeLabel,
                            ]}
                        >
                            {tab.label}
                        </Text>
                        {isActive && <View style={styles.indicator} />}
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}
