// R9 · the visitor's notifications (the bell in the nav). Kept in this browser now; when the database is connected the same
// list also receives order, repair and stock messages from the Control Room (table 'notifications', see docs/SCHEMA.sql).
export type Note = { id: string; kind: 'order' | 'repair' | 'stock' | 'offer' | 'info'; t: string; d?: string; href?: string; at: number; read?: boolean };
const KEY = 'se-notes';
const read = (): Note[] => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } };
const write = (l: Note[]) => { try { localStorage.setItem(KEY, JSON.stringify(l.slice(0, 40))); } catch {} window.dispatchEvent(new CustomEvent('se:notes')); };
export const notes = (): Note[] => (typeof window === 'undefined' ? [] : read());
export function notify(n: Omit<Note, 'id' | 'at'> & { id?: string }) { const l = read(); if (n.id && l.some((x) => x.id === n.id)) return; write([{ ...n, id: n.id || 'n' + Date.now().toString(36), at: Date.now() }, ...l]); }
export const markRead = (id?: string) => write(read().map((x) => (!id || x.id === id ? { ...x, read: true } : x)));
export const clearNotes = () => write([]);
export function seedNotes() {
  // the first visit gets one friendly note so the bell is not empty
  notify({ id: 'welcome', kind: 'info', t: 'Welcome to Sam Electronics', d: 'Star parts or set a stock alert, and updates will land here.', href: '/account#notifications' });
}
