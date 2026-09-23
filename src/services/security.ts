import * as Crypto from 'expo-crypto';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

const HASH_KEY = 'pin_hash';
const SALT_KEY = 'pin_salt';
const ATTEMPTS_KEY = 'pin_attempts';
const LOCKED_UNTIL_KEY = 'pin_locked_until';

export const PIN_LENGTH = 6;

const LOCKOUT_STEPS_MS = [30_000, 60_000, 300_000, 900_000];
const FREE_ATTEMPTS = 4;

async function randomSalt(): Promise<string> {
  const bytes = await Crypto.getRandomBytesAsync(16);
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

async function hashPin(pin: string, salt: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${pin}`);
}

export async function hasPin(): Promise<boolean> {
  return (await SecureStore.getItemAsync(HASH_KEY)) !== null;
}

export async function setPin(pin: string): Promise<void> {
  const salt = await randomSalt();
  const hash = await hashPin(pin, salt);
  await SecureStore.setItemAsync(SALT_KEY, salt);
  await SecureStore.setItemAsync(HASH_KEY, hash);
  await resetAttempts();
}

export async function removePin(): Promise<void> {
  await SecureStore.deleteItemAsync(HASH_KEY);
  await SecureStore.deleteItemAsync(SALT_KEY);
  await resetAttempts();
}

export interface VerifyResult {
  ok: boolean;
  attemptsLeft: number;
  lockedUntil: number | null;
}

export async function verifyPin(pin: string): Promise<VerifyResult> {
  const lockedUntil = await getLockedUntil();
  if (lockedUntil && lockedUntil > Date.now()) {
    return { ok: false, attemptsLeft: 0, lockedUntil };
  }

  const [hash, salt] = await Promise.all([
    SecureStore.getItemAsync(HASH_KEY),
    SecureStore.getItemAsync(SALT_KEY),
  ]);

  if (!hash || !salt) return { ok: true, attemptsLeft: FREE_ATTEMPTS, lockedUntil: null };

  const candidate = await hashPin(pin, salt);

  if (candidate === hash) {
    await resetAttempts();
    return { ok: true, attemptsLeft: FREE_ATTEMPTS, lockedUntil: null };
  }

  const attempts = (await getAttempts()) + 1;
  await SecureStore.setItemAsync(ATTEMPTS_KEY, String(attempts));

  if (attempts > FREE_ATTEMPTS) {
    const stepIndex = Math.min(attempts - FREE_ATTEMPTS - 1, LOCKOUT_STEPS_MS.length - 1);
    const until = Date.now() + LOCKOUT_STEPS_MS[stepIndex];
    await SecureStore.setItemAsync(LOCKED_UNTIL_KEY, String(until));
    return { ok: false, attemptsLeft: 0, lockedUntil: until };
  }

  return { ok: false, attemptsLeft: FREE_ATTEMPTS - attempts, lockedUntil: null };
}

export async function getAttempts(): Promise<number> {
  const stored = await SecureStore.getItemAsync(ATTEMPTS_KEY);
  const parsed = Number(stored ?? '0');
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function getLockedUntil(): Promise<number | null> {
  const stored = await SecureStore.getItemAsync(LOCKED_UNTIL_KEY);
  if (!stored) return null;
  const parsed = Number(stored);
  if (!Number.isFinite(parsed)) return null;
  if (parsed <= Date.now()) {
    await SecureStore.deleteItemAsync(LOCKED_UNTIL_KEY);
    return null;
  }
  return parsed;
}

async function resetAttempts(): Promise<void> {
  await SecureStore.deleteItemAsync(ATTEMPTS_KEY);
  await SecureStore.deleteItemAsync(LOCKED_UNTIL_KEY);
}

export interface BiometricsInfo {
  available: boolean;
  label: string;
}

export async function getBiometricsInfo(): Promise<BiometricsInfo> {
  const [hasHardware, isEnrolled, types] = await Promise.all([
    LocalAuthentication.hasHardwareAsync(),
    LocalAuthentication.isEnrolledAsync(),
    LocalAuthentication.supportedAuthenticationTypesAsync(),
  ]);

  const available = hasHardware && isEnrolled;
  const hasFace = types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION);

  return { available, label: hasFace ? 'Face ID' : 'digital' };
}

export async function authenticateWithBiometrics(): Promise<boolean> {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Desbloquear o Meu Caixa',
    cancelLabel: 'Usar PIN',
    disableDeviceFallback: true,
  });
  return result.success;
}
