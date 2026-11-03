'use client';
// R10 4.3 · repair job card extras: intake (model code, IMEI, arrival checklist, damage photos), the printed QR ticket and
// warranty sticker, the pickup signature, and the WhatsApp message for each status.
import React, { useEffect, useRef } from 'react';
import qrcode from 'qrcode-generator';

export type JobX = { imei?: string; code?: string; check?: Record<string, 'ok' | 'bad' | ''>; photos?: string[]; sign?: string; signedAt?: number; stockOut?: boolean; warrantyDays?: number };
const CHECK = ['Powers on', 'Screen / display', 'Touch', 'Front camera', 'Rear camera', 'Speaker & mic', 'Face ID / fingerprint', 'Charging', 'Buttons', 'Water marks'];
export const STATUS_MSG: Record<string, string> = {
  Booked: 'we have your {model} (ticket {no}). We check it first and send you the price before we start.',
  Diagnosing: 'your {model} is on the bench now. We are checking it.',
  'Waiting for part': 'your {model} needs a part we are getting for you. We tell you as soon as it arrives.',
  Repairing: 'we are repairing your {model} now.',
  Testing: 'your {model} is repaired and in final testing.',
  Ready: 'your {model} is ready! Collect it at Al Murar, Deira. Ticket {no}.',
  Collected: 'thank you for collecting your {model}. Your repair warranty starts today. A Google review would help us a lot!',
};
const shrink = (f: File, max = 640): Promise<string> => new Promise((res, rej) => { const i = new Image(), u = URL.createObjectURL(f); i.onload = () => { const k = Math.min(1, max / Math.max(i.width, i.height)), c = document.createElement('canvas'); c.width = Math.round(i.width * k); c.height = Math.round(i.height * k); c.getContext('2d')!.drawImage(i, 0, 0, c.width, c.height); URL.revokeObjectURL(u); res(c.toDataURL('image/jpeg', 0.7)); }; i.onerror = rej; i.src = u; });
export const qr = (t: string, cell = 4) => { const q = qrcode(0, 'M'); q.addData(t); q.make(); return q.createSvgTag({ cellSize: cell, margin: 1, scalable: true }); };

export function JobExtras<T extends JobX & { no: string; model: string; status: string }>({ f, set }: { f: T; set: (v: T) => void }) {
  const check = f.check || {};
  const add = async (files: FileList | null) => { if (!files) return; const out = [...(f.photos || [])]; for (const x of Array.from(files).slice(0, 4 - out.length)) { try { out.push(await shrink(x)); } catch { /* */ } } set({ ...f, photos: out }); };
  return (
    <div className="jx">
      <div className="cr-row2"><label>Model code<input className="cr-in mono" value={f.code || ''} placeholder="e.g. SM-A546E" onChange={(e) => set({ ...f, code: e.target.value.toUpperCase() })} /></label><label>IMEI / serial<input className="cr-in mono" inputMode="numeric" value={f.imei || ''} onChange={(e) => set({ ...f, imei: e.target.value.replace(/[^\dA-Za-z]/g, '').slice(0, 20) })} /></label></div>
      <div className="jx-sec"><b>Arrival check</b><small>Tap each one: works / fault. Protects you and the customer.</small>
        <div className="jx-check">{CHECK.map((c) => { const v = check[c] || ''; return <button key={c} type="button" className={'jx-c ' + v} onClick={() => set({ ...f, check: { ...check, [c]: v === '' ? 'ok' : v === 'ok' ? 'bad' : '' } })}><i />{c}</button>; })}</div></div>
      <div className="jx-sec"><b>Damage photos</b><small>Up to 4, taken at the counter.</small>
        <div className="jx-ph">{(f.photos || []).map((p, i) => <span key={i}><img src={p} alt="" /><button type="button" onClick={() => set({ ...f, photos: (f.photos || []).filter((_, j) => j !== i) })} aria-label="Remove">×</button></span>)}
          {(f.photos || []).length < 4 ? <label className="jx-add">+<input type="file" accept="image/*" capture="environment" multiple hidden onChange={(e) => add(e.target.files)} /></label> : null}</div></div>
      <div className="cr-row2"><label>Warranty (days)<input className="cr-in" type="number" min={0} value={f.warrantyDays ?? 90} onChange={(e) => set({ ...f, warrantyDays: +e.target.value })} /></label><span /></div>
      {f.status === 'Ready' || f.status === 'Collected' ? <Signature value={f.sign} at={f.signedAt} onSign={(sign) => set({ ...f, sign, signedAt: Date.now(), status: 'Collected' })} /> : null}
      <div className="cr-acts"><button type="button" className="cr-btn ghost sm" onClick={() => printTicket(f)}>Print ticket</button><button type="button" className="cr-btn ghost sm" onClick={() => printSticker(f)}>Print warranty sticker</button></div>
    </div>
  );
}

