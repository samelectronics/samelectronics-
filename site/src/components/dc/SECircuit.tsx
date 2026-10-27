// Sam Circuit membership. Owner (28 Oct): rebuilt as two cards you make your own. SAM CIRCUIT is the customer card,
// SAM GRID the trade (wholesale) card. Pick one, type your name and shop, choose its finish and level: the card in 3D
// updates live as you type, tilts with the pointer and catches the light; register by invitation on WhatsApp.
// Styles in src/styles/circuit.css (the .cx block). The section is yellow (white → grey → YELLOW rotation).
'use client';
import React, { useMemo, useRef, useState } from 'react';

const T = (s: string) => (typeof window !== 'undefined' && (window as unknown as { seI18n?: { t: (x: string) => string } }).seI18n ? (window as unknown as { seI18n: { t: (x: string) => string } }).seI18n.t(s) : s);
const CARDS = {
  circuit: { name: 'SAM CIRCUIT', kind: 'Member card', for: 'For customers', levels: ['Connected', 'Charged', 'Supercharged', 'Fully Charged'], req: ['Your first order', 'AED 1,000 spent', 'AED 5,000 spent', 'AED 15,000 spent'],
    perks: [['Saved parts and order history', 'Repair status on your phone'], ['Priority stock alerts', 'Early access to deals'], ['Free diagnosis, always first in line', 'Birthday offer'], ['A personal adviser on WhatsApp', 'First pick of new arrivals']] },
  grid: { name: 'SAM GRID', kind: 'Trade card', for: 'For shops, traders and exporters', levels: ['Node', 'Hub', 'Network', 'Backbone'], req: ['Approved trade account', 'AED 10,000 a month', 'AED 50,000 a month', 'AED 150,000 a month'],
    perks: [['Trade prices on every grade', 'Bulk lists quoted the same day'], ['Trade price tiers', 'Credit on approved orders'], ['A dedicated account manager', 'Export paperwork handled'], ['First pick of incoming shipments', 'Custom stock reserved for you']] },
};
type Kind = keyof typeof CARDS;
const FIN = { circuit: [['gold', 'Gold'], ['graphite', 'Graphite'], ['pearl', 'Pearl']], grid: [['black', 'Black'], ['steel', 'Steel'], ['gold', 'Gold']] } as const;

