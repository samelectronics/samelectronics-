// Find My Part (Issue 18, redesigned 13 Oct 2026): the quick finder, premium like the hero. Styles in src/styles/fmp.css.
// Renders against HomeV3's finder values (v.fmp): brand → model → part → grade, with an LED-circuit step indicator.
'use client';
import React from 'react';
import { useScrollLock, stopWheel } from '@/lib/scrollLock';
import { type Vals } from '@/dc/runtime';
import SEBrandLogo from '../../dc/SEBrandLogo';
import SEPart from '../../dc/SEPart';
import InfoTip from '../InfoTip';

/** A clean lit silhouette of the model's front: island, notch or punch-hole, all in identical frames. */
export function ModelShape({ name, small }: { name: string; small?: boolean }) {
  const n = (name || '').toLowerCase();
  const kind = /iphone 1[4-9] pro|iphone 1[5-9]/.test(n) ? 'island' : /iphone (x|1[1-4])/.test(n) ? 'notch' : /iphone/.test(n) ? 'bezel' : 'hole';
  return (
    <svg className={'fm-shape' + (small ? ' sm' : '')} viewBox="0 0 60 120" aria-hidden="true">
      <defs>
        <linearGradient id="fmBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6B6E73" />
          <stop offset=".5" stopColor="#3D3E3F" />
          <stop offset="1" stopColor="#5E6064" />
        </linearGradient>
        <linearGradient id="fmScr" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2A2C2F" />
          <stop offset=".55" stopColor="#111214" />
          <stop offset="1" stopColor="#1C1D20" />
        </linearGradient>
      </defs>
      <rect x="4" y="2" width="52" height="116" rx={kind === 'bezel' ? 8 : 10} fill="url(#fmBody)" />
      <rect x="6.5" y={kind === 'bezel' ? 14 : 4.5} width="47" height={kind === 'bezel' ? 92 : 111} rx={kind === 'bezel' ? 2 : 8} fill="url(#fmScr)" />
      {kind === 'island' ? <rect x="23" y="8" width="14" height="4.5" rx="2.25" fill="#050506" /> : null}
      {kind === 'notch' ? <path d="M20 4.5 h20 v3.5 a3 3 0 0 1 -3 3 h-14 a3 3 0 0 1 -3 -3z" fill="#050506" /> : null}
      {kind === 'hole' ? <circle cx="30" cy="9.5" r="2.2" fill="#050506" /> : null}
      {kind === 'bezel' ? <circle cx="30" cy="111" r="4" fill="none" stroke="#8C9096" strokeWidth="1" /> : null}
      <path d="M9 8 L30 8 L12 60 L9 60 Z" fill="rgba(255,255,255,.07)" />
    </svg>
  );
}

