// GENERATED from design/project/SE Wholesale Truck.dc.html by scripts/dc-codegen.mjs. Do not edit by hand: change the generator
// (or detach this file from the generator's COMPONENTS list before hand-editing it).
'use client';
import React from 'react';
import { type Vals, createDC, cssToObj, s, t } from '@/dc/runtime';
import Logic from './SEWholesaleTruck.logic.js';

function render(v: Vals) {
  return (
    <>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {'\n  '}
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: '12px',
            color: '#E4E6E9',
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: '#F7C032',
              animation: 'wtLed 1.4s ease-in-out infinite',
            }}
          ></span>
          {t(v.status)}
        </span>
        {'\n  '}
        <div
          style={{
            position: 'relative',
            height: '260px',
            borderRadius: '14px',
            overflow: 'hidden',
            background: 'linear-gradient(180deg,#4A4D52 0%,#3D3E3F 58%,#2E3033 58.2%,#26282B 100%)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.08)',
          }}
        >
          {'\n    '}
          <div
            style={{
              position: 'absolute',
              left: '0',
              right: '0',
              top: '0',
              height: '58%',
              background: 'repeating-linear-gradient(90deg,rgba(255,255,255,.025) 0 2px,transparent 2px 60px)',
            }}
          ></div>
          {'\n    '}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '-40px',
              width: '320px',
              height: '200px',
              marginLeft: '-160px',
              background: 'radial-gradient(closest-side,rgba(255,255,255,.16),rgba(255,255,255,0))',
              pointerEvents: 'none',
            }}
          ></div>
          {'\n    '}
          <div
            style={{
              position: 'absolute',
              right: '20px',
              top: '26px',
              width: '150px',
              height: '126px',
              borderRadius: '3px 3px 0 0',
              background: 'repeating-linear-gradient(0deg,#5E6064 0 7px,#4A4D52 7px 9px)',
              boxShadow: 'inset 0 0 0 3px #26282B,0 0 0 4px #3D3E3F',
            }}
          >
            <span
              style={{
                position: 'absolute',
                left: '0',
                right: '0',
                bottom: '0',
                height: '20px',
                background: 'linear-gradient(180deg,rgba(255,255,255,.25),rgba(255,255,255,.05))',
              }}
            ></span>
          </div>
          {'\n    '}
          <div
            style={{
              position: 'absolute',
              left: '0',
              right: '0',
              top: '58%',
              bottom: '0',
              opacity: '.5',
              backgroundImage:
                'radial-gradient(rgba(255,255,255,.07) 1px,transparent 1.2px),linear-gradient(90deg,rgba(0,0,0,.25) 1px,transparent 1px)',
              backgroundSize: '7px 7px,120px 100%',
            }}
          ></div>
          {'\n    '}
          <span
            style={{
              position: 'absolute',
              left: '40px',
              top: '186px',
              width: '180px',
              height: '16px',
              borderRadius: '50%',
              background: 'radial-gradient(closest-side,rgba(0,0,0,.45),rgba(0,0,0,0))',
            }}
          ></span>
          {'\n    '}
          <span
            style={{
              position: 'absolute',
              left: '60px',
              top: '170px',
              width: '150px',
              height: '40px',
              borderRadius: '50%',
              background: 'radial-gradient(closest-side,rgba(200,200,200,.45),rgba(200,200,200,0))',
              animation: 'wtDust 12s infinite',
              opacity: '0',
            }}
          ></span>
          {'\n    '}
          <div
            style={{
              position: 'absolute',
              left: '66px',
              top: '96px',
              width: '134px',
              height: '100px',
              animation: 'wtPallet 12s infinite',
              animationTimingFunction: 'cubic-bezier(.2,.8,.2,1)',
            }}
          >
            {'\n      '}
            <div style={{ position: 'absolute', left: '0', bottom: '12px', width: '134px', height: '88px' }}>
              <span
                data-c="0"
                style={cssToObj(
                  `position:absolute;left:0px;bottom:0px;width:32px;height:23px;border-radius:1.5px;background:linear-gradient(160deg,#D9A866 0%,#C48A45 55%,#A9733A 100%);box-shadow:inset 0 0 0 .5px rgba(90,55,20,.45),inset 0 -2px 0 rgba(90,55,20,.2),0 2px 3px rgba(0,0,0,.35);transform-origin:50% 100%;animation:wtC0 12s infinite;display:${s(v.cDisp0)}`,
                )}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: '13px',
                    top: '0',
                    width: '5px',
                    height: '100%',
                    background: 'linear-gradient(90deg,rgba(255,240,210,.5),rgba(230,200,150,.75),rgba(255,240,210,.5))',
                  }}
                ></span>
                <span
                  style={{
                    position: 'absolute',
                    left: '2px',
                    top: '4px',
                    width: '10px',
                    height: '9px',
                    borderRadius: '1px',
                    background: '#F4F1EA',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: '1px',
                      top: '1px',
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: '3px',
                      fontWeight: '700',
                      color: '#26282B',
                      lineHeight: '1',
                    }}
                  >
                    SE-4962
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      left: '1px',
                      bottom: '1px',
                      width: '8px',
                      height: '3px',
                      background: 'repeating-linear-gradient(90deg,#26282B 0 .6px,transparent .6px 1.3px)',
                    }}
                  ></span>
                </span>
              </span>
              <span
                data-c="1"
                style={cssToObj(
                  `position:absolute;left:33px;bottom:0px;width:32px;height:23px;border-radius:1.5px;background:linear-gradient(160deg,#D9A866 0%,#C48A45 55%,#A9733A 100%);box-shadow:inset 0 0 0 .5px rgba(90,55,20,.45),inset 0 -2px 0 rgba(90,55,20,.2),0 2px 3px rgba(0,0,0,.35);transform-origin:50% 100%;animation:wtC1 12s infinite;display:${s(v.cDisp1)}`,
                )}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: '13px',
                    top: '0',
                    width: '5px',
                    height: '100%',
                    background: 'linear-gradient(90deg,rgba(255,240,210,.5),rgba(230,200,150,.75),rgba(255,240,210,.5))',
                  }}
                ></span>
                <span
                  style={{
                    position: 'absolute',
                    left: '2px',
                    top: '4px',
                    width: '10px',
                    height: '9px',
                    borderRadius: '1px',
                    background: '#F4F1EA',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: '1px',
                      top: '1px',
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: '3px',
                      fontWeight: '700',
                      color: '#26282B',
                      lineHeight: '1',
                    }}
                  >
                    SE-4962
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      left: '1px',
                      bottom: '1px',
                      width: '8px',
                      height: '3px',
                      background: 'repeating-linear-gradient(90deg,#26282B 0 .6px,transparent .6px 1.3px)',
                    }}
                  ></span>
                </span>
              </span>
              <span
                data-c="2"
                style={cssToObj(
                  `position:absolute;left:66px;bottom:0px;width:32px;height:23px;border-radius:1.5px;background:linear-gradient(160deg,#D9A866 0%,#C48A45 55%,#A9733A 100%);box-shadow:inset 0 0 0 .5px rgba(90,55,20,.45),inset 0 -2px 0 rgba(90,55,20,.2),0 2px 3px rgba(0,0,0,.35);transform-origin:50% 100%;animation:wtC2 12s infinite;display:${s(v.cDisp2)}`,
                )}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: '13px',
                    top: '0',
                    width: '5px',
                    height: '100%',
                    background: 'linear-gradient(90deg,rgba(255,240,210,.5),rgba(230,200,150,.75),rgba(255,240,210,.5))',
                  }}
                ></span>
                <span
                  style={{
                    position: 'absolute',
                    left: '2px',
                    top: '4px',
                    width: '10px',
                    height: '9px',
                    borderRadius: '1px',
                    background: '#F4F1EA',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: '1px',
                      top: '1px',
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: '3px',
                      fontWeight: '700',
                      color: '#26282B',
                      lineHeight: '1',
                    }}
                  >
                    SE-4962
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      left: '1px',
                      bottom: '1px',
                      width: '8px',
                      height: '3px',
                      background: 'repeating-linear-gradient(90deg,#26282B 0 .6px,transparent .6px 1.3px)',
                    }}
                  ></span>
                </span>
              </span>
              <span
                data-c="3"
                style={cssToObj(
                  `position:absolute;left:99px;bottom:0px;width:32px;height:23px;border-radius:1.5px;background:linear-gradient(160deg,#D9A866 0%,#C48A45 55%,#A9733A 100%);box-shadow:inset 0 0 0 .5px rgba(90,55,20,.45),inset 0 -2px 0 rgba(90,55,20,.2),0 2px 3px rgba(0,0,0,.35);transform-origin:50% 100%;animation:wtC3 12s infinite;display:${s(v.cDisp3)}`,
                )}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: '13px',
                    top: '0',
                    width: '5px',
                    height: '100%',
                    background: 'linear-gradient(90deg,rgba(255,240,210,.5),rgba(230,200,150,.75),rgba(255,240,210,.5))',
                  }}
                ></span>
                <span
                  style={{
                    position: 'absolute',
                    left: '2px',
                    top: '4px',
                    width: '10px',
                    height: '9px',
                    borderRadius: '1px',
                    background: '#F4F1EA',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: '1px',
                      top: '1px',
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: '3px',
                      fontWeight: '700',
                      color: '#26282B',
                      lineHeight: '1',
                    }}
                  >
                    SE-4962
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      left: '1px',
                      bottom: '1px',
                      width: '8px',
                      height: '3px',
                      background: 'repeating-linear-gradient(90deg,#26282B 0 .6px,transparent .6px 1.3px)',
                    }}
                  ></span>
                </span>
              </span>
              <span
                data-c="4"
                style={cssToObj(
                  `position:absolute;left:0px;bottom:24px;width:32px;height:23px;border-radius:1.5px;background:linear-gradient(160deg,#D9A866 0%,#C48A45 55%,#A9733A 100%);box-shadow:inset 0 0 0 .5px rgba(90,55,20,.45),inset 0 -2px 0 rgba(90,55,20,.2),0 2px 3px rgba(0,0,0,.35);transform-origin:50% 100%;animation:wtC4 12s infinite;display:${s(v.cDisp4)}`,
                )}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: '13px',
                    top: '0',
                    width: '5px',
                    height: '100%',
                    background: 'linear-gradient(90deg,rgba(255,240,210,.5),rgba(230,200,150,.75),rgba(255,240,210,.5))',
                  }}
                ></span>
                <span
                  style={{
                    position: 'absolute',
                    left: '2px',
                    top: '4px',
                    width: '10px',
                    height: '9px',
                    borderRadius: '1px',
                    background: '#F4F1EA',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: '1px',
                      top: '1px',
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: '3px',
                      fontWeight: '700',
                      color: '#26282B',
                      lineHeight: '1',
                    }}
                  >
                    SE-4962
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      left: '1px',
                      bottom: '1px',
                      width: '8px',
                      height: '3px',
                      background: 'repeating-linear-gradient(90deg,#26282B 0 .6px,transparent .6px 1.3px)',
                    }}
                  ></span>
                </span>
              </span>
              <span
                data-c="5"
                style={cssToObj(
                  `position:absolute;left:33px;bottom:24px;width:32px;height:23px;border-radius:1.5px;background:linear-gradient(160deg,#D9A866 0%,#C48A45 55%,#A9733A 100%);box-shadow:inset 0 0 0 .5px rgba(90,55,20,.45),inset 0 -2px 0 rgba(90,55,20,.2),0 2px 3px rgba(0,0,0,.35);transform-origin:50% 100%;animation:wtC5 12s infinite;display:${s(v.cDisp5)}`,
                )}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: '13px',
                    top: '0',
                    width: '5px',
                    height: '100%',
                    background: 'linear-gradient(90deg,rgba(255,240,210,.5),rgba(230,200,150,.75),rgba(255,240,210,.5))',
                  }}
                ></span>
                <span
                  style={{
                    position: 'absolute',
                    left: '2px',
                    top: '4px',
                    width: '10px',
                    height: '9px',
                    borderRadius: '1px',
                    background: '#F4F1EA',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: '1px',
                      top: '1px',
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: '3px',
                      fontWeight: '700',
                      color: '#26282B',
                      lineHeight: '1',
                    }}
                  >
                    SE-4962
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      left: '1px',
                      bottom: '1px',
                      width: '8px',
                      height: '3px',
                      background: 'repeating-linear-gradient(90deg,#26282B 0 .6px,transparent .6px 1.3px)',
                    }}
                  ></span>
                </span>
              </span>
              <span
                data-c="6"
                style={cssToObj(
                  `position:absolute;left:66px;bottom:24px;width:32px;height:23px;border-radius:1.5px;background:linear-gradient(160deg,#D9A866 0%,#C48A45 55%,#A9733A 100%);box-shadow:inset 0 0 0 .5px rgba(90,55,20,.45),inset 0 -2px 0 rgba(90,55,20,.2),0 2px 3px rgba(0,0,0,.35);transform-origin:50% 100%;animation:wtC6 12s infinite;display:${s(v.cDisp6)}`,
                )}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: '13px',
                    top: '0',
                    width: '5px',
                    height: '100%',
                    background: 'linear-gradient(90deg,rgba(255,240,210,.5),rgba(230,200,150,.75),rgba(255,240,210,.5))',
                  }}
                ></span>
                <span
                  style={{
                    position: 'absolute',
                    left: '2px',
                    top: '4px',
                    width: '10px',
                    height: '9px',
                    borderRadius: '1px',
                    background: '#F4F1EA',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: '1px',
                      top: '1px',
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: '3px',
                      fontWeight: '700',
                      color: '#26282B',
                      lineHeight: '1',
                    }}
                  >
                    SE-4962
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      left: '1px',
                      bottom: '1px',
                      width: '8px',
                      height: '3px',
                      background: 'repeating-linear-gradient(90deg,#26282B 0 .6px,transparent .6px 1.3px)',
                    }}
                  ></span>
                </span>
              </span>
              <span
                data-c="7"
                style={cssToObj(
                  `position:absolute;left:99px;bottom:24px;width:32px;height:23px;border-radius:1.5px;background:linear-gradient(160deg,#D9A866 0%,#C48A45 55%,#A9733A 100%);box-shadow:inset 0 0 0 .5px rgba(90,55,20,.45),inset 0 -2px 0 rgba(90,55,20,.2),0 2px 3px rgba(0,0,0,.35);transform-origin:50% 100%;animation:wtC7 12s infinite;display:${s(v.cDisp7)}`,
                )}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: '13px',
                    top: '0',
                    width: '5px',
                    height: '100%',
                    background: 'linear-gradient(90deg,rgba(255,240,210,.5),rgba(230,200,150,.75),rgba(255,240,210,.5))',
                  }}
                ></span>
                <span
                  style={{
                    position: 'absolute',
                    left: '2px',
                    top: '4px',
                    width: '10px',
                    height: '9px',
                    borderRadius: '1px',
                    background: '#F4F1EA',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: '1px',
                      top: '1px',
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: '3px',
                      fontWeight: '700',
                      color: '#26282B',
                      lineHeight: '1',
                    }}
                  >
                    SE-4962
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      left: '1px',
                      bottom: '1px',
                      width: '8px',
                      height: '3px',
                      background: 'repeating-linear-gradient(90deg,#26282B 0 .6px,transparent .6px 1.3px)',
                    }}
                  ></span>
                </span>
              </span>
              <span
                data-c="8"
                style={cssToObj(
                  `position:absolute;left:0px;bottom:48px;width:32px;height:23px;border-radius:1.5px;background:linear-gradient(160deg,#D9A866 0%,#C48A45 55%,#A9733A 100%);box-shadow:inset 0 0 0 .5px rgba(90,55,20,.45),inset 0 -2px 0 rgba(90,55,20,.2),0 2px 3px rgba(0,0,0,.35);transform-origin:50% 100%;animation:wtC8 12s infinite;display:${s(v.cDisp8)}`,
                )}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: '13px',
                    top: '0',
                    width: '5px',
                    height: '100%',
                    background: 'linear-gradient(90deg,rgba(255,240,210,.5),rgba(230,200,150,.75),rgba(255,240,210,.5))',
                  }}
                ></span>
                <span
                  style={{
                    position: 'absolute',
                    left: '2px',
                    top: '4px',
                    width: '10px',
                    height: '9px',
                    borderRadius: '1px',
                    background: '#F4F1EA',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: '1px',
                      top: '1px',
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: '3px',
                      fontWeight: '700',
                      color: '#26282B',
                      lineHeight: '1',
                    }}
                  >
                    SE-4962
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      left: '1px',
                      bottom: '1px',
                      width: '8px',
                      height: '3px',
                      background: 'repeating-linear-gradient(90deg,#26282B 0 .6px,transparent .6px 1.3px)',
                    }}
                  ></span>
                </span>
              </span>
              <span
                data-c="9"
                style={cssToObj(
                  `position:absolute;left:33px;bottom:48px;width:32px;height:23px;border-radius:1.5px;background:linear-gradient(160deg,#D9A866 0%,#C48A45 55%,#A9733A 100%);box-shadow:inset 0 0 0 .5px rgba(90,55,20,.45),inset 0 -2px 0 rgba(90,55,20,.2),0 2px 3px rgba(0,0,0,.35);transform-origin:50% 100%;animation:wtC9 12s infinite;display:${s(v.cDisp9)}`,
                )}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: '13px',
                    top: '0',
                    width: '5px',
                    height: '100%',
                    background: 'linear-gradient(90deg,rgba(255,240,210,.5),rgba(230,200,150,.75),rgba(255,240,210,.5))',
                  }}
                ></span>
                <span
                  style={{
                    position: 'absolute',
                    left: '2px',
                    top: '4px',
                    width: '10px',
                    height: '9px',
                    borderRadius: '1px',
                    background: '#F4F1EA',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: '1px',
                      top: '1px',
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: '3px',
                      fontWeight: '700',
                      color: '#26282B',
                      lineHeight: '1',
                    }}
                  >
                    SE-4962
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      left: '1px',
                      bottom: '1px',
                      width: '8px',
                      height: '3px',
                      background: 'repeating-linear-gradient(90deg,#26282B 0 .6px,transparent .6px 1.3px)',
                    }}
                  ></span>
                </span>
              </span>
              <span
                data-c="10"
                style={cssToObj(
                  `position:absolute;left:66px;bottom:48px;width:32px;height:23px;border-radius:1.5px;background:linear-gradient(160deg,#D9A866 0%,#C48A45 55%,#A9733A 100%);box-shadow:inset 0 0 0 .5px rgba(90,55,20,.45),inset 0 -2px 0 rgba(90,55,20,.2),0 2px 3px rgba(0,0,0,.35);transform-origin:50% 100%;animation:wtC10 12s infinite;display:${s(v.cDisp10)}`,
                )}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: '13px',
                    top: '0',
                    width: '5px',
                    height: '100%',
                    background: 'linear-gradient(90deg,rgba(255,240,210,.5),rgba(230,200,150,.75),rgba(255,240,210,.5))',
                  }}
                ></span>
                <span
                  style={{
                    position: 'absolute',
                    left: '2px',
                    top: '4px',
                    width: '10px',
                    height: '9px',
                    borderRadius: '1px',
                    background: '#F4F1EA',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: '1px',
                      top: '1px',
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: '3px',
                      fontWeight: '700',
                      color: '#26282B',
                      lineHeight: '1',
                    }}
                  >
                    SE-4962
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      left: '1px',
                      bottom: '1px',
                      width: '8px',
                      height: '3px',
                      background: 'repeating-linear-gradient(90deg,#26282B 0 .6px,transparent .6px 1.3px)',
                    }}
                  ></span>
                </span>
              </span>
              <span
                data-c="11"
                style={cssToObj(
                  `position:absolute;left:99px;bottom:48px;width:32px;height:23px;border-radius:1.5px;background:linear-gradient(160deg,#D9A866 0%,#C48A45 55%,#A9733A 100%);box-shadow:inset 0 0 0 .5px rgba(90,55,20,.45),inset 0 -2px 0 rgba(90,55,20,.2),0 2px 3px rgba(0,0,0,.35);transform-origin:50% 100%;animation:wtC11 12s infinite;display:${s(v.cDisp11)}`,
                )}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: '13px',
                    top: '0',
                    width: '5px',
                    height: '100%',
                    background: 'linear-gradient(90deg,rgba(255,240,210,.5),rgba(230,200,150,.75),rgba(255,240,210,.5))',
                  }}
                ></span>
                <span
                  style={{
                    position: 'absolute',
                    left: '2px',
                    top: '4px',
                    width: '10px',
                    height: '9px',
                    borderRadius: '1px',
                    background: '#F4F1EA',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: '1px',
                      top: '1px',
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: '3px',
                      fontWeight: '700',
                      color: '#26282B',
                      lineHeight: '1',
                    }}
                  >
                    SE-4962
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      left: '1px',
                      bottom: '1px',
                      width: '8px',
                      height: '3px',
                      background: 'repeating-linear-gradient(90deg,#26282B 0 .6px,transparent .6px 1.3px)',
                    }}
                  ></span>
                </span>
              </span>
              <span
                data-c="12"
                style={cssToObj(
                  `position:absolute;left:0px;bottom:72px;width:32px;height:23px;border-radius:1.5px;background:linear-gradient(160deg,#D9A866 0%,#C48A45 55%,#A9733A 100%);box-shadow:inset 0 0 0 .5px rgba(90,55,20,.45),inset 0 -2px 0 rgba(90,55,20,.2),0 2px 3px rgba(0,0,0,.35);transform-origin:50% 100%;animation:wtC12 12s infinite;display:${s(v.cDisp12)}`,
                )}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: '13px',
                    top: '0',
                    width: '5px',
                    height: '100%',
                    background: 'linear-gradient(90deg,rgba(255,240,210,.5),rgba(230,200,150,.75),rgba(255,240,210,.5))',
                  }}
                ></span>
                <span
                  style={{
                    position: 'absolute',
                    left: '2px',
                    top: '4px',
                    width: '10px',
                    height: '9px',
                    borderRadius: '1px',
                    background: '#F4F1EA',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: '1px',
                      top: '1px',
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: '3px',
                      fontWeight: '700',
                      color: '#26282B',
                      lineHeight: '1',
                    }}
                  >
                    SE-4962
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      left: '1px',
                      bottom: '1px',
                      width: '8px',
                      height: '3px',
                      background: 'repeating-linear-gradient(90deg,#26282B 0 .6px,transparent .6px 1.3px)',
                    }}
                  ></span>
                </span>
              </span>
              <span
                data-c="13"
                style={cssToObj(
                  `position:absolute;left:33px;bottom:72px;width:32px;height:23px;border-radius:1.5px;background:linear-gradient(160deg,#D9A866 0%,#C48A45 55%,#A9733A 100%);box-shadow:inset 0 0 0 .5px rgba(90,55,20,.45),inset 0 -2px 0 rgba(90,55,20,.2),0 2px 3px rgba(0,0,0,.35);transform-origin:50% 100%;animation:wtC13 12s infinite;display:${s(v.cDisp13)}`,
                )}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: '13px',
                    top: '0',
                    width: '5px',
                    height: '100%',
                    background: 'linear-gradient(90deg,rgba(255,240,210,.5),rgba(230,200,150,.75),rgba(255,240,210,.5))',
                  }}
                ></span>
                <span
                  style={{
                    position: 'absolute',
                    left: '2px',
                    top: '4px',
                    width: '10px',
                    height: '9px',
                    borderRadius: '1px',
                    background: '#F4F1EA',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: '1px',
                      top: '1px',
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: '3px',
                      fontWeight: '700',
                      color: '#26282B',
                      lineHeight: '1',
                    }}
                  >
                    SE-4962
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      left: '1px',
                      bottom: '1px',
                      width: '8px',
                      height: '3px',
                      background: 'repeating-linear-gradient(90deg,#26282B 0 .6px,transparent .6px 1.3px)',
                    }}
                  ></span>
                </span>
              </span>
              <span
                data-c="14"
                style={cssToObj(
                  `position:absolute;left:66px;bottom:72px;width:32px;height:23px;border-radius:1.5px;background:linear-gradient(160deg,#D9A866 0%,#C48A45 55%,#A9733A 100%);box-shadow:inset 0 0 0 .5px rgba(90,55,20,.45),inset 0 -2px 0 rgba(90,55,20,.2),0 2px 3px rgba(0,0,0,.35);transform-origin:50% 100%;animation:wtC14 12s infinite;display:${s(v.cDisp14)}`,
                )}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: '13px',
                    top: '0',
                    width: '5px',
                    height: '100%',
                    background: 'linear-gradient(90deg,rgba(255,240,210,.5),rgba(230,200,150,.75),rgba(255,240,210,.5))',
                  }}
                ></span>
                <span
                  style={{
                    position: 'absolute',
                    left: '2px',
                    top: '4px',
                    width: '10px',
                    height: '9px',
                    borderRadius: '1px',
                    background: '#F4F1EA',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: '1px',
                      top: '1px',
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: '3px',
                      fontWeight: '700',
                      color: '#26282B',
                      lineHeight: '1',
                    }}
                  >
                    SE-4962
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      left: '1px',
                      bottom: '1px',
                      width: '8px',
                      height: '3px',
                      background: 'repeating-linear-gradient(90deg,#26282B 0 .6px,transparent .6px 1.3px)',
                    }}
                  ></span>
                </span>
              </span>
              <span
                data-c="15"
                style={cssToObj(
                  `position:absolute;left:99px;bottom:72px;width:32px;height:23px;border-radius:1.5px;background:linear-gradient(160deg,#D9A866 0%,#C48A45 55%,#A9733A 100%);box-shadow:inset 0 0 0 .5px rgba(90,55,20,.45),inset 0 -2px 0 rgba(90,55,20,.2),0 2px 3px rgba(0,0,0,.35);transform-origin:50% 100%;animation:wtC15 12s infinite;display:${s(v.cDisp15)}`,
                )}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: '13px',
                    top: '0',
                    width: '5px',
                    height: '100%',
                    background: 'linear-gradient(90deg,rgba(255,240,210,.5),rgba(230,200,150,.75),rgba(255,240,210,.5))',
                  }}
                ></span>
                <span
                  style={{
                    position: 'absolute',
                    left: '2px',
                    top: '4px',
                    width: '10px',
                    height: '9px',
                    borderRadius: '1px',
                    background: '#F4F1EA',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: '1px',
                      top: '1px',
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: '3px',
                      fontWeight: '700',
                      color: '#26282B',
                      lineHeight: '1',
                    }}
                  >
                    SE-4962
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      left: '1px',
                      bottom: '1px',
                      width: '8px',
                      height: '3px',
                      background: 'repeating-linear-gradient(90deg,#26282B 0 .6px,transparent .6px 1.3px)',
                    }}
                  ></span>
                </span>
              </span>
              {'\n        '}
              <span
                style={cssToObj(
                  `position:absolute;left:-3px;right:-3px;bottom:-1px;height:${s(v.wrapH)}px;border-radius:2px;transform-origin:50% 100%;animation:wtWrap 12s infinite;overflow:hidden;background:linear-gradient(100deg,rgba(255,255,255,.08),rgba(255,255,255,.32) 18%,rgba(255,255,255,.06) 30%,rgba(255,255,255,.22) 52%,rgba(255,255,255,.05) 70%,rgba(255,255,255,.26) 88%,rgba(255,255,255,.06));box-shadow:inset 0 0 0 1px rgba(255,255,255,.25)`,
                )}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: '0',
                    right: '0',
                    top: '0',
                    height: '200%',
                    background: 'repeating-linear-gradient(170deg,rgba(255,255,255,.18) 0 2px,transparent 2px 10px)',
                    animation: 'wtSpiral 12s infinite',
                  }}
                ></span>
              </span>
              {'\n      '}
            </div>
            {'\n      '}
            <div style={{ position: 'absolute', left: '0', bottom: '0', width: '134px', height: '13px' }}>
              <span
                style={{
                  position: 'absolute',
                  left: '0',
                  right: '0',
                  top: '0',
                  height: '4px',
                  background: 'linear-gradient(180deg,#D9B784,#B88F55)',
                }}
              ></span>
              <span
                style={{
                  position: 'absolute',
                  left: '0',
                  right: '0',
                  top: '0',
                  height: '4px',
                  background: 'repeating-linear-gradient(90deg,transparent 0 30px,rgba(90,60,25,.6) 30px 32px)',
                }}
              ></span>
              <span style={{ position: 'absolute', left: '3px', top: '4px', width: '16px', height: '6px', background: '#8E6A3A' }}></span>
              <span style={{ position: 'absolute', left: '59px', top: '4px', width: '16px', height: '6px', background: '#8E6A3A' }}></span>
              <span style={{ position: 'absolute', right: '3px', top: '4px', width: '16px', height: '6px', background: '#8E6A3A' }}></span>
              <span
                style={{
                  position: 'absolute',
                  left: '0',
                  right: '0',
                  top: '9px',
                  height: '4px',
                  background: 'linear-gradient(180deg,#C9A16A,#9C7642)',
                }}
              ></span>
            </div>
            {'\n    '}
          </div>
          {'\n    '}
          <div
            style={{
              position: 'absolute',
              left: '206px',
              top: '68px',
              width: '330px',
              height: '150px',
              animation: 'wtTruck 12s infinite',
              animationTimingFunction: 'cubic-bezier(.2,.8,.2,1)',
            }}
          >
            {'\n      '}
            <span
              style={{
                position: 'absolute',
                left: '-40px',
                top: '20px',
                width: '200px',
                height: '100px',
                background: 'linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.18))',
                opacity: '0',
                animation: 'wtBlur 12s infinite',
              }}
            ></span>
            {'\n      '}
            <span
              style={{
                position: 'absolute',
                left: '10px',
                right: '10px',
                bottom: '-6px',
                height: '14px',
                borderRadius: '50%',
                background: 'radial-gradient(closest-side,rgba(0,0,0,.55),rgba(0,0,0,0))',
              }}
            ></span>
            {'\n      '}
            <div
              style={{
                position: 'absolute',
                left: '0',
                top: '0',
                width: '224px',
                height: '118px',
                borderRadius: '6px 4px 3px 3px',
                background: 'linear-gradient(180deg,#FFFFFF 0%,#F2F3F4 60%,#D5D8DC 100%)',
                boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.12),inset 0 -6px 0 rgba(0,0,0,.06)',
              }}
            >
              {'\n        '}
              <span
                style={{ position: 'absolute', left: '0', right: '0', top: '0', height: '3px', background: 'rgba(255,255,255,.9)' }}
              ></span>
              {'\n        '}
              <span style={{ position: 'absolute', left: '40px', top: '34px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '30px', height: '30px', borderRadius: '50%', overflow: 'hidden', boxShadow: '0 0 0 1.5px #F7C032' }}>
                  <img src="assets/se-logo.png" alt="" style={{ width: '100%', height: '100%', display: 'block' }} />
                </span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span
                    style={{
                      fontFamily: "'Space Grotesk',sans-serif",
                      fontWeight: '700',
                      fontSize: '12px',
                      letterSpacing: '.14em',
                      color: '#26282B',
                    }}
                  >
                    SAM ELECTRONICS
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '7px', letterSpacing: '.14em', color: '#3D3E3F' }}>
                    PARTS · WORLDWIDE
                  </span>
                </span>
              </span>
              {'\n        '}
              <span style={{ position: 'absolute', left: '0', right: '0', bottom: '16px', height: '5px', background: '#F7C032' }}></span>
              {'\n        '}
              <span style={{ position: 'absolute', left: '0', top: '0', bottom: '0', width: '30px', overflow: 'hidden' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: '0',
                    top: '0',
                    width: '15px',
                    height: '100%',
                    background: 'linear-gradient(90deg,#C9CCD0,#F2F3F4)',
                    boxShadow: 'inset -1px 0 0 rgba(0,0,0,.2)',
                    transformOrigin: '0 50%',
                    animation: 'wtDoorL 12s infinite',
                  }}
                ></span>
                <span
                  style={{
                    position: 'absolute',
                    left: '15px',
                    top: '0',
                    width: '15px',
                    height: '100%',
                    background: 'linear-gradient(90deg,#F2F3F4,#C9CCD0)',
                    transformOrigin: '100% 50%',
                    animation: 'wtDoorR 12s infinite',
                  }}
                ></span>
              </span>
              {'\n        '}
              <span
                style={{
                  position: 'absolute',
                  left: '-3px',
                  bottom: '22px',
                  width: '6px',
                  height: '14px',
                  borderRadius: '2px',
                  background: '#FFFFFF',
                  boxShadow: '0 0 14px 6px rgba(255,255,255,.85)',
                  opacity: '0',
                  animation: 'wtRev 12s infinite',
                }}
              ></span>
              {'\n        '}
              <span
                style={{
                  position: 'absolute',
                  left: '-2px',
                  bottom: '38px',
                  width: '4px',
                  height: '10px',
                  borderRadius: '2px',
                  background: '#E5484D',
                  opacity: '.9',
                }}
              ></span>
              {'\n      '}
            </div>
            {'\n      '}
            <div
              style={{
                position: 'absolute',
                left: '226px',
                top: '34px',
                width: '96px',
                height: '84px',
                borderRadius: '4px 22px 6px 4px',
                background: 'linear-gradient(180deg,#4A4D52,#3D3E3F 50%,#26282B)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,.18)',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: '24px',
                  top: '8px',
                  width: '58px',
                  height: '32px',
                  borderRadius: '3px 16px 3px 3px',
                  background: 'linear-gradient(150deg,#8FB6EE,#3A4A66)',
                  opacity: '.85',
                }}
              ></span>
              <span
                style={{
                  position: 'absolute',
                  right: '2px',
                  bottom: '16px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '2px',
                  background: '#FFF4D1',
                  boxShadow: '0 0 10px 4px rgba(255,244,209,.6)',
                }}
              ></span>
            </div>
            {'\n      '}
            <span
              style={{
                position: 'absolute',
                left: '30px',
                top: '104px',
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'radial-gradient(circle,#C9CCD0 22%,#5E6064 24%,#1F2022 30%,#2E3033 62%,#1F2022 64%)',
                boxShadow: '0 2px 3px rgba(0,0,0,.5)',
              }}
            >
              <span
                style={cssToObj(
                  `position:absolute;inset:0;border-radius:50%;background:repeating-conic-gradient(rgba(255,255,255,.18) 0 12deg,transparent 12deg 60deg);animation:wtWheel .5s linear infinite;animation-play-state:${s(v.wheelState)}`,
                )}
              ></span>
            </span>
            <span
              style={{
                position: 'absolute',
                left: '180px',
                top: '104px',
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'radial-gradient(circle,#C9CCD0 22%,#5E6064 24%,#1F2022 30%,#2E3033 62%,#1F2022 64%)',
                boxShadow: '0 2px 3px rgba(0,0,0,.5)',
              }}
            >
              <span
                style={cssToObj(
                  `position:absolute;inset:0;border-radius:50%;background:repeating-conic-gradient(rgba(255,255,255,.18) 0 12deg,transparent 12deg 60deg);animation:wtWheel .5s linear infinite;animation-play-state:${s(v.wheelState)}`,
                )}
              ></span>
            </span>
            <span
              style={{
                position: 'absolute',
                left: '270px',
                top: '104px',
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'radial-gradient(circle,#C9CCD0 22%,#5E6064 24%,#1F2022 30%,#2E3033 62%,#1F2022 64%)',
                boxShadow: '0 2px 3px rgba(0,0,0,.5)',
              }}
            >
              <span
                style={cssToObj(
                  `position:absolute;inset:0;border-radius:50%;background:repeating-conic-gradient(rgba(255,255,255,.18) 0 12deg,transparent 12deg 60deg);animation:wtWheel .5s linear infinite;animation-play-state:${s(v.wheelState)}`,
                )}
              ></span>
            </span>
            {'\n    '}
          </div>
          {'\n  '}
        </div>
      </div>
    </>
  );
}

const SEWholesaleTruck = createDC('SE Wholesale Truck', Logic, render);
export default SEWholesaleTruck;
