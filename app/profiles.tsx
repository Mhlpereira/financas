import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import type { Profile } from '@/domain/types';
import {
  createProfile,
  deleteProfile,
  nameExists,
  updateProfile,
} from '@/repositories/profiles';
import { useAppStore } from '@/stores/app';
import { colors, palette, radius, spacing } from '@/theme';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { Field, Input } from '@/ui/Field';
import { Screen } from '@/ui/Screen';
import { Sheet } from '@/ui/Sheet';
import { Text } from '@/ui/Text';

const ICONS: Array<keyof typeof Ionicons.glyphMap> = [
  'person',
  'briefcase',
  'home',
  'business',
  'heart',
  'airplane',
  'school',
  'paw',
  'rocket',
  'storefront',
];

export default function ProfilesScreen() {
  const router = useRouter();

  const profiles = useAppStore((state) => state.profiles);
  const refreshProfiles = useAppStore((state) => state.refreshProfiles);
  const bumpRevision = useAppStore((state) => state.bumpRevision);

  const [editing, setEditing] = useState<Profile | null>(null);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState<string>(palette[0]);
  const [icon, setIcon] = useState<keyof typeof Ionicons.glyphMap>('person');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setName('');
    setColor(palette[profiles.length % palette.length]);
    setIcon('person');
    setError(null);
    setCreating(true);
  };

  const openEdit = (profile: Profile) => {
    setEditing(profile);
    setName(profile.name);
    setColor(profile.color);
    setIcon(profile.icon as keyof typeof Ionicons.glyphMap);
    setError(null);
    setCreating(true);
  };

  const close = () => {
    setCreating(false);
    setEditing(null);
  };

  const save = async () => {
    const trimmed = name.trim();

    if (trimmed.length === 0) {
      setError('Dê um nome ao perfil');
      return;
    }

    if (await nameExists(trimmed, editing?.id)) {
      setError('Já existe um perfil com esse nome');
      return;
    }

    setSaving(true);

    if (editing) await updateProfile(editing.id, { name: trimmed, color, icon });
    else await createProfile({ name: trimmed, color, icon });

    await refreshProfiles();
    bumpRevision();
    setSaving(false);
    close();
  };

  const remove = (profile: Profile) => {
    if (profiles.length <= 1) {
      Alert.alert('Não dá', 'Você precisa de pelo menos um perfil.');
      return;
    }

    Alert.alert(
      `Excluir ${profile.name}`,
      'Todos os lançamentos, parcelas e gastos fixos desse perfil vão junto. Não dá para desfazer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await deleteProfile(profile.id);
            await refreshProfiles();
            bumpRevision();
          },
        },
      ],
    );
  };

  return (
    <Screen padded={false}>
      <View style={styles.topBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fechar"
          onPress={() => router.back()}
          style={styles.topButton}
        >
          <Ionicons name="close" size={22} color={colors.textMuted} />
        </Pressable>
        <Text variant="heading">Perfis</Text>
        <View style={styles.topButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text variant="body" tone="muted">
          Cada perfil tem seus próprios lançamentos e saldo. A visão "Todos os perfis" soma tudo.
        </Text>

        <Card padded={false}>
          {profiles.map((profile, index) => (
            <View key={profile.id} style={[styles.row, index > 0 ? styles.bordered : null]}>
              <View style={[styles.icon, { backgroundColor: `${profile.color}22` }]}>
                <Ionicons
                  name={profile.icon as keyof typeof Ionicons.glyphMap}
                  size={18}
                  color={profile.color}
                />
              </View>

              <Text variant="body" style={styles.rowLabel}>
                {profile.name}
              </Text>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Editar ${profile.name}`}
                onPress={() => openEdit(profile)}
                style={styles.rowAction}
              >
                <Ionicons name="pencil" size={17} color={colors.textMuted} />
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Excluir ${profile.name}`}
                onPress={() => remove(profile)}
                style={styles.rowAction}
              >
                <Ionicons name="trash-outline" size={17} color={colors.negative} />
              </Pressable>
            </View>
          ))}
        </Card>

        <Button label="Novo perfil" icon="add" onPress={openCreate} variant="secondary" fullWidth />
      </ScrollView>

      <Sheet visible={creating} title={editing ? 'Editar perfil' : 'Novo perfil'} onClose={close}>
        <View style={styles.form}>
          <Field label="Nome" error={error ?? undefined}>
            <Input
              value={name}
              onChangeText={(text) => {
                setName(text);
                setError(null);
              }}
              placeholder="Pessoal, Empresa…"
              maxLength={24}
              invalid={Boolean(error)}
            />
          </Field>

          <Field label="Cor">
            <View style={styles.swatches}>
              {palette.map((option) => (
                <Pressable
                  key={option}
                  accessibilityRole="button"
                  accessibilityLabel={`Cor ${option}`}
                  accessibilityState={{ selected: color === option }}
                  onPress={() => setColor(option)}
                  style={[
                    styles.swatch,
                    { backgroundColor: option },
                    color === option ? styles.swatchSelected : null,
                  ]}
                >
                  {color === option ? (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  ) : null}
                </Pressable>
              ))}
            </View>
          </Field>

          <Field label="Ícone">
            <View style={styles.swatches}>
              {ICONS.map((option) => (
                <Pressable
                  key={option}
                  accessibilityRole="button"
                  accessibilityLabel={`Ícone ${option}`}
                  accessibilityState={{ selected: icon === option }}
                  onPress={() => setIcon(option)}
                  style={[styles.iconOption, icon === option ? styles.iconOptionSelected : null]}
                >
                  <Ionicons
                    name={option}
                    size={18}
                    color={icon === option ? color : colors.textMuted}
                  />
                </Pressable>
              ))}
            </View>
          </Field>

          <Button
            label={editing ? 'Salvar' : 'Criar perfil'}
            onPress={save}
            size="lg"
            fullWidth
            loading={saving}
          />
        </View>
      </Sheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  topButton: {
    minWidth: 64,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 60,
  },
  bordered: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    flex: 1,
  },
  rowAction: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    gap: spacing.lg,
    paddingBottom: spacing.md,
  },
  swatches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  swatch: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchSelected: {
    borderWidth: 2,
    borderColor: colors.text,
  },
  iconOption: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconOptionSelected: {
    backgroundColor: colors.cardElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
