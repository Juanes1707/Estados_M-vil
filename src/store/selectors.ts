import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';
import { HealthStatus, HeroVisualClass, TotalStats } from '../types/game';
import { BOSS_MAX_HP, HERO_MAX_HP } from './slices/statsSlice';

export const selectStatsState = (state: RootState) => state.stats;
export const selectInventoryState = (state: RootState) => state.inventory;
export const selectActionLogEntries = (state: RootState) => state.actionLog.entries;

export const selectEquippedItems = createSelector(
  [selectInventoryState],
  ({ catalog, equippedIds }) => catalog.filter((item) => equippedIds.includes(item.id)),
);

export const selectEquipmentBonuses = createSelector([selectEquippedItems], (items) =>
  items.reduce<TotalStats>(
    (totals, item) => ({
      str: totals.str + item.bonusStr,
      agi: totals.agi + item.bonusAgi,
      int: totals.int + item.bonusInt,
    }),
    { str: 0, agi: 0, int: 0 },
  ),
);

export const selectTotalStats = createSelector(
  [selectStatsState, selectEquipmentBonuses],
  (stats, bonuses): TotalStats => ({
    str: stats.str + bonuses.str,
    agi: stats.agi + bonuses.agi,
    int: stats.int + bonuses.int,
  }),
);

export const selectTotalWeight = createSelector([selectEquippedItems], (items) =>
  items.reduce((total, item) => total + item.weight, 0),
);

export const selectMaxWeightCapacity = createSelector(
  [selectTotalStats],
  ({ str }) => 10 + str * 2,
);

export const selectIsOverencumbered = createSelector(
  [selectTotalWeight, selectMaxWeightCapacity],
  (weight, capacity) => weight > capacity,
);

export const selectRawCombatPower = createSelector(
  [selectTotalStats],
  ({ str, agi, int }) => str * 3 + agi * 2 + int * 3,
);

export const selectCombatPower = createSelector(
  [selectRawCombatPower, selectIsOverencumbered],
  (rawPower, overloaded) => overloaded ? Math.round(rawPower * 0.7) : rawPower,
);

export const selectEffectiveSpeed = createSelector(
  [selectTotalStats, selectIsOverencumbered],
  ({ agi }, overloaded) => Math.round(agi * 10 * (overloaded ? 0.5 : 1)),
);

export const selectHeroVisualClass = createSelector(
  [selectTotalStats, selectIsOverencumbered],
  ({ str, agi, int }, overloaded): HeroVisualClass => {
    if (overloaded) return { name: 'Tanque Pesado', icon: '⛓️', auraColor: '#FF5D68', epithet: 'La carga doblega el suelo' };
    if (str >= 15 && str >= int && str >= agi) return { name: 'Guerrero Berserker', icon: '⚔️', auraColor: '#FF8159', epithet: 'Fuerza templada en guerra' };
    if (int >= 15 && int >= agi) return { name: 'Archimago', icon: '🪄', auraColor: '#9B7BFF', epithet: 'La runa obedece a su mente' };
    if (agi >= 15) return { name: 'Pícaro Sombrío', icon: '🗡️', auraColor: '#40D6C6', epithet: 'Nadie oye el siguiente paso' };
    return { name: 'Aldeano', icon: '🧑‍🌾', auraColor: '#D7A64A', epithet: 'Una leyenda aún sin forjar' };
  },
);

export const selectHealthPercentage = createSelector(
  [selectStatsState],
  ({ currentHp }) => Math.round((currentHp / HERO_MAX_HP) * 100),
);

export const selectHealthStatus = createSelector(
  [selectStatsState],
  ({ currentHp }): HealthStatus => currentHp <= 0 ? 'Derrotado' : currentHp <= 60 ? 'Herido' : 'Saludable',
);

export const selectManaPotential = createSelector(
  [selectTotalStats],
  ({ int }) => Math.min(100, int * 5),
);

export const selectLoadPercentage = createSelector(
  [selectTotalWeight, selectMaxWeightCapacity],
  (weight, capacity) => capacity === 0 ? 0 : Math.round((weight / capacity) * 100),
);

export const selectEquippedWeaponIcon = createSelector([selectEquippedItems], (items) =>
  items.find((item) => item.category === 'Arma' || item.category === 'Foco')?.icon ?? '🪓',
);

export const selectBossPercentage = createSelector(
  [selectStatsState],
  ({ bossHp }) => Math.round((bossHp / BOSS_MAX_HP) * 100),
);

export const selectHeroSummary = createSelector(
  [
    selectTotalStats,
    selectCombatPower,
    selectEffectiveSpeed,
    selectTotalWeight,
    selectMaxWeightCapacity,
    selectIsOverencumbered,
    selectHeroVisualClass,
    selectHealthPercentage,
    selectHealthStatus,
    selectManaPotential,
    selectLoadPercentage,
    selectEquippedWeaponIcon,
  ],
  (totalStats, combatPower, speed, weight, capacity, overloaded, heroClass, hpPercent, health, mana, loadPercent, weaponIcon) => ({
    totalStats,
    combatPower,
    speed,
    weight,
    capacity,
    overloaded,
    heroClass,
    hpPercent,
    health,
    mana,
    loadPercent,
    weaponIcon,
  }),
);
