'use client';
// Owner (16 Nov): "be creative, the header must be interesting: colours, tech, how the text is presented, bold text with
// outlines" (no objects). An editorial poster: every word of the title is its own giant line, sized to fill the width,
// alternating left / right and outline / solid / yellow. The lines race in from their side and lock; thin yellow rules
// draw between them with small technical labels (page number, place, live Dubai time); the lines drift with the pointer
// and slide apart as you scroll away. The sentence and the buttons sit in a compact block at the bottom.
import React, { useEffect, useRef, useState } from 'react';

const STY = ['o', 's', 'y', 'o', 's', 'y'];
export default function PosterHero({ eb, title, accent, sub, crumb, children, code }: { eb: string; title: string; accent?: string; sub?: string; crumb?: React.ReactNode; children?: React.ReactNode; code: string }) {
  const ref = useRef<HTMLDivElement>(null), [on, setOn] = useState(false), [clock, setClock] = useState('');
  const words = [...title.split(' '), ...(accent ? accent.split(' ') : [])].filter(Boolean);
  // short words join their neighbour so no line is a lonely "a"
  const lines: string[] = []; words.forEach((w) => { const l = lines[lines.length - 1]; if (l && (l.length + w.length < 9 || w.replace(/\W/g, '').length <= 2)) lines[lines.length - 1] = l + ' ' + w; else lines.push(w); });
  while (lines.length > 3) { let bi = 0, bl = 1e9; for (let j = 0; j < lines.length - 1; j++) { const n = lines[j].length + lines[j + 1].length; if (n < bl) { bl = n; bi = j; } } lines.splice(bi, 2, lines[bi] + ' ' + lines[bi + 1]); }
  const nT = title.split(' ').filter(Boolean).length;
  useEffect(() => {
    const t = window.setTimeout(() => setOn(true), 60);
    const tick = () => { const d = new Date(Date.now() + (new Date().getTimezoneOffset() + 240) * 60000), p = (n: number) => String(n).padStart(2, '0'); setClock(p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds())); };
    tick(); const iv = window.setInterval(tick, 1000);
    const el = ref.current; let raf = 0, mx = 0, sy = 0;
    const paint = () => { raf = 0; if (!el) return; el.style.setProperty('--mx', mx.toFixed(3)); el.style.setProperty('--sy', sy.toFixed(3)); };
    const move = (e: PointerEvent) => { mx = (e.clientX / innerWidth - 0.5) * 2; if (!raf) raf = requestAnimationFrame(paint); };
    const scr = () => { if (!el) return; const r = el.getBoundingClientRect(); sy = Math.max(0, Math.min(1, -r.top / Math.max(1, r.height))); if (!raf) raf = requestAnimationFrame(paint); };
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!reduced) { window.addEventListener('pointermove', move, { passive: true }); window.addEventListener('scroll', scr, { passive: true }); }
    return () => { window.clearTimeout(t); window.clearInterval(iv); window.removeEventListener('pointermove', move); window.removeEventListener('scroll', scr); cancelAnimationFrame(raf); };
  }, []);
  let wi = 0;
  return (
    <div ref={ref} className={'ph' + (on ? ' on' : '')}>
      <div className="ph-top">{crumb}<span className="ph-eb">{eb}</span><span className="ph-hud" data-no-i18n=""><i />{code} · DXB {clock}</span></div>
      <h1 className="ph-h" aria-label={title + (accent ? ' ' + accent : '')}>
        {lines.map((l, i) => {
          const isAcc = (wi += l.split(' ').length) > nT, side = i % 2 ? 'r' : 'l', st = isAcc ? 'y' : STY[i % 2];
          const fs = 'min(' + (140 / Math.max(5, l.length)).toFixed(2) + 'vw, ' + (i === 0 ? 140 : 156) + 'px)';
          return (
            <React.Fragment key={i}>
              {i ? <span className={'ph-rule ' + side} aria-hidden="true" style={{ ['--i' as string]: i } as React.CSSProperties}><i /><small data-no-i18n="">{String(i).padStart(2, '0')} / {String(lines.length - 1).padStart(2, '0')}</small></span> : null}
              <span className={'ph-l ' + side + ' ' + st} aria-hidden="true" style={{ ['--i' as string]: i, fontSize: fs } as React.CSSProperties}><span>{l}</span></span>
            </React.Fragment>
          );
        })}
      </h1>
      <div className="ph-foot">{sub ? <p className="ph-sub">{sub}</p> : null}{children}</div>
    </div>
  );
}
