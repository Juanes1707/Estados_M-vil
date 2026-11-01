import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BuildPreset, StatKey } from '../../types/game';

export const HERO_MAX_HP = 100;
export const BOSS_MAX_HP = 160;

export interface StatsState {
  availablePoints: number;
  str: number;
  agi: number;
  int: number;
  currentHp: number;
  bossHp: number;
  lastHeroDamage: number;
  lastBossDamage: number;
}

export const initialStatsState: StatsState = {
  availablePoints: 15,
  str: 5,
  agi: 5,
  int: 5,
  currentHp: HERO_MAX_HP,
  bossHp: BOSS_MAX_HP,
  lastHeroDamage: 0,
  lastBossDamage: 0,
};

const statsSlice = createSlice({
  name: 'stats',
  initialState: initialStatsState,
  reducers: {
    incrementStat(state, action: PayloadAction<StatKey>) {
      if (state.availablePoints > 0) {
        state[action.payload] += 1;
        state.availablePoints -= 1;
      }
    },
    decrementStat(state, action: PayloadAction<StatKey>) {
      if (state[action.payload] > 1) {
        state[action.payload] -= 1;
        state.availablePoints += 1;
      }
    },
    takeDamage(state, action: PayloadAction<number>) {
      const damage = action.payload;
      if (Number.isFinite(damage) && damage > 0) {
        state.currentHp = Math.max(0, state.currentHp - damage);
        state.lastBossDamage = damage;
      }
    },
    healHero(state) {
      state.currentHp = HERO_MAX_HP;
      state.lastBossDamage = 0;
    },
    applyBuildPreset(state, action: PayloadAction<BuildPreset>) {
      const presets: Record<BuildPreset, Pick<StatsState, 'str' | 'agi' | 'int' | 'availablePoints'>> = {
        WARRIOR: { str: 20, agi: 5, int: 5, availablePoints: 0 },
        MAGE: { str: 5, agi: 5, int: 20, availablePoints: 0 },
        ROGUE: { str: 5, agi: 20, int: 5, availablePoints: 0 },
      };
      Object.assign(state, presets[action.payload]);
    },
    resetStats(state) {
      state.availablePoints = initialStatsState.availablePoints;
      state.str = initialStatsState.str;
      state.agi = initialStatsState.agi;
      state.int = initialStatsState.int;
    },
    attackBoss(state, action: PayloadAction<number>) {
      const damage = action.payload;
      if (Number.isFinite(damage) && damage > 0) {
        state.bossHp = Math.max(0, state.bossHp - damage);
        state.lastHeroDamage = damage;
      }
    },
    resetBoss(state) {
      state.bossHp = BOSS_MAX_HP;
      state.lastHeroDamage = 0;
      state.lastBossDamage = 0;
    },
  },
});

export const {
  incrementStat,
  decrementStat,
  takeDamage,
  healHero,
  applyBuildPreset,
  resetStats,
  attackBoss,
  resetBoss,
} = statsSlice.actions;

export default statsSlice.reducer;
