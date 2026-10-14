// @ts-nocheck
/* eslint-disable */
// Request console + Visit us (Issue 16, improved 13 Oct 2026). Styles in src/styles/visit.css.
// Console: the tabs and fields of before, now printing onto a thermal work-order slip line by line as you type;
// switching tabs reprints the header; Send tears the slip, stamps SENT and flies it into WhatsApp or email.
// Visit us: a live Dubai clock with seconds, the G7 status dot, a countdown, today's shifts on a day timeline with a
// moving "now" marker, the week, a brand-styled map and the contact buttons.
import React from 'react';
import { DCLogic } from '@/dc/runtime';

const FL = { 'Order parts': [['Model', 'e.g. iPhone 15 Pro'], ['Part & grade', 'e.g. Screen · OLED'], ['Quantity', '1']], 'Bulk quote': [['Company', 'Your shop or company'], ['Parts list', 'Paste models and quantities'], ['Country', 'e.g. Nigeria']], 'Book a repair': [['Model', 'e.g. Galaxy A54'], ['Problem', 'e.g. cracked screen'], ['Preferred time', 'e.g. Saturday evening']], 'Trade account': [['Business name', 'Your shop or company'], ['Customer type', 'Repair shop · Trader · Bulk buyer'], ['Country', 'e.g. UAE']], 'Shipping quote': [['Destination', 'City, country'], ['Parts & quantity', 'e.g. 50 screens'], ['Deadline', 'e.g. next week']], General: [['Your name', 'Name'], ['Message', 'How can we help?']] };
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const pad = (n) => String(n).padStart(2, '0'), hm = (x) => pad(Math.floor(x / 60)) + ':' + pad(x % 60);

class Component extends DCLogic {
  secRef = React.createRef();
  state = { data: window.SE_DATA || null, type: null, vals: {}, now: Date.now(), sent: null, sentN: 0, seen: false };
  componentDidMount() {
    if (!this.state.data) this.dIv = setInterval(() => { if (window.SE_DATA) { clearInterval(this.dIv); this.setState({ data: window.SE_DATA }); } }, 80);
    this.io = new IntersectionObserver(([e]) => { this.vis = e.isIntersecting; if (e.isIntersecting && !this.state.seen) this.setState({ seen: true }); }, { threshold: 0.2 });
    setTimeout(() => this.secRef.current && this.io.observe(this.secRef.current), 50);
    this.iv = setInterval(() => { if (this.vis && !document.hidden && this.ovNow == null) this.setState({ now: Date.now() }); }, 1000);
    this.onLang = () => this.forceUpdate(); window.addEventListener('se:lang', this.onLang);
    window.seVisit = (o) => { if (o.now) this.ovNow = o.now; this.setState({ ...(o.now ? { now: o.now } : {}), ...(o.type ? { type: o.type } : {}), ...(o.vals ? { vals: { ...this.state.vals, ...o.vals } } : {}), ...(o.send ? { sent: o.send, sentN: this.state.sentN + 1 } : {}) }); };
  }
  componentWillUnmount() { clearInterval(this.iv); clearInterval(this.dIv); clearTimeout(this.sT); this.io && this.io.disconnect(); window.removeEventListener('se:lang', this.onLang); }
  send(via, url) { window.open(url, '_blank', 'noopener'); this.setState({ sent: via, sentN: this.state.sentN + 1 }); clearTimeout(this.sT); this.sT = setTimeout(() => this.setState({ sent: null }), 3600); }
  renderVals() {
    const s = this.state, D = s.data, RT = D ? D.requestTypes : ['Order parts', 'Bulk quote', 'Book a repair', 'Trade account', 'Shipping quote', 'General'], rt = s.type || RT[0];
    const C = (D && D.contact) || {}, wa = 'https://wa.me/' + (C.wa || '971503420015'), email = C.email || 'samelectronics.uae@gmail.com';
    const fields = (FL[rt] || FL.General).map(([label, ph], i) => ({ label, ph, i, val: s.vals[rt + label] || '', set: (e) => { const v = e.target.value; this.setState((st) => ({ vals: { ...st.vals, [rt + label]: v } })); } }));
    const filled = fields.filter((f) => f.val.trim()).length;
    const no = 'SE-REQ-' + (2600 + ((s.now / 864e5) | 0) % 900), body = 'Work order ' + no + '\nType: ' + rt + '\n' + fields.map((f) => f.label + ': ' + (f.val || '—')).join('\n');
    // Dubai time, G7 status and today's shifts
    const d = new Date(s.now), g = new Date(d.getTime() + d.getTimezoneOffset() * 6e4 + 4 * 36e5), day = g.getDay(), m = g.getHours() * 60 + g.getMinutes(), sec = g.getSeconds();
    const H = D ? D.hours : {}, sh = H[day] || [], cur = sh.find(([a, b]) => m >= a && m < b), nxt = sh.find(([a]) => a > m), soon = !!cur && cur[1] - m <= 30;
    const left = cur ? cur[1] - m : nxt ? nxt[0] - m : 0, dur = (x) => (x >= 60 ? Math.floor(x / 60) + 'h ' + pad(x % 60) + 'm' : x + 'm');
    const status = cur ? 'Open now' : 'Closed now', sub = cur ? 'Closes at ' + hm(cur[1]) : nxt ? 'Opens at ' + hm(nxt[0]) : 'Opens ' + (day === 6 ? 'Monday' : 'tomorrow') + ' at 10:30';
    const count = cur ? 'Closes in ' + dur(left) : nxt ? 'Opens in ' + dur(left) : '';
    const week = [6, 1, 2, 3, 4, 5, 0].map((x) => ({ day: DAYS[x], on: x === day, h: (H[x] || []).length ? H[x].map(([a, b]) => hm(a) + '–' + hm(b)).join(' · ') : 'Closed' }));
    return { secRef: this.secRef, seen: s.seen,
      types: RT.map((t) => ({ name: t, on: t === rt, pick: () => this.setState({ type: t }) })), rt, fields, filled, total: fields.length, no,
      lines: fields.filter((f) => f.val.trim()).map((f) => ({ k: f.label.toUpperCase(), v: f.val })), sent: s.sent, sentN: s.sentN,
      sendWa: (e) => { e.preventDefault(); this.send('wa', wa + '?text=' + encodeURIComponent(body)); },
      sendMail: (e) => { e.preventDefault(); this.send('mail', 'mailto:' + email + '?subject=' + encodeURIComponent(no + ' · ' + rt) + '&body=' + encodeURIComponent(body)); },
      clock: hm(m) + ':' + pad(sec), open: !!cur, soon, dot: cur ? (soon ? '#F5A524' : '#5FD49A') : '#E5484D', status, sub, count, today: DAYS[day],
      shifts: sh.map(([a, b]) => ({ l: ((a / 1440) * 100).toFixed(2) + '%', w: (((b - a) / 1440) * 100).toFixed(2) + '%', t: hm(a) + '–' + hm(b) })), nowAt: (((m + sec / 60) / 1440) * 100).toFixed(3) + '%', week,
      address: C.address || 'Al Murar, Deira, Dubai, UAE', plus: C.plus || '78G4+3H2', phone: C.phone || '+971 4 273 3031', tel: 'tel:' + (C.tel || '+97142733031'),
      wa: wa + '?text=' + encodeURIComponent('Hi Sam Electronics, I found you on your website.'),
      dir: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent((C.plus || '78G4+3H2') + ' Dubai') };
  }
}

export default Component;
