import { StyleProp, Text, TouchableOpacity, ViewStyle } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
import { styles } from './button.style'

interface Props {
    bText?: string
    iconName?: string
    onPress: () => void
    bgColor: string
    iconColor?: string
    iconSize?: number
    style?: StyleProp<ViewStyle>
    width?: string | number
    height?: string | number
}

export function NewButton({
    bText,
    iconName,
    onPress,
    bgColor,
    iconColor,
    iconSize,
    style,
    width,
    height,
}: Props) {
    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor: bgColor }, style]}
            onPress={onPress}
        >
            {bText && <Text style={styles.buttonText}>{bText}</Text>}
            {iconName && (
                <Icon name={iconName} size={iconSize} color={iconColor} />
            )}
        </TouchableOpacity>
    )
}
