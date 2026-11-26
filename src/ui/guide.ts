import { GUIDE_COPY } from '../data/copy';
import { ENDINGS } from '../data/endings';
import { art, h, rect } from './dom';

const KEY = 'kimjang:guide';
interface GuideState {
  shown: boolean;
  arrowsDone: boolean;
}
let mem: GuideState = { shown: false, arrowsDone: false };
let arrows = false;

function read(): GuideState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...mem, ...JSON.parse(raw) };
  } catch {
    /* 저장 불가 */
  }
  return mem;
}
function write(g: GuideState) {
  mem = g;
  try {
    localStorage.setItem(KEY, JSON.stringify(g));
  } catch {
    /* 저장 불가 */
  }
}

/** ?debug에서는 꺼져 있고 ?debug&guide면 켜진다. */
export const guideEnabled = () => !/[?&]debug\b/.test(location.search) || /[?&]guide\b/.test(location.search);
export const guideSeen = () => read().shown;
export const markGuideSeen = () => write({ ...read(), shown: true });
/** 새 판을 시작할 때 부른다. 첫 판이 끝나기 전에만 화살표가 켜진다. */
export const armArrows = () => {
  arrows = guideEnabled() && !read().arrowsDone;
};
export const disarmArrows = () => {
  arrows = false;
};
export const arrowsActive = () => arrows;
export const finishArrows = () => write({ ...read(), arrowsDone: true });
export function guideReset() {
  mem = { shown: false, arrowsDone: false };
  arrows = false;
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* 저장 불가 */
  }
}

/** 게이지 구간: stageOf가 같은 단계를 돌려주는 값의 처음과 끝(판정 코드에서 읽어 온다). */
export function stageRange<S extends string>(stageOf: (v: number) => S, stage: S): [number, number] {
  let lo = -1;
  let hi = -1;
  for (let i = 0; i <= 1000; i++) {
    if (stageOf(i / 1000) !== stage) continue;
    if (lo < 0) lo = i;
    hi = i;
  }
  const r = (n: number) => Math.round(n / 10) / 100;
  return [r(lo), r(Math.min(1000, hi + 1))];
}

/** 게이지 위에 얹는 색 띠와, 게이지 아래에 붙이는 딱지. */
export function zoneMarks(range: [number, number], label: string) {
  const [lo, hi] = range;
  const band = h('div', { class: 'zone-band', 'data-lo': String(lo), 'data-hi': String(hi), style: `left:${lo * 100}%;width:${(hi - lo) * 100}%` });
  const tagRow = h('div', { class: 'zone-row' },
    h('span', { class: 'zone-tag', style: `left:${((lo + hi) / 2) * 100}%` }, label),
  );
  return { band, tagRow };
}

export interface Pointer {
  clear(): void;
}
/** target을 가리키는 깜빡이는 화살표. 누를 곳을 selector로 data-points에 적는다. */
export function pointAt(screen: HTMLElement, target: HTMLElement, selector: string, label: string, inset = 4): Pointer {
  const el = h('div', { class: 'guide-arrow', 'data-points': selector },
    h('span', { class: 'ga-label' }, label),
    h('i', { class: 'ga-tip' }),
  );
  screen.append(el);
  const place = () => {
    const r = rect(target, screen);
    const sw = screen.clientWidth;
    const cx = Math.min(sw - 70, Math.max(70, Math.round(r.x + r.w / 2)));
    el.style.left = `${cx}px`;
    el.style.top = `${Math.round(r.y + inset)}px`;
  };
  place();
  return { clear: () => el.remove() };
}

/** 게임 방법 창. start가 있으면 그 버튼으로 바로 게임을 시작한다. */
export function openHowTo(stage: HTMLElement, onStart?: () => void) {
  markGuideSeen();
  const close = () => {
    document.removeEventListener('keydown', onKey);
    win.remove();
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') close();
  };
  const rows = GUIDE_COPY.steps.map((s, i) =>
    h('li', { class: 'howto-row' },
      h('b', { class: 'howto-num' }, String(i + 1)),
      art(s.art, s.name, 'howto-img'),
      h('div', { class: 'howto-text' }, h('b', null, s.name), h('span', null, s.line)),
    ),
  );
  const main = onStart
    ? h('button', { class: 'btn btn-red btn-big howto-go', onclick: () => { close(); onStart(); } }, GUIDE_COPY.start)
    : h('button', { class: 'btn btn-green btn-big howto-go', onclick: close }, GUIDE_COPY.close);
  const win = h('div', { class: 'howto', role: 'dialog', 'aria-label': GUIDE_COPY.title },
    h('div', { class: 'howto-win' },
      h('div', { class: 'howto-bar' },
        h('span', null, GUIDE_COPY.title),
        h('button', { class: 'howto-x', 'aria-label': GUIDE_COPY.close, onclick: close }, 'X'),
      ),
      h('ol', { class: 'howto-list' }, ...rows),
      h('p', { class: 'howto-foot' }, GUIDE_COPY.foot(ENDINGS.length)),
      h('div', { class: 'howto-actions' }, main),
    ),
  );
  document.addEventListener('keydown', onKey);
  stage.append(win);
}
