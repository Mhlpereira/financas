import { Text as RNText, type TextProps, type TextStyle } from 'react-native';

import { colors, typography } from '@/theme';

type Variant = keyof typeof typography;
type Tone = 'default' | 'muted' | 'faint' | 'positive' | 'negative' | 'warning' | 'brand';

const TONE_COLORS: Record<Tone, string> = {
  default: colors.text,
  muted: colors.textMuted,
  faint: colors.textFaint,
  positive: colors.positive,
  negative: colors.negative,
  warning: colors.warning,
  brand: colors.brandText,
};

export interface AppTextProps extends TextProps {
  variant?: Variant;
  tone?: Tone;
  color?: string;
  align?: TextStyle['textAlign'];
}

export function Text({
  variant = 'body',
  tone = 'default',
  color,
  align,
  style,
  ...rest
}: AppTextProps) {
  return (
    <RNText
      {...rest}
      style={[
        typography[variant],
        { color: color ?? TONE_COLORS[tone] },
        align ? { textAlign: align } : null,
        style,
      ]}
    />
  );
}
