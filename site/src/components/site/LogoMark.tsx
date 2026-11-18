'use client';
// Owner (18 Nov): "a new idea for the logo, more premium: I love the yellow LED ring in the shop ad that fills up until
// it's complete, with a space between it and the white logo, and the steel frame from the page before the footer". The
// mark: a polished steel bezel, a dark gap, a yellow LED ring that draws itself once (then breathes softly), a thin gap,
// and the white logo face. Used in the site bar, the footer and the shop bar; the browser tab icon is the same drawing.
import React from 'react';

export default function LogoMark({ size = 44, animate = true, alt = 'Sam Electronics' }: { size?: number; animate?: boolean; alt?: string }) {
  return (
    <span className={'lm' + (animate ? ' run' : '')} style={{ width: size, height: size, ['--s' as string]: size + 'px' } as React.CSSProperties} role="img" aria-label={alt}>
      <span className="lm-steel" aria-hidden="true" />
      <svg className="lm-led" viewBox="0 0 100 100" aria-hidden="true"><circle className="trk" cx="50" cy="50" r="41.5" /><circle className="on" cx="50" cy="50" r="41.5" pathLength={100} /></svg>
      <span className="lm-face" aria-hidden="true"><img src="/assets/se-logo-128.webp" alt="" /></span>
    </span>
  );
}
