import { InventoryItem } from '../types/game';

export const ITEM_CATALOG: InventoryItem[] = [
  { id: 'fire-sword', name: 'Espada de Fuego', icon: '🔥', category: 'Arma', bonusStr: 4, bonusAgi: 0, bonusInt: 0, weight: 7 },
  { id: 'titan-shield', name: 'Escudo de Titanio', icon: '🛡️', category: 'Escudo', bonusStr: 3, bonusAgi: 0, bonusInt: 0, weight: 12 },
  { id: 'arcane-staff', name: 'Báculo Arcano', icon: '🪄', category: 'Foco', bonusStr: 0, bonusAgi: 0, bonusInt: 10, weight: 5 },
  { id: 'elven-boots', name: 'Botas Élficas', icon: '🥾', category: 'Botas', bonusStr: 0, bonusAgi: 10, bonusInt: 0, weight: 3 },
  { id: 'cursed-armor', name: 'Armadura Maldita', icon: '⛓️', category: 'Armadura', bonusStr: 3, bonusAgi: 0, bonusInt: 0, weight: 30 },
  { id: 'wisdom-amulet', name: 'Amuleto de Sabiduría', icon: '👁️', category: 'Amuleto', bonusStr: 0, bonusAgi: 0, bonusInt: 3, weight: 1 },
];

export const ITEM_BY_ID = Object.fromEntries(
  ITEM_CATALOG.map((item) => [item.id, item]),
) as Record<string, InventoryItem>;
