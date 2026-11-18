'use client';
// Owner (18 Nov): "a dedicated place for complaints: filing complaints with full details and different cases (staff, items,
// products, orders, account, Samsoom…)". /complaints: pick the case, give the details, get a case number. The team is told
// at once (Control Room inbox, topic "Complaint · …"), and the customer can follow their cases on this device.
import React, { useEffect, useState } from 'react';
import { PageHero, T } from '@/components/site/ui';
import { backend } from '@/lib/backend';

type Case = { id: string; type: string; subject: string; at: number; status: string };
const KEY = 'se-complaints';
const CASES: [string, string, string][] = [
  ['product', 'A part or product', 'Faulty, wrong grade, not as described'],
  ['order', 'An order or delivery', 'Late, missing, damaged, wrong item'],
  ['repair', 'A repair', 'The fix, the time it took, the result'],
  ['staff', 'A member of staff', 'Service at the counter, on the phone or online'],
  ['price', 'A price or invoice', 'Charged wrong, VAT, refund amount'],
  ['account', 'My account or the website', 'Sign-in, card points, a page not working'],
  ['samsoom', 'A Samsoom answer', 'Something Samsoom said that was wrong'],
  ['other', 'Something else', 'Anything we have not listed'],
];
const OUTCOMES = ['Replacement', 'Refund', 'Repair again', 'A call back', 'An apology', 'Just letting you know'];
const read = (): Case[] => { try { const v = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v : []; } catch { return []; } };

