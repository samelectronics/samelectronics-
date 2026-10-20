// Converted from design/project/SE Samsoom.dc.html (12 Oct 2026); maintained by hand since.
'use client';
import React from 'react';
import { type Vals, createDC, cssToObj, s } from '@/dc/runtime';
import Logic from './SESamsoom.logic.js';
import SEPart from './SEPart';

function render(v: Vals) {
  return (
    <>
      <div style={cssToObj(`position:relative;width:${s(v.W)}px;height:${s(v.H)}px`)}>
        {'\n  '}
        <div style={cssToObj(`position:absolute;left:0;top:0;width:200px;height:250px;transform:scale(${s(v.k)});transform-origin:0 0`)}>
          {'\n    '}
          <span
            style={{
              position: 'absolute',
              left: '58px',
              top: '228px',
              width: '84px',
              height: '12px',
              borderRadius: '50%',
              background: 'radial-gradient(closest-side,rgba(0,0,0,.35),rgba(0,0,0,0))',
            }}
          ></span>
          {'\n    '}
          <div style={cssToObj(`position:absolute;inset:0;animation:${s(v.bodyAnim)}`)}>
            {'\n      '}
            <div
              style={cssToObj(
                `position:absolute;inset:0;transform:rotate(${s(v.tilt)}deg);transform-origin:50% 90%;transition:transform .6s cubic-bezier(.2,.8,.2,1)`,
              )}
            >
              {'\n        '}
              <span
                style={{
                  position: 'absolute',
                  left: '99px',
                  top: '8px',
                  width: '2px',
                  height: '24px',
                  borderRadius: '1px',
                  background: 'linear-gradient(90deg,#5E6064,#C9CCD0,#5E6064)',
                }}
              ></span>
              {'\n        '}
              <span
                style={cssToObj(
                  `position:absolute;left:94px;top:2px;width:12px;height:12px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#FFF4D1,#F7C032 55%,#F7C032);animation:${s(v.antAnim)}`,
                )}
              ></span>
              {'\n        '}
              <div
                style={cssToObj(
                  `position:absolute;left:${s(v.armLx)}px;top:136px;width:20px;height:60px;transform-origin:16px 4px;--a:${s(v.armLa)}deg;transform:rotate(${s(v.armLa)}deg);animation:${s(v.armLanim)};transition:transform .6s cubic-bezier(.2,.8,.2,1)`,
                )}
              >
                {'\n          '}
                <svg
                  viewBox="0 0 20 60"
                  width="20"
                  height="60"
                  style={{ position: 'absolute', inset: '0', overflow: 'visible' }}
                  fill="none"
                  strokeLinecap="round"
                >
                  <path d="M16 4 C 4 18, 20 30, 8 48" stroke="#26282B" strokeWidth="6"></path>
                  <path d="M16 4 C 4 18, 20 30, 8 48" stroke="#8C9096" strokeWidth="1.6" strokeDasharray="2 3"></path>
                </svg>
                {'\n          '}
                <span
                  style={{
                    position: 'absolute',
                    left: '0',
                    top: '44px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 30%,#6E7378,#26282B 70%)',
                    boxShadow: '0 2px 3px rgba(0,0,0,.35)',
                  }}
                ></span>
                {'\n          '}
                {v.tool ? (
                  <>
                    <span
                      style={{
                        position: 'absolute',
                        left: '-2px',
                        top: '52px',
                        width: '4px',
                        height: '30px',
                        borderRadius: '1px',
                        background: 'linear-gradient(90deg,#8C9096,#F4F5F6,#8C9096)',
                        transform: 'rotate(30deg)',
                        transformOrigin: '50% 0',
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          left: '-3px',
                          top: '-12px',
                          width: '10px',
                          height: '14px',
                          borderRadius: '3px',
                          background: '#F7C032',
                        }}
                      ></span>
                    </span>
                  </>
                ) : null}
                {'\n        '}
              </div>
              {'\n        '}
              <div
                style={cssToObj(
                  `position:absolute;left:${s(v.armRx)}px;top:136px;width:20px;height:60px;transform-origin:4px 4px;--a:${s(v.armRa)}deg;transform:rotate(${s(v.armRa)}deg);animation:${s(v.armRanim)};transition:transform .6s cubic-bezier(.2,.8,.2,1)`,
                )}
              >
                {'\n          '}
                <svg
                  viewBox="0 0 20 60"
                  width="20"
                  height="60"
                  style={{ position: 'absolute', inset: '0', overflow: 'visible' }}
                  fill="none"
                  strokeLinecap="round"
                >
                  <path d="M4 4 C 16 18, 0 30, 12 48" stroke="#26282B" strokeWidth="6"></path>
                  <path d="M4 4 C 16 18, 0 30, 12 48" stroke="#8C9096" strokeWidth="1.6" strokeDasharray="2 3"></path>
                </svg>
                {'\n          '}
                <span
                  style={{
                    position: 'absolute',
                    left: '4px',
                    top: '44px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 30%,#6E7378,#26282B 70%)',
                    boxShadow: '0 2px 3px rgba(0,0,0,.35)',
                  }}
                ></span>
                {'\n          '}
                {v.hanky ? (
                  <>
                    <svg
                      width="30"
                      height="26"
                      viewBox="0 0 30 26"
                      style={{
                        position: 'absolute',
                        left: '8px',
                        top: '46px',
                        transformOrigin: '2px 2px',
                        animation: 'smHanky .45s cubic-bezier(.45,0,.55,1) infinite',
                        overflow: 'visible',
                      }}
                    >
                      <path
                        d="M2 2 C 10 0, 20 4, 28 2 C 26 10, 28 18, 24 24 C 16 20, 8 22, 2 18 C 4 12, 0 8, 2 2 Z"
                        fill="#F7C032"
                        stroke="#F7C032"
                        strokeWidth="1"
                      ></path>
                      <path
                        d="M6 6 C 12 6, 18 8, 22 7 M5 12 C 11 12, 17 14, 23 13"
                        stroke="#FFF1B8"
                        strokeWidth="1"
                        fill="none"
                        opacity=".8"
                      ></path>
                    </svg>
                  </>
                ) : null}
                {'\n          '}
                {v.thumb ? (
                  <>
                    <span
                      style={{
                        position: 'absolute',
                        left: '14px',
                        top: '38px',
                        width: '6px',
                        height: '12px',
                        borderRadius: '3px',
                        background: '#3D3E3F',
                        transform: 'rotate(-20deg)',
                      }}
                    ></span>
                  </>
                ) : null}
                {'\n          '}
                {v.mag ? (
                  <>
                    <span
                      style={{
                        position: 'absolute',
                        left: '-8px',
                        top: '30px',
                        width: '30px',
                        height: '30px',
                        transform: 'rotate(-30deg)',
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          left: '0',
                          top: '0',
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          boxShadow: 'inset 0 0 0 3px #C9CCD0,0 2px 4px rgba(0,0,0,.4)',
                          background: 'radial-gradient(circle at 35% 30%,rgba(255,255,255,.7),rgba(180,210,240,.25))',
                        }}
                      ></span>
                      <span
                        style={{
                          position: 'absolute',
                          left: '18px',
                          top: '18px',
                          width: '5px',
                          height: '14px',
                          borderRadius: '2px',
                          background: '#26282B',
                          transform: 'rotate(-45deg)',
                          transformOrigin: '50% 0',
                        }}
                      ></span>
                    </span>
                  </>
                ) : null}
                {'\n          '}
                {v.hasItem ? (
                  <span style={cssToObj(`position:absolute;left:12px;top:52px;width:0;height:0;transform:rotate(${s(v.itemRot)}deg)`)}>
                    <SamsoomItem v={v} />
                  </span>
                ) : null}
                {v.hasHold ? (
                  <>
                    <span style={cssToObj(`position:absolute;left:-14px;top:42px;transform:rotate(${s(v.holdRot)}deg)`)}>
                      <SEPart kind={v.hold} size={48} />
                    </span>
                  </>
                ) : null}
                {'\n        '}
              </div>
              {'\n        '}
              <div
                style={{
                  position: 'absolute',
                  left: '52px',
                  top: '30px',
                  width: '96px',
                  height: '184px',
                  borderRadius: '26px',
                  background: 'linear-gradient(115deg,#6E7378 0%,#4A4D52 12%,#2E3033 40%,#4A4D52 64%,#26282B 86%,#3D3E3F 100%)',
                  boxShadow: '0 0 0 .5px rgba(0,0,0,.5),0 14px 24px rgba(0,0,0,.3),inset 0 1px 0 rgba(255,255,255,.35)',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '-4px',
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 40% 35%,#3A4A66,#050506 65%)',
                    boxShadow: '0 0 0 1px #8C9096',
                    zIndex: '2',
                  }}
                ></span>
                {'\n          '}
                <span
                  style={{
                    position: 'absolute',
                    right: '-2px',
                    top: '52px',
                    width: '3px',
                    height: '26px',
                    borderRadius: '2px',
                    background: 'linear-gradient(90deg,#9DA1A6,#5E6064)',
                  }}
                ></span>
                {'\n          '}
                <span
                  style={{
                    position: 'absolute',
                    left: '-2px',
                    top: '44px',
                    width: '3px',
                    height: '14px',
                    borderRadius: '2px',
                    background: 'linear-gradient(90deg,#5E6064,#9DA1A6)',
                  }}
                ></span>
                <span
                  style={{
                    position: 'absolute',
                    left: '-2px',
                    top: '64px',
                    width: '3px',
                    height: '22px',
                    borderRadius: '2px',
                    background: 'linear-gradient(90deg,#5E6064,#9DA1A6)',
                  }}
                ></span>
                {'\n          '}
                <div style={{ position: 'absolute', inset: '3px', borderRadius: '23px', background: '#050506', overflow: 'hidden' }}>
                  {'\n            '}
                  <div
                    style={{
                      position: 'absolute',
                      inset: '4px',
                      borderRadius: '19px',
                      background: 'radial-gradient(110% 80% at 40% 25%,#FFF1B8 0%,#F7C032 35%,#F7C032 75%,#E0A61E 100%)',
                      overflow: 'hidden',
                    }}
                  >
                    {'\n              '}
                    <span
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '6px',
                        width: '26px',
                        height: '8px',
                        marginLeft: '-13px',
                        borderRadius: '4px',
                        background: '#000000',
                        boxShadow: 'inset 0 0 0 .5px rgba(255,255,255,.12)',
                      }}
                    ></span>
                    {'\n              '}
                    <div
                      style={cssToObj(
                        `position:absolute;left:0;right:0;top:46px;height:44px;transform:translate(${s(v.eyeX)}px,${s(v.eyeY)}px);transition:transform .5s cubic-bezier(.2,.8,.2,1)`,
                      )}
                    >
                      {'\n                '}
                      <div style={cssToObj(`position:absolute;inset:0;animation:${s(v.lookAnim)}`)}>
                        {'\n                  '}
                        {v.eCaps ? (
                          <>
                            {'\n                    '}
                            <span
                              style={cssToObj(
                                `position:absolute;left:16px;top:${s(v.eTopL)}px;width:20px;height:${s(v.eHL)}px;border-radius:11px;background:radial-gradient(circle at 40% 30%,#4A4D52,#26282B 55%,#141516);box-shadow:0 2px 3px rgba(110,72,0,.35);transform-origin:50% 50%;animation:${s(v.blinkAnim)};transition:height .35s cubic-bezier(.2,.8,.2,1),top .35s`,
                              )}
                            >
                              <span
                                style={{
                                  position: 'absolute',
                                  left: '4px',
                                  top: '4px',
                                  width: '6px',
                                  height: '6px',
                                  borderRadius: '50%',
                                  background: '#FFFFFF',
                                  opacity: '.9',
                                }}
                              ></span>
                            </span>
                            {'\n                    '}
                            <span
                              style={cssToObj(
                                `position:absolute;right:16px;top:${s(v.eTopR)}px;width:20px;height:${s(v.eHR)}px;border-radius:11px;background:radial-gradient(circle at 40% 30%,#4A4D52,#26282B 55%,#141516);box-shadow:0 2px 3px rgba(110,72,0,.35);transform-origin:50% 50%;animation:${s(v.blinkAnim)};transition:height .35s cubic-bezier(.2,.8,.2,1),top .35s`,
                              )}
                            >
                              <span
                                style={{
                                  position: 'absolute',
                                  left: '4px',
                                  top: '4px',
                                  width: '6px',
                                  height: '6px',
                                  borderRadius: '50%',
                                  background: '#FFFFFF',
                                  opacity: '.9',
                                }}
                              ></span>
                            </span>
                            {'\n                  '}
                          </>
                        ) : null}
                        {'\n                  '}
                        {v.eArc ? (
                          <>
                            {'\n                    '}
                            <span
                              style={{
                                position: 'absolute',
                                left: '14px',
                                top: '12px',
                                width: '24px',
                                height: '14px',
                                boxSizing: 'border-box',
                                border: '5px solid #26282B',
                                borderBottom: 'none',
                                borderRadius: '14px 14px 0 0',
                              }}
                            ></span>
                            {'\n                    '}
                            <span
                              style={cssToObj(
                                `position:absolute;right:14px;top:12px;width:24px;height:14px;box-sizing:border-box;border:5px solid #26282B;border-bottom:none;border-radius:14px 14px 0 0;;opacity:${s(v.rArcO)}`,
                              )}
                            ></span>
                            {'\n                    '}
                            {v.winkR ? (
                              <>
                                <span
                                  style={{
                                    position: 'absolute',
                                    right: '16px',
                                    top: '4px',
                                    width: '20px',
                                    height: '28px',
                                    borderRadius: '11px',
                                    background: 'radial-gradient(circle at 40% 30%,#4A4D52,#26282B 55%,#141516)',
                                    boxShadow: '0 2px 3px rgba(110,72,0,.35)',
                                  }}
                                ></span>
                              </>
                            ) : null}
                            {'\n                  '}
                          </>
                        ) : null}
                        {'\n                  '}
                        {v.eRound ? (
                          <>
                            {'\n                    '}
                            <span
                              style={{
                                position: 'absolute',
                                left: '12px',
                                top: '4px',
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                background: 'radial-gradient(circle at 40% 30%,#4A4D52,#26282B 55%,#141516)',
                                boxShadow: '0 2px 4px rgba(110,72,0,.35)',
                              }}
                            >
                              <span
                                style={{
                                  position: 'absolute',
                                  left: '6px',
                                  top: '5px',
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  background: '#FFFFFF',
                                }}
                              ></span>
                            </span>
                            {'\n                    '}
                            <span
                              style={{
                                position: 'absolute',
                                right: '12px',
                                top: '4px',
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                background: 'radial-gradient(circle at 40% 30%,#4A4D52,#26282B 55%,#141516)',
                                boxShadow: '0 2px 4px rgba(110,72,0,.35)',
                              }}
                            >
                              <span
                                style={{
                                  position: 'absolute',
                                  left: '6px',
                                  top: '5px',
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  background: '#FFFFFF',
                                }}
                              ></span>
                            </span>
                            {'\n                  '}
                          </>
                        ) : null}
                        {'\n                  '}
                        {v.eLine ? (
                          <>
                            {'\n                    '}
                            <span
                              style={{
                                position: 'absolute',
                                left: '14px',
                                top: '18px',
                                width: '24px',
                                height: '12px',
                                boxSizing: 'border-box',
                                border: '4px solid #26282B',
                                borderTop: 'none',
                                borderRadius: '0 0 12px 12px',
                                opacity: '.85',
                              }}
                            ></span>
                            {'\n                    '}
                            <span
                              style={{
                                position: 'absolute',
                                right: '14px',
                                top: '18px',
                                width: '24px',
                                height: '12px',
                                boxSizing: 'border-box',
                                border: '4px solid #26282B',
                                borderTop: 'none',
                                borderRadius: '0 0 12px 12px',
                                opacity: '.85',
                              }}
                            ></span>
                            {'\n                  '}
                          </>
                        ) : null}
                        {'\n                '}
                      </div>
                      {'\n              '}
                    </div>
                    {'\n              '}
                    {v.blush ? (
                      <>
                        <span
                          style={{
                            position: 'absolute',
                            left: '10px',
                            top: '92px',
                            width: '14px',
                            height: '7px',
                            borderRadius: '50%',
                            background: 'rgba(255,120,110,.55)',
                            filter: 'blur(1px)',
                          }}
                        ></span>
                        <span
                          style={{
                            position: 'absolute',
                            right: '10px',
                            top: '92px',
                            width: '14px',
                            height: '7px',
                            borderRadius: '50%',
                            background: 'rgba(255,120,110,.55)',
                            filter: 'blur(1px)',
                          }}
                        ></span>
                      </>
                    ) : null}
                    {'\n              '}
                    <div
                      style={{
                        position: 'absolute',
                        left: '0',
                        right: '0',
                        top: '102px',
                        height: '20px',
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      {'\n                '}
                      {v.mSmile ? (
                        <>
                          <span
                            style={cssToObj(
                              `width:${s(v.mW)}px;height:${s(v.mHh)}px;box-sizing:border-box;border:3.5px solid #26282B;border-top:none;border-radius:0 0 16px 16px;;transition:width .35s,height .35s`,
                            )}
                          ></span>
                        </>
                      ) : null}
                      {'\n                '}
                      {v.mO ? (
                        <>
                          <span
                            style={
                              v.yawnO
                                ? { width: '16px', height: '20px', boxSizing: 'border-box', border: '3px solid #26282B', borderRadius: '50%', background: '#5A2E1E', animation: 'smYawn 3s ease-in-out 1 both' }
                                : { width: '10px', height: '12px', boxSizing: 'border-box', border: '3px solid #26282B', borderRadius: '50%' }
                            }
                          ></span>
                        </>
                      ) : null}
                      {'\n                '}
                      {v.mWavy ? (
                        <>
                          <svg width="26" height="10" viewBox="0 0 26 10" fill="none">
                            <path d="M2 6 Q 7 1, 13 6 T 24 5" stroke="#26282B" strokeWidth="3" strokeLinecap="round"></path>
                          </svg>
                        </>
                      ) : null}
                      {'\n                '}
                      {v.mDots ? (
                        <>
                          <span style={{ display: 'flex', gap: '4px', paddingTop: '4px' }}>
                            <span
                              style={{
                                width: '5px',
                                height: '5px',
                                borderRadius: '50%',
                                background: '#26282B',
                                animation: 'smDots .9s infinite',
                              }}
                            ></span>
                            <span
                              style={{
                                width: '5px',
                                height: '5px',
                                borderRadius: '50%',
                                background: '#26282B',
                                animation: 'smDots .9s .15s infinite',
                              }}
                            ></span>
                            <span
                              style={{
                                width: '5px',
                                height: '5px',
                                borderRadius: '50%',
                                background: '#26282B',
                                animation: 'smDots .9s .3s infinite',
                              }}
                            ></span>
                          </span>
                        </>
                      ) : null}
                      {'\n              '}
                    </div>
                    {'\n              '}
                    <span
                      style={{
                        position: 'absolute',
                        left: '50%',
                        bottom: '8px',
                        width: '30px',
                        height: '3px',
                        marginLeft: '-15px',
                        borderRadius: '2px',
                        background: 'rgba(38,40,43,.3)',
                      }}
                    ></span>
                    {'\n              '}
                    <span
                      style={{
                        position: 'absolute',
                        top: '-10%',
                        bottom: '-10%',
                        left: '0',
                        width: '40%',
                        background: 'linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.14),rgba(255,255,255,0))',
                        animation: 'smShine 6s ease-in-out infinite',
                      }}
                    ></span>
                    {'\n              '}
                    <span
                      style={{
                        position: 'absolute',
                        inset: '0',
                        background: 'linear-gradient(125deg,rgba(255,255,255,.18) 0%,rgba(255,255,255,.04) 28%,rgba(255,255,255,0) 29%)',
                      }}
                    ></span>
                    {'\n            '}
                  </div>
                  {'\n          '}
                </div>
                {'\n        '}
              </div>
              {'\n        '}
              {v.zzz ? (
                <>
                  <span
                    style={{
                      position: 'absolute',
                      left: '150px',
                      top: '30px',
                      fontFamily: "'Space Grotesk',sans-serif",
                      fontWeight: '700',
                      fontSize: '18px',
                      color: '#8C9096',
                      animation: 'smZ 2.6s ease-out infinite',
                    }}
                  >
                    z
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      left: '156px',
                      top: '22px',
                      fontFamily: "'Space Grotesk',sans-serif",
                      fontWeight: '700',
                      fontSize: '12px',
                      color: '#8C9096',
                      animation: 'smZ 2.6s 1.3s ease-out infinite',
                    }}
                  >
                    z
                  </span>
                </>
              ) : null}
              {'\n        '}
              {v.heart ? (
                <>
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    style={{
                      position: 'absolute',
                      left: '146px',
                      top: '70px',
                      opacity: '0',
                      animation: 'smHeart 1.8s .5s ease-out infinite',
                    }}
                  >
                    <path
                      d="M12 21s-7-4.4-9.5-8.6C.7 9.3 2.4 5 6.3 5c2.2 0 3.6 1.3 4.2 2.4h3C14.1 6.3 15.5 5 17.7 5c3.9 0 5.6 4.3 3.8 7.4C19 16.6 12 21 12 21z"
                      fill="#F7C032"
                      stroke="#F7C032"
                      strokeWidth="1"
                    ></path>
                  </svg>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    style={{
                      position: 'absolute',
                      left: '156px',
                      top: '92px',
                      opacity: '0',
                      animation: 'smHeart 1.8s 1.1s ease-out infinite',
                    }}
                  >
                    <path
                      d="M12 21s-7-4.4-9.5-8.6C.7 9.3 2.4 5 6.3 5c2.2 0 3.6 1.3 4.2 2.4h3C14.1 6.3 15.5 5 17.7 5c3.9 0 5.6 4.3 3.8 7.4C19 16.6 12 21 12 21z"
                      fill="#F7C032"
                      stroke="#F7C032"
                      strokeWidth="1"
                    ></path>
                  </svg>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    style={{
                      position: 'absolute',
                      left: '142px',
                      top: '80px',
                      opacity: '0',
                      animation: 'smHeart 1.8s .8s ease-out infinite',
                    }}
                  >
                    <path
                      d="M12 21s-7-4.4-9.5-8.6C.7 9.3 2.4 5 6.3 5c2.2 0 3.6 1.3 4.2 2.4h3C14.1 6.3 15.5 5 17.7 5c3.9 0 5.6 4.3 3.8 7.4C19 16.6 12 21 12 21z"
                      fill="#F7C032"
                    ></path>
                  </svg>
                </>
              ) : null}
              {'\n        '}
              {v.spark ? (
                <>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    style={{ position: 'absolute', left: '146px', top: '36px', animation: 'smSpark 1.4s ease-in-out infinite' }}
                  >
                    <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" fill="#F7C032"></path>
                  </svg>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    style={{ position: 'absolute', left: '38px', top: '60px', animation: 'smSpark 1.4s .7s ease-in-out infinite' }}
                  >
                    <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" fill="#F7C032"></path>
                  </svg>
                </>
              ) : null}
              {'\n        '}
              {v.confetti ? (
                <>
                  {(Array.isArray(v.conf) ? v.conf : []).map((__it: any, __i: number) => {
                    const v2 = { ...v, c: __it, $index: __i };
                    return ((v: Vals) => (
                      <React.Fragment key={__i}>
                        <span
                          style={cssToObj(
                            `position:absolute;left:98px;top:20px;width:6px;height:9px;border-radius:1px;background:${s(v.c?.c)};--cx:${s(v.c?.x)}px;--cy:${s(v.c?.y)}px;animation:smConf 1.4s ${s(v.c?.d)} ease-out infinite`,
                          )}
                        ></span>
                      </React.Fragment>
                    ))(v2);
                  })}
                </>
              ) : null}
              {'\n      '}
            </div>
            {'\n    '}
          </div>
          {'\n  '}
        </div>
      </div>
    </>
  );
}

