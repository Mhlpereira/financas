import { getDb } from '@/db/client';
import type { Category, Kind } from '@/domain/types';
import { createId } from '@/utils/id';

import { toCategory, type CategoryRow } from './mappers';

export async function listCategories(kind?: Kind): Promise<Category[]> {
  const db = await getDb();
  const rows = kind
    ? await db.getAllAsync<CategoryRow>(
        'SELECT * FROM categories WHERE kind = ? ORDER BY sort_order ASC, name ASC',
        [kind],
      )
    : await db.getAllAsync<CategoryRow>(
        'SELECT * FROM categories ORDER BY kind ASC, sort_order ASC, name ASC',
      );
  return rows.map(toCategory);
}

export async function getCategory(id: string): Promise<Category | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<CategoryRow>('SELECT * FROM categories WHERE id = ?', [id]);
  return row ? toCategory(row) : null;
}

export interface CategoryInput {
  name: string;
  icon: string;
  color: string;
  kind: Kind;
}

export async function createCategory(input: CategoryInput): Promise<Category> {
  const db = await getDb();
  const id = createId();

  const row = await db.getFirstAsync<{ next: number }>(
    'SELECT COALESCE(MAX(sort_order), -1) + 1 AS next FROM categories WHERE kind = ?',
    [input.kind],
  );
  const sortOrder = row?.next ?? 0;

  await db.runAsync(
    `INSERT INTO categories (id, name, icon, color, kind, is_system, sort_order)
     VALUES (?, ?, ?, ?, ?, 0, ?)`,
    [id, input.name.trim(), input.icon, input.color, input.kind, sortOrder],
  );

  return {
    id,
    name: input.name.trim(),
    icon: input.icon,
    color: input.color,
    kind: input.kind,
    isSystem: false,
    sortOrder,
  };
}

export async function updateCategory(id: string, input: CategoryInput): Promise<void> {
  const db = await getDb();
  await db.runAsync('UPDATE categories SET name = ?, icon = ?, color = ? WHERE id = ?', [
    input.name.trim(),
    input.icon,
    input.color,
    id,
  ]);
}

export async function deleteCategory(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM categories WHERE id = ? AND is_system = 0', [id]);
}

export async function countCommitmentsUsing(categoryId: string): Promise<number> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ total: number }>(
    'SELECT COUNT(*) AS total FROM commitments WHERE category_id = ?',
    [categoryId],
  );
  return row?.total ?? 0;
}
