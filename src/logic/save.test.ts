import { describe, expect, it } from 'vitest';
import { ENDINGS } from '../data/endings';
import { judge } from './judge';
import { collectionProgress, emptySave, loadSave, recordResult, SAVE_KEY, writeSave, type StorageLike } from './save';

const memory = (init: Record<string, string> = {}): StorageLike & { data: Record<string, string> } => {
  const data = { ...init };
  return {
    data,
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => {
      data[k] = v;
    },
  };
};

const result = (ingredients: string[]) =>
  judge({ customerId: 'banjang', salt: 0.55, ingredients, rub: 0.9, aging: 0.45 });

describe('save', () => {
  it('저장이 없으면 새 저장', () => {
    expect(loadSave(memory())).toEqual(emptySave());
  });

  it('기록 후 쓰고 읽으면 그대로 돌아온다', () => {
    const store = memory();
    const first = recordResult(emptySave(), result([]), '2026-11-26');
    expect(first.newEnding).toBe(true);
    expect(first.newBest).toBe(true);
    expect(writeSave(store, first.save)).toBe(true);
    expect(store.data[SAVE_KEY]).toContain('"version"');
    expect(loadSave(store)).toEqual(first.save);
    expect(first.save.plays).toBe(1);
    expect(first.save.endings.no_ingredients.firstSeen).toBe('2026-11-26');
  });

  it('같은 결말은 처음 본 날짜를 유지하고 판 수는 늘어난다', () => {
    const a = recordResult(emptySave(), result([]), '2026-11-26');
    const b = recordResult(a.save, result([]), '2026-11-30');
    expect(b.newEnding).toBe(false);
    expect(b.save.plays).toBe(2);
    expect(b.save.endings.no_ingredients.firstSeen).toBe('2026-11-26');
  });

  it('최고 점수는 내려가지 않는다', () => {
    const hi = recordResult(emptySave(), result(['gochugaru', 'garlic', 'ginger', 'saeujeot', 'radish', 'scallion']), 'd');
    const lo = recordResult(hi.save, result([]), 'd');
    expect(lo.newBest).toBe(false);
    expect(lo.save.best).toBe(hi.save.best);
  });

  it('깨진 저장은 새 저장으로 복구된다', () => {
    const bad = [
      '{not json',
      'null',
      '[]',
      JSON.stringify({ version: 99, plays: 1, best: 1, endings: {} }),
      JSON.stringify({ version: 1, plays: -3, best: 1, endings: {} }),
      JSON.stringify({ version: 1, plays: 1, best: 500, endings: {} }),
      JSON.stringify({ version: 1, plays: 1, best: 10, endings: 'x' }),
      JSON.stringify({ version: 1, plays: 1, best: 10, endings: { mala: { firstSeen: 5 } } }),
    ];
    for (const raw of bad) expect(loadSave(memory({ [SAVE_KEY]: raw }))).toEqual(emptySave());
  });

  it('저장소가 예외를 던져도 죽지 않는다', () => {
    const boom: StorageLike = {
      getItem: () => {
        throw new Error('x');
      },
      setItem: () => {
        throw new Error('x');
      },
    };
    expect(loadSave(boom)).toEqual(emptySave());
    expect(writeSave(boom, emptySave())).toBe(false);
  });

  it('없어진 결말 id는 버리고 나머지는 살린다', () => {
    const raw = JSON.stringify({ version: 1, plays: 2, best: 40, endings: { mala: { firstSeen: 'a' }, gone: { firstSeen: 'b' } } });
    const s = loadSave(memory({ [SAVE_KEY]: raw }));
    expect(Object.keys(s.endings)).toEqual(['mala']);
    expect(collectionProgress(s, ENDINGS.length)).toEqual({ seen: 1, total: ENDINGS.length });
  });
});
