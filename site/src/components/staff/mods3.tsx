'use client';
// P5 · Control Room: Site & Samsoom editing, Accounting & VAT, Automated e-mails, Staff & roles, Audit log, Settings, My profile.
import React, { useEffect, useMemo, useState } from 'react';
import { backend, live, ROLE_NAMES, ROLE_PERMS, type Audit as AuditT, type Order, type Perm, type Role, type Staff } from '@/lib/backend';
import { rawProducts } from '@/lib/catalog';
import LiveSam from '@/components/samsoom/LiveSam';
import { Panel, Kpi, Bars, Table, Drawer, Badge, csv, can, money, when, useSetting } from './kit';

type P = { me: Staff; go: (m: string) => void };

// ── Site & Samsoom ───────────────────────────────────────────────────────────────────────────────────────────
export type Slide = { k: string; t: string; a: string; d: string; cta: string; href: string; img: string; bg: string; ink: string };
export const DEFAULT_SLIDES: Slide[] = [
  { k: 'THIS WEEK · SAMPLE OFFER', t: 'Battery week.', a: 'Up to 15% off.', d: 'Genuine cells, tested before they ship.', cta: 'Shop batteries', href: '/shop?cat=BAT', img: '/assets/pose/part-bat-960.webp', bg: 'linear-gradient(120deg,#F7C032,#FFD566)', ink: '#26282B' },
  { k: 'SERVICE PACK SCREENS', t: 'The original.', a: 'In its original box.', d: 'Same colour, brightness and touch as new.', cta: 'Shop screens', href: '/shop?cat=SCR', img: '/assets/pose/samsung-sp-960.webp', bg: 'linear-gradient(120deg,#26282B,#3D3E3F)', ink: '#FFFFFF' },
  { k: 'DEALS & ARRIVALS', t: 'Fresh stock.', a: 'Limited offers.', d: 'New shipments every week, and offers that end soon.', cta: 'See every deal', href: '/deals', img: '/assets/pose/part-cam-960.webp', bg: 'linear-gradient(120deg,#FFFFFF,#F2F3F4)', ink: '#26282B' },
];
export type SamCfg = { tour: boolean; welcome: string; greeting: string; emotes: string[]; rest: number };
export const DEFAULT_SAM: SamCfg = { tour: true, welcome: 'wave', greeting: '', emotes: ['wave', 'happy', 'think', 'wink', 'kiss', 'celebrate', 'blush', 'dabke'], rest: 2600 };
const EMOTES = ['wave', 'happy', 'think', 'kiss', 'dabke', 'yawn', 'celebrate', 'wink', 'sleep', 'blush', 'thanks', 'found', 'type', 'low', 'part'];
const IMGS = ['part-bat', 'part-flx', 'part-bcv', 'part-frm', 'part-cam', 'part-sml', 'part-board', 'samsung-sp', 'apple-sp', 'apple-gx', 'line-all', 'line-or', 'rep-fixed', 'rep-crack'];
const BGS: [string, string, string][] = [['Signal yellow', 'linear-gradient(120deg,#F7C032,#FFD566)', '#26282B'], ['Graphite', 'linear-gradient(120deg,#26282B,#3D3E3F)', '#FFFFFF'], ['White', 'linear-gradient(120deg,#FFFFFF,#F2F3F4)', '#26282B'], ['Night', 'linear-gradient(120deg,#1E2A4A,#3B2E52)', '#FFFFFF']];

