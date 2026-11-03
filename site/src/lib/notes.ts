// R9 · the visitor's notifications (the bell in the nav). Kept in this browser now; when the database is connected the same
// list also receives order, repair and stock messages from the Control Room (table 'notifications', see docs/SCHEMA.sql).
export type Note = { id: string; kind: 'order' | 'repair' | 'stock' | 'offer' | 'info'; t: string; d?: string; href?: string; at: number; read?: boolean };
const KEY = 'se-notes';
const read = (): Note[] => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } };
const write = (l: Note[]) => { try { localStorage.setItem(KEY, JSON.stringify(l.slice(0, 40))); } catch {} window.dispatchEvent(new CustomEvent('se:notes')); };
export const notes = (): Note[] => (typeof window === 'undefined' ? [] : read());
export function notify(n: Omit<Note, 'id' | 'at'> & { id?: string }) { const l = read(); if (n.id && l.some((x) => x.id === n.id)) return; write([{ ...n, id: n.id || 'n' + Date.now().toString(36), at: Date.now() }, ...l]); if (n.id !== 'welcome') import('./sound').then((m) => m.play('notify')).catch(() => {}); }

/** R11: the browser tab's icon shows a blinking yellow dot while there are unread notifications (seen from other tabs too). */
let fvBase: string | null = null, fvIv = 0, fvImg: HTMLImageElement | null = null;
export function tabDot(unread: number) {
  if (typeof document === 'undefined') return;
  const links = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]'));
  if (!links.length) return; if (fvBase == null) fvBase = links[0].href;
  window.clearInterval(fvIv);
  const set = (href: string) => links.forEach((l) => { l.href = href; });
  if (!unread) { set(fvBase); return; }
  const draw = (on: boolean) => { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'); if (!x) return; if (fvImg && fvImg.complete) x.drawImage(fvImg, 0, 0, 64, 64);
    x.beginPath(); x.arc(49, 15, 13, 0, 7); x.fillStyle = '#26282B'; x.fill(); x.beginPath(); x.arc(49, 15, 10, 0, 7); x.fillStyle = on ? '#F7C032' : 'rgba(247,192,50,.35)'; x.shadowColor = '#F7C032'; x.shadowBlur = on ? 10 : 0; x.fill(); try { set(c.toDataURL('image/png')); } catch {} };
  const go = () => { let on = true; draw(on); fvIv = window.setInterval(() => { on = !on; draw(on); }, 900); };
  if (!fvImg) { fvImg = new Image(); fvImg.crossOrigin = 'anonymous'; fvImg.onload = go; fvImg.src = '/assets/se-logo-128.webp'; } else go();
}
export const markRead = (id?: string) => write(read().map((x) => (!id || x.id === id ? { ...x, read: true } : x)));
export const clearNotes = () => write([]);
export function seedNotes() {
  // the first visit gets one friendly note so the bell is not empty
  notify({ id: 'welcome', kind: 'info', t: 'Welcome to Sam Electronics', d: 'Star parts or set a stock alert, and updates will land here.', href: '/account#notifications' });
}
