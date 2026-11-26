export const FLAVORS = ['spicy', 'salty', 'sweet', 'umami', 'cool', 'chaos'] as const;
export type Flavor = (typeof FLAVORS)[number];
export type FlavorVec = Record<Flavor, number>;

export const fv = (
  spicy: number,
  salty: number,
  sweet: number,
  umami: number,
  cool: number,
  chaos: number,
): FlavorVec => ({ spicy, salty, sweet, umami, cool, chaos });

export type Face = 'happy' | 'angry' | 'faint' | 'suspicious' | 'proud' | 'blank';
export type Rarity = 'common' | 'rare' | 'legendary';
export type Grade = 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
export type IngredientKind = 'normal' | 'weird';
export type SaltStage = 'alive' | 'light' | 'good' | 'salty' | 'brine';
export type AgingStage = 'fresh' | 'right' | 'old' | 'fossil';

export interface Ingredient {
  id: string;
  name: string;
  kind: IngredientKind;
  flavor: FlavorVec;
  desc: string;
}

export interface Customer {
  id: string;
  name: string;
  desc: string;
  order: string;
  target: FlavorVec;
  weight: FlavorVec;
  agePref: number;
  reactions: { good: string[]; mid: string[]; bad: string[] };
}

export interface Ending {
  id: string;
  kind: 'special' | 'general';
  title: string;
  body: string;
  face: Face;
  rarity: Rarity;
  hint: string;
  quote: string;
  cap?: number;
}

export interface JudgeInput {
  customerId: string;
  salt: number;
  ingredients: string[];
  rub: number;
  aging: number;
}

export interface GraphPoint {
  flavor: Flavor;
  label: string;
  value: number;
  target: number;
}

export interface JudgeResult {
  score: number;
  grade: Grade;
  ending: Ending;
  comment: string;
  aside: string;
  reaction: string;
  flavors: FlavorVec;
  graph: GraphPoint[];
  parts: { salt: number; seasoning: number; rub: number; aging: number };
  saltStage: SaltStage;
  agingStage: AgingStage;
}
