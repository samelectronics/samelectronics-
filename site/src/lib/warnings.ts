'use client';
// Owner (17 Nov): every system warning shown to a visitor is stored: it goes to the Control Room inbox (topic
// "System warning · …", with the customer and message IDs) and stays in this device's own history, which the visitor
// can read on /notices. Nothing else about them is collected.
import { customerId } from './ids';

export type WarnKind = 'vpn' | 'screenshot' | 'slow' | 'crash';
export type Warn = { kind: WarnKind; at: number; page: string; detail?: string };
const KEY = 'se-warnings';
export const WARN_TITLE: Record<WarnKind, string> = { vpn: 'Location mismatch (VPN)', screenshot: 'Screenshot · copyright notice', slow: 'Slow connection', crash: 'Page error' };

export function warnings(): Warn[] { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } }

let last: Record<string, number> = {};
export function logWarning(kind: WarnKind, detail = '') {
  if (typeof window === 'undefined') return;
  const now = Date.now(); if (now - (last[kind] || 0) < 60000) return; last = { ...last, [kind]: now };
  const w: Warn = { kind, at: now, page: location.pathname, detail };
  try { const l = warnings(); l.unshift(w); localStorage.setItem(KEY, JSON.stringify(l.slice(0, 50))); } catch { /* */ }
  import('./backend').then(({ backend }) => backend.send({ name: 'System · ' + customerId(), topic: 'System warning · ' + WARN_TITLE[kind],
    text: '*System warning:* ' + WARN_TITLE[kind] + '\n*Page:* ' + location.href + (detail ? '\n*Detail:* ' + detail : '') + '\n*Time:* ' + new Date(now).toLocaleString('en-GB', { timeZone: 'Asia/Dubai' }) + ' (Dubai)' })).catch(() => { /* offline */ });
}
