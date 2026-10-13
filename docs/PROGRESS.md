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

---

## Step 6 · Issue 1B hero

Step 5's deploy was confirmed: Vercel reported success for `5d83c71`.

**What was wrong, and what changed**

**Products tilted, not centred**
- Every product sat inside a hidden `rotate(-10deg)` layer, and the float added ±2° of rotation. Both are removed.
- Library renders that lean in their picture (battery about 9°, board 8°, cameras 6°) are measured once from their outline and turned upright.
- Products now stand straight and centred on the product box, and only float by ±3px. The phone body keeps its approved tilt.

**Description almost touched the button**
- The description moved up to about 73% of the screen height. There is now a clear gap of 3.5% of the height before the button, which stays at 84%.

**Progress line followed time**
- It is now step-based: one segment per ad (10). Finished ads stay filled, the current one is highlighted, and it resets with the loop. It sits under the island, as before.

**Ads of different lengths, glitches, cards that differ between loops**
- All reel animations now run on one master clock, re-synced every 1.6s, so no card can drift.
- Every ad is exactly 3.2s on a 32s loop.

**Colours repeated**
- The fixed order is yellow → white → graphite ×3, then white. No two neighbouring ads share a colour, and the loop back to the first yellow never repeats.

**Home bar**
- An iPhone home bar sits at the bottom of every card: 35% wide, translucent crystal grey.

**Dead glass**
- A soft vertical band of light now sweeps across the whole phone screen every 6s.
- The iPad has the same sweep, 3s offset, so the two never shine together.
- The existing glossy reflection stays.

**Couldn't pause or browse**
- Hovering the phone pauses the reel. It waits for a card to finish entering, so it never freezes half-way.
- Two round graphite arrows with a yellow outline appear beside the screen.
- Up/down arrows, the mouse wheel over the phone and a swipe on touch all go to the previous or next ad with the same feed scroll-in.
- Mouse out resumes the reel.

**Ad poster**
- Clicking the phone opens a pop-up poster of the current ad, in that ad's colours and type. It has:
  - the big headline;
  - a short paragraph;
  - 3 key points;
  - the stock line (sample data);
  - "Shop [part]" and "Ask on WhatsApp" buttons;
  - the product with its circular glow.
- The worldwide poster uses the live globe; the wholesale poster uses stacked cartons.
- The page behind dims and blurs. X, Esc and a click outside all close it.

**Search bar didn't work**
- The bar is now a real search, and the animated typing suggestions stay while it is empty.
- Typing a model shows suggestions from our model list, tolerant of typos ("iphon 13", "galxy a54"). Part words such as "screen" or "battery" are understood.
- Enter or a click opens the **G17 "Coming soon"** card: "The full [model] page is coming soon. Use Find My Part in the meantime." Its button opens Find My Part on that model (and on the part, if one was typed). Ctrl K focuses the bar.

**Ticks**
- The three ticks light up one after the other: each fills yellow with a soft glow and its text brightens for about 0.8s. Then a pause, and the loop repeats.

**The iPad cart item flew into the Samsoom chat**
- The chat panel covers the iPad's right column, and the flying copy was drawn above the chat. It is now drawn under the chat and launcher layers, so it always lands visibly on the iPad's own cart icon.
- It also uses page coordinates, so it no longer misses when the page scrolls during the flight.

**iPad lag while scrolling**
- The iPad screen is now an isolated layer (`contain: layout paint`), and the auto-scrolling grid is promoted to its own layer.

**New G17 parts, used from now on**
- A shared "Coming soon" card (`site/src/components/g17/ComingSoon.tsx`, called with `comingSoon({...})` or the `se:soon` event).
- A branded 404 page in English and Arabic: "Signal lost. This page switched to airplane mode.", with a button home. Unknown URLs return status 404.

**Kept as approved:**
- the island pill, no status bar;
- the screen card's glossy glass with its flex tail and gliding reflection;
- the dot-matrix globe: 22 countries, routes from Dubai, starting with the UAE facing the camera, one turn every 24s;
- the cartons landing on the pallet;
- the repair crack, heal and boot;
- the circular glows and shadows;
- the same headline size on every card (no shrinking);
- the card motion timings;
- the iPad layout.

