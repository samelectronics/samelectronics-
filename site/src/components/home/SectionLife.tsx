'use client';
// Owner (27 Oct), two site-wide rules, applied to every home section after the hero and the teardown:
//  1. ENTRY: each section plays an entrance like the hero's (eyebrow, title, text, then its cards one after another,
//     rising in). It replays every time the section comes back into view (scroll away and back = it plays again).
//  2. CIRCUITS: each section gets its OWN branching circuit traces in its side gutters (never across the page, never
//     under text), with a light running along them, coloured for the section (yellow on graphite, graphite on fog/yellow).
import { useEffect } from 'react';

const SKIP = new Set(['top', 'teardown']);
let seed = 1;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

function tone(sec: HTMLElement): 'dark' | 'light' | 'yel' {
  const els = [sec, ...Array.from(sec.children).slice(0, 3)] as HTMLElement[];
  for (const e of els) {
    const cs = getComputedStyle(e), s = cs.backgroundColor + ' ' + cs.backgroundImage;
    if (/247, 192, 50/.test(s)) return 'yel';
    const m = cs.backgroundColor.match(/\d+/g);
    if (m && cs.backgroundColor !== 'rgba(0, 0, 0, 0)') { const l = (+m[0] * 0.3 + +m[1] * 0.59 + +m[2] * 0.11); return l < 110 ? 'dark' : 'light'; }
    const g = cs.backgroundImage.match(/rgb\((\d+), (\d+), (\d+)\)/); if (g) { const l = (+g[1] * 0.3 + +g[2] * 0.59 + +g[3] * 0.11); return l < 110 ? 'dark' : 'light'; }
  }
  return sec.getAttribute('data-tone') === 'dark' ? 'dark' : 'light';
}

/** the content's left/right edge inside the section (the gutters are what is left) */
function contentEdges(sec: HTMLElement) {
  const sr = sec.getBoundingClientRect(); let l = sr.width, r = 0;
  sec.querySelectorAll('h1,h2,h3,p,button,a,img,canvas,input,[class*="card"],[data-reveal]').forEach((e) => { const b = (e as HTMLElement).getBoundingClientRect(); if (b.width < 4 || b.height < 4 || b.width > sr.width * 0.97) return; l = Math.min(l, b.left - sr.left); r = Math.max(r, b.right - sr.left); });
  return { l, r: sr.width - r, w: sr.width, h: sr.height };
}

// owner (28 Oct): NOT continuous gutters any more. Circuits are used the way the hero uses them: a few short traces that
// come in from the section's edge into ONE empty corner, with 45° chamfers, pads where they end and a short light pulse
// running along them. Two small clusters per section (top on one side, bottom on the other, alternating by section).
function cluster(gw: number, side: 1 | -1, s0: number) {
  seed = s0; const W = Math.min(190, gw - 18), paths: string[] = [], pads: [number, number, number][] = [];
  const X = (x: number) => (side > 0 ? x : W - x);
  const n = 3 + Math.floor(rnd() * 2);
  for (let k = 0; k < n; k++) {
    let y = 20 + k * (34 + rnd() * 18), x = 0, d = `M${X(0)} ${y.toFixed(0)}`;
    const len = W * (0.45 + rnd() * 0.5);
    x = len * (0.3 + rnd() * 0.3); d += ` H${X(x).toFixed(0)}`;
    const dy = (rnd() < 0.5 ? -1 : 1) * (14 + rnd() * 22); x += Math.abs(dy); y += dy; d += ` L${X(x).toFixed(0)} ${y.toFixed(0)}`;
    if (rnd() < 0.6) { x = Math.min(W - 8, len); d += ` H${X(x).toFixed(0)}`; }
    else { const v = 20 + rnd() * 40; y += v; d += ` V${y.toFixed(0)}`; }
    paths.push(d); pads.push([X(x), y, k % 2 ? 3.5 : 4.5]);
  }
  return { W, H: 20 + n * 52 + 60, paths, pads };
}

const NS = 'http://www.w3.org/2000/svg';
function gutter(sec: HTMLElement, gw: number, side: 1 | -1, t: string, s0: number, top: boolean, at?: number) {
  if (gw < 70) return;
  const { W, H, paths, pads } = cluster(gw, side, s0), h = sec.getBoundingClientRect().height; if (h < H + 80) return;
  const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'se-gut se-gut-' + t); svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('width', String(W)); svg.setAttribute('height', String(H)); svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.style.cssText = `position:absolute;${at != null ? 'top:' + Math.round(h * at) : top ? 'top:' + Math.round(h * 0.12) : 'bottom:' + Math.round(h * 0.1)}px;${side > 0 ? 'left' : 'right'}:0;width:${W}px;height:${H}px;pointer-events:none;z-index:0;overflow:visible`;
  paths.forEach((d, i) => { const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); p.setAttribute('class', 'tr'); svg.appendChild(p);
    const f = document.createElementNS(NS, 'path'); f.setAttribute('d', d); f.setAttribute('class', 'fl'); f.setAttribute('pathLength', '1000'); f.style.animationDuration = (2.8 + (i % 3) * 0.9).toFixed(1) + 's'; f.style.animationDelay = (i * 0.7).toFixed(1) + 's'; svg.appendChild(f); });
  pads.forEach(([x, y, r]) => { const c = document.createElementNS(NS, 'circle'); c.setAttribute('cx', x.toFixed(1)); c.setAttribute('cy', y.toFixed(1)); c.setAttribute('r', String(r)); c.setAttribute('class', 'nd'); svg.appendChild(c); });
  sec.prepend(svg);
}

