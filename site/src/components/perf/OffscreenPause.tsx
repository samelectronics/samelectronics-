'use client';
import { useEffect } from 'react';

/**
 * G16: pause every CSS animation inside a section while it is more than one viewport away, and resume it
 * (from the same point) when it comes back. Sections are re-scanned as the page builds itself.
 * The hero is left running here: its reel shares a JS clock with its CSS timeline (Issue 1B rebuilds it).
 */
const SKIP = new Set(['top']);

export default function OffscreenPause() {
  useEffect(() => {
    const seen = new WeakSet<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) e.target.removeAttribute('data-se-off');
          else e.target.setAttribute('data-se-off', '');
        }
      },
      { rootMargin: '100% 0px 100% 0px' },
    );
    const scan = () => {
      document.querySelectorAll('#dc-root section, #dc-root footer').forEach((el) => {
        if (seen.has(el) || SKIP.has(el.id) || el.parentElement?.closest('section')) return;
        seen.add(el);
        io.observe(el);
      });
    };
    scan();
    const iv = window.setInterval(scan, 2000);
    return () => {
      window.clearInterval(iv);
      io.disconnect();
    };
  }, []);
  return null;
}
