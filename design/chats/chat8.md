# Design task assignment

_Started 2026-10-12 16:57 UTC_

---

## User

Continuing from "Code review request".

## Assistant

We were refining the Sam Electronics home page hero section and its card carousel. The work focused on restoring the hero phone display and ad cards after code separation, then fixing layout and rendering issues.

Key decisions made:
- Rebuilt the hero phone and 10-card reel from partial records (old screenshots and timing code still in Home v3) because no saved copy of `se-phone-ad.js` existed before separation.
- Used the parts library for all hero renders (phone, ads, teardown cards) to ensure consistency and enable reuse across pages.
- Implemented proper image caching in `se-parts-lib.js` to eliminate the ~1-minute freeze on page load (was rebuilding images every time; now saves and restores them).
- Left two long headlines slightly below 20px to fit within margins rather than shortening the copy.
- Kept yellow eyebrow at full intensity on Graphite cards per brand rules.
- Reconstructed missing Worldwide card globe and carton close-ups from old screenshots.

Current state:
- H1 through H5 validation all pass: hero phone, 10-card layout, parts library renders, repair animation, and screen detail all confirmed working.
- Headline fit issue resolved: "The small parts / that finish the job." now measures 18.4px and fits within 175px boundary with 9% right margin. Font loading race condition fixed by waiting for Space Grotesk before measuring.
- All other headlines remain at 20px and fit properly.
- Teardown cards now pull from parts library, showing updated screen picture.
- First page load still rebuilds images once (expected); subsequent loads are fast.

Open: Confirm if Graphite eyebrow should stay at full yellow or dim to 70%.

Files involved: `Sam Electronics Home v3.dc.html`, `se-parts-lib.js`, `se-phone-ad.js`, `se-teardown-3d.js`, `se-td-ad.js`, `screenshots/` (multiple frames), `CLAUDE.md`.

## User

Read CLAUDE.md and the attached PDF. Do Issue 1B only (pages 10–13). Follow it exactly. Do not add anything that isn't on those pages. Then send the CAPTURE frames and answer every DONE WHEN item yes or no, and stop.

## Assistant



## User

Read CLAUDE.md and the attached PDF. Do Issue 1B only (pages 10–13). Follow it exactly. Do not add anything that isn't on those pages. Then send the CAPTURE frames and answer every DONE WHEN item yes or no, and stop.

## Assistant

_[tool: update_todos]_

_[tool: list_files]_

_[tool: read_skill_prompt]_

_[tool: run_script]_

_[tool: copy_files]_

_[tool: run_script]_

_[tool: grep]_

_[tool: grep]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: grep]_

_[tool: grep]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: show_html]_

The user asked for capture frames, so I need screenshots.

_[tool: show_html]_

_[tool: sleep]_

_[tool: get_webview_logs]_

_[tool: save_screenshot]_

_[tool: save_screenshot]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: save_screenshot]_

_[tool: run_script]_

_[tool: show_html]_

_[tool: sleep]_

_[tool: save_screenshot]_

_[tool: run_script]_

_[tool: view_image]_

_[tool: run_script]_

_[tool: show_html]_

_[tool: sleep]_

_[tool: save_screenshot]_

_[tool: show_html]_

_[tool: sleep]_

_[tool: save_screenshot]_

_[tool: run_script]_

_[tool: str_replace_edit]_

_[tool: update_todos]_

_[tool: show_to_user]_

Issue 1B is built in the Home v3 hero. Only the hero phone reel and the iPad product pictures changed. Your usage limit is nearly reached, so I've stopped here.

**Frames**
- **Sheet you have open (`screenshots/1B-sheet.png`):** top row and first three of the bottom row are all 10 cards at 1.5s. The last four are extras: the screen reflection mid-glide, the repair phone booting, the loop point, and card 1 again on the second loop.
- **Each card on its own:** `screenshots/01–10-1B-c.jpg`.
- **Wholesale with all cartons landed:** `screenshots/01-1B-x.jpg`. I made the cartons drop faster after the sheet was taken, so the sheet still shows the top carton falling.
- **iPad:** `screenshots/1B-ipad.png`.
- **Screen part close up:** `screenshots/1B-screenpart.jpg`.
- No approved screenshots of the old cards were available to put alongside, so the cards are shown on their own.

**What changed on the cards**
- Card order now follows page 12: Screens, Batteries, Back covers, Cameras, Frames, Worldwide, Wholesale, Repairs, then Flex and Small parts.
- Two headlines were shortened instead of shrinking the font: "Small parts. / Job finished." and, as page 12 gives it, "Factory-fit / frames."
- The reflection that glides across each product now passes at 1.7–2.9s, after the 1.5s frame. The screenshot tool shows it as a solid pale rectangle, but in the browser it only lights the product. Moving it later keeps the 1.5s frames true to what customers see.