**Arabic:** 53 new strings were added, including the poster texts, the Coming soon card, search, arrows and the 404. The coverage check is back to the 16 allowed brand labels.

**Performance:** the sweep and the ticks first cost about 4fps on this software renderer. Both now animate only opacity or transform on pre-drawn layers. In an A/B test against the Step 5 build on the same machine (3D blocked, 9 runs each), the hero averages 25.4 vs 26.6 fps, which is within noise.

### DONE WHEN (Issue 1B)

| Item | Result |
|---|---|
| Device: pill, no status bar, progress line, glass reflection | Yes |
| All cards use the template: same positions and sizes | Yes |
| Every product fits the product box, centred, with circular glow and shadow | Yes |
| Screen card: glossy glass, gliding reflection, flex tail | Yes (kept) |
| Globe: real, rotating, continents, route arcs | Yes (kept: dot-matrix, 22 countries) |
| Wholesale: cartons stacking on a pallet | Yes (kept) |
| Repair: same size; crack, heal, boot | Yes (kept) |
| All headlines the same size | Yes |
| The iPad uses library renders, centred, same size | Yes (kept) |
| The reel loops identically | Yes (one master clock) |
| Products straight and centred; gap before the button; home bar | Yes |
| Step-based segmented progress; every ad 3.2s; fixed colour order | Yes |
| Feed scroll between ads; pause on hover with arrows; poster opens and closes | Yes |
| Crystal glass with the light sweep on phone and iPad | Yes |
| Search works → Coming soon; ticks loop; cart flight always lands on the iPad | Yes |

**Reading I chose:** the PDF allows up to ±2° of rotation while a product floats, but the owner's review says the products look tilted. I removed the rotation and kept only the ±3px float.

**Live:** https://samelectronics.vercel.app

---

## Step 7 · Issue 1 teardown

Step 6's deploy was confirmed: Vercel reported success for `c6997e0`.

**The scroll engine was rebuilt (PDF section D)**

The cause of "scroll is slow and buggy", "the screen appears instead of the back" and "a small scroll resets": the film's position was read straight from the page scroll.
- A fast scroll landed past the pin. The toss safety-check then saw "already past the turn" and snapped the phone to its front.
- A stray or momentum scroll moved the film between steps.

The new engine (`SETeardown.logic.js`) is a strict step machine that drives the film itself.
- **Steps:** 0 back reveal · 1 toss and interface · 2 burst (now its own step, as the PDF asks) · 3–10 layers 01–08 · 11 reassembly · 12 final call (automatic).
- **Gestures:** one deliberate gesture (at least 40px, wheel, trackpad, arrow, PageUp/Down, space or swipe) = one step. A new gesture counts only after 250ms of quiet. Input during an animation is ignored, never queued. Up = exactly one step back, played in reverse.
- **The two ends:** at the resting back reveal, scrolling up releases the page upward. At the final call, scrolling down continues to the next section.
- **Entering:** from above it always starts at step 0, with the page held at the section top. From below it enters at the final call. If the 3D isn't ready at the pin, the empty lit studio holds. If the 3D fails, or isn't ready after 10s, the film continues without it instead of locking the page.
- **The back is always shown first:** the phone faces its back until the toss turns it.

**8 scroll tests: 8 / 8 passed.** The test script is `site/scripts/qa/teardown-tests.mjs`, so anyone can re-run it.
1. Slow scroll from the hero → step 0.
2. Fast scroll → step 0.
3. Reload with the teardown half visible → step 0.
4. 10px nudge up at step 03 → nothing.
5. One scroll up at step 03 → exactly step 02.
6. One hard trackpad swipe → exactly one step.
7. Arrows pressed during an animation → ignored, then one step per press.
8. From the final call, scroll down → the page continues.

How it was run: this machine has no GPU (software WebGL draws about 1 frame per second), so input events arrive seconds apart there. The full run uses `--no3d`, which keeps the same step engine at real speed. Tests 1, 2, 4 and 5 also passed with the full 3D running.

