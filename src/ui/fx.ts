export function pop(el: Element, scale = 1.25) {
  el.animate(
    [{ transform: 'scale(0.6)' }, { transform: `scale(${scale})` }, { transform: 'scale(0.92)' }, { transform: 'scale(1)' }],
    { duration: 360, easing: 'steps(4, jump-none)' },
  );
}

export function shake(el: Element) {
  el.animate(
    [
      { transform: 'translateX(0) rotate(0)' },
      { transform: 'translateX(-6px) rotate(-3deg)' },
      { transform: 'translateX(6px) rotate(3deg)' },
      { transform: 'translateX(-4px) rotate(-2deg)' },
      { transform: 'translateX(0) rotate(0)' },
    ],
    { duration: 320, easing: 'steps(1)' },
  );
}

const COLORS = ['#ff3300', '#ffcc00', '#33cc33', '#0066cc'];

export function sparks(root: HTMLElement, x: number, y: number, n = 8) {
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span');
    s.className = 'spark';
    s.style.left = `${x}px`;
    s.style.top = `${y}px`;
    s.style.background = COLORS[i % COLORS.length];
    root.append(s);
    const a = (Math.PI * 2 * i) / n;
    const d = 28 + Math.random() * 22;
    s.animate(
      [
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: `translate(${Math.cos(a) * d}px, ${Math.sin(a) * d}px) scale(0.3)`, opacity: 0 },
      ],
      { duration: 480, easing: 'steps(4, jump-none)' },
    ).onfinish = () => s.remove();
  }
}

/** 소금 알갱이 하나를 떨어뜨린다. */
export function grain(root: HTMLElement, x: number, y: number, fall: number) {
  const s = document.createElement('span');
  s.className = 'grain';
  const dx = (Math.random() - 0.5) * 36;
  s.style.left = `${x + (Math.random() - 0.5) * 24}px`;
  s.style.top = `${y}px`;
  root.append(s);
  s.animate(
    [
      { transform: 'translate(0,0)', opacity: 1 },
      { transform: `translate(${dx}px, ${fall}px)`, opacity: 0.2 },
    ],
    { duration: 520 + Math.random() * 200, easing: 'steps(5, jump-none)' },
  ).onfinish = () => s.remove();
}

/** node를 from → to로 포물선으로 날린다(좌표는 root 기준 중심점). */
export function fly(
  root: HTMLElement,
  node: HTMLElement,
  from: { x: number; y: number },
  to: { x: number; y: number },
  done: () => void,
) {
  node.classList.add('flyer');
  root.append(node);
  const lift = 90;
  const frames: Keyframe[] = [];
  const N = 12;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const x = from.x + (to.x - from.x) * t;
    const y = from.y + (to.y - from.y) * t - 4 * lift * t * (1 - t);
    frames.push({ transform: `translate(${x}px, ${y}px) translate(-50%,-50%) rotate(${t * 300}deg) scale(${1 - t * 0.35})` });
  }
  node.animate(frames, { duration: 520, easing: 'linear' }).onfinish = () => {
    node.remove();
    done();
  };
}

const RED = ['#ff3300', '#cc0000', '#ff3300', '#ff6600'];
/** 양념 튀는 네모 입자. */
export function splat(root: HTMLElement, x: number, y: number, n = 4) {
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span');
    s.className = 'spark splat';
    s.style.left = `${x}px`;
    s.style.top = `${y}px`;
    s.style.background = RED[i % RED.length];
    const size = 5 + Math.random() * 6;
    s.style.width = s.style.height = `${size}px`;
    root.append(s);
    const a = Math.random() * Math.PI * 2;
    const d = 20 + Math.random() * 36;
    s.animate(
      [
        { transform: 'translate(0,0) rotate(0)', opacity: 1 },
        { transform: `translate(${Math.cos(a) * d}px, ${Math.sin(a) * d - 14}px) rotate(${Math.random() * 180}deg)`, opacity: 0 },
      ],
      { duration: 420 + Math.random() * 160, easing: 'steps(4, jump-none)' },
    ).onfinish = () => s.remove();
  }
}
