import { useUIStore } from '@/src/store/useUI.store'
import { useEffect, useRef } from 'react'
import {
    Dimensions,
    Pressable,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
import { styles } from './nav-months.style'

const months = [
    { id: 1, name: 'Janeiro', short: 'JAN' },
    { id: 2, name: 'Fevereiro', short: 'FEV' },
    { id: 3, name: 'Março', short: 'MAR' },
    { id: 4, name: 'Abril', short: 'ABR' },
    { id: 5, name: 'Maio', short: 'MAI' },
    { id: 6, name: 'Junho', short: 'JUN' },
    { id: 7, name: 'Julho', short: 'JUL' },
    { id: 8, name: 'Agosto', short: 'AGO' },
    { id: 9, name: 'Setembro', short: 'SET' },
    { id: 10, name: 'Outubro', short: 'OUT' },
    { id: 11, name: 'Novembro', short: 'NOV' },
    { id: 12, name: 'Dezembro', short: 'DEZ' },
]

export function NavMonths() {
    const selectedMonth = useUIStore((s) => s.selectedMonth)
    const selectedYear = useUIStore((s) => s.selectedYear)
    const setSelectedMonth = useUIStore((s) => s.setSelectedMonth)
    const setSelectedYear = useUIStore((s) => s.setSelectedYear)

    const scrollRef = useRef<ScrollView>(null)

    useEffect(() => {
        if (scrollRef.current) {
            const itemWidth = 88
            const screenWidth = Dimensions.get('window').width
            const offset =
                (selectedMonth - 1) * itemWidth -
                screenWidth / 2 +
                itemWidth / 2
            scrollRef.current.scrollTo({
                x: Math.max(0, offset),
                animated: true,
            })
        }
    }, [selectedMonth])

    return (
        <View style={styles.container}>
            <View style={styles.yearNav}>
                <TouchableOpacity
                    onPress={() => setSelectedYear(selectedYear - 1)}
                    style={styles.yearArrow}
                >
                    <Icon name="left" size={16} color="#6b7280" />
                </TouchableOpacity>
                <Text style={styles.yearNavText}>{selectedYear}</Text>
                <TouchableOpacity
                    onPress={() => setSelectedYear(selectedYear + 1)}
                    style={styles.yearArrow}
                >
                    <Icon name="right" size={16} color="#6b7280" />
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                ref={scrollRef}
                contentContainerStyle={styles.scrollContainer}
            >
                {months.map((month) => {
                    const isSelected = month.id === selectedMonth
                    return (
                        <Pressable
                            key={month.id}
                            style={[
                                styles.monthButton,
                                isSelected && styles.monthButtonSelected,
                            ]}
                            onPress={() => setSelectedMonth(month.id)}
                        >
                            <Text
                                style={[
                                    styles.monthText,
                                    isSelected && styles.monthTextSelected,
                                ]}
                            >
                                {month.short}
                            </Text>
                        </Pressable>
                    )
                })}
            </ScrollView>
        </View>
    )
}
