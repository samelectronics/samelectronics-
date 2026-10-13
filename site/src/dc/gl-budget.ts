/**
 * G16 WebGL budget: never more than MAX_LIVE WebGL contexts at once.
 *
 * The teardown keeps its context for the whole visit (it is the main scene and already idles when
 * off-screen). Every other 3D scene registers here: it is mounted only while it is near the viewport,
 * and disposed (its context really released) when it is far away or when a nearer scene needs the slot.
 * Remounting builds the same scene again, so what the visitor sees does not change.
 */

type Scene = {
  id: string;
  /** Element whose position decides when the scene is needed. */
  el: () => Element | null;
  /** Build the scene; resolves to its disposer. */
  mount: () => Promise<(() => void) | void>;
  /** Called after the scene was disposed (e.g. show a still image, reset state). */
  afterDispose?: () => void;
  /** Contexts this scene keeps for the whole visit (not managed). */
  fixed?: boolean;
  state: 'idle' | 'mounting' | 'live';
  dispose: (() => void) | null;
};

const MAX_LIVE = 2;
const NEAR = 1.0; // mount when within 1 viewport height
const FAR = 1.6; // dispose when further than 1.6 viewport heights

const scenes = new Map<string, Scene>();
let queued = false;
let started = false;

/** Release every WebGL context on canvases inside `root` (renderer.dispose() alone keeps it alive). */
export function loseContexts(root: Element | null) {
  if (!root) return;
  root.querySelectorAll('canvas').forEach((c) => {
    for (const type of ['webgl2', 'webgl'] as const) {
      try {
        const gl = (c as HTMLCanvasElement).getContext(type) as WebGLRenderingContext | null;
        if (gl && !gl.isContextLost()) gl.getExtension('WEBGL_lose_context')?.loseContext();
        if (gl) break;
      } catch {
        /* canvas has a 2D context */
      }
    }
  });
}

function distance(el: Element | null) {
  if (!el) return Infinity;
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight || 900;
  if (r.width === 0 && r.height === 0) return Infinity;
  if (r.bottom < 0) return -r.bottom / vh;
  if (r.top > vh) return (r.top - vh) / vh;
  return 0;
}

async function mountScene(s: Scene) {
  s.state = 'mounting';
  try {
    const d = await s.mount();
    s.dispose = typeof d === 'function' ? d : null;
    s.state = 'live';
  } catch (e) {
    console.warn('[gl-budget] mount failed: ' + s.id, e);
    s.state = 'idle';
  }
  schedule();
}

function disposeScene(s: Scene) {
  try {
    s.dispose && s.dispose();
  } catch (e) {
    console.warn('[gl-budget] dispose failed: ' + s.id, e);
  }
  s.dispose = null;
  s.state = 'idle';
  try {
    s.afterDispose && s.afterDispose();
  } catch {
    /* ignore */
  }
}

function update() {
  queued = false;
  const all = [...scenes.values()];
  const fixedLive = all.filter((s) => s.fixed).length;
  const slots = Math.max(0, MAX_LIVE - fixedLive);
  const managed = all.filter((s) => !s.fixed).map((s) => ({ s, d: distance(s.el()) }));
  const wanted = managed
    .filter((x) => x.d <= NEAR)
    .sort((a, b) => a.d - b.d)
    .slice(0, slots)
    .map((x) => x.s);
  // free slots first: anything far away, or not wanted while a wanted scene waits
  const waiting = wanted.some((s) => s.state === 'idle');
  for (const { s, d } of managed) {
    if (s.state !== 'live') continue;
    if (d > FAR || (waiting && !wanted.includes(s))) disposeScene(s);
  }
  const busy = managed.filter((x) => x.s.state !== 'idle').length;
  let free = slots - busy;
  for (const s of wanted) if (s.state === 'idle' && free > 0) (free--, mountScene(s));
}

function schedule() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(update);
}

function start() {
  if (started) return;
  started = true;
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  setInterval(schedule, 1000);
}

/** Register a 3D scene. Returns an unregister function (disposes the scene if live). */
export function registerScene(opts: Omit<Scene, 'state' | 'dispose'>) {
  start();
  const s: Scene = { ...opts, state: opts.fixed ? 'live' : 'idle', dispose: null };
  scenes.set(s.id, s);
  schedule();
  return () => {
    scenes.delete(s.id);
    if (s.state === 'live' && !s.fixed) disposeScene(s);
  };
}

/**
 * A throwaway 3D stage inside `parent`: a full-size layer with its own canvas, placed over the original
 * canvas (which is hidden while the stage exists). Each mount gets a fresh canvas because a released
 * WebGL context cannot be reused.
 */
export function freshStage(parent: HTMLElement) {
  const orig = parent.querySelector(':scope > canvas') as HTMLCanvasElement | null;
  const layer = document.createElement('div');
  layer.style.cssText = 'position:absolute;inset:0;pointer-events:none';
  const cv = document.createElement('canvas');
  cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
  layer.appendChild(cv);
  if (orig) {
    orig.style.visibility = 'hidden';
    orig.after(layer);
  } else parent.prepend(layer);
  return {
    host: layer,
    remove() {
      loseContexts(layer);
      layer.remove();
      if (orig) orig.style.visibility = '';
    },
  };
}
