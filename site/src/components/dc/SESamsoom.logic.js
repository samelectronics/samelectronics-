// @ts-nocheck
/* eslint-disable */
// Logic class from design/project/SE Samsoom.dc.html, unchanged except for this header, the export
// and webpackIgnore on runtime imports. Converted 12 Oct 2026; maintained by hand since.
import React from 'react';
import { DCLogic, StreamableLogic } from '@/dc/runtime';

class Component extends DCLogic {
  // G8 moods. Original: idle think happy found low wave kiss celebrate sleep blink dabke.
  // Added: blush, thanks (blush + heart), spin, wink, yawn, type (writing), and the context emotes
  // clock, check (checklist), tool (screwdriver), tag (price tag), parcel, globe, part (holds a part up).
  renderVals() {
    const p = this.props, m0 = p.mood || 'idle', size = Number(p.size) || 200, k = size / 200, still = !!p.still;
    const ITEMS = { clock: 1, check: 1, tool: 1, tag: 1, parcel: 1, globe: 1, part: 1 };
    const item = ITEMS[m0] ? m0 : '';
    // the added moods reuse the original face parts: context emotes and blush/thanks/wink look happy
    const m = item || m0 === 'blush' || m0 === 'thanks' || m0 === 'wink' ? 'happy' : m0 === 'spin' ? 'happy' : m0 === 'yawn' ? 'sleep' : m0 === 'type' ? 'think' : m0;
    const lx = Math.max(-1, Math.min(1, Number(p.lookX) || 0)), ly = Math.max(-1, Math.min(1, Number(p.lookY) || 0));
    const A = (s) => (still ? 'none' : s);
    const arc = m === 'happy' || m === 'wave' || m === 'celebrate' || m === 'kiss' || m === 'dabke';
    const L = { idle: [24, -10], think: [-120, -10], happy: [24, -150], found: [24, -96], low: [36, 14], wave: [24, -150], kiss: [24, -118], celebrate: [150, -150], sleep: [44, -36], blink: [24, -10], dabke: [-38, -160] }[m] || [24, -10];
    if (item) { L[0] = 24; L[1] = -150; }
    if (m0 === 'blush' || m0 === 'thanks' || m0 === 'wink' || m0 === 'spin') { L[0] = 24; L[1] = -10; }
    if (m0 === 'yawn') { L[0] = 150; L[1] = -36; } // stretches one arm up while yawning
    if (m0 === 'type') { L[0] = -60; L[1] = 60; } // both hands forward, typing
    const hold = p.hold || (m0 === 'part' ? 'scr' : '');
    return {
      W: size, H: Math.round(size * 1.25), k: k.toFixed(4),
      bodyAnim: A(m0 === 'spin' ? 'smSpin 1.6s cubic-bezier(.45,0,.55,1) .2s 1 both' : m === 'dabke' ? 'smHop .9s cubic-bezier(.45,0,.55,1) infinite' : m === 'celebrate' ? 'smJump .9s cubic-bezier(.45,0,.55,1) infinite' : m === 'sleep' ? 'smBreath 4s ease-in-out infinite' : 'smBob 3.4s cubic-bezier(.45,0,.55,1) infinite'),
      tilt: (lx * 4 + (m === 'low' ? -6 : m === 'think' ? 4 : 0) + (m0 === 'blush' || m0 === 'thanks' ? -7 : m0 === 'wink' ? 5 : 0)).toFixed(1), antAnim: A('smAnt 3.6s infinite'),
      eyeX: (lx * 6).toFixed(1), eyeY: (ly * 4 + (m === 'think' ? -4 : 0) + (m0 === 'type' ? 8 : 0) + (p.raise ? -5 : 0)).toFixed(1), lookAnim: A(m === 'idle' ? 'smLook 7s cubic-bezier(.45,0,.55,1) infinite' : 'none'),
      eCaps: m === 'idle' || m === 'think' || m === 'low' || m === 'blink', eArc: arc, eRound: m === 'found', eLine: m === 'sleep',
      eHL: m === 'think' ? 18 : m === 'low' ? 22 : 28, eHR: m === 'think' ? 28 : m === 'low' ? 14 : 28, eTopL: m === 'think' ? 10 : m === 'low' ? 6 : 4, eTopR: m === 'low' ? 14 : 4,
      blinkAnim: A(m === 'blink' ? 'smSlowBlink 1.3s cubic-bezier(.45,0,.55,1) 1 both' : m === 'idle' || m === 'think' || m === 'low' ? 'smBlink 4.2s infinite' : 'none'), rArcO: m === 'kiss' || m0 === 'wink' ? 0 : 1, winkR: m === 'kiss' || m0 === 'wink',
      blush: m === 'kiss' || m === 'celebrate' || m === 'happy', mSmile: m === 'idle' || m === 'blink' || (arc && m0 !== 'yawn') || m === 'found', mW: m === 'idle' || m === 'blink' ? 18 : 26, mHh: m === 'idle' || m === 'blink' ? 8 : 12, mO: m === 'sleep', yawnO: m0 === 'yawn', mWavy: m === 'low', mDots: m === 'think' && m0 !== 'type',
      armLx: 36, armRx: 144, armLa: L[0], armRa: L[1],
      armLanim: A(m === 'celebrate' ? 'smWave .5s ease-in-out infinite' : m0 === 'type' ? 'smTap .3s ease-in-out infinite' : m === 'think' ? 'smTap .8s ease-in-out infinite' : 'none'),
      armRanim: A(m0 === 'type' ? 'smTap .3s .15s ease-in-out infinite' : item ? 'smShow 3s cubic-bezier(.2,.8,.2,1) 1 both' : m === 'wave' ? 'smWaveOnce 2.4s cubic-bezier(.45,0,.55,1) 1 both' : m === 'dabke' ? 'smWave .45s cubic-bezier(.45,0,.55,1) infinite' : m === 'kiss' ? 'smKissArm 1.8s cubic-bezier(.2,.8,.2,1) infinite' : m === 'celebrate' ? 'smWave .5s .25s ease-in-out infinite' : 'none'),
      tool: m === 'think' && m0 !== 'type', thumb: m === 'happy' && !item && m0 === 'happy', hanky: m === 'dabke', mag: m === 'found' && !p.hold, hasHold: !!hold, hold, holdRot: m === 'found' ? 160 : 180,
      hasItem: !!item && item !== 'part', item, itemRot: -L[1], itemAnim: A(item === 'clock' ? 'smTick 3s linear 1' : item === 'globe' ? 'smGlobe 1.5s linear infinite' : item === 'tool' ? 'smTwist .5s ease-in-out .4s 4 alternate' : 'none'),
      isClock: item === 'clock', isCheck: item === 'check', isTool: item === 'tool', isTag: item === 'tag', isParcel: item === 'parcel', isGlobe: item === 'globe',
      zzz: m === 'sleep', heart: m0 === 'kiss' || m0 === 'thanks', spark: m === 'found' || (!!item && !still), confetti: m === 'celebrate' && !still,
      conf: Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return { x: Math.round(Math.cos(a) * 70), y: Math.round(Math.sin(a) * 60 - 30), c: ['#F7C032', '#FFFFFF', '#3D3E3F', '#F7C032', '#E5484D', '#B87333'][i % 6], d: (i % 3) * 0.12 + 's' }; })
    };
  }
}

export default Component;
