const KEY = 'kimjang:mute';
const forced = typeof location !== 'undefined' && /[?&]mute\b/.test(location.search);
let muted = forced;
try {
  if (!forced) muted = localStorage.getItem(KEY) === '1';
} catch {
  /* 저장 불가 */
}
let ac: AudioContext | null = null;

export const isMuted = () => muted;
export const isForcedMute = () => forced;
export function setMuted(v: boolean) {
  muted = forced || v;
  try {
    localStorage.setItem(KEY, muted ? '1' : '0');
  } catch {
    /* 저장 불가 */
  }
}

function tone(freq: number, dur: number, type: OscillatorType, vol: number, slideTo?: number, delay = 0) {
  if (muted) return;
  try {
    ac ??= new AudioContext();
    if (ac.state === 'suspended') void ac.resume();
    const t = ac.currentTime + delay;
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(ac.destination);
    o.start(t);
    o.stop(t + dur + 0.02);
  } catch {
    /* 오디오 불가 */
  }
}

let lastGrain = 0;
export const sfx = {
  click: () => {
    tone(660, 0.08, 'square', 0.12, 990);
  },
  salt: () => {
    const n = performance.now();
    if (n - lastGrain < 70) return;
    lastGrain = n;
    tone(1800 + Math.random() * 900, 0.03, 'square', 0.05);
  },
  rub: () => {
    const n = performance.now();
    if (n - lastGrain < 55) return;
    lastGrain = n;
    tone(110 + Math.random() * 90, 0.05, 'square', 0.06);
  },
  tick: () => {
    tone(1200, 0.03, 'square', 0.05);
  },
  bang: () => {
    tone(160, 0.3, 'sawtooth', 0.22, 40);
    tone(900, 0.08, 'square', 0.12, 200);
  },
  stamp: () => {
    tone(90, 0.18, 'square', 0.25, 40);
  },
  pong: () => {
    tone(520, 0.16, 'sine', 0.22, 180);
  },
  warn: () => {
    tone(240, 0.12, 'sawtooth', 0.12, undefined);
    tone(240, 0.12, 'sawtooth', 0.12, undefined, 0.16);
  },
  good: () => {
    tone(523, 0.1, 'square', 0.1);
    tone(784, 0.14, 'square', 0.1, undefined, 0.1);
  },
};
