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

function traces(w: number, h: number, side: 1 | -1, s0: number) {
  // orthogonal runs with 45° chamfers, a few branches, ring nodes and pads (like the hero's board)
  seed = s0; const paths: string[] = [], nodes: [number, number, number][] = [];
  const X = (x: number) => (side > 0 ? x : w - x);
  const lanes = Math.max(2, Math.min(5, Math.floor(w / 26)));
  for (let k = 0; k < lanes; k++) {
    let x = 10 + k * ((w - 20) / lanes) + rnd() * 8, y = -10 - rnd() * 60; let d = `M${X(x).toFixed(1)} ${y.toFixed(1)}`;
    while (y < h + 20) {
      const run = 90 + rnd() * 260; y += run; d += ` V${y.toFixed(1)}`;
      if (rnd() < 0.55) { const dx = (rnd() < 0.5 ? -1 : 1) * (10 + rnd() * 18), nx = Math.max(6, Math.min(w - 6, x + dx)); const ch = Math.abs(nx - x); y += ch; x = nx; d += ` L${X(x).toFixed(1)} ${y.toFixed(1)}`; }
      if (rnd() < 0.35) { // a branch ending in a ring node
        const bl = 14 + rnd() * 26, bx = Math.max(6, Math.min(w - 6, x + (rnd() < 0.5 ? -1 : 1) * bl)); paths.push(`M${X(x).toFixed(1)} ${y.toFixed(1)} L${X(bx).toFixed(1)} ${(y + Math.abs(bx - x)).toFixed(1)} V${(y + Math.abs(bx - x) + 20 + rnd() * 40).toFixed(1)}`);
        nodes.push([X(bx), y + Math.abs(bx - x) + 20 + rnd() * 40, 3.2]);
      }
      if (rnd() < 0.25) nodes.push([X(x), y, 2.2]);
    }
    paths.push(d);
  }
  return { paths, nodes };
}

const NS = 'http://www.w3.org/2000/svg';
function gutter(sec: HTMLElement, gw: number, side: 1 | -1, t: string, s0: number) {
  const h = sec.getBoundingClientRect().height, w = Math.min(150, gw - 22); if (w < 40) return;
  const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'se-gut se-gut-' + t); svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('width', String(w)); svg.setAttribute('height', String(h)); svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.style.cssText = `position:absolute;top:0;${side > 0 ? 'left' : 'right'}:0;width:${w}px;height:${h}px;pointer-events:none;z-index:0;overflow:visible`;
  const { paths, nodes } = traces(w, h, side, s0);
  paths.forEach((d, i) => { const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); p.setAttribute('class', 'tr'); svg.appendChild(p);
    const f = document.createElementNS(NS, 'path'); f.setAttribute('d', d); f.setAttribute('class', 'fl'); f.style.animationDuration = (5 + (i % 4) * 1.7).toFixed(1) + 's'; f.style.animationDelay = -(i * 1.3).toFixed(1) + 's'; svg.appendChild(f); });
  nodes.forEach(([x, y, r]) => { const c = document.createElementNS(NS, 'circle'); c.setAttribute('cx', x.toFixed(1)); c.setAttribute('cy', y.toFixed(1)); c.setAttribute('r', String(r)); c.setAttribute('class', 'nd'); svg.appendChild(c); });
  sec.prepend(svg);
}

function markEntries(sec: HTMLElement) {
  if (sec.dataset.seLife) return; sec.dataset.seLife = '1';
  const mark = (e: Element | null, i: number) => { if (!e || (e as HTMLElement).dataset.seRise != null) return; const cs = getComputedStyle(e); if (cs.animationName !== 'none' || cs.position === 'fixed') return; (e as HTMLElement).dataset.seRise = ''; (e as HTMLElement).style.setProperty('--i', String(i)); };
  const h2 = sec.querySelector('h2'); let i = 0;
  if (h2) { const pre = h2.previousElementSibling; if (pre && (pre as HTMLElement).getBoundingClientRect().height < 60) mark(pre, i++); mark(h2, i++); let n = h2.nextElementSibling, c = 0; while (n && c < 3) { if ((n as HTMLElement).getBoundingClientRect().height < 260) mark(n, i++); n = n.nextElementSibling; c++; } }
  // card groups: 3+ siblings of the same kind, card-sized, not already inside a marked element
  const groups = new Set<Element>(); sec.querySelectorAll('*').forEach((e) => { const p = e.parentElement; if (!p || groups.has(p) || groups.size >= 3) return; const kids = Array.from(p.children).filter((k) => k.tagName === e.tagName && k.className === e.className); if (kids.length < 3) return; const b = (e as HTMLElement).getBoundingClientRect(); if (b.width < 90 || b.height < 60 || b.width > 900) return; if (p.closest('[data-se-rise]')) return; groups.add(p); });
  groups.forEach((p) => { Array.from(p.children).slice(0, 12).forEach((k, j) => mark(k, Math.min(12, i + 1 + j))); });
}

export default function SectionLife() {
  useEffect(() => {
    let io: IntersectionObserver | null = null, t1 = 0, t2 = 0;
    const run = () => { try {
      const secs = Array.from(document.querySelectorAll('section[id]')).filter((s) => !SKIP.has(s.id) && !s.parentElement?.closest('section')) as HTMLElement[];
      io = io || new IntersectionObserver((es) => es.forEach((e) => { const el = e.target as HTMLElement; if (e.isIntersecting && e.intersectionRatio > 0.08) el.setAttribute('data-se-vis', ''); else if (!e.isIntersecting) el.removeAttribute('data-se-vis'); }), { threshold: [0, 0.08, 0.2] });
      secs.forEach((sec, k) => {
        markEntries(sec); io!.observe(sec);
        if (window.innerWidth >= 1100 && !sec.querySelector(':scope > .se-gut') && !sec.querySelector('.se-cfield')) { const t = tone(sec), e = contentEdges(sec); if (getComputedStyle(sec).position === 'static') sec.style.position = 'relative'; gutter(sec, e.l, 1, t, 101 + k * 37); gutter(sec, e.r, -1, t, 207 + k * 53); }
      });
    } catch (err) { console.warn('[SectionLife]', err); } };
    (window as unknown as { __seLife?: () => void }).__seLife = run;
    // the sections arrive late (the home page renders in the browser): keep checking for the first 30s; already-done
    // sections are skipped, so each pass is cheap
    let n = 0; t1 = window.setInterval(() => { run(); if (++n > 15) clearInterval(t1); }, 2000); t2 = window.setTimeout(run, 600);
    return () => { clearInterval(t1); clearTimeout(t2); io && io.disconnect(); };
  }, []);
  return null;
}
