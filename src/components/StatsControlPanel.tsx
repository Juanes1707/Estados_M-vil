import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { BuildPreset, StatKey } from '../types/game';
import { useAppDispatch, useAppSelector } from '../store';
import { selectEquipmentBonuses, selectTotalStats } from '../store/selectors';
import { applyBuildPreset, decrementStat, healHero, incrementStat, resetStats } from '../store/slices/statsSlice';
import { ProgressBar, SectionShell } from './ui';

const statConfig: Array<{ key: StatKey; label: string; icon: string; color: string }> = [
  { key: 'str', label: 'Fuerza', icon: '⚔️', color: colors.danger },
  { key: 'agi', label: 'Agilidad', icon: '🎯', color: colors.hp },
  { key: 'int', label: 'Inteligencia', icon: '✦', color: colors.mana },
];

const presets: Array<{ id: BuildPreset; label: string; icon: string }> = [
  { id: 'WARRIOR', label: 'Guerrero', icon: '⚔️' },
  { id: 'MAGE', label: 'Mago', icon: '🪄' },
  { id: 'ROGUE', label: 'Pícaro', icon: '🗡️' },
];

export function StatsControlPanel() {
  const dispatch = useAppDispatch();
  const stats = useAppSelector((state) => state.stats);
  const bonuses = useAppSelector(selectEquipmentBonuses);
  const totals = useAppSelector(selectTotalStats);

  return (
    <SectionShell title="Cámara de entrenamiento" subtitle="Atributos base, bonos y total efectivo" mark="B" accent={colors.hp}>
      <View style={styles.pointsPanel}>
        <View>
          <Text style={styles.pointsLabel}>Puntos por asignar</Text>
          <Text style={styles.pointsHint}>El presupuesto total siempre es 30</Text>
        </View>
        <Text style={styles.pointsValue}>{stats.availablePoints}</Text>
      </View>

      <View style={styles.statList}>
        {statConfig.map(({ key, label, icon, color }) => {
          const base = stats[key];
          const bonus = bonuses[key];
          const total = totals[key];
          const minusDisabled = base <= 1;
          const plusDisabled = stats.availablePoints <= 0;
          return (
            <View key={key} style={styles.statCard}>
              <View style={styles.statTop}>
                <Text style={styles.statIcon}>{icon}</Text>
                <View style={styles.statCopy}>
                  <Text style={styles.statLabel}>{label}</Text>
                  <Text style={styles.statFormula}>Base {base} + equipo {bonus} = <Text style={{ color }}>{total}</Text></Text>
                </View>
                <View style={styles.stepper}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Reducir ${label}`}
                    disabled={minusDisabled}
                    onPress={() => dispatch(decrementStat(key))}
                    style={({ pressed }) => [styles.stepButton, minusDisabled ? styles.disabled : null, pressed ? styles.pressed : null]}
                  ><Text style={styles.stepText}>−</Text></Pressable>
                  <Text style={[styles.statTotal, { color }]}>{total}</Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Aumentar ${label}`}
                    disabled={plusDisabled}
                    onPress={() => dispatch(incrementStat(key))}
                    style={({ pressed }) => [styles.stepButton, plusDisabled ? styles.disabled : null, pressed ? styles.pressed : null]}
                  ><Text style={styles.stepText}>+</Text></Pressable>
                </View>
              </View>
              <ProgressBar value={(total / 30) * 100} color={color} height={7} />
            </View>
          );
        })}
      </View>

      <View style={styles.group}>
        <Text style={styles.groupTitle}>Forjas prediseñadas · un dispatch</Text>
        <View style={styles.presetRow}>
          {presets.map((preset) => (
            <Pressable
              key={preset.id}
              accessibilityRole="button"
              onPress={() => dispatch(applyBuildPreset(preset.id))}
              style={({ pressed }) => [styles.presetButton, pressed ? styles.pressed : null]}
            >
              <Text style={styles.presetIcon}>{preset.icon}</Text>
              <Text style={styles.presetText}>{preset.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.actionRow}>
        <Pressable onPress={() => dispatch(resetStats())} style={({ pressed }) => [styles.secondaryButton, pressed ? styles.pressed : null]}>
          <Text style={styles.secondaryText}>↺ Restablecer atributos</Text>
        </Pressable>
        <Pressable onPress={() => dispatch(healHero())} style={({ pressed }) => [styles.healButton, pressed ? styles.pressed : null]}>
          <Text style={styles.healText}>✦ Curar al héroe</Text>
        </Pressable>
      </View>
    </SectionShell>
  );
}

const styles = StyleSheet.create({
  pointsPanel: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#14251E', borderWidth: 1, borderColor: '#285B42', padding: 14, borderRadius: 14 },
  pointsLabel: { color: colors.text, fontSize: 14, fontWeight: '800' },
  pointsHint: { color: colors.muted, fontSize: 10, marginTop: 2 },
  pointsValue: { color: colors.hp, fontSize: 32, fontWeight: '900' },
  statList: { gap: 10 },
  statCard: { backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 12, gap: 10 },
  statTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statIcon: { fontSize: 22 },
  statCopy: { flex: 1 },
  statLabel: { color: colors.text, fontSize: 14, fontWeight: '800' },
  statFormula: { color: colors.muted, fontSize: 10, marginTop: 2 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepButton: { width: 34, height: 34, borderRadius: 10, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  stepText: { color: colors.text, fontSize: 20, fontWeight: '800' },
  statTotal: { minWidth: 23, textAlign: 'center', fontSize: 18, fontWeight: '900' },
  disabled: { opacity: 0.3 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
  group: { gap: 9 },
  groupTitle: { color: colors.muted, fontSize: 11, fontWeight: '700' },
  presetRow: { flexDirection: 'row', gap: 8 },
  presetButton: { flex: 1, borderWidth: 1, borderColor: colors.bronzeDark, backgroundColor: '#211A13', borderRadius: 12, paddingVertical: 12, alignItems: 'center', gap: 3 },
  presetIcon: { fontSize: 20 },
  presetText: { color: colors.text, fontSize: 11, fontWeight: '800' },
  actionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  secondaryButton: { flexGrow: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 13, alignItems: 'center' },
  secondaryText: { color: colors.muted, fontSize: 11, fontWeight: '800' },
  healButton: { flexGrow: 1, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 13, alignItems: 'center', backgroundColor: colors.hp },
  healText: { color: colors.ink, fontSize: 11, fontWeight: '900' },
});
