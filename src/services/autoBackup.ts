import { Directory, File } from 'expo-file-system';

import { exportBackup } from '@/repositories/backup';
import { getSetting, setSetting } from '@/repositories/settings';
import { todayISO } from '@/utils/date';

const FILE_PREFIX = 'meu-caixa-';
const KEEP_FILES = 7;
const MIN_HOURS_BETWEEN = 12;

export interface BackupFolder {
  uri: string;
  label: string;
}

function labelFor(uri: string): string {
  try {
    const decoded = decodeURIComponent(uri);
    const tail = decoded.split(':').pop() ?? decoded;
    return tail.split('/').filter(Boolean).pop() ?? 'pasta escolhida';
  } catch {
    return 'pasta escolhida';
  }
}

export async function getBackupFolder(): Promise<BackupFolder | null> {
  const uri = await getSetting('backup_folder_uri');
  return uri ? { uri, label: labelFor(uri) } : null;
}

export async function getLastBackupAt(): Promise<Date | null> {
  const stored = await getSetting('backup_last_at');
  if (!stored) return null;
  const parsed = new Date(stored);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export async function chooseBackupFolder(): Promise<BackupFolder | null> {
  const picked = await Directory.pickDirectoryAsync();
  if (!picked) return null;

  await setSetting('backup_folder_uri', picked.uri);
  return { uri: picked.uri, label: labelFor(picked.uri) };
}

export async function disableAutoBackup(): Promise<void> {
  await setSetting('backup_folder_uri', '');
  await setSetting('backup_last_at', '');
}

export class BackupFolderError extends Error {}

export async function writeBackupNow(): Promise<string> {
  const folder = await getBackupFolder();
  if (!folder) throw new BackupFolderError('Nenhuma pasta de backup escolhida.');

  const directory = new Directory(folder.uri);
  const payload = await exportBackup();
  const name = `${FILE_PREFIX}${todayISO()}.json`;

  removeExisting(directory, name);

  const file = directory.createFile(name, 'application/json');
  file.write(JSON.stringify(payload, null, 2));

  await setSetting('backup_last_at', new Date().toISOString());
  pruneOldBackups(directory);

  return name;
}

function removeExisting(directory: Directory, name: string): void {
  try {
    for (const entry of directory.list()) {
      if (entry instanceof File && entry.name === name) entry.delete();
    }
  } catch {
    return;
  }
}

function pruneOldBackups(directory: Directory): void {
  try {
    const backups = directory
      .list()
      .filter((entry): entry is File => entry instanceof File)
      .filter((entry) => entry.name.startsWith(FILE_PREFIX) && entry.name.endsWith('.json'))
      .sort((a, b) => (a.name < b.name ? 1 : -1));

    for (const stale of backups.slice(KEEP_FILES)) stale.delete();
  } catch {
    return;
  }
}

export async function runAutoBackup(): Promise<boolean> {
  const folder = await getBackupFolder();
  if (!folder) return false;

  const last = await getLastBackupAt();
  if (last) {
    const hours = (Date.now() - last.getTime()) / 3_600_000;
    if (hours < MIN_HOURS_BETWEEN) return false;
  }

  try {
    await writeBackupNow();
    return true;
  } catch {
    return false;
  }
}
