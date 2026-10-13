// Converted from design/project/Sam Electronics Home v3.dc.html (12 Oct 2026); maintained by hand since.
// Home v3 section "Team". Renders against the home page's values (`v`, from HomeV3's logic class).
'use client';
import React from 'react';
import { type Vals, cx } from '@/dc/runtime';

/** Issue 4: fine film grain instead of grids, stripes and tiles. */
const GRAIN = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'160\' height=\'160\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'.9\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")';

export default function Team({ v }: { v: Vals }) {
  return (
    <section
      id="team"
      data-tone="dark"
      data-screen-label="12 Team"
      data-replay="1"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(180deg,#3D3E3F,#26282B)',
        color: '#FFFFFF',
        padding: '120px clamp(20px,4vw,64px)',
      }}
    >
      {'\n  '}
      <div
        style={{
          position: 'absolute',
          inset: '0',
          backgroundImage: GRAIN,
          opacity: '.035',
          pointerEvents: 'none',
        }}
      ></div>
      {'\n  '}
      <div
        style={{
          position: 'absolute',
          left: '-20%',
          top: '-30%',
          width: '22%',
          height: '160%',
          background: 'linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.06),rgba(255,255,255,0))',
          transform: 'rotate(20deg)',
          animation: 'rpSweep 12s cubic-bezier(.45,0,.55,1) infinite',
          pointerEvents: 'none',
        }}
      ></div>
      {'\n  '}
      <div style={{ position: 'relative', maxWidth: '1312px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {'\n    '}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px' }}>
          {'\n      '}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '640px' }}>
            {'\n        '}
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '12px',
                letterSpacing: '.14em',
                color: '#F7C032',
              }}
            >
              <span style={{ width: '28px', height: '2px', background: '#F7C032' }}></span>THE TEAM · ONE CIRCUIT
            </span>
            {'\n        '}
            <h2
              style={{
                margin: '0',
                fontFamily: "'Space Grotesk',sans-serif",
                fontWeight: '700',
                fontSize: 'clamp(34px,3.4vw,50px)',
                lineHeight: '1.04',
                letterSpacing: '-.035em',
                textWrap: 'balance',
              }}
            >
              Five roles. Every order passes through all of us.
            </h2>
            {'\n      '}
          </div>
          {'\n      '}
          <span style={{ fontSize: '14px', color: '#C9CBCE', maxWidth: '360px' }}>
            Hover a card to see what each role can help you with.
          </span>
          {'\n    '}
        </div>
        {'\n    '}
        <div style={{ position: 'relative' }}>
          {'\n      '}
          <div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: '18px', justifyContent: 'center' }}
          >
            <div style={{ perspective: '1200px', height: '400px', animation: 'tmRise .6s 0ms cubic-bezier(.2,.8,.2,1) both' }}>
              {'\n      '}
              <div
                style={{
                  position: 'relative',
                  height: '100%',
                  transformStyle: 'preserve-3d',
                  transition: 'transform .6s cubic-bezier(.2,.8,.2,1)',
                }}
                className={cx(undefined, 'scp-1d9b91a1')}
              >
                {'\n        '}
                <div
                  style={{
                    position: 'absolute',
                    inset: '0',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '18px 16px',
                    borderRadius: '20px',
                    background: 'linear-gradient(180deg,rgba(255,255,255,.07),rgba(255,255,255,.03))',
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.1),0 20px 40px rgba(0,0,0,.25)',
                    textAlign: 'center',
                    boxSizing: 'border-box',
                  }}
                >
                  {'\n          '}
                  <div style={{ position: 'relative', width: '100%', maxWidth: '220px', height: '200px', flex: 'none' }}>
                    {'\n            '}
                    <span
                      style={{
                        position: 'absolute',
                        inset: '-6px',
                        borderRadius: '24px',
                        boxShadow: '0 0 0 1px rgba(247,192,50,.25),0 0 24px rgba(247,192,50,.25)',
                        animation: 'tmGlow 3s 0s cubic-bezier(.45,0,.55,1) infinite',
                      }}
                    ></span>
                    {'\n            '}
                    <div
                      style={{
                        position: 'absolute',
                        inset: '0',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        background: 'radial-gradient(70% 60% at 50% 35%,#5E6064,#2E3033 80%)',
                        boxShadow: 'inset 0 0 0 1.5px #F7C032',
                      }}
                    >
                      {'\n              '}
                      <svg
                        viewBox="0 0 100 100"
                        preserveAspectRatio="xMidYMax meet"
                        style={{ position: 'absolute', left: '0', right: '0', bottom: '0', width: '100%', height: '86%' }}
                      >
                        <circle cx="50" cy="38" r="17" fill="#8C9096"></circle>
                        <path d="M14 100 C 14 72, 30 60, 50 60 C 70 60, 86 72, 86 100 Z" fill="#8C9096"></path>
                      </svg>
                      {'\n              \n              \n            '}
                    </div>
                    {'\n            '}
                    <span
                      style={{
                        position: 'absolute',
                        left: '-4px',
                        top: '-4px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#26282B',
                        boxShadow: '0 0 0 1.5px #F7C032,0 0 8px rgba(247,192,50,.8)',
                      }}
                    ></span>
                    <span
                      style={{
                        position: 'absolute',
                        left: 'calc(100% - 4px)',
                        top: '-4px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#26282B',
                        boxShadow: '0 0 0 1.5px #F7C032,0 0 8px rgba(247,192,50,.8)',
                      }}
                    ></span>
                    <span
                      style={{
                        position: 'absolute',
                        left: '-4px',
                        top: 'calc(100% - 4px)',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#26282B',
                        boxShadow: '0 0 0 1.5px #F7C032,0 0 8px rgba(247,192,50,.8)',
                      }}
                    ></span>
                    <span
                      style={{
                        position: 'absolute',
                        left: 'calc(100% - 4px)',
                        top: 'calc(100% - 4px)',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#26282B',
                        boxShadow: '0 0 0 1.5px #F7C032,0 0 8px rgba(247,192,50,.8)',
                      }}
                    ></span>
                    {'\n          '}
                  </div>
                  {'\n          '}
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.12em', color: '#F7C032' }}>
                    T01
                  </span>
                  {'\n          '}
                  <span
                    style={{
                      fontFamily: "'Space Grotesk',sans-serif",
                      fontWeight: '700',
                      fontSize: '17px',
                      lineHeight: '1.2',
                      minHeight: '42px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    Parts Flow Controller
                  </span>
                  {'\n          '}
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.1em', color: '#C9CBCE' }}>
                    SAM ELECTRONICS · DEIRA
                  </span>
                  {'\n          \n        '}
                </div>
                {'\n        '}
                <div
                  style={{
                    position: 'absolute',
                    inset: '0',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    padding: '22px 18px',
                    borderRadius: '20px',
                    background: 'linear-gradient(180deg,#4A4D52,#3D3E3F 40%,#26282B)',
                    boxShadow: 'inset 0 0 0 1.5px #F7C032,0 20px 40px rgba(0,0,0,.3)',
                    boxSizing: 'border-box',
                  }}
                >
                  {'\n          '}
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.12em', color: '#F7C032' }}>
                    T01 · PARTS FLOW CONTROLLER
                  </span>
                  {'\n          '}
                  <span style={{ fontSize: '14px', lineHeight: '1.5', color: '#E4E6E9' }}>
                    Receives, sorts and prepares every part before it reaches you.
                  </span>
                  {'\n          '}
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.12em', color: '#C9CBCE' }}>
                    WHAT I CAN HELP WITH
                  </span>
                  {'\n          '}
                  <span style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F7C032' }}></span>Stock checks
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F7C032' }}></span>Order status
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F7C032' }}></span>Packing & dispatch
                    </span>
                  </span>
                  {'\n          '}
                  <button
                    onClick={v.reviewSoon}
                    style={{
                      marginTop: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      height: '44px',
                      padding: '0 14px',
                      borderRadius: '10px',
                      border: 'none',
                      background: '#F7C032',
                      color: '#1A1B1D',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    Leave a review
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"></path>
                    </svg>
                  </button>
                  {'\n        '}
                </div>
                {'\n      '}
              </div>
              {'\n    '}
            </div>
            <div style={{ perspective: '1200px', height: '400px', animation: 'tmRise .6s 80ms cubic-bezier(.2,.8,.2,1) both' }}>
              {'\n      '}
              <div
                style={{
                  position: 'relative',
                  height: '100%',
                  transformStyle: 'preserve-3d',
                  transition: 'transform .6s cubic-bezier(.2,.8,.2,1)',
                }}
                className={cx(undefined, 'scp-1d9b91a1')}
              >
                {'\n        '}
                <div
                  style={{
                    position: 'absolute',
                    inset: '0',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '18px 16px',
                    borderRadius: '20px',
                    background: 'linear-gradient(180deg,rgba(255,255,255,.07),rgba(255,255,255,.03))',
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.1),0 20px 40px rgba(0,0,0,.25)',
                    textAlign: 'center',
                    boxSizing: 'border-box',
                  }}
                >
                  {'\n          '}
                  <div style={{ position: 'relative', width: '100%', maxWidth: '220px', height: '200px', flex: 'none' }}>
                    {'\n            '}
                    <span
                      style={{
                        position: 'absolute',
                        inset: '-6px',
                        borderRadius: '24px',
                        boxShadow: '0 0 0 1px rgba(247,192,50,.25),0 0 24px rgba(247,192,50,.25)',
                        animation: 'tmGlow 3s 0.4s cubic-bezier(.45,0,.55,1) infinite',
                      }}
                    ></span>
                    {'\n            '}
                    <div
                      style={{
                        position: 'absolute',
                        inset: '0',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        background: 'radial-gradient(70% 60% at 50% 35%,#5E6064,#2E3033 80%)',
                        boxShadow: 'inset 0 0 0 1.5px #F7C032',
                      }}
                    >
                      {'\n              '}
                      <svg
                        viewBox="0 0 100 100"
                        preserveAspectRatio="xMidYMax meet"
                        style={{ position: 'absolute', left: '0', right: '0', bottom: '0', width: '100%', height: '86%' }}
                      >
                        <circle cx="50" cy="38" r="17" fill="#8C9096"></circle>
                        <path d="M14 100 C 14 72, 30 60, 50 60 C 70 60, 86 72, 86 100 Z" fill="#8C9096"></path>
                      </svg>
                      {'\n              \n              \n            '}
                    </div>
                    {'\n            '}
                    <span
                      style={{
                        position: 'absolute',
                        left: '-4px',
                        top: '-4px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#26282B',
                        boxShadow: '0 0 0 1.5px #F7C032,0 0 8px rgba(247,192,50,.8)',
                      }}
                    ></span>
                    <span
                      style={{
                        position: 'absolute',
                        left: 'calc(100% - 4px)',
                        top: '-4px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#26282B',
                        boxShadow: '0 0 0 1.5px #F7C032,0 0 8px rgba(247,192,50,.8)',
                      }}
                    ></span>
                    <span
                      style={{
                        position: 'absolute',
                        left: '-4px',
                        top: 'calc(100% - 4px)',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#26282B',
                        boxShadow: '0 0 0 1.5px #F7C032,0 0 8px rgba(247,192,50,.8)',
                      }}
                    ></span>
                    <span
                      style={{
                        position: 'absolute',
                        left: 'calc(100% - 4px)',
                        top: 'calc(100% - 4px)',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#26282B',
                        boxShadow: '0 0 0 1.5px #F7C032,0 0 8px rgba(247,192,50,.8)',
                      }}
                    ></span>
                    {'\n          '}
                  </div>
                  {'\n          '}
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.12em', color: '#F7C032' }}>
                    T02
                  </span>
                  {'\n          '}
                  <span
                    style={{
                      fontFamily: "'Space Grotesk',sans-serif",
                      fontWeight: '700',
                      fontSize: '17px',
                      lineHeight: '1.2',
                      minHeight: '42px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    Bench Engineer
                  </span>
                  {'\n          '}
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.1em', color: '#C9CBCE' }}>
                    SAM ELECTRONICS · DEIRA
                  </span>
                  {'\n          \n        '}
                </div>
                {'\n        '}
                <div
                  style={{
                    position: 'absolute',
                    inset: '0',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    padding: '22px 18px',
                    borderRadius: '20px',
                    background: 'linear-gradient(180deg,#4A4D52,#3D3E3F 40%,#26282B)',
                    boxShadow: 'inset 0 0 0 1.5px #F7C032,0 20px 40px rgba(0,0,0,.3)',
                    boxSizing: 'border-box',
                  }}
                >
                  {'\n          '}
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.12em', color: '#F7C032' }}>
                    T02 · BENCH ENGINEER
                  </span>
                  {'\n          '}
                  <span style={{ fontSize: '14px', lineHeight: '1.5', color: '#E4E6E9' }}>
                    Repairs, tests and certifies every device on our bench.
                  </span>
                  {'\n          '}
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.12em', color: '#C9CBCE' }}>
                    WHAT I CAN HELP WITH
                  </span>
                  {'\n          '}
                  <span style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F7C032' }}></span>Repairs & diagnosis
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F7C032' }}></span>Board-level faults
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F7C032' }}></span>Bench test reports
                    </span>
                  </span>
                  {'\n          '}
                  <button
                    onClick={v.reviewSoon}
                    style={{
                      marginTop: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      height: '44px',
                      padding: '0 14px',
                      borderRadius: '10px',
                      border: 'none',
                      background: '#F7C032',
                      color: '#1A1B1D',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    Leave a review
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"></path>
                    </svg>
                  </button>
                  {'\n        '}
                </div>
                {'\n      '}
              </div>
              {'\n    '}
            </div>
            <div style={{ perspective: '1200px', height: '400px', animation: 'tmRise .6s 160ms cubic-bezier(.2,.8,.2,1) both' }}>
              {'\n      '}
              <div
                style={{
                  position: 'relative',
                  height: '100%',
                  transformStyle: 'preserve-3d',
                  transition: 'transform .6s cubic-bezier(.2,.8,.2,1)',
                }}
                className={cx(undefined, 'scp-1d9b91a1')}
              >
                {'\n        '}
                <div
                  style={{
                    position: 'absolute',
                    inset: '0',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '18px 16px',
                    borderRadius: '20px',
                    background: 'linear-gradient(180deg,rgba(255,255,255,.07),rgba(255,255,255,.03))',
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.1),0 20px 40px rgba(0,0,0,.25)',
                    textAlign: 'center',
                    boxSizing: 'border-box',
                  }}
                >
                  {'\n          '}
                  <div style={{ position: 'relative', width: '100%', maxWidth: '220px', height: '200px', flex: 'none' }}>
                    {'\n            '}
                    <span
                      style={{
                        position: 'absolute',
                        inset: '-6px',
                        borderRadius: '24px',
                        boxShadow: '0 0 0 1px rgba(247,192,50,.25),0 0 24px rgba(247,192,50,.25)',
                        animation: 'tmGlow 3s 0.8s cubic-bezier(.45,0,.55,1) infinite',
                      }}
                    ></span>
                    {'\n            '}
                    <div
                      style={{
                        position: 'absolute',
                        inset: '0',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        background: 'radial-gradient(70% 60% at 50% 35%,#5E6064,#2E3033 80%)',
                        boxShadow: 'inset 0 0 0 1.5px #F7C032',
                      }}
                    >
                      {'\n              '}
                      <svg
                        viewBox="0 0 100 100"
                        preserveAspectRatio="xMidYMax meet"
                        style={{ position: 'absolute', left: '0', right: '0', bottom: '0', width: '100%', height: '86%' }}
                      >
                        <circle cx="50" cy="38" r="17" fill="#8C9096"></circle>
                        <path d="M14 100 C 14 72, 30 60, 50 60 C 70 60, 86 72, 86 100 Z" fill="#8C9096"></path>
                      </svg>
                      {'\n              \n              \n            '}
                    </div>
                    {'\n            '}
                    <span
                      style={{
                        position: 'absolute',
                        left: '-4px',
                        top: '-4px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#26282B',
                        boxShadow: '0 0 0 1.5px #F7C032,0 0 8px rgba(247,192,50,.8)',
                      }}
                    ></span>
                    <span
                      style={{
                        position: 'absolute',
                        left: 'calc(100% - 4px)',
                        top: '-4px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#26282B',
                        boxShadow: '0 0 0 1.5px #F7C032,0 0 8px rgba(247,192,50,.8)',
                      }}
                    ></span>
                    <span
                      style={{
                        position: 'absolute',
                        left: '-4px',
                        top: 'calc(100% - 4px)',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#26282B',
                        boxShadow: '0 0 0 1.5px #F7C032,0 0 8px rgba(247,192,50,.8)',
                      }}
                    ></span>
                    <span
                      style={{
                        position: 'absolute',
                        left: 'calc(100% - 4px)',
                        top: 'calc(100% - 4px)',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#26282B',
                        boxShadow: '0 0 0 1.5px #F7C032,0 0 8px rgba(247,192,50,.8)',
                      }}
                    ></span>
                    {'\n          '}
                  </div>
                  {'\n          '}
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.12em', color: '#F7C032' }}>
                    T03
                  </span>
                  {'\n          '}
                  <span
                    style={{
                      fontFamily: "'Space Grotesk',sans-serif",
                      fontWeight: '700',
                      fontSize: '17px',
                      lineHeight: '1.2',
                      minHeight: '42px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    Finance & Checkout
                  </span>
                  {'\n          '}
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.1em', color: '#C9CBCE' }}>
                    SAM ELECTRONICS · DEIRA
                  </span>
                  {'\n          \n        '}
                </div>
                {'\n        '}
                <div
                  style={{
                    position: 'absolute',
                    inset: '0',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    padding: '22px 18px',
                    borderRadius: '20px',
                    background: 'linear-gradient(180deg,#4A4D52,#3D3E3F 40%,#26282B)',
                    boxShadow: 'inset 0 0 0 1.5px #F7C032,0 20px 40px rgba(0,0,0,.3)',
                    boxSizing: 'border-box',
                  }}
                >
                  {'\n          '}
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.12em', color: '#F7C032' }}>
                    T03 · FINANCE & CHECKOUT
                  </span>
                  {'\n          '}
                  <span style={{ fontSize: '14px', lineHeight: '1.5', color: '#E4E6E9' }}>Accounts, invoices and the cashier desk.</span>
                  {'\n          '}
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.12em', color: '#C9CBCE' }}>
                    WHAT I CAN HELP WITH
                  </span>
                  {'\n          '}
                  <span style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F7C032' }}></span>Invoices & receipts
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F7C032' }}></span>Trade account billing
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F7C032' }}></span>Payments
                    </span>
                  </span>
                  {'\n          '}
                  <button
                    onClick={v.reviewSoon}
                    style={{
                      marginTop: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      height: '44px',
                      padding: '0 14px',
                      borderRadius: '10px',
                      border: 'none',
                      background: '#F7C032',
                      color: '#1A1B1D',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    Leave a review
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"></path>
                    </svg>
                  </button>
                  {'\n        '}
                </div>
                {'\n      '}
              </div>
              {'\n    '}
            </div>
            <div style={{ perspective: '1200px', height: '400px', animation: 'tmRise .6s 240ms cubic-bezier(.2,.8,.2,1) both' }}>
              {'\n      '}
              <div
                style={{
                  position: 'relative',
                  height: '100%',
                  transformStyle: 'preserve-3d',
                  transition: 'transform .6s cubic-bezier(.2,.8,.2,1)',
                }}
                className={cx(undefined, 'scp-1d9b91a1')}
              >
                {'\n        '}
                <div
                  style={{
                    position: 'absolute',
                    inset: '0',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '18px 16px',
                    borderRadius: '20px',
                    background: 'linear-gradient(180deg,rgba(255,255,255,.07),rgba(255,255,255,.03))',
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.1),0 20px 40px rgba(0,0,0,.25)',
                    textAlign: 'center',
                    boxSizing: 'border-box',
                  }}
                >
                  {'\n          '}
                  <div style={{ position: 'relative', width: '100%', maxWidth: '220px', height: '200px', flex: 'none' }}>
                    {'\n            '}
                    <span
                      style={{
                        position: 'absolute',
                        inset: '-6px',
                        borderRadius: '24px',
                        boxShadow: '0 0 0 1px rgba(247,192,50,.25),0 0 24px rgba(247,192,50,.25)',
                        animation: 'tmGlow 3s 1.2000000000000002s cubic-bezier(.45,0,.55,1) infinite',
                      }}
                    ></span>
                    {'\n            '}
                    <div
                      style={{
                        position: 'absolute',
                        inset: '0',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        background: 'radial-gradient(70% 60% at 50% 35%,#5E6064,#2E3033 80%)',
                        boxShadow: 'inset 0 0 0 1.5px #F7C032',
                      }}
                    >
                      {'\n              '}
                      <svg
                        viewBox="0 0 100 100"
                        preserveAspectRatio="xMidYMax meet"
                        style={{ position: 'absolute', left: '0', right: '0', bottom: '0', width: '100%', height: '86%' }}
                      >
                        <circle cx="50" cy="38" r="17" fill="#8C9096"></circle>
                        <path d="M14 100 C 14 72, 30 60, 50 60 C 70 60, 86 72, 86 100 Z" fill="#8C9096"></path>
                      </svg>
                      {'\n              \n              \n            '}
                    </div>
                    {'\n            '}
                    <span
                      style={{
                        position: 'absolute',
                        left: '-4px',
                        top: '-4px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#26282B',
                        boxShadow: '0 0 0 1.5px #F7C032,0 0 8px rgba(247,192,50,.8)',
                      }}
                    ></span>
                    <span
                      style={{
                        position: 'absolute',
                        left: 'calc(100% - 4px)',
                        top: '-4px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#26282B',
                        boxShadow: '0 0 0 1.5px #F7C032,0 0 8px rgba(247,192,50,.8)',
                      }}
                    ></span>
                    <span
                      style={{
                        position: 'absolute',
                        left: '-4px',
                        top: 'calc(100% - 4px)',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#26282B',
                        boxShadow: '0 0 0 1.5px #F7C032,0 0 8px rgba(247,192,50,.8)',
                      }}
                    ></span>
                    <span
                      style={{
                        position: 'absolute',
                        left: 'calc(100% - 4px)',
                        top: 'calc(100% - 4px)',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#26282B',
                        boxShadow: '0 0 0 1.5px #F7C032,0 0 8px rgba(247,192,50,.8)',
                      }}
                    ></span>
                    {'\n          '}
                  </div>
                  {'\n          '}
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.12em', color: '#F7C032' }}>
                    T04
                  </span>
                  {'\n          '}
                  <span
                    style={{
                      fontFamily: "'Space Grotesk',sans-serif",
                      fontWeight: '700',
                      fontSize: '17px',
                      lineHeight: '1.2',
                      minHeight: '42px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    Parts Advisor
                  </span>
                  {'\n          '}
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.1em', color: '#C9CBCE' }}>
                    SAM ELECTRONICS · DEIRA
                  </span>
                  {'\n          \n        '}
                </div>
                {'\n        '}
                <div
                  style={{
                    position: 'absolute',
                    inset: '0',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    padding: '22px 18px',
                    borderRadius: '20px',
                    background: 'linear-gradient(180deg,#4A4D52,#3D3E3F 40%,#26282B)',
                    boxShadow: 'inset 0 0 0 1.5px #F7C032,0 20px 40px rgba(0,0,0,.3)',
                    boxSizing: 'border-box',
                  }}
                >
                  {'\n          '}
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.12em', color: '#F7C032' }}>
                    T04 · PARTS ADVISOR
                  </span>
                  {'\n          '}
                  <span style={{ fontSize: '14px', lineHeight: '1.5', color: '#E4E6E9' }}>
                    Helps you find the exact part and grade, in person.
                  </span>
                  {'\n          '}
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.12em', color: '#C9CBCE' }}>
                    WHAT I CAN HELP WITH
                  </span>
                  {'\n          '}
                  <span style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F7C032' }}></span>Finding your part
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F7C032' }}></span>Choosing a grade
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F7C032' }}></span>Warranty questions
                    </span>
                  </span>
                  {'\n          '}
                  <button
                    onClick={v.reviewSoon}
                    style={{
                      marginTop: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      height: '44px',
                      padding: '0 14px',
                      borderRadius: '10px',
                      border: 'none',
                      background: '#F7C032',
                      color: '#1A1B1D',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    Leave a review
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"></path>
                    </svg>
                  </button>
                  {'\n        '}
                </div>
                {'\n      '}
              </div>
              {'\n    '}
            </div>
            <div style={{ perspective: '1200px', height: '400px', animation: 'tmRise .6s 320ms cubic-bezier(.2,.8,.2,1) both' }}>
              {'\n      '}
              <div
                style={{
                  position: 'relative',
                  height: '100%',
                  transformStyle: 'preserve-3d',
                  transition: 'transform .6s cubic-bezier(.2,.8,.2,1)',
                }}
                className={cx(undefined, 'scp-1d9b91a1')}
              >
                {'\n        '}
                <div
                  style={{
                    position: 'absolute',
                    inset: '0',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '18px 16px',
                    borderRadius: '20px',
                    background: 'linear-gradient(180deg,rgba(247,192,50,.14),rgba(255,255,255,.04))',
                    boxShadow: 'inset 0 0 0 1.5px #F7C032,0 20px 40px rgba(0,0,0,.25)',
                    textAlign: 'center',
                    boxSizing: 'border-box',
                  }}
                >
                  {'\n          '}
                  <div style={{ position: 'relative', width: '100%', maxWidth: '220px', height: '200px', flex: 'none' }}>
                    {'\n            '}
                    <span
                      style={{
                        position: 'absolute',
                        inset: '-6px',
                        borderRadius: '24px',
                        boxShadow: '0 0 0 1px rgba(247,192,50,.25),0 0 24px rgba(247,192,50,.25)',
                        animation: 'tmGlow 3s 1.6s cubic-bezier(.45,0,.55,1) infinite',
                      }}
                    ></span>
                    {'\n            '}
                    <div
                      style={{
                        position: 'absolute',
                        inset: '0',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        background: 'radial-gradient(70% 60% at 50% 35%,#5E6064,#2E3033 80%)',
                        boxShadow: 'inset 0 0 0 1.5px #F7C032',
                      }}
                    >
                      {'\n              '}
                      <svg
                        viewBox="0 0 100 100"
                        preserveAspectRatio="xMidYMax meet"
                        style={{ position: 'absolute', left: '0', right: '0', bottom: '0', width: '100%', height: '86%' }}
                      >
                        <circle cx="50" cy="38" r="17" fill="#8C9096"></circle>
                        <path d="M14 100 C 14 72, 30 60, 50 60 C 70 60, 86 72, 86 100 Z" fill="#8C9096"></path>
                      </svg>
                      {'\n              \n              \n            '}
                    </div>
                    {'\n            '}
                    <span
                      style={{
                        position: 'absolute',
                        left: '-4px',
                        top: '-4px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#26282B',
                        boxShadow: '0 0 0 1.5px #F7C032,0 0 8px rgba(247,192,50,.8)',
                      }}
                    ></span>
                    <span
                      style={{
                        position: 'absolute',
                        left: 'calc(100% - 4px)',
                        top: '-4px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#26282B',
                        boxShadow: '0 0 0 1.5px #F7C032,0 0 8px rgba(247,192,50,.8)',
                      }}
                    ></span>
                    <span
                      style={{
                        position: 'absolute',
                        left: '-4px',
                        top: 'calc(100% - 4px)',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#26282B',
                        boxShadow: '0 0 0 1.5px #F7C032,0 0 8px rgba(247,192,50,.8)',
                      }}
                    ></span>
                    <span
                      style={{
                        position: 'absolute',
                        left: 'calc(100% - 4px)',
                        top: 'calc(100% - 4px)',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#26282B',
                        boxShadow: '0 0 0 1.5px #F7C032,0 0 8px rgba(247,192,50,.8)',
                      }}
                    ></span>
                    {'\n          '}
                  </div>
                  {'\n          '}
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.12em', color: '#F7C032' }}>
                    T05 · LEADING SINCE 2003
                  </span>
                  {'\n          '}
                  <span
                    style={{
                      fontFamily: "'Space Grotesk',sans-serif",
                      fontWeight: '700',
                      fontSize: '17px',
                      lineHeight: '1.2',
                      minHeight: '42px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    Founder & Managing Director
                  </span>
                  {'\n          '}
                  <span style={{ fontSize: '14px', color: '#FFFFFF' }}>{String(v.$facts?.founder?.name ?? '')}</span>
                  {'\n          '}
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: '#C9CBCE' }}>
                    {String(v.$facts?.founder?.years ?? '')}
                    {' years with us'}
                  </span>
                  {'\n          \n        '}
                </div>
                {'\n        '}
                <div
                  style={{
                    position: 'absolute',
                    inset: '0',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    padding: '22px 18px',
                    borderRadius: '20px',
                    background: 'linear-gradient(180deg,#4A4D52,#3D3E3F 40%,#26282B)',
                    boxShadow: 'inset 0 0 0 1.5px #F7C032,0 20px 40px rgba(0,0,0,.3)',
                    boxSizing: 'border-box',
                  }}
                >
                  {'\n          '}
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.12em', color: '#F7C032' }}>
                    T05 · FOUNDER & MANAGING DIRECTOR
                  </span>
                  {'\n          '}
                  <span style={{ fontSize: '14px', lineHeight: '1.5', color: '#E4E6E9' }}>
                    {String(v.$facts?.founder?.name ?? '')}, leading the business since 2003.
                  </span>
                  {'\n          '}
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', letterSpacing: '.12em', color: '#C9CBCE' }}>
                    WHAT I CAN HELP WITH
                  </span>
                  {'\n          '}
                  <span style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F7C032' }}></span>Partnerships
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F7C032' }}></span>Wholesale & export
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F7C032' }}></span>Anything big
                    </span>
                  </span>
                  {'\n          '}
                  <button
                    onClick={v.reviewSoon}
                    style={{
                      marginTop: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      height: '44px',
                      padding: '0 14px',
                      borderRadius: '10px',
                      border: 'none',
                      background: '#F7C032',
                      color: '#1A1B1D',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    Leave a review
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"></path>
                    </svg>
                  </button>
                  {'\n        '}
                </div>
                {'\n      '}
              </div>
              {'\n    '}
            </div>
          </div>
          {'\n      '}
          <svg
            viewBox="0 0 1000 40"
            preserveAspectRatio="none"
            style={{ position: 'relative', display: 'block', width: '100%', height: '40px', marginTop: '6px' }}
            fill="none"
          >
            <path
              d="M100 0 V20 H900 V0 M300 0 V20 M500 0 V20 M700 0 V20"
              stroke="rgba(247,192,50,.35)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            ></path>
            <path
              d="M100 20 H900"
              pathLength="1000"
              stroke="#FFDB6E"
              strokeWidth="3"
              strokeDasharray="80 920"
              vectorEffect="non-scaling-stroke"
              style={{ filter: 'drop-shadow(0 0 4px #F7C032)', animation: 'sePulse 3.4s cubic-bezier(.45,0,.55,1) infinite' }}
            ></path>
            <circle
              cx="100"
              cy="20"
              r="5"
              fill="#26282B"
              stroke="#F7C032"
              strokeWidth="2"
              style={{ animation: 'tmNode 3.4s 0s infinite' }}
            ></circle>
            <circle
              cx="300"
              cy="20"
              r="5"
              fill="#26282B"
              stroke="#F7C032"
              strokeWidth="2"
              style={{ animation: 'tmNode 3.4s 0.68s infinite' }}
            ></circle>
            <circle
              cx="500"
              cy="20"
              r="5"
              fill="#26282B"
              stroke="#F7C032"
              strokeWidth="2"
              style={{ animation: 'tmNode 3.4s 1.36s infinite' }}
            ></circle>
            <circle
              cx="700"
              cy="20"
              r="5"
              fill="#26282B"
              stroke="#F7C032"
              strokeWidth="2"
              style={{ animation: 'tmNode 3.4s 2.04s infinite' }}
            ></circle>
            <circle
              cx="900"
              cy="20"
              r="5"
              fill="#26282B"
              stroke="#F7C032"
              strokeWidth="2"
              style={{ animation: 'tmNode 3.4s 2.72s infinite' }}
            ></circle>
          </svg>
          {'\n    '}
        </div>
        {'\n  '}
      </div>
    </section>
  );
}