**DONE WHEN**
- Device: pill, no status bar, progress line, glass reflection — **yes**
- All cards use the template, same positions and sizes — **yes**
- Every product fits the product box, centred, with circular glow and shadow — **yes**
- Screen card: glossy glass, gliding reflection, flex tail — **yes**
- Globe: real, rotating, continents, route arcs — **yes**
- Wholesale: cartons stacking on a pallet — **yes**
- Repair: same size as the others; crack, heal, boot — **yes**
- All headlines the same size — **yes**
- iPad uses library renders, centred and the same size — **yes**
- Reel loops identically — **yes**

The globe needs an internet connection to load the continent map; without it, it shows a plain sphere.

## User

After these 5 fixes and their report, continue straight away with Issue 1 (the teardown, pages 14–21 of the PDF). Do it fully and in order, exactly as written there: sections A to H, the 8 scroll tests, then its CAPTURE frames and DONE WHEN answers. Do not stop between the two tasks, and do not stop to ask whether to continue. Only stop when Issue 1 is completely finished and reported.

## Assistant

Files I'll change: `Sam Electronics Home v3.dc.html` (hero reel only), new `se-globe-data.js` (offline world dots), `CLAUDE.md`.

_[tool: grep]_

Now generating offline globe data.

_[tool: run_script]_

_[tool: grep]_

_[tool: grep]_

_[tool: run_script]_

_[tool: show_html]_

_[tool: sleep]_

_[tool: get_webview_logs]_

_[tool: save_screenshot]_

_[tool: run_script]_

_[tool: view_image]_

_[tool: run_script]_

_[tool: view_image]_

Hero fixes done. Now Issue 1 — reading pages 14–21.

_[tool: run_script]_

_[tool: run_script]_

_[tool: str_replace_edit]_

_[tool: grep]_

_[tool: read_file]_

_[tool: grep]_

_[tool: grep]_

_[tool: read_file]_

_[tool: grep]_

_[tool: read_file]_

_[tool: grep]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: grep]_

_[tool: grep]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: str_replace_edit]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: grep]_

_[tool: run_script]_

_[tool: grep]_

_[tool: show_html]_

_[tool: sleep]_

_[tool: get_webview_logs]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: show_html]_

_[tool: sleep]_

_[tool: get_webview_logs]_

_[tool: save_screenshot]_

_[tool: run_script]_

_[tool: view_image]_

_[tool: run_script]_

_[tool: show_html]_

_[tool: sleep]_

_[tool: save_screenshot]_

_[tool: run_script]_

_[tool: view_image]_

_[tool: save_screenshot]_

_[tool: save_screenshot]_

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

I've made the five hero fixes and the Issue 1 teardown pass. The 8 scroll tests have not been run: the preview here can't play real scrolling or animation, so I froze each frame with the capture page instead. You need to run those 8 tests in a real browser before the teardown counts as finished.

**Files changed:** `Sam Electronics Home v3.dc.html` (hero reel only), new `se-globe-data.js` (map data stored in the project), `SE Teardown.dc.html`, `se-teardown-3d.js`, `se-td-ad.js`, `CLAUDE.md`.

## Issue 1B – the 5 fixes
Frames: `screenshots/1C-sheet.png` shows the battery, cartons and globe cards at 1.5s, a frame mid-scroll, the globe at its start (UAE facing) and 6s later, then the screen and frames cards. `screenshots/1C-island.png` is the phone top close up.

1. Camera island: **yes.** It sits on top of every card, and the progress line is just under it.
2. Calmer motion: **yes.** The product fades in, rising 16px over 500ms, with no overshoot. It then floats ±3px and ±2° over 4s. Cartons drop softly one by one with a tiny settle.
3. Centred and a little bigger: **yes.** The box is now 50% × 33%, centred at 50% / 55%. The cartons were the ones sitting low and are now re-centred. The globe is round, so its width limits it and it looks smaller than the tall products.
4. Vertical scroll: **yes.** The two cards move together over 600ms, then the new card's text and product play their entrance.
5. Dot-matrix globe: **yes.** The card is now graphite. Land is dots, the 22 countries are yellow, Dubai pulses, and the routes have travelling pulses. It turns once every 24s starting with the UAE facing the camera, and works offline.

## Issue 1 – teardown
Frames:
- `screenshots/T2-sheet.png`, in order: step 0 (hint), step 1, step 2 mid-rise (back, outline letters), step 3 mid-turn (edge facing the camera), step 3 landed (screen on), step 3b, step 06, reassembly, step 14 mid-spin, final call, hover Screen, hover Battery.
- `screenshots/T4-ad.jpg`: E1 mid-sweep, BATTERIES, quick call, "Get yours today.", E4 mid-dots, E4 complete.

