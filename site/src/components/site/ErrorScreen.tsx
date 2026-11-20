'use client';
// Owner (19 Nov): "prepare the website for an error: a designed page with a message saying what the issue is or why it
// crashed, and options to report it by contact". Used by app/error.tsx (inside the site frame) and app/global-error.tsx.
// It says the reason in plain words, keeps the technical detail one tap away, stores the warning (Control Room inbox +
// this device's /notices) and lets the visitor report it through any contact way, with the details already written.
import React, { useEffect, useMemo, useState } from 'react';
import LiveSam from '@/components/samsoom/LiveSam';

const T = (s: string) => { const w = typeof window !== 'undefined' ? (window as unknown as { seI18n?: { t: (x: string) => string } }) : null; return w?.seI18n ? w.seI18n.t(s) : s; };

export function explain(error: unknown): { why: string; tech: string; reload: boolean } {
  const e = error instanceof Error ? error : null, msg = e ? e.message : String(error ?? ''), name = e?.name || '', dg = (e as { digest?: string } | null)?.digest;
  const tech = (name ? name + ': ' : '') + (msg || 'Unknown error') + (dg ? ' (ref ' + dg + ')' : '');
  if (/ChunkLoad|Loading chunk|Failed to fetch dynamically imported|Importing a module script failed/i.test(name + msg)) return { why: 'We published a newer version of the site while this page was open. Reloading brings it in.', tech, reload: true };
  if (typeof navigator !== 'undefined' && !navigator.onLine) return { why: 'Your device is offline, so this page could not load its parts.', tech, reload: true };
  if (/Failed to fetch|NetworkError|Load failed|network/i.test(msg)) return { why: 'The connection dropped while this page was loading.', tech, reload: true };
  if (dg) return { why: 'Our server could not finish this page.', tech, reload: true };
  if (/quota|localStorage|storage/i.test(msg)) return { why: 'Your browser’s storage for this site is full or blocked.', tech, reload: false };
  return { why: 'A part of this page stopped working.', tech, reload: false };
}

export default function ErrorScreen({ error, retry, bare }: { error: unknown; retry?: () => void; bare?: boolean }) {
  const { why, tech, reload } = useMemo(() => explain(error), [error]);
  const [ref] = useState(() => 'ER-' + Date.now().toString(36).toUpperCase().slice(-6));
  const [open, setOpen] = useState(false);
  useEffect(() => { import('@/lib/warnings').then((m) => m.logWarning('crash', ref + ' · ' + tech)).catch(() => {}); }, [ref, tech]);
  const report = '*' + T('Problem report') + '*\n*' + T('Reference') + ':* ' + ref + '\n*' + T('Page') + ':* ' + (typeof location !== 'undefined' ? location.href : '') + '\n*' + T('What happened') + ':* ' + T(why) + '\n*' + T('Technical detail') + ':* ' + tech;
  const contact = () => window.dispatchEvent(new CustomEvent('se:chatwith', { detail: { text: report, subject: 'Problem report ' + ref } }));
  const mail = 'mailto:samelectronics.uae@gmail.com?subject=' + encodeURIComponent('Problem report ' + ref) + '&body=' + encodeURIComponent(report.replace(/\*/g, ''));
  return (
    <div className="ers" role="alert">
      <div className={'ers-card' + (bare ? '' : ' sam')}>
        {/* owner (19 Nov, round 2): Samsoom on top, the same card as every other pop-up */}
        {bare ? <span className="ers-ic" aria-hidden="true"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 2.5 20h19z" /><path d="M12 10v4.5M12 17.5v.01" /></svg></span>
          : <span className="sn2-sam ers-sam" aria-hidden="true"><LiveSam fit size={92} pose="sad" /><i className="sn2-badge"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 3 2.5 20h19z" /><path d="M12 10v4.5M12 17.5v.01" /></svg></i></span>}
        <span className="ers-k">{T('SOMETHING WENT WRONG')} · <span dir="ltr">{ref}</span></span>
        <h1 className="ers-h">{T('This page hit a problem.')}</h1>
        <p className="ers-why"><b>{T('What happened')}:</b> {T(why)}</p>
        <p className="ers-p">{T('Nothing you did caused this. Our team has been told automatically. You can try again, or tell us what you were doing so we fix it faster.')}</p>
        <div className="ers-acts">
          <button type="button" className="ers-b y" onClick={() => (reload || !retry ? location.reload() : retry())}>{T(reload ? 'Reload the page' : 'Try again')}</button>
          {bare ? <a className="ers-b" href={mail}>{T('Report it by e-mail')}</a> : <button type="button" className="ers-b" onClick={contact}>{T('Report it to us')}</button>}
          <a className="ers-b ghost" href="/">{T('Back to the home page')}</a>
        </div>
        <button type="button" className="ers-more" onClick={() => setOpen((v) => !v)} aria-expanded={open}>{T(open ? 'Hide the technical detail' : 'Show the technical detail')}</button>
        {open ? <pre className="ers-tech" dir="ltr">{tech}</pre> : null}
      </div>
    </div>
  );
}
