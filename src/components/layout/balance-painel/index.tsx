import { Text, View } from 'react-native'
import { styles } from './balance-painel.style'

export function BalancePainel() {
    //dados mockados
    const mesAno = 'Agosto/2025'
    const valorUsado = 'R$ 1.200,00'
    const valorRecebido = 'R$ 2.000,00'
    const disponivel = 'R$ 800,00'

    return (
        <>
            <View style={styles.balancePainel}>
                <Text>{mesAno}</Text>
                <View>
                    <Text style={styles.titulo}>Disponível:</Text>
                    <Text style={styles.disponivel}>{disponivel}</Text>
                </View>
                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.label}>Usado</Text>
                        <Text style={styles.valor}>{valorUsado}</Text>
                    </View>
                    <View style={styles.col}>
                        <Text style={styles.label}>Recebido</Text>
                        <Text style={styles.valor}>{valorRecebido}</Text>
                    </View>
                </View>
            </View>
        </>
    )
}
