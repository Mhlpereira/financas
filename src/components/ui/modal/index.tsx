import { Modal, Pressable, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
import { ExpenseForm } from '../expense-form'
import { styles } from './modal.style'

type CustomModalProps = {
    visible: boolean
    onClose: () => void
    title?: string
    children?: React.ReactNode
    selectedMonth?: number
}

export function CustomModal({ visible, onClose, title = "Novo lançamento", children, selectedMonth }: CustomModalProps) {
    return (
        <Modal
            transparent
            animationType="fade"
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{title}</Text>
                        <Pressable style={styles.closeButton} onPress={onClose}>
                            <Icon name="close" size={18} color="#6b7280" />
                        </Pressable>
                    </View>
                    <View style={styles.modalContent}>
                        {children || <ExpenseForm onSuccess={onClose} selectedMonth={selectedMonth} />}
                    </View>
                </View>
            </View>
        </Modal>
    )
}
