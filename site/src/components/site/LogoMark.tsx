'use client';
// Owner (18 Nov): the brand mark is the finale medallion: the gunmetal bezel and a yellow LED line round the white face
// (owner: no outer ring, no dark line after the yellow), and the original logo artwork with its materials changed (phones and banners
// in brushed graphite metal, the yellow lettering and arc lit like LEDs). Shapes of the logo are never redrawn.
import React from 'react';

export default function LogoMark({ size = 44, animate = true, alt = 'Sam Electronics' }: { size?: number; animate?: boolean; alt?: string }) {
  // crystal clear on every screen: the browser picks the size that matches the display's pixel density
  const set = '/assets/se-logo-metal-128.webp 128w, /assets/se-logo-metal-320.webp 320w, /assets/se-logo-metal-512.webp 512w, /assets/se-logo-metal-1024.webp 1024w';
  return (
    <span className={'lm2' + (animate ? ' run' : '')} style={{ width: size, height: size, ['--s' as string]: size + 'px' } as React.CSSProperties} role="img" aria-label={alt}>
      <span className="lm2-edge" aria-hidden="true" />
      <span className="lm2-face" aria-hidden="true"><img src="/assets/se-logo-metal-320.webp" srcSet={set} sizes={Math.round(size * 0.82) + 'px'} alt="" decoding="async" /></span>
    </span>
  );
}
