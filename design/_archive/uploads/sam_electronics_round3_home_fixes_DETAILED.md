# SAM ELECTRONICS: ROUND 3 HOME PAGE FIXES (DETAILED ENGINEERING SPEC)

*From the owner. This replaces the short round 3 file.*

**How to read it:** every section has the same parts:
- **Problem:** what's wrong now
- **Goal:** what the section must achieve
- **Layout:** exact composition
- **Visuals:** materials, lighting, colours
- **Animation timeline:** step by step, with timings
- **Interaction:** hover, click, scroll
- **Copy:** exact text
- **Mobile**
- **Don't:** things to avoid
- **Done when:** a checklist I will test against

Follow it literally. Where a detail isn't specified, choose the most premium, realistic option, and never the simplest one.

---

## 0. GLOBAL RULES (every section, every page)

### 0.1 The continuous circuit bus
- **What:** two circuit rails run the full height of the page, from below the hero to the footer, without a single break.
- **Position:**
  - **left rail:** 32px from the left edge of the content area (desktop), 12px on mobile
  - **right rail:** mirrored.
  - On narrow content areas the rails sit in the side margins, never under text.
- **Look:**
  - line thickness 2px, with node circles of 8px every 120–200px
  - occasional 45° jogs (bends), like real PCB traces
  - occasional short parallel "bus" lines (2–3 lines together) for richness.
- **Colours:**
  - on graphite: yellow `#F7C032` at 35% opacity, with brighter yellow pulses
  - on yellow or light sections: graphite `#3D3E3F` at 25% opacity, with yellow or white pulses.
- **Branches:** in each section, 1–3 branches leave the rails at 45° and run horizontally toward that section's key element (a counter, a device, a card group).
  - A branch stops **at least 24px** away from any text, button or image, ending in a node.
  - Branches never cross text, never pass behind buttons, never cut through cards.
- **Current pulses:**
  - small glowing dots (6px, with a 12px soft glow) travel along the rails
  - **on scroll:** pulse speed ties to scroll speed, travelling down when scrolling down and up when scrolling up
  - **idle:** one pulse every 3–4 seconds per rail, at 400px/s
  - when a pulse reaches a branch connected to the visible section, it travels into the branch and the end node glows for 600ms.
- **Joins between sections:** the rails continue seamlessly across section boundaries. Only the colour transitions, over 80px, when the background changes.
- **Done when:** I can scroll the whole page and follow both rails top to bottom with no gaps, and no rail or branch touches any content.

### 0.2 Colour discipline
- **Allowed:**
  - yellow `#F7C032` (glow `#FFDB6E`)
  - graphite `#3D3E3F`, `#26282B`, `#1F2022` (deepest, used sparingly)
  - white `#FFFFFF`, fog `#F2F3F4`.
- **Never flat black** (`#000`, `#111`) as a panel or section colour. Dark surfaces are graphite with a subtle top-to-bottom gradient (`#3D3E3F` → `#26282B`) and a faint diagonal light beam.
- **Never** the same section environment three times in a row (e.g. graphite, graphite, graphite).
- **No colours outside the palette,** except: green `#2BB673` only for "In stock / Delivered" dots, red `#E5484D` only for "Low stock / errors", Google's own colours inside the Google badge.

### 0.3 Motion rules
- Every section has **at least one continuously living element** (idle loop) **plus** a scroll-in animation.
- **Replay:** scroll-in animations replay every time the section re-enters the viewport (at 30% visibility). Idle loops run while visible and pause off-screen (for performance).
- **Easing:**
  - movements: `cubic-bezier(0.2, 0.8, 0.2, 1)`
  - physical drops: a bounce of at most 6% overshoot.
- **Durations:**
  - micro interactions: 150–250ms
  - reveals: 400–700ms
  - stagger: 60–90ms between siblings.
- **60fps:** animate transform and opacity only. Use real 3D (WebGL / Three.js) or high-quality pre-rendered image sequences for devices and parts, never CSS boxes pretending to be 3D.
- **Reduced motion:** respect the system setting by showing final states without motion.

### 0.4 No overlaps
- Minimum 24px clearance between any animated object and any text or button.
- Text never sits on top of a moving object.
- Floating widgets (Samsoom launcher, toasts) never cover buttons: reserve a safe area of 96×96px bottom-right on desktop, and push content up on mobile.

