'use client';
// P1 · The Supabase backend. Used automatically when NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set
// (Vercel → Project → Settings → Environment Variables). Tables, row-level security and triggers: supabase/schema.sql.
// Sign-up sends a real confirmation code by e-mail (Supabase Auth, "Email OTP"; SMTP through Resend — supabase/README.md).
// Staff are normal Supabase users with a row in `staff`; what they can do is enforced by the security rules, not the page.
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Application, Audit, Backend, Company, Message, Order, Result, Review, Staff, StockMove, Thread, User } from './types';

let sb: SupabaseClient | null = null;
const db = () => (sb = sb || createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string, { auth: { persistSession: true, autoRefreshToken: true } }));
const ok = <T,>(data: T): Result<T> => ({ ok: true, data });
const no = <T,>(error: string): Result<T> => ({ ok: false, error });
const ts = (s?: string | null) => (s ? new Date(s).getTime() : 0);

// rows → app shapes
type Row = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
const toUser = (p: Row): User => ({ id: p.id, email: p.email, name: p.name || '', phone: p.phone || undefined, verified: !!p.verified, createdAt: ts(p.created_at), kind: p.kind || 'customer', tradeApproved: !!p.trade_approved, points: p.points || 0, card: p.card_kind ? { kind: p.card_kind, no: p.card_no, level: p.card_level || 0 } : null, avatar: p.avatar || undefined, country: p.country || undefined, city: p.city || undefined, lang: p.lang || undefined, contactEmail: p.contact_email || undefined });
const toOrder = (o: Row): Order => ({ id: o.id, no: o.no, user: o.user_id || undefined, email: o.email, name: o.name, phone: o.phone, lines: o.lines, sub: +o.sub, vat: +o.vat, ship: +o.ship, total: +o.total, delivery: o.delivery, address: o.address || undefined, country: o.country || undefined, note: o.note || undefined, status: o.status, pay: o.pay, company: o.company_id || undefined, createdAt: ts(o.created_at), history: o.history || [] });
const toStaff = (s: Row): Staff => ({ id: s.id, email: s.email, name: s.name, role: s.role, title: s.title || '', photo: s.photo || undefined, phone: s.phone || undefined, branch: s.branch || 'Dubai · Deira', active: !!s.active, perms: s.perms || [], joined: ts(s.created_at), lastSeen: ts(s.last_seen) || undefined });
const toCompany = (c: Row): Company => ({ id: c.id, owner: c.owner, name: c.name, tradeLicence: c.trade_licence || undefined, trn: c.trn || undefined, kind: c.kind, phone: c.phone || undefined, email: c.email || undefined, website: c.website || undefined, locations: c.locations || [], approved: !!c.approved, note: c.note || undefined, createdAt: ts(c.created_at) });
const uid = async () => (await db().auth.getUser()).data.user?.id || null;

