'use client';
// P4 · LEGAL (/legal): the shop's own texts, written for Sam Electronics (not copied). Draft for the owner's legal adviser
// to review before launch. Sections: terms of sale, warranty, returns & refunds, shipping, privacy, cookies, accounts & reviews.
import React, { useEffect, useState } from 'react';
import { PageHero, T } from '@/components/site/ui';

const CO = 'Sam Electronics L.L.C, Al Murar, Deira, Dubai, United Arab Emirates';
const S: [string, string, [string, string[]][]][] = [
  ['terms', 'Terms of sale', [
    ['Who we are', [`These terms apply to every sale by ${CO} ("Sam Electronics", "we"), in the shop, on this website, on WhatsApp or by phone.`]],
    ['Prices', ['Prices are in UAE dirhams (AED). Prices shown in the shop do not include VAT; 5% UAE VAT is added at checkout and shown on the tax invoice.', 'Trade prices are only for approved trade accounts and only for the account holder’s business.', 'Prices on this website may be marked "sample" while the catalogue is being set up. A sample price is not an offer.']],
    ['Orders', ['Placing an order is a request to buy. The contract is made when we confirm stock and price to you (by WhatsApp, e-mail or in the shop) and you pay or agree to pay.', 'Stock shown on the website is an estimate. If a part is no longer available we tell you before taking payment and offer an alternative or cancel the line.']],
    ['Payment', ['We accept cash and card in the shop, bank transfer, and payment links we send after confirming your order. Orders are released for delivery or collection once paid, unless your trade account has approved credit.']],
    ['Collection and delivery', ['Collection orders are kept for 7 days after we tell you they are ready. Delivery terms are in the shipping policy.']],
    ['Parts and fitting', ['Parts are sold for professional fitting. We are not responsible for damage caused while a part is fitted by someone other than Sam Electronics.', 'Repairs at our bench are covered by the warranty policy.']],
    ['Liability', ['Nothing in these terms limits your rights under UAE consumer protection law. Apart from those rights, our liability for a part is limited to repairing, replacing or refunding that part.']],
    ['Law', ['These terms are governed by the laws of the Emirate of Dubai and the federal laws of the UAE. The courts of Dubai have jurisdiction.']],
  ]],
  ['warranty', 'Warranty policy', [
    ['How long', ['Original (Service Pack): 6 months. OLED Soft: 3 months. Incell and AAA: 1 month. Other parts: as stated on the product. The warranty starts on the invoice date.']],
    ['What it covers', ['Faults of the part itself under normal use: for example dead pixels, touch failure, a battery that will not hold charge, a flex that does not connect.']],
    ['What it does not cover', ['Physical damage (cracks, bends, pressure marks), liquid damage, parts damaged while being fitted by a third party, parts with removed or altered labels, and normal wear such as battery capacity loss within specification.']],
    ['How to claim', ['Bring or send the part with the invoice. We test it, usually the same day. If it is faulty we replace it, or refund it if no replacement is available.']],
  ]],
  ['returns', 'Returns & refunds', [
    ['Unused parts', ['You may return an unused part, in its original packaging with labels and protective films intact, within 7 days of purchase for an exchange or store credit. Screens with removed films are considered used.']],
    ['Faulty parts', ['Faulty parts are handled under the warranty policy.']],
    ['Refunds', ['Approved refunds are made to the original payment method within 14 days. Delivery costs are not refunded unless we sent the wrong or a faulty part.']],
    ['Trade orders', ['Returns of trade and bulk orders are agreed case by case with your account manager.']],
  ]],
  ['shipping', 'Shipping policy', [
    ['In the UAE', ['Next working day delivery for most addresses. Delivery is charged at checkout (sample: AED 25, free above AED 500).']],
    ['Worldwide', ['We ship door to door with our partners (such as Sky Dragon, Emirates SkyCargo, UPS and DHL) and quote the price and time before you pay. Duties and taxes in the destination country are paid by the receiver unless agreed otherwise.']],
    ['Your own shipper', ['You may ask us to hand your order to your own shipper or cargo agent. We pack it and share the paperwork; the shipping cost and the shipper’s terms are between you and your shipper, and responsibility passes to you when we hand the parcel over.']],
    ['Damage in transit', ['Check parcels on delivery and tell us within 48 hours if anything arrives damaged, with photos. For shipments we booked, we handle the claim with the carrier.']],
  ]],
  ['privacy', 'Privacy policy', [
    ['Who controls your data', [`${CO}. Contact: samelectronics.uae@gmail.com.`]],
    ['What we collect', ['Account details (name, e-mail, phone, password stored encrypted), company details you add, orders and invoices, messages you send us, Samsoom chats if you keep them with your account, and basic technical data (device, pages visited) to keep the site working.']],
    ['Why', ['To sell and deliver parts, run repairs and warranties, approve trade accounts, answer you, keep the accounts required by UAE tax law, and improve the site. We do not sell your data.']],
    ['Who sees it', ['Our staff, according to their role, and the service providers that run the site for us (hosting, database, e-mail, payments, shipping partners for your delivery) under contracts that protect it.']],
    ['How long', ['Invoices and tax records: as long as UAE law requires. Account data: while your account is open, then deleted or anonymised. Chats and messages: up to 2 years.']],
    ['Your rights', ['Ask for a copy, a correction or deletion of your data, or object to its use, using the privacy form on the contact page. We answer within 30 days, in line with the UAE personal data protection law.']],
  ]],
  ['cookies', 'Cookies', [
    ['What we store', ['This site keeps a few things in your browser so it works: your language, your cart, stars and recent searches, whether you have seen Samsoom’s tour, and your sign-in session. We do not use advertising cookies.']],
    ['Your choice', ['You can clear them at any time in your browser; the site will simply forget your cart and preferences on that device.']],
  ]],
  ['accounts', 'Accounts & reviews', [
    ['Your account', ['Keep your password private. You are responsible for orders placed with your account. Trade accounts may be suspended if they are used to resell trade prices outside the approved business.']],
    ['Reviews', ['Only account holders can rate parts, and reviews of parts you bought are marked "verified purchase". Reviews must be honest and about the part. We remove reviews that are abusive, off-topic, contain personal data or advertise other businesses.']],
  ]],
];

export default function LegalPage() {
  const [cur, setCur] = useState('terms');
  useEffect(() => { const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setCur(e.target.id)), { rootMargin: '-30% 0px -60% 0px' }); document.querySelectorAll('.lg-sec').forEach((s) => io.observe(s)); return () => io.disconnect(); }, []);
  return (
    <>
      <PageHero eb={T('LEGAL')} title={T('The fine print,')} accent={T('in plain words.')} crumb={[[T('Legal')]]} seed={103} sub={T('How we sell, guarantee, ship and look after your data. Written by us, for our customers.')} />
      <section className="sp-sec w"><div className="sp-wrap lg">
        <nav className="lg-nav">{S.map(([id, t]) => <a key={id} href={'#' + id} className={cur === id ? 'on' : ''}>{T(t)}</a>)}<span className="sp-note" style={{ marginTop: 16 }}>{T('Draft for review by our legal adviser before launch. Last updated 28 October 2026.')}</span></nav>
        <div className="lg-body">{S.map(([id, t, parts]) => (
          <article key={id} id={id} className="lg-sec">
            <h2 className="sp-h2">{T(t)}</h2>
            {parts.map(([h, ps]) => <div key={h} className="lg-p"><h3>{T(h)}</h3>{ps.map((p) => <p key={p}>{T(p)}</p>)}</div>)}
          </article>
        ))}</div>
      </div></section>
    </>
  );
}
