// R9 · /api/daftra/<path> → Daftra's API, for signed-in staff only. Staff prove who they are with their Supabase session
// (Authorization: Bearer …, checked against the staff table) or, before Supabase is connected, with the Control Room key
// (header x-cr-key = CONTROL_ROOM_KEY, set by the owner in Vercel). GET reads a whitelisted list; POST creates a
// quotation or invoice only when DAFTRA_ALLOW_WRITE=1.
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { daftra, daftraReady, canWrite, READ, WRITE, rows, send, type SendReq } from '@/lib/daftra';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function staffOk(req: Request, perm: { seeCost: boolean }): Promise<string | null> {
  perm.seeCost = false;
  const key = process.env.CONTROL_ROOM_KEY, k = req.headers.get('x-cr-key');
  if (key && k && k.length === key.length && k === key) { perm.seeCost = true; return null; }
  const tok = (req.headers.get('authorization') || '').replace(/^Bearer /, ''), url = process.env.NEXT_PUBLIC_SUPABASE_URL, anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (tok && url && anon) {
    const sb = createClient(url, anon, { global: { headers: { Authorization: 'Bearer ' + tok } }, auth: { persistSession: false } });
    const { data: u } = await sb.auth.getUser(tok); if (!u?.user) return 'Please sign in to the Control Room again.';
    const { data: s } = await sb.from('staff').select('active, role, perms').eq('id', u.user.id).maybeSingle();
    if (!s || !s.active) return 'This account is not active staff.';
    perm.seeCost = ['owner', 'manager'].includes(s.role) || (s.perms || []).some((x: string) => x === 'prices' || x === 'accounting');
    return null;
  }
  return key ? 'Enter the Control Room key (Settings → Daftra).' : 'Protect Daftra first: set CONTROL_ROOM_KEY in Vercel (or connect Supabase).';
}

async function handle(req: Request, ctx: { params: Promise<{ path: string[] }> }, method: 'GET' | 'POST') {
  const path = (await ctx.params).path.join('/');
  if (path === 'status') return NextResponse.json({ connected: daftraReady(), write: canWrite(), subdomain: process.env.DAFTRA_SUBDOMAIN || null, protectedBy: process.env.CONTROL_ROOM_KEY ? 'key' : process.env.NEXT_PUBLIC_SUPABASE_URL ? 'supabase' : 'none' });
  const perm = { seeCost: false }, no = await staffOk(req, perm), seeCost = perm.seeCost; if (no) return NextResponse.json({ error: no }, { status: 401 });
  if (method === 'POST' && path === 'send') { const b = (await req.json().catch(() => null)) as SendReq | null; if (!b || (b.type !== 'estimate' && b.type !== 'invoice')) return NextResponse.json({ error: 'Bad request' }, { status: 400 }); const r = await send(b); return NextResponse.json(r, { status: r.ok ? 200 : r.status }); }
  if (method === 'GET' && !READ.test(path)) return NextResponse.json({ error: 'Not allowed: ' + path }, { status: 403 });
  if (method === 'POST' && (!canWrite() || !WRITE.test(path))) return NextResponse.json({ error: canWrite() ? 'Not allowed: ' + path : 'Writing to Daftra is off (DAFTRA_ALLOW_WRITE).' }, { status: 403 });
  const q = new URL(req.url).searchParams; const query = new URLSearchParams(); ['page', 'limit', 'q', 'keyword', 'name', 'product_code'].forEach((k) => { const v = q.get(k); if (v) query.set(k, v); });
  const r = await daftra(path, { method, query: query.toString(), body: method === 'POST' ? await req.json().catch(() => ({})) : undefined });
  if (!r.ok) return NextResponse.json({ error: r.error }, { status: r.status });
  const j = r.data as { pagination?: unknown };
  const out = rows(r.data).map((x) => (seeCost ? x : Object.fromEntries(Object.entries(x).filter(([k]) => !/buy_price|cost/i.test(k)))));
  return NextResponse.json({ rows: out, pagination: j.pagination || null, raw: q.get('raw') && seeCost ? r.data : undefined });
}
export const GET = (req: Request, ctx: { params: Promise<{ path: string[] }> }) => handle(req, ctx, 'GET');
export const POST = (req: Request, ctx: { params: Promise<{ path: string[] }> }) => handle(req, ctx, 'POST');
