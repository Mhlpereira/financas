import { getDb } from '@/db/client';
import type { Profile } from '@/domain/types';
import { createId } from '@/utils/id';

import { toProfile, type ProfileRow } from './mappers';

export async function listProfiles(): Promise<Profile[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<ProfileRow>(
    'SELECT * FROM profiles ORDER BY sort_order ASC, created_at ASC',
  );
  return rows.map(toProfile);
}

export async function getProfile(id: string): Promise<Profile | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<ProfileRow>('SELECT * FROM profiles WHERE id = ?', [id]);
  return row ? toProfile(row) : null;
}

export async function countProfiles(): Promise<number> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ total: number }>('SELECT COUNT(*) AS total FROM profiles');
  return row?.total ?? 0;
}

export interface ProfileInput {
  name: string;
  color: string;
  icon: string;
}

export async function createProfile(input: ProfileInput): Promise<Profile> {
  const db = await getDb();
  const id = createId();
  const createdAt = new Date().toISOString();

  const row = await db.getFirstAsync<{ next: number }>(
    'SELECT COALESCE(MAX(sort_order), -1) + 1 AS next FROM profiles',
  );
  const sortOrder = row?.next ?? 0;

  await db.runAsync(
    `INSERT INTO profiles (id, name, color, icon, sort_order, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, input.name.trim(), input.color, input.icon, sortOrder, createdAt],
  );

  return { id, name: input.name.trim(), color: input.color, icon: input.icon, sortOrder, createdAt };
}

export async function updateProfile(id: string, input: ProfileInput): Promise<void> {
  const db = await getDb();
  await db.runAsync('UPDATE profiles SET name = ?, color = ?, icon = ? WHERE id = ?', [
    input.name.trim(),
    input.color,
    input.icon,
    id,
  ]);
}

export async function deleteProfile(id: string): Promise<void> {
  const db = await getDb();
  await db.withTransactionAsync(async () => {
    await db.runAsync('DELETE FROM occurrences WHERE profile_id = ?', [id]);
    await db.runAsync('DELETE FROM profiles WHERE id = ?', [id]);
  });
}

export async function nameExists(name: string, exceptId?: string): Promise<boolean> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ total: number }>(
    `SELECT COUNT(*) AS total FROM profiles
     WHERE LOWER(TRIM(name)) = LOWER(TRIM(?)) AND id != ?`,
    [name, exceptId ?? ''],
  );
  return (row?.total ?? 0) > 0;
}
