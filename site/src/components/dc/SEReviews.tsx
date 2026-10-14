// What customers say (Issue 15 part B, 13 Oct 2026). Styles in src/styles/feed.css.
// The Google card and two rows of review cards scrolling in opposite directions. Real Google reviews connect at the
// build stage; until then every card and the rating are labelled as samples (never "No reviews yet").
'use client';
import React from 'react';
import { type Vals, createDC, DCLogic } from '@/dc/runtime';

export const REVIEWS: [string, string, string][] = [
  ['Found the exact screen for my customer’s phone in minutes. Tested before I left the counter.', 'A. K.', 'Repair shop · Deira'],
  ['Clear grades and fair prices. The OLED option saved my customer money.', 'M. S.', 'Repair shop · Sharjah'],
  ['Ordered 200 batteries for Lagos. Packed well, tracked, arrived as quoted.', 'O. A.', 'Trader · Lagos'],
  ['They told me honestly which grade I needed. No upselling.', 'R. H.', 'Retail customer'],
  ['Fast WhatsApp replies, even late. The parts were ready when I arrived.', 'S. M.', 'Retail customer'],
  ['Our bulk list was quoted the same day. Smooth export paperwork.', 'H. J.', 'Exporter · Baghdad'],
  ['Back glass fitted perfectly, and the warranty was explained clearly.', 'F. N.', 'Repair shop · Ajman'],
  ['Good stock of Samsung and Xiaomi parts that are hard to find elsewhere.', 'Y. B.', 'Trader · Muscat'],
];
const RATING = 4.9, COUNT = 128; // sample until the owner connects Google reviews

class Logic extends DCLogic {
  secRef = React.createRef<HTMLElement>();
  state = { seen: false };
  io?: IntersectionObserver;
  raf = 0;
  componentDidMount() {
    this.io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !this.state.seen) { this.setState({ seen: true }); this.count(); } }, { threshold: 0.3 });
    setTimeout(() => this.secRef.current && this.io && this.io.observe(this.secRef.current), 50);
  }
  componentWillUnmount() { this.io && this.io.disconnect(); cancelAnimationFrame(this.raf); }
  count() {
    const el = this.secRef.current && (this.secRef.current.querySelector('[data-count]') as HTMLElement | null); if (!el) return; const t0 = performance.now() + 900;
    const step = (now: number) => { const k = Math.max(0, Math.min(1, (now - t0) / 1300)), v = String(Math.round(COUNT * (1 - Math.pow(1 - k, 3)))); if (el.textContent !== v) el.textContent = v; if (k < 1) this.raf = requestAnimationFrame(step); };
    this.raf = requestAnimationFrame(step);
  }
  renderVals() {
    const go = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Sam Electronics Al Murar Deira Dubai');
    return { secRef: this.secRef, seen: this.state.seen, rating: RATING.toFixed(1), google: go,
      write: () => window.dispatchEvent(new CustomEvent('se:soon', { detail: { title: 'Write a review', text: 'Reviews open with customer accounts. Review us on Google in the meantime.' } })) };
  }
}

function Row({ items, dir }: { items: [string, string, string][]; dir: string }) {
  return (
    <div className={'rv-row ' + dir}>
      <div className="rv-track">
        {[0, 1].map((r) =>
          items.map(([q, n, w]) => (
            <figure key={r + n} className="rv-card" aria-hidden={r === 1 ? true : undefined}>
              <span className="rv-q" aria-hidden="true">
                “
              </span>
              <blockquote>{q}</blockquote>
              <figcaption>
                <span className="rv-stars" aria-label="5 stars">
                  ★★★★★
                </span>
                <b data-no-i18n="">{n}</b>
                <span>{w}</span>
                <em>Sample review</em>
              </figcaption>
            </figure>
          )),
        )}
      </div>
      <span className="rv-fade l" aria-hidden="true" />
      <span className="rv-fade r" aria-hidden="true" />
    </div>
  );
}

function render(v: Vals) {
  return (
    <section id="reviews" ref={v.secRef} data-tone="light" data-screen-label="What customers say" className={'rv' + (v.seen ? ' rv-seen' : '')}>
      <div className="rv-in">
        <div className="rv-head">
          <div>
            <span className="rv-eb">WHAT CUSTOMERS SAY</span>
            <h2 className="rv-h">Shops across four regions already trust us.</h2>
          </div>
          <div className="rv-g">
            <span className="rv-g-logo" aria-hidden="true">
              <svg viewBox="0 0 48 48" width="34" height="34">
                <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.6 13.3l7.9 6.1C12.4 13.7 17.7 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.1 24.6c0-1.6-.1-3.1-.4-4.6H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.7c4.3-4 6.9-9.9 6.9-17z" />
                <path fill="#FBBC05" d="M10.5 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.1C1 16.6 0 20.2 0 24s1 7.4 2.6 10.7l7.9-6.1z" />
                <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.8 2.3-8.5 2.3-6.3 0-11.6-4.2-13.5-10l-7.9 6.1C6.6 42.6 14.6 48 24 48z" />
              </svg>
            </span>
            <span className="rv-g-t">
              <span className="rv-g-n">
                <b>{v.rating}</b>
                <span className="rv-g-stars" aria-label="5 stars">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <i key={i} style={{ animationDelay: 0.5 + i * 0.16 + 's' }}>
                      ★
                    </i>
                  ))}
                </span>
              </span>
              <small>
                <b data-count="" data-no-i18n="">
                  0
                </b>{' '}
                <span>Google reviews · sample until connected</span>
              </small>
            </span>
            <span className="rv-g-acts">
              <a href={v.google} target="_blank" rel="noopener noreferrer" className="rv-btn dark">
                Review us on Google
              </a>
              <button type="button" className="rv-btn line" onClick={v.write}>
                Write a review
              </button>
            </span>
          </div>
        </div>
      </div>
      <Row items={REVIEWS.slice(0, 4)} dir="ltr" />
      <Row items={REVIEWS.slice(4)} dir="rtl" />
      <p className="rv-note">Sample reviews shown until our real Google reviews are connected.</p>
    </section>
  );
}

const SEReviews = createDC('SE Reviews', Logic as never, render);
export default SEReviews;
