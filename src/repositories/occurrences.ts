import { getDb } from '@/db/client';
import type { MonthTotalsRow } from '@/domain/calc';
import type { Cents, Competence, Occurrence, OccurrenceView, Scope } from '@/domain/types';
import { ALL_PROFILES } from '@/domain/types';

import {
  OCCURRENCE_VIEW_SELECT,
  toOccurrence,
  toOccurrenceView,
  type OccurrenceRow,
  type OccurrenceViewRow,
} from './mappers';

function scopeFilter(scope: Scope): { clause: string; params: string[] } {
  return scope === ALL_PROFILES
    ? { clause: '', params: [] }
    : { clause: 'AND o.profile_id = ?', params: [scope] };
}

export async function listMonth(
  competence: Competence,
  scope: Scope,
): Promise<OccurrenceView[]> {
  const db = await getDb();
  const { clause, params } = scopeFilter(scope);

  const rows = await db.getAllAsync<OccurrenceViewRow>(
    `${OCCURRENCE_VIEW_SELECT}
     WHERE o.competence = ? ${clause}
     ORDER BY o.due_date ASC, c.description ASC`,
    [competence, ...params],
  );

  return rows.map(toOccurrenceView);
}

export async function getOccurrence(id: string): Promise<OccurrenceView | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<OccurrenceViewRow>(
    `${OCCURRENCE_VIEW_SELECT} WHERE o.id = ?`,
    [id],
  );
  return row ? toOccurrenceView(row) : null;
}

export async function listMonthTotals(
  from: Competence,
  to: Competence,
  scope: Scope,
): Promise<MonthTotalsRow[]> {
  const db = await getDb();
  const { clause, params } = scopeFilter(scope);

  const rows = await db.getAllAsync<{ competence: string; income: number; expense: number }>(
    `SELECT
       o.competence AS competence,
       COALESCE(SUM(CASE WHEN o.kind = 'income'  THEN o.amount ELSE 0 END), 0) AS income,
       COALESCE(SUM(CASE WHEN o.kind = 'expense' THEN o.amount ELSE 0 END), 0) AS expense
     FROM occurrences o
     WHERE o.competence >= ? AND o.competence <= ? AND o.status != 'skipped' ${clause}
     GROUP BY o.competence
     ORDER BY o.competence ASC`,
    [from, to, ...params],
  );

  return rows.map((row) => ({
    competence: row.competence,
    income: row.income,
    expense: row.expense,
  }));
}

export async function setStatus(
  id: string,
  status: Occurrence['status'],
): Promise<void> {
  const db = await getDb();
  const paidAt = status === 'paid' ? new Date().toISOString() : null;
  await db.runAsync('UPDATE occurrences SET status = ?, paid_at = ? WHERE id = ?', [
    status,
    paidAt,
    id,
  ]);
}

export async function togglePaid(id: string): Promise<Occurrence['status']> {
  const db = await getDb();
  const row = await db.getFirstAsync<OccurrenceRow>('SELECT * FROM occurrences WHERE id = ?', [id]);
  if (!row) return 'pending';

  const next = toOccurrence(row).status === 'paid' ? 'pending' : 'paid';
  await setStatus(id, next);
  return next;
}

export async function overrideAmount(id: string, amount: Cents): Promise<void> {
  const db = await getDb();
  await db.runAsync('UPDATE occurrences SET amount = ?, is_overridden = 1 WHERE id = ?', [
    amount,
    id,
  ]);
}

export async function clearOverride(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `UPDATE occurrences
     SET is_overridden = 0,
         amount = (SELECT amount FROM commitments WHERE id = occurrences.commitment_id)
     WHERE id = ?`,
    [id],
  );
}

export async function deleteOccurrence(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM occurrences WHERE id = ?', [id]);
}

export async function countInMonth(competence: Competence, scope: Scope): Promise<number> {
  const db = await getDb();
  const { clause, params } = scopeFilter(scope);
  const row = await db.getFirstAsync<{ total: number }>(
    `SELECT COUNT(*) AS total FROM occurrences o
     WHERE o.competence = ? ${clause}`,
    [competence, ...params],
  );
  return row?.total ?? 0;
}

export async function firstCompetence(scope: Scope): Promise<Competence | null> {
  const db = await getDb();
  const { clause, params } = scopeFilter(scope);
  const row = await db.getFirstAsync<{ first: string | null }>(
    `SELECT MIN(o.competence) AS first FROM occurrences o WHERE 1 = 1 ${clause}`,
    params,
  );
  return row?.first ?? null;
}