export default function ComplaintsPage() {
  const [type, setType] = useState(''), [subject, setSubject] = useState(''), [order, setOrder] = useState(''), [item, setItem] = useState(''), [staff, setStaff] = useState(''), [when, setWhen] = useState('');
  const [what, setWhat] = useState(''), [want, setWant] = useState(''), [name, setName] = useState(''), [email, setEmail] = useState(''), [phone, setPhone] = useState(''), [contact, setContact] = useState('WhatsApp');
  const [photo, setPhoto] = useState(''), [busy, setBusy] = useState(false), [done, setDone] = useState<Case | null>(null), [mine, setMine] = useState<Case[]>([]);
  useEffect(() => {
    setMine(read());
    backend.me().then((u) => { if (u) { setName(u.name || ''); setEmail(u.email || ''); setPhone((u as { phone?: string }).phone || ''); } }).catch(() => {});
    const q = new URLSearchParams(location.search); const t = q.get('type'); if (t && CASES.some((c) => c[0] === t)) setType(t); const o = q.get('order'); if (o) setOrder(o);
  }, []);
  const pick = (f?: File | null) => { if (!f || !/^image\//.test(f.type)) return; const r = new FileReader(); r.onload = () => { const im = new Image(); im.onload = () => { const k = Math.min(1, 900 / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = im.width * k; c.height = im.height * k; c.getContext('2d')!.drawImage(im, 0, 0, c.width, c.height); setPhoto(c.toDataURL('image/jpeg', 0.78)); }; im.src = String(r.result); }; r.readAsDataURL(f); };
  const label = (k: string) => CASES.find((c) => c[0] === k)?.[1] || k;
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!type || !what.trim() || !name.trim() || (!email.trim() && !phone.trim())) return;
    setBusy(true);
    const id = 'CMP-' + Date.now().toString(36).toUpperCase().slice(-6);
    const lines = [
      'Case ' + id + ' · ' + label(type), subject ? 'Subject: ' + subject : '', order ? 'Order / invoice: ' + order : '', item ? 'Part / product: ' + item : '', staff ? 'Staff member: ' + staff : '', when ? 'When: ' + when : '',
      '', what.trim(), '', want ? 'Wanted outcome: ' + want : '', 'Contact by: ' + contact + (phone ? ' · ' + phone : '') + (email ? ' · ' + email : ''), photo ? '[photo attached]' : '', 'Page: /complaints',
    ].filter((x, i, a) => x || (a[i - 1] && a[i - 1] !== ''));
    await backend.send({ name: name.trim(), email: email.trim() || undefined, topic: 'Complaint · ' + label(type), text: lines.join('\n') + (photo ? '\n' + photo : '') }).catch(() => null);
    const c: Case = { id, type, subject: subject || label(type), at: Date.now(), status: 'Received' };
    const l = [c, ...read()].slice(0, 30); try { localStorage.setItem(KEY, JSON.stringify(l)); } catch { /* */ }
    setMine(l); setDone(c); setBusy(false); window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const reset = () => { setDone(null); setType(''); setSubject(''); setOrder(''); setItem(''); setStaff(''); setWhen(''); setWhat(''); setWant(''); setPhoto(''); };

  return (
    <>
      <PageHero eb={T('COMPLAINTS')} title={T('Something went wrong?')} accent={T('Tell us everything.')} crumb={[[T('Contact'), '/contact'], [T('Complaints')]]} seed={57}
        sub={T('Every complaint gets a case number and goes straight to the management team. We answer within one working day.')} />
      <section className="sp-sec w"><div className="sp-wrap cp">
        {done ? (
          <div className="cp-done" role="status">
            <span className="cp-ok"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5 9-10" /></svg></span>
            <small className="cp-k">{T('Case number')}</small>
            <b className="cp-id" data-no-i18n="">{done.id}</b>
            <p>{T('Thank you. The management team has your complaint and will contact you within one working day.')}</p>
            <ol className="cp-steps"><li className="on">{T('Received')}</li><li>{T('Being looked at')}</li><li>{T('Answered')}</li><li>{T('Closed')}</li></ol>
            <span className="cp-acts"><button type="button" className="sp-btn" onClick={reset}>{T('File another complaint')}</button><a className="sp-btn ghost" href="/contact">{T('Back to contact')}</a></span>
          </div>
        ) : (
          <form className="cp-form" onSubmit={submit}>
            <div className="cp-step"><em>01</em><b>{T('What is it about?')}</b></div>
            <div className="cp-types">{CASES.map(([k, l, d]) => <button key={k} type="button" className={type === k ? 'on' : ''} onClick={() => setType(k)} aria-pressed={type === k}><b>{T(l)}</b><small>{T(d)}</small></button>)}</div>
            {type ? (
              <>
                <div className="cp-step"><em>02</em><b>{T('The details')}</b></div>
                <div className="cp-grid">
                  <label><span>{T('Subject')}</span><input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder={T('In a few words')} /></label>
                  <label><span>{T('Order or invoice number')}</span><input value={order} onChange={(e) => setOrder(e.target.value)} placeholder="SE-2041" /></label>
                  {type === 'product' || type === 'order' || type === 'repair' || type === 'price' ? <label><span>{T('Part or product')}</span><input value={item} onChange={(e) => setItem(e.target.value)} placeholder={T('e.g. iPhone 13 screen, Original')} /></label> : null}
                  {type === 'staff' || type === 'repair' ? <label><span>{T('Staff member (if you know)')}</span><input value={staff} onChange={(e) => setStaff(e.target.value)} placeholder={T('Name or description')} /></label> : null}
                  <label><span>{T('When did it happen?')}</span><input type="date" value={when} onChange={(e) => setWhen(e.target.value)} /></label>
                </div>
                <label className="cp-wide"><span>{T('What happened?')} *</span><textarea rows={6} value={what} onChange={(e) => setWhat(e.target.value)} placeholder={T('Tell us what happened, step by step. The more we know, the faster we can fix it.')} required /></label>
                <div className="cp-photo">
                  {photo ? <span className="cp-ph"><img src={photo} alt={T('Your photo')} /><button type="button" onClick={() => setPhoto('')} aria-label={T('Remove the photo')}>×</button></span> : null}
                  <label className="sp-btn ghost sm"><input type="file" accept="image/*" hidden onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ''; }} />{photo ? T('Change the photo') : T('Add a photo')}</label>
                  <small>{T('A photo of the part, the box or the invoice helps a lot.')}</small>
                </div>
                <div className="cp-step"><em>03</em><b>{T('What would make it right?')}</b></div>
                <div className="cp-chips">{OUTCOMES.map((o) => <button key={o} type="button" className={want === o ? 'on' : ''} onClick={() => setWant(want === o ? '' : o)}>{T(o)}</button>)}</div>
                <div className="cp-step"><em>04</em><b>{T('How can we reach you?')}</b></div>
                <div className="cp-grid">
                  <label><span>{T('Your name')} *</span><input value={name} onChange={(e) => setName(e.target.value)} required /></label>
                  <label><span>{T('E-mail')}</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
                  <label><span>{T('Phone or WhatsApp')}</span><input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+971 …" /></label>
                  <label><span>{T('Contact me by')}</span><select value={contact} onChange={(e) => setContact(e.target.value)}>{['WhatsApp', 'Phone call', 'E-mail'].map((x) => <option key={x} value={x}>{T(x)}</option>)}</select></label>
                </div>
                <div className="cp-send"><small>{T('Your complaint goes only to the management team. We never share it.')}</small><button type="submit" className="sp-btn" disabled={busy || !what.trim() || !name.trim() || (!email.trim() && !phone.trim())}>{busy ? T('Sending…') : T('Send my complaint')}</button></div>
              </>
            ) : null}
          </form>
        )}
        {mine.length ? (
          <aside className="cp-mine">
            <b>{T('Your cases on this device')}</b>
            {mine.map((c) => <span key={c.id}><em data-no-i18n="">{c.id}</em><span>{T(label(c.type))}<small>{new Date(c.at).toLocaleDateString()} · {T(c.status)}</small></span></span>)}
          </aside>
        ) : null}
      </div></section>
    </>
  );
}
