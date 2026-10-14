// @ts-nocheck
// 14 Oct §02 · the shop's live status, shared by the header pill, Visit us and the branch cards (§16).
// Always Dubai time (UTC+4, no daylight saving), whatever the visitor's clock or timezone says.
// Four states, each with a pulsing dot:
//   open     green   inside hours, more than 60 min before a closing time   "Open · until 14:00"
//   closing  yellow  the last 60 min before ANY closing time                "Closing soon · 14:00"
//   closed   red     outside hours, more than 60 min before an opening      "Closed · opens tomorrow 10:30"
//   opening  yellow  the last 60 min before ANY opening time                "Opening soon · 16:00"
export const SOON = 60;
export const DOT = { open: '#5FD49A', closing: '#F7C032', opening: '#F7C032', closed: '#E5484D' };
const DN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const hm = (x) => String(Math.floor(x / 60) % 24).padStart(2, '0') + ':' + String(x % 60).padStart(2, '0');

/** Dubai wall clock for a timestamp: { day 0–6, m minutes since midnight, sec }. */
export function dubai(now) {
  const g = new Date(now + 4 * 36e5); // UTC+4, read with the UTC getters so the visitor's timezone never matters
  return { day: g.getUTCDay(), m: g.getUTCHours() * 60 + g.getUTCMinutes(), sec: g.getUTCSeconds() };
}

/** hours: { [day]: [[openMin, closeMin], …] }. Returns { state, dot, short, at, open, soon, mins, day, m }. */
export function shopStatus(hours, now) {
  const H = hours || {}, { day, m, sec } = dubai(now == null ? Date.now() : now), sh = H[day] || [];
  const cur = sh.find(([a, b]) => m >= a && m < b);
  if (cur) {
    const left = cur[1] - m, soon = left <= SOON;
    return { state: soon ? 'closing' : 'open', dot: soon ? DOT.closing : DOT.open, at: hm(cur[1]), mins: left, open: true, soon, day, m, sec,
      short: soon ? 'Closing soon · ' + hm(cur[1]) : 'Open · until ' + hm(cur[1]) };
  }
  // next opening, up to a week ahead
  for (let k = 0; k < 8; k++) {
    const dd = (day + k) % 7, nx = (H[dd] || []).find(([a]) => k > 0 || a > m);
    if (!nx) continue;
    const wait = k * 1440 + nx[0] - m, soon = wait <= SOON;
    const when = k === 0 ? hm(nx[0]) : k === 1 ? 'tomorrow ' + hm(nx[0]) : DN[dd] + ' ' + hm(nx[0]);
    return { state: soon ? 'opening' : 'closed', dot: soon ? DOT.opening : DOT.closed, at: hm(nx[0]), mins: wait, open: false, soon, day, m, sec,
      short: soon ? 'Opening soon · ' + hm(nx[0]) : 'Closed · opens ' + when };
  }
  return { state: 'closed', dot: DOT.closed, at: '', mins: 0, open: false, soon: false, day, m, sec, short: 'Closed' };
}
