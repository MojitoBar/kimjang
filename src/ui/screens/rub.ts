import { ARROW_COPY, RUB_COPY } from '../../data/copy';
import { setRub } from '../../logic/round';
import { art, asset, h, pick } from '../dom';
import { pop, splat } from '../fx';
import { grandma } from '../grandma';
import { arrowsActive, pointAt, type Pointer } from '../guide';
import { sfx } from '../sfx';
import { app, next, register } from '../stage';

const W = 420;
const H = 320;
const GW = 42;
const GH = 32;
const R = 40; // 붓 반지름(그림 좌표)
const LIMIT = 8000;
const SRC = '/assets/prop/cabbage-red.png';

register('rub', (root) => {
  app.round = setRub(app.round, 0);
  const gm = grandma('blank', pick(RUB_COPY.start), 'gm-corner');
  const saltedImg = art('/assets/prop/cabbage-salted.png', '절인 배추', 'rub-base');
  const view = document.createElement('canvas');
  view.width = W;
  view.height = H;
  view.className = 'rub-top';
  const mask = document.createElement('canvas');
  mask.width = W;
  mask.height = H;
  const vx = view.getContext('2d')!;
  const mx = mask.getContext('2d')!;
  mx.strokeStyle = '#000';
  mx.fillStyle = '#000';
  mx.lineCap = 'round';
  mx.lineWidth = R * 2;

  const cab = h('div', { class: 'rub-cabbage' }, saltedImg, view);
  const area = h('div', { class: 'rub-area' },
    h('div', { class: 'basin-box' }, art('/assets/prop/basin.png', '대야', 'basin')),
    cab,
  );
  const fill = h('div', { class: 'time-fill' });
  const pct = h('span', { class: 'rub-pct title-font' }, RUB_COPY.progress(0));
  const doneBtn = h('button', { class: 'btn btn-green btn-big' }, RUB_COPY.done);
  root.append(
    h('div', { class: 'rub kitchen' },
      h('p', { class: 'guide' }, RUB_COPY.instruction),
      gm.el,
      h('div', { class: 'time-wrap' },
        h('span', { class: 'gauge-label title-font' }, RUB_COPY.time),
        h('div', { class: 'gauge time' }, fill),
        pct,
      ),
      area,
      h('div', { class: 'actions' }, doneBtn),
    ),
  );

  const img = new Image();
  const inside = new Uint8Array(GW * GH);
  const covered = new Uint8Array(GW * GH);
  let insideN = GW * GH;
  let coveredN = 0;
  let ready = false;
  img.onload = () => {
    const c = document.createElement('canvas');
    c.width = GW;
    c.height = GH;
    const cx = c.getContext('2d', { willReadFrequently: true })!;
    cx.drawImage(img, 0, 0, GW, GH);
    const d = cx.getImageData(0, 0, GW, GH).data;
    insideN = 0;
    for (let i = 0; i < GW * GH; i++) {
      inside[i] = d[i * 4 + 3] > 60 ? 1 : 0;
      insideN += inside[i];
    }
    insideN = Math.max(1, insideN);
    ready = true;
  };
  img.onerror = () => {
    inside.fill(1);
    ready = true;
  };
  img.src = asset(SRC);

  let finished = false;
  let dragging = false;
  let lx = 0;
  let ly = 0;
  let lastQuip = performance.now();
  let lastTouch = performance.now();
  let stage = 0;
  const t0 = performance.now();
  let raf = 0;
  const timers: number[] = [];

  const progress = () => (ready ? Math.min(1, coveredN / (insideN * 0.92)) : 0);
  const redraw = () => {
    vx.globalCompositeOperation = 'source-over';
    vx.clearRect(0, 0, W, H);
    vx.drawImage(mask, 0, 0);
    vx.globalCompositeOperation = 'source-in';
    if (img.complete && img.naturalWidth) vx.drawImage(img, 0, 0, W, H);
  };
  const mark = (x: number, y: number) => {
    const gx0 = Math.max(0, Math.floor((x - R) / 10));
    const gx1 = Math.min(GW - 1, Math.floor((x + R) / 10));
    const gy0 = Math.max(0, Math.floor((y - R) / 10));
    const gy1 = Math.min(GH - 1, Math.floor((y + R) / 10));
    for (let gy = gy0; gy <= gy1; gy++) {
      for (let gx = gx0; gx <= gx1; gx++) {
        const i = gy * GW + gx;
        if (covered[i] || !inside[i]) continue;
        const dx = gx * 10 + 5 - x;
        const dy = gy * 10 + 5 - y;
        if (dx * dx + dy * dy <= R * R) {
          covered[i] = 1;
          coveredN++;
        }
      }
    }
  };
  const quip = (force = false) => {
    const p = progress();
    const s = p < 0.3 ? 0 : p < 0.7 ? 1 : 2;
    if (!force && s === stage) return;
    stage = s;
    gm.say(s === 2 ? 'proud' : s === 1 ? 'suspicious' : 'angry', pick([RUB_COPY.low, RUB_COPY.mid, RUB_COPY.high][s]));
    lastQuip = performance.now();
  };
  const screen = root.closest('.screen') as HTMLElement;
  let ptr: Pointer | null = null;
  let doneAimed = false;
  requestAnimationFrame(() => {
    if (arrowsActive() && !dragging && !finished) ptr = pointAt(screen, cab, '.rub-cabbage', ARROW_COPY.rub, 70);
  });
  const paint = () => {
    const p = progress();
    if (arrowsActive() && p >= 0.7 && !doneAimed) {
      doneAimed = true;
      ptr?.clear();
      ptr = pointAt(screen, doneBtn, '.rub .btn-green', ARROW_COPY.rubDone);
    }
    pct.textContent = RUB_COPY.progress(Math.round(p * 100));
    app.round = setRub(app.round, p);
  };
  const local = (e: PointerEvent) => {
    const r = view.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H, r };
  };
  const finish = () => {
    if (finished) return;
    finished = true;
    cancelAnimationFrame(raf);
    paint();
    sfx.good();
    const tag = h('div', { class: 'rub-end title-font' }, RUB_COPY.end);
    area.append(tag);
    pop(tag, 1.3);
    timers.push(window.setTimeout(next, 550));
  };
  const down = (e: PointerEvent) => {
    if (finished) return;
    e.preventDefault();
    area.setPointerCapture(e.pointerId);
    dragging = true;
    if (!doneAimed) {
      ptr?.clear();
      ptr = null;
    }
    const p = local(e);
    lx = p.x;
    ly = p.y;
    lastTouch = performance.now();
  };
  const move = (e: PointerEvent) => {
    if (!dragging || finished || !ready) return;
    const p = local(e);
    const dx = p.x - lx;
    const dy = p.y - ly;
    const dist = Math.hypot(dx, dy);
    if (dist < 1) return;
    mx.beginPath();
    mx.moveTo(lx, ly);
    mx.lineTo(p.x, p.y);
    mx.stroke();
    const steps = Math.ceil(dist / 8);
    for (let i = 1; i <= steps; i++) mark(lx + (dx * i) / steps, ly + (dy * i) / steps);
    lx = p.x;
    ly = p.y;
    lastTouch = performance.now();
    const ar = area.getBoundingClientRect();
    splat(area, e.clientX - ar.left, e.clientY - ar.top, 2);
    sfx.rub();
    redraw();
    paint();
    quip();
    if (progress() >= 1) timers.push(window.setTimeout(finish, 350));
  };
  const up = () => {
    dragging = false;
  };
  area.addEventListener('pointerdown', down);
  area.addEventListener('pointermove', move);
  for (const ev of ['pointerup', 'pointercancel']) area.addEventListener(ev, up);
  area.addEventListener('contextmenu', (e) => e.preventDefault());
  doneBtn.addEventListener('click', () => {
    sfx.click();
    finish();
  });

  const tick = (now: number) => {
    if (finished) return;
    const left = Math.max(0, 1 - (now - t0) / LIMIT);
    fill.style.width = `${left * 100}%`;
    fill.classList.toggle('low', left < 0.3);
    if (now - lastTouch > 2200 && now - lastQuip > 2200) {
      gm.say('angry', pick(RUB_COPY.idle));
      lastQuip = now;
      sfx.warn();
    }
    if (left <= 0) finish();
    else raf = requestAnimationFrame(tick);
  };
  fill.style.width = '100%';
  raf = requestAnimationFrame(tick);
  return () => {
    finished = true;
    cancelAnimationFrame(raf);
    timers.forEach(clearTimeout);
  };
});
