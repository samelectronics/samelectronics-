// @ts-nocheck
/* eslint-disable */
// Request console + Visit us (Issue 16, improved 13 Oct 2026). Styles in src/styles/visit.css.
// Console: the tabs and fields of before, now printing onto a thermal work-order slip line by line as you type;
// switching tabs reprints the header; Send tears the slip, stamps SENT and flies it into WhatsApp or email.
// Visit us: a live Dubai clock with seconds, the G7 status dot, a countdown, today's shifts on a day timeline with a
// moving "now" marker, the week, a brand-styled map and the contact buttons.
import React from 'react';
import { DCLogic } from '@/dc/runtime';
import { onReplay } from '@/components/perf/SectionFX';
import { shopStatus } from '@/lib/shopStatus';

// owner (27 Oct): every request type asks with the same options as Find My Part (brands, parts, grades, colours,
// quantities, a date for repairs), always with "Other" (opens a small box) and a free comment, all sent to WhatsApp.
// field: [label, kind, options | placeholder]; kinds: text, area, date, one (single choice), many (multi choice)
const BR = ['Apple', 'Samsung', 'Xiaomi', 'Redmi', 'POCO', 'Huawei', 'Honor', 'Oppo', 'Realme', 'OnePlus', 'Vivo', 'Infinix', 'Tecno', 'Pixel', 'Nokia', 'Other'];
const PT = ['Screen', 'Battery', 'Back cover', 'Charging port', 'Camera', 'Frame', 'Speaker', 'Flex cable', 'Other'];
const GR = ['Original', 'Service Pack', 'OLED Soft', 'OLED Hard', 'Incell', 'AAA', 'Not sure', 'Other'];
const CO = ['Black', 'White', 'Gold', 'Silver', 'Blue', 'Purple', 'Other'];
const FL = {
  'Order parts': [['Brand', 'one', BR], ['Model', 'text', 'e.g. iPhone 15 Pro'], ['Part', 'many', PT], ['Grade', 'one', GR], ['Colour', 'one', CO], ['Quantity', 'one', ['1', '2–5', '6–10', '10–50', '50+', 'Other']]],
  'Bulk quote': [['Company', 'text', 'Your shop or company'], ['Country', 'text', 'e.g. Nigeria'], ['Brands', 'many', BR], ['Parts', 'many', PT], ['Grades', 'many', GR], ['Quantity', 'one', ['50+', '100+', '500+', '1,000+', 'Other']], ['Parts list', 'area', 'Paste models and quantities']],
  'Book a repair': [['Brand', 'one', BR], ['Model', 'text', 'e.g. Galaxy A54'], ['Problem', 'many', ['Screen', 'Touch glass', 'Battery', 'Back glass', 'Charging port', 'Camera', 'Water damage', 'Software', 'Not sure', 'Other']], ['Quality', 'one', ['Original', 'OLED', 'Incell', 'Not sure', 'Other']], ['Date', 'date', ''], ['Time', 'one', ['Morning', 'Afternoon', 'Evening', 'Any time']]],
  'Trade account': [['Business name', 'text', 'Your shop or company'], ['Customer type', 'one', ['Repair shop', 'Trader', 'Exporter', 'Bulk buyer', 'Other']], ['Country', 'text', 'e.g. UAE'], ['Monthly volume', 'one', ['Under 100 units', '100–500', '500–1,000', '1,000+']], ['Main brands', 'many', BR]],
  'Shipping quote': [['Destination', 'text', 'City, country'], ['Parts', 'many', PT], ['Quantity', 'one', ['Under 50', '50–200', '200–1,000', '1,000+', 'Other']], ['Service', 'one', ['Express', 'Economy', 'Not sure']], ['Needed by', 'date', '']],
  General: [['Your name', 'text', 'Name'], ['Topic', 'one', ['Stock question', 'Prices', 'Warranty', 'Partnership', 'Other']], ['Message', 'area', 'How can we help?']],
};
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const pad = (n) => String(n).padStart(2, '0'), hm = (x) => pad(Math.floor(x / 60)) + ':' + pad(x % 60);

