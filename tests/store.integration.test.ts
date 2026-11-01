import { describe, expect, it } from 'vitest';
import { createAppStore } from '../src/store';
import {
  selectCombatPower,
  selectEffectiveSpeed,
  selectHeroVisualClass,
  selectIsOverencumbered,
  selectMaxWeightCapacity,
  selectTotalStats,
  selectTotalWeight,
} from '../src/store/selectors';
import { performCombatTurn } from '../src/features/combat/combatActions';
import { incrementStat } from '../src/store/slices/statsSlice';
import { toggleEquipItem } from '../src/store/slices/inventorySlice';

describe('integración del Store', () => {
  it('Armadura Maldita provoca el efecto dominó completo con un dispatch', () => {
    const store = createAppStore();
    store.dispatch(toggleEquipItem('cursed-armor'));
    const state = store.getState();

    expect(state.inventory.equippedIds).toContain('cursed-armor');
    expect(selectTotalStats(state).str).toBe(8);
    expect(selectMaxWeightCapacity(state)).toBe(26);
    expect(selectTotalWeight(state)).toBe(30);
    expect(selectIsOverencumbered(state)).toBe(true);
    expect(selectCombatPower(state)).toBe(34);
    expect(selectEffectiveSpeed(state)).toBe(25);
    expect(selectHeroVisualClass(state).name).toBe('Tanque Pesado');
    expect(state.actionLog.entries[0]).toMatchObject({
      type: 'inventory/toggleEquipItem',
      payload: { id: 'cursed-armor', name: 'Armadura Maldita' },
    });
  });

  it('actionLog conserva solo los cinco eventos más recientes', () => {
    const store = createAppStore();
    for (let index = 0; index < 6; index += 1) store.dispatch(incrementStat('str'));
    expect(store.getState().actionLog.entries).toHaveLength(5);
    expect(store.getState().actionLog.entries[0].type).toBe('stats/incrementStat');
  });

  it('el combate usa el poder vigente calculado por selectores', async () => {
    const store = createAppStore();
    store.dispatch(toggleEquipItem('cursed-armor'));
    expect(selectCombatPower(store.getState())).toBe(34);
    await store.dispatch(performCombatTurn());
    expect(store.getState().stats.bossHp).toBe(151);
    expect(store.getState().stats.currentHp).toBe(88);
    expect(store.getState().actionLog.entries[0].type).toBe('stats/takeDamage');
    expect(store.getState().actionLog.entries[1]).toMatchObject({ type: 'stats/attackBoss', payload: 9 });
  });
});
