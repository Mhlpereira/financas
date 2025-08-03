import { useEffect, useRef, useState } from 'react'
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
    { id: 1, name: 'JAN' },
    { id: 2, name: 'FEV' },
    { id: 3, name: 'MAR' },
    { id: 4, name: 'ABR' },
    { id: 5, name: 'MAI' },
    { id: 6, name: 'JUN' },
    { id: 7, name: 'JUL' },
    { id: 8, name: 'AGO' },
    { id: 9, name: 'SET' },
    { id: 10, name: 'OUT' },
    { id: 11, name: 'NOV' },
    { id: 12, name: 'DEZ' },
]

export function NavMonths() {
    const currentMonth = new Date().getMonth() + 1 // Janeiro = 0, por isso +1
    const [selectedMonth, setSelectedMonth] = useState(currentMonth)
    const scrollRef = useRef<ScrollView>(null)

    useEffect(() => {
        if (scrollRef.current) {
            const itemWidth = 80 
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
            <TouchableOpacity
                style={styles.icon}
                onPress={() => setSelectedMonth(Math.max(1, selectedMonth - 1))}
            >
                <Icon name="left" size={20} />
            </TouchableOpacity>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                ref={scrollRef}
            >
                <View style={styles.scrollContainer}>
                    {months.map((month) => (
                        <Pressable
                            key={month.id}
                            style={styles.monthButton}
                            onPress={() => setSelectedMonth(month.id)}
                        >
                            <Text
                                style={[
                                    styles.monthText,
                                    month.id === selectedMonth &&
                                        styles.monthTextSelected,
                                ]}
                            >
                                {month.name}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </ScrollView>
            <TouchableOpacity
                style={styles.icon}
                onPress={() =>
                    setSelectedMonth(Math.min(12, selectedMonth + 1))
                }
            >
                <Icon name="right" size={20} />
            </TouchableOpacity>
        </View>
    )
}

//caret-left < preenchido pode se usar até para despesas
//left  < simples para o lado
// plus
//chevron-left
