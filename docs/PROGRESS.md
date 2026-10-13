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

Step 1 deployed to production on Vercel: commit `8385538`, "Deployment has completed".

---

## Step 2 · G9 Arabic (13 Oct)

### What changed

**One translations file:** `site/src/i18n/ar.ts`.
- English → Arabic for every text on the home page, about 900 entries. They were collected from the live page (every section, the reel's full cycle, the overlays, the chat) and from every string in the components and logic code.
- Patterns cover texts with numbers: stock counts, prices, countdowns, the opening-hours states, product names ("iPhone 15 Pro Screen" → "شاشة iPhone 15 Pro"), step counters.
- Texts joined with " · " are translated piece by piece.
- Brand names, model names, part codes (SE-4544), units and handles stay in Latin, as UAE shops write them.
- The file is marked `REVIEW_STATUS = 'Arabic: to be reviewed by the owner'`.

**The switch** (nav and footer, `site/src/i18n/lang.ts`).
- Pressing عربي translates ALL text: headings, buttons, labels, the hero reel, the iPad, toasts, the chat, the footer and every pop-up.
- Placeholders, titles and aria-labels are translated too.
- Live text (clocks, reels, live board, chat) keeps being translated as it updates.
- EN restores the original English exactly (checked: identical text before and after a round trip).
- The choice is saved and applied before the first paint, so there is no flash of English.

**Right to left.**
- `<html dir="rtl" lang="ar">`: flex rows, alignment and arrows (the 37 arrow icons and the chevrons) mirror.
- Times, phone numbers, prices and codes keep their own left-to-right order inside Arabic (Unicode isolates). Without them the hours read "22:00-16:00 · 14:00-10:30".
- Decorative glows that stick out past the page edge used to shift the whole page 144px in RTL; the page root now clips them.

**Font.**
- IBM Plex Sans Arabic, self-hosted (Arabic subset, 4 weights, SIL OFL).
- It is attached to every design family (Space Grotesk, Inter, JetBrains Mono) for Arabic characters only. Arabic therefore appears at the same sizes and weights as the English, and Latin keeps its own font.
- Letter-spacing is 0 in the Arabic view, because spaced Arabic letters don't join. Brand wordmarks keep theirs.

**Canvas and map.**
- Text drawn on canvases goes through the same dictionary.
- The world-map iframe labels follow the page's language and update on switch.

**Coverage check:** `site/scripts/qa/i18n-check.mjs` loads the page in Arabic, sweeps every section and the overlays, and lists any English left on screen.
- Result: 0 untranslated texts.
- 16 allowed Latin items remain: brand-logo labels, a code-style board address, one false positive.

### DONE WHEN (G9)

| Item | Result |
|---|---|
| The switch works | Yes |
| ALL text in Arabic | Yes (coverage check) |
| IBM Plex Sans Arabic at the same sizes and spacing | Yes |
| Mirrored right-to-left layout | Yes for flow layouts and arrows. The hero's device composition and the teardown stage are absolute-positioned scenes, so they keep their placement; the text inside them is right-aligned. |
| Readable numbers and prices | Yes |
| Remembered | Yes |
| One translations file, marked for owner review | Yes |

### Not finished in this step

- **Letter-by-letter canvas text:** the teardown ad draws some titles one letter at a time, so those letters stay Latin. That ad is rebuilt in Step 7, with its Arabic.
- **Chat answers:** Samsoom's answers are matched from English keywords. Questions typed in Arabic are handled in Step 5 (G8: answers in the language of the question).
- **Arabic brand name:** the dictionary uses "سام للإلكترونيات" for Sam Electronics. The facts say to copy the exact Arabic spelling from the logo file, so this is TO CONFIRM by the owner.

**Live:** https://samelectronics.vercel.app (press عربي in the nav)

Step 2 deployed to production: `1cb859e`.

---

## Step 3 · G18 brand logos + G19 scrollbars (13 Oct)

### What changed

**Real logo files for all 14 brands** (`site/public/assets/brands/*.svg`, built by `site/scripts/brands/build-logos.mjs`).
- One layout for every file, so all brands share the same visual height and line up: the symbol (when the brand has one) at full height, then the wordmark.
- **Official artwork (Simple Icons / gilbarbara logos, CC0):**
  - Samsung, OPPO, vivo, HONOR, SONY: official wordmarks.
  - Google: official wordmark.
  - Apple: symbol. Xiaomi: Mi symbol. Huawei: flower.
- **TO CONFIRM (no official SVG could be obtained):** Redmi, POCO, realme, TECNO, Infinix, and the name wordmarks next to the Apple, Xiaomi and Huawei symbols. For these the build uses the cleanest available wordmark: the name outlined in the typeface closest to the brand's own wordmark (SIL OFL fonts), never our site font.
- `public/assets/brands/SOURCES.md` lists each file's source and status. To swap in an owner-supplied official SVG, replace that brand's entry in the build script.

**One shared component everywhere** (`SE Brand Logo`): hero brand rail, Find My Part (panel and nav menu), Model File, repair estimator.
- New: the teardown part card's "FITS Apple · Samsung · Xiaomi · +11" line now shows the brand logos.
- The component no longer falls back to typed names, because every file exists. Before this step the 14 files were missing (404s) and typed stand-ins were shown.

**Footer line (G18):** "Brand names and logos belong to their owners and are used only to show compatibility." In Arabic too.

**Scrollbars (G19):** site-wide thin rounded track with a graphite thumb that glows yellow on hover. Firefox gets the thin graphite version, since it can't style a hover state.

**Arrows on horizontal lists (G19):**
- Small round graphite arrows that turn yellow on hover, appear only when there is more to scroll that way, and work right-to-left.
- Added to the Model File brand chips and the Find My Part series tabs. The Model File model row already had arrows.

### DONE WHEN

| Item | Result |
|---|---|
| Every brand shows a real logo, same visual height, aligned | Yes (9 official sources, 5 + 3 wordmarks TO CONFIRM as allowed by G18) |
| One shared component everywhere brands appear | Yes |
| Footer trademark line | Yes |
| Custom scrollbars site-wide, yellow glow on hover | Yes |
| Arrow buttons on horizontal lists | Yes |

**Brand-logo 404s in the console:** 14 → 0.

### Not finished

- Official SVGs for Redmi, POCO, realme, TECNO and Infinix, and for the Apple, Xiaomi and Huawei name wordmarks. The owner should supply them, or confirm the stand-ins.
- The Find My Part brand step's own scrollbar and arrows are part of Issue 18 (Step 24).

**Live:** https://samelectronics.vercel.app

Step 3 deployed to production: `b8e93d8`.

---

## Step 4 · G7 hours pill (13 Oct)

### What changed

**Hover pop-over** on the nav status pill: a small glass card showing:
- the live status ("Closed · opens tomorrow 10:30") with its pulsing dot;
- a live countdown ("Opens in 10h 54m" / "Closes in 3h 12m");
- the branch ("Al Murar, Deira · Dubai time");
- the weekly hours, Saturday to Friday, with today highlighted in yellow and Sunday "Closed".

The countdown handles:
- the split shift (break 14:00–16:00);
- the short Friday (break 12:00–16:00);
- the closed Sunday.

The card opens on hover and on keyboard focus, entering with opacity and a 6px rise only (G16). It works in Arabic: translated, the countdown reads "يفتح خلال 10س 54د", and the card is anchored so it stays on screen in right-to-left.

**Click** on the pill scrolls to the Visit us / hours section (checked: the section lands right under the nav).

**Pulsing dots everywhere:**
- The footer and menu-drawer status dots stopped pulsing when the shop was closed; they now use the same ping as the nav pill, Story branch card and Visit card.
- All three states (open, closing soon, closed) pulse identically.

### DONE WHEN (G7)

| Item | Result |
|---|---|
| Green / amber / red, never grey | Yes |
| All states pulse the same way, everywhere | Yes |
| Hover shows weekly hours (today highlighted), branch, live status + countdown | Yes |
| Click goes to the Visit / hours section | Yes |

**Live:** https://samelectronics.vercel.app

---

## Step 5 · G8 Samsoom

Step 4's deploy was confirmed: Vercel reported success for `c62f207`.

**Brain (Claude API + fallback)**
- A new server route, `site/src/app/api/samsoom/route.ts`, uses the Claude API.
  - The model is `claude-opus-5-5` at low effort, so chat answers come back quickly.
  - Samsoom's only knowledge is the whole Company Facts file, with each item's status.
  - He gives short, friendly answers in the language of the question.
  - He never invents prices, stock or policies.
  - For TO CONFIRM items he says the team will confirm and offers WhatsApp.
  - He can add one button that goes to a place on the site (Visit, Repair, Wholesale, Find My Part, WhatsApp, and so on).
- **No key yet:** while `ANTHROPIC_API_KEY` is not set in Vercel, the route replies `{fallback:true}` and the page answers with the fuzzy brain in `site/src/components/samsoom/brain.js`. Adding the key in Vercel turns Claude on; no code change is needed. The fuzzy brain also answers if the API fails or refuses.
- **The fuzzy brain is typo tolerant.** These were all tested: "helo", "are u opne now", "my scren is brokn", "do u shiip", "thnks", "whatsap number", "warrenty".
  - It covers greetings, hours, location, brands, grades, shipping, repairs, trade prices, prices, warranty, stock, contact, thanks and goodbye.
  - It works in English and Arabic ("وين المحل", "بكم الشاشة", "مرحبا") and answers in the language of the question.
- **Model + part questions** (e.g. "iphone 13 screen") still use the in-stock lookup on the sample catalogue, because Claude doesn't know that catalogue.

**Emote scheduler (`site/src/components/samsoom/scheduler.js`)**
- One emote at a time, exactly 3s each, never cut off; then about 5s of rest (blinking, breathing, eyes following the cursor).
- Never the same emote twice in a row.
- Idle emotes come from a shuffled bag, so he goes through all of them.
- **Measured on the launcher over 36s:** every emote lasted 3.0s and every rest 5.0s. The sequence was wave → kiss → wave → blush → wave, with no repeats.
- **New emotes:**
  - universal: blush, small spin, wink, sleepy yawn (wave, dabke, kiss and thumbs-up already existed);
  - context:
    - clock (asking if the shop is open now);
    - checklist (the weekly hours, warranty);
    - screwdriver (repairs);
    - price tag (prices, trade);
    - parcel or spinning globe (shipping; the globe when a country is named);
    - holds up a part (stock, brands, grades);
    - blush with a heart (thanks);
    - wave (greetings).

**Launcher pill**
- Its width still fits the message exactly.
- The 16s cycle goes:
  1. wave (3s, as a circle);
  2. "Ask Samsoom";
  3. collapses and blinks;
  4. a page or time message while he plays the next emote from the bag;
  5. collapses.
- After 3 ignored cycles he yawns once and rests. A hover or click wakes him.

**Chat**
- **Fixing the lag:** typing used to re-render the whole home page on every key. The chat now keeps its own input, so typing 15 characters caused no long tasks at all.
- **While the answer is coming:** he thinks (the dots show).
- **When the answer lands:**
  - it is written out on screen with a "typing" pose;
  - then he plays the answer's context emote;
  - the answer's button appears once the writing finishes.
- The chat opens with a wave.
- Typed text and answers keep their own language (they are not run through the translator); they use `dir="auto"` so Arabic reads right to left.

**Arabic:** the added strings are in `ar.ts`. The coverage check found two untranslated arrow labels from Step 3 ("Scroll back" / "Scroll forward"); both are now translated.

### DONE WHEN (G8)

| Item | Result |
|---|---|
| Pill width fits the message; cycle every 15–20s; rests after ignored cycles | Yes (16s cycle) |
| Emotes 3s each, never cut off, ~5s rests, no back-to-back repeats, all cycled | Yes (measured) |
| Universal + context emotes | Yes (all 14 new poses checked in screenshots) |
| Alive in the chat: thinking → typing → emote; smooth open and typing | Yes |
| Understands anything, typos, both languages; Claude route + fallback | Yes for the fallback. Claude switches on when the key is added. |

**Not finished:** Claude's answers haven't been seen live yet, because no API key exists yet. The route was tested with no key (it replies `{fallback:true}`).

**Live:** https://samelectronics.vercel.app
