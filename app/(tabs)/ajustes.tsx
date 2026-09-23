import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import { useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { resetDatabase } from '@/db/client';
import { BackupFormatError, exportBackup, importBackup, parseBackup } from '@/repositories/backup';
import { useAppStore } from '@/stores/app';
import { useLockStore } from '@/stores/lock';
import { colors, radius, spacing } from '@/theme';
import { Card } from '@/ui/Card';
import { Screen, SectionHeader } from '@/ui/Screen';
import { Text } from '@/ui/Text';

export default function SettingsScreen() {
  const router = useRouter();

  const profiles = useAppStore((state) => state.profiles);
  const categories = useAppStore((state) => state.categories);
  const bootstrap = useAppStore((state) => state.bootstrap);
  const bumpRevision = useAppStore((state) => state.bumpRevision);

  const pinEnabled = useLockStore((state) => state.pinEnabled);
  const biometricsEnabled = useLockStore((state) => state.biometricsEnabled);
  const biometricsLabel = useLockStore((state) => state.biometricsLabel);

  const [busy, setBusy] = useState(false);

  const handleExport = async () => {
    setBusy(true);
    try {
      const backup = await exportBackup();
      const stamp = new Date().toISOString().slice(0, 10);
      const file = new File(Paths.cache, `meu-caixa-${stamp}.json`);

      file.create({ overwrite: true });
      file.write(JSON.stringify(backup, null, 2));

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri, {
          mimeType: 'application/json',
          dialogTitle: 'Backup do Meu Caixa',
        });
      } else {
        Alert.alert('Backup salvo', `Arquivo gerado em ${file.uri}`);
      }
    } catch {
      Alert.alert('Não deu', 'Não foi possível gerar o backup.');
    } finally {
      setBusy(false);
    }
  };

  const handleImport = async () => {
    const picked = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      copyToCacheDirectory: true,
    });

    if (picked.canceled || !picked.assets[0]) return;

    const asset = picked.assets[0];

    Alert.alert(
      'Importar backup',
      'Isso apaga tudo que está no app agora e coloca os dados do arquivo no lugar. Não dá para desfazer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Substituir tudo',
          style: 'destructive',
          onPress: async () => {
            setBusy(true);
            try {
              const raw = await new File(asset.uri).text();
              await importBackup(parseBackup(raw));
              await bootstrap();
              bumpRevision();
              Alert.alert('Pronto', 'Backup restaurado.');
            } catch (error) {
              Alert.alert(
                'Não deu',
                error instanceof BackupFormatError
                  ? error.message
                  : 'Não foi possível ler esse arquivo.',
              );
            } finally {
              setBusy(false);
            }
          },
        },
      ],
    );
  };

  const handleReset = () => {
    Alert.alert(
      'Zerar tudo',
      'Apaga perfis, lançamentos e histórico, e devolve o app ao estado de instalação nova. Não dá para desfazer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar tudo',
          style: 'destructive',
          onPress: async () => {
            setBusy(true);
            await resetDatabase();
            await bootstrap();
            bumpRevision();
            setBusy(false);
          },
        },
      ],
    );
  };

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text variant="title">Ajustes</Text>

        <SectionHeader title="Organização" />
        <Card padded={false}>
          <Row
            icon="people"
            label="Perfis"
            value={`${profiles.length}`}
            onPress={() => router.push('/profiles')}
          />
          <Row
            icon="pricetags"
            label="Categorias"
            value={`${categories.length}`}
            onPress={() => router.push('/categories')}
            bordered
          />
        </Card>

        <SectionHeader title="Segurança" />
        <Card padded={false}>
          <Row
            icon="lock-closed"
            label="Trava do app"
            value={pinEnabled ? 'PIN ativo' : 'sem senha'}
            onPress={() => router.push('/security')}
          />
          {pinEnabled ? (
            <Row
              icon="finger-print"
              label="Biometria"
              value={biometricsEnabled ? `${biometricsLabel} ativa` : 'desligada'}
              onPress={() => router.push('/security')}
              bordered
            />
          ) : null}
        </Card>

        <SectionHeader title="Dados" />
        <Card padded={false}>
          <Row
            icon="share-outline"
            label="Exportar backup"
            value="JSON"
            onPress={handleExport}
            disabled={busy}
          />
          <Row
            icon="download-outline"
            label="Importar backup"
            onPress={handleImport}
            disabled={busy}
            bordered
          />
          <Row
            icon="trash-outline"
            label="Zerar tudo"
            onPress={handleReset}
            disabled={busy}
            danger
            bordered
          />
        </Card>

        <Text variant="caption" tone="faint" align="center" style={styles.footer}>
          Meu Caixa · seus dados ficam só neste aparelho
        </Text>
      </ScrollView>
    </Screen>
  );
}

function Row({
  icon,
  label,
  value,
  onPress,
  bordered = false,
  danger = false,
  disabled = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress: () => void;
  bordered?: boolean;
  danger?: boolean;
  disabled?: boolean;
}) {
  const tint = danger ? colors.negative : colors.textMuted;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.row,
        bordered ? styles.bordered : null,
        pressed ? styles.pressed : null,
        disabled ? styles.disabled : null,
      ]}
    >
      <View style={[styles.rowIcon, danger ? styles.rowIconDanger : null]}>
        <Ionicons name={icon} size={17} color={tint} />
      </View>

      <Text variant="body" color={danger ? colors.negative : colors.text} style={styles.rowLabel}>
        {label}
      </Text>

      {value ? (
        <Text variant="caption" tone="faint">
          {value}
        </Text>
      ) : null}

      <Ionicons name="chevron-forward" size={15} color={colors.textFaint} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 58,
  },
  bordered: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  pressed: {
    backgroundColor: colors.cardElevated,
  },
  disabled: {
    opacity: 0.5,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIconDanger: {
    backgroundColor: colors.negativeDim,
  },
  rowLabel: {
    flex: 1,
  },
  footer: {
    marginTop: spacing.xl,
  },
});
