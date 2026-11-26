import { ARROW_COPY, ORDER_COPY, START_BUTTON } from '../../data/copy';
import { CUSTOMERS, getCustomer } from '../../data/customers';
import { art, h, pick } from '../dom';
import { pop } from '../fx';
import { grandma } from '../grandma';
import { arrowsActive, pointAt } from '../guide';
import { sfx } from '../sfx';
import { app, next, register } from '../stage';

register('order', (root) => {
  const c = getCustomer(app.round.customerId) ?? CUSTOMERS[0];
  const gm = grandma(Math.random() < 0.5 ? 'suspicious' : 'proud', pick(ORDER_COPY.momAsides), 'gm-corner');
  const portrait = h('div', { class: 'cust-portrait' }, art(`/assets/customer/${c.id}.png`, c.name, 'cust-img'));
  root.append(
    h('div', { class: 'order' },
      h('p', { class: 'guide' }, ORDER_COPY.stepGuide),
      h('div', { class: 'cust-name burst-tag title-font' }, c.name),
      portrait,
      h('div', { class: 'bubble order-bubble' }, c.order),
      h('div', { class: 'cust-desc' }, c.desc),
      gm.el,
      h('div', { class: `actions${arrowsActive() ? ' arrow-room' : ''}` },
        h('button', {
          class: 'btn btn-red btn-big',
          onclick: () => {
            sfx.click();
            next();
          },
        }, START_BUTTON),
      ),
    ),
  );
  pop(portrait);
  if (arrowsActive()) {
    const screen = root.closest('.screen') as HTMLElement;
    requestAnimationFrame(() => pointAt(screen, screen.querySelector('.actions .btn') as HTMLElement, '.order .btn', ARROW_COPY.start));
  }
});
