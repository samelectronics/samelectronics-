// R10 S4 · the Control Room key cookie (lock 1 of 3), shared by /api/staff/gate and the staff-only API routes.
import { createHmac, timingSafeEqual } from 'crypto';
export const GATE_COOKIE = 'cr_gate';
export const signGate = (key: string, exp: number) => createHmac('sha256', key).update('cr-gate:' + exp).digest('hex');
export const same = (a: string, b: string) => { const x = Buffer.from(a), y = Buffer.from(b); return x.length === y.length && timingSafeEqual(x, y); };
export function gateOpen(req: Request): boolean {
  const key = process.env.CONTROL_ROOM_KEY; if (!key) return false;
  const c = (req.headers.get('cookie') || '').split(/;\s*/).find((x) => x.startsWith(GATE_COOKIE + '='));
  if (!c) return false; const [exp, sig] = decodeURIComponent(c.slice(GATE_COOKIE.length + 1)).split('.');
  return !!exp && !!sig && +exp > Date.now() && same(sig, signGate(key, +exp));
}
