import { SITE_COPY, STEPS } from '../data/copy';
import { advance, newRound, PHASES, type RoundState } from '../logic/round';
import { emptySave, loadSave, writeSave, type SaveData } from '../logic/save';
import { h } from './dom';
import { guideReset } from './guide';

export type ScreenId = 'loading' | 'title' | 'order' | 'salt' | 'mix' | 'rub' | 'age' | 'result' | 'book';
export type Cleanup = void | (() => void);
export type Mount = (root: HTMLElement) => Cleanup;

interface ScreenDef {
  mount: Mount;
  /** true면 상단 단계 표시를 보인다 */
  steps: boolean;
}

const screens = new Map<ScreenId, ScreenDef>();

/** 화면 등록. 단계 표시는 order~result 화면에서만 보인다. */
export function register(id: ScreenId, mount: Mount) {
  screens.set(id, { mount, steps: (PHASES as readonly string[]).includes(id) });
}

export const rng = () => Math.random();

export const app: { round: RoundState; save: SaveData; screen: ScreenId | null } = {
  round: newRound(rng),
  save: emptySave(),
  screen: null,
};

const rootStage = h('div', { class: 'stage' });
let content: HTMLElement | null = null;
let cleanup: (() => void) | undefined;

const STEP_LABELS = ['주문', '절이기', '양념', '버무리기', '숙성', '판정'];

function stepbar(current: ScreenId) {
  const idx = (PHASES as readonly string[]).indexOf(current);
  const bar = h('div', { class: 'stepbar', 'data-step': String(idx) });
  STEP_LABELS.forEach((label, i) => {
    bar.append(h('span', { class: `step${i === idx ? ' on' : i < idx ? ' done' : ''}`, title: STEPS[i].title }, label));
  });
  return bar;
}

export function go(id: ScreenId) {
  const def = screens.get(id);
  if (!def) throw new Error(`화면 없음: ${id}`);
  cleanup?.();
  cleanup = undefined;
  content?.remove();
  app.screen = id;
  content = h('div', { class: `screen screen-${id}`, 'data-screen': id });
  if (def.steps) content.append(stepbar(id));
  const body = h('div', { class: 'body' });
  content.append(body);
  rootStage.append(content);
  const c = def.mount(body);
  if (typeof c === 'function') cleanup = c;
}

/** 라운드를 다음 단계로 넘기고 그 화면으로 간다. */
export function next() {
  app.round = advance(app.round, rng);
  go(app.round.phase);
}

export function startRound() {
  app.round = newRound(rng);
  go('order');
}

export function persist() {
  try {
    writeSave(localStorage, app.save);
  } catch {
    /* 저장 불가 */
  }
}

function siteFrame(stage: HTMLElement) {
  const digits = (n: number) => h('div', { class: 'cnt' }, ...String(n).padStart(7, '0').split('').map((d) => h('b', null, d)));
  const visits = 12345 + app.save.plays;
  return h('div', { class: 'backdrop' },
    h('div', { class: 'site' },
      h('aside', { class: 'side side-l' },
        h('div', { class: 'box' }, h('div', { class: 'yel' }, SITE_COPY.visitors), digits(visits)),
        h('div', { class: 'box' }, h('span', { class: 'new' }, SITE_COPY.newTag), ' ', SITE_COPY.newText),
        h('div', { class: 'box' }, SITE_COPY.best),
      ),
      h('div', { class: 'win' },
        h('div', { class: 'win-title' }, h('span', null, SITE_COPY.winTitle), h('span', { class: 'win-btns' }, h('i', null, '_'), h('i', null, '□'), h('i', null, 'X'))),
        stage,
        h('div', { class: 'win-status' }, h('span', null, SITE_COPY.ticker.repeat(3))),
      ),
      h('aside', { class: 'side side-r' },
        h('div', { class: 'box' }, SITE_COPY.reload),
        h('div', { class: 'box' }, SITE_COPY.copyright),
      ),
    ),
  );
}

export function boot(host: HTMLElement) {
  try {
    app.save = loadSave(localStorage);
  } catch {
    /* 저장 불가 */
  }
  host.append(siteFrame(rootStage));
  if (/[?&]debug\b/.test(location.search)) {
    (window as unknown as { __kj: unknown }).__kj = {
      get: () => ({ screen: app.screen, round: app.round, save: app.save }),
      go: (stage: ScreenId) => {
        if ((PHASES as readonly string[]).includes(stage)) {
          app.round = { ...app.round, phase: stage as RoundState['phase'] };
        }
        go(stage);
      },
      guideReset,
      set: (partial: Partial<RoundState>) => {
        app.round = { ...app.round, ...partial };
        if (app.screen) go(app.screen);
      },
    };
  }
  go('loading');
}
