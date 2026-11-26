import { CUSTOMERS } from '../data/customers';
import { getIngredient, MAX_INGREDIENTS } from '../data/ingredients';
import { judge } from './judge';
import type { Customer, JudgeResult } from './types';

export const PHASES = ['order', 'salt', 'mix', 'rub', 'age', 'result'] as const;
export type Phase = (typeof PHASES)[number];

export interface RoundState {
  phase: Phase;
  customerId: string;
  salt: number;
  ingredients: string[];
  rub: number;
  aging: number;
  result: JudgeResult | null;
}

export function pickCustomer(rng: () => number): Customer {
  return CUSTOMERS[Math.min(CUSTOMERS.length - 1, Math.floor(rng() * CUSTOMERS.length))];
}

export function newRound(rng: () => number, customerId?: string): RoundState {
  return {
    phase: 'order',
    customerId: customerId ?? pickCustomer(rng).id,
    salt: 0.5,
    ingredients: [],
    rub: 0,
    aging: 0.5,
    result: null,
  };
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export function setSalt(s: RoundState, v: number): RoundState {
  return s.phase === 'salt' ? { ...s, salt: clamp01(v) } : s;
}
export function setRub(s: RoundState, v: number): RoundState {
  return s.phase === 'rub' ? { ...s, rub: clamp01(v) } : s;
}
export function setAging(s: RoundState, v: number): RoundState {
  return s.phase === 'age' ? { ...s, aging: clamp01(v) } : s;
}

export function canAddIngredient(s: RoundState, id: string): boolean {
  return (
    s.phase === 'mix' &&
    !!getIngredient(id) &&
    !s.ingredients.includes(id) &&
    s.ingredients.length < MAX_INGREDIENTS
  );
}

/** 가득 찼거나 이미 있으면 같은 객체를 돌려준다. */
export function addIngredient(s: RoundState, id: string): RoundState {
  return canAddIngredient(s, id) ? { ...s, ingredients: [...s.ingredients, id] } : s;
}

export function removeIngredient(s: RoundState, id: string): RoundState {
  if (s.phase !== 'mix' || !s.ingredients.includes(id)) return s;
  return { ...s, ingredients: s.ingredients.filter((i) => i !== id) };
}

export function toggleIngredient(s: RoundState, id: string): RoundState {
  return s.ingredients.includes(id) ? removeIngredient(s, id) : addIngredient(s, id);
}

/** 다음 단계로. 'age' → 'result' 로 넘어갈 때 판정이 계산된다. */
export function advance(s: RoundState, rng: () => number): RoundState {
  const i = PHASES.indexOf(s.phase);
  if (i === PHASES.length - 1) return s;
  const next = PHASES[i + 1];
  if (next !== 'result') return { ...s, phase: next };
  const result = judge(
    { customerId: s.customerId, salt: s.salt, ingredients: s.ingredients, rub: s.rub, aging: s.aging },
    rng,
  );
  return { ...s, phase: 'result', result };
}
