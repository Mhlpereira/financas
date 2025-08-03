import { Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'

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
    { id: 12, name: 'DEZ' }
]

export function NavMonths() {
    const currentMonth = new Date().getMonth() + 1 // Janeiro = 0, por isso +1

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity>
                <Icon name="chevron-left" size={20} />
            </TouchableOpacity>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: 'row' }}>
                    {months.map(month => (
                        <Pressable key={month.id} style={{ marginHorizontal: 8 }}>
                            <Text style={{
                                fontWeight: month.id === currentMonth ? 'bold' : 'normal',
                                color: month.id === currentMonth ? 'colors.black' : '#333',
                                fontSize: 16,
                                padding: 8,
                                borderBottomWidth: month.id === currentMonth ? 2 : 0,
                                borderBottomColor: month.id === currentMonth ? '#1976d2' : 'transparent'
                            }}>
                                {month.name}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </ScrollView>
            <TouchableOpacity>
                <Icon name="chevron-right" size={20} />
            </TouchableOpacity>
        </View>
    )
}

//caret-left < preenchido pode se usar até para despesas
//left  < simples para o lado
// plus
//chevron-left
