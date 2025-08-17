import { useEffect, useRef } from 'react';
import {
    Dimensions,
    Pressable,
    ScrollView,
    Text,
    View
} from 'react-native';
import { styles } from './nav-months.style';

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

interface NavMonthsProps {
    selectedMonth: number;
    onMonthChange: (month: number) => void;
}

export function NavMonths({ selectedMonth, onMonthChange }: NavMonthsProps) {
    const scrollRef = useRef<ScrollView>(null)
    const currentYear = new Date().getFullYear()

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
                            onPress={() => onMonthChange(month.id)}
                        >
                            <Text
                                style={[
                                    styles.monthText,
                                    isSelected && styles.monthTextSelected,
                                ]}
                            >
                                {month.short}
                            </Text>
                            <Text
                                style={[
                                    styles.yearText,
                                    isSelected && styles.yearTextSelected,
                                ]}
                            >
                                {currentYear}
                            </Text>
                        </Pressable>
                    )
                })}
            </ScrollView>

        </View>
    )
}
