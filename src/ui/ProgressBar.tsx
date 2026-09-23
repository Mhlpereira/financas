import { StyleSheet, View } from 'react-native';

import { colors, radius } from '@/theme';

export interface ProgressBarProps {
  ratio: number;
  color?: string;
  height?: number;
  trackColor?: string;
}

export function ProgressBar({
  ratio,
  color = colors.brand,
  height = 8,
  trackColor = colors.surface,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(ratio, 1));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ now: Math.round(clamped * 100), min: 0, max: 100 }}
      style={[styles.track, { height, backgroundColor: trackColor, borderRadius: height / 2 }]}
    >
      <View
        style={{
          width: `${clamped * 100}%`,
          height: '100%',
          backgroundColor: color,
          borderRadius: height / 2,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: radius.pill,
  },
});