**Other bugs found and fixed**

- **"The title sometimes doesn't appear"**
  - The big title's glide target was measured against the tall scrolling wrapper, not the sticky stage it sits in. Whenever the page scroll moved during the toss, the title flew off the top.
  - It is now measured against the stage. Checked: the title stays centred through the whole toss, then glides to the left zone after the landing.
- **The toss timeline and the interface build (step 3b) stopped silently**
  - A helper method and an animation handle shared the name `raf`, and the handle overwrote the method.
  - Renamed. Step 3b builds again: the title glides, the card border draws, then the content, the list rail and the rows.
- **The opening clock** now follows real time (capped at 100ms per frame), so slow devices no longer stretch the opening.

**Look and behaviour**

- **Scroll hint:** the mouse outline is replaced by our chevron motif: "SCROLL" with three chevrons lighting up one after the other, going down. It shows only at step 0 and fades when the title starts.
- **Final-call hover**
  - The phone no longer tilts or turns. The 25° hover turn and the ±7° automatic sway are removed; only the ±3° mouse parallax is left.
  - Screen: only the screen, still playing the ad, slides out to the right.
  - Any other part: the screen slides left and the part slides fully out to the right, behind the screen in depth, with its yellow edge glow and the tag beside or under it. Timing is 500ms out and 400ms back.
- **Crystal screen:** a soft vertical band of light now sweeps across the phone's screen every ~6s.
- **Dust:** each speck is now a pre-drawn sprite instead of a new gradient per speck per frame, which is much lighter. The look is the same: 190 round specks, 9 soft discs, brightest in the light, never in front of the phone. It turns into the golden bokeh in step 14.
- **Kept as approved:**
  - the three-zone layer view;
  - the leader line;
  - the callouts;
  - the counter;
  - the card swap;
  - the final call (pill, stats, the 4×2 cards, buttons, golden bokeh);
  - the back-glass sweep, lens glints and emblem gleam;
  - the outline letters where the phone passes behind the title.
- **Final-call ad:** checked frame by frame. It already matched section H:
  - logo intro with the light sweep and the zoom-through;
  - the locked template (same kicker, name, stock line and button positions on every scene);
  - colour wipes, whip pans and zoom-throughs;
  - the quick call (EVERY PART. / EVERY BRAND. / ALL IN DEIRA. / Get yours today.);
  - round golden dots forming the logo;
  - the yellow slogan;
  - fade and loop.
  - No change was needed.

**Frames checked:** step 0 with the hint · step 1 title · step 2 mid-rise (the back, outline letters) · step 3 mid-turn (edge-on) · step 3 landed (logo on screen) · step 3b · step 06 · final call · hover Screen · hover Battery · ad scenes from E1 to E4.

### DONE WHEN (Issue 1)

| Item | Result |
|---|---|
| All 8 scroll tests pass | Yes (8/8) |
| Step 0: empty lit studio, hint only now | Yes |
| Step 1: masked title and its sheen | Yes |
| Step 2: the BACK, light sweep, lens glints, emblem gleam, outline letters | Yes |
| Step 3: toss and turn, hang, fall, wake | Yes (one continuous 180° turn on the toss clock) |
| Step 3b: title moves, card and list build in | Yes (fixed) |
| Steps 4–12: burst, then each layer in sync | Yes (burst is now its own step) |
| Step 13: sparks, push-ins, shine; no shake, no box light | Kept as built |
| Step 14: 360° turn, dust becoming bokeh, final call building | Kept as built |
| Final call matches A2; hover opens the one real phone to the right, with the tag | Yes |
| The ad: logo intro, locked template, quick call, dots logo, loop | Yes |
| Always alive: light breathing, floating, mouse parallax, dust | Yes |

**Honest notes**
- I can't judge the 3D's smoothness on this machine (no GPU). The motion timings are as specified, but please look at the teardown on a real laptop.
- When there's no room to the right of a pulled-out part, its tag sits under the part as the PDF allows. On a 1440px screen it can touch the Samsoom launcher at the bottom right.