function Signature({ value, at, onSign }: { value?: string; at?: number; onSign: (d: string) => void }) {
  const ref = useRef<HTMLCanvasElement>(null), drawn = useRef(false);
  useEffect(() => { const c = ref.current; if (!c) return; const x = c.getContext('2d')!; x.lineWidth = 2.4; x.lineCap = 'round'; x.strokeStyle = '#26282B'; let on = false;
    const pos = (e: PointerEvent) => { const r = c.getBoundingClientRect(); return [(e.clientX - r.left) * (c.width / r.width), (e.clientY - r.top) * (c.height / r.height)]; };
    const d = (e: PointerEvent) => { on = true; c.setPointerCapture(e.pointerId); const [a, b] = pos(e); x.beginPath(); x.moveTo(a, b); }, m = (e: PointerEvent) => { if (!on) return; const [a, b] = pos(e); x.lineTo(a, b); x.stroke(); drawn.current = true; }, u = () => { on = false; };
    c.addEventListener('pointerdown', d); c.addEventListener('pointermove', m); c.addEventListener('pointerup', u); return () => { c.removeEventListener('pointerdown', d); c.removeEventListener('pointermove', m); c.removeEventListener('pointerup', u); }; }, []);
  if (value) return <div className="jx-sec"><b>Collected · signed</b><img className="jx-sig" src={value} alt="Signature" /><small>{at ? new Date(at).toLocaleString() : ''}</small></div>;
  return <div className="jx-sec"><b>Pickup signature</b><small>The customer signs here on the tablet when they collect the phone.</small><canvas ref={ref} className="jx-pad" width={600} height={180} /><div className="cr-acts"><button type="button" className="cr-btn sm" onClick={() => { if (drawn.current && ref.current) onSign(ref.current.toDataURL('image/png')); }}>Confirm pickup</button><button type="button" className="cr-btn ghost sm" onClick={() => { const c = ref.current; if (c) { c.getContext('2d')!.clearRect(0, 0, c.width, c.height); drawn.current = false; } }}>Clear</button></div></div>;
}

const esc = (s: unknown) => String(s ?? '').replace(/[<&>]/g, (c) => ({ '<': '&lt;', '&': '&amp;', '>': '&gt;' }[c] as string));
function popup(title: string, body: string, css: string) { const w = window.open('', '_blank'); if (!w) return; w.document.write(`<!doctype html><meta charset="utf-8"><title>${esc(title)}</title><style>body{font:13px Arial,sans-serif;color:#26282B;margin:14px}${css}</style>${body}<script>setTimeout(()=>print(),300)<\/script>`); w.document.close(); }
function printTicket(f: JobX & { no: string; model: string; status: string; name?: string; phone?: string; problem?: string }) {
  const url = location.origin + '/account#repairs?job=' + encodeURIComponent(f.no);
  const chk = Object.entries(f.check || {}).filter(([, v]) => v).map(([k, v]) => `<li>${v === 'ok' ? '✓' : '✗'} ${esc(k)}</li>`).join('');
  popup('Ticket ' + f.no, `<div class="t"><div class="h"><b>SAM ELECTRONICS</b><small>Al Murar, Deira, Dubai · +971 4 273 3031</small></div><div class="g"><div><h1>${esc(f.no)}</h1><p><b>${esc(f.model)}</b> ${f.code ? '· ' + esc(f.code) : ''}</p><p>${esc(f.problem)}</p><p>${esc(f.name)} · ${esc(f.phone)}</p>${f.imei ? `<p>IMEI ${esc(f.imei)}</p>` : ''}<p>${new Date().toLocaleString()}</p></div>${qr(url)}</div>${chk ? `<ul>${chk}</ul>` : ''}<small>Keep this ticket. The final price is confirmed after the free check. Repairs carry a ${f.warrantyDays ?? 90}-day warranty from collection.</small></div>`,
    '.t{width:80mm;border:1px dashed #999;padding:4mm}.h{display:grid;border-bottom:2px solid #F7C032;padding-bottom:2mm;margin-bottom:2mm}.h small{color:#666;font-size:10px}.g{display:grid;grid-template-columns:1fr 26mm;gap:3mm;align-items:start}.g svg{width:26mm;height:26mm}h1{font:700 20px monospace;margin:0}p{margin:1mm 0}ul{columns:2;font-size:11px;padding-left:4mm}small{font-size:10px;color:#555}');
}
function printSticker(f: JobX & { no: string; model: string }) {
  const until = new Date(Date.now() + (f.warrantyDays ?? 90) * 864e5).toLocaleDateString();
  popup('Warranty ' + f.no, `<div class="s">${qr(location.origin + '/account#repairs?job=' + encodeURIComponent(f.no), 3)}<div><b>SAM ELECTRONICS</b><span>WARRANTY · ${esc(f.no)}</span><span>until ${esc(until)}</span></div></div>`,
    '.s{width:40mm;height:18mm;border:1px solid #26282B;border-radius:2mm;display:grid;grid-template-columns:15mm 1fr;gap:1.5mm;align-items:center;padding:1.5mm;box-sizing:border-box}.s svg{width:15mm;height:15mm}.s div{display:grid;font-size:7px;line-height:1.3}.s b{font-size:8px;letter-spacing:.06em}');
}
export const statusText = (st: string, j: { model: string; no: string; name: string }) => 'Hi ' + (j.name.split(' ')[0] || '') + ', ' + (STATUS_MSG[st] || 'your repair is: ' + st).replace('{model}', j.model || 'phone').replace('{no}', j.no) + ' · Sam Electronics';
