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
