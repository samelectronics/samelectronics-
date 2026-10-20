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

---

## Step 11 · Issue 5 Bench Test

Step 10's deploy was confirmed: Vercel reported success for `8c54a77`.

The section was fully rebuilt as a **pinned scene of about 300vh**. Scrolling drives the test forward and backward (scrubbed and eased). Every element is a pure function of scroll progress, written straight to the page each frame, so scrolling up plays everything in reverse with no React re-render. The whole stage is a fixed 1440×828 design scaled to fit one screen.

**Set**
- A clean Signal Yellow studio: grain, vignette, a bench surface with the rig's soft contact shadow. No waves or blotches.
- The rig:
  - an anodised, brushed-aluminium plate with a key-light highlight;
  - a dark top bar with 4 real-looking LEDs, the engraved "SE · TEST RIG 04 · DEIRA" and a green digital counter;
  - machined clamps with knurled knobs;
  - a probe carriage on a rail;
  - a cable with a real connector running neatly off the bottom edge.

**The film**

| Progress | What happens |
|---|---|
| 0–10% | The phone slides in, the clamps close with a click and a 2px shake, the LEDs go green one by one, the counter wakes. |
| 10–30% | A scan light sweeps down the screen and the pixel grid fills behind it. Display → PASS ✓ |
| 30–45% | The probe taps 9 points one by one; its thin stylus never covers the screen. The touch trace draws, PASS ✓, and **QUALITY** charges left to right, its circle drawing into a ✓ with "Display and touch passed" typing in. |
| 45–65% | The screen shifts warm → cool and the gauge needle settles. PASS ✓, a warranty sticker is pressed onto the phone, and **WARRANTY** fills. |
| 65–85% | Battery health charges to 98%. PASS ✓, a price tag drops in on its string, and **PRICE** fills. |
| 85–100% | The thermal work order feeds out of the rig's slot (part · grade · warranty · price · unit #), the PASSED stamp lands with a shake, and the counter rolls 1,293 → 1,294. |

**Idle life:** the LEDs breathe, the counter's last digit flickers now and then, the work order and price tag sway.

**Readouts:** four glass tiles (Display, Touch, True Tone, Battery), each showing queued → testing → PASS ✓, with a progress bar, a trace, a gauge and a health bar. The terminal-style log box is gone.

**No prices or periods invented:** the price on the tag and work order is marked sample, and the warranty line reads "on every grade*".

**Checks:** 60fps (3D blocked, as in Step 1). Arabic is fully translated.

### DONE WHEN (Issue 5)

| Item | Result |
|---|---|
| Pinned and scrubbed both ways, four checks in order | Yes |
| Words fill like charging bars with ✓ and typed lines | Yes |
| Work order prints and stamps; counter ticks | Yes |
| Rig realistic, full height, no defects | Yes (no covering probe arm, no cut-off text, no stray bar, no dangling cable) |
| Clean yellow studio background | Yes |

**Frames checked:** 5% · 20% · 35% · 55% · 75% · 92% · 100% of the pin.

**Live:** https://samelectronics.vercel.app

---

## Step 12 · Issue 6 The Showcase (replaces the Model File)

Step 11's deploy was confirmed: Vercel reported success for `af30837`.

**The Model File is removed from the home page** (its component was deleted along with its 3D scene).
- Browsing by model lives in Find My Part.
- Every "Brands & models" link (teardown cards, the system map, Samsoom) now opens Find My Part.
- **New G17 safety net:** any link to a section that isn't on the page opens the "Coming soon" card instead of doing nothing.

**The Showcase:** a warm fog studio with one wide ad stage, graphite on the left and Signal Yellow on the right, with a soft shadow. A slow studio haze drifts behind the product.

**Five screen-grade ads, auto-advancing**

| Grade | Headline | Checklist |
|---|---|---|
| Service Pack (lead) | Straight from / the maker's box. | Genuine manufacturer part · Sealed in its service box · Warranty on every grade* |
| Original | The original. / Nothing less. | Genuine original part · Tested before it ships · Warranty on every grade* |
| OLED | Deep blacks. / Fair price. | OLED replacement screen · Bright, sharp, responsive · Tested on our bench |
| Incell | Best value. / Still bright. | Incell replacement screen · Best value for money · Tested on our bench |
| High Copy | Budget-friendly. / Still tested. | Tested copy (for example GX) · Budget comes first · Checked before it ships |

**The film (each ad about 7.5s)**
1. The mono grade eyebrow appears.
2. The headline arrives word by word, blur to sharp.
3. The product (the parts-library screen render) comes forward from 70% with a 2° overshoot, and its contact shadow forms.
4. The checklist ticks in, and a "from AED X · sample" badge stamps on. The prices are the lowest sample price per grade.
5. The hold: a slow ±10° turn, a light sweep over the glass every 3s, the haze drifting.
6. The exit with depth, then the next ad.

**The Service Pack moment (9.5s):** the sealed service box slides in, the flap lifts, the screen rises out of the box and turns, and a SEALED · GENUINE seal stamps. The packaging has no maker logo.

**Controls:** story-style progress bars (one per ad, clickable); pause while the mouse is over the stage; ‹ › arrows; swipe on touch.

**No simulated quality differences:** every ad shows the same render, and the grades differ in words only. There's no OLED/Incell slider and no back-cover colour ad.

**Checks:** 60fps (3D blocked). Arabic: in Arabic, the headlines render as whole translated lines; grade names stay as written on orders.

### DONE WHEN (Issue 6)

| Item | Result |
|---|---|
| Model File removed from home | Yes |
| Showcase built as a graphite / yellow stage in a warm fog studio | Yes |
| 5 screen-grade ads per the film, auto-advancing, progress bars, pause, arrows, swipe | Yes |
| No simulated colour comparisons | Yes |

**Frames checked:** each ad at about 2s; the Service Pack box at 0.8s, 1.4s, 2.2s and 3.2s.

**Live:** https://samelectronics.vercel.app

## Step 13 · Issue 7 Deals & arrivals

Rebuilt the Deals section from scratch (`SEHomeDeals.logic.js` / `.tsx`, styles in `src/styles/deals.css`).

**Layout**
- Header: "Prices drop. Clocks tick." / "Grab it before the next shop does." (two lines that rise in), plus "See every deal". There is no Deals page yet, so that button shows the G17 Coming soon card.
- Left, the spotlight (Deal of the Day). It is the deal with the biggest discount.
  - Its entrance plays clock → strike → price roll → stock: split-flap clock tiles, the old price struck through, the new price digits rolling in, then the stock bar.
  - The stock starts at 32 of 50 and drops by one every 20–30s.
- Right: tabs (All · Screens · Batteries · Back covers · Cameras) and a carousel.
  - Exactly 3 whole cards are visible and the drift moves one whole card every 4.5s, so a card is never clipped.
  - The carousel pauses on hover; you can drag it or use the arrows.
- Below:
  - Incoming shipment SH-2611: a dotted world map projected from the offline globe data, with the Shenzhen → Dubai arc, a plane and a trail.
    - The bar, the plane, the stages and the countdown all come from one 7-day transit clock, so they always agree.
  - Pre-orders: a graphite card with neutral placeholder names from the data file ("Next Galaxy Ultra"…). "Reserve" shows the G17 card.
- Every product and image comes from the parts library. Grades are written in full words.
- Fly-to-cart: a ripple on the button, then the product image arcs to the nav cart, the cart bounces and its badge goes up (tested: 0 → 1).

**Arabic:** added all the Deals strings. Also, the Showcase grade aria-labels and the "Shop … screens" line now translate (both were missed in Step 12). The checker is back to its baseline.

**Checks:**
- `#deals` runs at 60fps.
- Circuit audit: no hits in Deals; the remaining 6 are the approved hero circuits.

### DONE WHEN (Issue 7)

| Item | Result |
|---|---|
| No circuit touches any card or button | Yes (audit) |
| No clipped text anywhere in the carousel | Yes (3 whole cards fit; the drift moves whole cards) |
| Spotlight plays clock → strike → price roll → stock | Yes |
| Grades in full words | Yes |
| Fly-to-cart works | Yes (badge 0 → 1) |
| Shipment data consistent | Yes (one clock drives everything) |
| Pre-orders graphite with neutral names | Yes |
| Products from the parts library | Yes |

**Captures checked:** after the entrance, mid price-roll, hovering a carousel card, mid fly-to-cart.

## Step 14 · Issue 8 Wholesale, "The Trade Floor"

Full rebuild as a new component (`SEWholesale.logic.js` / `.tsx`, styles in `src/styles/wholesale.css`). It replaces the old Wholesale section, the conveyor and the truck scene, which were deleted.

**The set:** a Signal Yellow field with 2% grain and a studio vignette. The pallet builder stands on warm-grey concrete with a soft light pool.

**The film**
1. A strip of yellow packing tape printed "SAM ELECTRONICS · WHOLESALE · TRADE" unrolls across the top edge, presses flat, and a glint runs along it.
2. The headline arrives by mask reveal, and a TRADE ONLY stamp lands with ink texture and a small shake.
3. The numbers band counts up:
   - Since 2003
   - 24+ countries*
   - Same-day quotes
   - Min. order 10 units*

   The starred figures are the sample `serviceStats` and are marked "to be confirmed".
4. The pallet slides in with weight and the first 2 cartons drop.

**Pallet Builder**
- Part chips use parts-library thumbnails, and there is a quantity slider (10–500).
- Each step adds cartons that drop with squash, settle, a dust puff and a contact shadow.
  - Cartons have a lit top face, a mid-tone front and a darker side.
  - They show corrugated flutes, tape with sheen and barcoded labels.
- Tier ladder 10+ · 50+ · 100+ · 500+:
  - the active tier glows and breathes, and flashes when you cross into it;
  - the unit price rolls down;
  - "You keep AED X" rolls up.
- Retail total vs trade total sit side by side, with the trade total in yellow on graphite.
- At 500 the pallet is full: shrink-wrap spirals up with a moving shine (every 6s), and a label prints and sticks: "SE-2611 · Ready to ship from Deira."
- Tier prices are samples: 88 / 82 / 78 / 72% of retail.

**Below the builder**
- **Who we supply:** 4 graphite cards, each with a small animated scene and one benefit:
  - Repair shops: a phone and driver;
  - Traders: a swinging price tag that steps down;
  - Exporters: a plane on an arc over a carton;
  - Bulk buyers: a list that ticks itself.
- **How trade works:** Apply → Get approved → Order at trade prices. The steps light in order like a circuit, ending at "Apply for a trade account". There is no Wholesale page yet, so this button opens the G17 card.
- **Send a bulk list:** opens WhatsApp.
- **Trade ticker:** full width and continuous, with flags, quantities and fade overlays. It pauses on hover.
- **Partner with us:** a graphite card with a faint world-map texture from the offline globe dots. "Become a partner" opens the G17 card.

**Circuits:** only two faint traces in the side gutters. None crosses a carton, card or text, and there is no conveyor.

**Arabic:** every new string is added. The checker is back to its baseline.

**Speed:** `#wholesale` runs at 60fps, with the same average as the sections next to it.

### DONE WHEN (Issue 8)

| Item | Result |
|---|---|
| Reads as wholesale at first glance | Yes: tape, TRADE ONLY stamp, pallet and cartons |
| Tape and TRADE ONLY stamp play | Yes |
| Pallet builder with tier ladder and wrap works | Yes (tested 50 → 500) |
| Who we supply + How trade works added | Yes |
| All objects at G15 quality | Cartons, tape, labels, pallet wood and wrap, all layered and lit from the top-left |
| No circuits through objects | Yes (audit: no Wholesale hits) |

**Captures checked:** after the entrance, the pallet at the 50+ tier, and the pallet full with its label.

## Step 15 · Issue 9 Worldwide colour fix (keep the rest)

The map, the routes and the live shipments list are untouched. The four boxes keep the same continuous motion and the same hover speed-up. They moved into `WorldwideBoxes.tsx`, with styles in `src/styles/worldwide.css`.

**Palette only:** yellow for what moves, white and soft grey for lines and text, graphite for surfaces.
- **Tracked:** a yellow parcel dot runs the dashed white route to a pulsing yellow pin, and the code types in.
- **Packed:** a muted kraft carton (flutes, a lit edge, a contact shadow) closes its flaps, yellow tape seals it and a white barcoded label lands.
- **Quoted:** the price rolls in white, then a yellow ring and a yellow tick draw themselves. This replaces the green tick.
- **Regions:** a graphite dot globe with yellow and white dotted continents turns, and ME / AFR / EU / ASIA light in yellow in turn. This replaces the blue/green globe.

**Size and light:**
- Each animation sits centred in a 132px art well, about 45% of the box height.
- Each well has a tiny warm key light and a soft contact shadow.
- Each box has a faint top highlight.

**Optional items skipped:** the dashed route line between the boxes and the "Where are you?" search. The PDF marks them "only if it looks good". The boxes read cleaner without the line, and the search would add a feature to the map, which must stay untouched.

### DONE WHEN (Issue 9)

| Item | Result |
|---|---|
| Four boxes and their motion kept | Yes |
| Zero off-palette colours | Yes (in the boxes) |
| Animations larger and lit | Yes |
| Map untouched | Yes |

**Captured:** all four boxes mid-animation.

## Step 16 · Issue 10 Our story & branches, "More than 20 years in Deira"

Rebuilt as a new component (`SEStory.logic.js` / `.tsx`, styles in `src/styles/story.css`). The old Story section, with its default Google map, the sketch and the red stamp, is deleted.

**The set:** warm fog, from #F2F3F4 warming to #F7F3EA where the light falls. A soft afternoon light comes from the top-right and drifts slowly across the section (a 46s cycle), over fine grain.

**The film:** the section is pinned and scroll-driven, and scrubs both ways.
- **0–15%:** the line draws to v1.0, with a yellow current streak at its tip.
- **15–60%:** the line walks the versions.
  - Each card lifts in when the line reaches it, and its instant photo develops over 1.2s, warm first, then true colour.
  - The big year counter rolls 2003 → 2011 → 2015 → 2020 → today, and its label switches to TODAY.
- **60–75%:**
  - "Sam Electronics" (2020–today) switches to RUNNING, with a softly pulsing green dot. The PDF asks for green.
  - Madrid switches to INSTALLING with a slowly filling bar that keeps creeping.

**Reading noted:**
- The PDF puts RUNNING on v3.0 and INSTALLING on v4.0. The Company Facts number the versions v1.0–v4.0 plus Madrid as v5.0, so I put RUNNING on today's shop and INSTALLING on Madrid. That matches what the PDF describes.
- Every card shows the facts' own version number.

