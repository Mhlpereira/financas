import type * as SQLite from 'expo-sqlite';

import { createId } from '@/utils/id';

const now = () => new Date().toISOString();

const PROFILES = [
  { name: 'Pessoal', color: '#6366F1', icon: 'person' },
  { name: 'Empresa', color: '#14B8A6', icon: 'briefcase' },
] as const;

const EXPENSE_CATEGORIES = [
  { name: 'Moradia', icon: 'home', color: '#8B5CF6' },
  { name: 'Mercado', icon: 'cart', color: '#84CC16' },
  { name: 'Transporte', icon: 'car', color: '#3B82F6' },
  { name: 'Saúde', icon: 'medkit', color: '#F43F5E' },
  { name: 'Lazer', icon: 'game-controller', color: '#EC4899' },
  { name: 'Educação', icon: 'school', color: '#06B6D4' },
  { name: 'Assinaturas', icon: 'tv', color: '#F97316' },
  { name: 'Impostos', icon: 'document-text', color: '#64748B' },
  { name: 'Serviços', icon: 'construct', color: '#FBBF24' },
  { name: 'Outros', icon: 'ellipsis-horizontal', color: '#8A9AAD' },
] as const;

const INCOME_CATEGORIES = [
  { name: 'Salário', icon: 'wallet', color: '#34D399' },
  { name: 'Freelance', icon: 'laptop', color: '#14B8A6' },
  { name: 'Investimentos', icon: 'trending-up', color: '#06B6D4' },
  { name: 'Outros', icon: 'ellipsis-horizontal', color: '#8A9AAD' },
] as const;

export async function seedDatabase(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.withTransactionAsync(async () => {
    let firstProfileId = '';

    for (const [index, profile] of PROFILES.entries()) {
      const id = createId();
      if (index === 0) firstProfileId = id;
      await db.runAsync(
        `INSERT INTO profiles (id, name, color, icon, sort_order, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id, profile.name, profile.color, profile.icon, index, now()],
      );
    }

    for (const [index, category] of EXPENSE_CATEGORIES.entries()) {
      await db.runAsync(
        `INSERT INTO categories (id, name, icon, color, kind, is_system, sort_order)
         VALUES (?, ?, ?, ?, 'expense', 1, ?)`,
        [createId(), category.name, category.icon, category.color, index],
      );
    }

    for (const [index, category] of INCOME_CATEGORIES.entries()) {
      await db.runAsync(
        `INSERT INTO categories (id, name, icon, color, kind, is_system, sort_order)
         VALUES (?, ?, ?, ?, 'income', 1, ?)`,
        [createId(), category.name, category.icon, category.color, index],
      );
    }

    const defaults: Array<[string, string]> = [
      ['active_profile_id', firstProfileId],
      ['biometrics_enabled', '0'],
      ['lock_timeout_seconds', '60'],
      ['horizon_months', '36'],
      ['onboarding_done', '0'],
    ];

    for (const [key, value] of defaults) {
      await db.runAsync(
        `INSERT INTO settings (key, value) VALUES (?, ?)
         ON CONFLICT (key) DO UPDATE SET value = excluded.value`,
        [key, value],
      );
    }
  });
}
