import { create } from 'zustand';

import { getNumberSetting, getBooleanSetting } from '@/repositories/settings';
import { getBiometricsInfo, hasPin } from '@/services/security';

interface LockState {
  checked: boolean;
  pinEnabled: boolean;
  unlocked: boolean;
  biometricsEnabled: boolean;
  biometricsAvailable: boolean;
  biometricsLabel: string;
  lockTimeoutSeconds: number;
  backgroundedAt: number | null;

  check: () => Promise<void>;
  unlock: () => void;
  lock: () => void;
  markBackgrounded: () => void;
  shouldRelock: () => boolean;
  setBiometricsEnabled: (enabled: boolean) => void;
  setPinEnabled: (enabled: boolean) => void;
}

export const useLockStore = create<LockState>((set, get) => ({
  checked: false,
  pinEnabled: false,
  unlocked: false,
  biometricsEnabled: false,
  biometricsAvailable: false,
  biometricsLabel: 'digital',
  lockTimeoutSeconds: 60,
  backgroundedAt: null,

  check: async () => {
    const [pinEnabled, biometricsEnabled, timeout, info] = await Promise.all([
      hasPin(),
      getBooleanSetting('biometrics_enabled'),
      getNumberSetting('lock_timeout_seconds', 60),
      getBiometricsInfo(),
    ]);

    set({
      checked: true,
      pinEnabled,
      unlocked: !pinEnabled,
      biometricsEnabled: biometricsEnabled && info.available,
      biometricsAvailable: info.available,
      biometricsLabel: info.label,
      lockTimeoutSeconds: timeout,
    });
  },

  unlock: () => set({ unlocked: true, backgroundedAt: null }),

  lock: () => set({ unlocked: false }),

  markBackgrounded: () => set({ backgroundedAt: Date.now() }),

  shouldRelock: () => {
    const { pinEnabled, backgroundedAt, lockTimeoutSeconds } = get();
    if (!pinEnabled || backgroundedAt === null) return false;
    return Date.now() - backgroundedAt > lockTimeoutSeconds * 1000;
  },

  setBiometricsEnabled: (enabled) => set({ biometricsEnabled: enabled }),

  setPinEnabled: (enabled) => set({ pinEnabled: enabled, unlocked: true }),
}));
