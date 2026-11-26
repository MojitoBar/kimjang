import { ARROW_COPY, SALT_COPY, SALT_QUOTES } from '../../data/copy';
import { saltStage } from '../../logic/judge';
import { setSalt } from '../../logic/round';
import type { SaltStage } from '../../logic/types';
import { art, h, pick, rect } from '../dom';
import { grain, pop, shake } from '../fx';
import { grandma } from '../grandma';
import { arrowsActive, pointAt, stageRange, zoneMarks, type Pointer } from '../guide';
import { sfx } from '../sfx';
import { app, next, register } from '../stage';

const RATE = 0.35; // 초당 게이지 증가량
const FACE: Record<SaltStage, 'blank' | 'suspicious' | 'proud' | 'angry' | 'faint'> = {
  alive: 'blank',
  light: 'suspicious',
  good: 'proud',
  salty: 'angry',
  brine: 'faint',
};

register('salt', (root) => {
  app.round = setSalt(app.round, 0);
  const gm = grandma('blank', SALT_COPY.start, 'gm-corner');
  const fill = h('div', { class: 'gauge-fill' });
  const cabbage = art('/assets/prop/cabbage-raw.png', '생배추', 'cabbage');
  const cabbageBox = h('div', { class: 'cabbage-box' }, cabbage);
  const scoop = h('div', { class: 'scoop' }, art('/assets/prop/salt-scoop.png', '소금 국자'));
  const area = h('div', { class: 'salt-area' },
    h('div', { class: 'basin-box' }, art('/assets/prop/basin.png', '대야', 'basin')),
    cabbageBox,
    scoop,
  );
  const zone = stageRange(saltStage, 'good');
  const marks = zoneMarks(zone, SALT_COPY.zoneTag);
  const doneBtn = h('button', {
    class: 'btn btn-green btn-big',
    onclick: () => {
      sfx.click();
      next();
    },
  }, SALT_COPY.done);
  const hold = h('button', { class: 'btn btn-red btn-big hold', 'aria-label': SALT_COPY.hold }, SALT_COPY.hold);
  root.append(
    h('div', { class: 'salt kitchen' },
      h('p', { class: 'guide' }, SALT_COPY.guide),
      gm.el,
      area,
      h('div', { class: 'gauge-wrap' },
        h('span', { class: 'gauge-label title-font' }, SALT_COPY.gauge),
        h('div', { class: 'gauge-col' },
          h('div', { class: 'gauge' }, fill, marks.band),
          marks.tagRow,
        ),
      ),
      h('div', { class: `actions${arrowsActive() ? ' arrow-room' : ''}` },
        hold,
        doneBtn,
      ),
    ),
  );

  const screen = root.closest('.screen') as HTMLElement;
  let ptr: Pointer | null = null;
  let touched = false;
  const aim = () => {
    ptr?.clear();
    ptr = null;
    if (!arrowsActive()) return;
    if (!touched) ptr = pointAt(screen, hold, '.hold', ARROW_COPY.salt);
    else if (app.round.salt >= zone[0]) ptr = pointAt(screen, doneBtn, '.salt .btn-green', ARROW_COPY.saltDone);
    else ptr = pointAt(screen, hold, '.hold', ARROW_COPY.saltMore);
  };
  requestAnimationFrame(aim);
  let stage: SaltStage = 'alive';
  let salted = false;
  let holding = false;
  let last = 0;
  let raf = 0;
  const paint = () => {
    fill.style.width = `${Math.round(app.round.salt * 100)}%`;
    const st = saltStage(app.round.salt);
    if (st !== stage) {
      stage = st;
      gm.say(FACE[st], pick(SALT_QUOTES[st]));
      if (st === 'salty' || st === 'brine') sfx.warn();
      else sfx.good();
    }
    const nowSalted = app.round.salt > 0.65;
    if (nowSalted !== salted) {
      salted = nowSalted;
      cabbageBox.replaceChildren(art(`/assets/prop/${salted ? 'cabbage-salted' : 'cabbage-raw'}.png`, salted ? '절인 배추' : '생배추', 'cabbage'));
      pop(cabbageBox, 1.15);
      shake(cabbageBox);
    }
  };
  const tick = (now: number) => {
    if (holding) {
      const dt = Math.min(0.05, (now - last) / 1000);
      app.round = setSalt(app.round, app.round.salt + RATE * dt);
      const r = rect(cabbageBox, area);
      grain(area, r.x + r.w / 2, rect(scoop, area).y + 40, r.y + r.h / 2 - rect(scoop, area).y - 30);
      sfx.salt();
      paint();
    }
    last = now;
    raf = requestAnimationFrame(tick);
  };
  const start = (e: Event) => {
    e.preventDefault();
    holding = true;
    touched = true;
    ptr?.clear();
    ptr = null;
    scoop.classList.add('pour');
    hold.classList.add('down');
    last = performance.now();
  };
  const stop = () => {
    const was = holding;
    holding = false;
    scoop.classList.remove('pour');
    hold.classList.remove('down');
    if (was) aim();
  };
  hold.addEventListener('pointerdown', start);
  for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) hold.addEventListener(ev, stop);
  hold.addEventListener('contextmenu', (e) => e.preventDefault());
  paint();
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
});
