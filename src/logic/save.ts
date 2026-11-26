import { getEnding } from '../data/endings';
import type { JudgeResult } from './types';

export const SAVE_KEY = 'kimjang:save';
export const SAVE_VERSION = 1;

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface SaveData {
  version: number;
  plays: number;
  best: number;
  endings: Record<string, { firstSeen: string }>;
}

export const emptySave = (): SaveData => ({ version: SAVE_VERSION, plays: 0, best: 0, endings: {} });

function parse(raw: string | null): SaveData | null {
  if (!raw) return null;
  try {
    const d = JSON.parse(raw) as Partial<SaveData>;
    if (!d || d.version !== SAVE_VERSION) return null;
    if (!Number.isInteger(d.plays) || (d.plays as number) < 0) return null;
    if (typeof d.best !== 'number' || d.best < 0 || d.best > 100) return null;
    if (!d.endings || typeof d.endings !== 'object' || Array.isArray(d.endings)) return null;
    const endings: SaveData['endings'] = {};
    for (const [id, v] of Object.entries(d.endings)) {
      if (!getEnding(id)) continue;
      if (!v || typeof v.firstSeen !== 'string') return null;
      endings[id] = { firstSeen: v.firstSeen };
    }
    return { version: SAVE_VERSION, plays: d.plays as number, best: d.best, endings };
  } catch {
    return null;
  }
}

/** 없거나 깨진 값이면 새 저장을 돌려준다. */
export function loadSave(storage: StorageLike): SaveData {
  try {
    return parse(storage.getItem(SAVE_KEY)) ?? emptySave();
  } catch {
    return emptySave();
  }
}

export function writeSave(storage: StorageLike, data: SaveData): boolean {
  try {
    storage.setItem(SAVE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

/** today는 'YYYY-MM-DD'. 저장소에 쓰지는 않는다(writeSave로 따로). */
export function recordResult(
  save: SaveData,
  result: JudgeResult,
  today: string,
): { save: SaveData; newEnding: boolean; newBest: boolean } {
  const newEnding = !save.endings[result.ending.id];
  const newBest = result.score > save.best;
  return {
    newEnding,
    newBest,
    save: {
      ...save,
      plays: save.plays + 1,
      best: Math.max(save.best, result.score),
      endings: newEnding ? { ...save.endings, [result.ending.id]: { firstSeen: today } } : save.endings,
    },
  };
}

export function collectionProgress(save: SaveData, total: number): { seen: number; total: number } {
  return { seen: Object.keys(save.endings).length, total };
}
