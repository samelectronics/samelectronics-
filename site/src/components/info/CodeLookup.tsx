'use client';
// R9 · "Find your phone by its model code": type the code from Settings (SM-A546B, A2846, 2201117TY…) and we find the model;
// with a how-to for each brand. Apple numbers are a built-in table; Samsung codes come from the catalogue names. The match
// is always "check with us": a wrong part is worse than a question.
import React, { useEffect, useMemo, useState } from 'react';
import { data } from '@/lib/catalog';
import { T } from '@/components/site/ui';

// iPhone "A" numbers (Settings → General → About → tap Model Number)
const APPLE: Record<string, string> = Object.fromEntries(Object.entries({
  'iPhone 11': 'A2111 A2221 A2223', 'iPhone 12': 'A2172 A2402 A2403 A2404', 'iPhone 13': 'A2482 A2631 A2633 A2634 A2635', 'iPhone 13 Pro': 'A2483 A2636 A2638 A2639 A2640',
  'iPhone 14': 'A2649 A2881 A2882 A2883 A2884', 'iPhone 14 Pro': 'A2650 A2889 A2890 A2891 A2892', 'iPhone 15': 'A2846 A3089 A3090 A3092', 'iPhone 15 Pro': 'A2848 A3101 A3102 A3104',
  'iPhone 15 Pro Max': 'A2849 A3105 A3106 A3108', 'iPhone 16': 'A3081 A3286 A3287 A3288', 'iPhone 16 Pro': 'A3083 A3292 A3293 A3294', 'iPhone 16 Pro Max': 'A3084 A3295 A3296 A3297',
}).flatMap(([n, codes]) => codes.split(' ').map((c) => [c, n])));
const HOW: [string, string, string][] = [
  ['Apple', 'Settings → General → About', 'Tap “Model Number” once: it changes to a code that starts with A (for example A2846).'],
  ['Samsung', 'Settings → About phone', 'Look for “Model number”, for example SM-A546B. The letters and digits after SM- are what we need.'],
  ['Xiaomi · Redmi · POCO', 'Settings → About phone → Detailed info and specs', 'The model is a number like 2201117TY. The name (e.g. Redmi Note 11) is shown too.'],
  ['Huawei · Honor', 'Settings → About phone', 'Look for “Model”, for example VOG-L29 or ALI-NX1.'],
  ['Oppo · Realme · OnePlus', 'Settings → About device', 'Look for “Model”, for example CPH2565 or RMX3771.'],
  ['Any phone', 'Dial *#06#', 'Shows the IMEI. We can look the model up from it in the shop.'],
];

export default function CodeLookup({ onModel }: { onModel: (id: string, brand: string) => void }) {
  const [q, setQ] = useState(''), D = data();
  // R11b: the example codes type themselves into the empty field, like the shop's search
  const [ph, setPh] = useState('');
  useEffect(() => { const EX = ['SM-A546B', 'A2846', 'RMX3771', 'SM-S911B', '23021RAAEG', 'CPH2591']; let k = 0, n = 0, del = false, tm = 0;
    const go = () => { const w = EX[k % EX.length]; if (!del) { n++; setPh(w.slice(0, n)); if (n >= w.length) { del = true; tm = window.setTimeout(go, 1400); return; } } else { n--; setPh(w.slice(0, n)); if (n <= 0) { del = false; k++; } } tm = window.setTimeout(go, del ? 45 : 95); };
    tm = window.setTimeout(go, 600); return () => window.clearTimeout(tm); }, []);
  const hits = useMemo(() => {
    if (!D) return [];
    const s = q.trim().toUpperCase().replace(/^SM-/, '').replace(/\/.*$/, ''); if (s.length < 3) return [];
    const ap = APPLE[s]; if (ap) return D.models.filter((m) => m.brand_id === 'apple' && m.name.toLowerCase() === ap.toLowerCase()).map((m) => ({ m, why: s + ' = ' + ap }));
    const core = (s.match(/^[A-Z]\d{3}/) || [s])[0];
    const byCode = D.models.filter((m) => m.name.toUpperCase().replace(/[()/]/g, ' ').split(/\s+/).some((t) => t === core || t.startsWith(core)));
    if (byCode.length) return byCode.slice(0, 6).map((m) => ({ m, why: (m.brand_id === 'samsung' ? 'SM-' : '') + core }));
    const words = s.toLowerCase().split(/\s+/);
    return D.models.filter((m) => words.every((w) => m.name.toLowerCase().includes(w))).slice(0, 6).map((m) => ({ m, why: '' }));
  }, [q, D]);
  if (!D) return null;
  return (
    <div className="cl" data-rise>
      <div className="cl-l">
        <span className="sp-eb">{T('NOT SURE WHICH MODEL?')}</span>
        <h3 className="cl-h">{T('Find it by its model code')}</h3>
        <label className="cl-in"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="2" width="12" height="20" rx="3" /><path d="M11 18h2" /></svg><input value={q} onChange={(e) => setQ(e.target.value)} placeholder={T('e.g.') + ' ' + ph} spellCheck={false} autoCapitalize="characters" /></label>
        {q.trim().length >= 3 ? (hits.length ? <div className="cl-hits">{hits.map(({ m, why }) => <button key={m.id} type="button" onClick={() => onModel(m.id, m.brand_id)}><b>{m.name}</b><small>{D.brands.find((b) => b.id === m.brand_id)?.name}{why ? ' · ' + why : ''}</small><i>→</i></button>)}<small className="cl-chk">{T('Please check the model with us before ordering a part.')}</small></div>
          : <p className="cl-none">{T('We could not match that code. Send it to us on WhatsApp and we will tell you.')}</p>) : null}
      </div>
      <ol className="cl-how">{HOW.map(([b, w, d]) => <li key={b}><b>{b}</b><code>{T(w)}</code><span>{T(d)}</span></li>)}</ol>
    </div>
  );
}
