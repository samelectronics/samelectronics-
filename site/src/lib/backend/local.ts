'use client';
// P1 · The demo backend: everything is kept in this browser (localStorage 'se-db'), so every page works before Supabase is
// connected. Same methods and shapes as the Supabase adapter. Not secure and not shared between devices — demo only.
// Demo staff log-in (Control Room): owner@sam.demo / demo1234 · manager@sam.demo / demo1234 · sales@sam.demo / demo1234
import type { Application, Audit, Backend, Company, Message, Order, Result, Review, Staff, Thread, User } from './types';
import { ROLE_PERMS } from './types';

type DB = {
  users: (User & { pw: string; code?: string })[]; session: string | null; staffSession: string | null;
  companies: Company[]; orders: Order[]; reviews: Review[]; threads: Thread[]; messages: Message[];
  staff: (Staff & { pw: string })[]; apps: Application[]; audit: Audit[]; settings: Record<string, unknown>;
};
const KEY = 'se-db';
const id = (p: string) => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const code6 = () => String(Math.floor(100000 + Math.random() * 900000));
async function hash(s: string) {
  try { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('se:' + s)); return Array.from(new Uint8Array(b)).map((x) => x.toString(16).padStart(2, '0')).join(''); } catch { return 'p:' + s; }
}
const ok = <T,>(data: T): Result<T> => ({ ok: true, data });
const no = <T,>(error: string): Result<T> => ({ ok: false, error });

let seeded: Promise<void> | null = null;
function read(): DB {
  let d: Partial<DB> = {};
  try { d = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { /* blocked */ }
  return { users: [], session: null, staffSession: null, companies: [], orders: [], reviews: [], threads: [], messages: [], staff: [], apps: [], audit: [], settings: {}, ...d } as DB;
}
function write(d: DB) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch { /* full */ } window.dispatchEvent(new CustomEvent('se:db')); }
async function seed() {
  const d = read(); if (d.staff.length) return;
  const pw = await hash('demo1234'), now = Date.now();
  const S = (email: string, name: string, role: Staff['role'], title: string, photo?: string): Staff & { pw: string } => ({ id: id('s'), email, name, role, title, photo, branch: 'Dubai · Deira', active: true, perms: ROLE_PERMS[role], joined: now - 864e5 * 400, pw });
  d.staff = [
    S('owner@sam.demo', 'Tarek (demo)', 'owner', 'Founder & owner'),
    S('manager@sam.demo', 'Store manager (demo)', 'manager', 'Store manager'),
    S('sales@sam.demo', 'Sales desk (demo)', 'sales', 'Sales'),
    S('tech@sam.demo', 'Technician (demo)', 'technician', 'Repair technician'),
  ];
  d.threads = [{ id: 't-demo', name: 'Visitor (demo)', email: 'visitor@example.com', topic: 'Stock question', status: 'open', at: now - 36e5, last: 'Do you have the A54 screen in Service Pack?', unread: 1 }];
  d.messages = [{ id: 'm-demo', thread: 't-demo', from: 'visitor', name: 'Visitor (demo)', text: 'Do you have the A54 screen in Service Pack?', at: now - 36e5 }];
  write(d);
}
const ready = () => (seeded = seeded || seed());
const strip = <T extends { pw?: string; code?: string }>(u: T) => { const { pw: _p, code: _c, ...rest } = u; return rest; };

