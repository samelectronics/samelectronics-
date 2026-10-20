'use client';
// R6 §02 (reviewer's idea) · inside the hours pop-over: a live Dubai clock and a thin bar filling towards the next
// change ("Closes in 38m" / "Opens in 2h 14m"). One text node + one transform per second, no React re-render.
import { useEffect, useRef } from 'react';
import { dubai, shopStatus } from '@/lib/shopStatus';

export default function HoursLive() {
  const clock = useRef<HTMLSpanElement>(null), bar = useRef<HTMLElement>(null);
  useEffect(() => {
    const pad = (n: number) => String(n).padStart(2, '0');
    const tick = () => {
      const now = Date.now(), d = dubai(now), H = (window as unknown as { SE_DATA?: { hours?: unknown } }).SE_DATA?.hours;
      if (clock.current) clock.current.textContent = pad(Math.floor(d.m / 60)) + ':' + pad(d.m % 60) + ':' + pad(d.sec);
      if (H && bar.current) { const st = shopStatus(H, now); bar.current.style.transform = 'scaleX(' + Math.max(0.03, Math.min(1, 1 - st.mins / 240)).toFixed(3) + ')'; bar.current.style.background = st.dot; }
    };
    tick(); const iv = window.setInterval(tick, 1000);
    return () => window.clearInterval(iv);
  }, []);
  return (
    <span className="se-hl">
      <span className="se-hl-t">
        <span>Dubai time</span>
        <b ref={clock} className="se-ltr" data-no-i18n="" />
      </span>
      <span className="se-hl-bar" aria-hidden="true">
        <i ref={bar} />
      </span>
    </span>
  );
}