### 0.5 Realism standard (all images)
- **Devices and parts:** real proportions, rounded corners where real products are rounded, bevels, chamfers, screws, connectors, labels, matte versus glossy materials.
- **Lighting:**
  - one main soft light from the top-left
  - a rim light for edges
  - a soft contact shadow under every object (a blurred ellipse, 30–40% opacity)
  - reflections on glass.
- **Never:** cartoon outlines, flat single-colour shapes, toy proportions, emoji-like icons for products.

### 0.6 Spacing and balance
- Section vertical padding: 120px desktop, 72px mobile. **No extra empty space above titles.**
- The visual (right) and the text (left) are **vertically centred against each other** and of comparable visual weight.

---

## 1. MODEL FILE: rebuild as a "knolling" teardown display

**Problem:** the spinning phone is badly built (wrong shape, unrealistic), random parts float around it, text crashes into the animation, and the purpose is confusing.

**Goal:** in 3 seconds the visitor understands: *"Pick your phone → I see every part they stock for it, neatly laid out, with grades and prices."*

### Layout (desktop, 1440px wide)
- **Top row:**
  - eyebrow "MODEL FILE"
  - headline **"Pick your phone. See every part we have for it."** (max 2 lines)
  - on the right, a **search field** "Find your model…" plus brand chips.