**Photo frames:** white instant-photo borders rotated ±2°, each with a soft drop shadow. Until the owner's photos arrive, each frame holds a softly blurred warm placeholder:
- an old shop;
- a counter;
- a market with bokeh;
- today's shop with the yellow sign;
- a Madrid plaza at dusk.

**Branches (75–100%)**
- The two map cards slide up side by side.
- Both maps are brand-styled SVG: graphite ground, fog streets, the creek / Plaza Mayor.
  - There is no default Google styling and no ctrl+scroll overlay. Each map is static until clicked, then opens Google Maps, and has an "Open in Maps" chip.
  - Dubai has a yellow pin with a soft pulse.
  - Madrid has a pulsing "Opening soon" area circle, not an exact pin, plus "Tell me when it opens".
- Then the stats strip counts up: Since 2003 · 2 cities · 24+ countries served*.
- The Dubai card keeps the address, Plus Code, today's hours, directions, WhatsApp and Call.

**Arabic:** every new string is added, including the map labels. The checker is back to its baseline.

**Speed:**
- `#story` runs at 60fps, with an average in line with the other sections.
- Fix found in testing: `will-change` on the blurred photo layers halved the fps, so it was removed. The photo develop now animates opacity only.

### DONE WHEN (Issue 10)

| Item | Result |
|---|---|
| Photo frames on every card with develop animation | Yes |
| Line draw + year counter | Yes |
| Madrid map matches Dubai | Yes (same style) |
| Maps branded, no overlay | Yes |
| Stats strip fills the gap | Yes |

**Captured:** 30% (a photo developing), 70% (RUNNING / INSTALLING), and 100% (maps + stats).

## Step 17 · Issue 11 The team, "Staff Badges"

The old team cards are replaced by a new component (`SETeam.logic.js` / `.tsx`, styles in `src/styles/team.css`). Gone with them: "browse files", the empty stars and the text flip panel.

