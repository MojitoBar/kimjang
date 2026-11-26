import { ENDINGS, getEnding } from '../data/endings';
import { getCustomer } from '../data/customers';
import { getIngredient, MAX_INGREDIENTS } from '../data/ingredients';
import { FLAVOR_LABEL, GRADE_ASIDES } from '../data/copy';
import {
  FLAVORS,
  type AgingStage,
  type Customer,
  type Ending,
  type FlavorVec,
  type Flavor,
  type Grade,
  type JudgeInput,
  type JudgeResult,
  type SaltStage,
} from './types';

export const SALT_IDEAL = 0.55;
export const SALT_TOLERANCE = 0.1;
export const SALT_SLOPE = 0.45;
export const RUB_FULL = 0.7;
export const AGING_TOLERANCE = 0.12;
export const AGING_SLOPE = 0.5;
export const SEASONING_RANGE = 10;
export const WEIGHTS = { salt: 0.1, rub: 0.1, aging: 0.2, seasoning: 0.6 };

const clamp01 = (n: number) => (Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0);
const emptyVec = (): FlavorVec => ({ spicy: 0, salty: 0, sweet: 0, umami: 0, cool: 0, chaos: 0 });

export function saltScore(salt: number): number {
  const d = Math.max(0, Math.abs(salt - SALT_IDEAL) - SALT_TOLERANCE);
  return Math.max(0, 1 - d / SALT_SLOPE);
}

export function rubScore(rub: number): number {
  return Math.min(1, rub / RUB_FULL);
}

export function agingScore(aging: number, pref: number): number {
  const d = Math.max(0, Math.abs(aging - pref) - AGING_TOLERANCE);
  return Math.max(0, 1 - d / AGING_SLOPE);
}

export function saltStage(salt: number): SaltStage {
  if (salt < 0.3) return 'alive';
  if (salt < 0.45) return 'light';
  if (salt <= 0.65) return 'good';
  if (salt <= 0.85) return 'salty';
  return 'brine';
}

export function agingStage(aging: number): AgingStage {
  if (aging < 0.25) return 'fresh';
  if (aging < 0.6) return 'right';
  if (aging < 0.85) return 'old';
  return 'fossil';
}

export function gradeOf(score: number): Grade {
  if (score >= 90) return 'S';
  if (score >= 75) return 'A';
  if (score >= 60) return 'B';
  if (score >= 40) return 'C';
  if (score >= 20) return 'D';
  return 'F';
}

/** 알려진 재료만, 중복 제거, 최대 6개. */
export function normalizeIngredients(ids: string[]): string[] {
  const out: string[] = [];
  for (const id of ids) {
    if (getIngredient(id) && !out.includes(id)) out.push(id);
  }
  return out.slice(0, MAX_INGREDIENTS);
}

export function flavorSum(ids: string[]): FlavorVec {
  const sum = emptyVec();
  for (const id of ids) {
    const ing = getIngredient(id);
    if (!ing) continue;
    for (const f of FLAVORS) sum[f] += ing.flavor[f];
  }
  return sum;
}

export function seasoningScore(sum: FlavorVec, customer: Customer): number {
  let sq = 0;
  for (const f of FLAVORS) sq += customer.weight[f] * (sum[f] - customer.target[f]) ** 2;
  return Math.max(0, 1 - Math.sqrt(sq) / SEASONING_RANGE);
}

export function dominantFlavor(sum: FlavorVec): Flavor | null {
  let best: Flavor | null = null;
  let max = 0;
  for (const f of FLAVORS) {
    if (sum[f] > max) {
      max = sum[f];
      best = f;
    }
  }
  return best;
}

interface Ctx {
  input: JudgeInput;
  ids: string[];
  has: (id: string) => boolean;
  count: number;
  weirdCount: number;
  dominant: Flavor | null;
  score: number;
}

