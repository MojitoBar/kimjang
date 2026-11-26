import { FACE_LABEL } from '../data/copy';
import type { Face } from '../logic/types';
import { art, h } from './dom';
import { pop } from './fx';

/** 김쳠례 여사: 표정 그림 + 말풍선. say()로 표정과 한마디를 바꾼다. */
export function grandma(face: Face, line: string, cls = '') {
  const portrait = h('div', { class: 'gm-portrait' });
  const bubble = h('div', { class: 'bubble gm-bubble' });
  const el = h('div', { class: `grandma ${cls}` }, portrait, bubble);
  const set = (f: Face, text: string) => {
    portrait.replaceChildren(art(`/assets/grandma/${f}.png`, `김쳠례 ${FACE_LABEL[f]}`));
    bubble.textContent = text;
    el.dataset.face = f;
    pop(bubble, 1.1);
  };
  set(face, line);
  return { el, say: set };
}
