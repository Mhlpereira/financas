import { Modal, Pressable, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
import { ExpenseForm } from '../expense-form'
import { styles } from './modal.style'

type CustomModalProps = {
    visible: boolean
    onClose: () => void
}

export function CustomModal({ visible, onClose }: CustomModalProps) {
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
                        <Text style={styles.modalTitle}>Novo lançamento</Text>
                        <Pressable style={styles.closeButton} onPress={onClose}>
                            <Icon name="close" size={18} color="#6b7280" />
                        </Pressable>
                    </View>
                    <View style={styles.modalContent}>
                        <ExpenseForm onSuccess={onClose} />
                    </View>
                </View>
            </View>
        </Modal>
    )
}
