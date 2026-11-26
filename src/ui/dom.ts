type Kid = Node | string | null | false | undefined;

export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props?: Record<string, unknown> | null,
  ...kids: Kid[]
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props ?? {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = String(v);
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v as EventListener);
    else el.setAttribute(k, String(v));
  }
  for (const kid of kids) if (kid) el.append(kid);
  return el;
}

/** 하위 경로 배포에서도 맞도록 절대 경로 앞에 base를 붙인다. */
export const asset = (path: string): string => import.meta.env.BASE_URL + path.replace(/^\//, '');

/** 그림 파일이 없으면 이름 글자가 든 색 칸으로 대체한다. */
export function art(src: string, label: string, cls = ''): HTMLElement {
  const img = h('img', { class: `art ${cls}`, src: asset(src), alt: label, draggable: 'false' });
  img.addEventListener('error', () => {
    img.replaceWith(h('div', { class: `art ph ${cls}`, role: 'img', 'aria-label': label }, label));
  });
  return img;
}

export const rect = (el: Element, root: Element) => {
  const a = el.getBoundingClientRect();
  const b = root.getBoundingClientRect();
  return { x: a.left - b.left, y: a.top - b.top, w: a.width, h: a.height };
};

export const pick = <T>(arr: readonly T[], rng: () => number = Math.random): T =>
  arr[Math.min(arr.length - 1, Math.floor(rng() * arr.length))];
