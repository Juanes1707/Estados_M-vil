import { StatusBar } from 'expo-status-bar';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';
import { ArmoryGrid } from './src/components/ArmoryGrid';
import { HeroAvatarHUD } from './src/components/HeroAvatarHUD';
import { ReduxLiveInspector } from './src/components/ReduxLiveInspector';
import { StatsControlPanel } from './src/components/StatsControlPanel';
import { store } from './src/store';
import { colors } from './src/theme/colors';

export default function App() {
  return (
    <Provider store={store}>
      <View style={styles.screen}>
        <StatusBar style="light" />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.masthead}>
            <View style={styles.brandMark}><Text style={styles.brandRune}>ᛇ</Text></View>
            <View style={styles.brandCopy}>
              <Text style={styles.brand}>HeroForge RPG</Text>
              <Text style={styles.tagline}>Un dispatch. Cuatro zonas. Un solo estado verdadero.</Text>
            </View>
            <View style={styles.reduxBadge}><Text style={styles.reduxText}>RTK</Text></View>
          </View>

          <View style={styles.flowStrip}>
            <Text style={styles.flowText}>Interacción</Text><Text style={styles.arrow}>→</Text>
            <Text style={styles.flowText}>dispatch</Text><Text style={styles.arrow}>→</Text>
            <Text style={styles.flowText}>Store</Text><Text style={styles.arrow}>→</Text>
            <Text style={styles.flowText}>Selectores</Text><Text style={styles.arrow}>→</Text>
            <Text style={styles.flowText}>UI</Text>
          </View>

          <HeroAvatarHUD />
          <StatsControlPanel />
          <ArmoryGrid />
          <ReduxLiveInspector />

          <View style={styles.footer}>
            <Text style={styles.footerRune}>ᚠ · ᚱ · ᚷ</Text>
            <Text style={styles.footerText}>Estado global visible, derivado y explicable.</Text>
          </View>
        </ScrollView>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.ink,
  },
  content: {
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingTop: Platform.OS === 'ios' ? 58 : 34,
    paddingBottom: 50,
    gap: 16,
  },
  masthead: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 4, paddingBottom: 4 },
  brandMark: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#241B11', borderWidth: 1, borderColor: colors.bronzeDark, alignItems: 'center', justifyContent: 'center' },
  brandRune: { color: colors.bronze, fontSize: 27, fontWeight: '900' },
  brandCopy: { flex: 1 },
  brand: { color: colors.text, fontSize: 25, fontWeight: '900', letterSpacing: -0.7 },
  tagline: { color: colors.muted, fontSize: 10, marginTop: 2 },
  reduxBadge: { backgroundColor: '#281E47', borderRadius: 9, borderWidth: 1, borderColor: '#5D4B91', paddingHorizontal: 9, paddingVertical: 7 },
  reduxText: { color: colors.violetSoft, fontSize: 10, fontWeight: '900' },
  flowStrip: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#0C1220', borderRadius: 12, padding: 10, borderWidth: 1, borderColor: '#242E44' },
  flowText: { color: colors.muted, fontSize: 9, fontWeight: '700' },
  arrow: { color: colors.bronze, fontSize: 11 },
  footer: { alignItems: 'center', paddingVertical: 18, gap: 5 },
  footerRune: { color: colors.bronzeDark, fontSize: 16 },
  footerText: { color: colors.disabled, fontSize: 10 },
});
