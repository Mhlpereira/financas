import { useState } from 'react'
import { Alert, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
import { useNameStore } from '../../../store/useNameStore'
import { useNavigationStore } from '../../../store/useNavigationStore'
import { useTransactionStore } from '../../../store/useTransaction.store'
import { colors } from '../../../themes'
import { styles } from './header.style'

export const Header = () => {
    const { userName } = useNameStore()
    const { setCurrentPage, currentPage } = useNavigationStore()
    const [showDropdown, setShowDropdown] = useState(false)
    const { clearAllData } = useTransactionStore()

    const getInitials = (name: string) => {
        if (!name) return 'U'
        const words = name.trim().split(' ')
        if (words.length === 1) return words[0].charAt(0).toUpperCase()
        return (
            words[0].charAt(0) + words[words.length - 1].charAt(0)
        ).toUpperCase()
    }

    const displayName = userName || 'Visitante'

    const handleClearData = () => {
        Alert.alert(
            'Limpar Dados',
            'Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Limpar',
                    style: 'destructive',
                    onPress: () => {
                        clearAllData()
                        setShowDropdown(false)
                        Alert.alert(
                            'Sucesso',
                            'Todos os dados foram removidos.',
                        )
                    },
                },
            ],
        )
    }

    const handleMenuOption = (option: string) => {
        switch (option) {
            case 'user':
                setCurrentPage('user')
                setShowDropdown(false)
                break
            case 'settings':
                Alert.alert('Configurações', 'Gerenciar dados do aplicativo', [
                    {
                        text: 'Cancelar',
                        style: 'cancel',
                    },
                    {
                        text: 'Limpar Dados',
                        style: 'destructive',
                        onPress: handleClearData,
                    },
                ])
                setShowDropdown(false)
                break
            case 'logout':
                Alert.alert('Sair', 'Funcionalidade em desenvolvimento')
                setShowDropdown(false)
                break
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {currentPage === 'user' ? (
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => setCurrentPage('home')}
                    >
                        <Icon name="arrowleft" size={20} color={colors.white} />
                    </TouchableOpacity>
                ) : (
                    <View style={styles.greeting}>
                        <Text style={styles.welcomeText}>
                            Bem-vindo de volta
                        </Text>
                        <Text style={styles.userName}>{displayName}!</Text>
                    </View>
                )}

                {currentPage === 'user' && (
                    <View style={styles.centerTitle}>
                        <Text style={styles.pageTitle}>Gerenciar Usuário</Text>
                    </View>
                )}

                <View style={styles.rightSection}>
                    <TouchableOpacity
                        style={styles.avatarContainer}
                        onPress={() => setShowDropdown(!showDropdown)}
                    >
                        <Text style={styles.avatarText}>
                            {getInitials(displayName)}
                        </Text>
                    </TouchableOpacity>

                    {showDropdown && (
                        <View style={styles.dropdown}>
                            <TouchableOpacity
                                style={styles.dropdownItem}
                                onPress={() => handleMenuOption('user')}
                            >
                                <Icon name="user" size={16} color="#374151" />
                                <Text style={styles.dropdownText}>Usuário</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.dropdownItem}
                                onPress={() => handleMenuOption('settings')}
                            >
                                <Icon
                                    name="setting"
                                    size={16}
                                    color="#374151"
                                />
                                <Text style={styles.dropdownText}>
                                    Configuração
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.dropdownItem}
                                onPress={() => handleMenuOption('logout')}
                            >
                                <Icon name="logout" size={16} color="#dc2626" />
                                <Text
                                    style={[
                                        styles.dropdownText,
                                        styles.logoutText,
                                    ]}
                                >
                                    Sair
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </View>
    )
}
