import { ARROW_COPY, COLLECTION_BUTTON, FACE_LABEL, GRADE_LABEL, RARITY_LABEL, RESULT_COPY } from '../../data/copy';
import { CUSTOMERS, getCustomer } from '../../data/customers';
import { ENDINGS } from '../../data/endings';
import { recordResult } from '../../logic/save';
import type { Flavor, JudgeResult } from '../../logic/types';
import { art, h } from '../dom';
import { pop, shake } from '../fx';
import { arrowsActive, disarmArrows, finishArrows, pointAt } from '../guide';
import { sfx } from '../sfx';
import { app, go, persist, register, startRound } from '../stage';
import { openBook } from './book';

const FLAVOR_COLOR: Record<Flavor, string> = {
  spicy: '#e8312a',
  salty: '#4cc3ff',
  sweet: '#ff9bd0',
  umami: '#ff9a1f',
  cool: '#7fe0c0',
  chaos: '#111',
};

interface Recorded {
  newEnding: boolean;
  newBest: boolean;
  played: boolean;
}
const recorded = new WeakMap<JudgeResult, Recorded>();

const today = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

register('result', (root) => {
  const res = app.round.result;
  if (!res) {
    go('title');
    return;
  }
  let info = recorded.get(res);
  if (!info) {
    const r = recordResult(app.save, res, today());
    app.save = r.save;
    persist();
    info = { newEnding: r.newEnding, newBest: r.newBest, played: false };
    recorded.set(res, info);
  }
  const rec = info;
  const c = getCustomer(app.round.customerId) ?? CUSTOMERS[0];
  const e = res.ending;

  const scoreNum = h('span', { class: 'score-num title-font' }, '0');
  const stampLetter = h('span', { class: `stamp-letter title-font g-${res.grade}` }, res.grade);
  const stamp = h('div', { class: 'stamp' }, art('/assets/prop/stamp-burst.png', '도장', 'stamp-img'), stampLetter);
  const face = h('div', { class: 'res-face' }, art(`/assets/grandma/${e.face}.png`, `김쳠례 ${FACE_LABEL[e.face]}`, 'res-face-img'));
  const titleBar = h('div', { class: 'res-title title-font' }, e.title);
  const badges = h('div', { class: 'res-badges' },
    rec.newEnding
      ? h('span', { class: 'sticker sticker-new title-font' }, RESULT_COPY.newEnding)
      : h('span', { class: 'sticker sticker-seen' }, RESULT_COPY.seenEnding),
    h('span', { class: `sticker sticker-rarity r-${e.rarity}` }, RARITY_LABEL[e.rarity]),
    rec.newBest ? h('span', { class: 'sticker sticker-best title-font' }, RESULT_COPY.newBest) : null,
  );
  const graph = h('div', { class: 'res-graph' },
    h('div', { class: 'res-sub' }, RESULT_COPY.graphTitle),
    ...res.graph.map((g) =>
      h('div', { class: 'gbar' },
        h('span', { class: 'gbar-name' }, g.label),
        h('div', { class: 'gbar-track' },
          h('div', { class: 'gbar-fill', style: `width:${Math.round(g.value * 100)}%;background:${FLAVOR_COLOR[g.flavor]}` }),
          h('div', { class: 'gbar-want', style: `left:${Math.round(g.target * 100)}%` }),
        ),
      ),
    ),
    h('div', { class: 'gbar-legend' },
      h('span', null, h('i', { class: 'lg-mine' }), RESULT_COPY.graphMine),
      h('span', null, h('i', { class: 'lg-want' }), RESULT_COPY.graphWant),
    ),
  );
  const parts = h('div', { class: 'res-parts' },
    ...(['salt', 'seasoning', 'rub', 'aging'] as const).map((k) =>
      h('span', { class: 'part' }, `${RESULT_COPY.partLabels[k]} `, h('b', null, String(Math.round(res.parts[k] * 100)))),
    ),
  );
  const details = h('div', { class: 'res-details' },
    h('p', { class: 'res-body' }, e.body),
    h('div', { class: 'res-quote' },
      h('div', { class: 'res-who title-font' }, RESULT_COPY.momSays),
      h('div', null, `"${res.comment}"`),
      h('div', { class: 'res-aside' }, `${GRADE_LABEL[res.grade]} · ${res.aside}`),
    ),
    h('div', { class: 'res-cust' },
      h('div', { class: 'res-cust-img' }, art(`/assets/customer/${c.id}.png`, c.name, 'cust-mini')),
      h('div', { class: 'bubble' }, h('b', { class: 'age-who' }, `${RESULT_COPY.customerSays} · ${c.name}`), res.reaction),
    ),
    graph,
    parts,
  );
  const top = h('div', { class: 'res-top' },
    face,
    h('div', { class: 'res-score' },
      h('div', { class: 'res-sub' }, RESULT_COPY.scoreLabel),
      h('div', null, scoreNum, h('span', { class: 'score-max' }, ' /100')),
      h('div', { class: 'res-best' }, RESULT_COPY.bestLine(app.save.best)),
    ),
    stamp,
  );
  const main = h('div', { class: 'res-main' },
    titleBar,
    badges,
    h('div', { class: 'res-scroll' }, top, details),
    h('p', { class: 'res-remix' }, RESULT_COPY.remix(ENDINGS.length)),
    h('div', { class: `actions${arrowsActive() ? ' arrow-room' : ''}` },
      h('button', {
        class: 'btn btn-red btn-big res-again',
        onclick: () => {
          sfx.click();
          disarmArrows();
          startRound();
        },
      }, RESULT_COPY.again),
      h('button', {
        class: 'btn btn-yellow btn-big res-book',
        onclick: () => {
          sfx.click();
          openBook('result');
        },
      }, COLLECTION_BUTTON),
    ),
  );
  const biteText = h('div', { class: 'bubble bite-bubble title-font' }, RESULT_COPY.bite);
  const biteFace = h('div', { class: 'bite-face' }, art('/assets/grandma/blank.png', '김쳠례 멍', 'bite-img'));
  const scene = h('div', { class: 'res-scene' },
    biteText,
    biteFace,
    h('div', { class: 'bite-plate' }, art('/assets/prop/kimchi-plate.png', '김치 접시', 'plate-img')),
    h('div', { class: 'bite-skip' }, RESULT_COPY.skipHint),
  );
  const root2 = h('div', { class: 'result' }, main, scene);
  root.append(root2);

  const screen = root.closest('.screen') as HTMLElement;
  let arrowed = false;
  const aimAgain = () => {
    if (arrowed || !arrowsActive()) return;
    arrowed = true;
    pointAt(screen, main.querySelector('.res-again') as HTMLElement, '.res-again', ARROW_COPY.again);
  };
  if (arrowsActive()) finishArrows();
  const setScore = (n: number) => {
    scoreNum.textContent = String(n);
  };
  const timers: number[] = [];
  let raf = 0;
  let step = 0;
  const hide = [top.querySelector('.res-score'), stamp, details, titleBar, badges, face] as HTMLElement[];

  const reveal = (quick: boolean) => {
    scene.remove();
    main.classList.add('on');
    if (quick) {
      hide.forEach((n) => n.classList.add('shown'));
      setScore(res.score);
      stamp.classList.add('shown', 'stamped', 'quick');
      timers.push(window.setTimeout(aimAgain, 60));
      return;
    }
    sfx.bang();
    shake(root2);
    titleBar.classList.add('shown');
    pop(titleBar, 1.2);
    face.classList.add('shown');
    pop(face, 1.2);
    timers.push(
      window.setTimeout(() => {
        top.querySelector('.res-score')?.classList.add('shown');
        const t0 = performance.now();
        const run = (now: number) => {
          const p = Math.min(1, (now - t0) / 900);
          setScore(Math.round(res.score * p));
          if (p < 1) raf = requestAnimationFrame(run);
        };
        raf = requestAnimationFrame(run);
      }, 350),
      window.setTimeout(() => {
        stamp.classList.add('shown', 'stamped');
        sfx.stamp();
        shake(main);
      }, 1400),
      window.setTimeout(() => {
        details.classList.add('shown');
        badges.classList.add('shown');
        pop(details, 1.04);
        sfx.good();
        rec.played = true;
        aimAgain();
      }, 1900),
    );
    step = 3;
  };

  const skip = () => {
    if (step >= 3) {
      if (!main.classList.contains('all')) {
        timers.forEach(clearTimeout);
        cancelAnimationFrame(raf);
        main.classList.add('all');
        hide.forEach((n) => n.classList.add('shown'));
        setScore(res.score);
        stamp.classList.add('stamped', 'quick');
        rec.played = true;
        aimAgain();
      }
      return;
    }
    timers.forEach(clearTimeout);
    step = 3;
    reveal(true);
    main.classList.add('all');
    rec.played = true;
  };
  scene.addEventListener('click', skip);
  main.addEventListener('click', (ev) => {
    if (!(ev.target as HTMLElement).closest('.btn')) skip();
  });

  if (rec.played) {
    reveal(true);
    main.classList.add('all');
    return;
  }
  timers.push(
    window.setTimeout(() => {
      biteText.textContent = RESULT_COPY.silence;
      biteFace.classList.add('still');
      sfx.tick();
      step = 1;
    }, 1300),
    window.setTimeout(() => {
      step = 2;
      reveal(false);
    }, 2400),
  );
  return () => {
    timers.forEach(clearTimeout);
    cancelAnimationFrame(raf);
  };
});
