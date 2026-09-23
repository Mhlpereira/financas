import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, StyleSheet, View, type AppStateStatus } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LockScreen } from '@/screens/LockScreen';
import { OnboardingScreen } from '@/screens/OnboardingScreen';
import { useAppStore } from '@/stores/app';
import { useLockStore } from '@/stores/lock';
import { colors } from '@/theme';

export default function RootLayout() {
  const [booted, setBooted] = useState(false);

  const bootstrap = useAppStore((state) => state.bootstrap);
  const appReady = useAppStore((state) => state.ready);
  const onboardingDone = useAppStore((state) => state.onboardingDone);

  const checkLock = useLockStore((state) => state.check);
  const lockChecked = useLockStore((state) => state.checked);
  const unlocked = useLockStore((state) => state.unlocked);

  useEffect(() => {
    Promise.all([bootstrap(), checkLock()]).then(() => setBooted(true));
  }, [bootstrap, checkLock]);

  useAutoLock();

  const loading = !booted || !appReady || !lockChecked;

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        {loading ? (
          <View style={styles.splash}>
            <ActivityIndicator color={colors.brand} />
          </View>
        ) : !unlocked ? (
          <LockScreen />
        ) : !onboardingDone ? (
          <OnboardingScreen />
        ) : (
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.bg },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="entry" options={{ presentation: 'modal' }} />
            <Stack.Screen name="occurrence/[id]" options={{ presentation: 'modal' }} />
            <Stack.Screen name="profiles" options={{ presentation: 'modal' }} />
            <Stack.Screen name="security" options={{ presentation: 'modal' }} />
            <Stack.Screen name="categories" options={{ presentation: 'modal' }} />
          </Stack>
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function useAutoLock() {
  const markBackgrounded = useLockStore((state) => state.markBackgrounded);
  const shouldRelock = useLockStore((state) => state.shouldRelock);
  const lock = useLockStore((state) => state.lock);
  const previous = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (next) => {
      const wasActive = previous.current === 'active';

      if (wasActive && next.match(/inactive|background/)) {
        markBackgrounded();
      }

      if (!wasActive && next === 'active' && shouldRelock()) {
        lock();
      }

      previous.current = next;
    });

    return () => subscription.remove();
  }, [markBackgrounded, shouldRelock, lock]);
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
});
