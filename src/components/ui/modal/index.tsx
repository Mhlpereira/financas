import { Modal, Pressable, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
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
                        <Text style={styles.text}>Novo lançamento</Text>
                        <Pressable onPress={onClose}>
                            <Icon name="close" size={24} onPress={onClose} />
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    )
}