**Live:** https://samelectronics.vercel.app

---

## Step 8 · Issue 2 What we offer

Step 7's deploy was confirmed: Vercel reported success for `98c73d1`.

**Reading I chose: what "delete the three separate pages" means**
- Inside What we offer, the three services were full-width, full-screen bands, which the PDF now forbids. Those bands are what this step removes.
- The PDF's environment map (Section E) keeps Repair Lab (8), Wholesale / Trade Floor (9) and Worldwide (10) as their own sections further down the page, each with its own issue (8 and 9). So those sections are kept.
- The three bands are now **three boxes side by side** directly under the 8 family cards, inside the same section:
  - Repair (graphite);
  - Wholesale (Signal Yellow);
  - Worldwide (white).
- No two neighbours share a colour.

**Each box**
- Keeps its own scene and timings, scaled to the box:
  - Repair: the phone, the checklist ticking and the TESTED seal;
  - Wholesale: cartons on the pallet, shrink-wrap, the price tag flipping to Trade with −22%, the unit counter;
  - Worldwide: the dot-matrix globe with routes from Dubai and the Packed → In transit → Delivered pill under it.
- Has one mono eyebrow, the 2-line headline, one short line, one stat (marked * as a sample value) and the hero's button.
  - The descriptions were shortened to one line so nothing is cut off. They are in Arabic too.
- **Hover:** the box lifts 6px with a softer, larger shadow, and its scene runs 30% faster.
- **Buttons:** they go to the Repair Lab, Wholesale and Worldwide sections.
- The full-width colour wipe is removed, since these are boxes now.

**Part A (the 8 family cards):** kept as built. That includes:
- the 4 × 2 grid with parts on pedestals;
- the entrance (title, card wave, parts landing, numbers counting up);
- the hover (lift, the part turning to 3/4 with a light sweep);
- the slow turntable and the row light sweep.

A family card opens Find My Part on that family, until the shop page exists.

**Checks**
- What we offer runs at 60fps (3D blocked, as in Step 1).
- Arabic: one new untranslated word ("layers", from the teardown card that now builds correctly) is now translated. The rest are the allowed brand labels.

### DONE WHEN (Issue 2)

| Item | Result |
|---|---|
| 8 family cards, 4 × 2, realistic parts on pedestals, one screen | Yes (kept) |
| Entrance: title → card wave → parts land → numbers count | Yes (kept) |
| Hover lifts the card and turns the part with a light sweep | Yes (kept) |
| Three alive service boxes inside the section: graphite, yellow, white | Yes |
| Each box's scene plays as scripted, then idles | Yes (same scenes and timings, scaled) |
| No zeros; sample values marked | Yes (* Sample values note) |
| Every surface lit per G11; nothing flat | Yes |

**Live:** https://samelectronics.vercel.app

---

## Step 9 · Issue 3 Live Parts Board

Step 8's deploy was confirmed: Vercel reported success for `2920ce4`.

**What was wrong:**
- traces cut through the text and the Low-stock tile;
- tiles in a 2 × 2 grid with tiny dull icons;
- clipped trending chips;
- tall empty rows;
- a striped background.

The section was rebuilt to the PDF layout, with the same sample feed and texts.

