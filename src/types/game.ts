export type StatKey = 'str' | 'agi' | 'int';
export type BuildPreset = 'WARRIOR' | 'MAGE' | 'ROGUE';
export type ItemCategory = 'Arma' | 'Escudo' | 'Foco' | 'Botas' | 'Armadura' | 'Amuleto';
export type HealthStatus = 'Saludable' | 'Herido' | 'Derrotado';

export interface InventoryItem {
  id: string;
  name: string;
  icon: string;
  category: ItemCategory;
  bonusStr: number;
  bonusAgi: number;
  bonusInt: number;
  weight: number;
}

export interface TotalStats {
  str: number;
  agi: number;
  int: number;
}

export interface HeroVisualClass {
  name: 'Aldeano' | 'Guerrero Berserker' | 'Archimago' | 'Pícaro Sombrío' | 'Tanque Pesado';
  icon: string;
  auraColor: string;
  epithet: string;
}

export interface ActionLogEntry {
  id: string;
  type: string;
  payload: unknown;
  label: string;
}
