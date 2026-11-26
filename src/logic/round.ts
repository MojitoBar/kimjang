import { CUSTOMERS } from '../data/customers';
import { getIngredient, INGREDIENTS, MAX_INGREDIENTS } from '../data/ingredients';
import { judge } from './judge';
import type { Customer, JudgeResult } from './types';

export const PHASES = ['order', 'salt', 'mix', 'rub', 'age', 'result'] as const;
export type Phase = (typeof PHASES)[number];

export interface RoundState {
  phase: Phase;
  customerId: string;
  /** 이번 판 양념 선반에 놓는 재료 id 순서 */
  shelf: string[];
  salt: number;
  ingredients: string[];
  rub: number;
  aging: number;
  result: JudgeResult | null;
}

export function pickCustomer(rng: () => number): Customer {
  return CUSTOMERS[Math.min(CUSTOMERS.length - 1, Math.floor(rng() * CUSTOMERS.length))];
}

/** Fisher-Yates. 원본은 건드리지 않는다. */
export function shuffle<T>(items: readonly T[], rng: () => number): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.min(i, Math.floor(rng() * (i + 1)));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export interface CustomerBag {
  /** 아직 안 나온 손님 id (앞에서부터 꺼낸다) */
  bag: string[];
  /** 방금 나온 손님 id */
  last: string | null;
}

/** 섞은 주머니에서 한 명씩 꺼낸다. 주머니가 비면 다시 섞되 첫 손님이 직전 손님이면 뒤로 보낸다. */
export function drawCustomer(state: CustomerBag, rng: () => number): { id: string; state: CustomerBag } {
  let bag = state.bag;
  if (bag.length === 0) {
    bag = shuffle(CUSTOMERS.map((c) => c.id), rng);
    if (bag.length > 1 && bag[0] === state.last) bag = [...bag.slice(1), bag[0]];
  }
  const [id, ...rest] = bag;
  return { id, state: { bag: rest, last: id } };
}

export function newRound(rng: () => number, customerId?: string): RoundState {
  return {
    phase: 'order',
    customerId: customerId ?? pickCustomer(rng).id,
    shelf: shuffle(INGREDIENTS.map((i) => i.id), rng),
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
