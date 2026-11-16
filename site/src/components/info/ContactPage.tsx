'use client';
import PrintedForm from '@/components/site/PrintedForm';
import { MapDubai } from '@/components/dc/SEStory';
// P4 · CONTACT & HELP (/contact): every way to reach us on one page — call, WhatsApp, e-mail, socials, visit (live hours,
// map, directions), a live chat with the team (answered from the Control Room inbox; when nobody is in, it waits and we
// e-mail the reply), a contact form by topic, the help centre (#help), privacy requests (#privacy) and the legal texts.
import React, { useEffect, useRef, useState } from 'react';
import { data, waCard } from '@/lib/catalog';
import { backend, useMe, type Message } from '@/lib/backend';
import { PageHero, T, useRise } from '@/components/site/ui';
import HoursLive from '@/components/home/HoursLive';
import LiveSam from '@/components/samsoom/LiveSam';
import Switchboard from './Switchboard';

const HELP: [string, [string, string][]][] = [
  ['Orders & payment', [['How do I order?', 'Add parts to the cart and place the order, or send your list on WhatsApp. We confirm stock and price before you pay.'], ['Which payments do you take?', 'Cash and card in the shop, bank transfer for trade and export, and a payment link after we confirm. Card payment online is coming.'], ['Do prices include VAT?', 'Prices in the shop are shown without VAT; 5% UAE VAT is added at checkout and shown on your invoice.']]],
  ['Parts & grades', [['What is the difference between the grades?', 'Original (Service Pack) is the part the brand fits. OLED Soft is close to original at a lower price. Incell is a reliable budget LCD. AAA is our best-price grade. Every part is labelled by quality and manufacturer.'], ['How do I know a part fits my phone?', 'Search by model or model number, or send us the model number on WhatsApp and we check it. Add your phone to My devices and the shop marks every part that fits.']]],
  ['Warranty & returns', [['How long is the warranty?', 'Up to 6 months on Original, 3 months on OLED, 1 month on Incell and AAA. It covers faults of the part itself.'], ['How do I return a part?', 'Bring or send it back with the invoice within the warranty. We test it; if it is faulty we replace it or refund you. See the returns policy for the details.']]],
  ['Shipping', [['Do you ship to my country?', 'We ship to 28+ countries every week, door to door, and we can hand your order to your own shipper.'], ['How long does it take?', 'Express: usually 2–5 working days. Air cargo for bulk: about a week. We confirm the time with the quote.']]],
  ['Account & trade', [['How do I get trade prices?', 'Create an account, add your company and apply on the Wholesale page. Once approved, the shop shows your price on every part.'], ['I forgot my password.', 'Use “Forgot your password?” on the sign-in page and we e-mail you a reset link.']]],
];

