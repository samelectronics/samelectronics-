'use client';
// P5 · What the team sets in the Control Room, applied to the website: the announcement bar under the menu, and "edit any
// text" replacements (English). On Supabase the settings are fetched once per visit and cached for the synchronous readers
// (repair fees, delivery, banners, Samsoom); in the demo they are read straight from the browser's demo database.
import React, { useEffect, useState } from 'react';
import { backend, live } from '@/lib/backend';
import { siteRaw } from '@/lib/catalog';

const KEYS = ['repair-fees', 'delivery', 'shop-banners', 'announcement', 'samsoom', 'text-overrides', 'business'];
type Ann = { on: boolean; text: string; href: string; tone: string };

function applyTexts() {
  const list = siteRaw<[string, string][]>('text-overrides', []).filter(([a, b]) => a && b && a !== b);
  if (!list.length || (document.documentElement.lang && document.documentElement.lang !== 'en')) return;
  const map = new Map(list.map(([a, b]) => [a.trim(), b]));
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = w.nextNode(); n; n = w.nextNode()) { const t = n.nodeValue?.trim(); if (t && map.has(t)) n.nodeValue = n.nodeValue!.replace(t, map.get(t)!); }
}

export default function SiteSettings() {
  const [ann, setAnn] = useState<Ann | null>(null), [hide, setHide] = useState(false);
  useEffect(() => {
    const read = () => setAnn(siteRaw<Ann | null>('announcement', null));
    read();
    if (live) Promise.all(KEYS.map((k) => backend.setting(k, null).then((v) => { try { if (v != null) localStorage.setItem('se-set-' + k, JSON.stringify(v)); } catch { /* */ } }))).then(() => { read(); window.dispatchEvent(new CustomEvent('se:settings')); });
    try { setHide(sessionStorage.getItem('se-ann-x') === '1'); } catch { /* */ }
    let t = 0; const mo = new MutationObserver(() => { window.clearTimeout(t); t = window.setTimeout(applyTexts, 250); });
    mo.observe(document.body, { childList: true, subtree: true, characterData: true }); applyTexts();
    window.addEventListener('se:db', read);
    return () => { mo.disconnect(); window.removeEventListener('se:db', read); };
  }, []);
  if (!ann || !ann.on || hide || !ann.text) return null;
  return (
    <div className={'se-ann t-' + ann.tone} role="note">
      <a href={ann.href || '#'}>{ann.text} <b>→</b></a>
      <button type="button" aria-label="Close" onClick={() => { setHide(true); try { sessionStorage.setItem('se-ann-x', '1'); } catch { /* */ } }}>×</button>
    </div>
  );
}