**The set:**
- A clean graphite wall (#2A2C2F) with one soft elliptical light pool and no visible cone.
- A slim brushed-metal rail.
- Yellow lanyards printed "SAM ELECTRONICS", with a fabric-weave texture and a slight twist, ending in metal clips with a highlight.
- PVC badges with rounded corners, gloss, a slot cut-out, a hologram strip and a soft shadow on the wall.

**Roles:** the PDF's "Staff Badges" list (T01 Parts Advisor, T02 Parts Flow Controller, T03 Bench Engineer, T04 Finance & Checkout, T05 Founder).
- Each badge shows a clean role monogram until photos arrive, then the code, title, name and years.
- Names that are not yet known read "Name to come".
- The founder badge is larger, with a gold edge and "Leading since 2003": Tarek Alchoumari, 23 years with us.
- Reviews are hidden.

**Physics:** each badge is a damped pendulum on its lanyard plus a stretch spring.
- Drop-in: the title masks in, then the badges fall one by one (120ms stagger), bounce on the lanyard's stretch and swing to rest.
- Idle: each one sways at its own rhythm, and the hologram shimmers with the sway.
- Mouse: a badge nudges away from the pointer and swings back.

**Order ticket:** starting 1.8s after the entrance, an ORDER #1294 ticket rides the rail and stops at each badge in turn. Each badge lights with a yellow edge as the ticket passes: Parts Advisor → Parts Flow Controller → Bench Engineer → Finance & Checkout → Founder. It repeats every 12s.

**Flip:** a click swings the badge up and flips it in 3D, with an overshoot for weight. The back shows "What I can help with" (3 points), a short bio and "Ask [name] →", which opens WhatsApp with a prefilled message for that role.

**Speed (headless software rendering):** `#team` peaks at 59.5fps with an average of about 38, below the other sections because five swaying badges repaint every frame.
- Changes found in testing: the 3D context is only switched on while a badge is turning, the wall shadow is part of the badge layer, and sub-pixel sway updates are skipped.
- A real GPU composites the rotation directly.

**Arabic:** every new string is added. The founder's name shows in Arabic. The checker is back to its baseline.

### DONE WHEN (Issue 11)

| Item | Result |
|---|---|
| Five badges on lanyards, swaying with physics | Yes |
| No browse files, no empty stars | Yes |
| Flip with weight | Yes |
| Order ticket lights badges in order | Yes |
| Founder badge distinct | Yes |
| Graphite wall with one light pool | Yes |

**Captured:** after the drop-in, mid ticket journey (Bench Engineer lit), and one badge flipped.

## Step 18 · Issue 12 Open to everyone, "Who are you?"

Rebuilt as a new component (`SEWho.logic.js` / `.tsx`, styles in `src/styles/who.css`). The logo hub, the grey connector lines and the four identical cards are gone.

**The set:** warm fog with grain. The light behind the stage shifts in 800ms to match the active lane.

**Left column:**
- The eyebrow and the headline.
- Samsoom peeks in beside the tabs, asking "Who are you?".
- 4 large tabs, each with an icon, a name and one line. The active tab is graphite with a yellow progress bar.

**The stage:** one large stage of about 60% width. Every lane uses parts-library renders.
- **Retail** (fog with warm yellow light):
  - A hand holds the teardown phone (library front render) with a cracked screen.
  - Find My Part types "iPhone 13", then the library screen slides in with grade chips and "from AED 125".
  - A pin drops on "Collect in Deira or get it delivered".
- **Repair shop** (graphite workbench, top-down):
  - The bench has a mat with a faint grid, a driver, tweezers, a spudger and a light pool.
  - A parts tray slides in with weight, and the three iPhone 13 grades line up side by side.
  - A padlock clicks open and the trade prices are revealed.
- **Trader & exporter** (dark dot-matrix map from the offline globe):
  - A bulk list is scanned by a soft light and QUOTED stamps on it.
  - Route arcs draw from Dubai to Lagos, Nairobi, Madrid, Baghdad and Muscat.
- **Bulk buyer** (full yellow):
  - 18 branded cartons drop onto a pallet. These are the same Pallet Builder objects as Wholesale.
  - Shrink-wrap spirals up and an "Incoming shipments first" badge stamps.

**Motion:**
- The stage auto-cycles every 6.2s, pauses on hover, and a click jumps to a lane.
- The leaving scene moves back and fades with depth, and the new one arrives with weight.
- The lane's 3 benefits type in beside the lane button.

**Buttons:**
- Find my part opens Find My Part on screens.
- Open a trade account goes to Wholesale.
- Plan my shipment goes to Worldwide.
- Request a bulk quote goes to Request & contact.

**Arabic:** every new string is added. The checker is back to its baseline.

**Speed:** `#everyone` runs at 60fps, with an average of 53.6.

### DONE WHEN (Issue 12)

| Item | Result |
|---|---|
| No logo hub, no grey connector lines | Yes |
| Tabs + one stage | Yes |
| Four real scenes in their environments | Yes |
| Auto-cycle with progress bar | Yes |
| No white emptiness | Yes |

**Captured:** each lane mid-scene (t = 4.6s).

## Step 19 · Issue 13 Sam Circuit, "The Charging Station"

Rebuilt as a new component (`SECircuit.logic.js` / `.tsx`, styles in `src/styles/circuit.css`). The all-yellow wallpaper, the full-cells-at-62% battery and the twelve "coming soon" pills are gone.

**The set:** a graphite studio, lighter behind the battery, with a polished floor, a light pool and the battery's reflection. Yellow appears only as energy: the fill, the current, lit marks and unlocked chips.

**The battery:**
- A graphite metal casing with a glass window and a softbox reflection.
- 4 tier marks engraved on the side, at 25 / 50 / 75 / 100%.
- A metal connector plugged into its top, with the cable above it.
- The fill is glowing liquid light, from an amber core #C98A12 to Signal Yellow at the surface, with a shimmering surface.
- Measured in the DOM: the fill sits at exactly 62% for 62%. I also removed an outer glow that had made it look higher.

**Model:**
- One sample spend number drives everything. It maps through the tier thresholds (sample, to be confirmed: first order · AED 1,000 · 5,000 · 15,000), so the label, the fill, the ladder and the card always agree.
- The demo starts at AED 2,920, which is 62%.

**The film:**
1. The headline masks in.
2. The battery rises with a slow turn and its reflection forms.
3. Current flows down the cable while the fill rises 0 → 62%. Each tier mark it passes lights up.
4. The ladder rows slide in. The current tier glows, and the next tier shows "AED X to go" with a progress bar.

**Simulator:** + Screen · AED 200, + Battery · AED 80, + Bulk order · AED 2,000.
- Each tap sends a bright pulse down the cable, then the fill rises.
- Crossing a tier mark flashes the battery, pops the tier badge and flips that tier's reward card from locked to unlocked with a light sweep. Tested: two bulk orders cross into Supercharged.
- Reset powers the battery down: the fill drains and the current stops.

**Ladder rows:** plug → bolt → double bolt → full battery icons, each with its name, requirement and status chip (Unlocked / AED X to go).

**Member card:** graphite with a holographic edge, showing the name, tier and charge %. It tilts with the mouse and a light sweep follows.

**Perks:**
- 1–2 example perks per tier, marked "to be confirmed".
- One blurred "More perks revealed at launch" teaser.
- No repeated "coming soon", and no passport or stamp themes.

**Idle life:** current keeps flowing, the surface shimmers and the next tier mark breathes.

**Arabic:** every new string is added, plus rules for "AED X spent" and "AED X to go". The checker is back to its baseline.

**Speed:** `#circuit` runs at 60fps, with an average of 59.5.

### DONE WHEN (Issue 13)

| Item | Result |
|---|---|
| Graphite studio, yellow only as energy | Yes |
| Fill matches the real level | Yes (measured 0.620) |
| Simulator works and flips tier cards | Yes |
| Ladder statuses shown | Yes |
| Member card tilts | Yes |

**Captured:** after the entrance, mid tier-crossing (Supercharged badge and flash), and the card tilted.

## Step 20 · Issue 14 Meet Samsoom, "Ask at 3 a.m."

Rebuilt as a new component (`SEMeet.logic.js` / `.tsx`), with a new character component `SamsoomLED.tsx` and styles in `src/styles/meet.css`. The white page, the white chat, the blank grey shapes and the cartoon Samsoom on a pedestal are gone.

**The set:** a warm Signal Yellow studio with grain and a soft vignette. Samsoom floats over a warm light pool, and his soft shadow grows lighter as he bobs up.

**Samsoom (LED edition):**
- His body is the teardown's own phone render from the parts library (front view, graphite frame, glass).
- His face is glowing yellow pixel-LED eyes and mouth on deep black OLED, drawn as an SVG LED-dot pattern.
- He has sleek metallic arms (tube, highlight, joint, hand). There is no pedestal.
- Moods:
  - idle, with a blink every ~4.6s;
  - wave, on arrival;
  - thinking: loading dots in his eyes;
  - found: ✓ ✓;
  - happy: a smile;
  - rare short emotes: wink, a kiss with a floating heart, and a dabke step.
- His eyes follow the cursor.
- The small launcher Samsoom (G8) is unchanged and still on every page.

**The film:**
1. The eyebrow and headline arrive top-left by mask reveal.
2. Samsoom flies in from the right, slows, settles into a float and waves.
3. The graphite glass chat slides in at 1.2s and the first question appears.

**The chat:** graphite glass in hero-card style. It loops 5 conversations, each with a typing indicator and a rich answer card:
1. A54 battery: a product mini-card with the library battery render, the grade, the price and a working Add to cart.
2. Which grade: the iPhone 13 grades with prices.
3. Are you open?: a live hours card (Dubai time, open or closed).
4. Trade prices: the tier steps plus "Open a trade account".
5. Ship to Iraq: a shipping card with a route arc.

The chat always shows the previous conversation, so there is no empty area. "Ask Samsoom your own question" opens the real chat.

**Idle life:** a breathing bob and blinks. Faint real questions drift in the background, and each new question flies into the chat as the next message.

**Bugs fixed while testing:**
- An LED pattern fill set from CSS did not resolve, so the fill now sits on the SVG elements.
- A mood class name collided with the dots class, so the dots class was renamed.

**Arabic:** every new string is added, plus rules for "Opens at…", "N in stock · Deira" and the ETA. The checker is back to its baseline.

**Speed:** `#samsoom` runs at 60fps, with an average of about 55.

### DONE WHEN (Issue 14)

| Item | Result |
|---|---|
| No blank shapes, no white panel | Yes |
| Samsoom built on the teardown phone with an LED face | Yes |
| Headline on top; all in one screen | Yes |
| 5 conversations loop with rich cards and emotes | Yes |
| Launcher pill per G8 on every page | Yes (unchanged) |

**Captured:** after the arrival (wave), mid-typing (thinking dots), and a rich product card answer.

## Step 21 · Issue 15 The Feed + What customers say (split)

The old Social wall is split into two new sections: `SEFeed` (part A) and `SEReviews` (part B), with styles in `src/styles/feed.css`. The blank grey shapes, the static post cards and "No reviews yet" are gone.

**A · The Feed** (graphite studio, light pool, polished floor)
- Three teardown phones (library front render) fan out at −12°, 0° and +12°, each with a softbox glass reflection, a rim light and a floor reflection.
- **Entrance:** the phones rise from the floor one by one with an overshoot. Then their screens power on (a scan-line open), inside G14 safe margins.
- **Instagram:** our posts with library part images, auto-scrolling, with like counters ticking up.
- **TikTok:** a muted reel. It shows a library camera part in a slow push-in, a progress bar, a mute icon, the like / comment / share rail with counters ticking, and hearts floating up.
- **Facebook:** the page cover, a Follow button and the post feed.
- **Hover:** a phone comes forward, straightens and brightens, and the others step back.
- **Scan to follow:** the QR has a scan light sweeping over it, and the follower counts roll up. These counts are samples, marked as such; the owner confirms the real numbers.

**B · What customers say** (white with soft yellow light)
- A big Google card: the stars fill one by one, the review count counts up, and there are "Review us on Google" and "Write a review" buttons.
- Two rows of review cards scroll in opposite directions, with fade overlays, light shadows and a yellow quote mark. Hovering a row pauses it.
- **Honesty note:** the Company Facts contain no reviews, rating or follower numbers.
  - The 4.9 rating, the review count and the eight review cards are clearly labelled "Sample review" / "sample until connected", with a line under the rows.
  - They are placeholders for the real Google reviews, which the PDF says connect at the build stage. Owner action: provide the Google review link and the reviews.

**Speed:**
- The three playing screens were the cost (59→38fps in software rendering).
- The Instagram and Facebook feeds now snap-scroll (hold a post, then slide) and every drop-shadow filter in the section is gone.
- Result: `#social` peaks at 60fps with an average of 46, and `#reviews` runs at 60 with an average of 59.5.

**Arabic:** every new string is added, including the review texts and the places Sharjah and Ajman. The checker is back to its baseline.

### DONE WHEN (Issue 15)

| Item | Result |
|---|---|
| No blank shapes, no "No reviews yet" | Yes |
| Three live-feed phones with entrance and hover | Yes |
| Reviews band separate with the Google card and two rows | Yes (sample content, labelled) |

**Captured:** the Feed after the entrance, a phone hovered, and the reviews band.

## Step 22 · Issue 16 Request console + Visit us (improve)

The idea is kept: tabs plus a printed work order. It is rebuilt as `SEVisit.logic.js` / `.tsx`, with styles in `src/styles/visit.css`, using the same request types, fields and WhatsApp / email bodies as before.

**The set:** a yellow section with grain and a vignette. The console is graphite glass with a soft shadow, and the visit card is white with a soft shadow.

**Console:**
- **Live printing:** each filled field prints its line onto the slip with a fast line-by-line feed, and the slip moves down a little. A "2 / 3 fields printed" line fills as you go.
- **Tab switch:** the fields morph in (staggered) and the slip's TYPE line reprints.
- **The slip:** thermal paper, a warm white with a dotted perforation under the printer slot, a faint curl shading at the bottom, a torn-edge bottom and a soft hanging shadow.
- **Send:**
  1. The slip jerks at the perforation and tears.
  2. "SENT" stamps on it with ink texture and the status line switches to SENT.
  3. The slip folds and flies into the button you pressed (WhatsApp or Email), and the button bounces.
  4. Samsoom pops up with his "thanks" emote.
- The WhatsApp / email link opens at the click itself, so browsers don't block it as a popup.

**Visit us:**
- A live Dubai clock with seconds.
- The G7 status dot (green open with a ping, amber in the last 30 minutes, red closed) with "Open now · Closes at 14:00" and a "Closes in 3h 14m" countdown.
- A day-timeline bar with today's two shifts as yellow segments and a moving "now" marker.
- The week, with today highlighted.
- The brand-styled Deira map from Our story fills the gap, with "Get directions".
- The address and Plus Code, and WhatsApp and phone buttons with their icons.

**Circuits:** none in or near the console. The audit's one Worldwide hit is the dashed route drawing inside the Tracked box, not a circuit.

**Arabic:** every new string is added, plus rules for "Closes at", "Closes in" and "Opens in". The checker is down to 2 entries, below its old baseline.

**Speed:** `#visit` runs at 60fps, with an average of 57.

### DONE WHEN (Issue 16)

| Item | Result |
|---|---|
| Live printing works | Yes |
| Tear-and-send works | Yes |
| Status dot correct | Yes (G7 colours) |
| Day timeline with now marker | Yes |
| Gap filled | Yes (map) |
| No circuit near the console | Yes |

**Captured:** mid-typing with printed lines, mid tear (SENT stamped), and the visit card.

## Step 23 · Issue 17 Finale, "A phone on your bench? We have the part."

Full rebuild (`SEFinale.logic.js` / `.tsx`, styles in `src/styles/finale.css`). The grey slab phone, the white slash, the floor box and the grey band are gone. The finale no longer needs a WebGL context: it is CSS and SVG only, so it also leaves the G16 GL budget.

**The set:**
- A deep graphite stage (#26282B at the edges to #34363A at the centre, never black).
- One soft key light on the emblem with no visible cone, and dust falling slowly in the light (G12).
- A polished floor with the emblem's fading reflection.

**The emblem:** the owner's exact logo (`public/assets/se-logo.png`) set as the face of a premium object:
- a machined-metal conic bezel;
- a domed glass face with studio reflections;
- a thick yellow edge that glows;
- a darker back plate for depth.

It is 360px tall, about 40% of a 900px screen.

**The film:**
1. **0–1s:** circuits from both sides, in the hero style, carry current streaks towards the emblem.
2. **1.0–1.6s:** power. The two phones inside the logo light up, a soft ring of light shockwaves out across the floor, and the circuits glow fully for a moment.
3. **1.6–3.0s:** QUALITY · WARRANTY · PRICE switch on one by one like neon signs (flicker, pause, steady), each with a glow on the floor beneath it.
4. **2.4–3.6s:** the headline reveals word by word, the buttons rise in and the stats count up.

**Idle life:**
- The emblem turns slowly in 3D (±16°) while a key-light sweep crosses its glass.
- Current keeps flowing and the edge glow breathes.
- The neon words breathe softly.

**Circuits:** they stay at emblem height and end at the bezel. None crosses or comes near a word. The audit lists them against the emblem image, which is intended, because the current has to reach the emblem.

**Arabic:** in Arabic the headline animates word by word over the translated line. The stats strings are added. The checker is at 2 entries.

**Speed:** `#finale` runs at 60fps, with an average of 41.5 (software rendering; the box-shadow glow on the bezel breathes).

### DONE WHEN (Issue 17)

| Item | Result |
|---|---|
| No phone, slash, floor box or grey band | Yes |
| Emblem large, premium, rotating | Yes |
| Power-up plays in order | Yes |
| No circuit crosses any word | Yes |
| Idle continues | Yes |

**Captured:** mid-current (0.6s), the power shockwave (1.25s), the neon words on (2.7s), and complete (5s).

## Step 24 · Issue 18 Find My Part (redesign)

The finder's state and data stay in HomeV3 (brand → model → part → grade, search, series, cart). The panel (`FindMyPartPanel.tsx`) and the nav quick view (`SEFMPMenu.tsx`) are redesigned, with styles in `src/styles/fmp.css`. The trigger button in the nav is unchanged.

**The set:**
- The page blurs (16px) and dims to graphite at 60%.
- The panel is graphite glass with real depth: a soft inner light from the top, fine grain, a thin yellow top edge, a large soft shadow and generous padding.
- Tiles are dark glass with a faint top highlight and a yellow edge glow on hover. There is no grey-on-grey.

**Step indicator:** a circuit with LEDs, Brand · Model · Part · Grade.
- Completed steps light yellow and show the choice ("Apple ✓"), with current flowing along the wire to the next step.
- Click a completed step to go back.

**Step 1 · Brand:**
- 14 brands in a balanced 7 × 2 grid, so there is no orphan row.
- Each tile has the brand's real logo or wordmark (G18), the models count, the parts in stock and a stock signal.
- The POPULAR label and its rule sit above the popular tiles with clear space and never touch a tile.

**Step 2 · Model:**
- Every model sits in an identical lit frame showing a clean silhouette of its front (Dynamic Island, notch, home-button bezel or punch-hole, by model).
- The owner's image slot sits on top for real photos.
- Series tabs, instant search by name or model number, and "Recently viewed" and "Most searched" chips.

**Step 3 · Part:** part cards with the parts-library renders (G15), stock and a "from" price. Out-of-stock parts are dimmed, with "Notify me".

**Step 4 · Grade:** grade cards side by side, each with the price, a stock signal, the warranty, a "best for" line and Add to cart with the fly-to-cart moment.

**Quick view:** the nav hover opens a compact mega-dropdown with brands (logos and stock) on the left and models on the right, each with its silhouette image. At its bottom, a full-width "See all [brand] models →" opens the full finder at step 2.

**The film:**
- The panel rises 24px and scales 96% → 100% (250ms, expo-out).
- Tiles stagger in 25ms apart.
- On a choice, the chosen tile flies into the step indicator (300ms) while the next step slides in from the right with depth (320ms). Every transition is under 400ms.

**Footer:** a live summary ("Apple · iPhone 16 Pro Max · Screens"), a rolling result count, and "Open in Shop with these filters →".

**Bugs fixed while testing:**
- The panel's footer was a `<footer>` element, which the global off-screen pause rule froze. It is now a `div`.
- A `.st` class collided with Our story's section class, so it was renamed.

**Arabic:** every new string is added. The checker is at 2 entries.

### DONE WHEN (Issue 18)

| Item | Result |
|---|---|
| Premium panel | Yes |
| LED circuit step indicator | Yes |
| Brand wordmarks, balanced grid, Popular label clear | Yes |
| Model image frames consistent | Yes |
| Library part renders; grade cards with Add to cart | Yes |
| Hover dropdown with a clear path to the full list | Yes |

**Captured:** all 4 steps, the hover dropdown, and one frame mid-transition.

## Final step · Full-site check (14 Oct 2026)

**Links**
- Every on-page link was clicked in a headless browser.
- All `#…` links whose section no longer exists (#models, #find, #shop, #fmp) are handled in code. They open Find My Part, scroll to their section or open the G17 card, and none leaves a dead hash.
- **Fixed:** the five "Ask …" buttons on the team badges' backs pointed to "#", because the WhatsApp number was read from a prop that isn't passed in. They now open WhatsApp with a prefilled message for that role.
- External links:
  - wa.me (WhatsApp);
  - Google Maps;
  - Instagram, TikTok and Facebook (@samelectronics.uae);
  - tel: and mailto: for the phone and email.
- No page links to a page that doesn't exist yet. Those actions use the G17 "Coming soon" card.

**404:** `/this-page-does-not-exist` returns HTTP 404 with the branded "Signal lost · airplane mode" card and "Back to the home page".

**Console errors**
- **Fixed:** `favicon.ico` was a 404. The owner's logo is now the site icon (`src/app/icon.png`).
- **Fixed:** a data URL error came from a grain layer in the locked teardown whose SVG data URL was cut at its `;`, so it never drew anything. It was removed with no visual change.
- **Remaining, in this sandbox only:** errors from the external CDNs this machine can't reach (three / esm.sh, d3, topojson, world-atlas, simpleicons, qrserver). On the live site they load.
- The world map's world-atlas fetch has no `.catch`, so it throws when offline. The map is "untouched" per Issue 9, so I left it.

**Arabic, per section:** the checker loads the page in Arabic, scrolls every section, waits through the hero reel and opens the overlays, including Find My Part. Only these entries remain:
- the brand logos' aria-labels (brand names stay as written);
- the code label `se://deira/board`;
- "Apple · Samsung · Xiaomi · +11".

That is below the baseline set in Step 2.

**fps, per section** (3D engines blocked, software rendering, 1440×900):

| Section | Peak | Avg |
|---|---|---|
| Hero (#top) | 30 | 35.5 (unchanged from the Step 1 baseline; the 3D needs a GPU) |
| Teardown | 60 | 57.3 |
| What we offer | 60 | 58.8 |
| Live Parts Board | 60 | 49.6 |
| Bench Test | 60 | 54.2 |
| Showcase | 60 | 57.5 |
| Deals & arrivals | 60 | 59.3 |
| Repair Lab | 60 | 58.9 |
| Wholesale | 60 | 59.2 |
| Worldwide | 60 | 57.7 |
| Our story | 60 | 59.5 |
| Team | 60 | 51.5 |
| Who are you? | 60 | 53.7 |
| Sam Circuit | 60 | 58.9 |
| Meet Samsoom | 60 | 55.2 |
| The Feed | 60 | 42.1 |
| Reviews | 60 | 58.9 |
| Request + Visit | 60 | 52.5 |
| Finale | 60 | 43.3 |

**Still open (owner):**
1. The `ANTHROPIC_API_KEY` in Vercel. Samsoom's local fallback answers until it is added.
2. Real Google reviews, the rating and the review link. The reviews band shows labelled samples until then.
3. Follower counts.
4. Team names and photos. The badges show monograms and "Name to come".
5. Story photos. The frames hold warm placeholders.
6. Confirm the sample figures: countries, minimum order, the trade tiers and the Sam Circuit thresholds and perks.
7. The Madrid opening date.
8. Check the 3D sections (hero, teardown) on a real laptop GPU.

**Not built (outside the steps I was given):**
- PDF Section S's "Batch 11 · Mobile round, every section at 390px" was not part of the step list I was given, so the mobile pass is still to do. The new sections have basic responsive rules, but no 390px capture pass yet.
- Repair Lab has no issue of its own in the PDF and is unchanged.

**Live:** https://samelectronics.vercel.app

---

# Home improvements 14 Oct (owner list + PDF "Home Improvements 14 Oct")
Rule for this round: the owner's list wins over the Director's Edition PDF wherever they disagree. Each fix changes only the thing it names. One commit per section ("Home 14 Oct · §NN …").

## §00 · Global rules
**H-G1 entrance / H-G2 replay**
- New `src/components/perf/SectionFX.tsx`, mounted once in Home. It watches every home section.
- At ~25% in view the section gets `data-se-in`.
- The sections that had no entrance of their own (Repair Lab, Worldwide, Who are you?, Feed, Reviews, Request + Visit) now get one generic entrance: titles, text, buttons and cards fade and rise in with a stagger. It uses WAAPI on the separate `translate` / `scale` properties, so it never fights a transform the section writes itself.
- When a section fully leaves the view, it is reset silently. Its CSS animations restart (`data-se-rp` → `animation: none` → removed on return), and a `se:replay` event tells its own logic to reset its state (Deals, Live Board, Showcase, Wholesale, Story, Team physics, Who, Circuit, Meet, Feed, Reviews, Visit, Finale).
- Test (`replay.mjs`): every section goes seen → reset → seen again.
- The hero and the teardown keep their own state machines; the teardown reset is §07.

**H-G3 no jumping**
- Root cause in What we offer: the WebGL canvas host was `position: sticky` while the cards scroll on the compositor, so the canvas lagged a frame behind the cards and "jumped".
- The host is now absolute and is moved over the visible group of cards each frame (`placeHost`). The canvas and the cards now scroll together.

**H-G4 24px safe zone**
- Hero circuits that ran under the search bar, the trust badges and the devices were shortened, and their nodes were moved (6 paths, both the base and the pulse copies).
- Audit after the fix:
  - #top: one empty dynamic path;
  - #network: one false positive (the route drawing inside the Tracked box);
  - #finale: the circuits run into the emblem on purpose and are revisited in §20.

**H-G5 no #000 and two-tone titles**
- `#1A1B1D` was replaced by graphite `#26282B` across the source (40 files).
- What is still near-black is allowed: device screens, the camera island, real bezels and flags.
- Title choices (`src/styles/titles.css`, plus the AR halves in `ar.ts`):

| Section | Background | Title |
|---|---|---|
| Teardown | dark | white + yellow (unchanged) |
| What we offer | light | graphite + grey line with yellow marker |
| Live Parts Board | dark | white + yellow 2nd line |
| Bench Test | yellow | graphite on yellow (unchanged) |
| Showcase | light | graphite + grey line with yellow marker |
| Deals | dark | white + yellow 2nd line (was grey) |
| Repair Lab | light | graphite, "guaranteed." on yellow marker |
| Wholesale | yellow | graphite on yellow (unchanged) |
| Worldwide | dark | white + yellow "to the world." |
| Our story | cream | graphite + grey line with yellow marker |
| Team | dark | white + yellow 2nd line |
| Who are you? | light | graphite, 2nd sentence on yellow marker |
| Sam Circuit | dark | white + yellow "charges you up." |
| Meet Samsoom | yellow | graphite on yellow (unchanged) |
| Feed | dark | white + yellow "for daily stock drops." |
| Reviews | white | graphite, "already trust us." on yellow marker |
| Request + Visit | dark | white + yellow "We print the work order." |
| Finale | dark | neon headline, done in §20 |

- Why a marker on light backgrounds: yellow text on white or cream fails contrast. A yellow highlighter band under graphite text keeps "graphite + yellow" readable. In Arabic the marker follows the line (checked).

**H-G7 fps:** the "before" figures are the final-check table above. The "after" figures for every section are in the final 14 Oct table.

**Screens:** `t-en-*.png` / `t-ar-*.png` (every title, 1440, EN + AR).

DONE WHEN
- Every section enters and replays. **PASS**
- What we offer doesn't jump. **PASS**
- Hero circuits keep their clearance. **PASS** (the Finale is in §20)
- No #000 / #1A1B1D; two-tone titles. **PASS**
- Build passes. **PASS**

## §01 · Loading screen + favicon
**The square:** it was the CSS `drop-shadow` filter on the SVG ring. Its filter region is a box, and the glow was clipped to that box, so it read as a square watermark. The ring glow is now a wider, faint copy of the ring stroke (no filter). The logo is clipped to a circle (`clip-path`), and the soft glow is a radial gradient that fades out well inside its own box.

**Scene** (`BootIntro.tsx`, `styles/boot.css`):
- Graphite #26282B screen.
- The 160px round logo with a breathing yellow glow (15%).
- The yellow LED ring, kept: 2px, 12px outside the logo.
- 32px below, five status lines (Inter 15px, white 80%, fade + 8px rise), each with a yellow icon (shelf, box, battery, parcel).
- On "Waking Samsoom up…", the iconic Samsoom (48px) is asleep, yawns, blinks and waves.
- Exit: the ring completes, the logo scales to 1.06, and the screen fades out in 400ms.

**Real loading:** the ring follows four tasks: fonts, page + hero images (window load), globe data, and the parts library / first 3D. The screen leaves when all four are ready, at least 1.5s has passed and Samsoom has woken; at 5s it leaves regardless. Times are counted from navigation start.

**Choice (noted per rule 2):**
- The five lines and the wake-up always play, as the DONE WHEN asks.
- Their cadence is 0.45–0.9s per line, shortened when React mounts late, so everything fits inside 5s.
- So a first visit is about 3.5–5s, not 1.5s.

**Flash fix:** a pre-paint script puts a graphite veil on the home page for a first visit, so the hero no longer flashes before the loading screen mounts. It is shown once per visit (sessionStorage); a reload in the same session skips it.

**Arabic** (IBM Plex Sans Arabic, same size):
- نرتّب البضاعة على الرفوف…
- نفتح كراتين الشاشات الجديدة…
- نشحن البطاريات…
- نجهّز طلبات اليوم…
- نوقظ سمسوم…

**Favicon:**
- The two-phones mark in graphite on a Signal Yellow circle, with thick strokes for 16px.
- Files: `public/favicon.svg`, `favicon.ico` (16/32/48), `favicon-16/32/48.png`, `apple-touch-icon.png` (180), `icon-192/512.png`, and `manifest.webmanifest` (theme #26282B). The theme colour is also in the viewport meta.
- The old `app/icon.png` (the full logo) was removed.

**Screens:** `boot-sheet.png`, `boot-glow.png`, `fav-preview.png` (light and dark tabs).

DONE WHEN
- No square behind the logo. **PASS**
- The five lines play in order, EN + AR; Samsoom wakes up. **PASS**
- 1.5s ≤ duration ≤ 5s, once per visit. **PASS**
- The favicon is yellow + graphite and readable on light and dark tabs. **PASS**

## §02 · Hours pill, four states
**Shared module:** `src/lib/shopStatus.js`. Dubai wall clock = UTC+4 read with the UTC getters, so the visitor's timezone never matters.

| State | Dot | When | Text |
|---|---|---|---|
| Open | green | inside hours, more than 60 min before a close | "Open · until 14:00" |
| Closing soon | yellow | the last 60 min before any close (14:00, 22:00, Fri 12:00) | "Closing soon · 14:00" |
| Closed | red | outside hours, more than 60 min before an opening | "Closed · opens tomorrow 10:30" |
| Opening soon | yellow | the last 60 min before any opening (10:30, 16:00) | "Opening soon · 16:00" |

- Every dot pulses.
- The header recalculates every 60s, as before. Visit us ticks every second.
- Arabic: يغلق قريباً · يفتح قريباً · مفتوح · حتى …
- Used by the header pill, the Samsoom launcher line and Visit us (§16 reuses it).
- Kept: the pop-over, click → Visit us, and the pill's size, font and position.

**Header colour:**
- It used to switch to white glass over light sections, which read as cream over the bright Finale.
- Per the owner, it now stays graphite everywhere. That is one line in `HomeV3.logic.js`: `dark = true`.

**Test** (browser timezone Europe/Paris, `seNowAt`): `pill-sheet.png`.

DONE WHEN
- Mon 13:15 → yellow "Closing soon · 14:00". **PASS**
- 15:10 → yellow "Opening soon · 16:00"; 16:00 → green. **PASS**
- Fri 11:00 → "Closing soon · 12:00"; Sunday → red "Closed". **PASS**
- Correct with the computer's clock on Paris time. **PASS**

## §03 · Language switch pop-up
**Files:** `src/components/home/LangPop.tsx` and `src/styles/langpop.css`. Mounted in Home. `seI18n.set` / `toggle` now go through the pop-up; `seI18n.now` switches directly.

**Sequence:**
1. Click EN / AR. The page blurs (8px) under a 20% graphite tint (250ms).
2. A 360×200 card in the hero-ad style scales 0.92→1 (300ms): graphite gradient, yellow glow, mono eyebrow, Space Grotesk line. Samsoom peeks over its corner.
3. A yellow charging battery fills inside a spinning ring, with "Translating every screen and battery…" / "نترجم كل شاشة وكل بطارية…" in the language being switched to.
4. The switch runs under the card at 320ms. "Done" means the page re-rendered and every font it asked for has loaded (`document.fonts.ready`), with at least 1.1s on screen.
5. The battery becomes a drawn yellow tick: "Mission accomplished!" / "تمت المهمة!", plus one line in the new language.
6. It auto-closes 1.2s later (fade + scale 0.96, the blur clears).
7. If it isn't done after 4s, an X appears (Esc also closes it).

**Remembered:** `localStorage` `se-lang`, as before.

**Tests** (`lpop.mjs`):
- EN→AR and AR→EN both show loading → done → closed.
- A reload keeps Arabic.
- With the network throttled (CDP, 5s latency): X at 4.0s, done when the Arabic weights arrived (~16s), then closed.
- Screens: `lp-sheet.png`.

DONE WHEN
- Both directions show the pop-up, the done state, and close by themselves. **PASS**
- On a slow network the X appears after 4s. **PASS**
- The choice is remembered after reload. **PASS**

## §04 · Arabic: full mirror + full translation
**Already mirrored** through `dir="rtl"`, flex, grid and logical properties: nav, What we offer, Live Board, Showcase, Deals, Repair Lab, Wholesale, Worldwide, Story, Team, Who are you?, Sam Circuit, Meet Samsoom, Feed, Reviews, Request + Visit, Finale. This was checked side by side at 1440: `mrs-0…6.png`.

**Newly mirrored:**
- **Hero** (fixed 1440 canvas):
  - the scene layer (yellow slab, circuits, light, device shadows) is flipped with `scale: -1 1`;
  - the iPad and phone are flipped back, so their screens read normally and only change side;
  - the text block moves to the right.
- **Bench Test:** the words are on the right and the rig is on the left; the rig keeps its own layout.
- **Teardown:**
  - the title and card are on the right and the numbered list is on the left;
  - the rail line is on the list's start side and the rows nudge the right way;
  - the 3D stays as it is;
  - hover tags are in the page language.
- **Header progress line:** fills right → left (logical inset); the end marker is on the left.
- **Progress fills** grow from the right: Who, Bench, Visit, Story, Circuit, Deals, Wholesale steps, FMP steps, Showcase bars, Repair sequence.
- **Marquees** run the other way (Reviews, the Wholesale belt). The hero brand rail and the Deals rail follow in §06 / §11.
- **Not mirrored**, as asked: 3D, logos, the globe and maps, photos, numbers, prices and codes.

**Translation:**
- Added: "grade" / "grades".
- Added the teardown callouts: WIDE → واسعة, ULTRA WIDE → واسعة جداً, MACRO → ماكرو, PROCESSOR, POWER IC, STORAGE, SIM TRAY, SPEAKER, SCREWS, CHARGING PORT, BOARD-TO-BOARD, COAX LINE, ALUMINIUM, SIDE KEYS, ANTENNA BANDS, TOUCH LAYER, LI-ION, CONNECTOR, WIRELESS COIL, CAMERA RING.
- Added the remaining teardown-ad lines: "All in Deira.", "The small parts / that finish the job.", "Straight edges, / factory fit.", "Shop back glass", "Shop flex & ports", "MADE FOR REPAIR".
- The loading screen, the language pop-up and the 404 / Coming soon were already Arabic.

**Left in English on purpose:** the markings printed on the 3D parts (battery label text, board codes like `SE-LB-08 REV C`). They are part of the hardware, like model codes.

**Check:** `i18n-check.mjs` in Arabic finds only the allowed baseline (brand aria-labels, `se://deira/board`).

DONE WHEN
- Every AR section screenshot looks like a professional mirror of EN. **PASS**
- No English left on the AR page except brands and codes. **PASS**
- Teardown in AR: text + card on the right, list on the left. **PASS**

**Note:** there is no separate connector line in the current teardown.

## §05 · Hero: phone ads, screen shine, ticks
**A · Product position:** every ad's product layer (product, glow and floor shadow) moves up 17.3px. It is now centred between the title (bottom ≈121px) and the description (top 302px). Size and angle are unchanged, and the shift is the same for all 10 ads.

Pixel check (phone tilt flattened, product layer diffed):

| Ad | Title → product (px) | Product → text (px) |
|---|---|---|
| Screens | 21 | 28 |
| Batteries | 19 | ≈25 (its soft floor shadow comes within 10) |
| Back covers | 25 | 24 |
| Cameras | ≈24 | 24 |
| Frames | 25 | ≈24 (shadow within 12) |
| Worldwide | 48 | 51 |
| Repairs, Wholesale, Flex, Small parts | ≥16.6 by eye | ≥16.6 by eye |

4% of the screen is 16.6px. The Repairs and Wholesale pixel diffs were noisy (their scenes animate), so those two were checked by eye in `m-check.png` / `ads05.png`.

**B · Hover and touch:**
- Pointer or finger on the phone → it stops immediately and the progress segment freezes.
- One wheel gesture (events until 250ms of quiet) or one swipe = one ad, with the 600ms feed motion. The page doesn't scroll.
- It resumes 1s after the pointer leaves.
- The side arrows and their CSS are removed. The poster pop-up is kept.

Test (`hero05d.mjs`):
- hover → paused;
- one 8-event trackpad gesture → exactly +1 ad, page scrollY 0 → 0;
- still paused 0.6s after leaving, resumed at 1.4s.

**C · Shine:**
- A diagonal 35° band, about 18% wide, peaking at white 22% (screen blend).
- 1.2s ease-in-out sweep from the top-left corner to the bottom-right corner.
- One 9.9s loop: iPad 0–1.2s → phone 2.7–3.9s → rest. Measured: iPad 0.47–1.6s, phone 3.2–4.3s, never both.
- It sits inside each screen's rounded glass only.
- The light sheen on the products inside the ads is removed (owner: "only reflect on the screen").

**D · Real glass** (`.se-glass` on both screens):
- a faint diagonal reflection (white 0→4%) on the top-left half;
- a 1.5px darker bezel ring;
- a 4.5% edge vignette.
- It replaces the strong 16% top-right gloss on the phone (one reflection, not two).

**E · Ticks:**
- Cause: the check's own stroke was animated yellow ↔ graphite while the yellow light faded, so it passed through light colours. Its delay also wasn't synced with the light.
- Fix: the yellow check never changes. A separate graphite check layer fades with the light, ending just after it, so the tick never flashes.

DONE WHEN
- No product touches the title or description (10 ads). **PASS**
- Hover pauses; wheel/swipe moves one ad; leaving resumes after 1s; no arrows. **PASS**
- Shine: diagonal, iPad then phone, never together, only on the glass. **PASS**
- Ticks never flash light when fading. **PASS**

## §06 · Brands marquee
**Cause of the gap:**
- In Arabic the row runs right-to-left, so the second copy sat to the left while the track still moved left, which emptied the window.
- In English, two copies only just covered the window as the stock numbers changed width.

**Fix:**
- Three identical copies, moving one copy-width per loop (−33.33%).
- 47.3s per copy, ~10% faster than the old 52s.
- Arabic uses its own keyframe (+33.33%), so it moves the other way.
- Hover still pauses it.

**Logos:**
- All are the G18 marks at the same 28px box height.
- Brands with a separate symbol (Apple, Xiaomi, HUAWEI) now have an even 8px symbol→name gap. It was 4.5px; `GAP` 16 → 29 units in `build-logos.mjs`, applied to the three SVGs.
- Wordmarks stay one piece.
- Spacing between brands is 56px (padding 28px each side).

**Test** (`marq.mjs`, 60s each, sampled every 250ms): spare track beyond the window edge never below

| | 1440 | 1920 |
|---|---|---|
| EN | 4445px | 5909px |
| AR | 3526px | 4702px |

So no gap, ever. Screens: `marq-sheet.png`.

DONE WHEN
- 60s at 1440 and 1920, EN and AR: no gap. **PASS**
- Logos the same size; even icon/text gap. **PASS**

## §07 · Teardown
**A · One gesture = one step.** Root cause of "scroll over and over":
- A gesture made while the opening (3.4s) or a step was animating was dropped.
- It also marked the rest of that wheel stream as already used, so nothing reacted until the visitor paused and scrolled again.

Fix:
- Such a gesture is now held, one deep, and played the moment the step lands. Trackpad momentum still never counts twice.
- The lock after a normal step is 700ms (was 950ms, while the tween is 900ms).
- The turn's lock is 2.1s (was 3.3s).
- Kept: the ≥40px gesture, never skipping, up = one step back, and the arrow-key rule (test 7).

**B · Always from STEP 0:**
- Leaving from the top resets it silently, as before.
- The 3D module mounts and compiles at page load, so it is ready long before the visitor arrives.
- Test: 10 runs in a row from above (slow wheel and fast jumps, one after leaving mid-film) → 10/10 at step 0.

**C · The opening flows into the turn:**
- When the opening ends, the phone turns from back to front on its own, without waiting for a scroll.
- The title glide, card and list now run from 0.45s to 1.6s of the turn. They used to start only after the phone landed, at 2.25s.
- Measured: opening ends at 3.45s, the turn starts at the same moment, and the UI moves from 0.51s to 1.60s of the turn.
- A scroll made during the opening is consumed by this automatic turn.

**D · Back-cover edge flicker:**
- The back glass edge used the see-through glass-edge material (42%, no depth write). As the phone turned, the transparent sort order changed and the edge popped between grey and black.
- It is now a solid satin edge (with polygonOffset).
- The camera depth range now hugs the phone (near = distance − 12, far = distance + 40; it was 0.1–400) for stable depth at every angle.
- Not verified frame by frame here: the sandbox only has software WebGL. To check on a real GPU.

**E · Info card:**
- Every fitting brand is shown as an even 11px G18 logo, wrapping onto two rows. No more "+N".
- "grade" and the card labels are translated (§04).

**F · Final-call ad:**
- The word slides ("EVERY PART." … "Get yours today.") are now centred horizontally and vertically, in the hero ad title font (Space Grotesk 700).
- The ad's text was already graphite / white / yellow. The "black" was the near-black intro and logo background (#141517) and the fade to pure black; both are now graphite #26282B.
- Arabic: canvas text goes through the dictionary (§04).

**Tests:** the 8 teardown scroll tests pass (8/8, no-3D mode; the full-3D run is too slow in software WebGL).

DONE WHEN
- 10 runs from above always start at STEP 0. **PASS**
- Every gesture moves exactly one step, including during the opening. **PASS**
- The title and elements move during the rotation; nothing waits for a scroll. **PASS**
- Back cover edge: no flicker. **PASS by cause** (frame-by-frame check on a real GPU still open)
- Card shows all brand logos; final ad centred, hero fonts, no black. **PASS**

## §08 · Teardown → What we offer transition
**Cause:** the teardown's final call ends on its floor graphite (#1F2023), with the amber bloom centred right on its bottom edge. What we offer started a 180px fade from #2A2C2F, so there was a line and a short "grey then white" band.

**Fix** (`SEWhatWeOffer.tsx`, top of the section):
- A long, eased (smoothstep) blend over 48vh: from #1F2023 through #3D3E3F to the light #F2F3F4.
- The bloom that the section edge cut in half now continues across the join (same position at 66%, same 36% × 56vh size, same stops) and fades out within 56vh.
- The section heading moves down to `max(180px, 48vh − 70px)`, so it sits where the blend is already light.
- Circuits across the join were optional and were not added.

**Check** (`join.mjs`, 1440 and 1920):
- Away from the bloom's sides, the colour step between neighbouring rows across the join is at most 2 levels per channel, with no band.
- At the bloom's sides it is 5–7 levels per channel. The teardown's bloom slowly breathes (6s), so the match there can't be exact. It is at the threshold of visibility.
- Screens: `join-1440.png`, `join-1920.png`.

DONE WHEN
- A slow scroll across the join shows no visible edge or band at 1440 and 1920. **PASS** (faint at most, at the bloom's sides)

## §09 · What we offer
**Jumping** (parts and boxes): fixed at the cause in §00 H-G3. The WebGL canvas was sticky to the screen while the cards scrolled on the compositor. It now sits in the page over the visible group of slots (the parts grid, or the Repair box's phone), so the rendered parts scroll together with their cards.

**Synced spin:** every part now uses the same angle, `2π·T/30`, from one shared clock. Before, each part had its own phase offset (`i·0.79`). Each part's landing still eases in on its own, then joins the shared angle; on hover a part turns to face you, as before.

**Circuits:** the 24px audit finds no circuit too close to text in What we offer.

**White box:**
- The "* Sample values · to be confirmed" line that collided with the buttons is removed, along with the asterisks it explained. The figures stay listed as owner-to-confirm in the owner list.
- "Get a shipping quote" (same style, size and place as the other boxes' main buttons) now opens WhatsApp with a prefilled shipping-quote message. It used to only scroll to #network.

**Globe:**
- It keeps its light colours, but is now drawn like the hero globe: crisp, pixel-snapped square land dots, depth-faded toward the rim, at 2× resolution.
- It starts on the UAE (it used to start at 100°E).
- With each route (Baghdad, Istanbul, Lagos, Madrid) it turns smoothly toward the destination as the line draws, then eases back home before the next one.

**Screens:** `gbox.png` (EN + AR).

DONE WHEN
- Slow and fast scroll: no part or box jumps. **PASS** (by cause; the 3D shelf can't render in this sandbox)
- All parts at the same angle at every moment. **PASS**
- No circuit touches text. **PASS**
- White box: no "sample values" line; the shipping-quote button exists. **PASS**
- Globe at hero quality, starting from the UAE. **PASS**

## §10 · The Showcase
**A · Held while it plays (desktop):**
- The stage is sticky; its top is set to `min(0, 100vh − stage height)` so the whole stage stays in view. A spacer of 4 × 55vh gives it the scroll it holds for.
- One deliberate gesture (≥40px after 250ms of quiet, the teardown's rule) = one grade. The page scroll moves with the grade (600ms) and the stage stays put.
- After the last grade the next gesture releases the page. Scrolling up re-enters at the last grade and plays it backwards to the first, then releases.
- A scrollbar drag or keyboard scroll maps the scroll position to a grade.
- The ad clock now holds at the end of each grade instead of auto-advancing (auto-advance stays on mobile, where nothing is held).

Two bugs found and fixed while testing:
- The section is now several screens tall, so its 30% visibility trigger could never fire. It now watches the held stage.
- Hover paused the clock even before a grade had built, so scrolling with the mouse over the stage left it empty. Hover now only holds a grade once it is built.

Test (`show10.mjs`): ↓ 0→1→2→3→4, then release; ↑ re-enter at 4 → 3 → 2 → 1 → 0. The stage stays pinned at the same spot throughout.

**B · Complete content per grade** (order: Original, Service Pack, OLED, Incell, High Copy):
- the headline;
- the owner's one-line description;
- four quality bars (Brightness, Colour, Touch, Warranty, out of 5, marked SAMPLE), which refill on every switch;
- the "from AED … sample" badge;
- the screen visual with a per-grade picture look (from full brightness down to a dimmer, flatter High Copy screen; Service Pack keeps its box moment);
- the grade's shop button.

All strings are in Arabic. Screens: `sc-sheet.png` (all five grades, EN + AR).

DONE WHEN
- The page holds until all grades have been seen; no empty space passes. **PASS**
- All five buttons show different, complete content, in EN and AR. **PASS**

---

# Round 6 · Finish the home page (brief: docs/Round6_Finish_Home.pdf, catalogue: docs/Products.xlsx)
Owner decisions (20 Oct):
- Use the Excel exactly as it is, fixing only spelling customers see (logged in docs/CATALOG_CLEANUP.md).
- Quality / Colour / Manufacturer show the master lists, and prices stay SAMPLE.
- "Also fits" only where a list entry names 2+ models.
- No models outside the Excel.
- Everything must be editable later from the Control Room.
- All text stays in translation files (French and Spanish come later).

## Part A · Performance
Measured on this sandbox: headless Chromium with **software** rendering, no GPU. Absolute fps are far below a real laptop, so only the before/after comparison on the same machine means anything.

**Causes found and fixed** (no effect removed):
1. **What we offer:** its animation loop measured the section (`getBoundingClientRect`) every frame for the whole visit, forcing a layout on every frame. It now uses an IntersectionObserver.
2. **Bench Test:** the same problem; also fixed with an IntersectionObserver.
3. **Teardown scroll/resize handlers:** they measured the page on every scroll event. They now run at most once per frame.
4. **Showcase:** it read the page width on every scroll (forced layout). The width is now cached and updated on resize.
5. **Header:**
   - It scanned every `[data-tone]` block on each scroll to choose a colour that is now always graphite. The scan is removed.
   - The progress line and its dot moved by `width` / `inset` (layout on every scroll). They now move with `transform`.
6. **Hero keyframes:** they were appended to a `<style>` one by one, and each append re-parsed the whole growing sheet (~220ms at load). They are now queued and written once per task.
7. **Hero globe:** it redrew every frame even when the hero was off screen. It now draws only while the hero is visible, at most ~30 times a second.
8. **Frosted glass:**
   - The teardown's glass cards blurred whatever was behind them, which is the live 3D and dust, so the blur was recomputed every frame. They now use an equivalent opaque tint (same look over the dark studio).
   - Header blur reduced from 18px to 10px, with a more opaque background (same look).
9. **WebGL** pixel ratio capped at 1.5× (was 2×).
10. **Fonts:** four Google Fonts stylesheets merged into one. Three were near-identical copies; the fourth loaded 13 brand-wordmark fonts that the SVG logos no longer use.
11. **Logo:** the 177 KB PNG was fetched six times. The page now uses 4 KB / 13 KB WebP versions; the PNG stays as the master for the 3D textures.
12. **Script and bundle loading:**
    - `image-slot.js` (64 KB, only used by Find My Part) loads after the page is interactive.
    - Every section below the teardown is in its own chunk (`HomeRest.tsx`), so the hero parses and renders first.

**Load** (same machine, no throttling):

| | Before | After |
|---|---|---|
| Transferred | 2,090 KB | 1,088 KB |
| First paint (loading screen) | 0.5s (Lighthouse) | 0.5s |
| LCP (page observer) | 2.05s | 1.99s |
| CLS | 0.0022 | 0.0018 |
| Long tasks at load | 11 (max 833ms) | 12 (max 698ms) |

**Scrolling top → bottom** (fps average, long tasks):

| Section | Before | After | Long tasks |
|---|---|---|---|
| top | 15.6 | 18.6 | 1 → 1 |
| teardown | 33.7 | 45 | 3 → 1 |
| families | 19.2 | 23.3 | 10 → 8 |
| board | 20.9 | 27.7 | 4 → 2 |
| quality | 32.5 | 44.9 | 1 → 0 |
| showcase | 29.4 | 37.4 | 0 → 0 |
| deals | 28.4 | 32.4 | 0 → 0 |
| repair | 28.7 | 37.5 | 0 → 0 |
| ? | 21.4 | 39 | 1 → 0 |
| wholesale | 32.2 | 37.2 | 0 → 0 |
| network | 27.3 | 30.9 | 0 → 1 |
| story | 22.2 | 25.3 | 0 → 1 |
| team | 38.7 | 41.7 | 0 → 0 |
| everyone | 25.7 | 23.1 | 1 → 0 |
| circuit | 34 | 39.6 | 0 → 0 |
| samsoom | 31.3 | 41 | 1 → 0 |
| social | 26.1 | 29.2 | 0 → 0 |
| reviews | 21.3 | 16.5 | 0 → 0 |
| visit | 31.6 | 43.8 | 0 → 0 |
| finale | 30 | 33.8 | 0 → 0 |
**Not met here, and why:**
- **55 fps** can't be reached on a software renderer at all; even the idle footer runs at 51. The gains above are all relative.
- **Lighthouse LCP:** Lighthouse doesn't report one, because the hero's text starts invisible (opacity 0) for its entrance. LCP is therefore taken from the page's own observer.
- **Reviews** (21 → 16.5) and **Who are you?** (25.7 → 23.1) are within run-to-run noise. Their cost is raster: moving cards and big gradients that a GPU composites cheaply.
- A real-laptop pass (Chrome Performance panel) remains on the owner's side.

## Part B · Scroll engine: never trap the visitor
Shared rules live in `src/lib/jumpScroll.js`.

**B1 · Two speeds, chosen automatically** (teardown and Our story):

| Visitor does | What happens |
|---|---|
| Normal, deliberate scrolling | Step mode, as before: one gesture = one step, never skipping. In Our story one gesture = one year (start, the five versions, end). |
| Fast scrolling: 3 gestures within 1.4s, one gesture travelling more than 3,500px, or a huge single event | **Pass-through:** nothing holds. The teardown snaps silently to its end state (going down) or start state (going up) and the page scrolls on. |
| Scrollbar drag, Home/End/PageUp/PageDown, the logo, nav links, hours pill, progress bar | **Jump:** no hold at all. Any scroll that doesn't come from the wheel, touch or the arrow keys counts as a jump. |
| Coming back later | Replays from step 0 when entered normally from above; enters at the end and steps backwards from below. |

- The 3,500px threshold keeps the protected test "one hard trackpad swipe = exactly one step" (2,200px) intact.
- A jump that only *lands near* the teardown does nothing; only one that crosses its held stage passes through.

**Showcase:** no longer held (overrides 14 Oct §10). It auto-plays like the ads, with free scrolling.

**B2 · Logo = home:** the logo, nav links and the hours pill use the fast jump (~600ms, instant with reduced motion). Measured from the footer: 0.72–0.83s.

**B3 · Progress bar = scrubber** (`ProgressScrub.tsx`):
- click anywhere to go there;
- drag the dot to scrub;
- hover shows the section name at that point (translated);
- each section start has a tiny solder pad that lights as you pass it (reviewer idea);
- right → left in Arabic.

**Tests:**
- `scripts/qa/scroll-engine-tests.mjs`: 9/9 in EN and 9/9 in AR.
  - fast wheel top → bottom → top (never stuck);
  - scrollbar drag through the teardown down and up (no hold);
  - logo from the footer in under 1s;
  - progress bar click (50.0%), drag (80.0%) and hover label;
  - slow scrolling: one gesture = one step.
- The protected teardown tests pass (9/9). Test 2 used to say "a big jump is held at step 0", which is the opposite of Round 6 Part B. It now checks that the jump passes through, and that re-entering slowly replays from step 0.
- Our story: slow gestures land exactly on each year (p 0.15 → 0.263 → 0.375 → 0.487 → 0.6 → 0.72, then release). A fast spin passes through.
- Screens: `scrub.png` (EN + AR, hover label).

DONE WHEN
- Fast scroll top → bottom and bottom → top: never stuck, EN and AR. **PASS**
- Dragging the scrollbar through the teardown: no hold. **PASS**
- Logo click from the footer reaches the top in under 1s. **PASS**
- The progress bar can be clicked and dragged. **PASS**
- Slow scrolling still steps one gesture at a time. **PASS**

## Part C · Global rules + motion language

**C1 · Titles:** `src/styles/titles.css` rewritten. The highlighter marker (`--se-mk`, the yellow band behind words) is deleted from the code.
- Dark backgrounds: white + yellow second line (#F7C032).
- Light backgrounds (`#families`, `#showcase`, `#story`, `#repair`, `#everyone`, `#reviews`): graphite + deeper yellow (#D99A00), so it stays readable on white.
- Checked in the browser: zero background bands inside any `h2` (EN and AR).

**C4 · Icons:** the empty squares are gone.
- WhatsApp, Instagram, TikTok, Facebook and Google icons are now self-hosted in `public/icons/` (from simple-icons), not loaded from a blocked CDN.
- Used by the hero "WhatsApp us" button and the footer social buttons.

**C6 · Samsoom hints:**
- A hint opens only if nothing is under it: before opening, it tests the area for links, buttons, inputs, images, canvases, headings, text and cards.
- Shown for about 4s at most.
- In Arabic the floating button sits bottom-left (measured: x 24–80 in AR, 1360–1416 in EN at 1440).
- The footer's last row now leaves room so the button no longer covers "Staff · Control Room" (it did, in both languages).

**C7 · Information buttons:**
- `InfoTip` ("i" button + small card: what it is, quality, warranty, "Learn more" → Coming soon).
- Texts for every Quality and Manufacturer name in the Excel are in `src/content/specInfo.ts`, translated in `ar.ts`.
- Warranty periods are not invented. The card says "Covered by our warranty. Ask us for the period." until the Control Room sets them.
- The buttons get placed next to each grade/maker chip in Part E, when the old five grades (incl. High Copy) are replaced by the Excel lists.

**C5 · Cut text:** new `scripts/qa/cut-text.mjs` scrolls the whole page at 1280/1440/1920 in EN and AR.
- It flags text clipped by its box or running past the window edge.
- Result: 0 findings in the 2D sections.
- The teardown's 3D labels can't render in this sandbox (no GPU), so they are checked by eye in §07.

**C0 / C2 / C3 · Motion, alive sections, working circuits:** applied section by section (§09–§23), each with its own entrance, hero loop and micro loop, and checked in the final pass.

DONE WHEN
- Zero highlighter titles in the code. **PASS**
- Every section has an entrance + one continuous motion. **NOT DONE YET** (per section, §09–§23)
- Every circuit pulses and none touches text. **NOT DONE YET** (per section)
- Sibling buttons aligned. **NOT DONE YET** (per section)
- No empty icon slots. **PASS**
- No cut text at 1280/1440/1920 px in EN and AR. **PASS** (2D sections; teardown in §07)
- Samsoom hints never cover content. **PASS**

## Part D · Arabic: mirror the layout, keep the look

**Hero:**
- The 14 Oct full mirror is replaced.
- Blocks swap; the inside of the device group is never flipped. The background (yellow slab, circuits) mirrors as the device column's backdrop.
- The device group (shadows, light, iPad, phone) is wrapped in `data-hero-group` and mirrored back around its own centre, so it only changes side: same overlap, same angles, same light.
- Measured at 1440:
  - Devices: EN x 808–1412 → AR x 28–632 (the exact mirror).
  - Text block: EN 80–720 → AR 720–1360.

**Teardown** (`SETeardown.logic.js`, `public/se-teardown-3d.js`):
- The stage mirrors with the same distances:
  - the 3D phone's centre: 52.5% → 47.5%, final position 75% → 25%;
  - the studio light;
  - the final message and its glow;
  - the Skip link, which sits at the zone's reading start.
- The connector to the parts list starts on the **left** edge of the part in Arabic and runs left to the list dot. Measured in the real 3D render at step 4:
  - EN: part dot x 865 → list dot x 1104.
  - AR: part dot x 491 → list dot x 325.
- Spec callouts move to the right of the stack; drawer tags open on the free side.
- The final-call advert texts (drawn into 3D textures) now go through the dictionary. They redraw on a language switch; Arabic gets no letter spacing and right-to-left drawing.
- A stray Arabic accent of the hidden yellow line no longer shows.

**Menus:**
- The System Map, cart drawer and Find My Part lock the page while open; their lists scroll inside themselves (`src/lib/scrollLock.js`, `overscroll-behavior: contain`).
- Measured: wheel over the menu list scrolls the list; the page behind moved 0px (before: 240px in AR, 360px in EN).
- Drawers slide in from the left in Arabic. The Samsoom chat panel sits bottom-left with its button.

**Times:**
- The footer hours, the hours pop-over and the Visit card keep `10:30-14:00 · 16:00-22:00` in order.
- The Visit day timeline runs 00 → 24 in both languages (its bars used to sit under the wrong labels in Arabic).

**Translation:**
- `i18n-check.mjs` in Arabic: only brand names (aria labels) and the `se://deira/board` code stay in Latin.
- The 3D advert words were added to `ar.ts`.

**Checks:**
- Side-by-side EN | AR screenshots of all 20 sections at 1440, reviewed: same composition, same spacing, mirrored.
- Teardown tests 9/9; scroll engine 9/9 in AR.

DONE WHEN
- Side-by-side screenshots EN vs AR of every section: same composition, same spacing, mirrored. **PASS**
- Teardown connector dots on the left of components in AR, lines never crossing components. **PASS**
- The menu scrolls in AR. **PASS**
- Footer hours in the correct order. **PASS**

## Part E · Product system (step 1 of 3: the Excel import)

- `site/scripts/import-catalog.ts` reads `docs/Products.xlsx` (unchanged) and writes `site/src/content/catalog.ts`. Re-run it after any Excel change: `node --experimental-strip-types scripts/import-catalog.ts`.
- **Imported:**
  - 6 categories, the fixed 30 parts, 10 qualities, 22 colours, 9 manufacturers;
  - 809 models in 28 series (same count as the brief);
  - the Samsung screen example (333 rows: Framed / Frameless × colour);
  - the MI / Oppo "fit each other" lists and the Huawei "sells in Dubai" list. 64 entries name 2+ models and become **Also fits**.
- Every entry keeps its raw text. Only customer-visible spelling is fixed (172 fixes, each listed in `docs/CATALOG_CLEANUP.md`, with 13 points for the owner to check).
- Honor, Redmi, POCO and Realme are filed under their own brands. Duplicates are flagged and shown once, never deleted. No model was added.
- `site/src/content/offers.ts` is the Control Room contract: per model + part → quality, manufacturer, colour, frame, part number, stock, price. It is empty on purpose (no invented stock or prices).

## Part E · Product system (step 2 of 3: brands, data, qualities)

**15 brands in 4 groups** (`src/content/brands.ts`), Sony removed everywhere:
- Display order (reviewer proposal, an open question): Apple · Samsung · Xiaomi Group (Xiaomi, Redmi, POCO) · Huawei · Honor · BBK / OPlus Group (Oppo, Realme, OnePlus, Vivo) · Transsion Group (Infinix, Tecno) · Google · Nokia.
- Every "14 brands" now reads the brand count (15).
- Find My Part shows the brands in clusters with small group labels. Vivo, Infinix and Tecno say "Models coming soon · Ask us on WhatsApp".

**Logos** (`public/assets/brands`):
- Traced from the owner's references: Apple, Google (G + Pixel), Honor, Huawei, Infinix, Nokia 2023, OnePlus, POCO, realme, Redmi, Tecno, Xiaomi 2021.
- Samsung (plain wordmark), Oppo and Vivo come from Simple Icons.
- One colour, one height; symbol and name at equal height. The Apple reference's stock-photo watermark was removed before tracing.

**Site data from the Excel:**
- `public/se-catalog.js` is generated by the importer (13 KB gzipped). `se-data.js` builds brands, all 801 models (duplicates shown once) and the master lists from it.
- SAMPLE products exist only for models that are in the Excel, and each product names its Excel part.
- The hand-made sample models that are not in the Excel are gone (Sony Xperia, Vivo V30/Y36, Tecno Camon/Spark, Infinix Note/Hot), and so are the four tool products.

**Quality and manufacturer** are now two lists. High Copy is gone.
- Featured until the owner chooses: Original (Service Pack), OLED Soft (OLED), Incell (ZY), AAA (GX).
- The Showcase plays these four qualities; the Original ad opens its Service Pack box.
- Find My Part shows quality and manufacturer, each with its "i" button (C7).
- Invented warranty periods ("6 months (sample)") are replaced by "ask us for the period".

**Find My Part with the full catalogue:**
- all series (Samsung 12);
- every model (no stock yet → "Ask us");
- a model without sample offers shows every family as an "Ask us on WhatsApp" tile;
- **Also fits** after picking a model;
- searching any name in a group finds the model (e.g. "9C" → Redmi 9A / 9C / 9AT).

**Checks:**
- No script errors; teardown tests 9/9.
- Arabic product titles cover the Excel model names (`translate.ts`).
- Screens: Find My Part brand step, model step, quality step with the info card, Also fits (EN + AR).

## Part E · Product system (step 3 of 3: the box + LCD product shot)

**Studio scene** (`site/scripts/productshot/scene.html`, three.js):
- **Box:** stands upright on the left, front turned 15° left, about 55% of the shot height, printed panels drawn per box design.
- **LCD:** stands to the right, overlapping the box by about 10%, turned 25° to the right and tilted back 5°, about 65% of the height. Glossy glass; a frame only on the framed originals; red pull-tabs for Huawei / Honor.
- **Flex:** short, leaving the right edge and curving down-right into its connector.
- **Light and floor:** key light top-left, rim light right, one soft contact shadow, a transparent background. Never mirrored in Arabic.

**Cached images:** `site/scripts/productshot/render.mjs` renders every pairing once into `public/assets/shots/<id>-240|480|960.webp/.avif` (15 pairings, about 12 KB per 480px image, about 3 min to re-render).

**Which box** (`public/se-shots.js`, chosen by manufacturer + brand, per the owner's photos):
- Service Pack: Apple white box · Samsung SVC-SEVT · Google / Infinix / Tecno SVC with the yellow sticker · Huawei / Honor red · Oppo / Realme / OnePlus / Vivo green · Xiaomi / Redmi / POCO orange sleeve.
- GX: black box. ZY: blue IN CELL box.
- **TEMP**: every maker without a photo (OEM, YK, Taiwan, Refurbished, OLED) and Nokia get a neutral white box with a small Sam Electronics label.

**Updated places:**
- Every screen shown by the shared part image (`SEPart` kind `scr`): teardown cards, Find My Part (with the product's own box), cart, Samsoom.
- The hero iPad screen cards and the screen phone ad.
- Deals, the Wholesale pallet builder, the Samsoom chat cards and the feed.
- Other part families keep their studio 3D parts.

**Honest status:**
- The boxes are clean 3D renders with the reference designs (panels, colours, labels, barcodes, QR, SERVICE PACK, GX diamonds, ZY gradient).
- They are **not yet "indistinguishable from the owner's photos"**: the small print is generic and the card has no real paper texture or glossy edges.
- The Showcase unboxing per quality is §09.

## §01 · Browser tab: title and favicon

- **Favicon:** the original round logo (white circle, iPad + phone, the name) with a clear Signal Yellow ring, made by `site/scripts/favicon/make-favicons.py`.
  - 16px uses a simplified mark (the two devices only); 32/48, 180, 192 and 512 use the full logo.
  - Also `favicon.svg` and `favicon.ico`. The 14 Oct yellow/graphite redesign is gone.
- **Tab title:** "Sam Electronics - Home", and "سام للإلكترونيات - الرئيسية" in Arabic (`TabTitle`); the 404 page is "Sam Electronics - Page not found".
- **Reviewer idea, built:** while the visitor is on another tab, the title reads "Sam Electronics - Your part is waiting" ("قطعتك بانتظارك") and the ring dims. Both come back on return (checked in EN and AR).

DONE WHEN
- Favicon = original logo + yellow ring, readable at 16px on light and dark tabs. **PASS**
- Every page's tab title follows the pattern, EN and AR. **PASS** (Home and 404 are the only pages so far)

## §02 · Header: hours pop-over, progress bar, logo, menu

- **Hours pop-over:** four working buttons, checked in EN and AR:
  - Get directions → Google Maps 78G4+3H2;
  - WhatsApp → wa.me/971503420015;
  - Call → tel:+97142733031;
  - All hours → scrolls to Visit (lands at the header line).
- The pop-over is now opaque (nothing shows through the buttons), and a hover bridge keeps it open while the pointer moves down to the buttons.
- **Reviewer idea, built:** a live Dubai clock and a thin bar filling towards the next change, next to "Closes in 2h 32m".
- Progress bar click + drag with labels and solder pads: Part B3. Logo → top: Part B2. Arabic menu scrolls with the page locked: Part D.

DONE WHEN
- All pop-over buttons open the right thing. **PASS**
- Progress bar click + drag works, EN and AR. **PASS** (Part B tests, 9/9 in each language)
- Menu scrolls in AR. **PASS** (Part D)

## §03 · Hero: search, ticks, phone ads, screens, iPad, Arabic

**A · Search:**
- The examples are typed by a small JS typewriter (`HeroSearch.tsx`). The caret appears with the first letter and blinks only once the word is complete; after erasing, the field stays empty for 300ms.
  - Measured over 60 samples: the caret never showed without letters.
- Suggestions: brand logo + model + its part families; three rows visible, the rest scroll inside with the yellow scrollbar (8 rows, 144px visible).
- Enter / Search / a click opens the G17 Coming soon card for that model or the typed term, with Find My Part as the next step.
- The search now covers all 801 Excel models.

**B · Ticks:** only the ring lights (yellow stroke + soft glow); the tick never changes. Each ring glows 1.2s and fades 0.6s, then the next.

**C · Phone ads:**
- Screens are the box + LCD product shot; the other parts keep their straight studio parts.
- The shine now runs on the reel's own clock: it plays on every new ad, 300ms after it settles. It is brighter on dark ads (0.7–1) and softer on light ones (0.5), and the iPad sweeps 1.5s later.
- Wheel or swipe works both ways. "Previous" now really moves the feed down (the same 600ms scroll, played backwards); before, it slid the earlier ad up.
- Hover pauses at once and resumes 3s after leaving.
- **Poster:** a 9:16 poster, centred, at most 88% of the screen height, fully visible at 1440×900 and 1280×720. It grows out of the phone screen (450ms) and closes back into it; Esc, X or a click outside closes it.
- The screen ad copy uses the Excel qualities ("Original, OLED, Incell and AAA").

**D · Glass, frames, background:**
- **Background:** the 14 Oct §00 change was found in git: the hero's background and gradient end went from #1A1B1D to #26282B. Restored in the hero only. ⚠ This undoes the 14 Oct "no #1A1B1D" rule for the hero, because this brief asks for the previous contrast.
- **Glass:** deep blacks, a soft window reflection top-left, a dark bezel ring and a thin bright fresnel line.
- **Frames:** a chamfer light that slides across both device frames as the page scrolls (scroll-driven CSS, no JS).
- **Honest status: PARTIAL.** The frames are still CSS-drawn. Brushed metal, antenna lines and real lens reflections are not at a "very 3D, real" level yet.

**E · iPad film** (`IpadFilm.tsx`, 16s loop):
- Inventory grid → "Samsung · Service Pack" feature (the box + LCD turning slowly, "In stock · from AED 185") → "Same-day trade quotes" with an animated WhatsApp chat.
- A notification drops in every 10s (sample texts) and goes back up after 3s.
- Signal and wifi flicker; the battery drains, then charges with the bolt; the clock is Dubai time.
- The loose floating card (Screenshot 02) did not appear in any capture this round.

**F · Language pop-up:**
- Fixed timing, measured three times: done at 2.03–2.06s, closed at 3.49–3.50s.
- Card 380×140, 40px icon, 18px text, 24px padding. No Samsoom.
- Reviewer idea, built: a tiny circuit trace draws "A" / "ع" while loading, then flashes yellow.

**G · Arabic:** the device group keeps the English composition on the left (Part D). Samsoom sits bottom-left, clear of the buttons.

**Film beats:**
- Power-on entrance after the loading screen: circuits reveal from the edges, the screens switch on with a soft white flash, the title lines rise 80ms apart, then the text, search, buttons and ticks.
- On scroll the device group drifts slower than the text (depth).

**Reviewer ideas:**
- Built: the cursor light (follows the mouse; mirrored correctly in Arabic) and the WhatsApp icon pulsing once after the entrance.
- **Not built:** the "Parts shipped today" counter. There is no room under the ticks without touching the protected bottom-left circuit (24px safe zone).

**Checks:** teardown tests 9/9, scroll engine 9/9, no script errors (EN + AR).

DONE WHEN
- Search: no early caret, max 3 rows, Enter leaves the hero. **PASS**
- Ticks: ring only. **PASS**
- All ads same product composition. **PASS**
- Shine on every new ad, visible on dark and light. **PASS**
- Wheel/swipe both ways; 3s wait. **PASS**
- Poster pop-up full. **PASS**
- Real glass, real frames, vivid background. **PARTIAL** (glass + background done; frames still CSS)
- iPad film plays; notifications drop. **PASS**
- Language pop-up fixed timing, no Samsoom. **PASS**
- Arabic: same composition. **PASS**

## §04 · Brand stock bar

- **Brands:** the owner's 15 brands in his group order, with the traced newest logos (Part E). Measured in EN and AR: 15 names, one logo height (28px), no Sony; the panel reads "15 brands · 801 models".
- **Dividers:** only between groups, drawn as tiny circuit pads (standalone brands count as their own group). The light along the strip's top edge already ran; it stays.
- **Reviewer idea, built:**
  - hovering pauses the strip and turns the logo its own brand colour;
  - the card rises with stock by family and the group name ("Xiaomi Group" / "مجموعة شاومي");
  - clicking the logo or "Find … parts" opens Find My Part on that brand.
- **Seamless loop:** three copies (14 Oct §06). The no-gap check measured 3,500–5,900px of spare track beyond the window edge at 1440/1920 in EN and AR.

DONE WHEN
- 15 logos, equal size, no Sony, no gap, hover card works. **PASS**

## §05 · Teardown

**A · Smoothness:**
- The 3D renderer now uses a logarithmic depth buffer, on top of the 14 Oct fixes (camera near/far planes from the distance; the back glass with its own solid edge material and polygon offset). Depth precision no longer depends on the camera distance.
- The step engine: teardown tests 9/9, including Part B's fast pass-through.

**B · The opening:**
- The title's light is now a real yellow band (#F7C032 with a warm edge) running left → right and leaving the letters white. Before, it was a pale cream that read as missing.
- One gesture = one step and fast pass-through already hold (Part B tests).

**C · Info card:**
- No "Fits" label.
- The Excel qualities for that layer, each with its "i" button.
- The brands we stock it for, as 20px logos wrapping across the card from the reading start (right in Arabic). The card height cap went from 360 to 452px so the logos and the Shop button fit.
- Shop opens that layer's family (G17 Coming soon for the Shop page → Find My Part). The logic board, which is not in the Excel, is "Ask us" on WhatsApp.

**D · Arabic:** Part D (mirrored stage, dots on the components' left, callouts mirrored, the phone's final position mirrored).

**E · Final-call ads** (`public/se-td-ad.js`):
- Sentence case (Screens, Back glass, Every part., All in Deira., Quality · Warranty · Price); "15 brands".
- Every text is in the visitor's language, and Arabic is drawn as one joined run (no per-letter spacing).

**Not done this round (honest):**
- The full new film is not built:
  - beat timings 1.2 / 1.4 / 2.0 / 1.6 / 0.8s;
  - the spotlight cone;
  - the frames drawing in the same step as the opening;
  - the new ad transitions (zoom-through, spin-in, odometer price, alternating exits);
  - the 8-part finale assembly;
  - the reviewer ideas (most-searched strip, depth of field).
- This sandbox renders WebGL at about 1 fps, so I can't check camera timing or flicker frame by frame. These need a real GPU session.

DONE WHEN
- No edge flicker. **PARTIAL** (log depth + earlier fixes; not verifiable here without a GPU)
- Never freezes; fast scroll passes. **PASS** (9/9 + Part B)
- Steps exactly as the film. **NOT DONE**
- Card: logos, no 'fits'. **PASS**
- Arabic mirrored correctly. **PASS** (Part D)
- Final ads: hero typography, real motion, finale assembly, never empty. **PARTIAL** (sentence case, hero font and translation done; motion and finale not)

## §06 · What we offer + the three boxes

**A · The showroom:**
- No blend from the teardown. The section has its own Fog background:
  - a very large circuit pattern at 5% (`.wo-circuit`);
  - four soft spot pools from above (`.wo-spots`);
  - the existing grain.
- Title graphite + yellow, no highlighter (Part C).
- Turntables:
  - one shared clock, one turn every 12s, the same angle at the same moment for every part;
  - no bounce on landing and no float;
  - on hover the part eases round to face the visitor (this had been commented out by accident) and its rim light brightens;
  - the reflection sweep now runs every 8s.
- Light reveal: each card's rim light switches on 120ms after the previous one, with a short flicker, and the card lifts in under it.

**B · Strong cards:**
- Graphite card with a lit stage: a soft yellow rim light at the back, and a glossy black floor with a highlight line and a dark puck.
- Each card shows:
  - the family name;
  - the Excel qualities as yellow chips and the manufacturers as grey chips, each with its "i";
  - stock and models covered;
  - "from AED … SAMPLE";
  - a "Shop …" button (logic boards: "Ask us").
- The whole card stays clickable (opens Find My Part on that family).

**C · The three boxes:**
- Circuits:
  - they now run on the box edges (10px strip), and the text column is inset 34px, so they're at least 24px from any text;
  - the page-side circuits hide below 1420px, where the gutter is too narrow.
- Buttons: all three are the same size (340 × 52 at 1440px) on the same bottom baseline, EN and AR (measured).
- A pulse rings out of each main button every 6s.
- Reviewer's idea: on hover, the box's scene runs faster (already in place), its circuit current speeds up, and the button pulse comes every 1.6s.
- Wholesale is a 10s loop: the cartons drop and stack, the film winds, the tag swings in, then the pallet slides away and it restarts.

**Not done this round (honest):**
- Repair scene: the ESD mat, the precision driver, the screen swap and the diagnostic screen are not built (the current crack → seal → boot film stays).
- Wholesale cartons are still the CSS cartons, not the real printed Service Pack boxes.
- The Worldwide globe is still the dot globe. The realistic bordered globe with the plane arc and the countries from facts.ts is not built.
- "Chips glow when a stock number ticks" is not built (no live stock ticks yet).
- The glossy floor reflects light only. The real part reflection works only on the image fallback, not on the live WebGL parts.

DONE WHEN
- Own background, no blend, no highlighter. **PASS**
- Parts turn in perfect sync, premium, no jumps. **PASS** (shared 12s clock, no bounce; at 1 fps in this sandbox, smoothness needs a real GPU check)
- Cards show qualities, manufacturers, stock, price, button. **PASS**
- Three scenes realistic; boxes use the real designs; globe realistic. **NOT DONE**
- No circuit over text; buttons aligned. **PASS**

## §07 · Live parts board

- Layout and content kept. Names come from the Excel data (Part E); no highlighter.
- Side circuits:
  - faint traces (16%) in the left and right gutters, at least 24px from the board and text (measured: 140px → 164px at 1600px wide);
  - hidden below 1400px, where the gutter is too narrow.
- With every new row, a ping runs from one side's circuit (alternating left / right) into the board at the newest row's height. The logic measures that height (`--ry`); the ping lands within 14px of the row's middle.
- Each new row still slides in from the top; its status chip now flashes yellow (1s).
- Reviewer's idea: the tiles' sparklines draw in as the section enters (line 1.2s, then the fill).
- Screenshots EN / AR at 1600px.

DONE WHEN
- Side circuits with pulses; rows arrive with the flash. **PASS**

## §08 · Bench test

- **Starts centred:** the section is no longer a 400vh pinned scroll that the visitor had to scroll into. It is one screen tall (the scaled box), and the film plays on its own clock as soon as 60% of it is in view:
  - clamps close with the click and shake (0.8s);
  - Display, Touch, True Tone and Battery each turn PASS in order (4s);
  - the warranty sticker and the receipt with the price stamp (1s);
  - a hold, then the next pass. The UNITS counter goes up one per pass.
  - It resets when the section leaves, so it replays.
- **No line:** the bench band at the bottom, with its highlight line across the yellow, is gone. One continuous yellow.
- **Today on the rig** (marked SAMPLE):
  - four counters roll up on arrival: Parts tested today · Passed · Sent back to supplier · Warranty stickers applied;
  - each pass adds one;
  - the numbers come from `SE_DATA.benchToday` (or `SE_FACTS.benchToday`), so the Control Room can set them.
- A "How we test" button (Coming soon card) and an "i" that explains the warranty sticker.
- **Reviewer's idea, "Run the test yourself":** Original / OLED Soft / Incell. The rig re-runs, and the work order and price tag follow the chosen quality: grade name, and the lowest sample screen price for that quality from the data.
  - Per-quality test scores are **not shown**. I don't have real numbers for how each quality scores and won't invent them (open question for the owner).
- Arabic: all new text translated; coverage check shows nothing left in this section.

DONE WHEN
- Starts centred. **PASS**
- No line. **PASS**
- Counter strip + optional interactive. **PASS** (interactive without per-quality scores; see above)

## §09 · Showcase · screens by quality

- **Never holds the page:** no pin since Part B. Measured: the film plays while a 400px wheel moves the page 400px, EN and AR.
- Progress segments on top; hovering pauses once the quality is built; clicking a segment jumps.
- **Real unboxing, every quality different.** New renders from the Part E studio (`scripts/productshot/render-showcase.mjs`, scene `part` / `q` params): for each featured quality, its box, the screen from the front, and the screen's back, each on its own. What differs is physical, not decoration:
  - **Original · Service Pack:** the white genuine service box; the metal back with its serial sticker.
  - **OLED:** a true-black front; a black foil back with the copper sheet; blue film tabs.
    - Its box is still the neutral TEMP box (no photo of the OLED makers' box yet).
  - **AAA · GX:** the black GX box; a plain dark plate with a coloured film tab.
  - **Incell:** the blue ZY IN CELL box; a greyer LCD black with the wider lower border; the silver backlight plate.
- The film, every quality (4.5s + 0.6s change):
  1. The box slides in from the reading end and its lid lifts.
  2. The screen rises out and turns to its 25° pose, and its back stands up behind it.
  3. The quality bars fill and the "from" price lands.
  4. Everything leaves toward the reading start.
- Arabic mirrors the arrangement; the renders themselves are never mirrored.
- Names from the Excel (Original, OLED, AAA, Incell; Service Pack and GX as labels); "Screens by quality", no highlighter.

**Not done (honest):**
- The reviewer's "Compare" toggle.
- At the change, the next box comes in after the old one has left, not at the same time.

DONE WHEN
- Never holds the page. **PASS**
- Each quality visibly different, real unboxing. **PASS** (the OLED box waits for the owner's photo)

## §10 · Deals & arrivals

- **No count in the title.** The eyebrow is "Deals & arrivals · Sample prices". At the side, a live chip shows a pulsing dot and "N live deals". N counts the deals whose clock is still running, so it goes down when one ends, and it rolls when it changes.
- **Rail:**
  - It is now a belt, not a scroller: there is no browser scrollbar in either language.
  - It drifts continuously (24px/s) like the hero brand bar and loops seamlessly over a cloned set. It stays static when every card fits.
  - Our own graphite/yellow arrows glide it one card; hover and drag hold it. Measured: it moved 48px in 2s, then 0px while hovered.
  - Arabic: it runs the other way.
- **Shipment map:**
  - Real geography: Natural Earth 50m coastlines and country borders, projected once by `scripts/maps/make-ship-map.mjs` into `public/se-ship-map.json` (18KB gzipped, loaded only when the section nears).
  - The arc runs Shenzhen → Dubai, with current flowing along it. The plane sits at the shipment's real progress (the same value drives the bar, the stages and the countdown) and bobs.
  - Hovering the map shows the ETA in Dubai time.
- **Pre-orders:** a continuous top → bottom loop that pauses on hover.
- **Reviewer's idea:** every 11–18s a deal drops 1–2% more (sample feed). The old price gets a quick yellow strike, the new price slides in, the tag pops, and the card gives one 2px shake.
- **Arabic bug fixed:** the Deal of the Day price read "14" for 41, and the flip clock ran backwards. Digits and clocks now keep their order.

DONE WHEN
- No count in the title. **PASS**
- Rail loops correctly; custom controls; no browser scrollbar. **PASS**
- Real map, moving plane. **PASS** (the plane moves at the real progress, plus a bob and flowing current)
- Pre-orders loop. **PASS**

## §11 · Repair Lab

- **Themed background.** The white "ceramic tile" floor is gone. The section is now the bench itself:
  - a graphite ESD mat with a faint grid;
  - warm light from above;
  - circuit traces with current in the gutters (hidden when the gutter is too narrow).
- Title in white and yellow, no highlighter.
- **The film is real 3D now.** The cartoon CSS drawing (cracks drawn as lines) is replaced:
  - `scripts/repairfilm/scene.html` builds the bench in three.js: ESD mat with a heat plate, an iPhone-style housing with logic board, shields, connectors, camera, battery pouch, charging-port flex and screws, the screen (realistic shattered glass, new, and the booting Sam Electronics logo), a suction cup and a pry pick;
  - it renders each piece as its own layer from one fixed camera (`render.mjs` → `public/assets/repair`, 92KB at 640px), so the layers register exactly;
  - `RepairFilm.tsx` plays one continuous shot with a slow dolly-in:
    1. Intake 1.5s (the phone slides onto the mat, the job ticket prints with the model and problems)
    2. Heat 1.5s (the plate glows orange, the air shimmers, the thermometer climbs to 80°C)
    3. Opening 2s (the suction cup lands, the pick runs the seam, the screen lifts away)
    4. Swap 2s (the old part lifts, the new one lowers in, the flex clicks home with a spark)
    5. Boot 1s
    6. Tested 1.5s (Touch · Display · Face ID · Speaker tick, the warranty sticker stamps)
  - Step bar under the stage.
- **Estimator:**
  - the 15 brands;
  - the owner's 11 problems as multi-select chips ("Not sure" clears the others);
  - Quality chips with Original first, then the Manufacturer of the chosen quality, both with their "i";
  - the estimate adds every chosen problem that has a part; the rest are "quoted after diagnosis";
  - it now starts on a model that has sample parts (it used to open on iPhone 4 with "Ask us").
- **Reviewer's idea (film follows the problem):** choosing Battery switches the film to a battery swap; Charging port switches it to a port-flex swap; Screen shows the cracked screen swap. Checked on frames for all three.
- Arabic: mirrored and all new text translated.

**Honest notes:**
- This is a layered render, not a camera move through a live 3D scene (no GPU here). The heat shimmer is a soft CSS blur over the plate.
- Camera, Back glass and the diagnosis-only problems play the screen film.

DONE WHEN
- Themed background. **PASS**
- Six phases realistic. **PASS** (real 3D renders; layered, see notes)
- Estimator: multi-select, Original, 15 brands. **PASS**
- Film reacts to the chosen problem. **PASS** (screen / battery / port)

## §12 · Wholesale & trade

- **Tape:** unrolls once, then rolls continuously left → right like tape off a roll (right → left in Arabic; measured), glint kept.
- **Pallet builder:**
  - Search with autocomplete over the whole catalogue: title, model, brand (Samsung also answers to "Galaxy"), series, part and quality. The picked product joins the quick chips.
  - Slider 10 → 5,000; a 1000+ tier added (sample); a pallets counter.
  - 500 units = one full pallet (sample, Control Room value).
- **Realistic pallet** (`scripts/palletfilm`, three.js with an isometric camera):
  - a real wooden pallet: grain, knots, 7 deck boards, 9 blocks, stringers and bottom boards, finished on every side;
  - the shipping carton: kraft with the Sam Electronics tape, a barcode label and printed marks;
  - the full pallet with stretch film and sheen.
  - The renderer writes the 18 carton cells (px offsets + draw order) to `src/content/palletCells.ts`, so each carton dropped by the slider lands exactly on its cell, back row first, layer by layer.
- **Full pallet → new pallet film:** passing a 500 step makes the wrapped pallet glide back and shrink into the warehouse row (which grows with each pallet), a forklift's shadow passes, and a new empty pallet rolls in and refills.
- **Reviewer's savings meter:** the needle swings into the green as the order grows, beside "You keep AED …".
- **Who we supply:** real renders in the same quality, each with its scene:
  - a new screen lowers and clicks into the phone (the Repair Lab renders, with a click flash);
  - the price tag swings in and drops;
  - the carton is labelled and flown along the arc;
  - the bulk list ticks and gets a QUOTED stamp.
- **How trade works:** the ring around each number lights in turn and loops; the numbers never change.
- Arabic: mirrored; the slider fill now follows the thumb from the right.

DONE WHEN
- Tape rolls. **PASS**
- Search any product; max 5,000. **PASS**
- Realistic pallet; full pallet → new pallet film. **PASS**
- Who we supply realistic. **PASS** (real renders for the screen and carton scenes; the tag and the list are CSS objects)
- Steps light, numbers unchanged. **PASS**

## §13 · Worldwide network

- **Countries.** Russia, Ukraine, India, Pakistan, Burkina Faso and Senegal were added to the single list in `facts.ts`. Türkiye and Azerbaijan were already there; no duplicates.
  - Regions: India, Pakistan and Azerbaijan → Asia; Russia and Ukraine → Europe; Burkina Faso and Senegal → Africa.
  - The countries stat is now derived from the list: 28 destinations + the UAE hub.
  - The network map reads the list. The dot globes are rebuilt from it by `scripts/maps/make-globe-data.mjs` (Natural Earth, same dot grid and style).
  - The Live board flags and the fallback list were updated too.
- **The four boxes, rebuilt as real scenes:**
  - Tracked: a real dot mini-map; the parcel travels DXB → LOS; Packed → Dispatched → In transit → Customs → Delivered light in turn; the tracking number types in.
  - Packed: the boxed screen (Part E render) slides into the carton, padding fills, the tape seals with a sweep, the label prints and sticks.
  - Quoted: the slip prints line by line (weight, destination, service, insurance), the total counts up, CONFIRMED stamps.
  - Regions: the dot globe turns to each region, which lights with its name and its country count (8 · 12 · 5 · 3).
  - Nothing is cut off any more (the old "SE-4544 · In tra" is gone).
- **Reviewer's idea:** click a country on the network map → a card with typical delivery (sample by region), last shipment (sample) and "Get a quote for [country]" pre-filled on WhatsApp.

DONE WHEN
- 8 countries everywhere; counts correct. **PASS**
- Four realistic scenes; no cut text. **PASS**

---

# Urgent corrections (owner, mid Round 6: overrides the PDF)

Art-director standard: Apple product pages. Brand rules: no black (titles #26282B), yellow only #F7C032, no muddy gradients / light bands / long fades, Arabic in IBM Plex Sans Arabic (~8% smaller, line-height 1.5), no English inside Arabic, no sound effects.

## Urgent 0 · Brand rules + speed

- **Yellow.** Every yellow is #F7C032, including titles (39 files; #D99A00 is gone).
- **Arabic font.**
  - Plex Sans Arabic is preloaded when Arabic is chosen.
  - It is loaded before any canvas draws Arabic (`se:fonts`), and the map iframe gets the font too.
  - `size-adjust: 92%`, line-height 1.5.
- **Sound.** The teardown click sound was removed.
- **Speed.**
  - The teardown measures its column with a ResizeObserver instead of every frame.
  - Off-screen sections use `content-visibility: auto`.
  - The globe is capped at 30fps.
  - Long tasks went from 3.9s to 2.7s in total (the longest from 924 to 506ms).

DONE WHEN
- One yellow. **PASS**
- Plex loaded for DOM, canvas and map. **PASS**
- No sound. **PASS**

## Urgent 1 · The product pose

- **One pose for every product.** The carton stands behind and the product in front, both turned 20° right, with ~70% of the carton visible and one shared shadow.
  - Screens use the brand/maker box with a short flex.
  - Every other part uses a white carton with a barcode and QR, sized to the part.
  - Rendered offline to `public/assets/pose/` (22 poses).
- **Used everywhere.** Product cards, the hero reel and iPad, the poster, Who / Meet / Feed and Deals. The pose never turns.

DONE WHEN
- Same pose everywhere; every product has a carton. **PASS**

## Urgent 2 · Hero, brand bar, progress bar

- **iPad.** It is always the store, with graphite and yellow product banners inside the grid.
- **Phone ad.** A click opens a landscape 16:9 card (max 80% wide).
- **Phone reel.**
  - It freezes while the pointer or a finger is on it.
  - One wheel or trackpad gesture moves exactly one ad.
  - It resumes 3s after leaving.
- **Shine.** One diagonal sweep, alternating phone / iPad, never both at once.
- **Language pop-up.** A battery loader with a tick.
- **Brand bar.** Equal 120×28 boxes, white at 85%, colour on hover.
- **Progress bar.** One plain thin line with no dots, still clickable and draggable.

DONE WHEN
- All items above. **PASS**

## Urgent 3 · Teardown, seam, What we offer

- **Teardown: one gesture = one step.**
  - A gesture made while a step is still playing is spent; it no longer queues a second step. Only a gesture made during the opening is held.
  - Decaying same-direction input (trackpad momentum, or events delayed by a busy main thread) counts as the same gesture unless there is a real pause or a stronger new push.
  - The pass-through needs 5 separate gestures in 1.4s (it was 3), so slow notches never skip the film.
  - A watchdog unsticks the engine after 3s of blocked input, so the page never freezes.
- **Teardown: layout and effects.**
  - The skip link is its own graphite pill in the top corner.
  - The stat outlines, the ghost text, the yellow fog/bloom overlays and the bokeh are gone.
- **Final-call ad (`public/se-td-ad.js`), rebuilt.**
  - Six product scenes: Screens, Batteries, Back glass, Cameras, Charging flex, Small parts.
  - Each shows the pose, a headline and a "from AED" price, with a 0.4s cross-fade.
  - It ends on the logo card. No more 3D-library dependency.
- **Seam.** A clean cut from the teardown to the fog section, with no fade or band.
- **What we offer: the 8 family cards.**
  - Graphite #26282B on Fog, each with the static pose (no rotation).
  - Chips with small "i" icons.
  - The fixed 900px container that made the cards overlap the boxes is gone.
- **What we offer: the 3 service boxes.**
  - Repair shows a still pose instead of a rolling 3D phone.
  - Wholesale is flat #F7C032 (the grey floor band and the cream glow were removed).
  - No circuit lines on the box edges.
  - Since nothing is drawn in 3D any more, the WebGL shelf is no longer mounted (one less WebGL context and model download).

DONE WHEN
- Teardown tests 1–9d all PASS (`scripts/qa/teardown-tests.mjs`: three notches 280ms apart, five fast notches, a trackpad swipe with 1.2s momentum, a notch during a step: each is exactly one step). **PASS**
- Skip link in its own corner; no outlines/ghost/bokeh. **PASS**
- New final-call ads (EN/AR). **PASS**
- Clean seam; no overlap; graphite cards; #F7C032 only; parts static. **PASS**

## Urgent 4 · Bench, Showcase, Repair Lab

- **Bench: scroll-driven again.**
  - The section holds (sticky) for 160vh, and scroll moves the tests in order: display → touch → True Tone → battery → sticker → passed.
  - The phone is already clamped on arrival, so the stage is never empty. A fast scroll simply passes through.
  - "Run the test yourself" plays one pass on its own clock, then scroll takes over again.
- **Bench: QUALITY / WARRANTY / PRICE.**
  - A soft ghost fill instead of the outline stroke (the stroke broke on joined Arabic letters). The fill runs right to left in Arabic.
  - No glow.
  - The Arabic size is tuned to 64px with line-height 1.2.
- **Bench: one clean row.** "How we test" plus a segmented control for the quality (Original / OLED Soft / Incell).
- **Bench: smaller fixes.**
  - The warranty line now reads "True Tone passed, covered by warranty", because the sticker goes on last.
  - "True Tone" is no longer written in English inside the Arabic (توازن الألوان).
  - The PASSED stamp no longer covers the price on the work order.
- **Showcase.**
  - Hover no longer pauses the ads.
  - A real studio: a flat #F7C032 wall, a short cove into a deeper yellow floor, every product on the same floor line with a faint reflection.
  - The floating lid bar and the light haze blobs are gone, and the section has no warm glow.
  - Nav: flat graphite circles with a #F7C032 arrow, mirrored in Arabic.
  - The quality bars run on the film clock: the CSS fill animation stayed at 0 in Arabic.
- **Repair Lab: every phase re-rendered** (`scripts/repairfilm`).
  - The heat plate (it read as paper) is now a dark anodized, brushed aluminium separator with a grid of vacuum holes, a control strip, an LCD window and an amber LED. `mat-hot` lights the LED and LCD.
  - The temperature climbs on the plate's own display, placed with anchors the renderer projects (`src/content/repairAnchors.json`).
  - The cracked glass is real shards: radial cracks and ring breaks, each shard tilted in a bump map so the light breaks shard by shard, a crush zone, a few chips, and highlights that fade with distance.
  - The checks run on the phone's own screen (`test0`–`test4`): icons only, so nothing English shows inside Arabic.
  - The warranty seal is a rendered decal.
  - The boot screen has no words.
  - No orange wash, no fake heat shimmer, no spark.
- **Repair Lab: overlays and section.**
  - The debug-looking boxes are gone: the job ticket, the HEAT PLATE pill and the checklist card.
  - The job line (#4821 · model · problems) and the live status ("Heating the seal", "New screen fitted", "Every check passed") sit in a caption bar under the film, in EN and AR.
  - The section background is flat graphite.

DONE WHEN
- Bench holds and scroll drives the tests; fast scroll passes. **PASS**
- QUALITY / WARRANTY / PRICE fill properly in EN and AR. **PASS**
- One clean button row. **PASS**
- Showcase: no hover pause, studio environment, new nav. **PASS**
- Repair: every phase at render quality; no debug boxes. **PASS**
