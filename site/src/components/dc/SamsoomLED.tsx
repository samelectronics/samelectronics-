// Samsoom, LED edition (Issue 14, 13 Oct 2026): built on the teardown's phone render (public/parts, front view),
// his face as glowing yellow pixel-LED eyes and mouth on the deep black OLED, with sleek metallic arms.
// Pure render: the mood comes from the parent; the eyes follow --lx / --ly set on an ancestor. Styles in meet.css.
'use client';
import React from 'react';

type Front = { ph: number[]; scr: number[] } | null;
const EYE = { l: 33, r: 67, y: 74 };

function Eyes({ mood }: { mood: string }) {
  if (mood === 'think')
    return (
      <g className="sl-dots">
        {[0, 1, 2].map((i) => (
          <rect key={i} x={23 + i * 22} y={66} width="14" height="14" rx="3" fill="url(#slLed)" style={{ animationDelay: i * 0.15 + 's' }} />
        ))}
      </g>
    );
  if (mood === 'found')
    return (
      <g className="sl-stroke">
        <path d="M22 74l7 7 13-14" />
        <path d="M56 74l7 7 13-14" />
      </g>
    );
  if (mood === 'happy' || mood === 'wave' || mood === 'dabke' || mood === 'kiss')
    return (
      <g className="sl-stroke">
        <path d="M24 78 Q33 64 42 78" />
        <path d="M58 78 Q67 64 76 78" />
      </g>
    );
  if (mood === 'wink')
    return (
      <g>
        <g className="sl-stroke">
          <path d="M24 76 Q33 70 42 76" />
        </g>
        <rect x={EYE.r - 8} y={EYE.y - 12} width="16" height="24" rx="6" className="sl-fill" fill="url(#slLed)" />
      </g>
    );
  return (
    <g className="sl-eyes">
      <rect x={EYE.l - 8} y={EYE.y - 12} width="16" height="24" rx="6" className="sl-fill" fill="url(#slLed)" />
      <rect x={EYE.r - 8} y={EYE.y - 12} width="16" height="24" rx="6" className="sl-fill" fill="url(#slLed)" />
    </g>
  );
}

function Mouth({ mood }: { mood: string }) {
  if (mood === 'think') return <path d="M42 112 H58" className="sl-line" />;
  if (mood === 'kiss') return <circle cx="50" cy="112" r="5" className="sl-line" />;
  if (mood === 'found' || mood === 'happy' || mood === 'wave' || mood === 'dabke' || mood === 'wink') return <path d="M34 106 Q50 122 66 106" className="sl-line" />;
  return <path d="M40 110 Q50 116 60 110" className="sl-line" />;
}

export default function SamsoomLED({ mood, img, front }: { mood: string; img: string; front: Front }) {
  const f = front || { ph: [0.2725, 0.04, 0.455, 0.92], scr: [0.043, 0.0215, 0.902, 0.957] };
  const scr = { left: (f.ph[0] + f.scr[0] * f.ph[2]) * 100 + '%', top: (f.ph[1] + f.scr[1] * f.ph[3]) * 100 + '%', width: f.scr[2] * f.ph[2] * 100 + '%', height: f.scr[3] * f.ph[3] * 100 + '%' };
  return (
    <div className={'sl sl-' + mood}>
      <span className="sl-shadow" aria-hidden="true" />
      <div className="sl-bob">
        <div className="sl-body">
          <svg className="sl-arm l" viewBox="0 0 90 120" aria-hidden="true">
            <path d="M84 20 C 60 26, 40 40, 30 66 L 22 92" className="tube" />
            <path d="M84 20 C 60 26, 40 40, 30 66 L 22 92" className="hl" />
            <circle cx="30" cy="66" r="5.5" className="joint" />
            <circle cx="22" cy="96" r="9" className="hand" />
          </svg>
          <svg className="sl-arm r" viewBox="0 0 90 120" aria-hidden="true">
            <g className="sl-rarm">
              <path d="M6 30 C 30 26, 50 14, 60 -8 L 66 -30" className="tube" />
              <path d="M6 30 C 30 26, 50 14, 60 -8 L 66 -30" className="hl" />
              <circle cx="60" cy="-8" r="5.5" className="joint" />
              <circle cx="67" cy="-34" r="9" className="hand" />
            </g>
          </svg>
          {img ? <img className="sl-phone" src={img} alt="" draggable={false} /> : <span className="sl-phone ph" />}
          <div className="sl-screen" style={scr}>
            <span className="sl-oled" />
            <svg className="sl-face" viewBox="0 0 100 200" aria-hidden="true">
              <defs>
                <pattern id="slLed" width="3.2" height="3.2" patternUnits="userSpaceOnUse">
                  <rect x=".3" y=".3" width="2.6" height="2.6" rx=".7" fill="#FFD24A" />
                </pattern>
              </defs>
              <g className="sl-look">
                <Eyes mood={mood} />
                <Mouth mood={mood} />
              </g>
            </svg>
            <span className="sl-glass" />
          </div>
          {mood === 'kiss' ? (
            <svg className="sl-heart" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 21s-7-4.4-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.6-9.5 9-9.5 9z" />
            </svg>
          ) : null}
        </div>
      </div>
    </div>
  );
}