class Component extends DCLogic {
  secRef = React.createRef();
  state = { data: window.SE_DATA || null, type: null, vals: {}, now: Date.now(), sent: null, sentN: 0, seen: false };
  componentDidMount() {
    this.offRp = onReplay(() => this.secRef.current, () => { this.setState({ seen: false }); }); // 14 Oct · H-G2: replay from the start
    if (!this.state.data) this.dIv = setInterval(() => { if (window.SE_DATA) { clearInterval(this.dIv); this.setState({ data: window.SE_DATA }); } }, 80);
    this.io = new IntersectionObserver(([e]) => { this.vis = e.isIntersecting; if (e.isIntersecting && !this.state.seen) this.setState({ seen: true }); }, { threshold: 0.2 });
    setTimeout(() => this.secRef.current && this.io.observe(this.secRef.current), 50);
    this.iv = setInterval(() => { if (this.vis && !document.hidden && this.ovNow == null) this.setState({ now: Date.now() }); }, 1000);
    this.onLang = () => this.forceUpdate(); window.addEventListener('se:lang', this.onLang);
    window.seVisit = (o) => { if (o.now) this.ovNow = o.now; this.setState({ ...(o.now ? { now: o.now } : {}), ...(o.type ? { type: o.type } : {}), ...(o.vals ? { vals: { ...this.state.vals, ...o.vals } } : {}), ...(o.send ? { sent: o.send, sentN: this.state.sentN + 1 } : {}) }); };
  }
  componentWillUnmount() { this.offRp && this.offRp(); clearInterval(this.iv); clearInterval(this.dIv); clearTimeout(this.sT); this.io && this.io.disconnect(); window.removeEventListener('se:lang', this.onLang); }
  send(via, url) { window.open(url, '_blank', 'noopener'); this.setState({ sent: via, sentN: this.state.sentN + 1 }); clearTimeout(this.sT); this.sT = setTimeout(() => this.setState({ sent: null }), 3600); }
  renderVals() {
    const s = this.state, D = s.data, RT = D ? D.requestTypes : ['Order parts', 'Bulk quote', 'Book a repair', 'Trade account', 'Shipping quote', 'General'], rt = s.type || RT[0];
    const C = (D && D.contact) || {}, wa = 'https://wa.me/' + (C.wa || '971503420015'), email = C.email || 'samelectronics.uae@gmail.com';
    const put = (k, v) => this.setState((st) => ({ vals: { ...st.vals, [k]: v } }));
    // owner (28 Oct, INP): typed fields are uncontrolled and commit after a short pause, so a key press never blocks
    const putLater = (k, v) => { this.tv = this.tv || {}; clearTimeout(this.tv[k]); this.tv[k] = setTimeout(() => put(k, v), 300); };
    const fields = (FL[rt] || FL.General).map(([label, kind, o], i) => {
      const k = rt + label, raw = s.vals[k] || '', sel = raw ? raw.split('|') : [], other = s.vals[k + ':o'] || '';
      const shown = sel.map((x) => (x === 'Other' ? (other.trim() ? other.trim() : 'Other') : x)).join(', ');
      const opts = Array.isArray(o) ? o.map((x) => ({ x, on: sel.includes(x), pick: () => put(k, kind === 'many' ? (sel.includes(x) ? sel.filter((y) => y !== x) : [...sel, x]).join('|') : sel[0] === x ? '' : x) })) : [];
      return { label, kind, i, ph: Array.isArray(o) ? '' : o, opts, otherOn: sel.includes('Other'), other, setOther: (e) => putLater(k + ':o', e.target.value),
        val: kind === 'one' || kind === 'many' ? shown : raw, set: (e) => putLater(k, e.target.value) };
    });
    const note = s.vals[rt + ':note'] || '', setNote = (e) => putLater(rt + ':note', e.target.value);
    const filled = fields.filter((f) => f.val.trim()).length;
    const no = 'SE-REQ-' + (2600 + ((s.now / 864e5) | 0) % 900);
    const body = '*' + rt.toUpperCase() + ' · SAM ELECTRONICS*\nWork order ' + no + '\n\n' + fields.filter((f) => f.val.trim()).map((f) => '• ' + f.label + ': ' + f.val).join('\n') + (note.trim() ? '\n\nComment: ' + note.trim() : '') + '\n\nSent from the Sam Electronics website';
    // Dubai time, G7 status and today's shifts
    const d = new Date(s.now), g = new Date(d.getTime() + d.getTimezoneOffset() * 6e4 + 4 * 36e5), day = g.getDay(), m = g.getHours() * 60 + g.getMinutes(), sec = g.getSeconds();
    const H = D ? D.hours : {}, sh = H[day] || [], cur = sh.find(([a, b]) => m >= a && m < b), nxt = sh.find(([a]) => a > m), SS = shopStatus(H, s.now), soon = SS.soon; // 14 Oct §02: shared 4-state status
    const left = cur ? cur[1] - m : nxt ? nxt[0] - m : 0, dur = (x) => (x >= 60 ? Math.floor(x / 60) + 'h ' + pad(x % 60) + 'm' : x + 'm');
    const status = { open: 'Open now', closing: 'Closing soon', opening: 'Opening soon', closed: 'Closed now' }[SS.state], sub = cur ? 'Closes at ' + hm(cur[1]) : nxt ? 'Opens at ' + hm(nxt[0]) : 'Opens ' + (day === 6 ? 'Monday' : 'tomorrow') + ' at 10:30';
    const count = cur ? 'Closes in ' + dur(left) : nxt ? 'Opens in ' + dur(left) : '';
    const week = [6, 1, 2, 3, 4, 5, 0].map((x) => ({ day: DAYS[x], on: x === day, h: (H[x] || []).length ? H[x].map(([a, b]) => hm(a) + '–' + hm(b)).join(' · ') : 'Closed' }));
    return { secRef: this.secRef, seen: s.seen,
      types: RT.map((t) => ({ name: t, on: t === rt, pick: () => this.setState({ type: t }) })), rt, fields: s.full ? fields : fields.slice(0, 3), filled, total: fields.length, no, note, setNote, full: !!s.full, more: fields.length > 3, openFull: () => this.setState({ full: true }), closeFull: () => this.setState({ full: false }), // owner (28 Oct): the home shows the first questions; the full form opens on its own
      lines: fields.filter((f) => f.val.trim()).map((f) => ({ k: f.label.toUpperCase(), v: f.val })).concat(note.trim() ? [{ k: 'COMMENT', v: note.trim() }] : []), sent: s.sent, sentN: s.sentN,
      sendWa: (e) => { e.preventDefault(); this.send('wa', wa + '?text=' + encodeURIComponent(body)); },
      sendMail: (e) => { e.preventDefault(); this.send('mail', 'mailto:' + email + '?subject=' + encodeURIComponent(no + ' · ' + rt) + '&body=' + encodeURIComponent(body)); },
      clock: hm(m) + ':' + pad(sec), open: !!cur, soon, dot: SS.dot, state: SS.state, status, sub, count, today: DAYS[day],
      shifts: sh.map(([a, b]) => ({ l: ((a / 1440) * 100).toFixed(2) + '%', w: (((b - a) / 1440) * 100).toFixed(2) + '%', t: hm(a) + '–' + hm(b) })), nowAt: (((m + sec / 60) / 1440) * 100).toFixed(3) + '%', week,
      address: C.address || 'Al Murar, Deira, Dubai, UAE', plus: C.plus || '78G4+3H2', phone: C.phone || '+971 4 273 3031', tel: 'tel:' + (C.tel || '+97142733031'),
      wa: wa + '?text=' + encodeURIComponent('Hi Sam Electronics, I found you on your website.'),
      dir: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent((C.plus || '78G4+3H2') + ' Dubai') };
  }
}

export default Component;
