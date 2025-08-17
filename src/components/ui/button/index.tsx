import { colors } from '@/src/themes'
import { StyleProp, Text, TouchableOpacity, ViewStyle } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
import { styles } from './button.style'

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'outline'

interface Props {
    bText?: string
    iconName?: string
    onPress: () => void
    variant?: ButtonVariant
    iconColor?: string
    iconSize?: number
    style?: StyleProp<ViewStyle>
    rounded?: boolean
    disabled?: boolean
}

export function NewButton({
    bText,
    iconName,
    onPress,
    variant = 'primary',
    iconColor,
    iconSize = 20,
    style,
    rounded = false,
    disabled = false,
}: Props) {
    const getButtonStyle = () => {
        let backgroundColor = colors.primary
        let borderColor = 'transparent'
        let borderWidth = 0
        
        switch (variant) {
            case 'primary':
                backgroundColor = colors.primary
                break
            case 'secondary':
                backgroundColor = colors.surface
                borderColor = colors.border
                borderWidth = 1
                break
            case 'success':
                backgroundColor = colors.success
                break
            case 'danger':
                backgroundColor = colors.danger
                break
            case 'outline':
                backgroundColor = 'transparent'
                borderColor = colors.primary
                borderWidth = 2
                break
        }
        
        return {
            ...styles.button,
            backgroundColor,
            borderColor,
            borderWidth,
            opacity: disabled ? 0.5 : 1,
            ...(rounded && styles.buttonRounded),
        }
    }
    
    const getTextColor = () => {
        switch (variant) {
            case 'primary':
            case 'success':
            case 'danger':
                return colors.white
            case 'secondary':
                return colors.text
            case 'outline':
                return colors.primary
            default:
                return colors.white
        }
    }
    
    const getIconColor = () => {
        if (iconColor) return iconColor
        return getTextColor()
    }

    return (
        <TouchableOpacity
            style={[getButtonStyle(), style]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.8}
        >
            {iconName && (
                <Icon 
                    name={iconName} 
                    size={iconSize} 
                    color={getIconColor()} 
                />
            )}
            {bText && (
                <Text style={[
                    styles.buttonText,
                    { color: getTextColor() },
                    !iconName && { marginLeft: 0 }
                ]}>
                    {bText}
                </Text>
            )}
        </TouchableOpacity>
    )
}