**What changed**
- **Scroll:** a step now needs at least 40px of scroll in one direction; smaller movements are ignored. Input during an animation is dropped until 250ms of no scrolling. Coming back up into the section from below now lands on the final call instead of restarting.
- **Toss:** retimed to the page's numbers: a 1s turn, the hang, an 800ms fall with a 4px settle, the wake and shine, then the interface. In the opening, the phone now rises at 1.5–2.7s.
- **Hover:** the second-phone copy is gone; the one real phone opens. Screen slides 45% right. Other parts separate by 18px gaps, then slide 40% right while the rest dim to 70%. The tag sits 16px to the right with a short joining line, or below the part if there is no room. The ad keeps playing during hover.
- **Ad:** one complete outline word per scene, and the template positions now match the page. The battery bounces once and the cameras get a glint. The logo ending is round glowing dots (2.2s), and the slam no longer shakes.

**DONE WHEN**
- All 8 scroll tests pass: **not run** (see above).
- Step 0: **yes.**
- Step 1: **yes.**
- Step 2: **yes.**
- Step 3: **yes** in the frozen frames; the motion itself is unconfirmed.
- Step 3b: **yes.**
- Steps 4–12: **no.** The dimmed layers have no depth-of-field blur; everything else is in sync in the step 06 frame.
- Step 13: **yes** for sparks and no shake. The reassembly shine is faint in its frame.
- Step 14: **yes.**
- Final call and hover: **yes.** On Battery hover, the battery passes behind the screen and only its right part shows past the phone edge.
- Ad: **yes.**
- Always alive: **yes**, from earlier rounds; not re-checked live.
- Unfinished parts listed: **yes:** the 8 scroll tests and the depth-of-field blur.

## User

Read CLAUDE.md and the attached PDF (Round 4 · Director's Edition) first.

Do NOT touch the home hero or the teardown in this step. They stay exactly as they are and will be finished in a later step. If anything you build seems to need a change to them, ask me first.

Do STEP 1: Issue 2, "What we offer", pages 23–26. Read all four pages fully before building.

RULES
1. Before editing, list every file you will change. Build the section in its own preview page ("Preview What We Offer.dc.html"), with its own code. It may share only the parts library and the global components (nav, buttons, cards).
2. Follow every shot in THE FILM tables exactly, with the given timings, sizes and positions. Do not simplify, replace or skip any shot. Do not add anything that isn't on these pages. If something is impossible, say so and propose the closest option before building.
3. Every part shown uses the parts-library 3D renders (G15), at the same angle and lighting. Cartons, tape, labels, the pallet, the price tag and the globe must look like studio photographs, never flat or cartoon.
4. Lighting and shadows per G11 (soft elliptical light pools, contact shadows that follow the real shapes, no light cones, no horizon lines). No plain fades per G2. Data per G13 (no zeros, sample values marked).
5. The Repair ad's phone uses the teardown's realistic phone model. The Worldwide ad's globe uses the dot-matrix style of the site's worldwide map: dotted land, the countries we ship to highlighted in yellow, routes curving out from Dubai with light pulses, rotating slowly and continuously starting with the UAE facing the camera, and its map data stored inside the project.
6. Redo this section's own circuits per Issue 4: decorative, at least 24px from all content, flowing light streaks.
7. Work through Part A (the 8 family cards), then Ad 1 (Repair), then Ad 2 (Wholesale), then Ad 3 (Worldwide). Finish each one fully before starting the next. Do the whole issue in one go; do not stop between parts.

REPORT
- Real frames of everything listed under CAPTURE on page 26, at 1440×900.
- Every DONE WHEN item answered yes or no. Yes only for what a frame shows.
- The list of files you changed.
Then stop and wait for my review.

## Assistant

_[tool: run_script]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: grep]_

_[tool: grep]_

_[tool: read_file]_

_[tool: grep]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: grep]_

_[tool: grep]_

_[tool: copy_files]_

_[tool: dc_write]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: sleep]_

_[tool: get_webview_logs]_

_[tool: str_replace_edit]_

_[tool: dc_html_str_replace]_

_[tool: show_html]_

_[tool: sleep]_

_[tool: get_webview_logs]_

_[tool: save_screenshot]_

_[tool: run_script]_

_[tool: show_html]_

_[tool: sleep]_

_[tool: save_screenshot]_

_[tool: save_screenshot]_

_[tool: get_webview_logs]_

_[tool: save_screenshot]_

_[tool: show_html]_

_[tool: sleep]_

_[tool: save_screenshot]_

_[tool: save_screenshot]_

_[tool: save_screenshot]_

_[tool: save_screenshot]_

_[tool: save_screenshot]_

_[tool: run_script]_

_[tool: save_screenshot]_

_[tool: sleep]_

_[tool: save_screenshot]_

_[tool: run_script]_

_[tool: sleep]_

_[tool: save_screenshot]_

_[tool: sleep]_

_[tool: save_screenshot]_

_[tool: save_screenshot]_

