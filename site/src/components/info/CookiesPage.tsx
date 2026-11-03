'use client';
// R10 B4 / P12 · the full Cookies page: the four kinds, named after phone parts, each with its switch and a "Read more"
// (what it stores, how long, why, an example). Choices are saved with their date, the same store as the banner.
import React, { useEffect, useState } from 'react';
import { PageHero, T, useRise } from '@/components/site/ui';
import { CATS, CatIcon } from '@/components/site/SiteControls';
import { prefs, setPrefs } from '@/lib/prefs';

type K = 'memory' | 'signal' | 'booster';
export default function CookiesPage() {
  const [c, setC] = useState({ memory: false, signal: false, booster: false }), [at, setAt] = useState(0), [open, setOpen] = useState<string | null>(null), [saved, setSaved] = useState(false);
  useEffect(() => { const p = prefs().consent; if (p) { setC({ memory: p.memory, signal: p.signal, booster: p.booster }); setAt(p.at); } }, []);
  useRise();
  const save = (v = c) => { const now = Date.now(); setPrefs({ consent: { ...v, at: now } }); setC(v); setAt(now); setSaved(true); window.setTimeout(() => setSaved(false), 2400); };
  return (
    <>
      <PageHero eb={T('COOKIES')} title={T('Four little parts.')} accent={T('You choose.')} crumb={[[T('Legal'), '/legal'], [T('Cookies')]]} seed={33}
        sub={T('We named our cookies after phone parts, so you can see what each one does at a glance. Only the Battery is always on.')} />
      <section className="sp-sec w"><div className="sp-wrap ck">
        <div className="ck-bar" data-rise>
          <span>{at ? T('Your choice was saved on') + ' ' + new Date(at).toLocaleString() : T('You have not chosen yet.')}</span>
          <span className="ck-acts"><button type="button" className="sp-btn sm ghost" onClick={() => save({ memory: false, signal: false, booster: false })}>{T('Only the Battery')}</button><button type="button" className="sp-btn sm" onClick={() => save({ memory: true, signal: true, booster: true })}>{T('Allow all')}</button></span>
        </div>
        <div className="ck-grid">
          {CATS.map((x, i) => { const on = x.k === 'core' ? true : c[x.k as K]; return (
            <div key={x.k} className={'ck-c' + (on ? ' on' : '')} data-rise style={{ ['--i' as string]: i }}>
              <div className="ck-h"><span className="ck-ic"><CatIcon k={x.k} /></span><span><b>{T(x.n)}</b><small>{T(x.type)}</small></span>
                <button type="button" role="switch" aria-checked={on} disabled={x.k === 'core'} className="ck-sw" onClick={() => x.k !== 'core' && save({ ...c, [x.k]: !c[x.k as K] })} aria-label={T(x.n)}><i /></button></div>
              <p className="sp-p">{T(x.d)}</p>
              <button type="button" className="ck-more" aria-expanded={open === x.k} onClick={() => setOpen(open === x.k ? null : x.k)}>{open === x.k ? T('Less') : T('Read more')}</button>
              {open === x.k ? <dl className="ck-dl"><dt>{T('What it stores')}</dt><dd>{T(x.what)}</dd><dt>{T('How long')}</dt><dd>{T(x.long)}</dd><dt>{T('Why')}</dt><dd>{T(x.why)}</dd><dt>{T('Example')}</dt><dd>{T(x.ex)}</dd></dl> : null}
            </div>); })}
        </div>
        <p className="sp-muted" data-rise>{T('You can also clear everything in your browser at any time; the site then forgets your cart and preferences on that device.')} <a href="/legal#privacy">{T('Privacy policy')}</a></p>
        {saved ? <div className="ck-toast" role="status">{T('Saved')}</div> : null}
      </div></section>
    </>
  );
}
