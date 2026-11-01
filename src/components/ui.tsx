import { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';

interface SectionShellProps extends PropsWithChildren {
  title: string;
  subtitle: string;
  mark: string;
  accent?: string;
  style?: StyleProp<ViewStyle>;
}

export function SectionShell({ title, subtitle, mark, accent = colors.bronze, style, children }: SectionShellProps) {
  return (
    <View style={[styles.shell, style]}>
      <View style={styles.headingRow}>
        <View style={[styles.mark, { borderColor: accent }]}><Text style={[styles.markText, { color: accent }]}>{mark}</Text></View>
        <View style={styles.headingCopy}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>
      {children}
    </View>
  );
}

interface ProgressBarProps {
  value: number;
  color: string;
  trackColor?: string;
  height?: number;
}

export function ProgressBar({ value, color, trackColor = colors.black, height = 9 }: ProgressBarProps) {
  const bounded = Math.max(0, Math.min(100, value));
  return (
    <View style={[styles.track, { height, backgroundColor: trackColor }]}>
      <View style={[styles.fill, { width: `${bounded}%`, backgroundColor: color }]} />
    </View>
  );
}

export function Metric({ label, value, accent = colors.text }: { label: string; value: string | number; accent?: string }) {
  return (
    <View style={styles.metric}>
      <Text style={[styles.metricValue, { color: accent }]}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    gap: 16,
    shadowColor: colors.black,
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  headingRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headingCopy: { flex: 1, gap: 2 },
  mark: { width: 38, height: 38, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.black },
  markText: { fontSize: 17, fontWeight: '900' },
  title: { color: colors.text, fontSize: 20, fontWeight: '900', letterSpacing: -0.4 },
  subtitle: { color: colors.muted, fontSize: 12, lineHeight: 17 },
  track: { width: '100%', borderRadius: 99, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  fill: { height: '100%', borderRadius: 99 },
  metric: { minWidth: 70, flex: 1, backgroundColor: colors.black, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 8, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  metricValue: { fontSize: 19, fontWeight: '900' },
  metricLabel: { color: colors.muted, fontSize: 10, marginTop: 2 },
});
