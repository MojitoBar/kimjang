import { COLLECTION_COPY, FACE_LABEL, RARITY_LABEL } from '../../data/copy';
import { ENDINGS } from '../../data/endings';
import { collectionProgress } from '../../logic/save';
import type { Ending } from '../../logic/types';
import { art, h } from '../dom';
import { pop } from '../fx';
import { sfx } from '../sfx';
import { app, go, register, type ScreenId } from '../stage';

let from: ScreenId = 'title';

/** 도감을 열고, 돌아가기를 누르면 from 화면으로 간다. */
export function openBook(origin: ScreenId) {
  from = origin;
  go('book');
}

register('book', (root) => {
  const back = from;
  const prog = collectionProgress(app.save, ENDINGS.length);
  const panel = h('div', { class: 'book-detail-wrap' });
  const closeDetail = () => {
    panel.replaceChildren();
    panel.classList.remove('open');
  };
  const showDetail = (en: Ending, seen: boolean) => {
    const first = app.save.endings[en.id]?.firstSeen;
    panel.replaceChildren(
      h('div', { class: 'book-detail', 'data-id': en.id },
        seen
          ? art(`/assets/grandma/${en.face}.png`, `김쳠례 ${FACE_LABEL[en.face]}`, 'bd-face')
          : h('div', { class: 'bd-face bd-q title-font' }, '?'),
        h('div', { class: 'bd-title title-font' }, seen ? en.title : COLLECTION_COPY.locked),
        h('span', { class: `sticker sticker-rarity r-${en.rarity}` }, RARITY_LABEL[en.rarity]),
        h('p', { class: 'bd-body' }, seen ? en.body : COLLECTION_COPY.lockedBody),
        seen && first ? h('div', { class: 'bd-first' }, COLLECTION_COPY.firstSeen(first)) : null,
        h('div', { class: 'bd-hint' }, h('b', null, `${COLLECTION_COPY.hintLabel} `), en.hint),
        h('button', {
          class: 'btn btn-yellow btn-small bd-close',
          onclick: () => {
            sfx.click();
            closeDetail();
          },
        }, COLLECTION_COPY.close),
      ),
    );
    panel.classList.add('open');
    pop(panel.firstElementChild as Element, 1.08);
  };
  panel.addEventListener('click', (ev) => {
    if (ev.target === panel) closeDetail();
  });

  const cells = ENDINGS.map((en) => {
    const seen = !!app.save.endings[en.id];
    return h('button', {
      class: `bcell${seen ? ' seen' : ''} r-${en.rarity}`,
      'data-id': en.id,
      onclick: () => {
        sfx.click();
        showDetail(en, seen);
      },
    },
      seen
        ? art(`/assets/grandma/${en.face}.png`, `김쳠례 ${FACE_LABEL[en.face]}`, 'bcell-img')
        : h('div', { class: 'bcell-q title-font' }, '?'),
      h('div', { class: 'bcell-name' }, seen ? en.title : COLLECTION_COPY.locked),
      seen
        ? h('span', { class: `bcell-rar r-${en.rarity}` }, RARITY_LABEL[en.rarity])
        : h('div', { class: 'bcell-hint' }, en.hint),
    );
  });

  root.append(
    h('div', { class: 'book' },
      h('div', { class: 'book-head' },
        h('div', { class: 'book-title title-font' }, COLLECTION_COPY.title),
        h('div', { class: 'book-count title-font' }, `${prog.seen}/${prog.total}`),
      ),
      h('div', { class: 'book-stats' },
        prog.seen === 0 ? COLLECTION_COPY.empty : prog.seen === prog.total ? COLLECTION_COPY.complete : COLLECTION_COPY.stats(app.save.plays, app.save.best),
      ),
      h('div', { class: 'book-grid' }, ...cells),
      h('div', { class: 'actions' },
        h('button', {
          class: 'btn btn-red btn-big book-back',
          onclick: () => {
            sfx.click();
            go(back);
          },
        }, COLLECTION_COPY.back),
      ),
      panel,
    ),
  );
});
