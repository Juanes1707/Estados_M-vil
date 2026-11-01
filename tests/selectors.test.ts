import { describe, expect, it } from 'vitest';
import { createAppStore, RootState } from '../src/store';
import {
  selectCombatPower,
  selectEffectiveSpeed,
  selectHeroVisualClass,
  selectIsOverencumbered,
  selectMaxWeightCapacity,
  selectTotalStats,
  selectTotalWeight,
} from '../src/store/selectors';
import { applyBuildPreset } from '../src/store/slices/statsSlice';
import { toggleEquipItem } from '../src/store/slices/inventorySlice';

function customLoadState(weight: number): RootState {
  const base = createAppStore().getState();
  return {
    ...base,
    inventory: {
      catalog: [{ id: 'test', name: 'Carga', icon: '📦', category: 'Armadura', bonusStr: 0, bonusAgi: 0, bonusInt: 0, weight }],
      equippedIds: ['test'],
    },
  };
}

describe('selectores derivados', () => {
  it('suma bonos de todos los objetos equipados', () => {
    const store = createAppStore();
    store.dispatch(toggleEquipItem('fire-sword'));
    store.dispatch(toggleEquipItem('arcane-staff'));
    expect(selectTotalStats(store.getState())).toEqual({ str: 9, agi: 5, int: 15 });
  });

  it('suma solamente el peso equipado', () => {
    const store = createAppStore();
    store.dispatch(toggleEquipItem('fire-sword'));
    store.dispatch(toggleEquipItem('wisdom-amulet'));
    expect(selectTotalWeight(store.getState())).toBe(8);
  });

  it('aplica capacidad = 10 + STR total * 2', () => {
    const store = createAppStore();
    store.dispatch(toggleEquipItem('fire-sword'));
    expect(selectMaxWeightCapacity(store.getState())).toBe(28);
  });

  it('una carga igual al límite no genera sobrecarga', () => {
    expect(selectIsOverencumbered(customLoadState(20))).toBe(false);
  });

  it('una carga superior al límite genera sobrecarga', () => {
    expect(selectIsOverencumbered(customLoadState(21))).toBe(true);
  });

  it('aplica penalización del 30% al poder y 50% a velocidad', () => {
    const state = customLoadState(21);
    expect(selectCombatPower(state)).toBe(28);
    expect(selectEffectiveSpeed(state)).toBe(25);
  });

  it('cambia clase con presets y prioriza Tanque Pesado', () => {
    const store = createAppStore();
    store.dispatch(applyBuildPreset('MAGE'));
    expect(selectHeroVisualClass(store.getState()).name).toBe('Archimago');
    store.dispatch(applyBuildPreset('WARRIOR'));
    expect(selectHeroVisualClass(store.getState()).name).toBe('Guerrero Berserker');
    store.dispatch(applyBuildPreset('ROGUE'));
    expect(selectHeroVisualClass(store.getState()).name).toBe('Pícaro Sombrío');
    store.dispatch(toggleEquipItem('cursed-armor'));
    expect(selectHeroVisualClass(store.getState()).name).toBe('Tanque Pesado');
  });
});
