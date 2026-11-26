import { LOADING_LINES, LOADING_NOW, LOADING_TAP, TITLE } from '../../data/copy';
import { h } from '../dom';
import { go, register } from '../stage';

const DURATION = 1500;

register('loading', (root) => {
  const label = h('div', { class: 'load-label' });
  const BLOCKS = 20;
  const blocks = Array.from({ length: BLOCKS }, () => h('i'));
  const pctEl = h('div', { class: 'load-pct' }, '0%');
  root.append(
    h('div', { class: 'loading', onclick: finish },
      h('div', { class: 'load-sub' }, TITLE),
      h('div', { class: 'title-font load-title' }, LOADING_NOW, h('span', { class: 'load-dots' }, '...')),
      h('div', { class: 'load-bar' }, ...blocks),
      pctEl,
      label,
      h('div', { class: 'load-tap' }, LOADING_TAP),
    ),
  );
  let done = false;
  let raf = 0;
  const t0 = performance.now();
  function finish() {
    if (done) return;
    done = true;
    cancelAnimationFrame(raf);
    go('title');
  }
  const tick = (now: number) => {
    const p = Math.min(1, (now - t0) / DURATION);
    const eased = p < 0.8 ? p * 0.9 : 0.72 + (p - 0.8) * 1.4;
    const pct = Math.round(Math.min(1, eased) * 100);
    blocks.forEach((b, i) => b.classList.toggle('on', i < Math.floor((pct / 100) * BLOCKS)));
    pctEl.textContent = `${pct}%`;
    const line = LOADING_LINES[Math.min(LOADING_LINES.length - 1, Math.floor(p * LOADING_LINES.length))];
    label.textContent = line;
    if (p >= 1) setTimeout(finish, 120);
    else raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => {
    done = true;
    cancelAnimationFrame(raf);
  };
});
