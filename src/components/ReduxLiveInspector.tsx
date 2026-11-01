import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { useAppDispatch, useAppSelector } from '../store';
import {
  selectActionLogEntries,
  selectBossPercentage,
  selectCombatPower,
  selectEffectiveSpeed,
  selectIsOverencumbered,
} from '../store/selectors';
import { BOSS_MAX_HP, HERO_MAX_HP } from '../store/slices/statsSlice';
import { performCombatTurn, restartEncounter } from '../features/combat/combatActions';
import { ProgressBar, SectionShell } from './ui';

export function ReduxLiveInspector() {
  const dispatch = useAppDispatch();
  const stats = useAppSelector((state) => state.stats);
  const combatPower = useAppSelector(selectCombatPower);
  const speed = useAppSelector(selectEffectiveSpeed);
  const overloaded = useAppSelector(selectIsOverencumbered);
  const bossPercent = useAppSelector(selectBossPercentage);
  const entries = useAppSelector(selectActionLogEntries);
  const heroDefeated = stats.currentHp <= 0;
  const bossDefeated = stats.bossHp <= 0;
  const fightOver = heroDefeated || bossDefeated;

  return (
    <SectionShell title="Arena e inspector Redux" subtitle="Combate reproducible + últimas 5 acciones reales" mark="D" accent={colors.violet}>
      <View style={styles.arena}>
        <View style={styles.combatantRow}>
          <View style={styles.combatant}>
            <Text style={styles.combatantIcon}>{heroDefeated ? '💀' : '🧙'}</Text>
            <Text style={styles.combatantName}>Aster</Text>
            <Text style={styles.combatantHp}>{stats.currentHp}/{HERO_MAX_HP} HP</Text>
          </View>
          <View style={styles.versus}>
            <Text style={styles.versusText}>VS</Text>
            <Text style={styles.roundText}>turnos deterministas</Text>
          </View>
          <View style={styles.combatant}>
            <Text style={styles.combatantIcon}>{bossDefeated ? '💀' : '🐲'}</Text>
            <Text style={styles.combatantName}>Vyrak</Text>
            <Text style={styles.combatantHp}>{stats.bossHp}/{BOSS_MAX_HP} HP</Text>
          </View>
        </View>

        <View style={styles.bossBar}>
          <View style={styles.barHeader}><Text style={styles.barLabel}>Jefe de la Forja</Text><Text style={styles.barLabel}>{bossPercent}%</Text></View>
          <ProgressBar value={bossPercent} color={colors.danger} height={12} />
        </View>

        <View style={styles.powerRow}>
          <View style={styles.powerBlock}><Text style={styles.powerValue}>{combatPower}</Text><Text style={styles.powerLabel}>Poder actual</Text></View>
          <View style={styles.powerBlock}><Text style={[styles.powerValue, overloaded ? styles.penalty : null]}>{speed}</Text><Text style={styles.powerLabel}>Velocidad</Text></View>
          <View style={styles.damageBlock}>
            <Text style={styles.damageText}>Golpe: {stats.lastHeroDamage || '—'}</Text>
            <Text style={styles.counterText}>Contraataque: {stats.lastBossDamage || '—'}</Text>
          </View>
        </View>

        {fightOver ? (
          <View style={[styles.result, bossDefeated ? styles.victory : styles.defeat]}>
            <Text style={styles.resultText}>{bossDefeated ? '🏆 Victoria: Vyrak ha caído' : '☠️ Derrota: cura o reinicia el encuentro'}</Text>
          </View>
        ) : null}

        <View style={styles.arenaActions}>
          <Pressable
            accessibilityRole="button"
            disabled={fightOver}
            onPress={() => dispatch(performCombatTurn())}
            style={({ pressed }) => [styles.attackButton, fightOver ? styles.disabled : null, pressed ? styles.pressed : null]}
          >
            <Text style={styles.attackText}>⚔️ Atacar al jefe</Text>
            <Text style={styles.attackHint}>Daño = 25% del poder</Text>
          </Pressable>
          <Pressable onPress={() => dispatch(restartEncounter())} style={({ pressed }) => [styles.restartButton, pressed ? styles.pressed : null]}>
            <Text style={styles.restartText}>↺ Reiniciar</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.inspector}>
        <View style={styles.consoleHeader}>
          <View style={styles.liveDot} />
          <Text style={styles.consoleTitle}>Redux Dispatch Stream</Text>
          <Text style={styles.consoleCount}>{entries.length}/5</Text>
        </View>
        {entries.length === 0 ? (
          <View style={styles.emptyConsole}>
            <Text style={styles.emptyTitle}>Aún no hay acciones</Text>
            <Text style={styles.emptyText}>Equipa un objeto o modifica un atributo para ver el flujo.</Text>
          </View>
        ) : entries.map((entry, index) => (
          <View key={entry.id} style={styles.logRow}>
            <Text style={styles.logIndex}>{String(index + 1).padStart(2, '0')}</Text>
            <View style={styles.logCopy}>
              <Text selectable style={styles.logType}>{entry.type}</Text>
              <Text selectable numberOfLines={2} style={styles.logPayload}>{entry.label}</Text>
            </View>
          </View>
        ))}
      </View>
    </SectionShell>
  );
}