export const supabase: Backend = {
  mode: 'supabase',
  async me() { const id = await uid(); if (!id) return null; const { data } = await db().from('profiles').select('*').eq('id', id).single(); return data ? toUser(data) : null; },
  async signUp(i) {
    const { error } = await db().auth.signUp({ email: i.email.trim(), password: i.password, options: { data: { name: i.name, phone: i.phone || null, kind: i.kind || 'customer' } } });
    return error ? no(error.message) : ok({ needsVerify: true });
  },
  async verify(email, code) { const { error } = await db().auth.verifyOtp({ email: email.trim(), token: code.trim(), type: 'signup' }); if (error) return no(error.message); const u = await this.me(); return u ? ok(u) : no('Signed in, but the profile is missing.'); },
  async resend(email) { const { error } = await db().auth.resend({ type: 'signup', email: email.trim() }); return error ? no(error.message) : ok({}); },
  async signIn(email, password) { const { error } = await db().auth.signInWithPassword({ email: email.trim(), password }); if (error) return no(error.message); const u = await this.me(); return u ? ok(u) : no('Profile missing.'); },
  async signOut() { await db().auth.signOut(); },
  async resetPassword(email) { const { error } = await db().auth.resetPasswordForEmail(email.trim(), { redirectTo: location.origin + '/account?reset=1' }); return error ? no(error.message) : ok({}); },
  async updateMe(p) {
    const id = await uid(); if (!id) return no('Please sign in.');
    const { data, error } = await db().from('profiles').update({ name: p.name, phone: p.phone, avatar: p.avatar, country: p.country, city: p.city, lang: p.lang, contact_email: p.contactEmail }).eq('id', id).select().single();
    return error ? no(error.message) : ok(toUser(data));
  },
  async linkCard(kind, no_) { const { data, error } = await db().rpc('link_card', { p_kind: kind, p_no: no_.trim().toUpperCase() }); return error ? no(error.message) : ok(toUser(data)); },
  async companies() { const { data } = await db().from('companies').select('*').order('created_at'); return (data || []).map(toCompany); },
  async saveCompany(c) {
    const id = await uid(); if (!id) return no('Please sign in.');
    const row = { owner: id, name: c.name, trade_licence: c.tradeLicence, trn: c.trn, kind: c.kind || 'repair-shop', phone: c.phone, email: c.email, website: c.website, locations: c.locations || [], note: c.note };
    const q = c.id ? db().from('companies').update(row).eq('id', c.id) : db().from('companies').insert(row);
    const { data, error } = await q.select().single(); return error ? no(error.message) : ok(toCompany(data));
  },
  async removeCompany(id) { await db().from('companies').delete().eq('id', id); },
  async placeOrder(o) {
    // prices and VAT are re-checked on the server (function place_order) — the page's numbers are never trusted
    const { data, error } = await db().rpc('place_order', { p: { lines: o.lines.map((l) => ({ id: l.id, qty: l.qty })), email: o.email, name: o.name, phone: o.phone, delivery: o.delivery, address: o.address, country: o.country, note: o.note, pay: o.pay, company_id: o.company } });
    return error ? no(error.message) : ok(toOrder(data));
  },
  async myOrders() { const { data } = await db().from('orders').select('*').order('created_at', { ascending: false }); return (data || []).map(toOrder); },
  async reviews(product) { const { data } = await db().from('reviews').select('*').eq('product_id', product).order('created_at', { ascending: false }); return (data || []).map((r: Row): Review => ({ id: r.id, product: r.product_id, user: r.user_id, name: r.name, stars: r.stars, title: r.title, text: r.text, verified: r.verified, at: ts(r.created_at) })); },
  async addReview(r) { const { data, error } = await db().from('reviews').insert({ product_id: r.product, stars: r.stars, title: r.title, text: r.text }).select().single(); return error ? no(error.message) : ok({ id: data.id, product: data.product_id, user: data.user_id, name: data.name, stars: data.stars, title: data.title, text: data.text, verified: data.verified, at: ts(data.created_at) }); },
  async threads() { const { data } = await db().from('threads').select('*').order('updated_at', { ascending: false }); return (data || []).map((t: Row): Thread => ({ id: t.id, user: t.user_id || undefined, name: t.name, email: t.email || undefined, topic: t.topic, status: t.status, at: ts(t.updated_at), last: t.last || '', unread: t.unread || 0, assigned: t.assigned || undefined })); },
  async messages(thread) { const { data } = await db().from('messages').select('*').eq('thread_id', thread).order('created_at'); return (data || []).map((m: Row): Message => ({ id: m.id, thread: m.thread_id, from: m.sender, name: m.name, text: m.text, at: ts(m.created_at), read: m.read })); },
  async send(i) { const { data, error } = await db().rpc('send_message', { p_thread: i.thread || null, p_name: i.name, p_email: i.email || null, p_topic: i.topic || 'Website chat', p_text: i.text, p_from: i.from || 'visitor' }); return error ? no(error.message) : ok({ thread: data as string }); },
  async apply(a) { const { data, error } = await db().from('applications').insert({ type: a.type, name: a.name, email: a.email, phone: a.phone, data: a.data }).select().single(); return error ? no(error.message) : ok({ ...a, id: data.id, status: 'new', at: ts(data.created_at) } as Application); },
  async staffMe() { const id = await uid(); if (!id) return null; const { data } = await db().from('staff').select('*').eq('id', id).maybeSingle(); return data ? toStaff(data) : null; },
  async staffSignIn(email, password) { const { error } = await db().auth.signInWithPassword({ email: email.trim(), password }); if (error) return no(error.message); const s = await this.staffMe(); if (!s || !s.active) { await db().auth.signOut(); return no('This account is not a staff account.'); } await db().from('staff').update({ last_seen: new Date().toISOString() }).eq('id', s.id); return ok(s); },
  async staffSignOut() { await db().auth.signOut(); },
  async staffList() { const { data } = await db().from('staff').select('*').order('created_at'); return (data || []).map(toStaff); },
  async saveStaff(s) { const me = await uid(); if (s.id && s.id === me) { const { data, error } = await db().from('staff').update({ name: s.name, title: s.title, phone: s.phone, photo: s.photo }).eq('id', me).select().single(); if (!error) return ok(toStaff(data)); } const { data, error } = await db().rpc('save_staff', { p: s }); return error ? no(error.message) : ok(toStaff(data)); },
  async allOrders() { const { data } = await db().from('orders').select('*').order('created_at', { ascending: false }).limit(500); return (data || []).map(toOrder); },
  async setOrderStatus(id, status) { const { data, error } = await db().rpc('set_order_status', { p_id: id, p_status: status }); return error ? no(error.message) : ok(toOrder(data)); },
  async customers() { const { data } = await db().from('profiles').select('*').order('created_at', { ascending: false }).limit(1000); return (data || []).map(toUser); },
  async approveTrade(userId, yes) { const { data, error } = await db().from('profiles').update({ trade_approved: yes, kind: yes ? 'wholesale' : 'customer' }).eq('id', userId).select().single(); return error ? no(error.message) : ok(toUser(data)); },
  async applications() { const { data } = await db().from('applications').select('*').order('created_at', { ascending: false }); return (data || []).map((a: Row): Application => ({ id: a.id, type: a.type, name: a.name, email: a.email, phone: a.phone, data: a.data, status: a.status, at: ts(a.created_at) })); },
  async setApplication(id, status) { await db().from('applications').update({ status }).eq('id', id); },
  async audit() { const { data } = await db().from('audit_log').select('*').order('created_at', { ascending: false }).limit(500); return (data || []).map((l: Row): Audit => ({ id: l.id, staff: l.staff_name, action: l.action, target: l.target, detail: l.detail, at: ts(l.created_at) })); },
  async log(action, target, detail) { await db().from('audit_log').insert({ action, target, detail }); },
  async saveProduct(id, patch) { const { error } = await db().from('products').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id); if (error) return no(error.message); await this.log('product.save', id, Object.keys(patch).join(', ')); return ok(true as const); },
  async addProduct(p) { const { error } = await db().from('products').insert(p); if (error) return no(error.message); await this.log('product.add', p.id); return ok(true as const); },
  async stockMove(id, delta, reason, ref) { const { error } = await db().rpc('stock_move', { p_id: id, p_delta: delta, p_reason: reason, p_ref: ref || null }); return error ? no(error.message) : ok(true as const); },
  async stockMoves() { const { data } = await db().from('stock_moves').select('*').order('created_at', { ascending: false }).limit(2000); return (data || []).map((m: Row): StockMove => ({ id: m.id, product: m.product_id, delta: m.delta, reason: m.reason, ref: m.ref || undefined, staff: m.staff_name || '', at: ts(m.created_at) })); },
  async setting(key, fallback) { const { data } = await db().from('settings').select('value').eq('key', key).maybeSingle(); return (data ? data.value : fallback) as typeof fallback; },
  async saveSetting(key, value) { await db().from('settings').upsert({ key, value }); },
};
