import * as SQLite from 'expo-sqlite';

import { CREATE_SCHEMA, SCHEMA_VERSION } from './schema';
import { seedDatabase } from './seed';

const DB_NAME = 'meucaixa.db';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) dbPromise = open();
  return dbPromise;
}

async function open(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync(DB_NAME);
  await db.execAsync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
  await migrate(db);
  return db;
}

async function migrate(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(CREATE_SCHEMA);

  const current = await readVersion(db);

  if (current === 0) {
    await seedDatabase(db);
    await writeVersion(db, SCHEMA_VERSION);
    return;
  }

  if (current < SCHEMA_VERSION) await writeVersion(db, SCHEMA_VERSION);
}

async function readVersion(db: SQLite.SQLiteDatabase): Promise<number> {
  const row = await db.getFirstAsync<{ value: string }>(
    `SELECT value FROM settings WHERE key = 'schema_version'`,
  );
  return row ? Number(row.value) : 0;
}

async function writeVersion(db: SQLite.SQLiteDatabase, version: number): Promise<void> {
  await db.runAsync(
    `INSERT INTO settings (key, value) VALUES ('schema_version', ?)
     ON CONFLICT (key) DO UPDATE SET value = excluded.value`,
    [String(version)],
  );
}

export async function resetDatabase(): Promise<void> {
  const db = await getDb();
  await db.execAsync(`
    PRAGMA foreign_keys = OFF;
    DELETE FROM occurrences;
    DELETE FROM commitments;
    DELETE FROM categories;
    DELETE FROM profiles;
    DELETE FROM settings;
    PRAGMA foreign_keys = ON;
  `);
  await seedDatabase(db);
  await writeVersion(db, SCHEMA_VERSION);
}