/** The chosen tile flies into the step indicator (300ms) while the next step slides in. */
function flyTo(e: React.MouseEvent, step: number, then: () => void) {
  try {
    const el = e.currentTarget as HTMLElement, led = document.querySelector('[data-led="' + step + '"]') as HTMLElement | null;
    if (el && led) {
      const a = el.getBoundingClientRect(), b = led.getBoundingClientRect(), c = el.cloneNode(true) as HTMLElement;
      c.style.cssText = 'position:fixed;left:' + a.left + 'px;top:' + a.top + 'px;width:' + a.width + 'px;height:' + a.height + 'px;margin:0;z-index:200;pointer-events:none';
      document.body.appendChild(c);
      const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
      c.animate([{ transform: 'none', opacity: 1 }, { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.12)', opacity: 0.2 }], { duration: 300, easing: 'cubic-bezier(.5,0,.2,1)' }).onfinish = () => c.remove();
    }
  } catch {}
  then();
}

export default function FindMyPartPanel({ v }: { v: Vals }) {
  const f = v.fmp || {};
  useScrollLock(!!f.open); // R6 Part D: the page stays still behind the open panel
  if (!f.open) return null;
  const step = f.s1 ? 1 : f.s2 ? 2 : f.s3 ? 3 : 4;
  const B = f.brands || [];
  return (
    <div className="fm" {...stopWheel} role="dialog" aria-modal="true" aria-label="Find My Part">
      <div className="fm-scrim" onClick={f.close} />
      <div className="fm-panel">
        <header className="fm-head">
          <div className="fm-title">
            <span className="fm-eb">FIND MY PART</span>
            <b>Brand, model, part, grade. In seconds.</b>
          </div>
          {/* the step indicator: a circuit with LEDs */}
          <ol className="fm-steps">
            {(f.path || []).map((p: any, i: number) => {
              const done = !p.off, cur = i === step - 1;
              return (
                <li key={i} className={(done ? 'done' : '') + (cur ? ' cur' : '')}>
                  <button type="button" onClick={done ? p.go : undefined} disabled={!done} aria-current={cur ? 'step' : undefined}>
                    <i className="led" data-led={i} />
                    <span>{p.label}</span>
                  </button>
                  {i < 3 ? (
                    <span className={'wire' + (done ? ' on' : '') + (p.flow ? ' flow' : '')}>
                      <i />
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ol>
          <button type="button" className="fm-x" onClick={f.close} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        <div className="fm-body" key={step}>
          {step === 1 ? (
            <div className="fm-brands">
              {/* R6 Part E: the owner's 15 brands, clustered by group (standalone brands have no label) */}
              {B.reduce((acc: any[][], b: any) => { const last = acc[acc.length - 1]; if (last && last[0].grp === b.grp) last.push(b); else acc.push([b]); return acc; }, []).map((grp: any[], gi: number) => (
                <div key={gi} className="fm-bgroup">
                  {grp[0].grp && grp[0].grp !== 'Standalone' ? <span className="fm-pop">{grp[0].grp}</span> : null}
                  <div className="fm-grid7">
                    {grp.map((b: any, i: number) => (
                      <button key={b.id} type="button" className={'fm-tile brand' + (b.pop ? ' pop' : '')} style={{ animationDelay: Math.min(gi * 2 + i, 14) * 25 + 'ms' }} onClick={(e) => flyTo(e, 0, b.pick)}>
                        <span className="lg">
                          <SEBrandLogo brand={b.id} color="#FFFFFF" h="18" />
                        </span>
                        <span className="meta">
                          <span>{b.models}</span>
                          <span>{b.parts}</span>
                        </span>
                        <span className="sig" aria-hidden="true">
                          {(b.bars || []).map((x: any, k: number) => (
                            <i key={k} style={{ height: x.h, background: x.c }} />
                          ))}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {step === 2 ? (
            <div className="fm-models">
              <div className="fm-tools">
                <label className="fm-search">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M20 20l-3.5-3.5" />
                  </svg>
                  <input value={f.q} onChange={f.setQ} placeholder="Search by name or model number" autoFocus />
                </label>
                <div className="fm-series">
                  {(f.series || []).map((s: any) => (
                    <button key={s.name} type="button" className={s.bg === '#F7C032' ? 'on' : ''} onClick={s.pick}>
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
              {(f.quick || []).length ? (
                <div className="fm-quick">
                  {f.quick.map((x: any) => (
                    <button key={x.t} type="button" onClick={x.pick}>
                      {x.t}
                    </button>
                  ))}
                </div>
              ) : null}
              {f.none ? <p className="fm-none">No model matches. Try another name, for example A54 or Note 13.</p> : null}
              <div className="fm-grid6">
                {(f.models || []).map((m: any, i: number) => (
                  <button key={m.slot} type="button" className="fm-tile model" style={{ animationDelay: Math.min(i, 14) * 25 + 'ms' }} onClick={(e) => flyTo(e, 1, m.pick)}>
                    <span className="fr">
                      <span className="fr-light" aria-hidden="true" />
                      <ModelShape name={m.name} />
                      <image-slot data-quiet="1" id={m.slot} placeholder="" shape="rounded" radius="12" fit="contain" />
                    </span>
                    <b data-no-i18n="">{m.name}</b>
                    <small>
                      {m.num ? <><span data-no-i18n="">{m.num}</span> · </> : null}<span>{m.parts}</span>
                    </small>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {step === 3 && f.fits ? (
            /* R6 Part E: the owner's "fit each other" lists */
            <p className="fm-fits">
              <b>Also fits</b> <span data-no-i18n="">{f.fits}</span>
            </p>
          ) : null}
          {step === 3 && (f.ask || []).length ? (
            /* a model without offers yet: every family, asked on WhatsApp (stock and prices come from the Control Room) */
            <div className="fm-grid4">
              {(f.ask || []).map((c: any, i: number) => (
                <a key={c.name} className="fm-tile part" href={c.wa} target="_blank" rel="noopener noreferrer" style={{ animationDelay: c.d }}>
                  <span className="fr part">
                    <span className="fr-light" aria-hidden="true" />
                    <SEPart kind={c.kind} size={112} />
                  </span>
                  <b>{c.name}</b>
                  <span className="tag">Ask us on WhatsApp</span>
                </a>
              ))}
            </div>
          ) : null}
          {step === 3 ? (
            <div className="fm-grid4">
              {(f.cats || []).map((c: any, i: number) => (
                <div key={c.name} role="button" tabIndex={0} className={'fm-tile part' + (c.out ? ' out' : '')} style={{ animationDelay: Math.min(i, 14) * 25 + 'ms' }} onClick={(e) => flyTo(e, 2, c.pick)}>
                  <span className="fr part">
                    <span className="fr-light" aria-hidden="true" />
                    <SEPart kind={c.kind} size={112} />
                  </span>
                  <b>{c.name}</b>
                  <small>{c.n}</small>
                  <span className={'tag' + (c.has ? ' ok' : '')}>{c.tag}</span>
                  {c.out ? (
                    <button type="button" className="fm-notify" onClick={c.notify}>
                      Notify me
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}

          {step === 4 ? (
            <div className="fm-grades">
              {(f.grades || []).map((g: any, i: number) => (
                <div key={g.name} className={'fm-grade' + (g.out ? ' out' : '') + (i === 0 ? ' top' : '')} style={{ animationDelay: Math.min(i, 14) * 25 + 'ms' }}>
                  <span className="fr part sm">
                    <span className="fr-light" aria-hidden="true" />
                    <SEPart kind={g.kind} size={92} />
                  </span>
                  {/* R6 Part E + C7: quality and manufacturer, each with its "i" */}
                  <span className="g">
                    {g.name} <InfoTip name={g.name} kind="quality" />
                    {g.maker ? (
                      <small className="mk">
                        {g.maker} <InfoTip name={g.maker} kind="maker" />
                      </small>
                    ) : null}
                  </span>
                  <b className="pr" data-no-i18n="">
                    {g.price}
                  </b>
                  <span className="fm-stk">
                    <span className="sig" aria-hidden="true">
                      {(g.bars || []).map((x: any, k: number) => (
                        <i key={k} style={{ height: x.h, background: x.c }} />
                      ))}
                    </span>
                    {g.stock}
                  </span>
                  <small>{g.warranty}</small>
                  <small className="best">{g.best}</small>
                  <button type="button" className="fm-add" onClick={g.add}>
                    {g.out ? 'Notify me' : 'Add to cart'}
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="fm-foot">
          <span className="fm-sum">
            <b>{f.summary}</b>
            <small>{f.foot}</small>
          </span>
          <span className="fm-count" aria-live="polite">
            <b key={f.countF} data-no-i18n="">
              {f.countF}
            </b>
            <small>results</small>
          </span>
          <button type="button" className="fm-shop" onClick={f.shop}>
            Open in Shop with these filters
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
