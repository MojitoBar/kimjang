import { describe, expect, it } from 'vitest';
import { CUSTOMERS } from '../data/customers';
import { ENDINGS } from '../data/endings';
import { INGREDIENTS } from '../data/ingredients';
import { dominantFlavor, flavorSum, judge, seasoningScore } from './judge';
import type { JudgeInput } from './types';

const P = { salt: 0.55, rub: 0.9, aging: 0.45 };
const mk = (ingredients: string[], over: Partial<JudgeInput> = {}): JudgeInput => ({
  customerId: 'banjang',
  ...P,
  ingredients,
  ...over,
});

const CLASSIC = ['gochugaru', 'garlic', 'ginger', 'saeujeot', 'radish', 'scallion'];

/** 결말 id -> 그 결말이 나오는 입력 예시 */
export const EXAMPLES: Record<string, JudgeInput> = {
  battery: mk(['gochugaru', 'battery']),
  salt_none: mk(CLASSIC, { salt: 0.02 }),
  salt_over: mk(CLASSIC, { salt: 0.97 }),
  fossil: mk(CLASSIC, { aging: 1 }),
  rub_zero: mk(CLASSIC, { rub: 0 }),
  aging_zero: mk(CLASSIC, { aging: 0 }),
  no_ingredients: mk([]),
  all_weird: mk(['mintchoco', 'soda', 'cheese', 'jelly', 'banana', 'pineapple']),
  toothpaste: mk(['gochugaru', 'garlic', 'toothpaste']),
  sock: mk(['gochugaru', 'garlic', 'sock']),
  money: mk(['gochugaru', 'garlic', 'money']),
  mint_oyster: mk(['gochugaru', 'mintchoco', 'oyster']),
  cheese_ramen: mk(['cheese', 'ramen']),
  pine_cheese: mk(['pineapple', 'cheese']),
  jelly_soda: mk(['jelly', 'soda']),
  mala: mk(['garlic', 'mala']),
  mayo: mk(['gochugaru', 'mayo']),
  banana: mk(['gochugaru', 'banana']),
  chocolate: mk(['gochugaru', 'chocolate']),
  yakgwa: mk(['sugar', 'pear', 'ricepaste']),
  jeotgal3: mk(['gochugaru', 'saeujeot', 'myeolchi', 'oyster']),
  gochugaru_only: mk(['gochugaru']),
  no_gochugaru: mk(['garlic', 'ginger', 'radish']),
  successor: mk(['gochugaru', 'garlic', 'ginger', 'myeolchi', 'radish', 'scallion']),
  neighborhood: mk(CLASSIC),
  rice_thief: mk(CLASSIC, { customerId: 'taekbae', aging: 0.5 }),
  aged: mk(CLASSIC, { customerId: 'sawi', aging: 0.72 }),
  fresh: mk(CLASSIC, { customerId: 'jokka', aging: 0.2 }),
  decent: mk(CLASSIC, { customerId: 'sawi', aging: 0.35 }),
  disaster: mk(['gochugaru', 'sugar'], { salt: 0.2, rub: 0.08, aging: 0.93 }),
  spicy_over: mk(CLASSIC, { customerId: 'cat', aging: 0.5 }),
  salty_over: mk(['gochugaru', 'saeujeot', 'ramen']),
  sweet_over: mk(['gochugaru', 'sugar', 'pear']),
  umami_over: mk(['gochugaru', 'oyster', 'garlic', 'myeolchi'], { customerId: 'jokka', aging: 0.5 }),
  cool_over: mk(['gochugaru', 'radish', 'pear', 'ginger', 'scallion']),
  chaos_over: mk(['gochugaru', 'mintchoco', 'ramen', 'pineapple']),
};

describe('결말 데이터', () => {
  it('30개 이상, 특수 20개 이상, 일반 10개 이상', () => {
    expect(ENDINGS.length).toBeGreaterThanOrEqual(30);
    expect(ENDINGS.filter((e) => e.kind === 'special').length).toBeGreaterThanOrEqual(20);
    expect(ENDINGS.filter((e) => e.kind === 'general').length).toBeGreaterThanOrEqual(10);
  });

  it('id·제목 중복 없음', () => {
    expect(new Set(ENDINGS.map((e) => e.id)).size).toBe(ENDINGS.length);
    expect(new Set(ENDINGS.map((e) => e.title)).size).toBe(ENDINGS.length);
  });

  it('필수 필드가 채워져 있고 표정 키가 유효하다', () => {
    const faces = ['happy', 'angry', 'faint', 'suspicious', 'proud', 'blank'];
    for (const e of ENDINGS) {
      expect(e.title.length).toBeGreaterThan(0);
      expect(e.body.length).toBeGreaterThan(0);
      expect(e.hint.length).toBeGreaterThan(0);
      expect(e.quote.length).toBeGreaterThan(0);
      expect(faces).toContain(e.face);
    }
  });

  it('예시 표가 모든 결말을 덮는다', () => {
    expect(Object.keys(EXAMPLES).sort()).toEqual(ENDINGS.map((e) => e.id).sort());
  });
});

