import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { useAppSelector } from '../store';
import { selectHeroSummary } from '../store/selectors';
import { HERO_MAX_HP } from '../store/slices/statsSlice';
import { Metric, ProgressBar, SectionShell } from './ui';

export function HeroAvatarHUD() {
  const summary = useAppSelector(selectHeroSummary);
  const currentHp = useAppSelector((state) => state.stats.currentHp);
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(pulse, { toValue: 1.06, duration: 180, useNativeDriver: true }),
      Animated.spring(pulse, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();
  }, [pulse, summary.heroClass.name, summary.weaponIcon]);

  const loadColor = summary.overloaded ? colors.danger : summary.loadPercent >= 75 ? colors.warning : colors.hp;
  const healthColor = summary.health === 'Derrotado' ? colors.danger : summary.health === 'Herido' ? colors.warning : colors.hp;

  return (
    <SectionShell title="El campeón forjado" subtitle="HUD derivado de stats + inventory" mark="A" accent={summary.heroClass.auraColor}>
      <View style={styles.heroStage}>
        <View style={[styles.aura, { borderColor: summary.heroClass.auraColor, shadowColor: summary.heroClass.auraColor }]}>
          <Animated.View style={[styles.avatar, { transform: [{ scale: pulse }] }]}>
            <Text style={styles.avatarIcon}>{summary.health === 'Derrotado' ? '💀' : summary.heroClass.icon}</Text>
            <View style={styles.weapon}><Text style={styles.weaponIcon}>{summary.weaponIcon}</Text></View>
          </Animated.View>
        </View>
        <View style={styles.identity}>
          <Text style={styles.heroName}>Aster de la Forja</Text>
          <Text style={[styles.className, { color: summary.heroClass.auraColor }]}>{summary.heroClass.name}</Text>
          <Text style={styles.epithet}>{summary.heroClass.epithet}</Text>
          <View style={[styles.statusBadge, { borderColor: healthColor }]}>
            <View style={[styles.statusDot, { backgroundColor: healthColor }]} />
            <Text style={[styles.statusText, { color: healthColor }]}>{summary.health}</Text>
          </View>
        </View>
      </View>

      <View style={styles.bars}>
        <View style={styles.barBlock}>
          <View style={styles.barHeader}><Text style={styles.barLabel}>Vida</Text><Text style={styles.barValue}>{currentHp}/{HERO_MAX_HP}</Text></View>
          <ProgressBar value={summary.hpPercent} color={healthColor} height={11} />
        </View>
        <View style={styles.barBlock}>
          <View style={styles.barHeader}><Text style={styles.barLabel}>Potencial mágico</Text><Text style={styles.barValue}>{summary.mana}%</Text></View>
          <ProgressBar value={summary.mana} color={colors.mana} />
        </View>
        <View style={styles.barBlock}>
          <View style={styles.barHeader}><Text style={styles.barLabel}>Carga</Text><Text style={[styles.barValue, { color: loadColor }]}>{summary.weight}/{summary.capacity} kg</Text></View>
          <ProgressBar value={summary.loadPercent} color={loadColor} />
        </View>
      </View>

      {summary.overloaded ? (
        <View style={styles.overload}><Text style={styles.overloadText}>¡SOBRECARGADO! Poder -30% · Velocidad -50%</Text></View>
      ) : null}

      <View style={styles.metrics}>
        <Metric label="STR efectivo" value={summary.totalStats.str} accent={colors.danger} />
        <Metric label="AGI efectivo" value={summary.totalStats.agi} accent={colors.hp} />
        <Metric label="INT efectivo" value={summary.totalStats.int} accent={colors.mana} />
        <Metric label="Poder" value={summary.combatPower} accent={colors.bronze} />
      </View>
    </SectionShell>
  );
}

const styles = StyleSheet.create({
  heroStage: { flexDirection: 'row', alignItems: 'center', gap: 18, paddingVertical: 5 },
  aura: { width: 116, height: 116, borderRadius: 58, borderWidth: 2, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.black, shadowOpacity: 0.7, shadowRadius: 18, elevation: 10 },
  avatar: { width: 92, height: 92, borderRadius: 46, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceRaised },
  avatarIcon: { fontSize: 50 },
  weapon: { position: 'absolute', right: -8, bottom: -5, width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.ink, borderWidth: 1, borderColor: colors.bronzeDark },
  weaponIcon: { fontSize: 23 },
  identity: { flex: 1, alignItems: 'flex-start', gap: 3 },
  heroName: { color: colors.text, fontSize: 18, fontWeight: '900' },
  className: { fontSize: 17, fontWeight: '800' },
  epithet: { color: colors.muted, fontSize: 11, lineHeight: 16 },
  statusBadge: { marginTop: 6, flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderRadius: 99, paddingHorizontal: 9, paddingVertical: 5 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: '800' },
  bars: { gap: 12 },
  barBlock: { gap: 6 },
  barHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  barLabel: { color: colors.muted, fontSize: 11, fontWeight: '700' },
  barValue: { color: colors.text, fontSize: 11, fontWeight: '800' },
  overload: { borderRadius: 12, borderWidth: 1, borderColor: colors.danger, backgroundColor: '#331520', padding: 10 },
  overloadText: { color: colors.danger, textAlign: 'center', fontSize: 12, fontWeight: '900' },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
