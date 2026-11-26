import { ARROW_COPY, FLAVOR_LABEL, MIX_COPY, MIX_UI } from '../../data/copy';
import { CUSTOMERS, getCustomer } from '../../data/customers';
import { getIngredient, MAX_INGREDIENTS } from '../../data/ingredients';
import { flavorSum } from '../../logic/judge';
import { addIngredient, removeIngredient } from '../../logic/round';
import { FLAVORS } from '../../logic/types';
import { art, h, pick, rect } from '../dom';
import { fly, pop, shake, sparks } from '../fx';
import { grandma } from '../grandma';
import { arrowsActive, pointAt, type Pointer } from '../guide';
import { sfx } from '../sfx';
import { app, next, register } from '../stage';

const BAR_COLOR: Record<string, string> = {
  spicy: 'var(--red)',
  salty: 'var(--sky)',
  sweet: 'var(--yellow)',
  umami: 'var(--green)',
  cool: 'var(--mint)',
  chaos: 'var(--ink)',
};

register('mix', (root) => {
  const stage = root.closest('.stage') as HTMLElement;
  const pending = new Set<string>();
  const c = getCustomer(app.round.customerId) ?? CUSTOMERS[0];
  const gm = grandma('suspicious', MIX_UI.start, 'gm-mini');
  const info = h('div', { class: 'info' }, MIX_UI.hint);
  const lockBadge = h('div', { class: 'lock-badge title-font', hidden: 'hidden' }, MIX_UI.locked);
  const counter = h('span', { class: 'counter-chip title-font' });
  const slots = h('div', { class: 'slots' });
  const bowl = h('div', { class: 'bowl' }, art('/assets/prop/basin.png', '대야', 'basin'), art('/assets/prop/cabbage-red.png', '양념 배추', 'cabbage'));
  const bars = h('div', { class: 'flavors' });
  const barFills: Record<string, HTMLElement> = {};
  const barNums: Record<string, HTMLElement> = {};
  for (const f of FLAVORS) {
    const fillEl = h('div', { class: 'fbar-fill' });
    const num = h('span', { class: 'fbar-num' }, '0');
    barFills[f] = fillEl;
    barNums[f] = num;
    const want = h('i', { class: 'fbar-want', 'data-want': String(c.target[f]), style: `left:${Math.min(1, c.target[f] / 10) * 100}%` });
    bars.append(h('div', { class: 'fbar' }, h('span', { class: 'fbar-name' }, FLAVOR_LABEL[f]), h('div', { class: 'fbar-track' }, fillEl, want), num));
    fillEl.style.background = BAR_COLOR[f];
  }
  const shelf = h('div', { class: 'shelf' });
  const more = h('div', { class: 'shelf-more title-font', hidden: 'hidden' }, MIX_UI.more);
  const shelfWrap = h('div', { class: 'shelf-wrap' }, shelf, more);
  const syncMore = () => {
    more.hidden = shelf.scrollTop + shelf.clientHeight >= shelf.scrollHeight - 6;
  };
  let aimCell: HTMLElement | null = null;
  const followCell = () => {
    if (!ptr || !aimCell) return;
    const sr = shelf.getBoundingClientRect();
    const cr = aimCell.getBoundingClientRect();
    ptr.update(cr.top - sr.top >= 40 && cr.bottom <= sr.bottom + 1);
  };
  shelf.addEventListener('scroll', () => {
    syncMore();
    followCell();
  });
  const screen = root.closest('.screen') as HTMLElement;
  let ptr: Pointer | null = null;
  let ready = false;
  let aimedFor: boolean | null = null;
  const aim = () => {
    if (!ready || !arrowsActive()) return;
    const hasGochu = app.round.ingredients.includes('gochugaru');
    if (hasGochu === aimedFor) return;
    aimedFor = hasGochu;
    ptr?.clear();
    aimCell = null;
    const cell = cells.get('gochugaru');
    shelf.classList.toggle('arrow-room', !hasGochu && !!cell);
    if (!hasGochu && cell) {
      shelf.scrollTop = Math.max(0, cell.offsetTop - 56);
      aimCell = cell;
      ptr = pointAt(screen, cell, '.cell[data-id=gochugaru]', ARROW_COPY.gochugaru, 6);
    } else {
      ptr = pointAt(screen, screen.querySelector('.mix .actions .btn') as HTMLElement, '.mix .actions .btn', ARROW_COPY.mixDone);
    }
  };
  const cells = new Map<string, HTMLElement>();

  const count = () => app.round.ingredients.length + pending.size;
  const refresh = () => {
    const ids = app.round.ingredients;
    slots.replaceChildren(
      ...Array.from({ length: MAX_INGREDIENTS }, (_, i) => {
        const id = ids[i];
        if (!id) return h('div', { class: 'slot empty' });
        const ing = getIngredient(id)!;
        return h('button', {
          class: `slot full ${ing.kind}`,
          'aria-label': `${ing.name} 빼기`,
          onclick: () => remove(id),
        }, art(`/assets/ing/${id}.png`, ing.name, 'slot-img'), h('span', { class: 'slot-x' }, '×'));
      }),
    );
    counter.textContent = MIX_COPY.counter(ids.length, MAX_INGREDIENTS);
    const sum = flavorSum(ids);
    for (const f of FLAVORS) {
      barFills[f].style.width = `${Math.min(1, sum[f] / 10) * 100}%`;
      barNums[f].textContent = String(sum[f]);
    }
    const locked = count() >= MAX_INGREDIENTS;
    shelf.classList.toggle('locked', locked);
    lockBadge.hidden = !locked;
    for (const [id, cell] of cells) cell.classList.toggle('in', ids.includes(id));
    aim();
  };

  function remove(id: string) {
    app.round = removeIngredient(app.round, id);
    sfx.click();
    gm.say('blank', pick(MIX_COPY.removed));
    refresh();
  }

  function add(id: string, cell: HTMLElement) {
    if (pending.has(id)) return;
    if (app.round.ingredients.includes(id)) return remove(id);
    if (count() >= MAX_INGREDIENTS) {
      sfx.warn();
      shake(lockBadge.hidden ? shelf : lockBadge);
      info.textContent = MIX_COPY.full;
      return;
    }
    const ing = getIngredient(id)!;
    pending.add(id);
    refresh();
    const from = rect(cell, stage);
    const to = rect(bowl, stage);
    const node = h('div', { class: 'flyer-box' }, art(`/assets/ing/${id}.png`, ing.name, 'fly-img'));
    sfx.click();
    fly(stage, node, { x: from.x + from.w / 2, y: from.y + from.h / 2 }, { x: to.x + to.w / 2, y: to.y + to.h / 2 }, () => {
      pending.delete(id);
      app.round = addIngredient(app.round, id);
      sfx.pong();
      sparks(stage, to.x + to.w / 2, to.y + to.h / 2);
      pop(bowl, 1.08);
      refresh();
      if (ing.kind === 'weird') {
        const f = pick(['angry', 'faint', 'suspicious'] as const);
        gm.say(f, pick(MIX_COPY.addedWeird));
        sfx.warn();
      } else {
        gm.say(pick(['happy', 'proud'] as const), pick(MIX_COPY.addedNormal));
      }
    });
  }

  for (const ing of app.round.shelf.map((id) => getIngredient(id)!)) {
    let timer = 0;
    let longPressed = false;
    const cell = h('div', { class: `cell ${ing.kind}`, role: 'button', tabindex: '0', 'data-id': ing.id },
      art(`/assets/ing/${ing.id}.png`, ing.name, 'cell-img'),
      h('span', { class: 'cell-name' }, ing.name),
      h('button', {
        class: 'cell-help',
        'aria-label': `${ing.name} 설명`,
        onclick: (e: Event) => {
          e.stopPropagation();
          info.textContent = `${ing.name}: ${ing.desc}`;
        },
      }, '?'),
    );
    cell.addEventListener('pointerdown', () => {
      longPressed = false;
      timer = window.setTimeout(() => {
        longPressed = true;
        info.textContent = `${ing.name}: ${ing.desc}`;
      }, 450);
    });
    for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) cell.addEventListener(ev, () => clearTimeout(timer));
    cell.addEventListener('click', () => {
      if (longPressed) return;
      add(ing.id, cell);
    });
    cells.set(ing.id, cell);
    shelf.append(cell);
  }

  root.append(
    h('div', { class: 'mix' },
      h('p', { class: 'guide' }, MIX_UI.guide),
      h('div', { class: 'mix-top' }, gm.el, bowl, lockBadge),
      h('div', { class: 'want-strip' }, h('b', null, `${MIX_UI.wants} · ${c.name}`), c.order),
      h('div', { class: 'slots-row' }, slots, counter),
      h('div', { class: 'flavor-legend' }, MIX_COPY.flavorTitle, ' · ', MIX_UI.legend),
      bars,
      info,
      shelfWrap,
      h('div', { class: 'actions' },
        h('button', {
          class: 'btn btn-green btn-big',
          onclick: () => {
            sfx.click();
            next();
          },
        }, MIX_UI.go),
      ),
    ),
  );
  refresh();
  requestAnimationFrame(() => {
    ready = true;
    syncMore();
    aim();
  });
});
