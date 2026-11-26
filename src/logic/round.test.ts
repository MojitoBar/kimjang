import { describe, expect, it } from 'vitest';
import { CUSTOMERS } from '../data/customers';
import { MAX_INGREDIENTS, INGREDIENTS } from '../data/ingredients';
import {
  addIngredient,
  advance,
  canAddIngredient,
  drawCustomer,
  shuffle,
  type CustomerBag,
  newRound,
  removeIngredient,
  setAging,
  setRub,
  setSalt,
  toggleIngredient,
} from './round';

const toMix = () => {
  let s = newRound(() => 0);
  s = advance(s, () => 0);
  return advance(s, () => 0);
};

describe('round', () => {
  it('손님은 rng로 뽑히고 7명 이상 중에서 나온다', () => {
    expect(CUSTOMERS.length).toBeGreaterThanOrEqual(6);
    expect(newRound(() => 0).customerId).toBe(CUSTOMERS[0].id);
    expect(newRound(() => 0.999).customerId).toBe(CUSTOMERS[CUSTOMERS.length - 1].id);
  });

  it('재료는 최대 6개까지만 담긴다', () => {
    let s = toMix();
    for (const ing of INGREDIENTS.slice(0, 10)) s = addIngredient(s, ing.id);
    expect(s.ingredients).toHaveLength(MAX_INGREDIENTS);
    expect(canAddIngredient(s, INGREDIENTS[10].id)).toBe(false);
    const same = addIngredient(s, INGREDIENTS[10].id);
    expect(same).toBe(s);
  });

  it('중복·모르는 재료는 못 넣고, 빼면 다시 넣을 수 있다', () => {
    let s = toMix();
    s = addIngredient(s, 'garlic');
    expect(addIngredient(s, 'garlic')).toBe(s);
    expect(addIngredient(s, 'nope')).toBe(s);
    s = removeIngredient(s, 'garlic');
    expect(s.ingredients).toEqual([]);
    s = toggleIngredient(s, 'sugar');
    expect(s.ingredients).toEqual(['sugar']);
    s = toggleIngredient(s, 'sugar');
    expect(s.ingredients).toEqual([]);
  });

  it('양념 단계가 아니면 재료를 못 넣는다', () => {
    const s = newRound(() => 0);
    expect(addIngredient(s, 'garlic')).toBe(s);
  });

  it('값 설정은 해당 단계에서만, 0~1로 보정된다', () => {
    let s = newRound(() => 0);
    expect(setSalt(s, 0.9)).toBe(s);
    s = advance(s, () => 0);
    expect(setSalt(s, 5).salt).toBe(1);
    expect(setSalt(s, -1).salt).toBe(0);
    s = { ...s, phase: 'rub' };
    expect(setRub(s, 0.4).rub).toBe(0.4);
    s = { ...s, phase: 'age' };
    expect(setAging(s, 0.8).aging).toBe(0.8);
  });

  it('단계가 순서대로 진행되고 마지막에 판정이 붙는다', () => {
    let s = newRound(() => 0, 'banjang');
    const seen = [s.phase];
    s = advance(s, () => 0);
    s = setSalt(s, 0.55);
    seen.push(s.phase);
    s = advance(s, () => 0);
    for (const id of ['gochugaru', 'garlic', 'ginger', 'saeujeot', 'radish', 'scallion']) s = addIngredient(s, id);
    seen.push(s.phase);
    s = advance(s, () => 0);
    s = setRub(s, 0.9);
    seen.push(s.phase);
    s = advance(s, () => 0);
    s = setAging(s, 0.45);
    seen.push(s.phase);
    expect(s.result).toBeNull();
    s = advance(s, () => 0);
    seen.push(s.phase);
    expect(seen).toEqual(['order', 'salt', 'mix', 'rub', 'age', 'result']);
    expect(s.result?.score).toBeGreaterThanOrEqual(90);
    expect(advance(s, () => 0)).toBe(s);
  });
});

describe('선반 섞기·손님 주머니', () => {
  const seeded = (seed: number) => () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  it('섞어도 재료 전부가 빠짐·중복 없이 그대로고 원본은 안 바뀐다', () => {
    const ids = INGREDIENTS.map((i) => i.id);
    const copy = [...ids];
    const out = shuffle(ids, seeded(7));
    expect(out).toHaveLength(ids.length);
    expect(new Set(out).size).toBe(ids.length);
    expect([...out].sort()).toEqual([...ids].sort());
    expect(ids).toEqual(copy);
  });

  it('새 판마다 선반 순서가 정해지고 재료 수는 같다', () => {
    const a = newRound(seeded(1)).shelf;
    const b = newRound(seeded(2)).shelf;
    expect(a).toHaveLength(INGREDIENTS.length);
    expect(a).not.toEqual(b);
  });

  it('연속 100판에서 같은 손님이 연달아 나오지 않는다', () => {
    const rng = seeded(42);
    let st: CustomerBag = { bag: [], last: null };
    let prev: string | null = null;
    for (let i = 0; i < 100; i++) {
      const d = drawCustomer(st, rng);
      expect(d.id).not.toBe(prev);
      prev = d.id;
      st = d.state;
    }
  });

  it('한 바퀴(손님 수만큼) 안에 모든 손님이 한 번씩 나온다', () => {
    for (let seed = 1; seed <= 20; seed++) {
      const rng = seeded(seed);
      let st: CustomerBag = { bag: [], last: null };
      const seen: string[] = [];
      for (let i = 0; i < CUSTOMERS.length; i++) {
        const d = drawCustomer(st, rng);
        seen.push(d.id);
        st = d.state;
      }
      expect(new Set(seen).size).toBe(CUSTOMERS.length);
    }
  });
});
