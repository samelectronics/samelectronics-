'use client';
// Owner (19 Nov): "a safe mode: if something lags or doesn't move and the customer keeps scrolling, he must not jump three
// sections down; control the scroll so when it moves he goes down slowly, not a huge push".
//  · burst clamp: wheel/trackpad input that piles up (e.g. while the page was busy, then arrives all at once) is capped at
//    about one screen per short window; anything beyond is dropped, so the page moves by a calm amount;
//  · calm window: right after a programmatic jump (e.g. Skip), leftover momentum is ignored (window.__seCalmUntil);
//  · never interferes inside menus, lists, dialogs or anything that scrolls on its own, or while a section owns the scroll.
import { useEffect } from 'react';

type W = Window & { __seCalmUntil?: number; __seOwnScroll?: boolean; __seRigHold?: boolean };

function innerScroller(t: EventTarget | null) {
  let el = t as HTMLElement | null, n = 0;
  while (el && el !== document.body && n++ < 12) {
    if (el.matches?.('[role="dialog"], [role="listbox"], textarea, select, .ss-drop, .nb-list, .shs, .sn2')) return true;
    const st = getComputedStyle(el);
    if ((st.overflowY === 'auto' || st.overflowY === 'scroll') && el.scrollHeight > el.clientHeight + 2) return true;
    el = el.parentElement;
  }
  return false;
}

export default function ScrollSafe() {
  useEffect(() => {
    const w = window as W;
    let winStart = 0, winSum = 0;
    const onWheel = (e: WheelEvent) => {
      const now = performance.now();
      if (!e.ctrlKey && (w.__seCalmUntil || 0) > now) { e.preventDefault(); return; } // leftover momentum after a jump: ignored
      if (e.ctrlKey || e.defaultPrevented || w.__seOwnScroll) return;
      if (innerScroller(e.target)) return;
      if (w.__seRigHold && e.deltaY > 0) { e.preventDefault(); return; } // the rig's test is still catching up: hold here
      const dy = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaMode === 2 ? e.deltaY * innerHeight : e.deltaY;
      if (now - winStart > 160) { winStart = now; winSum = 0; }
      winSum += Math.abs(dy);
      if (winSum > innerHeight * 1.1) e.preventDefault(); // a pile-up beyond ~one screen in 160ms is dropped
    };
    const onTouch = (e: TouchEvent) => { if ((w.__seCalmUntil || 0) > performance.now() && e.cancelable && !innerScroller(e.target)) e.preventDefault(); };
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchmove', onTouch, { passive: false });
    return () => { window.removeEventListener('wheel', onWheel); window.removeEventListener('touchmove', onTouch); };
  }, []);
  return null;
}
