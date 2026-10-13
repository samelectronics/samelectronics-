// Converted from design/project/SE Part.dc.html (12 Oct 2026); maintained by hand since.
'use client';
import React from 'react';
import { type Vals, createDC, cssToObj, s } from '@/dc/runtime';
import Logic from './SEPart.logic.js';

function render(v: Vals) {
  return (
    <>
      <div style={cssToObj(`position:relative;width:${s(v.px)}px;height:${s(v.px)}px;flex:none;pointer-events:none`)}>
        {v.useLib ? (
          <>
            <img
              data-se-lib={v.k}
              src={v.libSrc}
              alt=""
              style={cssToObj(
                `position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block;filter:${s(v.libShd)};transform:${s(v.libLift)};transition:transform .45s cubic-bezier(.2,.8,.2,1);animation:${s(v.floatAnim)}`,
              )}
            />
          </>
        ) : null}
        {v.useCss ? (
          <>
            <div
              style={cssToObj(`position:absolute;left:0;top:0;width:160px;height:160px;transform:scale(${s(v.sc)});transform-origin:0 0`)}
            >
              {'\n  '}
              <div
                style={cssToObj(
                  `position:absolute;left:28px;top:136px;width:104px;height:16px;border-radius:50%;background:radial-gradient(closest-side,${s(v.shadow)},rgba(0,0,0,0));transform:scaleX(${s(v.shScale)});transition:transform .45s cubic-bezier(.2,.8,.2,1)`,
                )}
              ></div>
              {'\n  '}
              <div style={cssToObj(`position:absolute;inset:0;animation:${s(v.floatAnim)}`)}>
                {'\n\n  '}
                {v.isScr ? (
                  <>
                    {'\n    '}
                    <div
                      style={{ position: 'absolute', left: '47px', top: '8px', width: '66px', height: '130px', transform: 'rotate(-7deg)' }}
                    >
                      {'\n      '}
                      <div
                        style={{
                          position: 'absolute',
                          left: '24px',
                          top: '124px',
                          width: '18px',
                          height: '14px',
                          borderRadius: '0 0 3px 3px',
                          background: 'linear-gradient(180deg,#2A2117,#7A5320 60%,#B9852F)',
                        }}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            left: '3px',
                            right: '3px',
                            bottom: '2px',
                            height: '4px',
                            borderRadius: '1px',
                            background: '#1A1B1D',
                            boxShadow: 'inset 0 1px 0 #C9A24A',
                          }}
                        ></span>
                      </div>
                      {'\n      '}
                      <div
                        style={{
                          position: 'absolute',
                          inset: '0',
                          borderRadius: '13px',
                          background: '#08090B',
                          boxShadow: '0 0 0 1px #1E2023,0 12px 16px -6px rgba(0,0,0,.5)',
                        }}
                      ></div>
                      {'\n      '}
                      <div
                        style={cssToObj(
                          `position:absolute;inset:0;border-radius:13px;overflow:hidden;transform:translate(${s(v.liftX)}px,${s(v.liftY)}px);transition:transform .45s cubic-bezier(.2,.8,.2,1);box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.1),inset 0 0 0 3px #050607`,
                        )}
                      >
                        {'\n        '}
                        <div
                          style={{
                            position: 'absolute',
                            inset: '3px',
                            borderRadius: '10px',
                            background: 'radial-gradient(130% 80% at 30% 12%,#2C313A 0%,#101217 46%,#040506 80%)',
                          }}
                        ></div>
                        {'\n        '}
                        <span
                          style={{
                            position: 'absolute',
                            left: '23px',
                            top: '7px',
                            width: '20px',
                            height: '6px',
                            borderRadius: '3px',
                            background: '#000000',
                            boxShadow: 'inset 0 0 0 1px #1A1C20',
                          }}
                        ></span>
                        {'\n        '}
                        <div
                          style={{
                            position: 'absolute',
                            inset: '0',
                            background:
                              'linear-gradient(118deg,rgba(255,255,255,.3) 0%,rgba(255,255,255,.06) 30%,rgba(255,255,255,0) 31%,rgba(255,255,255,0) 74%,rgba(255,255,255,.06) 100%)',
                          }}
                        ></div>
                        {'\n        '}
                        <span
                          style={{
                            position: 'absolute',
                            top: '-10%',
                            bottom: '-10%',
                            left: '0',
                            width: '34%',
                            background: 'linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.16),rgba(255,255,255,0))',
                            animation: 'sePartSheen 5s ease-in-out infinite',
                          }}
                        ></span>
                        {'\n      '}
                      </div>
                      {'\n    '}
                    </div>
                    {'\n  '}
                  </>
                ) : null}
                {'\n\n  '}
                {v.isBat ? (
                  <>
                    {'\n    '}
                    <div
                      style={{
                        position: 'absolute',
                        left: '50px',
                        top: '12px',
                        width: '60px',
                        height: '124px',
                        transform: 'rotate(-5deg)',
                      }}
                    >
                      {'\n      '}
                      <div
                        style={cssToObj(
                          `position:absolute;left:21px;top:${s(v.batFlexY)}px;width:18px;height:22px;transition:top .45s cubic-bezier(.2,.8,.2,1)`,
                        )}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            left: '5px',
                            top: '6px',
                            width: '8px',
                            height: '16px',
                            background: 'linear-gradient(90deg,#141516,#2F3134,#141516)',
                          }}
                        ></span>
                        <span
                          style={{
                            position: 'absolute',
                            left: '0',
                            top: '0',
                            width: '18px',
                            height: '8px',
                            borderRadius: '2px',
                            background: '#151618',
                            boxShadow: 'inset 0 0 0 1px #2A2C2F',
                          }}
                        >
                          <span
                            style={{
                              position: 'absolute',
                              left: '3px',
                              right: '3px',
                              top: '2px',
                              height: '3px',
                              background: 'repeating-linear-gradient(90deg,#D7B25A 0 1.5px,transparent 1.5px 3px)',
                            }}
                          ></span>
                        </span>
                      </div>
                      {'\n      '}
                      <div
                        style={{
                          position: 'absolute',
                          left: '0',
                          right: '0',
                          top: '16px',
                          bottom: '0',
                          borderRadius: '6px',
                          background: 'linear-gradient(90deg,#1F2124 0%,#3A3D41 18%,#2A2C30 50%,#3A3D41 82%,#1F2124 100%)',
                          boxShadow: 'inset 0 1px 0 rgba(255,255,255,.18),inset 0 -2px 0 rgba(0,0,0,.4),0 12px 16px -6px rgba(0,0,0,.45)',
                        }}
                      ></div>
                      {'\n      '}
                      <div
                        style={cssToObj(
                          `position:absolute;left:5px;right:5px;top:26px;bottom:8px;border-radius:3px;background:linear-gradient(180deg,#EEF0F2,#D3D6DA);box-shadow:inset 0 0 0 1px rgba(0,0,0,.08);transform:translate(${s(v.liftX)}px,${s(v.liftY)}px);transition:transform .45s cubic-bezier(.2,.8,.2,1);padding:7px 6px;box-sizing:border-box;display:flex;flex-direction:column;gap:3px`,
                        )}
                      >
                        {'\n        '}
                        <span
                          style={{
                            fontFamily: "'Inter',sans-serif",
                            fontWeight: '700',
                            fontSize: '7px',
                            color: '#26282B',
                            letterSpacing: '.02em',
                          }}
                        >
                          Li-ion Polymer
                        </span>
                        {'\n        '}
                        <span style={{ height: '2px', width: '80%', background: '#9DA1A6' }}></span>
                        <span style={{ height: '2px', width: '62%', background: '#9DA1A6' }}></span>
                        {'\n        '}
                        <span
                          style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '5.5px', color: '#3D3E3F', whiteSpace: 'nowrap' }}
                        >
                          3.87V 3274mAh
                        </span>
                        {'\n        '}
                        <span style={{ height: '2px', width: '70%', background: '#B5B9BE' }}></span>
                        <span style={{ height: '2px', width: '50%', background: '#B5B9BE' }}></span>
                        {'\n        '}
                        <span style={{ marginTop: 'auto', display: 'flex', gap: '3px', alignItems: 'center' }}>
                          <span
                            style={{
                              width: '12px',
                              height: '12px',
                              borderRadius: '2px',
                              background:
                                'repeating-linear-gradient(90deg,#3D3E3F 0 1px,transparent 1px 2px),repeating-linear-gradient(0deg,#3D3E3F 0 1px,transparent 1px 2px)',
                            }}
                          ></span>
                          <span
                            style={{
                              flex: '1',
                              height: '7px',
                              background: 'repeating-linear-gradient(90deg,#26282B 0 1px,transparent 1px 2.5px)',
                            }}
                          ></span>
                        </span>
                        {'\n      '}
                      </div>
                      {'\n    '}
                    </div>
                    {'\n  '}
                  </>
                ) : null}
                {'\n\n  '}
                {v.isFlx ? (
                  <>
                    {'\n    '}
                    <svg viewBox="0 0 160 160" width="160" height="160" style={{ position: 'absolute', inset: '0', overflow: 'visible' }}>
                      {'\n      '}
                      <defs>
                        {'\n        '}
                        <linearGradient id="seFxA" x1="0" x2="1">
                          <stop offset="0" stopColor="#7E4A10"></stop>
                          <stop offset=".22" stopColor="#C98428"></stop>
                          <stop offset=".5" stopColor="#E0A245"></stop>
                          <stop offset=".78" stopColor="#C07B22"></stop>
                          <stop offset="1" stopColor="#77440E"></stop>
                        </linearGradient>
                        {'\n        '}
                        <linearGradient id="seFxB" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0" stopColor="#D4952F"></stop>
                          <stop offset=".55" stopColor="#B9761E"></stop>
                          <stop offset="1" stopColor="#94590F"></stop>
                        </linearGradient>
                        {'\n        '}
                        <linearGradient id="seFxSt" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0" stopColor="#F5F6F7"></stop>
                          <stop offset=".45" stopColor="#B4B8BD"></stop>
                          <stop offset=".55" stopColor="#9599A0"></stop>
                          <stop offset="1" stopColor="#DDE0E3"></stop>
                        </linearGradient>
                        {'\n        '}
                        <linearGradient id="seFxSh" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0" stopColor="#E7E9EB"></stop>
                          <stop offset="1" stopColor="#A6AAB0"></stop>
                        </linearGradient>
                        {'\n        '}
                        <linearGradient id="seFxGl" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0" stopColor="rgba(255,255,255,0)"></stop>
                          <stop offset=".5" stopColor="rgba(255,240,200,.55)"></stop>
                          <stop offset="1" stopColor="rgba(255,255,255,0)"></stop>
                        </linearGradient>
                        {'\n      '}
                      </defs>
                      {'\n      '}
                      <g transform="rotate(-9 80 80)">
                        {'\n        '}
                        <path d="M72 22 h16 v66 l3 4 v10 h-22 v-10 l3 -4z" fill="url(#seFxA)"></path>
                        {'\n        '}
                        <path d="M75.2 26 V100" stroke="rgba(236,170,72,.55)" strokeWidth=".55"></path>
                        <path d="M76.8 26 V100" stroke="rgba(236,170,72,.55)" strokeWidth=".55"></path>
                        <path d="M78.4 26 V100" stroke="rgba(236,170,72,.55)" strokeWidth=".55"></path>
                        <path d="M80 26 V100" stroke="rgba(236,170,72,.55)" strokeWidth=".55"></path>
                        <path d="M81.60000000000001 26 V100" stroke="rgba(236,170,72,.55)" strokeWidth=".55"></path>
                        <path d="M83.2 26 V100" stroke="rgba(236,170,72,.55)" strokeWidth=".55"></path>
                        {'\n        '}
                        <rect x="72" y="58" width="16" height="2.2" fill="rgba(80,45,8,.45)"></rect>
                        <rect x="72" y="60.2" width="16" height="1" fill="rgba(255,230,170,.5)"></rect>
                        {'\n        '}
                        <rect x="79" y="51" width="8" height="10" rx=".8" fill="rgba(60,34,6,.25)"></rect>
                        <rect x="81" y="53" width="3" height="1.8" rx=".3" fill="#BF9A62"></rect>
                        <rect x="81" y="53" width=".6" height="1.8" fill="#D8D3C4"></rect>
                        <rect x="83.4" y="53" width=".6" height="1.8" fill="#D8D3C4"></rect>
                        <rect x="81" y="57" width="3" height="1.8" rx=".3" fill="#2A2A2C"></rect>
                        <rect x="81" y="57" width=".6" height="1.8" fill="#D8D3C4"></rect>
                        <rect x="83.4" y="57" width=".6" height="1.8" fill="#D8D3C4"></rect>
                        {'\n        '}
                        <rect x="66" y="10" width="28" height="14" rx="2" fill="url(#seFxSh)" stroke="#7D8187" strokeWidth=".5"></rect>
                        {'\n        '}
                        <rect x="68.5" y="13" width="23" height="8" rx="1.2" fill="#141516"></rect>
                        <rect x="70.6" y="15.3" width="1" height="3.4" fill="#E2C06A"></rect>
                        <rect x="72.5" y="15.3" width="1" height="3.4" fill="#E2C06A"></rect>
                        <rect x="74.39999999999999" y="15.3" width="1" height="3.4" fill="#E2C06A"></rect>
                        <rect x="76.3" y="15.3" width="1" height="3.4" fill="#E2C06A"></rect>
                        <rect x="78.19999999999999" y="15.3" width="1" height="3.4" fill="#E2C06A"></rect>
                        <rect x="80.1" y="15.3" width="1" height="3.4" fill="#E2C06A"></rect>
                        <rect x="82" y="15.3" width="1" height="3.4" fill="#E2C06A"></rect>
                        <rect x="83.89999999999999" y="15.3" width="1" height="3.4" fill="#E2C06A"></rect>
                        <rect x="85.8" y="15.3" width="1" height="3.4" fill="#E2C06A"></rect>
                        <rect x="87.69999999999999" y="15.3" width="1" height="3.4" fill="#E2C06A"></rect>
                        {'\n        '}
                        <rect x="68.5" y="13" width="23" height="1.2" fill="rgba(255,255,255,.18)"></rect>
                        {'\n        '}
                        <g
                          transform={`translate(${s(v.liftX)} ${s(v.liftY)})`}
                          style={{ transition: 'transform .45s cubic-bezier(.2,.8,.2,1)' }}
                        >
                          {'\n          '}
                          <path
                            d="M38 104 h84 a5 5 0 0 1 5 5 v20 a5 5 0 0 1 -5 5 h-84 a5 5 0 0 1 -5 -5 v-20 a5 5 0 0 1 5 -5z"
                            fill="url(#seFxB)"
                            stroke="#6E4410"
                            strokeWidth=".7"
                          ></path>
                          {'\n          '}
                          <path d="M40 106 h80" stroke="rgba(255,226,160,.55)" strokeWidth=".8"></path>
                          {'\n          '}
                          <rect x="44" y="107" width="72" height="24" rx="3" fill="rgba(60,34,6,.18)"></rect>
                          {'\n          '}
                          <rect x="66" y="111" width="30" height="14" rx="7" fill="url(#seFxSt)" stroke="#5E6268" strokeWidth=".7"></rect>
                          {'\n          '}
                          <rect x="69.5" y="114.6" width="23" height="6.8" rx="3.4" fill="#0E0F10"></rect>
                          {'\n          '}
                          <rect x="73" y="117.4" width="16" height="1.3" rx=".6" fill="#C9A55A"></rect>
                          {'\n          '}
                          <rect x="67" y="111.6" width="28" height="2.2" rx="1.1" fill="rgba(255,255,255,.55)"></rect>
                          {'\n          '}
                          <circle cx="44.5" cy="119" r="4.6" fill="url(#seFxSt)" stroke="#6E7176" strokeWidth=".6"></circle>
                          <circle cx="44.5" cy="119" r="2.1" fill="#1A1B1D"></circle>
                          <circle cx="43.7" cy="118.2" r=".6" fill="rgba(255,255,255,.5)"></circle>
                          {'\n          '}
                          <rect x="101" y="117" width="18" height="8" rx="4" fill="#2A2C2F" stroke="#7D8187" strokeWidth=".5"></rect>
                          <circle cx="103" cy="121" r=".9" fill="#1A1B1D"></circle>
                          <circle cx="106.2" cy="121" r=".9" fill="#1A1B1D"></circle>
                          <circle cx="109.4" cy="121" r=".9" fill="#1A1B1D"></circle>
                          <circle cx="112.6" cy="121" r=".9" fill="#1A1B1D"></circle>
                          <circle cx="115.8" cy="121" r=".9" fill="#1A1B1D"></circle>
                          {'\n          '}
                          <rect x="50" y="117" width="3" height="1.8" rx=".3" fill="#BF9A62"></rect>
                          <rect x="50" y="117" width=".6" height="1.8" fill="#D8D3C4"></rect>
                          <rect x="52.4" y="117" width=".6" height="1.8" fill="#D8D3C4"></rect>
                          <rect x="54" y="117" width="3" height="1.8" rx=".3" fill="#2A2A2C"></rect>
                          <rect x="54" y="117" width=".6" height="1.8" fill="#D8D3C4"></rect>
                          <rect x="56.4" y="117" width=".6" height="1.8" fill="#D8D3C4"></rect>
                          <rect x="58" y="117" width="3" height="1.8" rx=".3" fill="#BF9A62"></rect>
                          <rect x="58" y="117" width=".6" height="1.8" fill="#D8D3C4"></rect>
                          <rect x="60.4" y="117" width=".6" height="1.8" fill="#D8D3C4"></rect>
                          <rect x="98" y="113" width="3" height="1.8" rx=".3" fill="#8A6C48"></rect>
                          <rect x="98" y="113" width=".6" height="1.8" fill="#D8D3C4"></rect>
                          <rect x="100.4" y="113" width=".6" height="1.8" fill="#D8D3C4"></rect>
                          <rect x="102" y="113" width="3" height="1.8" rx=".3" fill="#BF9A62"></rect>
                          <rect x="102" y="113" width=".6" height="1.8" fill="#D8D3C4"></rect>
                          <rect x="104.4" y="113" width=".6" height="1.8" fill="#D8D3C4"></rect>
                          <rect x="98" y="127" width="3" height="1.8" rx=".3" fill="#2A2A2C"></rect>
                          <rect x="98" y="127" width=".6" height="1.8" fill="#D8D3C4"></rect>
                          <rect x="100.4" y="127" width=".6" height="1.8" fill="#D8D3C4"></rect>
                          <rect x="102" y="127" width="3" height="1.8" rx=".3" fill="#BF9A62"></rect>
                          <rect x="102" y="127" width=".6" height="1.8" fill="#D8D3C4"></rect>
                          <rect x="104.4" y="127" width=".6" height="1.8" fill="#D8D3C4"></rect>
                          <rect x="106" y="127" width="3" height="1.8" rx=".3" fill="#BF9A62"></rect>
                          <rect x="106" y="127" width=".6" height="1.8" fill="#D8D3C4"></rect>
                          <rect x="108.4" y="127" width=".6" height="1.8" fill="#D8D3C4"></rect>
                          <rect x="62" y="128" width="3" height="1.8" rx=".3" fill="#2A2A2C"></rect>
                          <rect x="62" y="128" width=".6" height="1.8" fill="#D8D3C4"></rect>
                          <rect x="64.4" y="128" width=".6" height="1.8" fill="#D8D3C4"></rect>
                          <rect x="66" y="128" width="3" height="1.8" rx=".3" fill="#BF9A62"></rect>
                          <rect x="66" y="128" width=".6" height="1.8" fill="#D8D3C4"></rect>
                          <rect x="68.4" y="128" width=".6" height="1.8" fill="#D8D3C4"></rect>
                          {'\n          '}
                          <circle cx="40" cy="108.6" r="1.3" fill="#E2C06A"></circle>
                          <circle cx="120" cy="108.6" r="1.3" fill="#E2C06A"></circle>
                          <circle cx="40" cy="129.4" r="1.3" fill="#E2C06A"></circle>
                          <circle cx="120" cy="129.4" r="1.3" fill="#E2C06A"></circle>
                          {'\n          '}
                          <text x="104" y="131" fontFamily="JetBrains Mono,monospace" fontSize="2.6" fill="rgba(255,236,200,.75)">
                            SE-CF 08
                          </text>
                          {'\n          '}
                          <rect x="33" y="104" width="94" height="30" rx="5" fill="url(#seFxGl)" opacity=".35"></rect>
                          {'\n        '}
                        </g>
                        {'\n      '}
                      </g>
                      {'\n    '}
                    </svg>
                    {'\n  '}
                  </>
                ) : null}
                {'\n\n  '}
                {v.isBcv ? (
                  <>
                    {'\n    '}
                    <div
                      style={cssToObj(
                        `position:absolute;left:44px;top:10px;width:72px;height:136px;transform:rotate(${s(v.bcvRot)}deg);transition:transform .45s cubic-bezier(.2,.8,.2,1)`,
                      )}
                    >
                      {'\n      '}
                      <span
                        style={{
                          position: 'absolute',
                          left: '-1px',
                          top: '30px',
                          width: '1.5px',
                          height: '8px',
                          borderRadius: '2px',
                          background: 'linear-gradient(90deg,#55595F,#C9CCD0)',
                        }}
                      ></span>
                      <span
                        style={{
                          position: 'absolute',
                          left: '-1px',
                          top: '44px',
                          width: '1.5px',
                          height: '13px',
                          borderRadius: '2px',
                          background: 'linear-gradient(90deg,#55595F,#C9CCD0)',
                        }}
                      ></span>
                      <span
                        style={{
                          position: 'absolute',
                          left: '-1px',
                          top: '62px',
                          width: '1.5px',
                          height: '13px',
                          borderRadius: '2px',
                          background: 'linear-gradient(90deg,#55595F,#C9CCD0)',
                        }}
                      ></span>
                      <span
                        style={{
                          position: 'absolute',
                          right: '-1px',
                          top: '46px',
                          width: '1.5px',
                          height: '20px',
                          borderRadius: '2px',
                          background: 'linear-gradient(90deg,#C9CCD0,#55595F)',
                        }}
                      ></span>
                      {'\n      '}
                      <div
                        style={{
                          position: 'absolute',
                          inset: '0',
                          borderRadius: '15px',
                          background: 'linear-gradient(90deg,#6E7378,#D5D8DC 8%,#9DA1A6 50%,#E4E6E9 92%,#6E7378)',
                          boxShadow: '0 14px 18px -8px rgba(0,0,0,.55)',
                        }}
                      ></div>
                      {'\n      '}
                      <div
                        style={{
                          position: 'absolute',
                          inset: '1.5px',
                          borderRadius: '13.5px',
                          overflow: 'hidden',
                          background: 'linear-gradient(160deg,#5A5D62 0%,#3D3F43 45%,#2E3034 100%)',
                          boxShadow: 'inset 0 0 0 .8px rgba(255,255,255,.18)',
                        }}
                      >
                        {'\n        '}
                        <div
                          style={{
                            position: 'absolute',
                            inset: '0',
                            opacity: '.35',
                            backgroundImage: 'repeating-linear-gradient(90deg,rgba(255,255,255,.05) 0 1px,transparent 1px 3px)',
                          }}
                        ></div>
                        {'\n        '}
                        <div
                          style={{
                            position: 'absolute',
                            left: '5px',
                            top: '5px',
                            width: '30px',
                            height: '31px',
                            borderRadius: '8px',
                            background: 'linear-gradient(145deg,#6A6E74,#3A3C40 55%,#2A2C30)',
                            boxShadow: '0 2px 3px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.35),inset 0 0 0 .7px rgba(255,255,255,.2)',
                          }}
                        >
                          {'\n          '}
                          <span
                            style={{
                              position: 'absolute',
                              left: '3px',
                              top: '3px',
                              width: '12px',
                              height: '12px',
                              borderRadius: '50%',
                              background:
                                'radial-gradient(circle at 50% 50%,#0A0B0D 0 30%,#1B1E24 31% 38%,#07080A 39% 52%,#2A2D33 53% 58%,#8E939A 60%,#D9DCE0 66%,#6E7378 74%,#1A1C1F 82%)',
                              boxShadow: '0 1.5px 2px rgba(0,0,0,.55),inset 0 0 0 .6px rgba(255,255,255,.35)',
                            }}
                          >
                            <span
                              style={{
                                position: 'absolute',
                                left: '28%',
                                top: '24%',
                                width: '22%',
                                height: '16%',
                                borderRadius: '50%',
                                background: 'radial-gradient(closest-side,rgba(150,170,255,.85),rgba(120,90,200,0))',
                              }}
                            ></span>
                            <span
                              style={{
                                position: 'absolute',
                                left: '56%',
                                top: '58%',
                                width: '10%',
                                height: '10%',
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,.55)',
                              }}
                            ></span>
                          </span>
                          <span
                            style={{
                              position: 'absolute',
                              left: '3px',
                              top: '16px',
                              width: '12px',
                              height: '12px',
                              borderRadius: '50%',
                              background:
                                'radial-gradient(circle at 50% 50%,#0A0B0D 0 30%,#1B1E24 31% 38%,#07080A 39% 52%,#2A2D33 53% 58%,#8E939A 60%,#D9DCE0 66%,#6E7378 74%,#1A1C1F 82%)',
                              boxShadow: '0 1.5px 2px rgba(0,0,0,.55),inset 0 0 0 .6px rgba(255,255,255,.35)',
                            }}
                          >
                            <span
                              style={{
                                position: 'absolute',
                                left: '28%',
                                top: '24%',
                                width: '22%',
                                height: '16%',
                                borderRadius: '50%',
                                background: 'radial-gradient(closest-side,rgba(150,170,255,.85),rgba(120,90,200,0))',
                              }}
                            ></span>
                            <span
                              style={{
                                position: 'absolute',
                                left: '56%',
                                top: '58%',
                                width: '10%',
                                height: '10%',
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,.55)',
                              }}
                            ></span>
                          </span>
                          <span
                            style={{
                              position: 'absolute',
                              left: '15.5px',
                              top: '9.5px',
                              width: '12px',
                              height: '12px',
                              borderRadius: '50%',
                              background:
                                'radial-gradient(circle at 50% 50%,#0A0B0D 0 30%,#1B1E24 31% 38%,#07080A 39% 52%,#2A2D33 53% 58%,#8E939A 60%,#D9DCE0 66%,#6E7378 74%,#1A1C1F 82%)',
                              boxShadow: '0 1.5px 2px rgba(0,0,0,.55),inset 0 0 0 .6px rgba(255,255,255,.35)',
                            }}
                          >
                            <span
                              style={{
                                position: 'absolute',
                                left: '28%',
                                top: '24%',
                                width: '22%',
                                height: '16%',
                                borderRadius: '50%',
                                background: 'radial-gradient(closest-side,rgba(150,170,255,.85),rgba(120,90,200,0))',
                              }}
                            ></span>
                            <span
                              style={{
                                position: 'absolute',
                                left: '56%',
                                top: '58%',
                                width: '10%',
                                height: '10%',
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,.55)',
                              }}
                            ></span>
                          </span>
                          {'\n          '}
                          <span
                            style={{
                              position: 'absolute',
                              left: '22px',
                              top: '3px',
                              width: '5px',
                              height: '5px',
                              borderRadius: '50%',
                              background: 'radial-gradient(circle,#FFF4D1,#C9A24A 60%,#6E5520)',
                              boxShadow: '0 0 0 .6px rgba(0,0,0,.6)',
                            }}
                          ></span>
                          {'\n          '}
                          <span
                            style={{
                              position: 'absolute',
                              left: '29px',
                              top: '29px',
                              width: '4px',
                              height: '4px',
                              borderRadius: '50%',
                              background: '#0A0B0D',
                              boxShadow: '0 0 0 .6px #6E7378',
                            }}
                          ></span>
                          {'\n        '}
                        </div>
                        {'\n        '}
                        <span
                          style={{
                            position: 'absolute',
                            left: '30px',
                            top: '84px',
                            width: '14px',
                            height: '14px',
                            borderRadius: '50%',
                            background: 'radial-gradient(circle at 40% 35%,rgba(255,255,255,.22),rgba(255,255,255,.04) 70%)',
                            boxShadow: 'inset 0 0 0 .6px rgba(255,255,255,.14)',
                          }}
                        ></span>
                        {'\n        '}
                        <div
                          style={{
                            position: 'absolute',
                            inset: '0',
                            background:
                              'linear-gradient(118deg,rgba(255,255,255,.28) 0%,rgba(255,255,255,.05) 26%,rgba(255,255,255,0) 27%,rgba(255,255,255,0) 70%,rgba(255,255,255,.08) 100%)',
                          }}
                        ></div>
                        {'\n        '}
                        <span
                          style={{
                            position: 'absolute',
                            top: '-10%',
                            bottom: '-10%',
                            left: '0',
                            width: '34%',
                            background: 'linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.14),rgba(255,255,255,0))',
                            animation: 'sePartSheen 5.5s ease-in-out infinite',
                          }}
                        ></span>
                        {'\n      '}
                      </div>
                      {'\n    '}
                    </div>
                    {'\n  '}
                  </>
                ) : null}
                {'\n\n  '}
                {v.isFrm ? (
                  <>
                    {'\n    '}
                    <div
                      style={{ position: 'absolute', left: '43px', top: '9px', width: '74px', height: '140px', transform: 'rotate(-5deg)' }}
                    >
                      {'\n      '}
                      <span
                        style={{
                          position: 'absolute',
                          right: '-2.5px',
                          top: '38px',
                          width: '3.5px',
                          height: '30px',
                          borderRadius: '2px',
                          background: 'linear-gradient(90deg,#3A3C40,#9DA1A6 50%,#55595E)',
                        }}
                      ></span>
                      <span
                        style={{
                          position: 'absolute',
                          right: '-2.5px',
                          top: '74px',
                          width: '3.5px',
                          height: '16px',
                          borderRadius: '2px',
                          background: 'linear-gradient(90deg,#3A3C40,#9DA1A6 50%,#55595E)',
                        }}
                      ></span>
                      {'\n      '}
                      <span
                        style={{
                          position: 'absolute',
                          left: '-2px',
                          top: '44px',
                          width: '3px',
                          height: '22px',
                          borderRadius: '1.5px',
                          background: 'linear-gradient(90deg,#55595E,#8C9096,#3A3C40)',
                        }}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            left: '0',
                            top: '14px',
                            width: '3px',
                            height: '3px',
                            borderRadius: '50%',
                            background: '#141516',
                          }}
                        ></span>
                      </span>
                      {'\n      '}
                      <div
                        style={{
                          position: 'absolute',
                          inset: '0',
                          borderRadius: '16px',
                          background:
                            'linear-gradient(100deg,#2A2C30 0%,#8C9096 9%,#5E6266 22%,#4A4D52 46%,#7E8388 64%,#3D3F43 84%,#6E7378 100%)',
                          boxShadow:
                            '0 16px 20px -8px rgba(0,0,0,.6),inset 0 0 0 .8px rgba(255,255,255,.28),inset 0 1px 0 rgba(255,255,255,.35)',
                        }}
                      ></div>
                      {'\n      '}
                      <div
                        style={{
                          position: 'absolute',
                          inset: '0',
                          borderRadius: '16px',
                          opacity: '.35',
                          backgroundImage: 'repeating-linear-gradient(90deg,rgba(255,255,255,.12) 0 1px,transparent 1px 2px)',
                          pointerEvents: 'none',
                        }}
                      ></div>
                      {'\n      '}
                      <div
                        style={{
                          position: 'absolute',
                          inset: '4px',
                          borderRadius: '12.5px',
                          background: 'linear-gradient(165deg,#3A3C40,#26282B)',
                          boxShadow: 'inset 0 1.5px 2px rgba(0,0,0,.85),inset 0 0 0 .6px rgba(0,0,0,.7)',
                        }}
                      >
                        {'\n        '}
                        <div
                          style={{
                            position: 'absolute',
                            left: '4px',
                            top: '5px',
                            right: '4px',
                            bottom: '5px',
                            borderRadius: '9.5px',
                            background: 'linear-gradient(170deg,#6E7378,#4A4D52 45%,#55595E)',
                            boxShadow: 'inset 0 1px 0 rgba(255,255,255,.22),inset 0 -1px 0 rgba(0,0,0,.4)',
                          }}
                        >
                          {'\n          '}
                          <div
                            style={{
                              position: 'absolute',
                              inset: '0',
                              borderRadius: '9.5px',
                              opacity: '.5',
                              backgroundImage: 'repeating-linear-gradient(90deg,rgba(255,255,255,.07) 0 1px,transparent 1px 2px)',
                            }}
                          ></div>
                          {'\n          '}
                          <span
                            style={{
                              position: 'absolute',
                              left: '4px',
                              top: '4px',
                              width: '30px',
                              height: '34px',
                              borderRadius: '7px',
                              background: '#141516',
                              boxShadow: 'inset 0 1.5px 3px rgba(0,0,0,.95),0 0 0 .6px rgba(255,255,255,.18)',
                            }}
                          ></span>
                          {'\n          '}
                          <span
                            style={{
                              position: 'absolute',
                              left: '6px',
                              top: '46px',
                              right: '6px',
                              height: '58px',
                              borderRadius: '6px',
                              background: 'linear-gradient(180deg,#2E3033,#1E2022)',
                              boxShadow: 'inset 0 1.5px 3px rgba(0,0,0,.8),0 0 0 .6px rgba(255,255,255,.14)',
                            }}
                          >
                            <span
                              style={{
                                position: 'absolute',
                                left: '5px',
                                top: '5px',
                                width: '28px',
                                height: '8px',
                                borderRadius: '2px',
                                background: 'linear-gradient(90deg,#26282B,#3D3F43)',
                                boxShadow: 'inset 0 0 0 .5px rgba(255,255,255,.1)',
                              }}
                            ></span>
                          </span>
                          {'\n          '}
                          {(Array.isArray(v.frmScrews) ? v.frmScrews : []).map((__it: any, __i: number) => {
                            const v2 = { ...v, s: __it, $index: __i };
                            return ((v: Vals) => (
                              <React.Fragment key={__i}>
                                <span
                                  style={cssToObj(
                                    `position:absolute;left:${s(v.s?.x)}px;top:${s(v.s?.y)}px;width:5px;height:5px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#F2F3F4,#9DA1A6 45%,#55595E);box-shadow:0 0 0 1px #2A2C30,0 .5px 0 1.2px rgba(255,255,255,.12)`,
                                  )}
                                >
                                  <span
                                    style={{
                                      position: 'absolute',
                                      left: '2px',
                                      top: '.6px',
                                      width: '1px',
                                      height: '3.8px',
                                      background: '#2A2C30',
                                    }}
                                  ></span>
                                </span>
                              </React.Fragment>
                            ))(v2);
                          })}
                          {'\n        '}
                        </div>
                        {'\n      '}
                      </div>
                      {'\n      '}
                      <span
                        style={{ position: 'absolute', left: '15px', top: '-.5px', width: '2px', height: '4.5px', background: '#141516' }}
                      ></span>
                      <span
                        style={{ position: 'absolute', right: '15px', top: '-.5px', width: '2px', height: '4.5px', background: '#141516' }}
                      ></span>
                      <span
                        style={{
                          position: 'absolute',
                          left: '15px',
                          bottom: '-.5px',
                          width: '2px',
                          height: '4.5px',
                          background: '#141516',
                        }}
                      ></span>
                      <span
                        style={{
                          position: 'absolute',
                          right: '15px',
                          bottom: '-.5px',
                          width: '2px',
                          height: '4.5px',
                          background: '#141516',
                        }}
                      ></span>
                      <span
                        style={{ position: 'absolute', left: '-.5px', top: '112px', width: '4.5px', height: '2px', background: '#141516' }}
                      ></span>
                      <span
                        style={{ position: 'absolute', right: '-.5px', top: '26px', width: '4.5px', height: '2px', background: '#141516' }}
                      ></span>
                      {'\n      '}
                      <span
                        style={{
                          position: 'absolute',
                          left: '28px',
                          bottom: '.5px',
                          width: '18px',
                          height: '3.5px',
                          borderRadius: '2px',
                          background: '#0B0C0D',
                          boxShadow: 'inset 0 1px 1px rgba(0,0,0,.9),0 0 0 .5px rgba(255,255,255,.25)',
                        }}
                      ></span>
                      {'\n      '}
                      <span
                        style={{
                          position: 'absolute',
                          left: '8px',
                          bottom: '1px',
                          width: '14px',
                          height: '2.5px',
                          background: 'radial-gradient(circle,#0B0C0D 0 .9px,transparent 1.1px) 0 0/2.8px 2.5px repeat-x',
                        }}
                      ></span>
                      <span
                        style={{
                          position: 'absolute',
                          right: '8px',
                          bottom: '1px',
                          width: '14px',
                          height: '2.5px',
                          background: 'radial-gradient(circle,#0B0C0D 0 .9px,transparent 1.1px) 0 0/2.8px 2.5px repeat-x',
                        }}
                      ></span>
                      {'\n      '}
                      <div
                        style={{
                          position: 'absolute',
                          inset: '0',
                          borderRadius: '16px',
                          background:
                            'linear-gradient(118deg,rgba(255,255,255,.22),rgba(255,255,255,0) 28%,rgba(255,255,255,0) 72%,rgba(255,219,110,.12))',
                          pointerEvents: 'none',
                        }}
                      ></div>
                      {'\n    '}
                    </div>
                    {'\n  '}
                  </>
                ) : null}
                {'\n\n  '}
                {v.isCam ? (
                  <>
                    {'\n    '}
                    <div
                      style={{
                        position: 'absolute',
                        left: '20px',
                        top: '22px',
                        width: '120px',
                        height: '116px',
                        transform: 'rotate(-8deg)',
                      }}
                    >
                      {'\n      '}
                      <div
                        style={{
                          position: 'absolute',
                          left: '58px',
                          top: '58px',
                          width: '14px',
                          height: '52px',
                          background: 'linear-gradient(90deg,#8A5A16,#E0A93A 45%,#B9852F)',
                          borderRadius: '2px',
                          boxShadow: 'inset 0 0 0 .6px rgba(0,0,0,.3)',
                        }}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            inset: '3px 4px',
                            background: 'repeating-linear-gradient(0deg,rgba(255,240,200,.35) 0 1px,transparent 1px 3px)',
                          }}
                        ></span>
                      </div>
                      {'\n      '}
                      <div
                        style={{
                          position: 'absolute',
                          left: '52px',
                          top: '96px',
                          width: '26px',
                          height: '16px',
                          borderRadius: '2px',
                          background: 'linear-gradient(180deg,#2A2C30,#141516)',
                          boxShadow: 'inset 0 1px 0 rgba(255,255,255,.2),0 2px 3px rgba(0,0,0,.5)',
                        }}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            left: '3px',
                            right: '3px',
                            top: '4px',
                            height: '6px',
                            background: 'repeating-linear-gradient(90deg,#C9A24A 0 1px,transparent 1px 2.5px)',
                          }}
                        ></span>
                      </div>
                      {'\n      '}
                      <div
                        style={{
                          position: 'absolute',
                          left: '18px',
                          top: '4px',
                          width: '84px',
                          height: '64px',
                          borderRadius: '12px',
                          background: 'linear-gradient(150deg,#3A3C40,#1A1B1D 60%)',
                          boxShadow:
                            '0 10px 14px -6px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.25),inset 0 0 0 .8px rgba(255,255,255,.12)',
                        }}
                      >
                        {'\n        '}
                        <span
                          style={{
                            position: 'absolute',
                            left: '6px',
                            top: '6px',
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            background: 'linear-gradient(145deg,#C9CCD0,#5E6266)',
                            boxShadow: '0 2px 3px rgba(0,0,0,.6)',
                          }}
                        ></span>
                        {'\n        '}
                        <span
                          style={{
                            position: 'absolute',
                            left: '6px',
                            top: '34px',
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            background: 'linear-gradient(145deg,#C9CCD0,#5E6266)',
                            boxShadow: '0 2px 3px rgba(0,0,0,.6)',
                          }}
                        ></span>
                        {'\n        '}
                        <span
                          style={{
                            position: 'absolute',
                            left: '40px',
                            top: '18px',
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            background: 'linear-gradient(145deg,#C9CCD0,#5E6266)',
                            boxShadow: '0 2px 3px rgba(0,0,0,.6)',
                          }}
                        ></span>
                        {'\n        '}
                        <span
                          style={{
                            position: 'absolute',
                            left: '8px',
                            top: '8px',
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            background:
                              'radial-gradient(circle at 50% 50%,#0A0B0D 0 30%,#1B1E24 31% 38%,#07080A 39% 52%,#2A2D33 53% 58%,#8E939A 60%,#D9DCE0 66%,#6E7378 74%,#1A1C1F 82%)',
                            boxShadow: '0 1.5px 2px rgba(0,0,0,.55),inset 0 0 0 .6px rgba(255,255,255,.35)',
                          }}
                        >
                          <span
                            style={{
                              position: 'absolute',
                              left: '28%',
                              top: '24%',
                              width: '22%',
                              height: '16%',
                              borderRadius: '50%',
                              background: 'radial-gradient(closest-side,rgba(150,170,255,.85),rgba(120,90,200,0))',
                            }}
                          ></span>
                          <span
                            style={{
                              position: 'absolute',
                              left: '56%',
                              top: '58%',
                              width: '10%',
                              height: '10%',
                              borderRadius: '50%',
                              background: 'rgba(255,255,255,.55)',
                            }}
                          ></span>
                        </span>
                        <span
                          style={{
                            position: 'absolute',
                            left: '8px',
                            top: '36px',
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            background:
                              'radial-gradient(circle at 50% 50%,#0A0B0D 0 30%,#1B1E24 31% 38%,#07080A 39% 52%,#2A2D33 53% 58%,#8E939A 60%,#D9DCE0 66%,#6E7378 74%,#1A1C1F 82%)',
                            boxShadow: '0 1.5px 2px rgba(0,0,0,.55),inset 0 0 0 .6px rgba(255,255,255,.35)',
                          }}
                        >
                          <span
                            style={{
                              position: 'absolute',
                              left: '28%',
                              top: '24%',
                              width: '22%',
                              height: '16%',
                              borderRadius: '50%',
                              background: 'radial-gradient(closest-side,rgba(150,170,255,.85),rgba(120,90,200,0))',
                            }}
                          ></span>
                          <span
                            style={{
                              position: 'absolute',
                              left: '56%',
                              top: '58%',
                              width: '10%',
                              height: '10%',
                              borderRadius: '50%',
                              background: 'rgba(255,255,255,.55)',
                            }}
                          ></span>
                        </span>
                        <span
                          style={{
                            position: 'absolute',
                            left: '42px',
                            top: '20px',
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background:
                              'radial-gradient(circle at 50% 50%,#0A0B0D 0 30%,#1B1E24 31% 38%,#07080A 39% 52%,#2A2D33 53% 58%,#8E939A 60%,#D9DCE0 66%,#6E7378 74%,#1A1C1F 82%)',
                            boxShadow: '0 1.5px 2px rgba(0,0,0,.55),inset 0 0 0 .6px rgba(255,255,255,.35)',
                          }}
                        >
                          <span
                            style={{
                              position: 'absolute',
                              left: '28%',
                              top: '24%',
                              width: '22%',
                              height: '16%',
                              borderRadius: '50%',
                              background: 'radial-gradient(closest-side,rgba(150,170,255,.85),rgba(120,90,200,0))',
                            }}
                          ></span>
                          <span
                            style={{
                              position: 'absolute',
                              left: '56%',
                              top: '58%',
                              width: '10%',
                              height: '10%',
                              borderRadius: '50%',
                              background: 'rgba(255,255,255,.55)',
                            }}
                          ></span>
                        </span>
                        {'\n        '}
                        <span
                          style={{
                            position: 'absolute',
                            left: '72px',
                            top: '8px',
                            width: '7px',
                            height: '7px',
                            borderRadius: '50%',
                            background: 'radial-gradient(circle,#FFF4D1,#C9A24A 60%,#6E5520)',
                          }}
                        ></span>
                        {'\n      '}
                      </div>
                      {'\n      '}
                      <div
                        style={{
                          position: 'absolute',
                          left: '18px',
                          top: '4px',
                          width: '84px',
                          height: '64px',
                          borderRadius: '12px',
                          background: 'linear-gradient(118deg,rgba(255,255,255,.18),rgba(255,255,255,0) 35%)',
                          pointerEvents: 'none',
                        }}
                      ></div>
                      {'\n    '}
                    </div>
                    {'\n  '}
                  </>
                ) : null}
                {'\n\n  '}
                {v.isSml ? (
                  <>
                    {'\n    '}
                    <div style={{ position: 'absolute', left: '18px', top: '30px', width: '124px', height: '104px' }}>
                      {'\n      '}
                      <div
                        style={cssToObj(
                          `position:absolute;left:4px;top:6px;width:72px;height:16px;border-radius:8px;background:linear-gradient(180deg,#F1F2F4,#A3A8AF 55%,#D5D8DC);box-shadow:0 6px 8px -3px rgba(0,0,0,.4);transform:rotate(-10deg) translateY(${s(v.liftY)}px);transition:transform .45s cubic-bezier(.2,.8,.2,1)`,
                        )}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            left: '8px',
                            top: '4px',
                            width: '36px',
                            height: '8px',
                            borderRadius: '4px',
                            background: 'linear-gradient(180deg,#8E939A,#C9CCD0)',
                          }}
                        ></span>
                        <span
                          style={{
                            position: 'absolute',
                            right: '8px',
                            top: '5px',
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: '#3A3D41',
                          }}
                        ></span>
                      </div>
                      {'\n      '}
                      <div
                        style={cssToObj(
                          `position:absolute;left:66px;top:34px;width:52px;height:34px;border-radius:7px;background:#1D1E21;box-shadow:inset 0 1px 0 rgba(255,255,255,.15),0 6px 8px -3px rgba(0,0,0,.45);background-image:radial-gradient(#6E7176 .9px,transparent 1.1px);background-size:4px 4px;transform:translate(${s(v.liftX)}px,0);transition:transform .45s cubic-bezier(.2,.8,.2,1)`,
                        )}
                      ></div>
                      {'\n      '}
                      <div
                        style={{
                          position: 'absolute',
                          left: '8px',
                          top: '48px',
                          width: '40px',
                          height: '16px',
                          borderRadius: '8px',
                          background: 'linear-gradient(180deg,#F4F5F6,#A9ADB3 50%,#D9DCE0)',
                          boxShadow: 'inset 0 0 0 1px #6E7176,0 6px 8px -3px rgba(0,0,0,.4)',
                        }}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            left: '6px',
                            right: '6px',
                            top: '5px',
                            height: '6px',
                            borderRadius: '3px',
                            background: '#1A1B1D',
                          }}
                        ></span>
                      </div>
                      {'\n      '}
                      <div
                        style={{
                          position: 'absolute',
                          left: '14px',
                          top: '80px',
                          width: '34px',
                          height: '7px',
                          borderRadius: '4px',
                          background: 'linear-gradient(180deg,#D5D8DC,#8E939A)',
                          boxShadow: '0 4px 5px -2px rgba(0,0,0,.4)',
                        }}
                      ></div>
                      {'\n      '}
                      <div
                        style={{
                          position: 'absolute',
                          left: '54px',
                          top: '82px',
                          width: '20px',
                          height: '7px',
                          borderRadius: '4px',
                          background: 'linear-gradient(180deg,#D5D8DC,#8E939A)',
                          boxShadow: '0 4px 5px -2px rgba(0,0,0,.4)',
                        }}
                      ></div>
                      {'\n      '}
                      <span
                        style={{
                          position: 'absolute',
                          left: '88px',
                          top: '80px',
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          background: 'radial-gradient(circle at 35% 35%,#F2F3F4,#6E7176)',
                          boxShadow: '12px 4px 0 -.5px #9DA1A6,24px -2px 0 0 #B5B9BE',
                        }}
                      ></span>
                      {'\n    '}
                    </div>
                    {'\n  '}
                  </>
                ) : null}
                {'\n\n  '}
                {v.isTls ? (
                  <>
                    {'\n    '}
                    <div style={{ position: 'absolute', left: '0', top: '0', width: '160px', height: '160px' }}>
                      {'\n      '}
                      <span
                        style={{
                          position: 'absolute',
                          left: '12px',
                          top: '132px',
                          width: '136px',
                          height: '12px',
                          borderRadius: '50%',
                          background: 'radial-gradient(closest-side,rgba(0,0,0,.35),rgba(0,0,0,0))',
                        }}
                      ></span>
                      {'\n      '}
                      <div
                        style={{
                          position: 'absolute',
                          left: '34px',
                          top: '18px',
                          width: '16px',
                          height: '128px',
                          transform: 'rotate(-24deg)',
                        }}
                      >
                        {'\n        '}
                        <span
                          style={{
                            position: 'absolute',
                            left: '7px',
                            top: '0',
                            width: '2px',
                            height: '44px',
                            background: 'linear-gradient(90deg,#6E7378,#F4F5F6 45%,#8C9096)',
                          }}
                        ></span>
                        {'\n        '}
                        <span
                          style={{
                            position: 'absolute',
                            left: '6.3px',
                            top: '-2px',
                            width: '3.4px',
                            height: '4px',
                            clipPath: 'polygon(20% 0,80% 0,100% 100%,0 100%)',
                            background: 'linear-gradient(90deg,#3D3F43,#C9CCD0)',
                          }}
                        ></span>
                        {'\n        '}
                        <span
                          style={{
                            position: 'absolute',
                            left: '4.5px',
                            top: '42px',
                            width: '7px',
                            height: '6px',
                            borderRadius: '1px',
                            background: 'linear-gradient(90deg,#55595E,#E4E6E9,#55595E)',
                          }}
                        ></span>
                        {'\n        '}
                        <span
                          style={{
                            position: 'absolute',
                            left: '1px',
                            top: '47px',
                            width: '14px',
                            height: '79px',
                            borderRadius: '4px 4px 6px 6px',
                            background: 'linear-gradient(90deg,#55595E,#B9BDC2 22%,#E9EBED 38%,#9DA1A6 62%,#4A4D52)',
                            boxShadow: '0 10px 12px -5px rgba(0,0,0,.55)',
                          }}
                        >
                          <span
                            style={{
                              position: 'absolute',
                              left: '0',
                              right: '0',
                              top: '6px',
                              height: '46px',
                              background:
                                'repeating-linear-gradient(0deg,rgba(255,255,255,.18) 0 1px,rgba(0,0,0,.25) 1px 2px,transparent 2px 3px)',
                              opacity: '.9',
                            }}
                          ></span>
                          <span
                            style={{
                              position: 'absolute',
                              left: '0',
                              right: '0',
                              top: '56px',
                              height: '3px',
                              background: 'linear-gradient(90deg,#B9852F,#FFDB6E,#B9852F)',
                            }}
                          ></span>
                          <span
                            style={{
                              position: 'absolute',
                              left: '2px',
                              right: '2px',
                              bottom: '2px',
                              height: '12px',
                              borderRadius: '2px 2px 5px 5px',
                              background: 'linear-gradient(90deg,#3A3C40,#7E8388 40%,#2A2C30)',
                            }}
                          ></span>
                          <span
                            style={{
                              position: 'absolute',
                              left: '3px',
                              right: '3px',
                              bottom: '-1px',
                              height: '5px',
                              borderRadius: '50%',
                              background: 'radial-gradient(closest-side,#C9CCD0,#55595E)',
                            }}
                          ></span>
                        </span>
                        {'\n      '}
                      </div>
                      {'\n      '}
                      <div
                        style={{
                          position: 'absolute',
                          left: '70px',
                          top: '16px',
                          width: '11px',
                          height: '128px',
                          transform: 'rotate(10deg)',
                        }}
                      >
                        {'\n        '}
                        <span
                          style={{
                            position: 'absolute',
                            inset: '0',
                            borderRadius: '6px 6px 2px 2px',
                            background: 'linear-gradient(90deg,#0E0F10,#2E3033 35%,#45484C 50%,#1E2022 80%)',
                            clipPath: 'polygon(22% 0,78% 0,100% 7%,100% 100%,0 100%,0 7%)',
                            boxShadow: '0 10px 12px -5px rgba(0,0,0,.55)',
                          }}
                        ></span>
                        {'\n        '}
                        <span
                          style={{
                            position: 'absolute',
                            left: '2px',
                            top: '12px',
                            width: '1.5px',
                            height: '106px',
                            background: 'rgba(255,255,255,.22)',
                          }}
                        ></span>
                        {'\n        '}
                        <span
                          style={{
                            position: 'absolute',
                            left: '3px',
                            top: '70px',
                            width: '5px',
                            height: '14px',
                            borderRadius: '1px',
                            background: 'repeating-linear-gradient(0deg,rgba(255,255,255,.16) 0 1px,transparent 1px 2.5px)',
                          }}
                        ></span>
                        {'\n      '}
                      </div>
                      {'\n      '}
                      <div
                        style={{
                          position: 'absolute',
                          left: '96px',
                          top: '30px',
                          width: '16px',
                          height: '110px',
                          transform: 'rotate(16deg)',
                        }}
                      >
                        {'\n        '}
                        <span
                          style={{
                            position: 'absolute',
                            left: '3px',
                            top: '0',
                            width: '4px',
                            height: '106px',
                            borderRadius: '2px 2px 1px 1px',
                            background: 'linear-gradient(90deg,#6E7378,#F2F3F4 40%,#9DA1A6)',
                            transform: 'rotate(-2.5deg)',
                            transformOrigin: '50% 100%',
                          }}
                        ></span>
                        {'\n        '}
                        <span
                          style={{
                            position: 'absolute',
                            left: '9px',
                            top: '0',
                            width: '4px',
                            height: '106px',
                            borderRadius: '2px 2px 1px 1px',
                            background: 'linear-gradient(90deg,#6E7378,#F2F3F4 40%,#9DA1A6)',
                            transform: 'rotate(2.5deg)',
                            transformOrigin: '50% 100%',
                          }}
                        ></span>
                        {'\n        '}
                        <span
                          style={{
                            position: 'absolute',
                            left: '2px',
                            top: '30px',
                            width: '13px',
                            height: '26px',
                            borderRadius: '2px',
                            background: 'repeating-linear-gradient(0deg,rgba(0,0,0,.25) 0 1px,transparent 1px 2.5px)',
                            opacity: '.6',
                          }}
                        ></span>
                        {'\n      '}
                      </div>
                      {'\n      '}
                      <div style={{ position: 'absolute', left: '104px', top: '88px', width: '46px', height: '46px' }}>
                        {'\n        '}
                        <span
                          style={{
                            position: 'absolute',
                            left: '0',
                            top: '10px',
                            width: '46px',
                            height: '30px',
                            borderRadius: '50%',
                            background: 'radial-gradient(ellipse at 40% 35%,#6E7378,#3A3C40 60%,#1E2022)',
                            boxShadow: '0 8px 10px -4px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.3)',
                          }}
                        ></span>
                        {'\n        '}
                        <span
                          style={{
                            position: 'absolute',
                            left: '13px',
                            top: '15px',
                            width: '20px',
                            height: '13px',
                            borderRadius: '50%',
                            background: 'radial-gradient(ellipse at 45% 40%,#9DA1A6,#55595E)',
                            boxShadow: 'inset 0 1px 2px rgba(0,0,0,.5)',
                          }}
                        ></span>
                        {'\n        '}
                        <span
                          style={{
                            position: 'absolute',
                            left: '19px',
                            top: '0',
                            width: '8px',
                            height: '20px',
                            borderRadius: '3px',
                            background: 'linear-gradient(90deg,#B9852F,#F7C032 45%,#FFDB6E 60%,#C9921A)',
                          }}
                        ></span>
                        {'\n      '}
                      </div>
                      {'\n    '}
                    </div>
                    {'\n  '}
                  </>
                ) : null}
                {'\n\n  '}
                {v.isBoard ? (
                  <>
                    {'\n    '}
                    <div
                      style={{
                        position: 'absolute',
                        left: '30px',
                        top: '22px',
                        width: '100px',
                        height: '110px',
                        transform: 'rotate(-6deg)',
                      }}
                    >
                      {'\n      '}
                      <div
                        style={{
                          position: 'absolute',
                          inset: '0',
                          borderRadius: '8px',
                          backgroundColor: '#132020',
                          backgroundImage:
                            'repeating-linear-gradient(90deg,rgba(215,178,90,.16) 0 1px,transparent 1px 9px),repeating-linear-gradient(0deg,rgba(215,178,90,.1) 0 1px,transparent 1px 11px),linear-gradient(150deg,#22302F,#0E1515)',
                          boxShadow: 'inset 0 0 0 1px #2F3E3D,0 12px 16px -6px rgba(0,0,0,.5)',
                        }}
                      ></div>
                      {'\n      '}
                      <div
                        style={cssToObj(
                          `position:absolute;left:10px;top:10px;width:46px;height:40px;border-radius:3px;background:linear-gradient(145deg,#E1E3E6,#9DA1A6);box-shadow:inset 0 0 0 1px rgba(0,0,0,.2);transform:translate(${s(v.liftX)}px,${s(v.liftY)}px);transition:transform .45s cubic-bezier(.2,.8,.2,1)`,
                        )}
                      ></div>
                      {'\n      '}
                      <span
                        style={{
                          position: 'absolute',
                          left: '64px',
                          top: '12px',
                          width: '26px',
                          height: '26px',
                          borderRadius: '2px',
                          background: '#0B0C0D',
                          boxShadow: '0 0 0 1px #3A3D41',
                        }}
                      ></span>
                      {'\n      '}
                      <span
                        style={{
                          position: 'absolute',
                          left: '12px',
                          top: '60px',
                          width: '30px',
                          height: '20px',
                          borderRadius: '2px',
                          background: '#0B0C0D',
                          boxShadow: '0 0 0 1px #3A3D41',
                        }}
                      ></span>
                      {'\n      '}
                      <span
                        style={{
                          position: 'absolute',
                          left: '50px',
                          top: '58px',
                          width: '40px',
                          height: '30px',
                          borderRadius: '3px',
                          background: 'linear-gradient(145deg,#D5D8DC,#8E939A)',
                        }}
                      ></span>
                      {'\n      '}
                      <span
                        style={{
                          position: 'absolute',
                          left: '14px',
                          top: '90px',
                          width: '70px',
                          height: '6px',
                          background: 'repeating-linear-gradient(90deg,#D7B25A 0 2px,transparent 2px 4px)',
                        }}
                      ></span>
                      {'\n    '}
                    </div>
                    {'\n  '}
                  </>
                ) : null}
                {'\n\n  '}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}

const SEPart = createDC('SE Part', Logic, render);
export default SEPart;
