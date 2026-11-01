'use client';
// R9 · on every page: the seasonal ribbon (Ramadan, Eid, National Day…) and the pop-up ad, both from the Control Room.
// The pop-up shows once per visitor per campaign, after its delay, never over a dialog. Styles: dc-base.css (.spm-*).
import React, { useEffect, useState } from 'react';
import { siteRaw } from '@/lib/catalog';
import { POPUP_DEFAULT, EVENT_DEFAULT, EVENTS, active, type Popup, type EventCfg } from '@/lib/promo';

const T = (s: string) => (typeof window !== 'undefined' && window.seI18n ? window.seI18n.t(s) : s);
export default function SitePromo() {
  const [ev, setEv] = useState<EventCfg | null>(null), [pop, setPop] = useState<Popup | null>(null), [show, setShow] = useState(false), [hideEv, setHideEv] = useState(false);
  useEffect(() => {
    const e = { ...EVENT_DEFAULT, ...siteRaw<Partial<EventCfg>>('event', {}) }, p = { ...POPUP_DEFAULT, ...siteRaw<Partial<Popup>>('popup', {}) };
    if (e.on && EVENTS[e.id] && active(e.from, e.to)) { setEv(e); try { setHideEv(sessionStorage.getItem('se-ev-x') === e.id); } catch { /* */ } }
    const path = location.pathname; if (path.startsWith('/staff')) return;
    if (p.on && active(p.from, p.to) && (p.pages === 'all' || (p.pages === 'home' && path === '/') || (p.pages === 'shop' && path.startsWith('/shop')))) {
      let seen = false; try { seen = localStorage.getItem('se-pop-seen') === p.id; } catch { /* */ }
      if (!seen) { setPop(p); const t = window.setTimeout(function tryShow() { if (document.querySelector('.sc2-banner, .sc2-veil, .st-veil, .st-offer')) { window.setTimeout(tryShow, 4000); return; } setShow(true); try { localStorage.setItem('se-pop-seen', p.id); } catch { /* */ } }, Math.max(2, p.delay) * 1000); return () => window.clearTimeout(t); }
    }
  }, []);
  const E = ev ? EVENTS[ev.id] : null;
  return (
    <>
      {E && ev && !hideEv ? <div className="spm-ev" style={{ background: E.bg, color: E.ink }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={E.icon} /></svg><span>{T(ev.msg || E.msg)}</span><button type="button" aria-label={T('Close')} onClick={() => { setHideEv(true); try { sessionStorage.setItem('se-ev-x', ev.id); } catch { /* */ } }}>✕</button></div> : null}
      {pop && show ? (
        <div className="sc2-veil" onClick={(e) => { if (e.target === e.currentTarget) setShow(false); }}>
          <div className="spm-pop" role="dialog" aria-label={T(pop.title)}>
            <button type="button" className="st-x spm-x" data-sound="close" onClick={() => setShow(false)}>✕</button>
            {pop.img ? <span className="spm-img"><img src={pop.img} alt="" /></span> : null}
            <div className="spm-txt"><span className="sp-eb">{T('OFFER')}</span><b>{T(pop.title)}</b><p>{T(pop.text)}</p>
              <span className="spm-acts"><a className="st-btn st-go" href={pop.href} onClick={() => setShow(false)}>{T(pop.cta)}</a><button type="button" className="st-btn st-grey" onClick={() => setShow(false)}>{T('Not now')}</button></span></div>
          </div>
        </div>
      ) : null}
    </>
  );
}