**Layout:** `[4 counter tiles stacked]` → `[96px wiring channel]` → `[the board]`.
- **Background:** clean lit graphite (#2A2C2F → #34363A) with fine grain and a soft top light. No stripes, no grid.
- **Lanes:** each tile has one straight lane across the channel to the board, lined up with the tile's centre. There are no other traces in the section, so nothing crosses text or a tile.

**Tiles**
- Always-alive icons:
  - a box dropping onto a shelf;
  - a battery draining and blinking amber;
  - a tag swinging;
  - a truck driving off.
- Each icon's moving part is its own layer, so the icons never repaint.
- Big numbers, sparklines with a gradient fill and a pulsing dot on the latest point, and "+N in the last hour".

**Board**
- Dark glass panel with a 1px top highlight and a soft inner shadow.
- Header: `se://deira/board`, the GST clock and LIVE.
- **Filter tabs:** All · Landed · Low · Drops · Shipped. The rows shuffle in with a quick vertical slide, and the matching tile glows yellow. The tiles also filter when clicked.
- **Compact 56px rows:** time · status pill · part thumbnail (from the parts library), or the country code for a shipment · item · value.
- **Row hover:** the row lifts and its thumbnail enlarges.
- **Row click:** opens Find My Part on that model and part, or the Worldwide section for a shipment.
- **Footer:** a rolling "N events today · sample" and a small live activity bar.

**Live loop**
- Every 2.5–4s a new event lands. Its row slides in at the top, types in and glows yellow for 1.2s.
- A light pulse runs back along its lane to its counter. The counter flashes, rolls up and shows a floating "+1".

**Entrance**
1. The headline rises from a mask and the body text fades up.
2. The tiles slide in one by one and their numbers count up from 0.
3. Each lane draws across the channel, and a node lights where it meets the board.
4. The board powers on with one light pass.
5. The rows type in, 100ms apart.

**Trending:** a full-width ticker that scrolls continuously, with fades on both edges and rolling counts; it pauses on hover. Then the button, aligned left beneath it.

**Performance:** the first build ran at 47fps here. The ticker's edge mask and the SVG icons repainted every frame; both now animate as composited layers. The section now measures 60fps median (3D blocked, as in Step 1).

**Arabic:** the tabs, the split headline and "+N in the last hour" are translated. Country codes and product names stay as they are.

### DONE WHEN (Issue 3)

| Item | Result |
|---|---|
| Zero crossings: every trace straight and inside the channel | Yes |
| Live event → pulse → counter tick, continuously | Yes |
| Animated icons, filled sparklines, deltas | Yes |
| Compact rows with thumbnails and filter tabs | Yes |
| Ticker never clips | Yes (0 clipped chips; edge fades) |
| Clean lit graphite background | Yes |

**Frames checked:** the section after the entrance · mid-pulse (row → counter, "+1") · the Low filter active.

**Live:** https://samelectronics.vercel.app

---

## Step 10 · Issue 4 Global circuits, nav line, backgrounds

Step 9's deploy was confirmed: Vercel reported success for `a6863fd`.

**Nav progress line:** kept as built. It's present on every section: the thin yellow line fills with scroll and its head is a glowing node.

**The audit**
- A new script, `site/scripts/qa/circuit-audit.mjs`, checks that every visible point of every decorative circuit is at least 24px from text, buttons, images and cards. Points hidden behind something are skipped.
- **The audit list the PDF asks for is in `docs/CIRCUIT_AUDIT.md`.**
- First run: 31 paths too close. After the fixes, 9 remain, all intentional: the approved hero's circuits behind the devices, and a shipment route line in Deals.

**Rerouted or removed**
- Deals: the countdown-card trace was removed.
- Wholesale: the floor bus was moved off the ticker label.
- Who are you?: the hub connectors were rerouted.
- Meet Samsoom: the floor trace was moved off the status line.

**Current and surges**
- Current runs as soft glowing streaks in the hero's style.
- **Surges are new.** On an event, one visible streak nearby brightens and runs 2.4× faster for 400ms. The events are add to cart (including the iPad's automatic one), a new Live Board row, and hovering a card.

**Backgrounds:** every section-wide grid, stripe and dot tile is now a fine film grain. That covers Repair Lab, Wholesale, Story, Team, Who are you?, Deals and Model File. Object textures are kept.

### DONE WHEN (Issue 4)

| Item | Result |
|---|---|
| Nav progress line present | Yes |
| Circuits present and decorative per section | Yes |
| Zero circuits touching or crossing content; audit list sent | Yes. The audit list is in `docs/CIRCUIT_AUDIT.md`; the 9 remaining hits are intentional, with reasons |
| Current flows as streaks with surges on events | Yes |
| No busy background textures left | Yes |

**Live:** https://samelectronics.vercel.app
