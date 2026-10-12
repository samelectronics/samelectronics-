// GENERATED from design/project/SE Launcher.dc.html by scripts/dc-codegen.mjs. Do not edit by hand: change the generator
// (or detach this file from the generator's COMPONENTS list before hand-editing it).
'use client';
import React from 'react';
import { type Vals, createDC, cssToObj, cx, s, t } from '@/dc/runtime';
import Logic from './SELauncher.logic.js';
import SESamsoom from './SESamsoom';

function render(v: Vals) {
  return (
    <>
      <div ref={v.rootRef} style={{ position: 'fixed', right: '24px', bottom: '24px', zIndex: '70' }}>
        {'\n  '}
        <button
          onClick={v.click}
          onMouseEnter={v.poke}
          aria-label="Ask Samsoom"
          style={cssToObj(
            `position:relative;display:block;height:56px;width:${s(v.w)}px;padding:0;border:none;border-radius:28px;background:linear-gradient(180deg,#3D3E3F,#26282B);box-shadow:inset 0 1px 0 rgba(255,255,255,.18),0 0 0 1.5px #F7C032,0 12px 30px rgba(26,27,29,.35);cursor:pointer;transition:width .3s cubic-bezier(.2,.8,.2,1),transform .25s cubic-bezier(.2,.8,.2,1)`,
          )}
          className={cx(undefined, 'scp-b08bac3b')}
        >
          {'\n    '}
          <span
            style={{
              position: 'absolute',
              left: '4px',
              top: '4px',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 40% 30%,#FFE58F,#F7C032 65%,#E0A61E)',
              overflow: 'hidden',
            }}
          >
            {'\n      '}
            <span style={{ position: 'absolute', left: '5px', top: '3px', width: '38px', height: '48px' }}>
              <SESamsoom mood={v.mood} still={v.still} lookX={v.lx} lookY={v.ly} size={38} />
            </span>
            {'\n    '}
          </span>
          {'\n    '}
          <span
            style={cssToObj(
              `position:absolute;left:60px;right:18px;top:0;height:56px;display:flex;align-items:center;justify-content:${s(v.jc)};overflow:hidden;opacity:${s(v.txtO)};transition:opacity .25s;-webkit-mask-image:${s(v.mask)};mask-image:${s(v.mask)}`,
            )}
          >
            {'\n      '}
            <span
              key={v.mi}
              ref={v.txtRef}
              style={cssToObj(
                `display:inline-block;flex:none;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:15px;color:#FFFFFF;white-space:nowrap;padding:0 ${s(v.padR)}px 0 ${s(v.padL)}px;--tx:${s(v.tx)}px;animation:${s(v.tick)}`,
              )}
            >
              {t(v.msg)}
            </span>
            {'\n    '}
          </span>
          {'\n  '}
        </button>
        {'\n  '}
        <span
          aria-hidden="true"
          style={cssToObj(
            `position:absolute;left:40px;top:6px;width:10px;height:10px;border-radius:50%;background:#5FD49A;box-shadow:0 0 0 2px #26282B;animation:${s(v.dotAnim)};pointer-events:none`,
          )}
        ></span>
      </div>
    </>
  );
}

const SELauncher = createDC('SE Launcher', Logic, render);
export default SELauncher;
