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

const NS = 'http://www.w3.org/2000/svg';
// R10 U2 (owner: "no 2 cm stubs, no lumps"): ONE generator, drawn like the hero. Down each side's empty gutter: a few
// traces enter from the section's edge, run DOWN the gutter, bend inward with 45° chamfers, one more joins them halfway
// (with a junction node), and each ends in a pad. Never closer than 18px to any content; same 2px stroke as the hero; a
// light pulse runs along every trace continuously (infinite loop, never restarting). Gutters under 48px get nothing.
function lanes(gw: number, H: number, side: 1 | -1, s0: number) {
  seed = s0;
  const W = Math.min(gw - 18, 120), n = W >= 80 ? 3 : W >= 52 ? 2 : 1, step = Math.max(14, Math.min(26, (W - 12) / n));
  const X = (x: number) => (side > 0 ? x : W - x), f = (v: number) => v.toFixed(0);
  const paths: { d: string; len: number }[] = [], pads: [number, number, number][] = [], joints: [number, number][] = [];
  const laneX: number[] = [];
  for (let i = 0; i < n; i++) {
    const lx = 8 + i * step; laneX.push(lx);
    let y = 40 + i * 30 + rnd() * 24; const y0 = y;
    let d = `M${f(X(0))} ${f(y)} H${f(X(lx - 10))} L${f(X(lx))} ${f(y + 10)}`; y += 10;
    // the long run down, with one gentle 45° jog toward the content and back
    const end = H * (0.62 + rnd() * 0.3) - i * 40, jogAt = y + (end - y) * (0.3 + rnd() * 0.3), jog = Math.min(10, W - lx - 6);
    if (jog > 4 && end - y > 260) { d += ` V${f(jogAt)} L${f(X(lx + jog))} ${f(jogAt + jog)} V${f(jogAt + jog + 90)} L${f(X(lx))} ${f(jogAt + 2 * jog + 90)}`; y = jogAt + 2 * jog + 90; }
    // the end: bend inward and finish on a pad (still inside the gutter)
    const bx = Math.min(W - 6, lx + 12 + rnd() * 14), by = Math.max(y + 40, end);
    d += ` V${f(by)} L${f(X(bx))} ${f(by + (bx - lx))} V${f(by + (bx - lx) + 22)}`;
    pads.push([X(bx), by + (bx - lx) + 22, i % 2 ? 3.5 : 4.5]); paths.push({ d, len: by - y0 + 80 });
  }
  // one trace joins the outer lane halfway down, entering from the edge
  if (H > 700) {
    const jy = H * (0.38 + rnd() * 0.2), lx = laneX[0];
    const d = `M${f(X(0))} ${f(jy - 14)} L${f(X(lx - 14 > 0 ? lx - 14 : 0))} ${f(jy - 14)} L${f(X(lx))} ${f(jy)}`;
    paths.push({ d, len: lx + 20 }); joints.push([X(lx), jy]);
  }
  return { W, paths, pads, joints };
}

function gutter(sec: HTMLElement, gw: number, side: 1 | -1, t: string, s0: number, host?: HTMLElement) {
  if (gw < 48) return;
  const box = host || sec, H = box.getBoundingClientRect().height; if (H < 320) return;
  const { W, paths, pads, joints } = lanes(gw, H, side, s0);
  const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'se-gut se-gut-' + t); svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('width', String(W)); svg.setAttribute('height', String(Math.round(H))); svg.setAttribute('viewBox', `0 0 ${W} ${Math.round(H)}`);
  svg.style.cssText = `position:absolute;top:0;${side > 0 ? 'left' : 'right'}:0;width:${W}px;height:${Math.round(H)}px;pointer-events:none;z-index:0;overflow:visible`;
  paths.forEach(({ d, len }, i) => { const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); p.setAttribute('class', 'tr'); svg.appendChild(p);
    const fl = document.createElementNS(NS, 'path'); fl.setAttribute('d', d); fl.setAttribute('class', 'fl'); fl.setAttribute('pathLength', '1000');
    fl.style.animationDuration = Math.max(2.4, Math.min(9, len / 260)).toFixed(1) + 's'; fl.style.animationDelay = (-(i * 1.3)).toFixed(1) + 's'; svg.appendChild(fl); });
  pads.forEach(([x, y, r]) => { const c = document.createElementNS(NS, 'circle'); c.setAttribute('cx', x.toFixed(1)); c.setAttribute('cy', y.toFixed(1)); c.setAttribute('r', String(r)); c.setAttribute('class', 'nd'); svg.appendChild(c); });
  joints.forEach(([x, y]) => { const c = document.createElementNS(NS, 'circle'); c.setAttribute('cx', x.toFixed(1)); c.setAttribute('cy', y.toFixed(1)); c.setAttribute('r', '3'); c.setAttribute('class', 'jn'); svg.appendChild(c); });
  if (getComputedStyle(box).position === 'static') box.style.position = 'relative';
  box.prepend(svg);
}

