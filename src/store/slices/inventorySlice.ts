import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ITEM_CATALOG } from '../../data/items';
import { InventoryItem } from '../../types/game';

export interface InventoryState {
  catalog: InventoryItem[];
  equippedIds: string[];
}

export const initialInventoryState: InventoryState = {
  catalog: ITEM_CATALOG,
  equippedIds: [],
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: initialInventoryState,
  reducers: {
    toggleEquipItem(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (!state.catalog.some((item) => item.id === id)) return;

      const index = state.equippedIds.indexOf(id);
      if (index >= 0) {
        state.equippedIds.splice(index, 1);
      } else {
        state.equippedIds.push(id);
      }
    },
    clearEquipment(state) {
      state.equippedIds = [];
    },
  },
});

export const { toggleEquipItem, clearEquipment } = inventorySlice.actions;
export default inventorySlice.reducer;