- **Model chips row** under the headline: 8–12 popular models, horizontally scrollable with arrows. No visible browser scrollbar.
- **Main area, a two-panel layout** (40% / 60%, 32px gap, both panels the same height):
  - **Left, the Device panel** (graphite, rounded 24px):
    - Model name, brand, model code (e.g. SM-S928), stats row: Parts · In stock · From.
    - **The device:** a studio render of the selected phone on a slow turntable (one rotation every 12s, ±25° oscillation, not a full 360°, so it always looks good). Real proportions, rounded corners, camera bump, buttons.
    - Button: "Open the full [model] file →".
  - **Right, the Knolling tray** (a dark graphite tray with a subtle grid texture, like a technician's mat):
    - All the model's parts, **laid flat and perfectly aligned** in a neat grid, like professional teardown photography: screen (largest, top-left), back cover, frame, battery, cameras, flex cables (2–3), small parts (buttons, speaker, charging port, screws in a small tray).
    - Each part has a small label below it: name · stock signal · "from AED X".
    - **Below the tray:** a grade strip for the selected part. Grades as rows (code chip, name, price bar, stock, price), a "Your pick" summary and an "Add to cart" button.

### Visuals
- Every part is a realistic flat-lay render with a top-down soft shadow, the same light direction for all.
- The selected part has a yellow outline glow (2px, 12px glow). The others dim to 55% opacity.

### Animation timeline
- **Scroll-in (0–1.2s):**
  1. The tray fades in.
  2. Parts **drop into their positions** one by one, from 20px above, with 70ms stagger.
  3. The device fades in and starts its turntable.
- **Auto-browse (idle):**
  - **Every 5 seconds** it highlights the next part category on the tray (screen → battery → back cover → …), and the grade strip updates (the price bars animate from 0).
  - **After all categories (~35s)** it switches to the next model:
    - the parts slide out to the right (300ms)
    - the new model's parts drop in (stagger)
    - the device cross-fades to the new model.
  - An indicator at the top right of the tray: "● Auto-browsing · tap to take over". The dot pulses.
- When the user clicks anything, auto-browse pauses. It resumes after 20s of inactivity, and the indicator changes to "Paused · you're browsing".

### Interaction
- Click a part on the tray, or a category tab, to select it.
- Click a model chip to switch model.
- Search filters the chips live.
- "Add to cart" sends the part to the cart with the standard add-to-cart animation.

### Mobile
The device on top (smaller), the tray below as a 2-column grid, the grade strip as a bottom card.

### Don't
- No floating random parts around the device.
- No full fast 360° spins.
- No text over the device or the tray.
- No CSS-box phone.

### Done when
- [ ] The phone looks like the real model (rounded, correct camera layout).
- [ ] The parts are neatly aligned in a grid.
- [ ] Nothing overlaps.
- [ ] Auto-browse cycles parts and models smoothly.
- [ ] It's clear within 3 seconds.

---

## 2. BENCH TEST: make the whole section alive

**Problem:** the rig animation is great, but the section around it is dead: flat yellow, plain text, the rig shorter than the section, nothing moving on the left.

**Goal:** it feels like a live testing lab running right now.

### Layout
- **Left column (45%):**
  - eyebrow, headline "Nothing leaves Deira until it passes the rig.", body text
  - the Quality / Warranty / Price checklist
  - **new:** a live test log and a counter (below).
- **Right column (55%):** the rig, scaled so its height **matches the left column's full height** (top of the eyebrow to the bottom of the log).

### Visuals (environment)
- Keep yellow as the base, but give it depth:
  - a radial light behind the rig (white at 25% opacity, 700px)
  - a faint **blurred lab background**: soft shapes of shelves and racks at 8% opacity
  - 2 slow diagonal light beams.
- The rig frame: brushed aluminium with screws, small status LEDs in the corners, a cable running from the rig into the circuit bus.

### New elements
1. **Live test log** (a graphite card, monospace text, 5 visible lines). New lines type in every 2.5s at the top, and old lines slide down and fade:
   - `21:42:08  Unit #2632  Display ........ PASS`
   - `21:42:11  Unit #2632  Touch .......... PASS`
   - `21:42:15  Unit #2633  Battery 98% .... PASS`

   PASS in green, the unit number in yellow.
2. **Counter:** "Parts tested today" with a large number (sample 1,284) that **ticks +1** every time the rig completes a full test.
3. **The checklist reacts:** Quality ticks when Display and Touch pass, Warranty when True Tone passes, Price when Battery passes. Each tick animates (the circle fills yellow, the check draws itself in 300ms).

### Animation timeline (loop ~14s)
1. The phone slides into the clamp (600ms), and the clamps close (300ms, with a metallic "click" feel).
2. The probe moves to the screen.
3. Display runs (2.5s: the pixel grid fills) → PASS.
4. Touch (2.5s: the waveform) → PASS.
5. True Tone (2s: the gradient bar slides) → PASS.
6. Battery (2.5s: the curve draws) → PASS.
7. The receipt prints (1.5s), **fully inside the rig area, readable, the stamp never covering the text**.
8. The counter +1, the log adds lines, the clamps open, the phone slides out, the next phone slides in.

### Ambient (always)
- Faint oscilloscope waves drift slowly across the background (opacity 10%).
- The rig LEDs blink in sequence.
- Circuit pulses enter the rig from the bus.

### Mobile
The rig on top at full width, then the text, checklist, log and counter.

### Done when
- [ ] The rig is as tall as the content.
- [ ] The left side has the live log and counter.
- [ ] The background has depth and motion.
- [ ] The receipt is fully readable.

---

## 3. REPAIR LAB: realistic tools and sequence

**Problem:** the tools look cheap and fake. The repair visual is not convincing.

### Visuals: realistic professional tools, studio-rendered
- **Pentalobe precision screwdriver:** knurled aluminium handle, rotating cap, thin steel tip.
- **Plastic spudger** (black nylon) and thin **opening picks** (blue or translucent).
- **Suction cup** with a ring handle.
- **Fine-tip tweezers** (anti-static, matte steel).
- **Heating pad** (soft mat, temperature display showing 80°C).
- **Magnetic screw mat** with tiny screws placed in grid squares.
- All on a **graphite ESD repair mat** with a subtle grid. Tools cast soft shadows, and metal parts have reflections.

### Repair sequence (scroll-linked inside the panel, or an auto loop of ~16s)
1. **Intake:** a cracked phone slides onto the mat. The cracks are drawn realistically, spreading from an impact point.
2. **Heat:** the heating pad lies on the phone and the temperature rises (a counter 25 → 80°C). Subtle heat shimmer.
3. **Open:** the suction cup lifts the screen edge and the picks slide in around the frame.
4. **Disconnect:** the screwdriver removes 4 screws, which drop onto the magnetic mat in sequence. Tweezers lift the flex connector.
5. **Swap:** the broken screen slides away, the new screen (in its protective film) slides in, and the film peels off.
6. **Boot:** the screen powers on with our logo, then the bench test mini checks flash (Display ✓ Touch ✓).
7. **Seal:** a "TESTED" seal is stamped.

A **step indicator** at the top of the panel: 01 Intake · 02 Heat · 03 Open · 04 Swap · 05 Boot · 06 Tested. The current step is highlighted, with a progress bar under each step.

### Estimator
Keep it.
- The estimate number **rolls** when inputs change.
- The selected grade chip glows.
- "Bench time" shows a small clock icon animating.
- Brand chips use one consistent logo style.

### Done when
- [ ] The tools look like real professional tools.
- [ ] The sequence is clear and smooth.
- [ ] The phone matches the teardown phone's realism.

---

## 4. WHOLESALE & TRADE

**Problems:** black and yellow (not our brand); empty space above the title; an unrealistic truck animation; tiny cheap boxes at the bottom.

### Colours and layout
- The section base stays yellow. **All dark elements become premium graphite** (the calculator panel, ticker, buttons): `#3D3E3F` → `#26282B` gradient, a subtle brushed texture, and a 1px light top edge for a metal feel.
- **Remove the empty space above the title.** The eyebrow starts at the section's normal top padding. Text column and calculator are vertically centred against each other.

### The calculator
- Product chips, a quantity slider (10–500 pcs), and Retail total (struck through) versus Trade total.
- **"You keep" in large yellow**, with a progress bar.
- **All numbers roll** (odometer style, 400ms) when the slider moves.

### The pallet and truck scene (inside the calculator panel, under the totals; height ~260px)
- **Scene setup:** a warehouse floor (graphite concrete texture), a back wall with a roller-shutter door on the right, soft overhead light. The camera is fixed in a ¾ view.
- **Loop timeline (~12s):**
  1. **0.0s:** an empty wooden pallet **drops from above** the frame, lands with a weighty bounce (overshoot 4%, settle 300ms) and a soft dust puff.
  2. **0.6–3.6s:** cartons (realistic corrugated brown cardboard, tape, a label with "SE-4962" and a barcode) **fall one by one** from above and stack in a neat grid on the pallet. Each lands with a slight squash and settles (200ms). **The number of cartons follows the quantity slider** (1 carton per 25 pcs, max 16).
  3. **3.6–4.6s:** shrink-wrap **sweeps around** the pallet in a spiral (a translucent film with highlights).
  4. **4.6–6.6s:** a realistic box truck (white/graphite, Sam Electronics logo on the side) **reverses in** from the right toward the pallet, decelerating smoothly, its reversing lights glowing softly (white, not yellow flashes).
  5. **6.6–7.8s:** the pallet **slides into the truck** on a forklift or slides up a ramp, at a believable speed. The doors close.
  6. **7.8–10.0s:** the truck **drives off to the left**, accelerating, with slight motion blur, and **exits through the edge of the frame** as if entering a tunnel. It never fades out in the middle.
  7. **10.0–12.0s:** a pause on the empty floor, then a new pallet drops, and the loop repeats.
- **The status line** above the scene updates with each phase: "Stacking 12 cartons…" → "Wrapped" → "Loading" → "Off to dispatch · Accra".

### The bottom conveyor (replaces the tiny boxes)
- A proper **conveyor belt** across the bottom of the section: graphite rollers, a moving belt texture.
- **Realistic cartons** (each at least 64px wide on desktop) with readable labels: order number plus a destination ("SE-4962 · Lagos"). They move at a calm speed (60px/s), entering and exiting at the edges.
- If it can't look premium, remove it.

### Trade ticker
Keep it: graphite, readable, smooth scrolling, pausing on hover.

### Done when
- [ ] No black anywhere: everything dark is graphite.
- [ ] The truck sequence is physical and smooth, and the truck exits through the edge.
- [ ] The cartons are realistic and readable.
- [ ] No empty gap above the title.

---

## 5. WORLDWIDE: animate the four info cards

**Keep** the map and the shipments list exactly as they are (excellent).

**Each card** gets a small looping animation (64×64 or larger), in the card's top-left, replacing the static icon:
1. **Tracked:** a mini route line with a dot travelling along it. The tracking number below types in and updates ("SE-4544 · In transit").
2. **Packed:** a flat cardboard sheet folds into a box, tape seals the top, a label sticks on. Loop of 3s.
3. **Quoted:** a price rolls into place ("AED 120 → AED 185 → AED 150"), then a check mark.
4. **Regions:** a mini globe rotates, and the four region names light up in turn under it.

**Hover:** the card lifts 4px and its animation speeds up slightly.

**Done when:** all four cards move, and nothing in them is static.

---

## 6. STORY & BRANCHES

### Timeline
- Current flows along the line between the version nodes, in a loop.
- The "RUNNING" node (v3.0, Sam Electronics) pulses.
- On scroll-in, the cards rise one by one (80ms stagger).

### Dubai branch card
- A **working map** (Google Maps embed in dark style, or a styled static map image) showing Al Murar, Deira, with a yellow pulsing pin.
- Live status, today's hours, "Get directions".

### Madrid branch card
- **Remove the coloured cartoon.**
- Replace it with a **line-art architectural blueprint of Plaza Mayor**: graphite lines on a light blueprint grid, with yellow accents.
  - On scroll-in, the drawing **sketches itself**: lines draw over ~2.5s, as if an architect is drawing it.
  - Then a **"COMING SOON"** stamp lands at an angle (rubber-stamp effect).
  - Small annotations appear: "Plaza Mayor · Madrid", "Branch 02".
- Use a real photo instead, if one is provided later.
- "Tell me when it opens" button.

### Done when
- [ ] No cartoon art.
- [ ] The Dubai map works.
- [ ] The Madrid blueprint draws itself.

---

## 7. THE TEAM: 5 roles

### Roles (exactly these 5)

| Code | Title | Description line |
|---|---|---|
| T01 | **Parts Flow Controller** | Receives, sorts and prepares every part before it reaches you. |
| T02 | **Bench Engineer** | Repairs, tests and certifies every device on our bench. |
| T03 | **Finance & Checkout** | Accounts, invoices and the cashier desk. |
| T04 | **Parts Advisor** | Helps you find the exact part and grade, in person. |
| T05 | **Founder & Managing Director** | Tarek Alchoumari, leading the business since 2003. |

### Layout
- A row of **5 tall portrait cards** (each ~260×400px on desktop). On narrower screens, 3 + 2 centred, or a horizontal swipe.
- **The card:**
  - a large photo frame (~220×240px, rounded 20px) with a **circuit-style border**: a thin yellow line with small nodes in the corners, and a soft glow ring
  - under it the role code (mono, yellow), title (bold), name ("Name coming soon" until provided), "X years with us", and a 5-star rating (honest empty state)
  - the founder's card is slightly highlighted (a yellow border, "Leading since 2003").
- The circuit bus connects the five cards along the bottom, with current flowing from card to card in a loop.

### Interaction
- **Hover:** the card lifts 6px, the frame glow brightens, and the card **flips** (600ms, 3D) to show the back: a short bio placeholder, "What I can help with", and a "Leave a review" button.
- The photo placeholder is a designed silhouette with "Photo coming soon". Not an empty box.

### Done when
- [ ] Exactly 5 roles.
- [ ] Big, beautiful cards.
- [ ] The flip works.
- [ ] The circuit connects them.

---

## 8. OPEN TO EVERYONE: hub and lanes

**Problem:** plain white boxes, nothing moves.

### Concept and layout
- **A central hub:** a glowing circular "Sam Electronics" node (our logo inside a ring), placed in the centre above the cards.
- **Four lanes:** the four customer cards arranged under or around it, each connected to the hub by a circuit trace.
- **Environment:** textured light fog (`#F2F3F4` with a faint blueprint grid at 6% opacity), slow diagonal light sweeps, soft yellow radial glow behind the hub.

### Each card (keep the content, upgrade the visuals)
- A top area (~140px) holds a **small looping 3D scene**:
  - **Retail customer:** a hand-held phone; a search runs, a part card appears, and it drops into a cart.
  - **Repair shop:** a part (a screen) drops onto a repair mat beside tools.
  - **Trader & exporter:** a box travels along a route line on a mini map.
  - **Bulk buyer:** cartons stack into a pallet.
- Below: the title, 3 benefits with yellow dots, and a full-width call to action.

### Interaction
- Hovering a card sends a current pulse from the hub to it, its scene plays faster, and the card lifts.
- The hub pulses gently in idle.

### Copy
Headline: "One phone or one container. We serve everyone like family." Keep the calls to action specific: "Find my part", "Open a trade account", "Plan my shipment", "Request a bulk quote".

### Done when
- [ ] The hub and connected lanes are visible.
- [ ] Each card has a moving scene.
- [ ] The background has texture and motion.

---

## 9. SAM CIRCUIT: battery plus rewards

**Problem:** only a battery. The animation feels stuck. No rewards shown.

### Layout
- **Left:** the text, the "Preview · logged in" card ("You: Charged · 62% → 38% to Supercharged") and the buttons.
- **Right:** the battery (4 cells), with **a rewards panel directly beneath it**, aligned to the cells.

### The battery animation (continuous, ~10s loop)
1. All cells empty.
2. The fill rises cell by cell (25% → 50% → 75% → 100%) with a **spark riding the top of the fill level**.
3. As each tier is reached, that cell's label lights up and its rewards column unlocks.
4. At 100%: a full glow pulse, "Fully Charged", a 1.5s hold, then a smooth drain, and repeat.
5. **The "You" marker** (a small pin labelled "You · 62%") sits at the sample level and stays visible throughout.
6. Hover is not required for anything.

### The rewards panel
- **4 columns**, one per tier, each with **3 perk slots**: rounded chips with a lock icon and "Perk · coming soon".
- When the battery reaches a tier, that column's chips **unlock**: the lock opens, the chip glows yellow, then returns to "coming soon" when the battery drains.
- Under the panel: "Perks are being finalised. Members get them first."

### Ambient
Small energy particles rise slowly from the battery, and the circuit bus feeds a pulse into the battery terminal.

### Done when
- [ ] The battery charges and drains on its own, smoothly.
- [ ] The rewards panel exists and reacts.
- [ ] No hover needed.

---

## 10. SAMSOOM SECTION

### Environment
- Not plain white: a soft lit **studio set**, a light fog background with a large soft yellow spotlight behind Samsoom.
- Faint floating translucent chat bubbles drift slowly upward in the background (opacity 8–12%).

### Samsoom
- A more detailed, polished 3D character:
  - a glossy yellow screen face
  - a graphite phone body with real buttons and a camera dot
  - flex-cable arms with small metal connectors as hands
  - a tiny screwdriver
  - an antenna with a glowing tip.
- **Behaviour:**
  - eyes follow the mouse
  - blinks every 3–5s
  - reacts when the user hovers the suggestion chips (looks at the chip and raises his eyebrows)
  - plays the emote matching the current chat message:
    - **thinking:** loading dots in the eyes, tapping the screwdriver
    - **happy:** a smile and a bounce
    - **found it:** holds up a magnifier
    - **waving**
    - **sending a kiss:** a small heart pops.

### The chat demo
- Plays automatically like a video, looping through 4–5 short conversations:
  - "Do you have a Galaxy A54 battery?"
  - "Which grade should I pick?"
  - "Are you open now?"
  - "Do you ship to Nigeria?"
  - "Trade prices?"
- **Typing indicator** before each answer (1–1.5s), and Samsoom's emote synced to each answer.
- **Avatars:** Samsoom's round avatar beside every Samsoom message; a round user avatar (a neutral silhouette in a graphite circle) beside every user message.
- The suggestion chips under the chat glow in turn, showing they're clickable.
- **Language:** English only in English mode.

### Done when
- [ ] The chat plays on its own with avatars.
- [ ] Samsoom's emotes change with the messages.
- [ ] The background has its own environment and motion.

---

## 11. FINAL SECTION: an advert-style finale (rebuild)

**Problem:** the cartoon evening background, colours outside our brand, nothing happening.

**Goal:** it feels like the closing shot of a premium TV advert for Sam Electronics.

### Environment
- Graphite studio, a dark gradient, one strong top spotlight, a reflective floor.
- The circuit bus runs into the scene.
- **No illustrations, no sky, no evening colours.**

### Sequence (plays on scroll-in, ~8s, then an idle loop)
1. **0–2.5s:** realistic parts (screen, battery, back cover, frame, cameras, flex) **float in from all sides** in slow motion and **assemble into a phone** at the centre, each part snapping in with a small light flash.
2. **2.5–3.5s:** the phone's screen **powers on** with our logo, and a light sweep crosses the glass.
3. **3.5–4.5s:** the circuit bus lights up across the whole section, with current racing into the phone.
4. **4.5–6.0s:** **"Quality · Warranty · Price"** appears word by word (each word lights up yellow).
5. **6.0–8.0s:** the headline and buttons rise in: **"A phone on your bench? We have the part."**, then **Browse all parts · WhatsApp us · Visit Deira**.
   - Count-up stats under them: "20+ years · 14 brands · 9,000+ parts" (sample).
   - **Samsoom** pops in beside the phone and waves.
- **Idle:** the phone slowly rotates ±15°, the spotlight shimmers, and parts occasionally separate slightly and snap back.

### Done when
- [ ] No cartoon or off-brand colours.
- [ ] The parts assemble into a phone.
- [ ] Everything feels like a premium advert finale.

---

**Final instruction:** fix every section to its "Done when" checklist. Then show me the whole home page again, top to bottom, with short screen recordings or step screenshots of the animated sections (Model File, Bench Test, Repair Lab, Wholesale truck, Sam Circuit, Samsoom, Finale).