// owner (R8): every section gets a quiet material under its content, the way the hero has one: graphite sections a fine
// diamond plate that fades out from one side, a diagonal light streak and a slow drifting yellow LED glow; yellow sections
// fine horizontal scan lines and a soft light; light sections brushed aluminium with a soft light from above. Low enough
// that it reads as material, never as a pattern. Placed under everything (the section is its own stacking context).
const NOTEX = new Set(['finale', 'teardown', 'top']);
function texture(sec: HTMLElement, t: 'dark' | 'light' | 'yel', k: number) {
  if (NOTEX.has(sec.id) || sec.querySelector(':scope > .se-tex')) return;
  const d = document.createElement('div'); d.className = 'se-tex se-tex-' + t + (k % 2 ? ' r' : ''); d.setAttribute('aria-hidden', 'true');
  // R9 (owner): no stripes or half-page panels; a fine grain that fades in from the top, a soft studio light, and a shine that
  // follows the pointer like the hero's (dark: the diamond plate the owner liked + the drifting yellow LED glow)
  d.innerHTML = t === 'dark' ? '<i class="pl"></i><i class="st"></i><i class="led"></i><i class="gr"></i><i class="sh"></i>' : '<i class="gr"></i><i class="lt"></i><i class="sh"></i>';
  if (getComputedStyle(sec).position === 'static') sec.style.position = 'relative';
  sec.style.isolation = 'isolate'; sec.prepend(d);
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
const OWN = new Set(['story', 'finale']); // these draw their own hero-style circuits

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
        markEntries(sec); io!.observe(sec); texture(sec, tone(sec), k); sec.querySelectorAll('[data-se-rise]').forEach((el) => { if (!(el as HTMLElement).dataset.seObs) { (el as HTMLElement).dataset.seObs = '1'; eio!.observe(el); } });
        // R10 U2: every home section gets the same circuits, only in its empty side gutters (sections with their own
        // hero-style circuits keep theirs: story, finale)
        const host = sec.id === 'quality' ? (sec.querySelector('.bt-pin') as HTMLElement | null) || undefined : undefined;
        if (window.innerWidth >= 1100 && !OWN.has(sec.id) && !(host || sec).querySelector(':scope > .se-gut')) { const t = tone(sec), e = contentEdges(host || sec);
          gutter(sec, e.l, 1, t, 101 + k * 37, host); gutter(sec, e.r, -1, t, 207 + k * 53, host); }
      });
    } catch (err) { console.warn('[SectionLife]', err); } };
    (window as unknown as { __seLife?: () => void }).__seLife = run;
    // the shine follows the pointer inside whichever section it is over (one listener, at most one write per frame)
    let pend: PointerEvent | null = null, rq = 0, cur: HTMLElement | null = null;
    const mv = (e: PointerEvent) => { pend = e; if (!rq) rq = requestAnimationFrame(() => { rq = 0; const ev = pend; if (!ev) return; const sec = (ev.target as Element | null)?.closest?.('section[id]') as HTMLElement | null; const tex = sec?.querySelector(':scope > .se-tex') as HTMLElement | null;
      if (cur && cur !== tex) cur.classList.remove('lit'); cur = tex; if (!tex || !sec) return; const b = sec.getBoundingClientRect(); tex.style.setProperty('--mx', (ev.clientX - b.left).toFixed(0) + 'px'); tex.style.setProperty('--my', (ev.clientY - b.top).toFixed(0) + 'px'); tex.classList.add('lit'); }); };
    window.addEventListener('pointermove', mv, { passive: true });
    // the sections arrive late (the home page renders in the browser): keep checking for the first 30s; already-done
    // sections are skipped, so each pass is cheap
    let n = 0; t1 = window.setInterval(() => { run(); if (++n > 15) clearInterval(t1); }, 2000); t2 = window.setTimeout(run, 600);
    return () => { clearInterval(t1); clearTimeout(t2); io && io.disconnect(); eio && eio.disconnect(); window.removeEventListener('pointermove', mv); cancelAnimationFrame(rq); };
  }, []);
  return null;
}
