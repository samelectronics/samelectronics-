// GENERATED from design/project/Sam Electronics Home v3.dc.html by scripts/dc-codegen.mjs. Do not edit by hand: change the generator
// (or detach this file from the generator's COMPONENTS list before hand-editing it).
// Home v3 section "SamCircuit". Renders against the home page's values (`v`, from HomeV3's logic class).
'use client';
import React from 'react';
import { type Vals, cx } from '@/dc/runtime';

export default function SamCircuit({ v }: { v: Vals }) {
  return (
    <section
      id="circuit"
      data-tone="light"
      data-screen-label="14 Sam Circuit"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(80% 90% at 70% 40%,#FFE58F 0%,#F7C032 55%,#EDB321 100%)',
        color: '#1A1B1D',
        padding: 'clamp(80px,8vw,120px) clamp(20px,4vw,64px)',
      }}
    >
      {'\n  '}
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: '0', pointerEvents: 'none', opacity: '.5' }}>
        <defs>
          <pattern id="ciEng" width="180" height="180" patternUnits="userSpaceOnUse">
            <g fill="none" stroke="#C9921A" strokeWidth="1" strokeLinecap="round">
              <path d="M0 50 H60 L80 70 H140"></path>
              <path d="M140 70 V130 L160 150 H180"></path>
              <path d="M30 180 V140 L50 120 H90"></path>
            </g>
            <g fill="#F7C032" stroke="#C9921A">
              <circle cx="140" cy="70" r="2.5"></circle>
              <circle cx="90" cy="120" r="2.5"></circle>
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ciEng)"></rect>
      </svg>
      {'\n  '}
      <div
        style={{
          position: 'absolute',
          inset: '0',
          background: 'radial-gradient(50% 60% at 30% 50%,rgba(247,192,50,.9),rgba(247,192,50,0))',
          pointerEvents: 'none',
        }}
      ></div>
      {'\n  '}
      <div
        style={{
          position: 'relative',
          maxWidth: '1312px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'minmax(0,.8fr) minmax(0,1.2fr)',
          gap: 'clamp(32px,4vw,64px)',
          alignItems: 'center',
        }}
      >
        {'\n    '}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: '0' }}>
          {'\n      '}
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: '12px',
              letterSpacing: '.14em',
            }}
          >
            <span style={{ width: '28px', height: '2px', background: '#26282B' }}></span>SAM CIRCUIT · MEMBERSHIP
          </span>
          {'\n      '}
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
            Every order charges you up.
          </h2>
          {'\n      '}
          <p style={{ margin: '0', fontSize: '17px', lineHeight: '1.55', color: '#26282B', maxWidth: '440px' }}>
            Four levels, one battery. The more you buy from us, the higher your charge, and the better the perks. Log in to see your charge.
          </p>
          {'\n      '}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              padding: '16px 18px',
              borderRadius: '16px',
              background: 'rgba(255,255,255,.55)',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.7),0 10px 24px rgba(110,72,0,.12)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          >
            {'\n        '}
            <span
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '11px',
                letterSpacing: '.12em',
                color: '#3D3E3F',
              }}
            >
              <span>PREVIEW · LOGGED IN</span>
              <span>SAMPLE</span>
            </span>
            {'\n        '}
            <span style={{ fontSize: '15px', fontWeight: '600' }}>
              {'You: Charged · 62% '}
              <span style={{ fontWeight: '500', color: '#3D3E3F' }}>→ 38% to Supercharged</span>
            </span>
            {'\n        '}
            <span
              style={{ position: 'relative', height: '10px', borderRadius: '5px', background: 'rgba(38,40,43,.14)', overflow: 'hidden' }}
            >
              <span
                data-replay="1"
                style={{
                  position: 'absolute',
                  left: '0',
                  top: '0',
                  bottom: '0',
                  width: '62%',
                  borderRadius: '5px',
                  background: 'linear-gradient(90deg,#26282B,#4A4D52)',
                  transformOrigin: '0 50%',
                  animation: 'soProg 1.6s .4s cubic-bezier(.2,.8,.2,1) both',
                }}
              ></span>
            </span>
            {'\n      '}
          </div>
          {'\n      '}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {'\n        '}
            <button
              onClick={v.circ?.join}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                height: '44px',
                padding: '0 18px',
                borderRadius: '10px',
                border: 'none',
                background: '#26282B',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform .3s cubic-bezier(.2,.8,.2,1),box-shadow .3s',
              }}
              className={cx(undefined, 'scp-71188bbf')}
            >
              Create account
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#F7C032">
                <path d="M13 2 4 14h7l-1 8 9-12h-7z"></path>
              </svg>
            </button>
            {'\n        '}
            <button
              onClick={v.circ?.join}
              style={{
                display: 'flex',
                alignItems: 'center',
                height: '44px',
                padding: '0 18px',
                borderRadius: '10px',
                border: '1.5px solid #26282B',
                background: 'transparent',
                color: '#1A1B1D',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
              className={cx(undefined, 'scp-68db49c6')}
            >
              Log in
            </button>
            {'\n      '}
          </div>
          {'\n    '}
        </div>
        {'\n    '}
        <div data-replay="1" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {'\n      '}
          <div style={{ position: 'relative', paddingTop: '34px' }}>
            {'\n        '}
            <span
              style={{
                position: 'absolute',
                left: 'calc(14px + (100% - 50px) * .62)',
                top: '0',
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: '2',
              }}
            >
              <span
                style={{
                  padding: '4px 9px',
                  borderRadius: '7px',
                  background: '#26282B',
                  color: '#FFFFFF',
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: '11px',
                  fontWeight: '700',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 6px 14px rgba(38,40,43,.3)',
                }}
              >
                You · 62%
              </span>
              <span style={{ width: '2px', height: '14px', background: '#26282B' }}></span>
            </span>
            {'\n        '}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {'\n          '}
              <div
                style={{
                  position: 'relative',
                  flex: '1',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4,1fr)',
                  gap: '10px',
                  padding: '14px',
                  borderRadius: '26px',
                  background: 'linear-gradient(180deg,#5E6064 0%,#3D3E3F 18%,#26282B 82%,#3D3E3F 100%)',
                  boxShadow: 'inset 0 2px 0 rgba(255,255,255,.25),inset 0 -2px 0 rgba(0,0,0,.4),0 30px 60px rgba(110,72,0,.35)',
                }}
              >
                {'\n            '}
                <span
                  style={{
                    position: 'absolute',
                    left: '24px',
                    right: '24px',
                    top: '6px',
                    height: '6px',
                    borderRadius: '3px',
                    background: 'linear-gradient(180deg,rgba(255,255,255,.35),rgba(255,255,255,0))',
                  }}
                ></span>
                {'\n            '}
                <div
                  style={{
                    position: 'relative',
                    height: '220px',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    background: 'linear-gradient(180deg,#1F2022,#26282B)',
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.08),inset 0 6px 14px rgba(0,0,0,.5)',
                  }}
                >
                  {'\n              '}
                  <span
                    style={{
                      position: 'absolute',
                      left: '0',
                      right: '0',
                      bottom: '0',
                      height: '100%',
                      borderRadius: '10px',
                      background: 'linear-gradient(180deg,#FFF1B8 0%,#FFDB6E 12%,#F7C032 55%,#C9921A 100%)',
                      transformOrigin: '50% 100%',
                      transform: 'scaleY(0)',
                      animation: 'ciF0 10s infinite',
                    }}
                  ></span>
                  {'\n              \n              '}
                  <span
                    style={{
                      position: 'absolute',
                      left: '8px',
                      right: '8px',
                      bottom: '0',
                      height: '6px',
                      borderRadius: '3px',
                      background: '#FFF4D1',
                      boxShadow: '0 0 12px 4px rgba(255,219,110,.95)',
                      opacity: '0',
                      animation: 'ciSp0 10s infinite',
                    }}
                  ></span>
                  {'\n              '}
                  <span
                    style={{
                      position: 'absolute',
                      left: '0',
                      right: '0',
                      top: '0',
                      bottom: '0',
                      background:
                        'linear-gradient(90deg,rgba(255,255,255,.1),rgba(255,255,255,0) 30%,rgba(255,255,255,0) 70%,rgba(255,255,255,.06))',
                      pointerEvents: 'none',
                    }}
                  ></span>
                  {'\n              '}
                  <span
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: '12px',
                      fontWeight: '700',
                      animation: 'ciL0 10s infinite',
                    }}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M13 2 4 14h7l-1 8 9-12h-7z"></path>
                    </svg>
                    25%
                  </span>
                  {'\n            '}
                </div>
                <div
                  style={{
                    position: 'relative',
                    height: '220px',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    background: 'linear-gradient(180deg,#1F2022,#26282B)',
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.08),inset 0 6px 14px rgba(0,0,0,.5)',
                  }}
                >
                  {'\n              '}
                  <span
                    style={{
                      position: 'absolute',
                      left: '0',
                      right: '0',
                      bottom: '0',
                      height: '100%',
                      borderRadius: '10px',
                      background: 'linear-gradient(180deg,#FFF1B8 0%,#FFDB6E 12%,#F7C032 55%,#C9921A 100%)',
                      transformOrigin: '50% 100%',
                      transform: 'scaleY(0)',
                      animation: 'ciF1 10s infinite',
                    }}
                  ></span>
                  {'\n              \n              '}
                  <span
                    style={{
                      position: 'absolute',
                      left: '8px',
                      right: '8px',
                      bottom: '0',
                      height: '6px',
                      borderRadius: '3px',
                      background: '#FFF4D1',
                      boxShadow: '0 0 12px 4px rgba(255,219,110,.95)',
                      opacity: '0',
                      animation: 'ciSp1 10s infinite',
                    }}
                  ></span>
                  {'\n              '}
                  <span
                    style={{
                      position: 'absolute',
                      left: '0',
                      right: '0',
                      top: '0',
                      bottom: '0',
                      background:
                        'linear-gradient(90deg,rgba(255,255,255,.1),rgba(255,255,255,0) 30%,rgba(255,255,255,0) 70%,rgba(255,255,255,.06))',
                      pointerEvents: 'none',
                    }}
                  ></span>
                  {'\n              '}
                  <span
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: '12px',
                      fontWeight: '700',
                      animation: 'ciL1 10s infinite',
                    }}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M13 2 4 14h7l-1 8 9-12h-7z"></path>
                    </svg>
                    50%
                  </span>
                  {'\n            '}
                </div>
                <div
                  style={{
                    position: 'relative',
                    height: '220px',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    background: 'linear-gradient(180deg,#1F2022,#26282B)',
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.08),inset 0 6px 14px rgba(0,0,0,.5)',
                  }}
                >
                  {'\n              '}
                  <span
                    style={{
                      position: 'absolute',
                      left: '0',
                      right: '0',
                      bottom: '0',
                      height: '100%',
                      borderRadius: '10px',
                      background: 'linear-gradient(180deg,#FFF1B8 0%,#FFDB6E 12%,#F7C032 55%,#C9921A 100%)',
                      transformOrigin: '50% 100%',
                      transform: 'scaleY(0)',
                      animation: 'ciF2 10s infinite',
                    }}
                  ></span>
                  {'\n              \n              '}
                  <span
                    style={{
                      position: 'absolute',
                      left: '8px',
                      right: '8px',
                      bottom: '0',
                      height: '6px',
                      borderRadius: '3px',
                      background: '#FFF4D1',
                      boxShadow: '0 0 12px 4px rgba(255,219,110,.95)',
                      opacity: '0',
                      animation: 'ciSp2 10s infinite',
                    }}
                  ></span>
                  {'\n              '}
                  <span
                    style={{
                      position: 'absolute',
                      left: '0',
                      right: '0',
                      top: '0',
                      bottom: '0',
                      background:
                        'linear-gradient(90deg,rgba(255,255,255,.1),rgba(255,255,255,0) 30%,rgba(255,255,255,0) 70%,rgba(255,255,255,.06))',
                      pointerEvents: 'none',
                    }}
                  ></span>
                  {'\n              '}
                  <span
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: '12px',
                      fontWeight: '700',
                      animation: 'ciL2 10s infinite',
                    }}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M13 2 4 14h7l-1 8 9-12h-7z"></path>
                    </svg>
                    75%
                  </span>
                  {'\n            '}
                </div>
                <div
                  style={{
                    position: 'relative',
                    height: '220px',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    background: 'linear-gradient(180deg,#1F2022,#26282B)',
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.08),inset 0 6px 14px rgba(0,0,0,.5)',
                  }}
                >
                  {'\n              '}
                  <span
                    style={{
                      position: 'absolute',
                      left: '0',
                      right: '0',
                      bottom: '0',
                      height: '100%',
                      borderRadius: '10px',
                      background: 'linear-gradient(180deg,#FFF1B8 0%,#FFDB6E 12%,#F7C032 55%,#C9921A 100%)',
                      transformOrigin: '50% 100%',
                      transform: 'scaleY(0)',
                      animation: 'ciF3 10s infinite',
                    }}
                  ></span>
                  {'\n              '}
                  <span
                    style={{
                      position: 'absolute',
                      inset: '0',
                      borderRadius: '14px',
                      boxShadow: 'inset 0 0 30px rgba(255,244,209,.9)',
                      opacity: '0',
                      animation: 'ciFull 10s infinite',
                    }}
                  ></span>
                  {'\n              '}
                  <span
                    style={{
                      position: 'absolute',
                      left: '8px',
                      right: '8px',
                      bottom: '0',
                      height: '6px',
                      borderRadius: '3px',
                      background: '#FFF4D1',
                      boxShadow: '0 0 12px 4px rgba(255,219,110,.95)',
                      opacity: '0',
                      animation: 'ciSp3 10s infinite',
                    }}
                  ></span>
                  {'\n              '}
                  <span
                    style={{
                      position: 'absolute',
                      left: '0',
                      right: '0',
                      top: '0',
                      bottom: '0',
                      background:
                        'linear-gradient(90deg,rgba(255,255,255,.1),rgba(255,255,255,0) 30%,rgba(255,255,255,0) 70%,rgba(255,255,255,.06))',
                      pointerEvents: 'none',
                    }}
                  ></span>
                  {'\n              '}
                  <span
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: '12px',
                      fontWeight: '700',
                      animation: 'ciL3 10s infinite',
                    }}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M13 2 4 14h7l-1 8 9-12h-7z"></path>
                    </svg>
                    100%
                  </span>
                  {'\n            '}
                </div>
                {'\n            '}
                <span
                  style={{
                    position: 'absolute',
                    left: '12%',
                    top: '4px',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: '#FFDB6E',
                    boxShadow: '0 0 6px #F7C032',
                    opacity: '0',
                    animation: 'ciPart 3s 0s cubic-bezier(.2,.8,.2,1) infinite',
                  }}
                ></span>
                <span
                  style={{
                    position: 'absolute',
                    left: '25%',
                    top: '4px',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: '#FFDB6E',
                    boxShadow: '0 0 6px #F7C032',
                    opacity: '0',
                    animation: 'ciPart 4s 0.5s cubic-bezier(.2,.8,.2,1) infinite',
                  }}
                ></span>
                <span
                  style={{
                    position: 'absolute',
                    left: '38%',
                    top: '4px',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: '#FFDB6E',
                    boxShadow: '0 0 6px #F7C032',
                    opacity: '0',
                    animation: 'ciPart 5s 1s cubic-bezier(.2,.8,.2,1) infinite',
                  }}
                ></span>
                <span
                  style={{
                    position: 'absolute',
                    left: '51%',
                    top: '4px',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: '#FFDB6E',
                    boxShadow: '0 0 6px #F7C032',
                    opacity: '0',
                    animation: 'ciPart 3s 1.5s cubic-bezier(.2,.8,.2,1) infinite',
                  }}
                ></span>
                <span
                  style={{
                    position: 'absolute',
                    left: '64%',
                    top: '4px',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: '#FFDB6E',
                    boxShadow: '0 0 6px #F7C032',
                    opacity: '0',
                    animation: 'ciPart 4s 2s cubic-bezier(.2,.8,.2,1) infinite',
                  }}
                ></span>
                <span
                  style={{
                    position: 'absolute',
                    left: '77%',
                    top: '4px',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: '#FFDB6E',
                    boxShadow: '0 0 6px #F7C032',
                    opacity: '0',
                    animation: 'ciPart 5s 2.5s cubic-bezier(.2,.8,.2,1) infinite',
                  }}
                ></span>
                <span
                  style={{
                    position: 'absolute',
                    left: '90%',
                    top: '4px',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: '#FFDB6E',
                    boxShadow: '0 0 6px #F7C032',
                    opacity: '0',
                    animation: 'ciPart 3s 3s cubic-bezier(.2,.8,.2,1) infinite',
                  }}
                ></span>
                {'\n          '}
              </div>
              {'\n          '}
              <span
                style={{
                  position: 'relative',
                  width: '22px',
                  height: '90px',
                  borderRadius: '0 12px 12px 0',
                  background: 'linear-gradient(90deg,#5E6064,#26282B)',
                  boxShadow: 'inset 0 2px 0 rgba(255,255,255,.2)',
                  flex: 'none',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: '6px',
                    top: '50%',
                    width: '10px',
                    height: '10px',
                    marginTop: '-5px',
                    borderRadius: '50%',
                    background: '#FFDB6E',
                    boxShadow: '0 0 10px 3px rgba(247,192,50,.8)',
                    animation: 'ciTerm 2s cubic-bezier(.45,0,.55,1) infinite',
                  }}
                ></span>
              </span>
              {'\n        '}
            </div>
            {'\n      '}
          </div>
          {'\n      '}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', padding: '0 14px', marginRight: '22px' }}>
            {'\n        '}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span
                style={{
                  fontFamily: "'Space Grotesk',sans-serif",
                  fontWeight: '700',
                  fontSize: '16px',
                  letterSpacing: '-.02em',
                  animation: 'ciT0 10s infinite',
                }}
              >
                Connected
              </span>
              <span
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  height: 'auto',
                  padding: '6px 9px',
                  borderRadius: '9px',
                  fontSize: '11.5px',
                  fontWeight: '600',
                  whiteSpace: 'normal',
                  lineHeight: '1.25',
                  minHeight: '30px',
                  animation: 'ciU0 10s infinite',
                }}
              >
                <span style={{ position: 'relative', width: '12px', height: '12px', flex: 'none' }}>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    style={{ position: 'absolute', inset: '0', animation: 'ciLk0 10s infinite' }}
                  >
                    <rect x="4" y="11" width="16" height="10" rx="2"></rect>
                    <path d="M8 11V7a4 4 0 0 1 8 0v4"></path>
                  </svg>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    style={{ position: 'absolute', inset: '0', opacity: '0', animation: 'ciUl0 10s infinite' }}
                  >
                    <rect x="4" y="11" width="16" height="10" rx="2"></rect>
                    <path d="M8 11V7a4 4 0 0 1 7.5-2"></path>
                  </svg>
                </span>
                {'Saved parts & order history '}
                <span style={{ opacity: '.6' }}>· example</span>
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span
                style={{
                  fontFamily: "'Space Grotesk',sans-serif",
                  fontWeight: '700',
                  fontSize: '16px',
                  letterSpacing: '-.02em',
                  animation: 'ciT1 10s infinite',
                }}
              >
                Charged
              </span>
              <span
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  height: 'auto',
                  padding: '6px 9px',
                  borderRadius: '9px',
                  fontSize: '11.5px',
                  fontWeight: '600',
                  whiteSpace: 'normal',
                  lineHeight: '1.25',
                  minHeight: '30px',
                  animation: 'ciU1 10s infinite',
                }}
              >
                <span style={{ position: 'relative', width: '12px', height: '12px', flex: 'none' }}>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    style={{ position: 'absolute', inset: '0', animation: 'ciLk1 10s infinite' }}
                  >
                    <rect x="4" y="11" width="16" height="10" rx="2"></rect>
                    <path d="M8 11V7a4 4 0 0 1 8 0v4"></path>
                  </svg>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    style={{ position: 'absolute', inset: '0', opacity: '0', animation: 'ciUl1 10s infinite' }}
                  >
                    <rect x="4" y="11" width="16" height="10" rx="2"></rect>
                    <path d="M8 11V7a4 4 0 0 1 7.5-2"></path>
                  </svg>
                </span>
                {'Priority alerts on incoming stock '}
                <span style={{ opacity: '.6' }}>· example</span>
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span
                style={{
                  fontFamily: "'Space Grotesk',sans-serif",
                  fontWeight: '700',
                  fontSize: '16px',
                  letterSpacing: '-.02em',
                  animation: 'ciT2 10s infinite',
                }}
              >
                Supercharged
              </span>
              <span
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  height: 'auto',
                  padding: '6px 9px',
                  borderRadius: '9px',
                  fontSize: '11.5px',
                  fontWeight: '600',
                  whiteSpace: 'normal',
                  lineHeight: '1.25',
                  minHeight: '30px',
                  animation: 'ciU2 10s infinite',
                }}
              >
                <span style={{ position: 'relative', width: '12px', height: '12px', flex: 'none' }}>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    style={{ position: 'absolute', inset: '0', animation: 'ciLk2 10s infinite' }}
                  >
                    <rect x="4" y="11" width="16" height="10" rx="2"></rect>
                    <path d="M8 11V7a4 4 0 0 1 8 0v4"></path>
                  </svg>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    style={{ position: 'absolute', inset: '0', opacity: '0', animation: 'ciUl2 10s infinite' }}
                  >
                    <rect x="4" y="11" width="16" height="10" rx="2"></rect>
                    <path d="M8 11V7a4 4 0 0 1 7.5-2"></path>
                  </svg>
                </span>
                {'Trade price tiers '}
                <span style={{ opacity: '.6' }}>· example</span>
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span
                style={{
                  fontFamily: "'Space Grotesk',sans-serif",
                  fontWeight: '700',
                  fontSize: '16px',
                  letterSpacing: '-.02em',
                  animation: 'ciT3 10s infinite',
                }}
              >
                Fully Charged
              </span>
              <span
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  height: 'auto',
                  padding: '6px 9px',
                  borderRadius: '9px',
                  fontSize: '11.5px',
                  fontWeight: '600',
                  whiteSpace: 'normal',
                  lineHeight: '1.25',
                  minHeight: '30px',
                  animation: 'ciU3 10s infinite',
                }}
              >
                <span style={{ position: 'relative', width: '12px', height: '12px', flex: 'none' }}>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    style={{ position: 'absolute', inset: '0', animation: 'ciLk3 10s infinite' }}
                  >
                    <rect x="4" y="11" width="16" height="10" rx="2"></rect>
                    <path d="M8 11V7a4 4 0 0 1 8 0v4"></path>
                  </svg>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    style={{ position: 'absolute', inset: '0', opacity: '0', animation: 'ciUl3 10s infinite' }}
                  >
                    <rect x="4" y="11" width="16" height="10" rx="2"></rect>
                    <path d="M8 11V7a4 4 0 0 1 7.5-2"></path>
                  </svg>
                </span>
                {'A dedicated parts advisor '}
                <span style={{ opacity: '.6' }}>· example</span>
              </span>
            </div>
            {'\n      '}
          </div>
          {'\n      '}
          <span style={{ padding: '0 14px', fontSize: '13px', color: '#26282B' }}>
            <span style={{ filter: 'blur(3px)', userSelect: 'none' }}>More perks · more perks</span>
            {' More perks revealed at launch. Members get them first.'}
          </span>
          {'\n    '}
        </div>
        {'\n  '}
      </div>
    </section>
  );
}
