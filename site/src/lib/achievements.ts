'use client';
import { isEmbed } from '@/lib/embed';
// Owner (orig. message): "inside your bench add achievements for exploring the website, medals in a cool way, and a part
// of Samsoom that trains you: it takes you there for real and you earn achievements from those". Professional, not toys.
// Medals are kept on this device (and travel with the account once the database stores them). Unlocking one fires
// 'se:medal' so the toast and the Bench update at once.
export type Tier = 'bronze' | 'silver' | 'gold';
export type Medal = { id: string; t: string; d: string; tier: Tier; group: 'explore' | 'train' | 'shop' | 'bench'; path?: string };
export type Lesson = { id: string; t: string; d: string; path: string; min: string };

// Samsoom's lessons: he opens the real page and walks you through its real buttons, one at a time
export const LESSONS: Lesson[] = [
  { id: 'shop', t: 'Find any part fast', d: 'Search, your devices, deals and the filters that narrow every grade.', path: '/shop', min: '40 s' },
  { id: 'bench', t: 'Your bench in a minute', d: 'Orders, points, your card, companies and settings.', path: '/account', min: '45 s' },
  { id: 'repair', t: 'Book a repair', d: 'Pick your phone, see the price, print your work order.', path: '/repair', min: '30 s' },
  { id: 'trade', t: 'Get trade prices', d: 'What a trade account gives you and how to apply.', path: '/wholesale', min: '30 s' },
  { id: 'card', t: 'Your membership card', d: 'Points, levels and what each card unlocks.', path: '/membership', min: '30 s' },
  { id: 'home', t: 'The whole site', d: 'The bar on top, Find My Part, language, help and me.', path: '/', min: '25 s' },
];

const PAGES: [string, string][] = [['/shop', 'Shop'], ['/repair', 'Repair Lab'], ['/wholesale', 'Wholesale'], ['/worldwide', 'Worldwide'], ['/story', 'Our story'], ['/membership', 'Sam Circuit'], ['/brands', 'Brands'], ['/samsoom', 'Ask Samsoom'], ['/contact', 'Contact']];

export const MEDALS: Medal[] = [
  // exploring
  { id: 'first-visit', t: 'Through the door', d: 'Opened your bench for the first time.', tier: 'bronze', group: 'explore', path: '/account' },
  ...PAGES.map(([p, n]) => ({ id: 'visit' + p.replace('/', '-'), t: n, d: 'Visited this page.', tier: 'bronze' as Tier, group: 'explore' as const, path: p })),
  { id: 'explorer', t: 'Explorer', d: 'Visited every page of the site.', tier: 'gold', group: 'explore' },
  { id: 'polyglot', t: 'Polyglot', d: 'Changed the language.', tier: 'bronze', group: 'explore' },
  { id: 'teardown', t: 'Inside the phone', d: 'Watched the teardown on Home to the end.', tier: 'silver', group: 'explore', path: '/#teardown' },
  // shopping
  { id: 'fmp', t: 'Part hunter', d: 'Used Find My Part.', tier: 'bronze', group: 'shop' },
  { id: 'cart', t: 'First pick', d: 'Put a part in your cart.', tier: 'bronze', group: 'shop', path: '/shop' },
  { id: 'star', t: 'Collector', d: 'Starred a part.', tier: 'bronze', group: 'shop', path: '/shop' },
  { id: 'order', t: 'First order', d: 'Placed your first order.', tier: 'silver', group: 'shop', path: '/shop' },
  { id: 'chat', t: 'Hello, Samsoom', d: 'Chatted with Samsoom.', tier: 'bronze', group: 'shop', path: '/samsoom' },
  { id: 'contact', t: 'On first-name terms', d: 'Messaged the team on WhatsApp or WeChat.', tier: 'bronze', group: 'shop', path: '/contact' },
  // the bench
  { id: 'avatar', t: 'Face on the bench', d: 'Added your photo.', tier: 'bronze', group: 'bench', path: '/account#overview' },
  { id: 'card', t: 'Card holder', d: 'Connected a Sam membership card.', tier: 'silver', group: 'bench', path: '/account#points' },
  { id: 'company', t: 'In business', d: 'Added your company.', tier: 'silver', group: 'bench', path: '/account#companies' },
  { id: 'device', t: 'My fleet', d: 'Saved a device you fix.', tier: 'bronze', group: 'bench', path: '/account#devices' },
  // Samsoom's training
  ...LESSONS.map((l) => ({ id: 'lesson-' + l.id, t: l.t, d: 'Finished Samsoom’s lesson.', tier: 'silver' as Tier, group: 'train' as const, path: l.path })),
  { id: 'graduate', t: 'Samsoom graduate', d: 'Finished every lesson.', tier: 'gold', group: 'train' },
];

const KEY = 'se-medals';
export const got = (): Record<string, number> => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } };
export function unlock(id: string) {
  if (isEmbed()) return;
  if (typeof window === 'undefined' || !MEDALS.some((m) => m.id === id)) return;
  const g = got(); if (g[id]) return;
  g[id] = Date.now();
  // the big ones follow from the small ones
  const extra: string[] = [];
  if (!g.explorer && PAGES.every(([p]) => g['visit' + p.replace('/', '-')])) { g.explorer = Date.now(); extra.push('explorer'); }
  if (!g.graduate && LESSONS.every((l) => g['lesson-' + l.id])) { g.graduate = Date.now(); extra.push('graduate'); }
  try { localStorage.setItem(KEY, JSON.stringify(g)); } catch { /* private mode: nothing kept */ }
  [id, ...extra].forEach((x, k) => window.setTimeout(() => window.dispatchEvent(new CustomEvent('se:medal', { detail: x })), k * 2600));
}
export const visitMedal = (path: string) => { const p = PAGES.find(([x]) => path === x || path.startsWith(x + '/')); if (p) unlock('visit' + p[0].replace('/', '-')); };
export const startLesson = (id: string) => { const l = LESSONS.find((x) => x.id === id); if (l) location.href = l.path + (l.path.includes('?') ? '&' : '?') + 'lesson=' + id; };
