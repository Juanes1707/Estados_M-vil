import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { ITEM_BY_ID } from '../../data/items';
import { ActionLogEntry } from '../../types/game';
import {
  applyBuildPreset,
  attackBoss,
  decrementStat,
  healHero,
  incrementStat,
  resetBoss,
  resetStats,
  takeDamage,
} from './statsSlice';
import { clearEquipment, toggleEquipItem } from './inventorySlice';

export interface ActionLogState {
  entries: ActionLogEntry[];
  sequence: number;
}

export const initialActionLogState: ActionLogState = { entries: [], sequence: 0 };

const loggedActions = isAnyOf(
  incrementStat,
  decrementStat,
  takeDamage,
  healHero,
  applyBuildPreset,
  resetStats,
  attackBoss,
  resetBoss,
  toggleEquipItem,
  clearEquipment,
);

const actionLogSlice = createSlice({
  name: 'actionLog',
  initialState: initialActionLogState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(loggedActions, (state, action) => {
      state.sequence += 1;
      const rawPayload = 'payload' in action ? action.payload : undefined;
      const item = action.type === toggleEquipItem.type && typeof rawPayload === 'string'
        ? ITEM_BY_ID[rawPayload]
        : undefined;
      const payload = item ? { id: item.id, name: item.name } : rawPayload;
      const label = item ? `${item.name} (${item.id})` : payload === undefined ? 'Sin payload' : JSON.stringify(payload);

      state.entries.unshift({
        id: `${state.sequence}:${action.type}`,
        type: action.type,
        payload,
        label,
      });
      state.entries = state.entries.slice(0, 5);
    });
  },
});

export default actionLogSlice.reducer;
