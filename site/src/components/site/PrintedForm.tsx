'use client';
// Owner (16 Nov): every booking / quote / application form on the detail pages looks like Home's request console:
// a dark console with the fields, and a little printer next to it that prints the work order line by line while
// you type. On send the slip tears off and flies away. Styles reuse Home's console (visit.css) plus .pf in pages.css.
import React, { useEffect, useMemo, useState } from 'react';
import { T } from '@/components/site/ui';
import { play } from '@/lib/sound';

export type PField = { k: string; label: string; kind?: 'text' | 'tel' | 'email' | 'area' | 'datetime' | 'select' | 'chips'; opts?: [string, string][]; req?: boolean; ph?: string; wide?: boolean; slip?: string };

export default function PrintedForm({ eb, title, fields, init, lines = [], doc = 'WORK ORDER', send, cta = 'Send on WhatsApp', done, note }: {
  eb: string; title: string; fields: PField[]; init?: Record<string, string>; lines?: [string, string][]; doc?: string;
  send: (v: Record<string, string>) => Promise<string | void> | string | void; cta?: string; done?: (no: string, v: Record<string, string>) => React.ReactNode; note?: React.ReactNode;
}) {
  const [v, setV] = useState<Record<string, string>>(() => Object.fromEntries(fields.map((f) => [f.k, init?.[f.k] ?? (f.kind === 'select' || f.kind === 'chips' ? f.opts?.[0]?.[0] || '' : '')])));
  const [st, setSt] = useState<'' | 'tear' | 'done'>(''), [no, setNo] = useState(''), [need, setNeed] = useState(false);
  useEffect(() => { if (init) setV((x) => { const y = { ...x }; Object.entries(init).forEach(([k, val]) => { if (val && !x[k]) y[k] = val; }); return y; }); }, [init?.name, init?.phone, init?.email]); // eslint-disable-line react-hooks/exhaustive-deps
  const ref = useMemo(() => 'SE-' + Math.random().toString(36).slice(2, 7).toUpperCase(), []);
  const show = (f: PField) => { const x = v[f.k] || ''; if (!x) return ''; if (f.kind === 'select' || f.kind === 'chips') return T((f.opts || []).find((o) => o[0] === x)?.[1] || x); if (f.kind === 'datetime') { try { return new Date(x).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }); } catch { return x; } } return x; };
  const req = fields.filter((f) => f.req), filled = req.filter((f) => (v[f.k] || '').trim()).length, ok = filled === req.length;
  const slip = [...lines, ...fields.filter((f) => f.slip !== '' && show(f)).map((f) => [T(f.slip || f.label).toUpperCase(), show(f)] as [string, string])];
  const go = async (e: React.FormEvent) => {
    e.preventDefault(); if (!ok) { setNeed(true); return; } setNeed(false);
    setSt('tear'); play('success');
    const r = await send(v); setNo(typeof r === 'string' && r ? r : ref);
    window.setTimeout(() => setSt('done'), 1400);
  };
  if (st === 'done' && done) return <div className="pf pf-done">{done(no, v)}</div>;
  return (
    <form className="vs-con pf" onSubmit={go} noValidate>
      <span className="vs-eb">{T(eb)}</span>
      <h3 className="vs-h pf-h">{T(title)}</h3>
      <div className="vs-body pf-body">
        <div className="pf-fields">
          {fields.map((f, i) => (
            f.kind === 'chips' ? (
              <div key={f.k} className="vs-f vs-opt pf-f wide" style={{ animationDelay: i * 0.05 + 's' }}>
                <span>{T(f.label)}</span>
                <div className="vs-chips">{(f.opts || []).map(([k, l]) => <button key={k} type="button" className={v[f.k] === k ? 'on' : ''} aria-pressed={v[f.k] === k} onClick={() => setV({ ...v, [f.k]: k })}>{T(l)}</button>)}</div>
              </div>
            ) : (
              <label key={f.k} className={'vs-f pf-f' + (f.wide || f.kind === 'area' ? ' wide' : '') + (need && f.req && !(v[f.k] || '').trim() ? ' bad' : '')} style={{ animationDelay: i * 0.05 + 's' }}>
                <span>{T(f.label)}{f.req ? <em className="pf-req" aria-hidden="true">*</em> : null}</span>
                {f.kind === 'area' ? <textarea value={v[f.k]} onChange={(e) => setV({ ...v, [f.k]: e.target.value })} placeholder={f.ph ? T(f.ph) : ''} rows={3} />
                  : f.kind === 'select' ? <select value={v[f.k]} onChange={(e) => setV({ ...v, [f.k]: e.target.value })}>{(f.opts || []).map(([k, l]) => <option key={k} value={k}>{T(l)}</option>)}</select>
                  : <input type={f.kind === 'datetime' ? 'datetime-local' : f.kind === 'email' ? 'email' : f.kind === 'tel' ? 'tel' : 'text'} value={v[f.k]} onChange={(e) => setV({ ...v, [f.k]: e.target.value })} placeholder={f.ph ? T(f.ph) : ''} required={f.req} />}
              </label>
            )
          ))}
          <div className="vs-prog pf-prog"><span className="bar"><i style={{ transform: 'scaleX(' + (req.length ? filled / req.length : 1) + ')' }} /></span><small><b data-no-i18n="">{filled} / {req.length}</b> <span>{T('fields printed')}</span></small></div>
          {need ? <p className="vs-need" role="alert">{T('Fill in the fields marked * to send.')}</p> : null}
          {note}
          <div className={'vs-send' + (ok ? ' ready' : '')}><button type="submit" className={'vs-btn yel pf-go' + (/whatsapp/i.test(cta) ? ' wa-ic' : '')}>{/whatsapp/i.test(cta) ? <i className="ct-ic wa" aria-hidden="true" style={{ width: 18, height: 18 }} /> : null}{T(cta)} <i aria-hidden="true">→</i></button></div>
        </div>
        <div className="vs-printer pf-printer" aria-hidden="true">
          <span className="vs-slot" />
          <div className="vs-slip-wrap">
            <div className={'vs-slip' + (st === 'tear' ? ' tear wa' : '')} style={{ ['--n' as string]: slip.length } as React.CSSProperties}>
              <span className="vs-perf" />
              <div className="vs-slip-h"><b>{T(doc)}</b><span data-no-i18n="">{ref}</span></div>
              {slip.map(([k, x]) => <div key={k} className="vs-line pf-line"><span>{k}</span><b data-no-i18n="">{x}</b></div>)}
              {!slip.length ? <div className="vs-line pf-line pf-empty"><span>{T('Type on the left')}</span><b>…</b></div> : null}
              <div className="vs-line"><span>STATUS</span><em>{st ? 'SENT' : 'NEW'}</em></div>
              <span className="vs-bars" />
              <span className="vs-foot">Sam Electronics · Al Murar, Deira</span>
              {st ? <span className="vs-sent">SENT</span> : null}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
