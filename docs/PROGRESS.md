# Progress: Round 4 · Director's Edition (13 October) in code

Spec: `docs/Round4_Directors_Edition.pdf` (56 pages). Steps follow the owner's order of 13 October.
Each step is one or more commits on `feat/nextjs-site`, merged into `main` (live on Vercel).

- **Live site:** https://samelectronics.vercel.app
- **Branch preview:** https://samelectronics-git-feat-nextjs-site-sam-electronics.vercel.app

**How things are checked.** After every step:
- `next build` and the TypeScript check pass;
- `scripts/qa/measure.mjs` takes 1440×900 screenshots and fps, long-task and WebGL numbers per section;
- each DONE WHEN item in the PDF is answered.

Performance numbers come from headless Chromium with software WebGL on a CPU-only build machine. They are far lower than on a laptop with a GPU, so compare them only with each other.

---

## Step 0 · Preparation (13 Oct)

- The components converted from the design on 12 October are now maintained by hand. The converter is archived in `site/scripts/archive/` so it can never overwrite the work below.
- Added `site/scripts/qa/measure.mjs`. Per section it records:
  - median and average fps;
  - p95 frame time;
  - long tasks;
  - live WebGL contexts;
  - optional screenshots.

### Baseline (before Step 1), 1440×900

**Whole page:** load 8.4s · main-thread blocking during load 13.8s · 6 WebGL contexts created, 5 live on every section.

| Section | fps (median) | p95 frame | long tasks |
|---|---|---|---|
| Hero | 3.3 | 2633ms | 20 (25.7s) |
| Teardown | 0.8 | 1317ms | 16 (17.8s) |
| What we offer | 2.1 | 1683ms | 18 (11.5s) |
| Live Board | 29.9 | 67ms | 8 |
| Bench Test | 30 | 67ms | 6 |
| Model File | 3.5 | 433ms | 26 (7.7s) |
| Deals | 30 | 67ms | 0 |
| Repair Lab | 59.9 | 33ms | 0 |
| Wholesale | 59.9 | 33ms | 0 |
| Worldwide | 59.9 | 50ms | 0 |
| Story | 59.9 | 33ms | 0 |
| Team | 59.9 | 50ms | 1 |
| Open to everyone | 30 | 50ms | 0 |
| Sam Circuit | 29.9 | 67ms | 0 |
| Samsoom | 30 | 67ms | 0 |
| Social | 59.9 | 33ms | 0 |
| Request + Visit | 10 | 200ms | 41 (4.5s) |
| Finale | 4.3 | 283ms | 30 (7.1s) |
| Footer | 59.9 | 17ms | 0 |

Console errors at baseline:
- 14 × missing `assets/brands/*.svg` (Step 3);
- 5 × external services blocked on the build machine;
- 2 × invalid URL (to check in the final step).

---

## Step 1 · G16 Performance (13 Oct)

### What changed (no effect removed; the look is the same)

**Parts library rendered once.**
- The 10 part renders (large 640px + thumb 192px, about 250KB in total) are made once by `scripts/qa/render-parts.mjs` with the same builder and shipped in `public/parts/`.
- `se-parts-lib.js` returns those files at once. The in-browser build is kept only as the fallback.
- Visitors no longer spend a WebGL context or ~1 minute of first-load work on the library.

**At most 2 live WebGL contexts** (`src/dc/gl-budget.ts`).
- The teardown keeps its context; it already idles off-screen.
- The What we offer 3D shelf, the Model File turntable and the Finale scene mount only when within one viewport. They release their context (really lost, not just disposed) when further than 1.6 viewports, or when a nearer scene needs the slot.
- On return they are rebuilt on a fresh canvas. While the shelf is away, its cached part pictures stand in.
- One renderer shared between the two engines (se-teardown-3d / se-3d) would mean merging them; the budget gives the same result (≤2 contexts) without touching the approved scenes.

**Pause off-screen.**
- Every CSS animation in a section more than one viewport away is paused, and resumes from the same frame (`OffscreenPause` + one CSS rule).
- The What we offer frame loop skips work while its section is off-screen.
- The teardown and se-3d loops already skipped rendering off-screen.
- The hero is left running: its reel shares a JS clock with its CSS timeline, and Step 6 rebuilds it.

**Transform/opacity.**
- The hero search glow (an animated 70px box-shadow over a 620px bar, repainted every frame) is now a pre-drawn glow layer animating its opacity, same timing.
- The other 42 looping non-composited animations are small elements (2px lines, status dots, chips). They are paused off-screen now and converted when their section is rebuilt in its step.

**Particles.**
- `public/se-perf.js` watches the frame rate.
- The teardown dust (190 specks + bokeh) and the What we offer dust draw fewer specks (down to 40%) while fps stays under 50, and return to full density when it is smooth.

**Teardown render density.**
- Capped at 2× device pixels (was 3× on desktop; no visible difference at desktop sizes).
- Steps down to 1.25× only while the frame rate stays low.

### Measured, same machine, 1440×900

| | Before | After |
|---|---|---|
| Main-thread blocking during load | 13.8s | 7.2–7.7s |
| WebGL contexts created / live | 6 / 5 | 4 / ≤2 |
| Live Board fps | 29.9 | 30–59.5 |
| Bench Test fps | 30 | 59.9 |
| Team fps | 59.9 | 59.9 |
| Repair, Wholesale, Worldwide, Story, Social, footer | 59.9 | 59.9 |

**3D sections.** The hero, teardown, What we offer, Model File, Visit (next to the Finale) and Finale stay at 1–12 fps on this machine. That is software WebGL drawing the teardown in about 1s per frame.

**Without 3D.** Measured with the 3D engines blocked, every one of those sections runs at 60fps (hero 30fps), with under 1s of load blocking. So the page itself is smooth; the 3D cost belongs to the GPU, which this machine doesn't have. **Please check the 3D sections' smoothness on a real laptop.**

### Not finished in this step

- The other 42 looping animations still animate colour, shadows or dash offsets. They're paused off-screen and get converted when each section is rebuilt.
- The hero's own animations are not paused off-screen yet (Step 6).
- Fonts still load from Google Fonts with preconnect, not preloaded files.

**Live:** https://samelectronics.vercel.app