export const local: Backend = {
  mode: 'local',
  async me() { await ready(); const d = read(); const u = d.users.find((x) => x.id === d.session); return u ? (strip(u) as User) : null; },
  async signUp(i) {
    await ready(); const d = read(), email = i.email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return no('Please enter a real e-mail address.');
    if (i.password.length < 8) return no('Use at least 8 characters for the password.');
    if (d.users.some((u) => u.email === email)) return no('An account with this e-mail already exists. Sign in instead.');
    const c = code6();
    d.users.push({ id: id('u'), email, name: i.name.trim(), phone: i.phone, verified: false, createdAt: Date.now(), kind: i.kind || 'customer', tradeApproved: false, points: 0, card: null, pw: await hash(i.password), code: c });
    write(d); return ok({ needsVerify: true, demoCode: c });
  },
  async verify(email, code) {
    const d = read(), u = d.users.find((x) => x.email === email.trim().toLowerCase()); if (!u) return no('No account with this e-mail.');
    if (u.code !== code.trim()) return no('That code is not right. Check the e-mail and try again.');
    u.verified = true; u.code = undefined; d.session = u.id; write(d); return ok(strip(u) as User);
  },
  async resend(email) { const d = read(), u = d.users.find((x) => x.email === email.trim().toLowerCase()); if (!u) return no('No account with this e-mail.'); u.code = code6(); write(d); return ok({ demoCode: u.code }); },
  async signIn(email, password) {
    await ready(); const d = read(), u = d.users.find((x) => x.email === email.trim().toLowerCase());
    if (!u || u.pw !== (await hash(password))) return no('E-mail or password is not right.');
    if (!u.verified) return no('Please confirm your e-mail first (we sent you a code).');
    d.session = u.id; write(d); return ok(strip(u) as User);
  },
  async signOut() { const d = read(); d.session = null; write(d); },
  async resetPassword(email) { const d = read(), u = d.users.find((x) => x.email === email.trim().toLowerCase()); if (!u) return ok({}); u.code = code6(); write(d); return ok({ demoCode: u.code }); },
  async updateMe(p) { const d = read(), u = d.users.find((x) => x.id === d.session); if (!u) return no('Please sign in.'); const { id: _i, email: _e, verified: _v, tradeApproved: _t, points: _p, ...safe } = p; Object.assign(u, safe); write(d); return ok(strip(u) as User); },
  async linkCard(kind, no_) { const d = read(), u = d.users.find((x) => x.id === d.session); if (!u) return no('Please sign in.'); if (!/^S[CGO] ?\d{3} ?\d{3} ?\d{4}$/i.test(no_.trim())) return no('Card numbers look like SC 123 456 2700.'); u.card = { kind, no: no_.trim().toUpperCase(), level: 0 }; write(d); return ok(strip(u) as User); },
  async companies() { const d = read(); return d.companies.filter((c) => c.owner === d.session); },
  async saveCompany(c) {
    const d = read(); if (!d.session) return no('Please sign in.');
    const ex = c.id && d.companies.find((x) => x.id === c.id && x.owner === d.session);
    if (ex) { Object.assign(ex, c, { approved: ex.approved }); write(d); return ok(ex); }
    const n: Company = { id: id('co'), owner: d.session, kind: 'repair-shop', locations: [], approved: false, createdAt: Date.now(), ...c } as Company; d.companies.push(n); write(d); return ok(n);
  },
  async removeCompany(cid) { const d = read(); d.companies = d.companies.filter((c) => !(c.id === cid && c.owner === d.session)); write(d); },
  async placeOrder(o) {
    const d = read(), n = d.orders.length + 1;
    const order: Order = { ...o, id: id('o'), no: 'SE-' + new Date().getFullYear() + '-' + String(1000 + n), user: d.session || undefined, status: 'New', createdAt: Date.now(), history: [{ at: Date.now(), status: 'New' }] };
    d.orders.unshift(order); write(d); return ok(order);
  },
  async myOrders() { const d = read(), u = d.users.find((x) => x.id === d.session); return d.orders.filter((o) => (d.session && o.user === d.session) || (u && o.email === u.email)); },
  async reviews(product) { return read().reviews.filter((r) => r.product === product); },
  async addReview(r) {
    const d = read(), u = d.users.find((x) => x.id === d.session); if (!u) return no('Only account holders can rate. Please sign in.');
    const bought = d.orders.some((o) => o.user === u.id && o.lines.some((l) => l.id === r.product));
    const rv: Review = { id: id('r'), user: u.id, name: u.name, verified: bought, at: Date.now(), ...r }; d.reviews.unshift(rv); write(d); return ok(rv);
  },
  async threads() { await ready(); const d = read(); if (d.staffSession) return d.threads; const u = d.users.find((x) => x.id === d.session); const mine = JSON.parse(localStorage.getItem('se-my-threads') || '[]'); return d.threads.filter((t) => mine.includes(t.id) || (u && t.user === u.id)); },
  async messages(thread) { return read().messages.filter((m) => m.thread === thread).sort((a, b) => a.at - b.at); },
  async send(i) {
    const d = read(); let t = i.thread ? d.threads.find((x) => x.id === i.thread) : undefined;
    if (!t) { t = { id: id('t'), user: d.session || undefined, name: i.name, email: i.email, topic: i.topic || 'Website chat', status: 'open', at: Date.now(), last: i.text, unread: 0 }; d.threads.unshift(t); try { const mine = JSON.parse(localStorage.getItem('se-my-threads') || '[]'); localStorage.setItem('se-my-threads', JSON.stringify([t.id, ...mine])); } catch { /* */ } }
    const from = i.from || 'visitor';
    d.messages.push({ id: id('m'), thread: t.id, from, name: i.name, text: i.text, at: Date.now() }); t.last = i.text; t.at = Date.now(); if (from === 'visitor') { t.unread++; t.status = 'open'; } else t.status = 'waiting';
    write(d); return ok({ thread: t.id });
  },
  async apply(a) { const d = read(), x: Application = { ...a, id: id('a'), status: 'new', at: Date.now() }; d.apps.unshift(x); write(d); return ok(x); },
  async staffMe() { await ready(); const d = read(); const s = d.staff.find((x) => x.id === d.staffSession); return s ? (strip(s) as Staff) : null; },
  async staffSignIn(email, password) { await ready(); const d = read(), s = d.staff.find((x) => x.email === email.trim().toLowerCase()); if (!s || s.pw !== (await hash(password)) || !s.active) return no('E-mail or password is not right.'); s.lastSeen = Date.now(); d.staffSession = s.id; write(d); return ok(strip(s) as Staff); },
  async staffSignOut() { const d = read(); d.staffSession = null; write(d); },
  async staffList() { await ready(); return read().staff.map((s) => strip(s) as Staff); },
  async saveStaff(s) {
    const d = read(), me = d.staff.find((x) => x.id === d.staffSession); if (!me || !me.perms.includes('staff')) return no('Only the owner and managers can change staff.');
    const ex = s.id ? d.staff.find((x) => x.id === s.id) : d.staff.find((x) => x.email === s.email.toLowerCase());
    if (ex) { Object.assign(ex, s); write(d); return ok(strip(ex) as Staff); }
    const n = { id: id('s'), branch: 'Dubai · Deira', active: true, title: s.role, perms: ROLE_PERMS[s.role], joined: Date.now(), pw: await hash('welcome123'), ...s, email: s.email.toLowerCase() } as Staff & { pw: string };
    d.staff.push(n); write(d); return ok(strip(n) as Staff);
  },
  async allOrders() { return read().orders; },
  async setOrderStatus(oid, status) { const d = read(), o = d.orders.find((x) => x.id === oid); if (!o) return no('Order not found.'); const me = d.staff.find((x) => x.id === d.staffSession); o.status = status; o.history.push({ at: Date.now(), status, by: me?.name }); write(d); return ok(o); },
  async customers() { return read().users.map((u) => strip(u) as User); },
  async approveTrade(uid, yes) { const d = read(), u = d.users.find((x) => x.id === uid); if (!u) return no('Customer not found.'); u.tradeApproved = yes; if (yes) u.kind = 'wholesale'; write(d); return ok(strip(u) as User); },
  async applications() { return read().apps; },
  async setApplication(aid, status) { const d = read(), a = d.apps.find((x) => x.id === aid); if (a) { a.status = status; write(d); } },
  async audit() { return read().audit; },
  async log(action, target, detail) { const d = read(), me = d.staff.find((x) => x.id === d.staffSession); d.audit.unshift({ id: id('l'), staff: me ? me.name : 'system', action, target, detail, at: Date.now() }); d.audit = d.audit.slice(0, 500); write(d); },
  async setting(key, fallback) { const v = read().settings[key]; return (v === undefined ? fallback : v) as typeof fallback; },
  async saveSetting(key, value) { const d = read(); d.settings[key] = value; write(d); },
};