function markEntries(sec: HTMLElement) {
  if (sec.dataset.seLife) return; sec.dataset.seLife = '1';
  const mark = (e: Element | null, i: number) => { if (!e || (e as HTMLElement).dataset.seRise != null || e.closest('[data-own-entry]')) return; const cs = getComputedStyle(e); if (cs.animationName !== 'none' || cs.position === 'fixed' || cs.opacity === '0' || cs.display === 'none' || (cs.position === 'absolute' && !(e as HTMLElement).innerText)) return; /* never wake hidden decor layers */ (e as HTMLElement).dataset.seRise = ''; (e as HTMLElement).style.setProperty('--i', String(i)); };
  const h2 = sec.querySelector('h2'); let i = 0;
  if (h2) { const pre = h2.previousElementSibling; if (pre && (pre as HTMLElement).getBoundingClientRect().height < 60) mark(pre, i++); mark(h2, i++); let n = h2.nextElementSibling, c = 0; while (n && c < 3) { if ((n as HTMLElement).getBoundingClientRect().height < 260) mark(n, i++); n = n.nextElementSibling; c++; } }
  // card groups: 3+ siblings of the same kind, card-sized, not already inside a marked element
  const groups = new Set<Element>(); sec.querySelectorAll('*').forEach((e) => { const p = e.parentElement; if (!p || groups.has(p) || groups.size >= 3) return; const kids = Array.from(p.children).filter((k) => k.tagName === e.tagName && k.className === e.className); if (kids.length < 3) return; const b = (e as HTMLElement).getBoundingClientRect(); if (b.width < 90 || b.height < 60 || b.width > 900) return; if (p.closest('[data-se-rise]')) return; groups.add(p); });
  groups.forEach((p) => { Array.from(p.children).slice(0, 12).forEach((k, j) => mark(k, Math.min(12, i + 1 + j))); });
}

// owner (28 Oct): the small corner circuits stay only where the owner kept them; every other section is clean
// R8: tall sections that felt bare (What we offer) get a few more clusters down their sides, still only in the empty
// gutters and alternating left / right like the hero: fractions of the section height where each one sits
const TALL: Record<string, number[]> = { families: [0.06, 0.24, 0.46, 0.68, 0.86] };
const GUT = new Set(['families', 'quality', 'wholesale', 'reviews', 'board']);

export default function SectionLife() {
  useEffect(() => {
    let io: IntersectionObserver | null = null, eio: IntersectionObserver | null = null, t1 = 0, t2 = 0;
    const run = () => { try {
      const secs = Array.from(document.querySelectorAll('section[id]')).filter((s) => !SKIP.has(s.id) && !s.parentElement?.closest('section')) as HTMLElement[];
      io = io || new IntersectionObserver((es) => es.forEach((e) => { const el = e.target as HTMLElement; if (e.isIntersecting && e.intersectionRatio > 0.08) el.setAttribute('data-se-vis', ''); else if (!e.isIntersecting) el.removeAttribute('data-se-vis'); }), { threshold: [0, 0.08, 0.2] });
      // owner (28 Oct): each marked element plays its entrance when IT comes into view (not when the section's top edge does),
      // so long sections never finish their entrance off-screen; fully out of view resets it so it plays again next time
      eio = eio || new IntersectionObserver((es) => es.forEach((e) => { const el = e.target as HTMLElement; if (e.isIntersecting && e.intersectionRatio > 0.12) el.setAttribute('data-se-on', ''); else if (!e.isIntersecting) el.removeAttribute('data-se-on'); }), { threshold: [0, 0.12, 0.3] });
      secs.forEach((sec, k) => {
        markEntries(sec); io!.observe(sec); sec.querySelectorAll('[data-se-rise]').forEach((el) => { if (!(el as HTMLElement).dataset.seObs) { (el as HTMLElement).dataset.seObs = '1'; eio!.observe(el); } });
        if (window.innerWidth >= 1100 && GUT.has(sec.id) && !sec.querySelector(':scope > .se-gut') && !sec.querySelector('.se-cfield') && !sec.querySelector('.se-own-circ')) { const t = tone(sec), e = contentEdges(sec); if (getComputedStyle(sec).position === 'static') sec.style.position = 'relative'; if (TALL[sec.id]) TALL[sec.id].forEach((at, j) => gutter(sec, j % 2 ? e.r : e.l, j % 2 ? -1 : 1, t, 101 + k * 37 + j * 71, true, at));
          else { gutter(sec, e.l, 1, t, 101 + k * 37, k % 2 === 0); gutter(sec, e.r, -1, t, 207 + k * 53, k % 2 === 1); } }
      });
    } catch (err) { console.warn('[SectionLife]', err); } };
    (window as unknown as { __seLife?: () => void }).__seLife = run;
    // the sections arrive late (the home page renders in the browser): keep checking for the first 30s; already-done
    // sections are skipped, so each pass is cheap
    let n = 0; t1 = window.setInterval(() => { run(); if (++n > 15) clearInterval(t1); }, 2000); t2 = window.setTimeout(run, 600);
    return () => { clearInterval(t1); clearTimeout(t2); io && io.disconnect(); eio && eio.disconnect(); };
  }, []);
  return null;
}
