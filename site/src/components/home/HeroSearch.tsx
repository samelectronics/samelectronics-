'use client';
/**
 * Issue 1B: the hero search bar works. The bar keeps its look and its typing suggestions (the animated
 * words) while it is empty; clicking it puts the caret in. Typing a model shows suggestions from our model
 * list, tolerant of small typos; Enter or a click opens the G17 "Coming soon" card for that model's full
 * page, with a button that opens Find My Part for it.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { comingSoon } from '@/components/g17/ComingSoon';
import SEBrandLogo from '@/components/dc/SEBrandLogo';

/** R6 §03 A · the example searches: the caret appears with the first typed letter and blinks only once the word is
 *  complete; after erasing, the field stays empty for 300ms before the next example starts. */
function Typewriter({ words }: { words: string[] }) {
  const [txt, setTxt] = useState(''), [done, setDone] = useState(false);
  useEffect(() => {
    if (!words.length) return;
    let wi = 0, ci = 0, phase: 'type' | 'hold' | 'erase' | 'gap' = 'type', tm = 0;
    const step = () => {
      const w0 = words[wi % words.length], L = (window as unknown as { seI18n?: { t: (x: string) => string } }).seI18n, w = L ? L.t(w0) : w0; // in the visitor's language
      if (phase === 'type') { ci++; setTxt(w.slice(0, ci)); if (ci >= w.length) { phase = 'hold'; setDone(true); tm = window.setTimeout(step, 1600); return; } tm = window.setTimeout(step, 60 + Math.random() * 40); return; }
      if (phase === 'hold') { phase = 'erase'; setDone(false); }
      if (phase === 'erase') { ci--; setTxt(w.slice(0, Math.max(0, ci))); if (ci <= 0) { phase = 'gap'; tm = window.setTimeout(step, 300); return; } tm = window.setTimeout(step, 28); return; }
      if (phase === 'gap') { wi++; ci = 0; phase = 'type'; tm = window.setTimeout(step, 10); }
    };
    tm = window.setTimeout(step, 500);
    return () => window.clearTimeout(tm);
  }, [words]);
  return (
    <span className="se-tw" aria-hidden="true">
      {txt}
      {txt ? <i className={done ? 'blink' : ''} /> : null}
    </span>
  );
}

type Model = { id: string; name: string; brand_id: string; series: string; model_numbers: string[] };
type Hit = { m: Model; cat: string | null; score: number };

const CATS: [string, RegExp][] = [
  ['SCR', /\b(screen|screens|lcd|oled|display|scren|screan)\b|شاش/],
  ['BAT', /\b(battery|batteries|batt|batery|battry)\b|بطاري/],
  ['FLX', /\b(flex|charging|cable)\b/],
  ['BCV', /\b(back|cover|glass)\b/],
  ['CAM', /\b(camera|cam|camra)\b|كاميرا/],
  ['FRM', /\b(frame|housing)\b/],
];
const key = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
/** Damerau–Levenshtein (optimal string alignment). */
function dist(a: string, b: string) {
  const m = a.length, n = b.length, d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  return d[m][n];
}

export function findModels(q: string, models: Model[]): Hit[] {
  const low = q.toLowerCase();
  const cat = CATS.find(([, re]) => re.test(low))?.[0] || null;
  let words = low;
  CATS.forEach(([, re]) => (words = words.replace(new RegExp(re.source, 'g'), ' ')));
  const nq = key(words);
  if (nq.length < 2) return [];
  const out: Hit[] = [];
  for (const m of models) {
    const tail = m.name.replace(/^(galaxy|iphone|ipad|google pixel|pixel|xiaomi|redmi|realme|oppo|huawei|honor|vivo|oneplus|nokia|tecno|infinix|poco)\s*/i, '');
    const keys = [key(m.name), key(m.brand_id + m.name), key(tail), ...m.model_numbers.map(key)];
    let best = 9;
    for (const k of keys) {
      if (k === nq) best = Math.min(best, 0);
      else if (k.startsWith(nq)) best = Math.min(best, 0.5 + (k.length - nq.length) * 0.01);
      else if (k.includes(nq)) best = Math.min(best, 1);
      else {
        const pre = k.slice(0, nq.length), lim = nq.length <= 4 ? 1 : 2;
        const dd = Math.min(dist(nq, pre), dist(nq, k));
        if (dd <= lim) best = Math.min(best, 1.5 + dd);
      }
    }
    if (best < 9) out.push({ m, cat, score: best + m.name.length * 0.001 });
  }
  return out.sort((a, b) => a.score - b.score).slice(0, 8);
}

