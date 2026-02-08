import { colors } from '@/src/themes'
import { useState } from 'react'
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
import { formatDate } from '../../../../shared/helpers/utils'
import { styles } from '../calendar-page.style'

interface AddEntryModalProps {
    visible: boolean
    date: string | null
    onClose: () => void
    onSubmit: (company: string, amount: string) => boolean
}

export function AddEntryModal({
    visible,
    date,
    onClose,
    onSubmit,
}: AddEntryModalProps) {
    const [company, setCompany] = useState('')
    const [amount, setAmount] = useState('')

    const handleSubmit = () => {
        const success = onSubmit(company, amount)
        if (success) {
            setCompany('')
            setAmount('')
            onClose()
        }
    }

    const handleClose = () => {
        setCompany('')
        setAmount('')
        onClose()
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={handleClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>
                            Novo Trabalho — {date && formatDate(date)}
                        </Text>
                        <TouchableOpacity onPress={handleClose}>
                            <Icon name="close" size={20} color={colors.text} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.inputLabel}>Empresa / Cliente</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Wimed, XDevh..."
                        placeholderTextColor={colors.gray400}
                        value={company}
                        onChangeText={setCompany}
                    />

                    <Text style={styles.inputLabel}>Valor (R$)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: 150,00"
                        placeholderTextColor={colors.gray400}
                        keyboardType="decimal-pad"
                        value={amount}
                        onChangeText={setAmount}
                    />

                    <TouchableOpacity
                        style={styles.modalButton}
                        onPress={handleSubmit}
                    >
                        <Icon name="check" size={16} color={colors.white} />
                        <Text style={styles.modalButtonText}>Adicionar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}
