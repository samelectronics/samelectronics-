// Worldwide · the four boxes (Issue 9, 13 Oct 2026): same four boxes and the same continuous motion, recoloured to the
// palette (yellow for what moves, white and soft grey for lines and text, graphite surfaces), larger, centred and lit.
// Styles in src/styles/worldwide.css.
'use client';
import React from 'react';

function Box({ k, t, d, children }: { k: string; t: string; d: string; children: React.ReactNode }) {
  return (
    <div className="nwb">
      <div className="nwb-art">
        <span className="nwb-key" aria-hidden="true" />
        {children}
        <span className="nwb-shadow" aria-hidden="true" />
      </div>
      <span className="nwb-k">{k}</span>
      <span className="nwb-t">{t}</span>
      <span className="nwb-d">{d}</span>
    </div>
  );
}

export default function WorldwideBoxes() {
  return (
    <div className="nwb-g">
      <Box k="TRACKED" t="Every box, every step" d="Tracking number sent with your order.">
        <div className="nwb-trk" aria-hidden="true">
          <svg viewBox="0 0 180 80" width="180" height="80" fill="none">
            <path d="M18 66 C 52 8, 120 6, 160 52" stroke="rgba(255,255,255,.22)" strokeWidth="2" strokeDasharray="3 5" />
            <circle cx="18" cy="66" r="4.5" fill="#FFFFFF" />
            <circle cx="160" cy="52" r="9" fill="rgba(247,192,50,.18)" className="nwb-ping" />
            <circle cx="160" cy="52" r="5" fill="#F7C032" />
          </svg>
          <span className="nwb-dot" />
          <span className="nwb-type">SE-4544 · In transit</span>
        </div>
      </Box>
      <Box k="PACKED" t="Securely, by hand" d="Screens boxed flat, batteries packed to air-freight rules.">
        <div className="nwb-pk" aria-hidden="true">
          <span className="body" />
          <span className="fl l" />
          <span className="fl r" />
          <span className="tape" />
          <span className="lbl">
            <i />
          </span>
        </div>
      </Box>
      <Box k="QUOTED" t="Before it ships" d="Shipping cost confirmed with your order total.">
        <div className="nwb-q" aria-hidden="true">
          <div className="nwb-q-win">
            <div className="nwb-q-roll">
              <span>AED 120</span>
              <span>AED 185</span>
              <span>AED 150</span>
            </div>
          </div>
          <svg viewBox="0 0 40 40" width="40" height="40" fill="none">
            <circle cx="20" cy="20" r="17" stroke="rgba(255,255,255,.14)" strokeWidth="2.5" />
            <circle cx="20" cy="20" r="17" stroke="#F7C032" strokeWidth="2.5" pathLength="100" className="nwb-ring" transform="rotate(-90 20 20)" />
            <path d="M12.5 20.5l5 5L28 15" stroke="#F7C032" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" pathLength="20" className="nwb-chk" />
          </svg>
        </div>
      </Box>
      <Box k="REGIONS" t="Four, and growing" d="Middle East · Africa · Europe · Asia.">
        <div className="nwb-rg" aria-hidden="true">
          <span className="globe">
            <span className="dots" />
            <span className="land y" />
            <span className="land w" />
            <span className="lit" />
          </span>
          <span className="regs">
            <span style={{ animationName: 'nwReg0' }}>ME</span>
            <span style={{ animationName: 'nwReg1' }}>AFR</span>
            <span style={{ animationName: 'nwReg2' }}>EU</span>
            <span style={{ animationName: 'nwReg3' }}>ASIA</span>
          </span>
        </div>
      </Box>
    </div>
  );
}
