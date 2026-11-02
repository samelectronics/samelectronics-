// R10 S4 · lock 1 of 3: the Control Room key. Checked on the server (never in the page) against CONTROL_ROOM_KEY
// (set by the owner in Vercel). A correct key sets a signed, httpOnly cookie for 12 hours; only then does /staff show
// the sign-in form. 5 wrong keys from the same connection lock this door for 15 minutes.
import { NextResponse } from 'next/server';
import { GATE_COOKIE as COOKIE, gateOpen, same, signGate as sign } from '@/lib/gate';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HOURS = 12, MAX_TRIES = 5, LOCK_MS = 15 * 60 * 1000;
const fails = new Map<string, { n: number; until: number }>();
const ip = (req: Request) => (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'local';

export async function GET(req: Request) {
  const configured = !!process.env.CONTROL_ROOM_KEY, f = fails.get(ip(req));
  return NextResponse.json({ configured, open: configured ? gateOpen(req) : false, lockedFor: f && f.until > Date.now() ? Math.ceil((f.until - Date.now()) / 60000) : 0 }, { headers: { 'cache-control': 'no-store' } });
}

export async function POST(req: Request) {
  const key = process.env.CONTROL_ROOM_KEY; if (!key) return NextResponse.json({ ok: false, error: 'The Control Room key is not set yet (Vercel → CONTROL_ROOM_KEY).' }, { status: 503 });
  const who = ip(req), f = fails.get(who) || { n: 0, until: 0 };
  if (f.until > Date.now()) return NextResponse.json({ ok: false, error: 'Too many wrong keys. Try again in ' + Math.ceil((f.until - Date.now()) / 60000) + ' min.' }, { status: 429 });
  const body = (await req.json().catch(() => ({}))) as { key?: string };
  await new Promise((r) => setTimeout(r, 350)); // slows guessing down
  if (!body.key || !same(String(body.key), key)) {
    f.n += 1; if (f.n >= MAX_TRIES) { f.until = Date.now() + LOCK_MS; f.n = 0; } fails.set(who, f);
    return NextResponse.json({ ok: false, error: f.until > Date.now() ? 'Too many wrong keys. The door is locked for 15 minutes.' : 'That key is not right. ' + (MAX_TRIES - f.n) + ' tries left.' }, { status: 401 });
  }
  fails.delete(who);
  const exp = Date.now() + HOURS * 3600 * 1000, res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, exp + '.' + sign(key, exp), { httpOnly: true, secure: true, sameSite: 'strict', path: '/', maxAge: HOURS * 3600 });
  return res;
}

export async function DELETE() { const res = NextResponse.json({ ok: true }); res.cookies.set(COOKIE, '', { path: '/', maxAge: 0 }); return res; }