const styles = StyleSheet.create({
  arena: { backgroundColor: '#171326', borderRadius: 18, borderWidth: 1, borderColor: '#41336C', padding: 14, gap: 14 },
  combatantRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  combatant: { flex: 1, alignItems: 'center', gap: 2 },
  combatantIcon: { fontSize: 48 },
  combatantName: { color: colors.text, fontSize: 13, fontWeight: '900' },
  combatantHp: { color: colors.muted, fontSize: 10 },
  versus: { alignItems: 'center', paddingHorizontal: 8 },
  versusText: { color: colors.violet, fontSize: 18, fontWeight: '900' },
  roundText: { color: colors.muted, fontSize: 7, maxWidth: 62, textAlign: 'center', marginTop: 2 },
  bossBar: { gap: 5 },
  barHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  barLabel: { color: colors.muted, fontSize: 10, fontWeight: '700' },
  powerRow: { flexDirection: 'row', gap: 8, alignItems: 'stretch' },
  powerBlock: { minWidth: 72, backgroundColor: colors.black, borderRadius: 12, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  powerValue: { color: colors.bronze, fontSize: 22, fontWeight: '900' },
  penalty: { color: colors.danger },
  powerLabel: { color: colors.muted, fontSize: 8 },
  damageBlock: { flex: 1, justifyContent: 'center', backgroundColor: colors.black, borderRadius: 12, paddingHorizontal: 10, borderWidth: 1, borderColor: colors.border },
  damageText: { color: colors.hp, fontSize: 10, fontWeight: '700' },
  counterText: { color: colors.danger, fontSize: 10, marginTop: 4 },
  result: { borderRadius: 10, padding: 9, borderWidth: 1 },
  victory: { backgroundColor: '#123121', borderColor: colors.hp },
  defeat: { backgroundColor: '#35131C', borderColor: colors.danger },
  resultText: { color: colors.text, fontSize: 11, fontWeight: '800', textAlign: 'center' },
  arenaActions: { flexDirection: 'row', gap: 8 },
  attackButton: { flex: 1, backgroundColor: colors.danger, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  attackText: { color: colors.white, fontSize: 13, fontWeight: '900' },
  attackHint: { color: '#FFE2E4', fontSize: 8, marginTop: 2 },
  restartButton: { minWidth: 86, borderWidth: 1, borderColor: colors.border, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  restartText: { color: colors.text, fontSize: 11, fontWeight: '800' },
  disabled: { opacity: 0.35 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
  inspector: { backgroundColor: colors.black, borderRadius: 15, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  consoleHeader: { flexDirection: 'row', alignItems: 'center', gap: 7, padding: 11, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: '#0D1422' },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.hp },
  consoleTitle: { flex: 1, color: colors.text, fontFamily: 'monospace', fontSize: 11, fontWeight: '700' },
  consoleCount: { color: colors.muted, fontFamily: 'monospace', fontSize: 9 },
  emptyConsole: { padding: 20, alignItems: 'center' },
  emptyTitle: { color: colors.text, fontSize: 12, fontWeight: '800' },
  emptyText: { color: colors.muted, fontSize: 9, textAlign: 'center', marginTop: 4 },
  logRow: { flexDirection: 'row', gap: 9, padding: 10, borderBottomWidth: 1, borderBottomColor: '#1D2638' },
  logIndex: { color: colors.disabled, fontFamily: 'monospace', fontSize: 9, paddingTop: 1 },
  logCopy: { flex: 1 },
  logType: { color: colors.violetSoft, fontFamily: 'monospace', fontSize: 10, fontWeight: '700' },
  logPayload: { color: colors.muted, fontFamily: 'monospace', fontSize: 9, marginTop: 3 },
});
