'use client';
// R9 · the visitor's own settings on this device, in one place: cookie choices (with friendly names), sound effects and
// the display currency. Stored in localStorage ('se-prefs'); every change fires 'se:prefs'.
//   Core Circuit  · needed for the cart, language and sign-in (always on)
//   Memory Chip   · remembers preferences, saved and recent searches, recently viewed parts
//   Signal Meter  · anonymous visit counts (only once an analytics tool is connected)
//   Booster       · offers and ads that match what you look at
export type Currency = 'AED' | 'USD' | 'EUR';
export type Pack = 'classic' | 'soft' | 'studio';
export type Voice = 'cute' | 'deep' | 'robot';
export type Prefs = { consent: { memory: boolean; signal: boolean; booster: boolean; at: number } | null; sound: { on: boolean; vol: number; pack: Pack; talk?: boolean; voice?: Voice }; currency: Currency };
const KEY = 'se-prefs';
const DEF: Prefs = { consent: null, sound: { on: true, vol: 0.35, pack: 'classic', talk: true, voice: 'cute' }, currency: 'AED' };
// sample rates; the Control Room sets the real ones (Settings › currencies)
export const RATES: Record<Currency, number> = { AED: 1, USD: 0.2723, EUR: 0.2510 };
let cur: Prefs | null = null;
export function prefs(): Prefs {
  if (cur) return cur;
  if (typeof window === 'undefined') return DEF;
  try { const v = JSON.parse(localStorage.getItem(KEY) || 'null'); cur = v ? { ...DEF, ...v, sound: { ...DEF.sound, ...(v.sound || {}) } } : { ...DEF }; } catch { cur = { ...DEF }; }
  return cur!;
}
export function setPrefs(p: Partial<Prefs>) {
  cur = { ...prefs(), ...p };
  try { localStorage.setItem(KEY, JSON.stringify(cur)); } catch { /* private mode */ }
  window.dispatchEvent(new CustomEvent('se:prefs', { detail: cur }));
}
/** May this kind of data be kept? Core is always allowed; the rest only after the visitor said yes. */
export const allowed = (k: 'memory' | 'signal' | 'booster') => !!prefs().consent?.[k];
