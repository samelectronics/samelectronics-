// Converted from design/project/SE Brand Logo.dc.html (12 Oct 2026); maintained by hand since.
'use client';
import React from 'react';
import { type Vals, createDC, cssToObj, s, t } from '@/dc/runtime';
import Logic from './SEBrandLogo.logic.js';

function render(v: Vals) {
  return (
    <>
      {v.hasLogo ? (
        <>
          <span
            role="img"
            aria-label={v.label}
            style={cssToObj(
              `display:inline-block;flex:none;height:${s(v.boxH)}px;width:${s(v.logoW)}px;background:${s(v.color)};-webkit-mask:${s(v.mask)};mask:${s(v.mask)};transition:background .25s`,
            )}
          ></span>
        </>
      ) : null}
      {v.noLogo ? (
        <>
          <span
            role="img"
            aria-label={v.label}
            style={cssToObj(`position:relative;display:inline-block;height:${s(v.boxH)}px;flex:none;white-space:nowrap;overflow:visible`)}
          >
            <span
              style={cssToObj(
                `display:block;font-family:${s(v.wm?.f)};font-weight:${s(v.wm?.w)};font-style:${s(v.wm?.st)};font-size:${s(v.wm?.fs)}px;letter-spacing:${s(v.wm?.ls)};line-height:${s(v.boxH)}px;transform:translateY(${s(v.wm?.dy)}px);color:${s(v.color)};transition:color .25s`,
              )}
            >
              {t(v.wm?.t)}
            </span>
          </span>
        </>
      ) : null}
    </>
  );
}

const SEBrandLogo = createDC('SE Brand Logo', Logic, render);
export default SEBrandLogo;