export function LiveChat() {
  const [me] = useMe(), [tid, setTid] = useState<string | null>(null), [msgs, setMsgs] = useState<Message[]>([]), [text, setText] = useState(''), [name, setName] = useState(''), box = useRef<HTMLDivElement>(null);
  useEffect(() => { try { const t = JSON.parse(localStorage.getItem('se-my-threads') || '[]')[0]; if (t) setTid(t); } catch { /* */ } }, []);
  useEffect(() => { if (me) setName(me.name); }, [me]);
  useEffect(() => { if (!tid) return; const load = () => backend.messages(tid).then(setMsgs); load(); const iv = window.setInterval(load, 5000); window.addEventListener('se:db', load); return () => { window.clearInterval(iv); window.removeEventListener('se:db', load); }; }, [tid]);
  useEffect(() => { box.current?.scrollTo({ top: box.current.scrollHeight, behavior: 'smooth' }); }, [msgs.length]);
  const send = async (e: React.FormEvent) => { e.preventDefault(); if (!text.trim() || !name.trim()) return; const r = await backend.send({ thread: tid || undefined, name, email: me?.email, topic: 'Website chat', text }); if (r.ok) { setTid(r.data.thread); setText(''); backend.messages(r.data.thread).then(setMsgs); } };
  return (
    <div className="lc">
      <div className="lc-top"><span className="lc-av"><LiveSam size={34} mood="idle" /></span><span><b>{T('Chat with the team')}</b><small><i />{T('We reply here during opening hours, and by e-mail after.')}</small></span></div>
      <div className="lc-msgs" ref={box}>
        <div className="lc-m staff"><p>{T('Hi! Ask us anything: stock, prices, orders, repairs. A real person from the shop answers.')}</p><small>Sam Electronics</small></div>
        {msgs.map((m) => <div key={m.id} className={'lc-m ' + m.from}><p>{m.text}</p><small>{m.from === 'staff' ? m.name : T('You')} · {new Date(m.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small></div>)}
      </div>
      <form className="lc-in" onSubmit={send}>
        {!me && !tid ? <input className="sp-in" value={name} onChange={(e) => setName(e.target.value)} placeholder={T('Your name')} required /> : null}
        <input className="sp-in" value={text} onChange={(e) => setText(e.target.value)} placeholder={T('Write a message…')} />
        <button type="submit" className="sp-btn sm">{T('Send')}</button>
      </form>
    </div>
  );
}

export default function ContactPage() {
  const [ready, setReady] = useState(false), [open, setOpen] = useState<string | null>(null), [f, setF] = useState({ name: '', email: '', phone: '', topic: 'General', text: '' }), [sent, setSent] = useState(false), [pv, setPv] = useState({ email: '', kind: 'copy' }), [pvSent, setPvSent] = useState(false);
  useEffect(() => { const iv = window.setInterval(() => { if (data()) { window.clearInterval(iv); setReady(true); } }, 60); return () => window.clearInterval(iv); }, []);
  useRise(ready);
  const C = (data()?.contact || {}) as { phone?: string; tel?: string; mobile?: string; wa?: string; email?: string; address?: string; plus?: string; social?: string };
  const map = 'https://www.google.com/maps?q=' + encodeURIComponent('Sam Electronics Al Murar Deira Dubai') + '&output=embed';
  const submit = async (e: React.FormEvent) => { e.preventDefault(); await backend.send({ name: f.name, email: f.email, topic: f.topic, text: f.text + (f.phone ? '\nPhone: ' + f.phone : '') }); setSent(true); };
  return (
    <>
      <PageHero eb={T('CONTACT & HELP')} title={T('Talk to us.')} accent={T('Any way you like.')} crumb={[[T('Contact')]]} seed={97}
        sub={T('Call, WhatsApp, e-mail, chat here with the team, or come to the counter in Deira. We answer in Arabic, English and more.')} />

      <section className="sp-sec w"><div className="sp-wrap">
        <Switchboard c={C} />
      </div></section>

      <section id="visit" className="sp-sec g"><div className="sp-wrap ct-visit">
        <div className="sp-card ct-hours" data-rise>
          <span className="sp-eb">{T('VISIT US')}</span>
          <h2 className="sp-h2" style={{ fontSize: 32 }}>{T('Al Murar, Deira, Dubai')}</h2>
          <p className="sp-p">{C.address || 'Al Murar, Deira, Dubai, UAE'} · Plus Code {C.plus || '78G4+3H2'}</p>
          <div className="ct-live"><HoursLive /></div>
          <span className="sp-acts"><a className="sp-btn" href={'https://maps.app.goo.gl/EsZiUQy8HmzfJg6QA'} target="_blank" rel="noopener noreferrer">{T('Get directions')}</a><a className="sp-btn ghost" href="/repair#book">{T('Book a repair')}</a></span>
        </div>
        <a className="ct-map ct-map2" data-rise href="https://maps.app.goo.gl/EsZiUQy8HmzfJg6QA" target="_blank" rel="noopener noreferrer" aria-label={T('Open in Maps')}><MapDubai /><span className="ct-mapgo">{T('Open in Maps')} ↗</span></a>
      </div></section>

      <section id="chat" className="sp-sec y"><div className="sp-wrap ct-two">
        <div data-rise><span className="sp-eb">{T('LIVE CHAT')}</span><h2 className="sp-h2">{T('A real person, right here.')}</h2><p className="sp-p">{T('Messages go straight to the team’s inbox in the Control Room. For quick answers any time, Samsoom is in the corner.')}</p><LiveChat /></div>
        <div data-rise>
          <span className="sp-eb">{T('WRITE TO US')}</span><h2 className="sp-h2">{T('Send a message')}</h2>
          <div style={{ marginTop: 18 }}><PrintedForm eb="MESSAGE" title="We reply by e-mail, usually the same day." doc="MESSAGE"
            fields={[
              { k: 'name', label: 'Your name', req: true, slip: 'Name' },
              { k: 'email', label: 'E-mail', kind: 'email', req: true, slip: 'E-mail' },
              { k: 'phone', label: 'Phone (optional)', kind: 'tel', slip: 'Phone' },
              { k: 'topic', label: 'Topic', kind: 'select', opts: ['General', 'Order parts', 'Bulk quote', 'Book a repair', 'Trade account', 'Shipping quote', 'Warranty or return', 'Complaint', 'Partnership'].map((t) => [t, t] as [string, string]), slip: 'Topic' },
              { k: 'text', label: 'Message', kind: 'area', req: true, slip: '' },
            ]}
            cta="Send message"
            send={(v) => backend.send({ name: v.name, email: v.email, topic: v.topic, text: waCard(v.topic, [['Message', v.text], ['E-mail', v.email], ['Phone', v.phone]], { name: v.name }) }).then(() => undefined)}
            done={() => <div className="sp-card"><b className="sp-h3">{T('Message sent.')}</b><p className="sp-p">{T('Thank you. We reply by e-mail, usually the same day.')}</p></div>}
          /></div>
        </div>
      </div></section>

      <section id="help" className="sp-sec w"><div className="sp-wrap">
        <div className="sp-head" data-rise><div><span className="sp-eb">{T('HELP CENTRE')}</span><h2 className="sp-h2">{T('Answers to common questions')}</h2></div><button type="button" className="sp-btn sm dark" onClick={() => window.dispatchEvent(new CustomEvent('se:help'))}>{T('Ask Samsoom to show you around')}</button></div>
        <div className="ct-help" data-rise>{HELP.map(([g, qs]) => (
          <div key={g} className="sp-card"><b className="sp-h3">{T(g)}</b>
            {qs.map(([q, a]) => <div key={q} className={'ms-q' + (open === q ? ' open' : '')}><button type="button" onClick={() => setOpen(open === q ? null : q)} aria-expanded={open === q}><b>{T(q)}</b><i /></button><div><p className="sp-p">{T(a)}</p></div></div>)}
          </div>
        ))}</div>
      </div></section>

      <section id="privacy" className="sp-sec g"><div className="sp-wrap rp-book ct-priv">
        <div data-rise><span className="sp-eb">{T('YOUR DATA')}</span><h2 className="sp-h2">{T('Privacy requests')}</h2><p className="sp-p">{T('Ask for a copy of the data we hold about you, a correction, or the deletion of your account. We answer within 30 days.')}</p>
          <div className="ct-legal">{[['Terms of sale', 'terms'], ['Warranty policy', 'warranty'], ['Returns & refunds', 'returns'], ['Shipping policy', 'shipping'], ['Privacy policy', 'privacy'], ['Cookies', 'cookies'], ['Accounts & reviews', 'accounts']].map(([l, h]) => <a key={h} className="sp-chip" href={'/legal#' + h}>{T(l)}</a>)}</div>
        </div>
        <div data-rise><PrintedForm eb="YOUR DATA" title="Privacy request" doc="PRIVACY REQUEST"
          fields={[
            { k: 'email', label: 'Account e-mail', kind: 'email', req: true, slip: 'Account', wide: true },
            { k: 'kind', label: 'Request', kind: 'chips', opts: [['copy', 'A copy of my data'], ['correct', 'Correct my data'], ['delete', 'Delete my account and data']], slip: 'Request' },
          ]}
          cta="Send request"
          send={(v) => backend.send({ name: v.email, email: v.email, topic: 'Privacy request', text: waCard('Privacy request', [['Request', v.kind], ['Account', v.email]]) }).then(() => undefined)}
          done={() => <div className="sp-card"><b className="sp-h3">{T('Request received.')}</b><p className="sp-p">{T('We will confirm it is you by e-mail, then act on it.')}</p></div>}
        /></div>
      </div></section>
    </>
  );
}
