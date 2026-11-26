import { AGE_DAYS, ARROW_COPY, AGING_COPY, AGING_LABEL, AGING_QUOTES } from '../../data/copy';
import { CUSTOMERS, getCustomer } from '../../data/customers';
import { agingStage } from '../../logic/judge';
import { setAging } from '../../logic/round';
import type { AgingStage } from '../../logic/types';
import { art, h, pick } from '../dom';
import { pop, shake } from '../fx';
import { grandma } from '../grandma';
import { arrowsActive, pointAt, stageRange, zoneMarks, type Pointer } from '../guide';
import { sfx } from '../sfx';
import { app, next, register } from '../stage';

const DURATION = 7000;
const FACE: Record<AgingStage, 'blank' | 'proud' | 'suspicious' | 'faint'> = {
  fresh: 'blank',
  right: 'proud',
  old: 'suspicious',
  fossil: 'faint',
};

const SMELL = `<svg viewBox="0 0 120 70" class="smell-svg" aria-hidden="true">
  <path d="M20 66 C8 52 32 44 20 30 C10 18 28 10 20 2" fill="none" stroke="#111" stroke-width="5" stroke-linecap="square"/>
  <path d="M60 66 C48 52 72 44 60 30 C50 18 68 10 60 2" fill="none" stroke="#111" stroke-width="5" stroke-linecap="square"/>
  <path d="M100 66 C88 52 112 44 100 30 C90 18 108 10 100 2" fill="none" stroke="#111" stroke-width="5" stroke-linecap="square"/>
</svg>`;
const WEB = `<svg viewBox="0 0 100 100" class="web-svg" aria-hidden="true">
  <g fill="none" stroke="#fff" stroke-opacity=".85" stroke-width="2" stroke-linecap="square">
    <path d="M0 0 L100 100 M0 0 L100 40 M0 0 L40 100 M0 0 L100 0 M0 0 L0 100"/>
    <path d="M30 0 Q28 28 0 30 M60 0 Q56 56 0 60 M90 0 Q84 84 0 90"/>
  </g>
</svg>`;

const dayLabel = (v: number) => [...AGE_DAYS].reverse().find(([from]) => v >= from)?.[1] ?? AGE_DAYS[0][1];

register('age', (root) => {
  app.round = setAging(app.round, 0);
  const c = getCustomer(app.round.customerId) ?? CUSTOMERS[0];
  const gm = grandma('blank', AGING_COPY.start, 'gm-corner');
  const crock = h('div', { class: 'crock', 'data-stage': 'fresh' },
    h('div', { class: 'smell' }),
    art('/assets/prop/onggi.png', '김장독', 'crock-img'),
    h('div', { class: 'web' }),
  );
  (crock.querySelector('.smell') as HTMLElement).innerHTML = SMELL;
  (crock.querySelector('.web') as HTMLElement).innerHTML = WEB;
  const dayText = h('div', { class: 'cal-day title-font' }, dayLabel(0));
  const calendar = h('div', { class: 'calendar' },
    h('div', { class: 'cal-top' }, AGING_COPY.calendar),
    dayText,
    h('div', { class: 'cal-sub' }, AGING_COPY.elapsed),
  );
  const tag = h('div', { class: 'stage-tag title-font' }, AGING_LABEL.fresh);
  const fill = h('div', { class: 'gauge-fill age-fill' });
  const marks = zoneMarks(stageRange(agingStage, 'right'), AGING_COPY.zoneTag);
  const takeBtn = h('button', { class: 'btn btn-red btn-big' }, AGING_COPY.take);
  root.append(
    h('div', { class: 'age kitchen' },
      h('p', { class: 'guide' }, AGING_COPY.instruction),
      h('div', { class: 'age-cust' },
        h('div', { class: 'age-cust-img' }, art(`/assets/customer/${c.id}.png`, c.name, 'cust-mini')),
        h('div', { class: 'bubble age-bubble' }, h('b', { class: 'age-who' }, `${AGING_COPY.customer} · ${c.name}`), c.order),
      ),
      h('div', { class: 'age-area' }, crock, calendar, tag),
      h('div', { class: 'gauge-wrap age-gauge' },
        h('span', { class: 'gauge-label title-font' }, AGING_COPY.left),
        h('div', { class: 'gauge-col' },
          h('div', { class: 'gauge' }, fill, marks.band),
          marks.tagRow,
        ),
        h('span', { class: 'gauge-label title-font' }, AGING_COPY.right),
      ),
      gm.el,
      h('div', { class: `actions${arrowsActive() ? ' arrow-room' : ''}` }, takeBtn),
    ),
  );

  const screen = root.closest('.screen') as HTMLElement;
  let ptr: Pointer | null = null;
  let v = 0;
  let stage: AgingStage = 'fresh';
  let day = dayLabel(0);
  let taken = false;
  let last = performance.now();
  let raf = 0;
  const timers: number[] = [];
  const paint = () => {
    app.round = setAging(app.round, v);
    fill.style.width = `${Math.round(v * 100)}%`;
    const d = dayLabel(v);
    if (d !== day) {
      day = d;
      dayText.textContent = d;
      pop(dayText, 1.2);
      sfx.tick();
    }
    const st = agingStage(v);
    if (st !== stage) {
      stage = st;
      crock.dataset.stage = st;
      tag.textContent = AGING_LABEL[st];
      pop(tag, 1.3);
      shake(crock);
      gm.say(FACE[st], pick(AGING_QUOTES[st]));
      ptr?.clear();
      ptr = st === 'right' && arrowsActive() ? pointAt(screen, takeBtn, '.age .btn-red', ARROW_COPY.take) : null;
      if (st === 'fossil') sfx.warn();
      else sfx.good();
    }
  };
  const take = () => {
    if (taken) return;
    taken = true;
    cancelAnimationFrame(raf);
    app.round = setAging(app.round, v);
    crock.classList.add('opened');
    sfx.pong();
    timers.push(window.setTimeout(next, 450));
  };
  takeBtn.addEventListener('click', () => {
    sfx.click();
    take();
  });
  const tick = (now: number) => {
    if (taken) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    v = Math.min(1, v + (dt * 1000) / DURATION);
    paint();
    if (v >= 1) timers.push(window.setTimeout(take, 1300));
    else raf = requestAnimationFrame(tick);
  };
  paint();
  raf = requestAnimationFrame(tick);
  return () => {
    taken = true;
    cancelAnimationFrame(raf);
    timers.forEach(clearTimeout);
  };
});