export function SiteEditor({ me }: P) {
  const [tab, setTab] = useState(can(me, 'banners') ? 'banners' : can(me, 'samsoom') ? 'samsoom' : 'texts');
  const [slides, setSlides] = useSetting<Slide[]>('shop-banners', DEFAULT_SLIDES), [ann, setAnn] = useSetting('announcement', { on: false, text: 'New stock landed: iPhone 15 screens in every grade.', href: '/deals', tone: 'y' });
  const [sam, setSam] = useSetting<SamCfg>('samsoom', DEFAULT_SAM), [texts, setTexts] = useSetting<[string, string][]>('text-overrides', []);
  const [i, setI] = useState(0), [prev, setPrev] = useState('wave'), [ok, setOk] = useState('');
  const flash = (t: string) => { setOk(t); window.setTimeout(() => setOk(''), 2000); };
  const s = slides[i] || DEFAULT_SLIDES[0];
  const setS = (patch: Partial<Slide>) => setSlides(slides.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  return (
    <div className="cr-grid">
      <div className="cr-tabs">{[['banners', 'Shop banners', 'banners'], ['announce', 'Announcement bar', 'content'], ['samsoom', 'Samsoom', 'samsoom'], ['texts', 'Edit any text', 'content']].filter(([, , p]) => can(me, p as Perm)).map(([k, l]) => <button key={k} type="button" className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>)}{ok ? <Badge t={ok} tone="g" /> : null}</div>
      {tab === 'banners' ? (
        <>
          <Panel t="Banner slides" d="The big rotating advert at the top of the shop." className="span1">
            {slides.map((x, j) => <button key={j} type="button" className={'cr-slide' + (i === j ? ' on' : '')} onClick={() => setI(j)}><b>{x.t}</b><small>{x.k}</small></button>)}
            <div className="cr-acts"><button type="button" className="cr-btn sm" onClick={() => { setSlides([...slides, { ...DEFAULT_SLIDES[0], k: 'NEW SLIDE' }]); setI(slides.length); }}>+ Add slide</button>{slides.length > 1 ? <button type="button" className="cr-btn sm danger" onClick={() => { setSlides(slides.filter((_, j) => j !== i)); setI(0); }}>Delete this slide</button> : null}<button type="button" className="cr-btn sm ghost" onClick={() => { setSlides(DEFAULT_SLIDES); setI(0); }}>Reset</button></div>
          </Panel>
          <Panel t="Edit slide" className="span2">
            <div className="cr-preview" style={{ background: s.bg, color: s.ink }}><span><small>{s.k}</small><b>{s.t}<br /><em>{s.a}</em></b><span>{s.d}</span><i>{s.cta} →</i></span><img src={s.img} alt="" /></div>
            <div className="cr-form">
              <div className="cr-row2"><label>Small label<input className="cr-in" value={s.k} onChange={(e) => setS({ k: e.target.value })} /></label><label>Button text<input className="cr-in" value={s.cta} onChange={(e) => setS({ cta: e.target.value })} /></label></div>
              <div className="cr-row2"><label>Headline<input className="cr-in" value={s.t} onChange={(e) => setS({ t: e.target.value })} /></label><label>Second line<input className="cr-in" value={s.a} onChange={(e) => setS({ a: e.target.value })} /></label></div>
              <label>Description<input className="cr-in" value={s.d} onChange={(e) => setS({ d: e.target.value })} /></label>
              <label>Button opens<input className="cr-in" value={s.href} onChange={(e) => setS({ href: e.target.value })} placeholder="/shop?cat=BAT" /></label>
              <div><small>Picture</small><div className="cr-imgs">{IMGS.map((im) => <button key={im} type="button" className={s.img.includes('/' + im + '-') ? 'on' : ''} onClick={() => setS({ img: '/assets/pose/' + im + '-960.webp' })}><img src={'/assets/pose/' + im + '-240.webp'} alt="" /></button>)}</div></div>
              <div><small>Colour</small><div className="cr-bgs">{BGS.map(([n, bg, ink]) => <button key={n} type="button" className={s.bg === bg ? 'on' : ''} style={{ background: bg, color: ink }} onClick={() => setS({ bg, ink })}>{n}</button>)}</div></div>
              <small className="cr-muted">Saved as you type; the shop shows the new slides on the next visit.</small>
            </div>
          </Panel>
        </>
      ) : tab === 'announce' ? (
        <Panel t="Announcement bar" d="A thin bar under the menu on every page: offers, holidays, new stock." className="span3">
          <div className="cr-ann" data-tone={ann.tone}><span>{ann.text}</span><b>→</b></div>
          <div className="cr-form">
            <label className="cr-chk"><input type="checkbox" checked={ann.on} onChange={(e) => setAnn({ ...ann, on: e.target.checked })} /> Show the bar on the site</label>
            <label>Text<input className="cr-in" value={ann.text} onChange={(e) => setAnn({ ...ann, text: e.target.value })} /></label>
            <div className="cr-row2"><label>Link<input className="cr-in" value={ann.href} onChange={(e) => setAnn({ ...ann, href: e.target.value })} /></label><label>Colour<select className="cr-in" value={ann.tone} onChange={(e) => setAnn({ ...ann, tone: e.target.value })}><option value="y">Yellow</option><option value="d">Graphite</option><option value="g">Green</option><option value="r">Red</option></select></label></div>
          </div>
        </Panel>
      ) : tab === 'samsoom' ? (
        <>
          <Panel t="Samsoom" d="How he greets visitors and how he moves." className="span2">
            <div className="cr-form">
              <label className="cr-chk"><input type="checkbox" checked={sam.tour} onChange={(e) => setSam({ ...sam, tour: e.target.checked })} /> Welcome new visitors with the language choice and the tour</label>
              <label>Welcome message (empty = the standard one)<input className="cr-in" value={sam.greeting} onChange={(e) => setSam({ ...sam, greeting: e.target.value })} placeholder="I’m Samsoom, your parts assistant. Want a quick walk around?" /></label>
              <label>Welcome emote<select className="cr-in" value={sam.welcome} onChange={(e) => { setSam({ ...sam, welcome: e.target.value }); setPrev(e.target.value); }}>{EMOTES.map((x) => <option key={x}>{x}</option>)}</select></label>
              <div><small>Emotes he plays by himself (between them he blinks and follows the pointer)</small><div className="cr-emotes">{EMOTES.map((x) => <button key={x} type="button" className={sam.emotes.includes(x) ? 'on' : ''} onMouseEnter={() => setPrev(x)} onClick={() => setSam({ ...sam, emotes: sam.emotes.includes(x) ? sam.emotes.filter((y) => y !== x) : [...sam.emotes, x] })}>{x}</button>)}</div></div>
              <label>Pause between emotes: {(sam.rest / 1000).toFixed(1)} s<input type="range" min={1200} max={8000} step={200} value={sam.rest} onChange={(e) => setSam({ ...sam, rest: +e.target.value })} /></label>
              <button type="button" className="cr-btn ghost sm" onClick={() => { window.open('/?tour=1', '_blank'); flash('Opened the site with the tour'); }}>Preview the tour on the site</button>
            </div>
          </Panel>
          <Panel t="Preview"><div className="cr-sam"><LiveSam size={170} mood="idle" play={prev} rest={sam.rest} /></div><small className="cr-muted">Hover an emote to see it.</small></Panel>
        </>
      ) : (
        <Panel t="Edit any text" d="Replace any English text on the website: type it exactly as it appears, then what it should say. Other languages follow once translated." className="span3">
          <div className="cr-form">
            {texts.map(([a, b], j) => <div key={j} className="cr-row2 cr-tx"><input className="cr-in" value={a} onChange={(e) => setTexts(texts.map((x, k) => (k === j ? [e.target.value, x[1]] : x)))} placeholder="Text on the site now" /><span className="cr-txr"><input className="cr-in" value={b} onChange={(e) => setTexts(texts.map((x, k) => (k === j ? [x[0], e.target.value] : x)))} placeholder="New text" /><button type="button" className="cr-x" onClick={() => setTexts(texts.filter((_, k) => k !== j))}>×</button></span></div>)}
            <button type="button" className="cr-btn sm" onClick={() => setTexts([...texts, ['', '']])}>+ Add a text change</button>
          </div>
        </Panel>
      )}
    </div>
  );
}

// ── Accounting & VAT ─────────────────────────────────────────────────────────────────────────────────────────
type Expense = { id: string; at: number; desc: string; cat: string; amount: number; vat: number };
const ECATS = ['Stock purchase', 'Rent', 'Salaries', 'Shipping', 'Utilities', 'Marketing', 'Software', 'Other'];
export function Accounting({ me }: P) {
  const [orders, setOrders] = useState<Order[]>([]), [ex, setEx] = useSetting<Expense[]>('expenses', []), [period, setPeriod] = useState('quarter'), [add, setAdd] = useState(false);
  const [e, setE] = useState({ desc: '', cat: ECATS[0], amount: 0, vat: true });
  useEffect(() => { backend.allOrders().then(setOrders); }, []);
  const cost = useMemo(() => { const m = new Map(rawProducts().map((p) => [p.id, (p as { cost_price?: number }).cost_price || p.wholesale_price * 0.82])); return (o: Order) => o.lines.reduce((a, l) => a + (m.get(l.id) || l.unit * 0.7) * l.qty, 0); }, []);
  const now = new Date(), from = period === 'month' ? new Date(now.getFullYear(), now.getMonth(), 1) : period === 'quarter' ? new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1) : period === 'year' ? new Date(now.getFullYear(), 0, 1) : new Date(0);
  const O = orders.filter((o) => o.status !== 'Cancelled' && o.createdAt >= from.getTime()), E = ex.filter((x) => x.at >= from.getTime());
  const sales = O.reduce((a, o) => a + o.sub + o.ship, 0), outVat = O.reduce((a, o) => a + o.vat, 0), cogs = O.reduce((a, o) => a + cost(o), 0), gross = sales - cogs;
  const spend = E.reduce((a, x) => a + x.amount, 0), inVat = E.reduce((a, x) => a + x.vat, 0), net = gross - spend + inVat;
  const months = Array.from({ length: 6 }, (_, i) => { const a = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1), b = new Date(now.getFullYear(), now.getMonth() - 4 + i, 1); const os = orders.filter((o) => o.status !== 'Cancelled' && o.createdAt >= a.getTime() && o.createdAt < b.getTime()); return { l: a.toLocaleString('en-GB', { month: 'short' }), v: os.reduce((s, o) => s + o.sub, 0), v2: os.reduce((s, o) => s + cost(o), 0) }; });
  const addE = async (ev: React.FormEvent) => { ev.preventDefault(); const vat = e.vat ? Math.round((e.amount - e.amount / 1.05) * 100) / 100 : 0; await setEx([{ id: 'e' + Date.now(), at: Date.now(), desc: e.desc, cat: e.cat, amount: e.amount - vat, vat }, ...ex], e.desc); setAdd(false); setE({ desc: '', cat: ECATS[0], amount: 0, vat: true }); };
  return (
    <div className="cr-grid">
      <div className="cr-tabs">{[['month', 'This month'], ['quarter', 'This VAT quarter'], ['year', 'This year'], ['all', 'All time']].map(([k, l]) => <button key={k} type="button" className={period === k ? 'on' : ''} onClick={() => setPeriod(k)}>{l}</button>)}<span className="cr-sp" />{can(me, 'accounting') ? <button type="button" className="cr-btn y sm" onClick={() => setAdd(true)}>+ Add expense</button> : null}</div>
      <div className="cr-kpis">
        <Kpi l="Sales (excl. VAT)" v={money(sales)} s={O.length + ' orders'} tone="y" /><Kpi l="Cost of parts sold" v={money(cogs)} s="cost price, or estimate" /><Kpi l="Gross profit" v={money(gross)} s={sales ? Math.round((gross / sales) * 100) + '% margin' : '—'} tone="g" />
        <Kpi l="Expenses" v={money(spend)} s={E.length + ' entries'} /><Kpi l="VAT to pay" v={money(outVat - inVat)} s={'output ' + money(outVat) + ' − input ' + money(inVat)} tone="r" /><Kpi l="Net (est.)" v={money(net - inVat)} tone="d" />
      </div>
      <Panel t="Sales and cost of parts · 6 months" d="Yellow: sales excl. VAT · grey: cost of the parts sold" className="span2"><Bars data={months} h={200} fmt={money} /></Panel>
      <Panel t="VAT return (summary)" d="Standard-rated supplies in the UAE at 5%. Your accountant files it with the FTA.">
        <table className="cr-lines"><tbody>
          <tr><td>Standard-rated sales</td><td className="num">{money(sales)}</td></tr><tr><td>Output VAT</td><td className="num">{money(outVat)}</td></tr>
          <tr><td>Standard-rated expenses</td><td className="num">{money(spend)}</td></tr><tr><td>Recoverable input VAT</td><td className="num">{money(inVat)}</td></tr>
          <tr className="tot"><td>Net VAT payable</td><td className="num">{money(outVat - inVat)}</td></tr></tbody></table>
        <div className="cr-acts">
          <button type="button" className="cr-btn sm" onClick={() => csv('vat-' + period + '.csv', [['date', 'document', 'party', 'net', 'vat', 'gross', 'type'], ...O.map((o) => [when(o.createdAt), o.no, o.name, (o.sub + o.ship).toFixed(2), o.vat.toFixed(2), o.total.toFixed(2), 'sale']), ...E.map((x) => [when(x.at), x.id, x.desc, x.amount.toFixed(2), x.vat.toFixed(2), (x.amount + x.vat).toFixed(2), 'expense'])])}>VAT detail CSV</button>
          <button type="button" className="cr-btn sm ghost" onClick={() => csv('zoho-invoices.csv', [['Invoice Number', 'Invoice Date', 'Customer Name', 'Item Name', 'Quantity', 'Item Price', 'Item Tax %', 'Currency Code'], ...O.flatMap((o) => o.lines.map((l) => [o.no, new Date(o.createdAt).toISOString().slice(0, 10), o.name, l.title + ' · ' + l.grade, l.qty, l.unit.toFixed(2), 5, 'AED']))])}>Export for Zoho Books</button>
        </div>
      </Panel>
      <Panel t="Expenses" className="span3">
        <Table rows={E} search={(x) => x.desc + ' ' + x.cat} empty="No expenses in this period." cols={[{ k: 'd', l: 'Date', get: (x) => when(x.at), sort: (x) => x.at }, { k: 'n', l: 'Description', get: (x) => x.desc }, { k: 'c', l: 'Category', get: (x) => <Badge t={x.cat} /> }, { k: 'a', l: 'Net', get: (x) => money(x.amount), cls: 'num', sort: (x) => x.amount }, { k: 'v', l: 'VAT', get: (x) => money(x.vat), cls: 'num' }]} />
      </Panel>
      <Drawer open={add} onClose={() => setAdd(false)} title="Add expense">
        <form className="cr-form" onSubmit={addE}>
          <label>Description<input className="cr-in" required value={e.desc} onChange={(x) => setE({ ...e, desc: x.target.value })} /></label>
          <div className="cr-row2"><label>Category<select className="cr-in" value={e.cat} onChange={(x) => setE({ ...e, cat: x.target.value })}>{ECATS.map((c) => <option key={c}>{c}</option>)}</select></label><label>Amount paid (AED)<input className="cr-in" type="number" step="0.01" required value={e.amount || ''} onChange={(x) => setE({ ...e, amount: +x.target.value })} /></label></div>
          <label className="cr-chk"><input type="checkbox" checked={e.vat} onChange={(x) => setE({ ...e, vat: x.target.checked })} /> Includes 5% VAT (on a tax invoice)</label>
          <button type="submit" className="cr-btn y">Add expense</button>
        </form>
      </Drawer>
    </div>
  );
}

