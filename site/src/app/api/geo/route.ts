// Owner (17 Nov): where the visitor's connection comes from, as Vercel already knows it (no outside service).
// Only the time zone and the country code are returned; the IP address itself is never sent back or stored.
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export function GET(req: Request) {
  const h = req.headers;
  return NextResponse.json({ tz: h.get('x-vercel-ip-timezone') || null, cc: h.get('x-vercel-ip-country') || null }, { headers: { 'cache-control': 'no-store' } });
}
