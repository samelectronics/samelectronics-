// @ts-nocheck
/**
 * G8 emote scheduler: one emote at a time. Every emote plays for exactly 3s, fully, and is never cut off;
 * between emotes Samsoom rests (idle: blinking, breathing, eyes following the cursor). Never the same
 * emote twice in a row, and the idle emotes come from a shuffled bag so he cycles through all of them.
 *
 *   const sch = createScheduler({ onMood: (m) => …, auto: true })
 *   sch.play('clock')   // requested emote: plays as soon as the current one ends (after a short breath)
 *   sch.base('think')   // what he shows while resting: 'idle' | 'think' | 'type' | 'blink'
 *   sch.stop()
 */
import { UNIVERSAL } from './brain';

export const EMOTE_MS = 3000;
export const REST_MS = 5000;
const BREATH_MS = 700; // gap before a requested emote, so two emotes never touch
/** If a context emote would repeat, show its sibling instead. */
const ALT = { clock: 'check', check: 'clock', parcel: 'globe', globe: 'parcel', tag: 'part', part: 'tag', wave: 'wink', happy: 'wink', thanks: 'blush', blush: 'kiss', tool: 'part' };

export function createScheduler({ onMood, auto = false, emotes = UNIVERSAL, rest = REST_MS }) {
  let cur = null, last = null, baseM = 'idle', queued = null, endAt = 0, t1 = 0, t2 = 0, bag = [], dead = false;
  const out = () => onMood(cur || baseM);
  const nextFromBag = () => {
    if (!bag.length) bag = emotes.slice().sort(() => Math.random() - 0.5);
    let i = bag.findIndex((e) => e !== last);
    if (i < 0) i = 0;
    return bag.splice(i, 1)[0];
  };
  const start = (m) => {
    if (dead) return;
    if (m === last) m = ALT[m] && ALT[m] !== last ? ALT[m] : null;
    if (!m) return idle();
    cur = last = m;
    endAt = Date.now() + EMOTE_MS;
    out();
    clearTimeout(t1);
    t1 = setTimeout(finish, EMOTE_MS);
  };
  const finish = () => {
    cur = null;
    out();
    if (queued) {
      const q = queued;
      queued = null;
      clearTimeout(t2);
      t2 = setTimeout(() => start(q), BREATH_MS);
    } else idle();
  };
  const idle = () => {
    clearTimeout(t2);
    if (auto && !dead) t2 = setTimeout(() => (baseM === 'idle' && !cur ? start(nextFromBag()) : idle()), rest);
  };
  idle();
  return {
    play(m) {
      if (!m || dead) return;
      if (cur) queued = m; // never cut the current emote off
      else {
        clearTimeout(t2);
        start(m);
      }
    },
    base(m) {
      baseM = m || 'idle';
      if (!cur) out();
    },
    /** The next emote from the shuffled bag (for callers that time emotes themselves). */
    next: nextFromBag,
    busy: () => !!cur || Date.now() < endAt,
    setAuto(a) {
      auto = a;
      if (!a) clearTimeout(t2);
      else if (!cur) idle();
    },
    stop() {
      dead = true;
      clearTimeout(t1);
      clearTimeout(t2);
    },
  };
}
