import { describe, expect, it } from 'vitest';
import inventoryReducer, {
  clearEquipment,
  initialInventoryState,
  toggleEquipItem,
} from '../src/store/slices/inventorySlice';

describe('inventorySlice', () => {
  it('equipa y desequipa un objeto sin duplicados', () => {
    const equipped = inventoryReducer(initialInventoryState, toggleEquipItem('fire-sword'));
    expect(equipped.equippedIds).toEqual(['fire-sword']);
    const unequipped = inventoryReducer(equipped, toggleEquipItem('fire-sword'));
    expect(unequipped.equippedIds).toEqual([]);
  });

  it('ignora un ID inexistente sin romper el inventario', () => {
    expect(inventoryReducer(initialInventoryState, toggleEquipItem('missing'))).toEqual(initialInventoryState);
  });

  it('clearEquipment vacía equippedIds y conserva el catálogo', () => {
    const equipped = inventoryReducer(initialInventoryState, toggleEquipItem('arcane-staff'));
    const cleared = inventoryReducer(equipped, clearEquipment());
    expect(cleared.equippedIds).toEqual([]);
    expect(cleared.catalog).toHaveLength(6);
  });
});
