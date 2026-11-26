import { GUIDE_COPY, LOGO_ALT, PHONE_LINE, SINCE, TAGLINE, TITLE, TITLE_COPY, TITLE_FOOT } from '../../data/copy';
import { ENDINGS } from '../../data/endings';
import { collectionProgress } from '../../logic/save';
import { art, asset, h } from '../dom';
import { isForcedMute, isMuted, setMuted, sfx } from '../sfx';
import { armArrows, guideEnabled, guideSeen, openHowTo } from '../guide';
import { app, register, startRound } from '../stage';
import { openBook } from './book';

/** 제목 글자 그림. 파일이 없으면 글자 제목으로 대체한다. */
function titleHead() {
  const fallback = () => h('h1', { class: 'title-font title-name' }, TITLE);
  const img = h('img', { class: 'title-logo', src: asset('/assets/ui/logo.png'), alt: LOGO_ALT, draggable: 'false' });
  const wrap = h('h1', { class: 'title-head' }, img);
  img.addEventListener('error', () => wrap.replaceWith(fallback()));
  return wrap;
}

register('title', (root) => {
  const prog = collectionProgress(app.save, ENDINGS.length);
  const visits = 12345 + app.save.plays;
  const soundBtn = h('button', { class: 'btn btn-sky btn-small', 'aria-label': '소리' });
  const paintSound = () => {
    soundBtn.textContent = isMuted() ? TITLE_COPY.sound[1] : TITLE_COPY.sound[0];
  };
  paintSound();
  soundBtn.onclick = () => {
    if (!isForcedMute()) setMuted(!isMuted());
    paintSound();
    sfx.click();
  };

  const stageEl = () => root.closest('.stage') as HTMLElement;
  const begin = () => {
    armArrows();
    startRound();
  };
  root.append(
    h('div', { class: 'title' },
      h('div', { class: 'marquee' }, h('div', { class: 'marquee-track' }, TITLE_COPY.marquee.repeat(4))),
      titleHead(),
      h('div', { class: 'title-art' },
        art('/assets/bg/title.png', TITLE, 'title-img'),
        h('div', { class: 'burst' }, h('span', null, SINCE)),
      ),
      h('p', { class: 'tagline' }, TAGLINE),
      h('button', {
        class: 'btn btn-red btn-start blink',
        onclick: () => {
          sfx.click();
          if (guideEnabled() && !guideSeen()) openHowTo(stageEl(), begin);
          else begin();
        },
      }, TITLE_COPY.startBlink),
      h('button', {
        class: 'btn btn-sky btn-small btn-howto',
        onclick: () => {
          sfx.click();
          openHowTo(stageEl());
        },
      }, GUIDE_COPY.button),
      h('div', { class: 'title-row' },
        h('button', {
          class: 'btn btn-yellow btn-small',
          onclick: () => {
            sfx.click();
            openBook('title');
          },
        }, TITLE_COPY.book(prog.seen, prog.total)),
        soundBtn,
      ),
      h('div', { class: 'counter' }, `${TITLE_COPY.visitors} ${String(visits).padStart(7, '0')}  |  ${PHONE_LINE}`),
      h('div', { class: 'counter foot' }, TITLE_FOOT),
    ),
  );
});