/** 우선순위 순서. 위에서부터 처음 맞는 결말이 선택된다. */
export const RULES: { id: string; test: (c: Ctx) => boolean }[] = [
  { id: 'battery', test: (c) => c.has('battery') },
  { id: 'salt_none', test: (c) => c.input.salt <= 0.08 },
  { id: 'salt_over', test: (c) => c.input.salt >= 0.92 },
  { id: 'fossil', test: (c) => c.input.aging >= 0.95 },
  { id: 'rub_zero', test: (c) => c.input.rub <= 0.05 },
  { id: 'aging_zero', test: (c) => c.input.aging <= 0.05 },
  { id: 'no_ingredients', test: (c) => c.count === 0 },
  { id: 'all_weird', test: (c) => c.count === MAX_INGREDIENTS && c.weirdCount === MAX_INGREDIENTS },
  { id: 'toothpaste', test: (c) => c.has('toothpaste') },
  { id: 'sock', test: (c) => c.has('sock') },
  { id: 'money', test: (c) => c.has('money') },
  { id: 'mint_oyster', test: (c) => c.has('mintchoco') && c.has('oyster') },
  { id: 'cheese_ramen', test: (c) => c.has('cheese') && c.has('ramen') },
  { id: 'pine_cheese', test: (c) => c.has('pineapple') && c.has('cheese') },
  { id: 'jelly_soda', test: (c) => c.has('jelly') && c.has('soda') },
  { id: 'mala', test: (c) => c.has('mala') },
  { id: 'mayo', test: (c) => c.has('mayo') },
  { id: 'banana', test: (c) => c.has('banana') },
  { id: 'chocolate', test: (c) => c.has('chocolate') },
  { id: 'yakgwa', test: (c) => c.has('sugar') && c.has('pear') && c.has('ricepaste') && !c.has('gochugaru') },
  { id: 'jeotgal3', test: (c) => c.has('saeujeot') && c.has('myeolchi') && c.has('oyster') },
  { id: 'gochugaru_only', test: (c) => c.count === 1 && c.has('gochugaru') },
  { id: 'no_gochugaru', test: (c) => !c.has('gochugaru') && c.score < 85 },
  { id: 'successor', test: (c) => c.score >= 95 },
  { id: 'neighborhood', test: (c) => c.score >= 88 },
  { id: 'rice_thief', test: (c) => c.score >= 75 },
  { id: 'aged', test: (c) => c.score >= 55 && c.input.aging >= 0.7 },
  { id: 'fresh', test: (c) => c.score >= 55 && c.input.aging < 0.25 },
  { id: 'decent', test: (c) => c.score >= 60 },
  { id: 'disaster', test: (c) => c.score < 15 },
  { id: 'spicy_over', test: (c) => c.dominant === 'spicy' },
  { id: 'salty_over', test: (c) => c.dominant === 'salty' },
  { id: 'sweet_over', test: (c) => c.dominant === 'sweet' },
  { id: 'umami_over', test: (c) => c.dominant === 'umami' },
  { id: 'cool_over', test: (c) => c.dominant === 'cool' },
  { id: 'chaos_over', test: (c) => c.dominant === 'chaos' },
];

const pick = <T>(list: T[], rng: () => number): T =>
  list[Math.min(list.length - 1, Math.floor(rng() * list.length))];

/** 같은 입력이면 같은 결말·점수. rng는 대사 변주에만 쓰인다. */
export function judge(input: JudgeInput, rng: () => number = () => 0): JudgeResult {
  const customer = getCustomer(input.customerId);
  if (!customer) throw new Error(`unknown customer: ${input.customerId}`);

  const ids = normalizeIngredients(input.ingredients);
  const salt = clamp01(input.salt);
  const rub = clamp01(input.rub);
  const aging = clamp01(input.aging);
  const sum = flavorSum(ids);

  const parts = {
    salt: saltScore(salt),
    rub: rubScore(rub),
    aging: agingScore(aging, customer.agePref),
    seasoning: ids.length === 0 ? 0 : seasoningScore(sum, customer),
  };
  const raw = Math.round(
    100 *
      (WEIGHTS.salt * parts.salt +
        WEIGHTS.rub * parts.rub +
        WEIGHTS.aging * parts.aging +
        WEIGHTS.seasoning * parts.seasoning),
  );

  const norm: JudgeInput = { ...input, salt, rub, aging, ingredients: ids };
  const ctx: Ctx = {
    input: norm,
    ids,
    has: (id) => ids.includes(id),
    count: ids.length,
    weirdCount: ids.filter((id) => getIngredient(id)?.kind === 'weird').length,
    dominant: dominantFlavor(sum),
    score: Math.min(100, Math.max(0, raw)),
  };

  const rule = RULES.find((r) => r.test(ctx));
  const ending: Ending = getEnding(rule ? rule.id : 'decent') ?? ENDINGS[0];
  const score = ending.cap !== undefined ? Math.min(ctx.score, ending.cap) : ctx.score;
  const grade = gradeOf(score);
  const tier = score >= 75 ? 'good' : score >= 45 ? 'mid' : 'bad';

  return {
    score,
    grade,
    ending,
    comment: ending.quote,
    aside: pick(GRADE_ASIDES[grade], rng),
    reaction: pick(customer.reactions[tier], rng),
    flavors: sum,
    graph: FLAVORS.map((f) => ({
      flavor: f,
      label: FLAVOR_LABEL[f],
      value: clamp01(sum[f] / 10),
      target: clamp01(customer.target[f] / 10),
    })),
    parts,
    saltStage: saltStage(salt),
    agingStage: agingStage(aging),
  };
}