// ── Automated e-mails ────────────────────────────────────────────────────────────────────────────────────────
type Tpl = { id: string; name: string; when: string; on: boolean; subject: string; body: string };
const TPLS: Tpl[] = [
  { id: 'order-received', name: 'Order received', when: 'A customer places an order', on: true, subject: 'We received your order {{order}}', body: 'Hi {{name}},\n\nThank you for your order {{order}}. Our team confirms stock and price on WhatsApp shortly.\n\nTotal: {{total}} (incl. 5% VAT)\n\nSam Electronics · Al Murar, Deira, Dubai' },
  { id: 'order-status', name: 'Order status changed', when: 'Staff move an order to a new status', on: true, subject: 'Order {{order}}: {{status}}', body: 'Hi {{name}},\n\nYour order {{order}} is now: {{status}}.\n\nSam Electronics' },
  { id: 'welcome', name: 'Welcome · confirm your e-mail', when: 'Someone creates an account', on: true, subject: 'Your Sam Electronics code: {{code}}', body: 'Hi {{name}},\n\nWelcome to My Bench. Your confirmation code is {{code}}.\n\nSam Electronics' },
  { id: 'trade-approved', name: 'Trade account approved', when: 'A trade application is approved', on: true, subject: 'Your trade account is approved', body: 'Hi {{name}},\n\nGood news: your trade account is approved. Sign in to see trade prices on every part.\n\nSam Electronics' },
  { id: 'application', name: 'Application received', when: 'Someone applies (trade, job, card)', on: true, subject: 'We received your application', body: 'Hi {{name}},\n\nThank you for applying. Our management team will reply soon.\n\nSam Electronics' },
  { id: 'chat-reply', name: 'Reply to a message', when: 'Staff reply in the inbox and the visitor is gone', on: true, subject: 'New reply from Sam Electronics', body: 'Hi {{name}},\n\n{{message}}\n\nReply on the website or WhatsApp.\nSam Electronics' },
  { id: 'stock-alert', name: 'Back in stock / price drop', when: 'A starred part with an alert changes', on: false, subject: '{{product}} is back in stock', body: 'Hi {{name}},\n\n{{product}} is available again at {{price}}.\n\nSam Electronics' },
  { id: 'repair-ready', name: 'Repair ready', when: 'A repair job moves to Ready', on: true, subject: 'Your {{model}} is ready', body: 'Hi {{name}},\n\nYour {{model}} repair ({{job}}) is ready to collect.\n\nSam Electronics · Al Murar, Deira' },
];
export function Emails() {
  const [tpls, setTpls] = useSetting<Tpl[]>('email-templates', TPLS), [sel, setSel] = useState<Tpl | null>(null);
  const fill = (s: string) => s.replace(/{{name}}/g, 'Ahmed').replace(/{{order}}/g, 'SE-2026-1042').replace(/{{total}}/g, 'AED 420.00').replace(/{{status}}/g, 'Ready').replace(/{{code}}/g, '482913').replace(/{{message}}/g, 'Yes, we have it in stock.').replace(/{{product}}/g, 'iPhone 13 Screen · Original').replace(/{{price}}/g, 'AED 395').replace(/{{model}}/g, 'Galaxy A54').replace(/{{job}}/g, 'R-1021');
  return (
    <div className="cr-grid">
      <div className="cr-filters"><Badge t={live ? 'Sending through Resend' : 'Not connected yet: e-mails start when Supabase + Resend are connected (supabase/README.md)'} tone={live ? 'g' : 'y'} /></div>
      <Panel t="Automations" className="span3">
        <Table rows={tpls} onRow={setSel} cols={[{ k: 'o', l: 'On', w: '60px', get: (t) => <input type="checkbox" checked={t.on} onClick={(e) => e.stopPropagation()} onChange={(e) => setTpls(tpls.map((x) => (x.id === t.id ? { ...x, on: e.target.checked } : x)), t.id)} /> }, { k: 'n', l: 'E-mail', get: (t) => <span className="cr-two"><b>{t.name}</b><small>{t.subject}</small></span> }, { k: 'w', l: 'Sent when', get: (t) => t.when }]} />
      </Panel>
      <Drawer open={!!sel} onClose={() => setSel(null)} title={sel ? sel.name : ''} wide>
        {sel ? (
          <div className="cr-form">
            <label>Subject<input className="cr-in" value={sel.subject} onChange={(e) => setSel({ ...sel, subject: e.target.value })} /></label>
            <label>Message<textarea className="cr-in" rows={9} value={sel.body} onChange={(e) => setSel({ ...sel, body: e.target.value })} /></label>
            <small className="cr-muted">Placeholders: {'{{name}} {{order}} {{total}} {{status}} {{code}} {{message}} {{product}} {{price}} {{model}} {{job}}'}</small>
            <div className="cr-mail"><div className="cr-mh"><b>SAM ELECTRONICS</b><small>QUALITY · WARRANTY · PRICE</small></div><b>{fill(sel.subject)}</b><p>{fill(sel.body)}</p></div>
            <div className="cr-acts"><button type="button" className="cr-btn y" onClick={() => { setTpls(tpls.map((x) => (x.id === sel.id ? sel : x)), sel.id); setSel(null); }}>Save template</button><a className="cr-btn ghost" href={'mailto:?subject=' + encodeURIComponent(fill(sel.subject)) + '&body=' + encodeURIComponent(fill(sel.body))}>Send a test to myself</a></div>
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}

// ── Staff & roles ────────────────────────────────────────────────────────────────────────────────────────────
const PERMS: [Perm, string][] = [['products', 'Products'], ['prices', 'Prices'], ['stock', 'Stock'], ['orders', 'Orders'], ['repairs', 'Repairs'], ['customers', 'Customers'], ['approvals', 'Approvals'], ['chat', 'Inbox'], ['content', 'Site texts'], ['banners', 'Banners'], ['samsoom', 'Samsoom'], ['accounting', 'Accounting'], ['reports', 'Reports'], ['emails', 'E-mails'], ['staff', 'Staff'], ['settings', 'Settings'], ['audit', 'Audit']];
export function StaffForm({ s, self, onSave }: { s: Partial<Staff>; self?: boolean; onSave: (s: Partial<Staff>) => void }) {
  const [f, setF] = useState<Partial<Staff>>({ role: 'sales', perms: ROLE_PERMS.sales, active: true, branch: 'Dubai · Deira', ...s });
  const pic = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (!file) return; const r = new FileReader(); r.onload = () => { const img = new Image(); img.onload = () => { const c = document.createElement('canvas'), k = 320 / Math.max(img.width, img.height); c.width = img.width * k; c.height = img.height * k; c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height); setF({ ...f, photo: c.toDataURL('image/webp', 0.85) }); }; img.src = String(r.result); }; r.readAsDataURL(file); };
  return (
    <form className="cr-form" onSubmit={(e) => { e.preventDefault(); onSave(f); }}>
      <div className="cr-prof"><label className="cr-bigav">{f.photo ? <img src={f.photo} alt="" /> : (f.name || '?').slice(0, 1)}<input type="file" accept="image/*" hidden onChange={pic} /><small>Change photo</small></label>
        <div className="cr-form"><label>Full name<input className="cr-in" required value={f.name || ''} onChange={(e) => setF({ ...f, name: e.target.value })} /></label><label>Job title<input className="cr-in" value={f.title || ''} onChange={(e) => setF({ ...f, title: e.target.value })} /></label></div></div>
      <div className="cr-row2"><label>E-mail (log-in)<input className="cr-in" required type="email" disabled={self} value={f.email || ''} onChange={(e) => setF({ ...f, email: e.target.value })} /></label><label>Phone<input className="cr-in" value={f.phone || ''} onChange={(e) => setF({ ...f, phone: e.target.value })} /></label></div>
      {!self ? (
        <>
          <div className="cr-row2"><label>Role<select className="cr-in" value={f.role} onChange={(e) => setF({ ...f, role: e.target.value as Role, perms: ROLE_PERMS[e.target.value as Role] })}>{(Object.keys(ROLE_NAMES) as Role[]).map((r) => <option key={r} value={r}>{ROLE_NAMES[r]}</option>)}</select></label><label>Branch<select className="cr-in" value={f.branch} onChange={(e) => setF({ ...f, branch: e.target.value })}><option>Dubai · Deira</option><option>Madrid · Plaza Mayor</option></select></label></div>
          <div><small>What they can do (owner and managers can do everything)</small><div className="cr-perms">{PERMS.map(([p, l]) => <label key={p} className={(f.perms || []).includes(p) ? 'on' : ''}><input type="checkbox" disabled={f.role === 'owner' || f.role === 'manager'} checked={f.role === 'owner' || f.role === 'manager' || (f.perms || []).includes(p)} onChange={(e) => setF({ ...f, perms: e.target.checked ? [...(f.perms || []), p] : (f.perms || []).filter((x) => x !== p) })} />{l}</label>)}</div></div>
          <label className="cr-chk"><input type="checkbox" checked={f.active !== false} onChange={(e) => setF({ ...f, active: e.target.checked })} /> Active (can log in)</label>
          {!s.id ? <small className="cr-muted">{live ? 'They create their account with this e-mail on the site, then get this role.' : 'Demo: their first password is welcome123.'}</small> : null}
        </>
      ) : null}
      <button type="submit" className="cr-btn y">Save</button>
    </form>
  );
}
export function Team({ me }: P) {
  const [list, setList] = useState<Staff[]>([]), [ed, setEd] = useState<Partial<Staff> | null>(null), [err, setErr] = useState('');
  const load = () => backend.staffList().then(setList);
  useEffect(() => { load(); }, []);
  const save = async (s: Partial<Staff>) => { const r = await backend.saveStaff(s as Staff); if (r.ok) { setEd(null); load(); } else setErr(r.error); };
  return (
    <div className="cr-grid">
      <div className="cr-filters"><span className="cr-muted">Owner and managers have full control. Everyone else sees only their area.</span><span className="cr-sp" />{can(me, 'staff') ? <button type="button" className="cr-btn y sm" onClick={() => setEd({})}>+ Add staff member</button> : null}</div>
      <div className="cr-team span3">{list.map((s) => (
        <button key={s.id} type="button" className={'cr-mem' + (s.active ? '' : ' off')} onClick={() => can(me, 'staff') && setEd(s)}>
          <span className="cr-bigav">{s.photo ? <img src={s.photo} alt="" /> : s.name.slice(0, 1)}</span>
          <b>{s.name}</b><small>{s.title || ROLE_NAMES[s.role]}</small>
          <Badge t={ROLE_NAMES[s.role]} tone={s.role === 'owner' ? 'y' : s.role === 'manager' ? 'd' : undefined} />
          <span className="cr-pl">{(s.role === 'owner' || s.role === 'manager' ? ['everything'] : s.perms).join(' · ')}</span>
          <small>{s.lastSeen ? 'Last seen ' + when(s.lastSeen) : 'Never logged in'}</small>
        </button>
      ))}</div>
      <Drawer open={!!ed} onClose={() => { setEd(null); setErr(''); }} title={ed?.id ? ed.name || '' : 'New staff member'}>{ed ? <>{err ? <span className="cr-err">{err}</span> : null}<StaffForm s={ed} onSave={save} /></> : null}</Drawer>
    </div>
  );
}
export function MyProfile({ me }: P) {
  const [ok, setOk] = useState('');
  return <div className="cr-grid"><Panel t="My profile" d="Your photo and details, as the team sees them." className="span2">{ok ? <Badge t={ok} tone="g" /> : null}<StaffForm s={me} self onSave={async (s) => { const r = await backend.saveStaff({ ...me, name: s.name!, title: s.title, phone: s.phone, photo: s.photo } as Staff); setOk(r.ok ? 'Saved' : r.error); }} /></Panel></div>;
}

// ── Audit & settings ─────────────────────────────────────────────────────────────────────────────────────────
export function Audit() {
  const [list, setList] = useState<AuditT[]>([]);
  useEffect(() => { backend.audit().then(setList); }, []);
  return <div className="cr-grid"><Panel t="Everything that changed, and who changed it" className="span3" right={<button type="button" className="cr-btn ghost sm" onClick={() => csv('audit.csv', [['when', 'who', 'action', 'target', 'detail'], ...list.map((a) => [when(a.at), a.staff, a.action, a.target, a.detail || ''])])}>Export</button>}>
    <Table rows={list} search={(a) => a.staff + ' ' + a.action + ' ' + a.target} empty="Nothing logged yet." cols={[{ k: 'w', l: 'When', get: (a) => when(a.at), sort: (a) => a.at }, { k: 's', l: 'Who', get: (a) => a.staff }, { k: 'a', l: 'Action', get: (a) => <Badge t={a.action} tone="d" /> }, { k: 't', l: 'What', get: (a) => <span className="mono">{a.target}</span> }, { k: 'd', l: 'Detail', get: (a) => a.detail || '' }]} />
  </Panel></div>;
}
export function Settings() {
  const [biz, setBiz] = useSetting('business', { name: 'Sam Electronics L.L.C', trn: '', vat: 5, currency: 'AED', invoiceNote: 'Thank you for your business.' });
  const [fees, setFees] = useSetting('repair-fees', { low: 25, mid: 35, high: 45, lowMax: 100, midMax: 500 });
  const [ship, setShip] = useSetting('delivery', { uae: 25, freeOver: 500, pickupReady: '20 minutes' });
  const [reset, setReset] = useState(false);
  return (
    <div className="cr-grid">
      <Panel t="Business" d="Shown on tax invoices.">
        <div className="cr-form"><label>Legal name<input className="cr-in" value={biz.name} onChange={(e) => setBiz({ ...biz, name: e.target.value })} /></label>
          <label>TRN (tax registration number)<input className="cr-in" value={biz.trn} onChange={(e) => setBiz({ ...biz, trn: e.target.value })} placeholder="100xxxxxxxxxxxx" /></label>
          <div className="cr-row2"><label>VAT %<input className="cr-in" type="number" value={biz.vat} onChange={(e) => setBiz({ ...biz, vat: +e.target.value })} /></label><label>Currency<input className="cr-in" value={biz.currency} disabled /></label></div>
          <label>Invoice footer<input className="cr-in" value={biz.invoiceNote} onChange={(e) => setBiz({ ...biz, invoiceNote: e.target.value })} /></label></div>
      </Panel>
      <Panel t="Repair fitting fees" d="By the price of the part. Technicians can still adjust each job.">
        <div className="cr-form"><div className="cr-row2"><label>Part under (AED)<input className="cr-in" type="number" value={fees.lowMax} onChange={(e) => setFees({ ...fees, lowMax: +e.target.value })} /></label><label>Fee<input className="cr-in" type="number" value={fees.low} onChange={(e) => setFees({ ...fees, low: +e.target.value })} /></label></div>
          <div className="cr-row2"><label>Part up to (AED)<input className="cr-in" type="number" value={fees.midMax} onChange={(e) => setFees({ ...fees, midMax: +e.target.value })} /></label><label>Fee<input className="cr-in" type="number" value={fees.mid} onChange={(e) => setFees({ ...fees, mid: +e.target.value })} /></label></div>
          <label>Fee above that<input className="cr-in" type="number" value={fees.high} onChange={(e) => setFees({ ...fees, high: +e.target.value })} /></label></div>
      </Panel>
      <Panel t="Delivery">
        <div className="cr-form"><div className="cr-row2"><label>UAE delivery (AED)<input className="cr-in" type="number" value={ship.uae} onChange={(e) => setShip({ ...ship, uae: +e.target.value })} /></label><label>Free over (AED)<input className="cr-in" type="number" value={ship.freeOver} onChange={(e) => setShip({ ...ship, freeOver: +e.target.value })} /></label></div>
          <label>Pick-up ready in<input className="cr-in" value={ship.pickupReady} onChange={(e) => setShip({ ...ship, pickupReady: e.target.value })} /></label></div>
      </Panel>
      <Panel t="Database" d={live ? 'Connected to Supabase.' : 'Demo mode: everything is stored in this browser.'} className="span2">
        <div className="cr-li"><Badge t={live ? 'SUPABASE' : 'DEMO'} tone={live ? 'g' : 'y'} /><span>{live ? 'Accounts, orders, chat and stock are live and shared by everyone.' : 'Connect Supabase (supabase/README.md) and this switches to the real database, with real e-mails, with no other change.'}</span></div>
        {!live ? (reset ? <div className="cr-acts"><span className="cr-err">This deletes all demo accounts, orders and changes in this browser.</span><button type="button" className="cr-btn danger" onClick={() => { localStorage.removeItem('se-db'); location.reload(); }}>Yes, reset the demo</button><button type="button" className="cr-btn ghost" onClick={() => setReset(false)}>Cancel</button></div> : <button type="button" className="cr-btn ghost sm" onClick={() => setReset(true)}>Reset demo data…</button>) : null}
      </Panel>
    </div>
  );
}
