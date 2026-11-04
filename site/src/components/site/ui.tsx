'use client';
// P1 · Small building blocks shared by every page: the page hero (a compact home hero), stars, the "rise in" effect,
// translation of attribute text, and the add-to-cart flight.
import React, { useEffect, useRef } from 'react';

/** text that is not a DOM text node (placeholders, aria-labels, titles) goes through the dictionary here */
export const T = (s: string) => (typeof window !== 'undefined' && window.seI18n ? window.seI18n.t(s) : s);

// R11 (owner): every page title is a cinematic stage, like the teardown: a graphite studio, a soft light falling from above,
// blurred yellow lights drifting slowly in the distance, a reflective floor, fine grain, and one huge outlined word that
// belongs to that page only (a light sweeps across it). No circuits and no side pictures: the title area is only the title.
const WORD: Record<string, [string, number]> = { shop: ['PARTS', 0], deals: ['DEALS', 0], repair: ['REPAIR', 1], wholesale: ['TRADE', 2], worldwide: ['WORLD', 3], story: ['2003', 1], membership: ['CIRCUIT', 3], brands: ['BRANDS', 2], contact: ['HELLO', 0], account: ['BENCH', 1], faq: ['ANSWERS', 2], legal: ['TERMS', 3], cookies: ['COOKIES', 0], payments: ['PAY', 1], cart: ['CART', 2], samsoom: ['SAMSOOM', 3] };
export function PageHero({ eb, title, accent, sub, crumb, children }: { eb: string; title: string; accent?: string; sub?: string; crumb?: [string, string?][]; children?: React.ReactNode; right?: React.ReactNode; seed?: number }) {
  const key = typeof location !== 'undefined' ? location.pathname.split('/')[1] || 'home' : 'home', [word, v] = WORD[key] || [(eb.split(/[·&]/)[0] || '').trim().split(' ')[0], 0];
  return (
    <section className="sp-hero sp-cine" data-tone="dark" data-v={v}>
      <div className="cine-bg" aria-hidden="true">
        <i className="cine-wall" /><i className="cine-beam" />
        <span className="cine-bokeh">{[0, 1, 2, 3, 4, 5, 6, 7].map((k) => <i key={k} style={{ ['--k' as string]: k } as React.CSSProperties} />)}</span>
        <i className="cine-floor" /><i className="cine-grain" />
      </div>
      <span className="cine-word" style={{ ['--n' as string]: String(word).length }} aria-hidden="true" data-no-i18n="">{word}</span>
      <div className="sp-wrap sp-hero-in">
        <div className="sp-hero-l">
          {crumb ? (
            <nav className="sp-crumb" aria-label="Breadcrumb">
              <a href="/">Home</a>
              {crumb.map(([l, h]) => (<React.Fragment key={l}><i />{h ? <a href={h}>{l}</a> : <span>{l}</span>}</React.Fragment>))}
            </nav>
          ) : null}
          <span className="sp-eb">{eb}</span>
          <h1 className="sp-h1">{title}{accent ? <><br /><em>{accent}</em></> : null}</h1>
          {sub ? <p className="sp-p">{sub}</p> : null}
          {children}
        </div>
      </div>
    </section>
  );
}

export function Stars({ v, n }: { v: number; n?: number }) {
  return (
    <span className="sp-stars" aria-label={v.toFixed(1) + ' / 5'}>
      {[0, 1, 2, 3, 4].map((i) => { const f = Math.max(0, Math.min(1, v - i)); return (
        <svg key={i} viewBox="0 0 24 24"><defs><linearGradient id={'sg' + i + '-' + Math.round(f * 10)}><stop offset={f} stopColor="currentColor" /><stop offset={f} stopColor="#D5D7DA" /></linearGradient></defs><path fill={'url(#sg' + i + '-' + Math.round(f * 10) + ')'} d="M12 2l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 16.8 6.1 20.1l1.3-6.6L2.5 8.9l6.6-.8z" /></svg>
      ); })}
      {n != null ? <small style={{ marginInlineStart: 6, color: '#6A6D72', font: '500 12px Inter' }}>({n})</small> : null}
    </span>
  );
}

/** children with data-rise fade up once they scroll into view */
export function useRise(dep?: unknown) {
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    const scan = () => document.querySelectorAll('[data-rise]:not(.in)').forEach((el) => io.observe(el));
    scan(); const t = window.setTimeout(scan, 400);
    // R11: anything that appears later (a model's repairs, a filtered list) fades in too, never stays invisible
    let q = 0; const mo = new MutationObserver(() => { if (!q) q = window.setTimeout(() => { q = 0; scan(); }, 60); });
    mo.observe(document.body, { childList: true, subtree: true });
    const safety = window.setInterval(() => document.querySelectorAll('[data-rise]:not(.in)').forEach((el) => { const r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) el.classList.add('in'); }), 1500);
    return () => { io.disconnect(); mo.disconnect(); window.clearTimeout(t); window.clearTimeout(q); window.clearInterval(safety); };
  }, [dep]);
}

/** the impressive add-to-cart: the photo flies along an arc into the cart icon, which bounces; sparks + toast come from the frame */
export function flyToCart(from: HTMLElement | null, id: string, ev?: { clientX: number; clientY: number }) {
  window.dispatchEvent(new CustomEvent('se:cart', { detail: { id, clientX: ev?.clientX, clientY: ev?.clientY } }));
  const cart = document.querySelector('[data-navcart]') as HTMLElement | null;
  if (!from || !cart || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const a = from.getBoundingClientRect(), b = cart.getBoundingClientRect();
  const c = from.cloneNode(true) as HTMLElement;
  Object.assign(c.style, { position: 'fixed', left: a.left + 'px', top: a.top + 'px', width: a.width + 'px', height: a.height + 'px', zIndex: '200', pointerEvents: 'none', margin: '0', borderRadius: '16px', filter: 'drop-shadow(0 18px 30px rgba(0,0,0,.35))' });
  document.body.appendChild(c);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const anim = c.animate([
    { transform: 'translate(0,0) scale(1) rotate(0deg)', opacity: 1 },
    { transform: `translate(${dx * 0.45}px, ${dy * 0.45 - 140}px) scale(.6) rotate(-12deg)`, opacity: 1, offset: 0.5 },
    { transform: `translate(${dx}px, ${dy}px) scale(.08) rotate(-28deg)`, opacity: 0.4 },
  ], { duration: 820, easing: 'cubic-bezier(.4,0,.2,1)' });
  anim.onfinish = () => { c.remove(); cart.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.35) rotate(-8deg)' }, { transform: 'scale(.92)' }, { transform: 'scale(1)' }], { duration: 520, easing: 'cubic-bezier(.2,1.4,.4,1)' }); };
}

/** a number that counts up when it first appears */
export function CountUp({ to, ms = 1200 }: { to: number; ms?: number }) {
  const r = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = r.current; if (!el) return; let raf = 0;
    const io = new IntersectionObserver(([e]) => { if (!e.isIntersecting) return; io.disconnect(); const t0 = performance.now(); const tick = (n: number) => { const k = Math.min(1, (n - t0) / ms); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))).toLocaleString('en-US'); if (k < 1) raf = requestAnimationFrame(tick); }; raf = requestAnimationFrame(tick); });
    io.observe(el); return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to, ms]);
  return <span ref={r}>0</span>;
}
