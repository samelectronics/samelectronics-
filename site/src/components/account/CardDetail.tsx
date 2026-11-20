'use client';
// R11 (owner: "the card is still a bit meh, it could have more depth and details like a real one"). The details a real
// premium card carries, shared by every Sam card (home builder, membership page, My Bench): a holographic security patch
// that shifts as the card tilts, a line of micro-print along the edge, VALID THRU / MEMBER SINCE in small embossed type,
// a specular light that follows the pointer, and (in CSS) the card's own thickness and embossed name and number.
import React from 'react';

export default function CardDetail({ kind }: { kind: string }) {
  const y = new Date().getFullYear(), m = String(new Date().getMonth() + 1).padStart(2, '0');
  return (
    <>
      <span className="cr-holo" aria-hidden="true"><i /><b>SE</b></span>
      <span className="cr-micro" aria-hidden="true">{Array.from({ length: 6 }, () => 'SAM ELECTRONICS · AL MURAR · DEIRA · DUBAI · SINCE 2003 · ').join('')}</span>
      <span className="cr-meta" aria-hidden="true" data-no-i18n=""><span><small>MEMBER<br />SINCE</small><b>{String(y).slice(2)}</b></span><span><small>VALID<br />THRU</small><b>{m}/{String(y + 3).slice(2)}</b></span></span>
      <span className={'cr-spec k-' + kind} aria-hidden="true" />
    </>
  );
}
