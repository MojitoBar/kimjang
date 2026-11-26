import { describe, expect, it } from 'vitest';
import { CUSTOMERS } from '../data/customers';
import { MAX_INGREDIENTS, INGREDIENTS } from '../data/ingredients';
import {
  addIngredient,
  advance,
  canAddIngredient,
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
