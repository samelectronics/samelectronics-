'use client';
/**
 * G17: links to pages that don't exist yet open this small branded "Coming soon" card (graphite glass,
 * our fonts, an X to close) instead of a 404 or a blank page.
 *
 *   comingSoon({ text: 'The full iPhone 13 page is coming soon. Use Find My Part in the meantime.',
 *                cta: 'Open Find My Part', act: () => … })
 */
import { useEffect, useState } from 'react';

export type Soon = { title?: string; text?: string; cta?: string; act?: () => void };

export function comingSoon(d: Soon = {}) {
  window.dispatchEvent(new CustomEvent('se:soon', { detail: d }));
}

export default function ComingSoon() {
  const [d, setD] = useState<Soon | null>(null);
  useEffect(() => {
    const on = (e: Event) => setD((e as CustomEvent<Soon>).detail || {});
    const key = (e: KeyboardEvent) => e.key === 'Escape' && setD(null);
    window.addEventListener('se:soon', on);
    window.addEventListener('keydown', key);
    (window as unknown as { seSoon: typeof comingSoon }).seSoon = comingSoon;
    return () => {
      window.removeEventListener('se:soon', on);
      window.removeEventListener('keydown', key);
    };
  }, []);
  if (!d) return null;
  const close = () => setD(null);
  return (
    <div className="se-soon-scrim" onClick={close} role="presentation">
      <div className="se-soon" role="dialog" aria-modal="true" aria-labelledby="se-soon-t" onClick={(e) => e.stopPropagation()}>
        <button className="se-soon-x" onClick={close} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
        <span className="se-soon-k">
          <span className="se-soon-dot" />
          COMING SOON
        </span>
        <h3 id="se-soon-t">{d.title || 'This page is on its way.'}</h3>
        <p>{d.text || 'This part of the site is still being built. Everything you need is on the home page in the meantime.'}</p>
        <div className="se-soon-row">
          {d.cta ? (
            <button
              className="se-soon-cta"
              onClick={() => {
                close();
                d.act?.();
              }}
            >
              {d.cta}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          ) : null}
          <button className="se-soon-ghost" onClick={close}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