export default function HeroSearch({ examples, openFmp }: { examples: string[]; openFmp: (b?: string, m?: string, c?: string | null, q?: string) => void }) {
  const [q, setQ] = useState('');
  const [focus, setFocus] = useState(false);
  const [sel, setSel] = useState(0);
  const inp = useRef<HTMLInputElement>(null);
  const hits = useMemo(() => {
    const D = (window as unknown as { SE_DATA?: { models: Model[] } }).SE_DATA;
    return q.trim() && D ? findModels(q, D.models) : [];
  }, [q]);
  const pick = (h?: Hit) => {
    if (!h) {
      if (!q.trim()) return inp.current?.focus();
      // no model matched: Find My Part with the words typed
      // the shop page with these results is coming (G17): say what was searched, offer Find My Part with the words
      comingSoon({ title: '“' + q.trim() + '”', text: 'Search results open on the Shop page, coming soon. Use Find My Part in the meantime.', cta: 'Open Find My Part', act: () => openFmp(undefined, undefined, null, q) });
      return;
    }
    setFocus(false);
    inp.current?.blur();
    comingSoon({
      title: h.m.name,
      text: `The full ${h.m.name} page is coming soon. Use Find My Part in the meantime.`,
      cta: 'Open Find My Part',
      act: () => openFmp(h.m.brand_id, h.m.id, h.cat),
    });
  };
  const open = focus && hits.length > 0;
  const fams = (id: string) => {
    const D = (window as unknown as { SE_DATA?: { products: { model_id: string; category: string }[]; categories: { id: string; name: string }[] } }).SE_DATA;
    if (!D) return '';
    const cs = [...new Set(D.products.filter((p) => p.model_id === id).map((p) => p.category))].map((c) => D.categories.find((x) => x.id === c)?.name).filter(Boolean);
    return cs.length ? cs.slice(0, 3).join(' · ') + (cs.length > 3 ? ' · +' + (cs.length - 3) : '') : 'All parts · ask us';
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        pick(hits[sel]);
      }}
      onClick={() => inp.current?.focus()}
      className="se-search-glow"
      role="search"
      style={{
        position: 'relative', width: '620px', display: 'flex', alignItems: 'center', gap: '12px', height: '64px', boxSizing: 'border-box',
        padding: '0 7px 0 20px', borderRadius: '10px', background: '#FFFFFF', color: '#26282B', textAlign: 'left', cursor: 'text',
        boxShadow: '0 0 0 2px rgba(247,192,50,.4),0 0 30px rgba(247,192,50,.18)',
      }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#26282B" strokeWidth="2">
        <circle cx="11" cy="11" r="7"></circle>
        <path d="m20 20-3.5-3.5"></path>
      </svg>
      <span style={{ position: 'relative', flex: '1', height: '22px', fontSize: '16px', color: '#3D3E3F', whiteSpace: 'nowrap', overflow: 'hidden' }}>
        {!q && !focus ? <Typewriter words={examples} /> : null}
        <input
          ref={inp}
          className="se-hs-input"
          value={q}
          dir="auto"
          aria-label="Search by model"
          placeholder={focus ? 'Type a model, e.g. iPhone 13' : ''}
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls="se-hs-list"
          onChange={(e) => {
            setQ(e.target.value);
            setSel(0);
          }}
          onFocus={() => setFocus(true)}
          onBlur={() => setTimeout(() => setFocus(false), 150)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') { e.preventDefault(); setSel((x) => Math.min(hits.length - 1, x + 1)); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((x) => Math.max(0, x - 1)); }
            else if (e.key === 'Escape') inp.current?.blur();
          }}
        />
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', color: '#8C9096', padding: '4px 8px', borderRadius: '6px', boxShadow: 'inset 0 0 0 1px rgba(26,27,29,.14)' }}>
        Ctrl K
      </span>
      <button
        type="submit"
        style={{ display: 'flex', alignItems: 'center', gap: '10px', height: '44px', padding: '0 18px', borderRadius: '10px', border: 'none', background: '#26282B', color: '#FFFFFF', fontWeight: '600', fontSize: '15px', cursor: 'pointer' }}
      >
        Search
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F7C032" strokeWidth="2.4">
          <path d="M5 12h14M13 6l6 6-6 6"></path>
        </svg>
      </button>
      {open ? (
        <ul id="se-hs-list" className="se-hs-list" role="listbox">
          {hits.map((h, i) => (
            <li
              key={h.m.id}
              role="option"
              aria-selected={i === sel}
              onMouseEnter={() => setSel(i)}
              onMouseDown={(e) => {
                e.preventDefault();
                pick(h);
              }}
            >
              {/* R6 §03 A: brand logo, model, the part families we list for it */}
              <span className="lg"><SEBrandLogo brand={h.m.brand_id} color="#26282B" h="13" /></span>
              <span data-no-i18n="">{h.m.name}</span>
              <small>{fams(h.m.id)}</small>
            </li>
          ))}
        </ul>
      ) : null}
    </form>
  );
}
