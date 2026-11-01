import { describe, expect, it } from 'vitest';
import statsReducer, {
  applyBuildPreset,
  decrementStat,
  healHero,
  incrementStat,
  initialStatsState,
  resetStats,
  takeDamage,
} from '../src/store/slices/statsSlice';

describe('statsSlice', () => {
  it('incrementStat consume exactamente un punto', () => {
    const next = statsReducer(initialStatsState, incrementStat('str'));
    expect(next.str).toBe(6);
    expect(next.availablePoints).toBe(14);
  });

  it('incrementStat no actúa sin puntos disponibles', () => {
    const state = { ...initialStatsState, availablePoints: 0 };
    expect(statsReducer(state, incrementStat('agi'))).toEqual(state);
  });

  it('decrementStat respeta el mínimo de 1', () => {
    let state = initialStatsState;
    for (let index = 0; index < 8; index += 1) state = statsReducer(state, decrementStat('int'));
    expect(state.int).toBe(1);
  });

  it('mantiene el presupuesto total de 30 incluso por debajo de 5', () => {
    let state = initialStatsState;
    for (let index = 0; index < 4; index += 1) state = statsReducer(state, decrementStat('str'));
    expect(state.str + state.agi + state.int + state.availablePoints).toBe(30);
  });

  it.each([
    ['WARRIOR', { str: 20, agi: 5, int: 5 }],
    ['MAGE', { str: 5, agi: 5, int: 20 }],
    ['ROGUE', { str: 5, agi: 20, int: 5 }],
  ] as const)('el preset %s reasigna exactamente 15 puntos', (preset, expected) => {
    const state = statsReducer(initialStatsState, applyBuildPreset(preset));
    expect({ str: state.str, agi: state.agi, int: state.int }).toEqual(expected);
    expect(state.availablePoints).toBe(0);
    expect(state.str + state.agi + state.int).toBe(30);
  });

  it('los presets consecutivos reemplazan y no acumulan', () => {
    const warrior = statsReducer(initialStatsState, applyBuildPreset('WARRIOR'));
    const mage = statsReducer(warrior, applyBuildPreset('MAGE'));
    expect([mage.str, mage.agi, mage.int, mage.availablePoints]).toEqual([5, 5, 20, 0]);
  });

  it('resetStats restaura solo los atributos iniciales', () => {
    let state = statsReducer(initialStatsState, applyBuildPreset('ROGUE'));
    state = statsReducer(state, takeDamage(25));
    state = statsReducer(state, resetStats());
    expect([state.str, state.agi, state.int, state.availablePoints]).toEqual([5, 5, 5, 15]);
    expect(state.currentHp).toBe(75);
  });

  it('takeDamage rechaza negativos y nunca produce HP negativo', () => {
    const unchanged = statsReducer(initialStatsState, takeDamage(-10));
    const defeated = statsReducer(unchanged, takeDamage(999));
    expect(unchanged.currentHp).toBe(100);
    expect(defeated.currentHp).toBe(0);
  });

  it('healHero restaura HP a 100', () => {
    const hurt = statsReducer(initialStatsState, takeDamage(45));
    expect(statsReducer(hurt, healHero()).currentHp).toBe(100);
  });
});
