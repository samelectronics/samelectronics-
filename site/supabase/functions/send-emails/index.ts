// Sam Electronics · automated e-mails (Supabase Edge Function, Deno). Sends everything waiting in `email_queue` through
// Resend: order received, order status changes, account approved, application received, chat replies…
// Deploy: supabase functions deploy send-emails · secrets: RESEND_API_KEY, MAIL_FROM ("Sam Electronics <orders@your-domain>")
// Run it every minute: Supabase → Database → Cron (pg_cron) → net.http_post to this function's URL.
import { createClient } from 'npm:@supabase/supabase-js@2';

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
const FROM = Deno.env.get('MAIL_FROM') || 'Sam Electronics <onboarding@resend.dev>';
const aed = (n: number) => 'AED ' + Number(n).toFixed(2);
const wrap = (title: string, body: string) => `<div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:auto;color:#26282B"><div style="background:#26282B;color:#fff;padding:20px 24px;border-radius:14px 14px 0 0"><b style="letter-spacing:.14em">SAM ELECTRONICS</b><div style="color:#F7C032;font-size:12px;letter-spacing:.2em">QUALITY · WARRANTY · PRICE</div></div><div style="border:1px solid #eee;border-top:0;padding:24px;border-radius:0 0 14px 14px"><h2 style="margin:0 0 12px">${title}</h2>${body}<p style="color:#888;font-size:12px;margin-top:24px">Sam Electronics L.L.C · Al Murar, Deira, Dubai · WhatsApp +971 50 342 0015</p></div></div>`;
// deno-lint-ignore no-explicit-any
const T: Record<string, (d: any) => [string, string]> = {
  'order-received': (o) => [`We received your order ${o.no}`, wrap(`Thank you, ${o.name}!`, `<p>We received order <b>${o.no}</b>. Our team confirms stock and price on WhatsApp shortly.</p><table style="width:100%;border-collapse:collapse">${o.lines.map((l: any) => `<tr><td style="padding:6px 0">${l.qty} × ${l.title} · ${l.grade}</td><td style="text-align:right">${aed(l.unit * l.qty)}</td></tr>`).join('')}<tr><td style="padding-top:10px">VAT 5%</td><td style="text-align:right">${aed(o.vat)}</td></tr><tr><td><b>Total</b></td><td style="text-align:right"><b>${aed(o.total)}</b></td></tr></table>`)],
  'order-status': (o) => [`Order ${o.no}: ${o.status}`, wrap(`Your order is now: ${o.status}`, `<p>Order <b>${o.no}</b> was updated to <b>${o.status}</b>.</p>`)],
  'trade-approved': (u) => ['Your trade account is approved', wrap('Welcome to trade prices', `<p>Hi ${u.name}, your trade account is approved. Sign in to see trade prices in the shop.</p>`)],
  'application': (a) => ['We received your application', wrap('Thank you for applying', `<p>Hi ${a.name}, we received your ${a.type} application. Our management team will reply soon.</p>`)],
  'chat-reply': (m) => ['New reply from Sam Electronics', wrap('We replied to your message', `<p>${m.text}</p>`)],
};

Deno.serve(async () => {
  const { data: jobs } = await sb.from('email_queue').select('*').is('sent_at', null).limit(25);
  let sent = 0;
  for (const j of jobs || []) {
    const t = T[j.template]; if (!t) { await sb.from('email_queue').update({ error: 'unknown template' }).eq('id', j.id); continue; }
    const [subject, html] = t(j.data);
    const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + Deno.env.get('RESEND_API_KEY'), 'Content-Type': 'application/json' }, body: JSON.stringify({ from: FROM, to: j.to_email, subject, html }) });
    if (r.ok) { sent++; await sb.from('email_queue').update({ sent_at: new Date().toISOString() }).eq('id', j.id); } else await sb.from('email_queue').update({ error: await r.text() }).eq('id', j.id);
  }
  return new Response(JSON.stringify({ sent }), { headers: { 'Content-Type': 'application/json' } });
});
