'use client';
// R10 4.15 · visual website editor: any page in a live preview (desktop / tablet / phone, English or Arabic). Click any
// text to change it, switch whole sections off, save as a draft, preview it, publish, and go back to any earlier version.
// Texts are stored as English → new English replacements ('text-overrides'), so every language still translates them.
import React, { useEffect, useRef, useState } from 'react';
import { type Staff } from '@/lib/backend';
import { Panel, Badge, useSetting, when, can } from './kit';

type Pair = [string, string];
type Ver = { at: number; by: string; texts: Pair[]; hidden: string[]; note: string };
const PAGES = ['/', '/shop', '/repair', '/wholesale', '/worldwide', '/brands', '/membership', '/story', '/contact', '/faq', '/payments', '/cart', '/account', '/cookies'];
const DEV: [string, number][] = [['Desktop', 1366], ['Tablet', 820], ['Phone', 390]];

export default function VisualEditor({ me }: { me: Staff; go: (m: string) => void }) {
  const [pub, setPub] = useSetting<Pair[]>('text-overrides', []), [hidPub, setHidPub] = useSetting<string[]>('hidden-sections', []);
  const [draft, setDraft] = useSetting<{ texts: Pair[]; hidden: string[] } | null>('editor-draft', null), [vers, setVers] = useSetting<Ver[]>('editor-versions', []);
  const [page, setPage] = useState('/'), [dev, setDev] = useState(1366), [lang, setLang] = useState('en'), [edit, setEdit] = useState(true), [sel, setSel] = useState<{ en: string; now: string } | null>(null), [val, setVal] = useState(''), [secs, setSecs] = useState<string[]>([]), [k, setK] = useState(0);
  const frame = useRef<HTMLIFrameElement>(null), wrap = useRef<HTMLDivElement>(null), [scale, setScale] = useState(1);
  const D = draft || { texts: pub, hidden: hidPub }, dirty = !!draft;
  const setD = (d: { texts: Pair[]; hidden: string[] }) => setDraft(d, 'Editor draft');
  useEffect(() => { const ro = new ResizeObserver(() => { const w = wrap.current?.clientWidth || dev; setScale(Math.min(1, w / dev)); }); if (wrap.current) ro.observe(wrap.current); return () => ro.disconnect(); }, [dev]);
  // inside the preview: show the draft, outline what can be clicked, catch clicks on texts
  const wire = () => {
    const f = frame.current, doc = f?.contentDocument; if (!doc || !doc.body) return;
    const w = f!.contentWindow as Window & { seI18n?: { now: (l: string) => void } };
    try { if (w.seI18n && lang !== 'en') w.seI18n.now(lang); } catch { /* */ }
    const map = new Map(D.texts); const walk = () => { const tw = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT); for (let n = tw.nextNode(); n; n = tw.nextNode()) { const t = n.nodeValue?.trim(); if (t && map.has(t)) n.nodeValue = n.nodeValue!.replace(t, map.get(t)!); } };
    walk(); let st = doc.getElementById('ve-css'); if (!st) { st = doc.createElement('style'); st.id = 've-css'; doc.head.appendChild(st); }
    st.textContent = D.hidden.map((l) => `[data-screen-label="${l}"]{opacity:.18!important;outline:2px dashed #D14B4B}`).join('') + (edit ? '.ve-hov{outline:2px solid #F7C032!important;outline-offset:2px;cursor:text!important}' : '');
    setSecs([...new Set([...doc.querySelectorAll('[data-screen-label]')].map((e) => e.getAttribute('data-screen-label') || '').filter(Boolean))]);
    if ((doc as Document & { __ve?: boolean }).__ve) return; (doc as Document & { __ve?: boolean }).__ve = true;
    let last: Element | null = null;
    doc.addEventListener('mouseover', (e) => { if (!edit) return; const t = (e.target as Element).closest('h1,h2,h3,h4,p,span,b,small,a,button,li,label,em,strong,div'); if (last) last.classList.remove('ve-hov'); if (t && t.childNodes.length && [...t.childNodes].some((c) => c.nodeType === 3 && c.nodeValue?.trim())) { t.classList.add('ve-hov'); last = t; } }, true);
    doc.addEventListener('click', (e) => { if (!edit) return; const t = e.target as Element, node = [...t.childNodes].find((c) => c.nodeType === 3 && c.nodeValue?.trim()) as Text | undefined; if (!node) return; e.preventDefault(); e.stopPropagation();
      const now = node.nodeValue!.trim(), en = [...map.entries()].find(([, b]) => b === now)?.[0] || node.parentElement?.getAttribute('data-en') || now; setSel({ en, now }); setVal(now); }, true);
    new MutationObserver(() => walk()).observe(doc.body, { childList: true, subtree: true });
  };
  useEffect(() => { wire(); }); // eslint-disable-line react-hooks/exhaustive-deps
  const saveText = () => { if (!sel) return; const t = D.texts.filter(([a]) => a !== sel.en); if (val.trim() && val.trim() !== sel.en) t.push([sel.en, val.trim()]); setD({ ...D, texts: t }); setSel(null); setK(k + 1); };
  const toggleSec = (l: string) => { setD({ ...D, hidden: D.hidden.includes(l) ? D.hidden.filter((x) => x !== l) : [...D.hidden, l] }); setK(k + 1); };
  const publish = async () => { if (!draft) return; const note = prompt('What changed? (for the history)') || ''; await setVers([{ at: Date.now(), by: me.name, texts: pub, hidden: hidPub, note: 'Before: ' + note }, ...vers].slice(0, 30), 'Version saved'); await setPub(draft.texts, 'Published texts'); await setHidPub(draft.hidden, 'Published sections'); await setDraft(null, 'Draft published'); setK(k + 1); };
  const restore = async (v: Ver) => { if (!confirm('Go back to the version of ' + new Date(v.at).toLocaleString() + '?')) return; await setVers([{ at: Date.now(), by: me.name, texts: pub, hidden: hidPub, note: 'Before restore' }, ...vers].slice(0, 30)); await setPub(v.texts, 'Restored texts'); await setHidPub(v.hidden, 'Restored sections'); await setDraft(null); setK(k + 1); };
  const owner = can(me, 'content');
  return (
    <div className="cr-grid">
      <Panel t="Visual editor" d={edit ? 'Click any text in the page to change it. Changes stay in your draft until you publish.' : 'Preview mode: click through the page normally.'} className="span3"
        right={<span className="cr-row" style={{ margin: 0 }}>{dirty ? <Badge t="DRAFT" tone="y" /> : <Badge t="PUBLISHED" tone="g" />}<button type="button" className="cr-btn ghost sm" disabled={!dirty} onClick={() => { setDraft(null, 'Draft discarded'); setK(k + 1); }}>Discard draft</button><button type="button" className="cr-btn sm" disabled={!dirty || !owner} onClick={publish}>Publish</button></span>}>
        <div className="cr-row" style={{ marginTop: 0 }}>
          <select className="cr-in" style={{ maxWidth: 170 }} value={page} onChange={(e) => setPage(e.target.value)}>{PAGES.map((p) => <option key={p}>{p}</option>)}</select>
          <span className="cr-seg">{DEV.map(([n, w]) => <button key={n} type="button" className={dev === w ? 'on' : ''} onClick={() => setDev(w)}>{n}</button>)}</span>
          <span className="cr-seg"><button type="button" className={lang === 'en' ? 'on' : ''} onClick={() => { setLang('en'); setK(k + 1); }}>English</button><button type="button" className={lang === 'ar' ? 'on' : ''} onClick={() => { setLang('ar'); setK(k + 1); }}>العربية</button></span>
          <span className="cr-seg"><button type="button" className={edit ? 'on' : ''} onClick={() => setEdit(true)}>Edit</button><button type="button" className={!edit ? 'on' : ''} onClick={() => setEdit(false)}>Preview</button></span>
        </div>
        <div className="ve-wrap" ref={wrap}><div className="ve-stage" style={{ width: dev, height: Math.round(760 / scale), transform: `scale(${scale})` }}><iframe key={page + k + lang} ref={frame} src={page + (page.includes('?') ? '&' : '?') + 've=1'} title="Preview" onLoad={() => setTimeout(wire, 400)} /></div></div>
      </Panel>
      <Panel t={sel ? 'Change this text' : 'Sections on this page'} d={sel ? 'Original: ' + sel.en : 'Switch a whole section off (it shows faded here, hidden on the site after publishing).'} className="span2">
        {sel ? <div className="cr-form"><textarea className="cr-in" rows={3} value={val} onChange={(e) => setVal(e.target.value)} autoFocus /><div className="cr-acts"><button type="button" className="cr-btn" onClick={saveText}>Save to draft</button><button type="button" className="cr-btn ghost" onClick={() => { setVal(sel.en); }}>Back to original</button><button type="button" className="cr-btn ghost" onClick={() => setSel(null)}>Cancel</button></div><small className="cr-muted">The change is saved in English; every language translates it. For a new translation, use Site & Samsoom → translations.</small></div>
          : <div className="ve-secs">{secs.length ? secs.map((l) => <label key={l} className="cr-chk"><input type="checkbox" checked={!D.hidden.includes(l)} onChange={() => toggleSec(l)} /> {l}</label>) : <small className="cr-muted">This page has no switchable sections.</small>}</div>}
        {D.texts.length ? <details className="cr-det" open={!sel}><summary>{D.texts.length} text changes {dirty ? 'in the draft' : 'live'}</summary><div>{D.texts.map(([a, b]) => <span key={a}><small>{a}</small> → {b} <button type="button" className="cr-link" onClick={() => setD({ ...D, texts: D.texts.filter(([x]) => x !== a) })}>remove</button></span>)}</div></details> : null}
      </Panel>
      <Panel t="History" d="Every publish keeps the version before it.">
        <div className="cr-feed">{vers.map((v, i) => <div key={i} className="cr-fi" style={{ gridTemplateColumns: 'minmax(0,1fr) auto' }}><span><b>{v.by}</b> <small>{v.note}</small><br /><small className="mono">{when(v.at)} · {v.texts.length} texts · {v.hidden.length} hidden</small></span>{owner ? <button type="button" className="cr-btn ghost sm" onClick={() => restore(v)}>Restore</button> : null}</div>)}{!vers.length ? <small className="cr-muted">Nothing published from the editor yet.</small> : null}</div>
      </Panel>
    </div>
  );
}