/** G8 context emotes: the little things Samsoom pulls out (28px, drawn above his right hand). */
function SamsoomItem({ v }: { v: Vals }) {
  const box: React.CSSProperties = { position: 'absolute', left: '-24px', top: '-52px', width: '48px', height: '48px', overflow: 'visible', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,.3))' };
  if (v.isClock)
    return (
      <svg viewBox="0 0 34 34" style={box}>
        <circle cx="17" cy="17" r="15" fill="#FFFFFF" stroke="#26282B" strokeWidth="3" />
        <circle cx="17" cy="17" r="11.5" fill="none" stroke="#F7C032" strokeWidth="1.5" strokeDasharray="1.5 4.5" />
        <path d="M17 17V9" stroke="#26282B" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M17 17h-6" stroke="#26282B" strokeWidth="2.2" strokeLinecap="round" style={{ transformOrigin: '17px 17px', animation: v.itemAnim }} />
        <circle cx="17" cy="17" r="2" fill="#F7C032" />
      </svg>
    );
  if (v.isCheck)
    return (
      <svg viewBox="0 0 34 34" style={box}>
        <rect x="5" y="4" width="24" height="29" rx="3" fill="#FFFFFF" stroke="#26282B" strokeWidth="2.6" />
        <rect x="12" y="1.5" width="10" height="5" rx="1.5" fill="#F7C032" stroke="#26282B" strokeWidth="1.6" />
        {[12, 19, 26].map((y, i) => (
          <g key={y} style={{ opacity: 0, animation: `smCheck .4s ${0.35 + i * 0.45}s cubic-bezier(.2,.8,.2,1) both` }}>
            <path d={`M9 ${y}l2 2 3.5-4`} fill="none" stroke="#2BB673" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d={`M17 ${y}h8`} stroke="#8C9096" strokeWidth="2" strokeLinecap="round" />
          </g>
        ))}
      </svg>
    );
  if (v.isTool)
    return (
      <svg viewBox="0 0 34 34" style={{ ...box, transformOrigin: '17px 30px', animation: v.itemAnim }}>
        <rect x="13" y="16" width="8" height="16" rx="3" fill="#F7C032" stroke="#26282B" strokeWidth="2" />
        <path d="M15.5 19v10M18.5 19v10" stroke="#F7C032" strokeWidth="1.2" />
        <rect x="15.6" y="2" width="2.8" height="15" rx="1" fill="#C9CCD0" stroke="#5E6064" strokeWidth=".8" />
        <path d="M15.6 2h2.8v2h-2.8z" fill="#26282B" />
      </svg>
    );
  if (v.isTag)
    return (
      <svg viewBox="0 0 34 34" style={{ ...box, transformOrigin: '17px 4px', animation: 'smSwing 1.5s ease-in-out infinite alternate' }}>
        <path d="M17 1v6" stroke="#26282B" strokeWidth="1.4" />
        <path d="M8 12l9-6 9 6v18a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2z" fill="#F7C032" stroke="#26282B" strokeWidth="2.2" strokeLinejoin="round" />
        <circle cx="17" cy="11" r="2" fill="#FFFFFF" stroke="#26282B" strokeWidth="1.4" />
        <path d="M12 19h10M12 24h7" stroke="#26282B" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  if (v.isParcel)
    return (
      <svg viewBox="0 0 34 34" style={box}>
        <path d="M17 3 31 10v15l-14 7L3 25V10z" fill="#D9A55C" stroke="#26282B" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M3 10l14 7 14-7M17 17v15" fill="none" stroke="#26282B" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M10 6.5l14 7v5" fill="none" stroke="#F7C032" strokeWidth="3" />
      </svg>
    );
  if (v.isGlobe)
    return (
      <svg viewBox="0 0 34 34" style={box}>
        <circle cx="17" cy="17" r="14" fill="#26282B" stroke="#F7C032" strokeWidth="2.2" />
        <ellipse cx="17" cy="17" rx="7" ry="14" fill="none" stroke="#F7C032" strokeWidth="1.4" style={{ transformOrigin: '17px 17px', animation: v.itemAnim }} />
        <ellipse cx="17" cy="17" rx="7" ry="14" fill="none" stroke="#F7C032" strokeWidth="1" opacity=".6" style={{ transformOrigin: '17px 17px', animation: v.itemAnim, animationDelay: '-.75s' }} />
        <path d="M3 17h28M5.5 10h23M5.5 24h23" stroke="#F7C032" strokeWidth="1" opacity=".7" />
      </svg>
    );
  return null;
}

const SESamsoom = createDC('SE Samsoom', Logic, render);
export default SESamsoom;
