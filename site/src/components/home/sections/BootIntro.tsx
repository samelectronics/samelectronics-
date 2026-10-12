// GENERATED from design/project/Sam Electronics Home v3.dc.html by scripts/dc-codegen.mjs. Do not edit by hand: change the generator
// (or detach this file from the generator's COMPONENTS list before hand-editing it).
// Home v3 section "BootIntro". Renders against the home page's values (`v`, from HomeV3's logic class).
'use client';
import React from 'react';
import { type Vals } from '@/dc/runtime';

export default function BootIntro({ v }: { v: Vals }) {
  return (
    <>
      {v.bootOn ? (
        <>
          <div
            onClick={v.bootSkip}
            style={{
              position: 'fixed',
              inset: '0',
              zIndex: '200',
              display: 'grid',
              placeItems: 'center',
              background: '#1A1B1D',
              cursor: 'pointer',
              animation: 'bootOut 1.6s ease-in forwards',
            }}
          >
            <div style={{ position: 'relative', width: '120px', height: '120px', display: 'grid', placeItems: 'center' }}>
              <svg
                viewBox="0 0 110 110"
                width="120"
                height="120"
                style={{ position: 'absolute', inset: '0', transform: 'rotate(-90deg)' }}
                fill="none"
              >
                <circle cx="55" cy="55" r="48" stroke="rgba(255,255,255,.1)" strokeWidth="3"></circle>
                <circle
                  cx="55"
                  cy="55"
                  r="48"
                  stroke="#F7C032"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="302"
                  style={{ animation: 'bootRing 1.1s cubic-bezier(.4,0,.2,1) both', filter: 'drop-shadow(0 0 6px #F7C032)' }}
                ></circle>
              </svg>
              <span
                style={{ width: '84px', height: '84px', borderRadius: '50%', overflow: 'hidden', animation: 'bootLogo .6s ease-out both' }}
              >
                <img src="assets/se-logo.png" alt="Sam Electronics" style={{ width: '100%', height: '100%', display: 'block' }} />
              </span>
            </div>
            <span
              style={{
                position: 'absolute',
                bottom: '32px',
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '11px',
                letterSpacing: '.14em',
                color: '#8C9096',
              }}
            >
              CLICK TO SKIP
            </span>
          </div>
        </>
      ) : null}
    </>
  );
}