describe('도달 가능성', () => {
  for (const e of ENDINGS) {
    it(`${e.id} (${e.title})`, () => {
      expect(judge(EXAMPLES[e.id]).ending.id).toBe(e.id);
    });
  }
});

describe('점수', () => {
  it('무작위 입력 500개가 0~100 정수이고 결말이 있다', () => {
    let seed = 12345;
    const rng = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    for (let n = 0; n < 500; n++) {
      const count = Math.floor(rng() * 8);
      const ids = Array.from({ length: count }, () => INGREDIENTS[Math.floor(rng() * INGREDIENTS.length)].id);
      const r = judge(
        {
          customerId: CUSTOMERS[Math.floor(rng() * CUSTOMERS.length)].id,
          salt: rng() * 1.4 - 0.2,
          ingredients: ids,
          rub: rng(),
          aging: rng(),
        },
        rng,
      );
      expect(Number.isInteger(r.score)).toBe(true);
      expect(r.score).toBeGreaterThanOrEqual(0);
      expect(r.score).toBeLessThanOrEqual(100);
      expect(r.ending.id).toBeTruthy();
    }
  });

  it('같은 입력은 같은 점수·결말, rng는 대사에만 영향', () => {
    const a = judge(EXAMPLES.neighborhood, () => 0);
    const b = judge(EXAMPLES.neighborhood, () => 0.99);
    expect(b.score).toBe(a.score);
    expect(b.ending.id).toBe(a.ending.id);
    expect(b.comment).toBe(a.comment);
    expect(JSON.stringify(judge(EXAMPLES.mala))).toBe(JSON.stringify(judge(EXAMPLES.mala)));
  });

  it('정석 레시피 + 알맞은 값은 90점 이상, 아무거나는 더 낮다', () => {
    const good = judge(EXAMPLES.neighborhood);
    expect(good.score).toBeGreaterThanOrEqual(90);
    const anything = judge(
      mk(['banana', 'pineapple', 'sugar', 'cheese', 'jelly', 'ramen'], { salt: 0.3, rub: 0.3, aging: 0.9 }),
    );
    expect(anything.score).toBeLessThan(good.score);
    expect(anything.score).toBeLessThan(40);
  });

  it('손님마다 정석 재료 조합으로 90점 이상 낼 수 있다', () => {
    const normal = INGREDIENTS.filter((i) => i.kind === 'normal').map((i) => i.id);
    const subsets: string[][] = [];
    const walk = (start: number, cur: string[]) => {
      subsets.push(cur);
      if (cur.length === 6) return;
      for (let i = start; i < normal.length; i++) walk(i + 1, [...cur, normal[i]]);
    };
    walk(0, []);
    for (const c of CUSTOMERS) {
      const best = Math.max(...subsets.map((s) => seasoningScore(flavorSum(s), c)));
      expect(best).toBeGreaterThanOrEqual(0.9);
      const r = judge({ customerId: c.id, salt: 0.55, ingredients: [], rub: 1, aging: c.agePref });
      expect(r.score).toBeLessThan(50);
    }
  });

  it('입력 보정: 알 수 없는 재료·중복·7개 이상은 무시', () => {
    const r = judge(mk([...CLASSIC, 'gochugaru', 'nothing', 'sugar']));
    expect(r.flavors).toEqual(flavorSum(CLASSIC));
    expect(() => judge({ ...mk([]), customerId: 'nobody' })).toThrow();
  });

  it('결과에 그래프·표정·반응이 들어 있다', () => {
    const r = judge(EXAMPLES.neighborhood);
    expect(r.graph).toHaveLength(6);
    expect(r.graph.every((g) => g.value >= 0 && g.value <= 1 && g.target >= 0 && g.target <= 1)).toBe(true);
    expect(r.reaction.length).toBeGreaterThan(0);
    expect(dominantFlavor(r.flavors)).toBeTruthy();
  });
});
