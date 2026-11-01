import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { colors } from '../theme/colors';
import { InventoryItem } from '../types/game';
import { useAppDispatch, useAppSelector } from '../store';
import { selectIsOverencumbered, selectMaxWeightCapacity, selectTotalWeight } from '../store/selectors';
import { clearEquipment, toggleEquipItem } from '../store/slices/inventorySlice';
import { SectionShell } from './ui';

function bonusLabel(item: InventoryItem) {
  const parts = [
    item.bonusStr > 0 ? `+${item.bonusStr} STR` : null,
    item.bonusAgi > 0 ? `+${item.bonusAgi} AGI` : null,
    item.bonusInt > 0 ? `+${item.bonusInt} INT` : null,
  ].filter((part): part is string => part !== null);
  return parts.join(' · ');
}

export function ArmoryGrid() {
  const dispatch = useAppDispatch();
  const { width } = useWindowDimensions();
  const { catalog, equippedIds } = useAppSelector((state) => state.inventory);
  const weight = useAppSelector(selectTotalWeight);
  const capacity = useAppSelector(selectMaxWeightCapacity);
  const overloaded = useAppSelector(selectIsOverencumbered);
  const cardWidth: '31%' | '48%' = width >= 720 ? '31%' : '48%';

  return (
    <SectionShell title="Armería de los seis sellos" subtitle="Cada toque despacha inventory/toggleEquipItem" mark="C" accent={colors.bronze}>
      <View style={styles.loadSummary}>
        <View>
          <Text style={styles.loadLabel}>Carga equipada</Text>
          <Text style={[styles.loadValue, overloaded ? styles.dangerText : null]}>{weight} / {capacity} kg</Text>
        </View>
        <Pressable
          disabled={equippedIds.length === 0}
          onPress={() => dispatch(clearEquipment())}
          style={({ pressed }) => [styles.clearButton, equippedIds.length === 0 ? styles.disabled : null, pressed ? styles.pressed : null]}
        >
          <Text style={styles.clearText}>Desequipar todo</Text>
        </Pressable>
      </View>

      {overloaded ? (
        <View style={styles.overloadBanner}>
          <Text style={styles.overloadIcon}>⚠️</Text>
          <View style={styles.overloadCopy}>
            <Text style={styles.overloadTitle}>¡SOBRECARGADO!</Text>
            <Text style={styles.overloadText}>-50% Velocidad · -30% Poder de combate</Text>
          </View>
        </View>
      ) : null}

      <View style={styles.grid}>
        {catalog.map((item) => {
          const equipped = equippedIds.includes(item.id);
          return (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityState={{ selected: equipped }}
              accessibilityLabel={`${equipped ? 'Desequipar' : 'Equipar'} ${item.name}`}
              onPress={() => dispatch(toggleEquipItem(item.id))}
              style={({ pressed }) => [
                styles.itemCard,
                { width: cardWidth },
                equipped ? styles.itemEquipped : null,
                pressed ? styles.pressed : null,
              ]}
            >
              <View style={styles.itemTop}>
                <View style={[styles.itemIconWrap, equipped ? styles.iconEquipped : null]}><Text style={styles.itemIcon}>{item.icon}</Text></View>
                <Text style={[styles.equipMark, equipped ? styles.equipMarkOn : null]}>{equipped ? '✓' : '+'}</Text>
              </View>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemCategory}>{item.category}</Text>
              <View style={styles.itemDivider} />
              <Text style={styles.bonus}>{bonusLabel(item)}</Text>
              <Text style={styles.weight}>{item.weight} kg</Text>
              <Text style={[styles.state, equipped ? styles.stateOn : null]}>{equipped ? 'Equipado' : 'Toca para equipar'}</Text>
            </Pressable>
          );
        })}
      </View>
    </SectionShell>
  );
}

const styles = StyleSheet.create({
  loadSummary: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.black, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 13 },
  loadLabel: { color: colors.muted, fontSize: 10 },
  loadValue: { color: colors.text, fontSize: 18, fontWeight: '900', marginTop: 2 },
  dangerText: { color: colors.danger },
  clearButton: { borderRadius: 10, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12, paddingVertical: 9 },
  clearText: { color: colors.text, fontSize: 10, fontWeight: '800' },
  disabled: { opacity: 0.35 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
  overloadBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 14, backgroundColor: '#35131C', borderWidth: 1, borderColor: colors.danger, padding: 13 },
  overloadIcon: { fontSize: 24 },
  overloadCopy: { flex: 1 },
  overloadTitle: { color: colors.danger, fontSize: 14, fontWeight: '900' },
  overloadText: { color: '#FFACB1', fontSize: 10, marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between' },
  itemCard: { minHeight: 190, borderRadius: 15, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceRaised, padding: 12 },
  itemEquipped: { borderColor: colors.bronze, backgroundColor: '#261E13', shadowColor: colors.bronze, shadowOpacity: 0.4, shadowRadius: 10, elevation: 5 },
  itemTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 },
  itemIconWrap: { width: 42, height: 42, borderRadius: 12, backgroundColor: colors.ink, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  iconEquipped: { borderColor: colors.bronzeDark },
  itemIcon: { fontSize: 24 },
  equipMark: { width: 25, height: 25, borderRadius: 13, textAlign: 'center', lineHeight: 23, color: colors.muted, borderWidth: 1, borderColor: colors.border, fontWeight: '900' },
  equipMarkOn: { color: colors.ink, backgroundColor: colors.bronze, borderColor: colors.bronze },
  itemName: { color: colors.text, fontSize: 13, fontWeight: '900', lineHeight: 17 },
  itemCategory: { color: colors.violetSoft, fontSize: 9, marginTop: 2 },
  itemDivider: { height: 1, backgroundColor: colors.border, marginVertical: 9 },
  bonus: { color: colors.hp, fontSize: 10, fontWeight: '800' },
  weight: { color: colors.warning, fontSize: 10, marginTop: 4 },
  state: { color: colors.muted, fontSize: 9, marginTop: 8 },
  stateOn: { color: colors.bronze, fontWeight: '800' },
});