export default function SECircuit() {
  const [kind, setKind] = useState<Kind>('circuit'), [name, setName] = useState(''), [shop, setShop] = useState(''), [lvl, setLvl] = useState(0), [fin, setFin] = useState<string>('gold');
  const card = useRef<HTMLDivElement>(null), C = CARDS[kind];
  const no = useMemo(() => { let h = kind === 'grid' ? 17 : 7; for (const ch of (name || 'SAM').toUpperCase()) h = (h * 31 + ch.charCodeAt(0)) % 999983; const s = String(h).padStart(6, '0'); return (kind === 'grid' ? 'SG ' : 'SC ') + s.slice(0, 3) + ' ' + s.slice(3) + ' ' + String(2600 + (h % 300)); }, [name, kind]);
  const wa = 'https://wa.me/' + ((typeof window !== 'undefined' && (window as unknown as { SE_DATA?: { contact?: { wa?: string } } }).SE_DATA?.contact?.wa) || '971503420015') + '?text=' + encodeURIComponent(`*${C.name} · ${C.kind.toUpperCase()} REQUEST*\n\nName: ${name.trim() || '—'}${shop.trim() ? '\nShop / company: ' + shop.trim() : ''}\nCard: ${C.name} (${C.levels[lvl]})\n\nPlease send me an invitation.\nSent from the Sam Electronics website`);
  const pick = (k: Kind) => { setKind(k); setLvl(0); setFin(FIN[k][0][0]); };
  const tilt = (e: React.PointerEvent) => { const c = card.current; if (!c) return; const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height; c.style.transform = `rotateX(${((0.5 - y) * 18).toFixed(2)}deg) rotateY(${((x - 0.5) * 24).toFixed(2)}deg)`; c.style.setProperty('--lx', (x * 100).toFixed(1) + '%'); c.style.setProperty('--ly', (y * 100).toFixed(1) + '%'); };
  const untilt = () => { const c = card.current; if (c) { c.style.transform = ''; c.style.setProperty('--lx', '30%'); c.style.setProperty('--ly', '20%'); } };
  return (
    <section id="circuit" data-tone="yel" data-screen-label="Sam Circuit" className="cx">
      <div className="cx-in">
        <div className="cx-l">
          <span className="cx-eb">SAM CIRCUIT · MEMBERSHIP</span>
          <h2 className="cx-h"><span>Two cards.</span> <span>Make yours.</span></h2>
          <p className="cx-p">One for customers, one for the trade. Type your name and watch your card come to life; we send the invitation on WhatsApp.</p>
          <div className="cx-pick" role="tablist">
            {(Object.keys(CARDS) as Kind[]).map((k) => (
              <button key={k} type="button" role="tab" aria-selected={kind === k} className={kind === k ? 'on' : ''} onClick={() => pick(k)}>
                <b>{CARDS[k].name}</b><small>{T(CARDS[k].for)}</small>
              </button>
            ))}
          </div>
          <div className="cx-form">
            <label><span>{T('Your name')}</span><input value={name} onChange={(e) => setName(e.target.value)} maxLength={22} placeholder={T('Type your name')} /></label>
            <label><span>{T(kind === 'grid' ? 'Shop or company' : 'Shop or company (optional)')}</span><input value={shop} onChange={(e) => setShop(e.target.value)} maxLength={28} placeholder={kind === 'grid' ? 'e.g. Al Murar Mobiles' : ''} /></label>
            <div className="cx-row"><span>{T('Finish')}</span><div className="cx-sw">{FIN[kind].map(([k, n]) => <button key={k} type="button" className={'f-' + k + (fin === k ? ' on' : '')} onClick={() => setFin(k)} aria-label={n} title={n} />)}</div></div>
            <div className="cx-row"><span>{T('Level')}</span><div className="cx-lv">{C.levels.map((l, i) => <button key={l} type="button" className={lvl === i ? 'on' : ''} onClick={() => setLvl(i)}>{T(l)}</button>)}</div></div>
          </div>
          <a className="cx-btn" href={wa} target="_blank" rel="noopener noreferrer">{T('Register by invitation on WhatsApp')}<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>
        </div>

        <div className="cx-r" onPointerMove={tilt} onPointerLeave={untilt}>
          <span className="cx-floor" aria-hidden="true" />
          <div ref={card} className={'cx-card k-' + kind + ' f-' + fin} key={kind}>
            <span className="cx-holo" aria-hidden="true" />
            <span className="cx-trace" aria-hidden="true"><svg viewBox="0 0 400 250"><path d="M0 190 H90 L120 160 H220 L250 130 H400" /><path d="M0 220 H140 L160 200 H300 L330 230 H400" /><path d="M260 0 V40 L290 70 H400" /></svg></span>
            <div className="cx-card-in">
              <span className="top"><b data-no-i18n="">{C.name}</b><svg width="22" height="22" viewBox="0 0 24 24"><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></svg></span>
              <span className="chip" aria-hidden="true"><i /><i /><i /></span>
              <span className="nm" data-no-i18n={name ? '' : undefined}>{name || T('Your name here')}</span>
              <span className="sh" data-no-i18n="">{shop || (kind === 'grid' ? T('Your shop') : ' ')}</span>
              <span className="bot"><span><small>{T(kind === 'grid' ? 'TRADE LEVEL' : 'LEVEL')}</small><b>{T(C.levels[lvl])}</b></span><span className="no" data-no-i18n="">{no}</span></span>
            </div>
          </div>
          <div className="cx-perks" key={kind + lvl}>
            <small>{T(C.levels[lvl])} · {T(C.req[lvl])}</small>
            {C.perks[lvl].map((p) => <span key={p}><i />{T(p)}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
}
