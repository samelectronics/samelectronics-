// Converted from design/project/Sam Electronics Home v3.dc.html (12 Oct 2026); maintained by hand since.
// Home v3 section "Toast". Renders against the home page's values (`v`, from HomeV3's logic class).
'use client';
import React from 'react';
import { type Vals, t } from '@/dc/runtime';

export default function Toast({ v }: { v: Vals }) {
  return (
    <>
      {v.hasToast ? (
        <>
          <div
            style={{
              position: 'fixed',
              left: '50%',
              bottom: '28px',
              zIndex: '99',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              maxWidth: 'calc(100vw - 180px)',
              padding: '12px 16px',
              borderRadius: '12px',
              background: '#1A1B1D',
              color: '#FFFFFF',
              fontSize: '14px',
              boxShadow: '0 0 0 1px rgba(247,192,50,.5),0 20px 40px rgba(0,0,0,.35)',
              animation: 'seRise .25s both',
            }}
          >
            <span
              style={{
                display: 'grid',
                placeItems: 'center',
                width: '20px',
                height: '20px',
                flex: 'none',
                borderRadius: '50%',
                background: '#F7C032',
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#1A1B1D" strokeWidth="3.4">
                <path d="M5 12l5 5L20 7"></path>
              </svg>
            </span>
            {t(v.toast)}
          </div>
        </>
      ) : null}
    </>
  );
}
