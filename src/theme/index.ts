export const colors = {
  bg: '#0B0F14',
  surface: '#151B23',
  card: '#1A222D',
  cardElevated: '#212B38',
  border: '#253040',
  borderStrong: '#31405433',

  text: '#E8EEF5',
  textMuted: '#8A9AAD',
  textFaint: '#5B6B7E',

  positive: '#34D399',
  positiveDim: '#34D39922',
  negative: '#F87171',
  negativeDim: '#F8717122',
  warning: '#FBBF24',
  warningDim: '#FBBF2422',

  brand: '#6366F1',
  brandDim: '#6366F122',
  brandText: '#C7D2FE',

  overlay: '#000000AA',
} as const;

export const palette = [
  '#6366F1',
  '#8B5CF6',
  '#EC4899',
  '#F43F5E',
  '#F97316',
  '#FBBF24',
  '#84CC16',
  '#34D399',
  '#14B8A6',
  '#06B6D4',
  '#3B82F6',
  '#64748B',
] as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const typography = {
  display: { fontSize: 40, fontWeight: '700' as const, letterSpacing: -1 },
  title: { fontSize: 24, fontWeight: '700' as const, letterSpacing: -0.4 },
  heading: { fontSize: 18, fontWeight: '600' as const, letterSpacing: -0.2 },
  body: { fontSize: 15, fontWeight: '500' as const },
  label: { fontSize: 13, fontWeight: '600' as const },
  caption: { fontSize: 12, fontWeight: '500' as const },
  micro: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 0.4 },
} as const;

export const moneyFont = {
  fontVariant: ['tabular-nums'] as const,
};

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  floating: {
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
} as const;

export function balanceColor(cents: number): string {
  if (cents > 0) return colors.positive;
  if (cents < 0) return colors.negative;
  return colors.textMuted;
}

export function kindColor(kind: 'income' | 'expense'): string {
  return kind === 'income' ? colors.positive : colors.negative;
}
