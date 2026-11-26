const { chromium } = require('playwright');
const URL = process.env.URL || 'http://127.0.0.1:4174/?debug&mute';
let pass = 0, total = 0;
const check = (ok, name) => { total++; if (ok) pass++; console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`); };

async function run(browser, vp) {
  const w = vp.width;
  const ctx = browser.contexts()[0] || await browser.newContext();
  const page = await ctx.newPage(); await page.setViewportSize(vp);
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|ERR_|fonts/.test(m.text())) errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  const shot = (n) => page.screenshot({ path: `screenshots/k6-${w}-${n}.png` });
  const audit = async (name, btnSel) => {
    const r = await page.evaluate((sel) => {
      const de = document.documentElement;
      const st = document.querySelector('.stage');
      const stage = st.getBoundingClientRect();
      const btns = [...document.querySelectorAll(sel)].map((b) => b.getBoundingClientRect());
      return {
        hscroll: de.scrollWidth > innerWidth || document.body.scrollWidth > innerWidth || st.scrollWidth > st.clientWidth,
        btnsIn: btns.length > 0 && btns.every((b) => b.left >= stage.left - 1 && b.right <= stage.right + 1 && b.top >= stage.top - 1 && b.bottom <= stage.bottom + 1 && b.width >= 44 && b.height >= 44),
        nBtn: btns.length,
        dbg: [de.scrollWidth, innerWidth, document.body.scrollWidth, st.scrollWidth, st.clientWidth].join(','),
      };
    }, btnSel);
    check(!r.hscroll, `${w} ${name} 가로 스크롤 없음${r.hscroll ? ' ' + r.dbg : ''}`);
    check(r.btnsIn, `${w} ${name} 버튼 화면 안·44px 이상 (${r.nBtn}개)`);
    await shot(name);
  };
  const salt = () => page.evaluate(() => window.__kj.get().round.salt);
  await page.goto(URL);
  await page.waitForSelector('.loading');
  await page.waitForTimeout(600);
  await audit('loading', '.loading');
  await page.click('.loading');
  await page.waitForSelector('.title');
  await page.waitForTimeout(700);
  await audit('title', '.title .btn');
  await page.click('.btn-start');
  await page.waitForSelector('.order');
  await page.waitForTimeout(500);
  await audit('order', '.order .btn');
  await page.click('.order .btn');
  await page.waitForSelector('.salt');
  await page.waitForTimeout(400);
  const box = await page.locator('.hold').boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(800);
  const mid = await salt();
  await shot('salt-holding');
  await page.mouse.up();
  const after = await salt();
  await page.waitForTimeout(300);
  const still = await salt();
  check(mid > 0.15 && mid < 0.45, `${w} 소금 누르는 동안 증가 (${mid.toFixed(2)})`);
  check(Math.abs(still - after) < 0.001, `${w} 떼면 멈춤`);
  await page.mouse.down(); await page.waitForTimeout(300); await page.mouse.up();
  const more = await salt();
  check(more > still, `${w} 다시 누르면 더 넣기`);
  await page.mouse.down(); await page.waitForTimeout(1200); await page.mouse.up();
  await page.waitForTimeout(500);
  await audit('salt', '.salt .btn');
  await page.locator('.salt .btn-green').click();
  await page.waitForSelector('.mix');
  await page.waitForTimeout(400);
  for (const id of ['gochugaru', 'garlic', 'sock']) { await page.click(`.cell[data-id=${id}]`); await page.waitForTimeout(700); }
  let n = await page.evaluate(() => window.__kj.get().round.ingredients.length);
  check(n === 3, `${w} 재료 3개 담김 (${n})`);
  await page.locator('.slot.full').first().click();
  n = await page.evaluate(() => window.__kj.get().round.ingredients.length);
  check(n === 2, `${w} 1개 뺌 (${n})`);
  for (const id of ['ginger', 'radish', 'pear', 'sugar', 'oyster']) { await page.click(`.cell[data-id=${id}]`); await page.waitForTimeout(650); }
  n = await page.evaluate(() => window.__kj.get().round.ingredients.length);
  check(n === 6, `${w} 6개 제한 (${n})`);
  check(await page.evaluate(() => document.querySelector('.shelf').classList.contains('locked')), `${w} 선반 잠김 표시`);
  await page.waitForTimeout(500);
  await audit('mix', '.mix .actions .btn, .slot.full');
  await page.locator('.mix .actions .btn').click();
  await page.waitForSelector('.screen-rub');
  const ph = await page.evaluate(() => window.__kj.get().round.phase);
  check(ph === 'rub', `${w} 다음 화면으로 (${ph})`);
  const R = () => page.evaluate(() => window.__kj.get().round);
  // ---- 정상 한 판 ----
  await page.evaluate(() => { localStorage.clear(); });
  await page.reload();
  await page.waitForSelector('.loading'); await page.click('.loading'); await page.waitForSelector('.title');
  await page.click('.btn-start'); await page.waitForSelector('.order'); await page.click('.order .btn');
  await page.waitForSelector('.salt');
  const hb = await page.locator('.hold').boundingBox();
  await page.mouse.move(hb.x + hb.width / 2, hb.y + hb.height / 2); await page.mouse.down(); await page.waitForTimeout(1700); await page.mouse.up();
  await page.locator('.salt .btn-green').click(); await page.waitForSelector('.mix');
  for (const id of ['gochugaru', 'garlic', 'ginger', 'radish', 'pear']) { await page.click(`.cell[data-id=${id}]`); await page.waitForTimeout(150); }
  await page.locator('.mix .actions .btn').click();
  await page.waitForSelector('.rub');
  await page.waitForTimeout(400);
  await audit('rub-start', '.rub .btn');
  const cb = await page.locator('.rub-cabbage').boundingBox();
  await page.mouse.move(cb.x + cb.width * 0.1, cb.y + cb.height * 0.2);
  await page.mouse.down();
  await page.mouse.move(cb.x + cb.width * 0.9, cb.y + cb.height * 0.3, { steps: 8 });
  await page.mouse.move(cb.x + cb.width * 0.1, cb.y + cb.height * 0.5, { steps: 8 });
  const r1 = (await R()).rub;
  await shot('rub');
  check(r1 > 0.05, `${w} 문지르면 진행도 증가 (${r1.toFixed(2)})`);
  await page.mouse.move(cb.x + cb.width * 0.9, cb.y + cb.height * 0.7, { steps: 8 });
  await page.mouse.move(cb.x + cb.width * 0.1, cb.y + cb.height * 0.85, { steps: 8 });
  await page.mouse.move(cb.x + cb.width * 0.9, cb.y + cb.height * 0.2, { steps: 8 });
  await page.mouse.move(cb.x + cb.width * 0.1, cb.y + cb.height * 0.7, { steps: 8 });
  await page.mouse.move(cb.x + cb.width * 0.9, cb.y + cb.height * 0.5, { steps: 8 });
  await page.mouse.up();
  const r2 = (await R()).rub;
  check(r2 > r1 && r2 > 0.5, `${w} 계속 문지르면 더 올라감 (${r2.toFixed(2)})`);
  const tf = await page.evaluate(() => parseFloat(document.querySelector('.time-fill').style.width));
  check(tf < 100 && tf > 0, `${w} 남은 시간 막대 줄어듦 (${tf.toFixed(0)}%)`);
  await audit('rub-end', '.rub .btn');
  await page.locator('.rub .btn-green').click();
  await page.waitForSelector('.age');
  await page.waitForTimeout(2000);
  const ag = (await R()).aging;
  check(ag > 0.15 && ag < 0.5, `${w} 숙성 값 저절로 오름 (${ag.toFixed(2)})`);
  await audit('age', '.age .btn');
  const before = await page.evaluate(() => Object.keys(window.__kj.get().save.endings).length);
  await page.locator('.age .btn-red').click();
  await page.waitForSelector('.result');
  const frozen = (await R()).aging;
  check(frozen > 0.15 && frozen < 0.55, `${w} 꺼낸 순간의 숙성 값 (${frozen.toFixed(2)})`);
  check(await page.evaluate(() => !!document.querySelector('.res-scene')), `${w} 판정 뜸 들이기 연출`);
  await page.waitForTimeout(5200);
  const info = await page.evaluate(() => {
    const r = window.__kj.get().round.result;
    const q = (s) => document.querySelector(s);
    return { score: r.score, grade: r.grade, id: r.ending.id, title: r.ending.title, shownTitle: q('.res-title').textContent, num: q('.score-num').textContent, letter: q('.stamp-letter').textContent, stamped: !!q('.stamp.stamped'), scene: !!q('.res-scene'), sticker: !!q('.sticker-new') };
  });
  check(!info.scene && info.shownTitle === info.title && info.title.length > 0, `${w} 결말 제목 표시 (${info.title})`);
  check(info.num === String(info.score) && info.letter === info.grade && info.stamped, `${w} 점수·등급 도장 (${info.score}점 ${info.grade})`);
  check(info.sticker, `${w} 새 결말 딱지`);
  await audit('result', '.result .btn');
  const nAfter = await page.evaluate(() => Object.keys(window.__kj.get().save.endings).length);
  check(nAfter === before + 1, `${w} 결말 저장 (${before}→${nAfter})`);
  await page.locator('.res-book').click();
  await page.waitForSelector('.book');
  await page.waitForTimeout(400);
  const cnt = await page.textContent('.book-count');
  check(cnt === `${nAfter}/36`, `${w} 도감 N/36 (${cnt})`);
  check(await page.locator('.bcell').count() === 36, `${w} 도감 36칸`);
  check(await page.locator(`.bcell.seen[data-id=${info.id}]`).count() === 1, `${w} 방금 결말이 도감에 등록`);
  await audit('book', '.book .btn');
  await page.locator(`.bcell[data-id=${info.id}]`).click();
  await page.waitForSelector('.book-detail');
  await page.waitForTimeout(500);
  const bd = await page.textContent('.book-detail');
  check(bd.includes(info.title), `${w} 도감 상세`);
  await shot('book-detail');
  await page.locator('.bd-close').click();
  await page.locator('.bcell:not(.seen)').first().click();
  check((await page.textContent('.book-detail')).includes('???'), `${w} 못 모은 칸 상세는 ???`);
  await page.locator('.bd-close').click();
  await page.locator('.book-back').click();
  await page.waitForSelector('.result');
  check(await page.evaluate(() => !document.querySelector('.res-scene')), `${w} 돌아가기로 판정 화면 복귀`);
  await page.locator('.res-again').click();
  await page.waitForSelector('.order');
  check((await R()).phase === 'order', `${w} 한 판 더로 주문 화면`);
  // ---- 건전지 판 (안 문지르고 통과) ----
  await page.click('.order .btn'); await page.waitForSelector('.salt');
  await page.locator('.salt .btn-green').click(); await page.waitForSelector('.mix');
  await page.evaluate(() => window.__kj.set({ ingredients: ['gochugaru', 'battery'] }));
  await page.waitForSelector('.mix');
  await page.locator('.mix .actions .btn').click();
  await page.locator('.rub').waitFor();
  await page.waitForTimeout(300);
  await page.locator('.rub .btn-green').click();
  await page.waitForSelector('.age');
  await page.waitForTimeout(500);
  await page.locator('.age .btn-red').click();
  await page.waitForSelector('.result');
  await page.waitForTimeout(300);
  await page.click('.res-scene');
  await page.waitForTimeout(900);
  const bat = await page.evaluate(() => ({ id: window.__kj.get().round.result.ending.id, rub: window.__kj.get().round.rub }));
  check(bat.id === 'battery' && bat.rub === 0, `${w} 안 문질러도 진행, 건전지 결말 (${bat.id})`);
  await audit('result-battery', '.result .btn');
  // ---- 긴 본문 ----
  await page.evaluate(() => { const r = window.__kj.get().round.result; window.__kj.set({ phase: 'result', result: { ...r, ending: { ...r.ending, title: r.ending.title + ' 그리고 아주 긴 제목이 이어진다', body: r.ending.body.repeat(5) } } }); });
  await page.waitForSelector('.result');
  await page.click('.res-scene');
  await page.waitForTimeout(700);
  const small = w < 600 ? { width: 390, height: 667 } : vp;
  await page.setViewportSize(small);
  await page.waitForTimeout(300);
  await audit('result-long', '.result .btn');
  await page.setViewportSize(vp);
  check(errors.length === 0, `${w} 콘솔 오류 없음${errors.length ? ' ' + errors[0] : ''}`);
  await page.close();
}


const fs = require('fs');
const judgeSrc = fs.readFileSync(require('path').join(__dirname, '../src/logic/judge.ts'), 'utf8');
const num = (re) => parseFloat(judgeSrc.match(re)[1]);
const GUIDE_URL = URL.replace(/\?debug/, '?debug&guide');

async function guideFlow(browser, vp) {
  const w = vp.width;
  const ctx = await browser.newContext({ viewport: vp });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|ERR_|fonts/.test(m.text())) errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  const shot = (n) => page.screenshot({ path: `screenshots/k6-${w}-${n}.png` });
  const toTitle = async (url) => {
    await page.goto(url);
    await page.waitForSelector('.loading'); await page.click('.loading'); await page.waitForSelector('.title');
    await page.waitForTimeout(500);
  };
  const guideLine = async (name) => {
    const g = await page.evaluate(() => { const e = document.querySelector('.screen .guide'); if (!e) return null; const r = e.getBoundingClientRect(); return { h: r.height, vis: r.height > 0 && r.top >= 0 && r.bottom <= innerHeight, t: e.textContent }; });
    check(!!g && g.vis && g.t.length > 8 && (w > 600 || g.h <= 74), `${w} ${name} 지금 할 일 한 줄 보임 (${g ? Math.round(g.h) + 'px' : '없음'})`);
  };
  const arrow = async (timeout = 6000) => {
    const el = await page.waitForSelector('.guide-arrow', { timeout });
    const sel = await el.getAttribute('data-points');
    const r = await page.evaluate((sel) => {
      const a = document.querySelector('.guide-arrow').getBoundingClientRect();
      const t = document.querySelector(sel).getBoundingClientRect();
      return { ok: a.bottom >= t.top - 12 && a.bottom <= t.bottom + 2 && Math.abs((a.left + a.right) / 2 - (t.left + t.right) / 2) <= t.width / 2 + 70, a: [a.left, a.top, a.right, a.bottom].map(Math.round).join(','), t: [t.left, t.top, t.right, t.bottom].map(Math.round).join(',') };
    }, sel);
    return { sel, ...r };
  };
  const phase = () => page.evaluate(() => window.__kj.get().screen);

  // ---- 게임 방법 창 열고 닫기 (안내 꺼진 ?debug) ----
  await toTitle(URL);
  await page.click('.btn-howto');
  await page.waitForSelector('.howto');
  await page.waitForTimeout(300);
  const hw = await page.evaluate(() => {
    const st = document.querySelector('.stage').getBoundingClientRect();
    const win = document.querySelector('.howto-win');
    const r = win.getBoundingClientRect();
    const btn = document.querySelector('.howto-go').getBoundingClientRect();
    const list = document.querySelector('.howto-list');
    return { rows: document.querySelectorAll('.howto-row').length, imgs: [...document.querySelectorAll('.howto-img')].every((i) => i.tagName === 'IMG' && i.naturalWidth > 0), inside: r.left >= st.left && r.right <= st.right && r.top >= st.top && r.bottom <= st.bottom, noScroll: win.scrollHeight <= win.clientHeight + 1 && list.scrollHeight <= list.clientHeight + 1, btnOk: btn.height >= 44 && btn.bottom <= st.bottom, label: document.querySelector('.howto-go').textContent };
  });
  check(hw.rows === 6 && hw.imgs, `${w} 게임 방법 6단계·그림 (${hw.rows})`);
  check(hw.inside && hw.noScroll && hw.btnOk, `${w} 게임 방법 창이 스크롤 없이 들어옴`);
  await shot('howto');
  await page.click('.howto-go');
  check(await page.locator('.howto').count() === 0, `${w} 게임 방법 닫기 (${hw.label})`);
  await page.click('.btn-howto'); await page.waitForSelector('.howto'); await page.click('.howto-x');
  check(await page.locator('.howto').count() === 0, `${w} 게임 방법 X로 닫기`);
  await page.click('.btn-howto'); await page.waitForSelector('.howto'); await page.keyboard.press('Escape');
  check(await page.locator('.howto').count() === 0, `${w} 게임 방법 Esc로 닫기`);
  await page.click('.btn-start'); await page.waitForSelector('.order');
  check(await page.locator('.howto, .guide-arrow').count() === 0, `${w} ?debug에서는 START가 바로 시작, 안내·화살표 없음`);

  // ---- 첫 방문 ----
  await toTitle(GUIDE_URL);
  await page.evaluate(() => window.__kj.guideReset());
  await page.click('.btn-start');
  await page.waitForSelector('.howto');
  check(await page.locator('.order').count() === 0 && (await page.textContent('.howto-go')) === '알았다, 시작', `${w} 첫 START는 안내 창 먼저`);
  await page.click('.howto-go');
  await page.waitForSelector('.order'); await page.waitForTimeout(500);
  await guideLine('order');
  let a = await arrow();
  check(a.sel === '.order .btn' && a.ok, `${w} order 화살표가 진행 버튼을 가리킴 (${a.a} → ${a.t})`);
  await shot('first-order');
  await page.click(a.sel);
  await page.waitForSelector('.salt'); await page.waitForTimeout(500);
  await guideLine('salt');
  const zs = await page.evaluate(() => { const b = document.querySelector('.zone-band'); const g = document.querySelector('.gauge').getBoundingClientRect(); const r = b.getBoundingClientRect(); return { lo: +b.dataset.lo, hi: +b.dataset.hi, l: (r.left - g.left) / g.width, rr: (r.right - g.left) / g.width, tag: document.querySelector('.zone-tag').textContent }; });
  const sLo = num(/salt < ([\d.]+)\) return 'light'/), sHi = num(/salt <= ([\d.]+)\) return 'good'/);
  check(Math.abs(zs.lo - sLo) < 0.005 && Math.abs(zs.hi - sHi) < 0.005, `${w} 절이기 목표 구간이 judge.ts와 같음 (${zs.lo}~${zs.hi} / ${sLo}~${sHi})`);
  check(Math.abs(zs.l - sLo) < 0.04 && Math.abs(zs.rr - sHi) < 0.04, `${w} 절이기 색 띠가 그 위치에 그려짐 (${zs.l.toFixed(2)}~${zs.rr.toFixed(2)})`);
  await shot('first-salt');
  let doneSalt = false;
  for (let i = 0; i < 9 && !doneSalt; i++) {
    a = await arrow();
    check(a.ok, `${w} salt 화살표 위치 (${a.sel})`);
    if (a.sel === '.hold') {
      const b = await page.locator('.hold').boundingBox();
      await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down();
      await page.waitForTimeout(500);
      if (i === 0) check(await page.locator('.guide-arrow').count() === 0, `${w} 누르면 화살표가 사라짐`);
      await page.mouse.up(); await page.waitForTimeout(150);
    } else { await shot('first-salt-done'); await page.click(a.sel); doneSalt = true; }
  }
  check(doneSalt, `${w} salt 화살표를 따라 절이기를 마침`);
  await page.waitForSelector('.mix'); await page.waitForTimeout(500);
  await guideLine('mix');
  const mx = await page.evaluate(() => {
    const sh = document.querySelector('.shelf'); const more = document.querySelector('.shelf-more');
    const wants = [...document.querySelectorAll('.fbar-want')].map((e) => +e.dataset.want);
    return { strip: document.querySelector('.want-strip').textContent, wants: wants.length, ticksIn: [...document.querySelectorAll('.fbar-want')].every((e) => { const t = e.parentElement.getBoundingClientRect(), r = e.getBoundingClientRect(); return r.left >= t.left - 4 && r.right <= t.right + 4; }), over: sh.scrollHeight > sh.clientHeight + 2, moreVisible: !more.hidden };
  });
  check(mx.strip.length > 12 && mx.wants === 6 && mx.ticksIn, `${w} 양념 화면에 손님 주문·원한 맛 눈금 6개`);
  if (mx.over) {
    check(mx.moreVisible, `${w} 선반이 넘치면 "더 있다" 표시`);
    await page.evaluate(() => { const s = document.querySelector('.shelf'); s.scrollTop = s.scrollHeight; s.dispatchEvent(new Event('scroll')); });
    check(await page.evaluate(() => document.querySelector('.shelf-more').hidden), `${w} 끝까지 내리면 표시가 사라짐`);
    await page.evaluate(() => { document.querySelector('.shelf').scrollTop = 0; document.querySelector('.shelf').dispatchEvent(new Event('scroll')); });
  }
  await shot('first-mix');
  a = await arrow();
  check(a.sel === '.cell[data-id=gochugaru]' && a.ok, `${w} mix 화살표가 고춧가루를 가리킴 (${a.a} → ${a.t})`);
  await page.click(a.sel); await page.waitForTimeout(900);
  a = await arrow();
  check(a.sel === '.mix .actions .btn' && a.ok, `${w} 고춧가루를 넣으면 화살표가 다음 버튼으로 (${a.sel})`);
  await shot('first-mix2');
  await page.click(a.sel);
  await page.waitForSelector('.rub'); await page.waitForTimeout(500);
  await guideLine('rub');
  a = await arrow();
  check(a.sel === '.rub-cabbage' && a.ok, `${w} rub 화살표가 배추를 가리킴 (${a.a} → ${a.t})`);
  await shot('first-rub');
  let rubDone = false;
  for (let i = 0; i < 10 && !rubDone; i++) {
    if ((await phase()) !== 'rub') { rubDone = true; break; }
    a = await arrow().catch(() => null);
    if (!a) { rubDone = (await phase()) !== 'rub'; break; }
    if (a.sel === '.rub-cabbage') {
      const cb = await page.locator('.rub-cabbage').boundingBox();
      await page.mouse.move(cb.x + cb.width * 0.1, cb.y + cb.height * 0.2); await page.mouse.down();
      for (const [fx, fy] of [[0.9, 0.2], [0.1, 0.4], [0.9, 0.6], [0.1, 0.8], [0.9, 0.9]]) await page.mouse.move(cb.x + cb.width * fx, cb.y + cb.height * fy, { steps: 6 });
      await page.mouse.up();
      if (i === 0) check(await page.locator('.guide-arrow[data-points=".rub-cabbage"]').count() === 0, `${w} 문지르기 시작하면 배추 화살표가 사라짐`);
    } else { check(a.ok, `${w} rub 화살표가 완료 버튼을 가리킴`); await page.click(a.sel); rubDone = true; }
  }
  check(rubDone, `${w} rub 화살표를 따라 버무리기를 마침`);
  await page.waitForSelector('.age'); await page.waitForTimeout(300);
  await guideLine('age');
  const as = await page.evaluate(() => { const b = document.querySelector('.zone-band'); return { lo: +b.dataset.lo, hi: +b.dataset.hi }; });
  const aLo = num(/aging < ([\d.]+)\) return 'fresh'/), aHi = num(/aging < ([\d.]+)\) return 'right'/);
  check(Math.abs(as.lo - aLo) < 0.005 && Math.abs(as.hi - aHi) < 0.005, `${w} 숙성 목표 구간이 judge.ts와 같음 (${as.lo}~${as.hi} / ${aLo}~${aHi})`);
  a = await arrow(9000);
  check(a.sel === '.age .btn-red' && a.ok, `${w} age 화살표가 꺼내기 버튼을 가리킴 (${a.a} → ${a.t})`);
  const agNow = await page.evaluate(() => window.__kj.get().round.aging);
  check(agNow >= aLo - 0.02 && agNow <= aHi + 0.02, `${w} 화살표는 목표 구간에서 뜸 (${agNow.toFixed(2)})`);
  await shot('first-age');
  await page.click(a.sel);
  await page.waitForSelector('.result');
  a = await arrow(9000);
  check(a.sel === '.res-again' && a.ok, `${w} result 화살표가 한 판 더를 가리킴 (${a.a} → ${a.t})`);
  check((await page.textContent('.res-remix')).includes('36'), `${w} 판정에 "36가지" 한 줄`);
  await page.waitForTimeout(300);
  await shot('first-result');
  check(await page.evaluate(() => !!localStorage.getItem('kimjang:guide') && JSON.parse(localStorage.getItem('kimjang:guide')).shown === true), `${w} kimjang:guide에 기록`);
  await page.click(a.sel);
  await page.waitForSelector('.order'); await page.waitForTimeout(400);
  check(await page.locator('.guide-arrow, .howto').count() === 0, `${w} 두 번째 판에는 안내·화살표 없음`);

  // ---- 아무것도 안 하는 판: 진행 버튼만으로 끝까지 ----
  await page.click('.order .btn'); await page.waitForSelector('.salt');
  await page.click('.salt .btn-green'); await page.waitForSelector('.mix');
  await page.click('.mix .actions .btn'); await page.waitForSelector('.rub');
  await page.click('.rub .btn-green'); await page.waitForSelector('.age');
  await page.waitForSelector('.result', { timeout: 12000 });
  check(true, `${w} 가만히 있어도 숙성이 끝나면 판정으로 (재료 0개)`);
  await page.waitForTimeout(3500);
  check(await page.locator('.res-again').isVisible(), `${w} 판정에서 한 판 더 버튼이 눌림`);

  // ---- 새로 고친 뒤에도 안 나옴 ----
  await toTitle(GUIDE_URL);
  await page.click('.btn-start');
  await page.waitForSelector('.order'); await page.waitForTimeout(400);
  check(await page.locator('.guide-arrow, .howto').count() === 0, `${w} 다시 접속해도 안내·화살표 없음`);
  check(errors.length === 0, `${w} 안내 흐름 콘솔 오류 없음${errors.length ? ' ' + errors[0] : ''}`);
  await ctx.close();
}

async function title2x(browser) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(URL);
  await page.waitForSelector('.loading'); await page.click('.loading'); await page.waitForSelector('.title');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(900);
  await page.screenshot({ path: 'screenshots/k6-390-title@2x.png' });
  const t = await page.evaluate(() => { const e = document.querySelector('.title-name, .title-logo'); const r = e.getBoundingClientRect(); const s = document.querySelector('.stage').getBoundingClientRect(); const b = document.querySelector('.title-art .burst').getBoundingClientRect(); const a = document.querySelector('.title-art').getBoundingClientRect(); return { fit: r.left >= s.left && r.right <= s.right && e.scrollWidth <= e.clientWidth + 1, lines: e.tagName === 'IMG' ? 1 : Math.round(r.height / parseFloat(getComputedStyle(e).lineHeight)), burstIn: b.left >= a.left && b.right <= a.right && b.top >= a.top && b.bottom <= a.bottom }; });
  check(t.fit && t.lines === 1, `390 타이틀 제목 한 줄·폭 안 (${t.lines}줄)`);
  check(t.burstIn, '390 since 어제 딱지가 그림 틀 안');
  await ctx.close();
}

(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  try {
    await title2x(browser);
    for (const vp of [{ width: 390, height: 844 }, { width: 1280, height: 800 }]) { await run(browser, vp); await guideFlow(browser, vp); }
  } catch (e) { check(false, `예외 ${e.message.split('\n')[0]}`); }
  console.log(`${pass}/${total} 통과`);
  process.exit(pass === total ? 0 : 1);
})();
