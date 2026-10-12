# SAM ELECTRONICS: ROUND 4 FIXES (home page, final round)

*From the owner. Some parts improved, but several got worse. This is the **last home page round**: do everything here, show me the full page, then we move to Part C.*

**Section 0 of round 3 (what to keep) still applies.** Placeholder product images and sample data are still fine for now.

---

## 0. KEEP (these are good now)

- **Repair Lab phone-fixing animation.** Amazing, keep the motion exactly (only improve the parts, see 2.8).
- **The nav** and how it changes with each section.
- **Live Parts Board:** cleaner now.
- **Service cards with buttons**, the review card with "No reviews yet", and the multicolour Google "G".
- **Shipment box sitting on the route line.**
- **The world map** and the globe.

---

## 1. REMOVE / UNDO

1. **The vertical progress line with dots on the left edge.** Remove it completely. The progress line under the nav already does this job.
2. **The hero demo must never touch the real cart.** The iPad's "add to cart" animation only updates the cart *inside the iPad*. The real nav cart count stays at the visitor's real number (0 for a new visitor).
3. **Bench Test:** remove the conveyor belt with dropping parts, and the faded card in the background. Both look cheap.
4. **Model file:** remove the circles/hotspots scattered on the phone images.
5. **Sam Circuit:** remove the small battery icons inside each tier card.
6. **The yellow dot that appears next to prices** when a new deal shows. It collides with the text.

---

## 2. SECTION BY SECTION

### 2.1 Hero
- **The iPad and phone screens look blurry and glitchy.** The screen content must be sharp: render it crisply and avoid blurry scaling inside the 3D tilt.
- **A yellow rounded square is covering the "Cameras" chip** on the iPad. Remove the glitch.
- **The back-cover renders** (on the iPad and everywhere) have very thick frames and huge side buttons. Use real phone proportions: thin frames, small, accurate buttons and camera bumps.

### 2.2 Teardown (right after the hero). Currently the weakest section; rebuild it.
- **Make the phone truly 3D.** A real 3D phone (three.js or equivalent) in a dark studio with a soft spotlight, a subtle reflective floor and a yellow rim light. As you scroll, the camera orbits slightly while the layers explode apart in real depth with real thickness: glass, display, frame, board, battery, cameras, back.
- **Each layer gets a label** with a thin leader line pointing to it as it separates.
- **The list on the left is dead.** Turn it into a live spec sheet: the active layer shows its stock count, its grades as small chips and its "from" price, counting up as it becomes active. The other rows stay compact.
- **The part card below the list is cut in half** at the end of the section. It must always be fully visible (pin it with the phone).
- Smooth scrubbing tied exactly to the scroll. No jumps.

### 2.3 Everything we offer: magnetic parts
- **The parts shake when the mouse moves fast** because they follow instantly and snap back too quickly. Fix the physics:
  - follow the cursor **slowly and smoothly** (gentle easing, no instant jump)
  - move at most ~10px
  - return over ~0.6s with a soft ease-out and **no bounce or overshoot**
  - ignore very fast mouse movement.
- Add subtle circuits in the empty areas of the section, never touching cards or text.

### 2.4 Live Parts Board
- Add a few more subtle animated circuits in the empty space (left side below the counters and around the board), with small data pulses travelling along them. Clean, not crowded.

### 2.5 Bench Test: make it premium
- Replace the conveyor and the faded background card with a **premium test rig**: a machined aluminium fixture with clamps holding the phone, and a **probe arm** that moves to the phone for each check.
- Each check shows a small **live readout** while it runs (a waveform for touch, a colour bar for True Tone, a charge curve for battery), then a tick.
- Background: rich yellow with a fine engraved circuit pattern and soft studio lighting. Expensive and clean, nothing random.

### 2.6 Model file
- **The brand row is too faint** and looks thrown in the background. Make it a proper brand bar: clear contrast, real wordmarks, the active brand in a dark pill, with a soft scroll fade on the edges.
- **Left panel:** one clean, realistic phone render on a slow 360° turntable. When a part category is selected, **that part lifts out of the phone** (for example the battery slides out for "Batteries"). No scattered images or circles.

### 2.7 Deals and arrivals
- **The cards should keep moving continuously** instead of swapping one at random. Use a slow, continuous horizontal carousel of all 14 deals that pauses on hover. When a card enters, its price drops (the old price falls away, the new one clicks in).
- The flipping card is currently left slightly tilted and misaligned at rest. Every card must rest perfectly straight.

### 2.8 Incoming shipment
- **The box stopped moving.** Keep it on the line, but make it travel along the arc again in a loop: it leaves Shenzhen, travels, lands at Deira with a small pulse, then restarts. The "% of the way" text updates as it moves.
- Add subtle circuits in the empty space of the card and the section.

### 2.9 Repair Lab
- **Keep the animation.** Make the components realistic:
  - the logic board with real chips, shielding cans and connectors (not a flat grid)
  - the battery with a real foil wrap, a label and a flex connector
  - the display with real glass depth
- **Tools: make them 3D, realistic metal tools,** not flat 2D shapes:
  - a precision screwdriver with a knurled steel shaft, an ESD-safe handle and a pentalobe bit
  - a spudger
  - a suction cup with a ring pull
  - fine tweezers
  - a heat pad

  Brushed-steel highlights, real shadows and reflections. They move in and work on the phone during the repair.

### 2.10 Wholesale
- **The pallet and wrapping look fake.** Make them realistic:
  - brown cartons with tape, printed labels (SAM ELECTRONICS, barcode, FRAGILE)
  - a wooden pallet with visible slats
  - clear stretch film with a soft sheen and wrinkles, wrapping around the cartons as the pallet fills
- **Make it fun:** when the pallet is full, a small forklift lifts it and drives it off, then a new empty pallet slides in.
- **The yellow side areas are empty and flat.** Add subtle moving elements: faint circuits, and small parcels with tracking labels drifting along a route line. Clean, never covering content.

### 2.11 Story and branches
- **The Plaza Mayor line drawing looks unrealistic.** Replace it with a realistic, rich illustration of Plaza Mayor (the arcaded square, red-brown facades, lamp posts, warm evening light) that fills the whole panel, with a small "Coming soon" pin on it.

### 2.12 Open to everyone
- **The Repair shop card is the only dark one,** which looks random. Make all 4 lanes the same style, each with its own small animated icon. Highlight a lane only on hover.

### 2.13 Sam Circuit
- **One big battery made of 4 cells.** Each cell is filled with yellow charge up to its own level:
  - Connected: 25%
  - Charged: 50%
  - Supercharged: 75%
  - Fully Charged: 100%, completely full and glowing

  The fill rises when the section comes into view, with a soft charging pulse.
- **Fully Charged is currently grey/white.** It must be the fullest, brightest cell.
- **Invite visitors to an account:** a "Create account / Log in" button, and a line like "Log in to see your charge." Show a sample logged-in preview: "You: Charged · 62% → 38% to Supercharged", with a small progress bar. Perks stay "coming soon".

### 2.14 Meet Samsoom: redesign the mascot
- **The new Samsoom is boring:** just a phone with dot-matrix eyes, and not centred. He must be a **real mascot: cute, funny, unique, techy and premium.**
- Direction:
  - a slim, realistic phone body (aluminium frame, glass reflections)
  - **big expressive glowing eyes** on the screen that squash, stretch, blink and change shape for each emotion (like a modern robot companion), not dot-matrix
  - **bring back his arms and hands:** flexible cable arms with small rounded hands that wave, point, give a thumbs up and hold parts
  - small details: a tiny antenna that sparks yellow, a screwdriver he can pull out
- **Emotes must be smooth and believable:** blink, look around, follow the cursor, think, celebrate, wave, sleepy, not sure.
- **Centre him properly** in his area.
- **The section feels empty.** Fill it:
  - Samsoom reacts to the chat demo: he holds up the part being discussed, nods while "typing", and celebrates when the answer lands
  - remove the large empty space at the top of the chat window (start the conversation higher, or show more messages)
- Update the launcher to the new design.

### 2.15 Social wall
- **QR codes for Instagram, TikTok and Facebook,** with small tabs to switch between them (not Instagram only).
- **The card above the QR code has a big empty area.** Fill it, for example with the latest post preview and follower counts for each platform.

### 2.16 Final call to action: rebuild it
- **The current scene is empty and random** (a mini Samsoom, a green phone back and a pedestal).
- **New scene: our shop in Deira.** A realistic, detailed isometric mini storefront of Sam Electronics:
  - the lit sign
  - shelves of parts boxes
  - a counter with a technician's bench
  - Samsoom at the door waving
  - an **OPEN / CLOSED neon sign that follows the live status**
  - daylight when open, and an evening scene with warm interior lights when closed

  Small life inside: a light flickering on the bench, a box being packed.
- It's unique, fills the area, ties directly to "Visit Deira", and brings new colours (warm interior light, evening sky) so the page doesn't end in black and yellow again.

---

## 3. GLOBAL

1. **Animation quality.** Animations feel weak and not smooth. Every animation must run at a smooth 60fps:
   - animate only position, scale, rotation and opacity
   - use soft easing curves (no linear motion, no snapping)
   - use smooth scrolling, with scroll animations scrubbing exactly with the scroll
   - durations of about 0.4–0.8s for UI and longer for ambient motion
   - nothing jittery, nothing that shakes.
2. **More life, but clean.** As you move from section to section, there should always be something small and techy moving: data pulses along circuits, a counter ticking, a status light, a parcel moving. Simple things, never crowded, never covering content.
3. **Colours are repeating** (black and yellow over and over, especially at the end). Use more materials, while staying on brand:
   - **brushed aluminium / silver** surfaces
   - **warm white studio** backgrounds
   - **real component colours**: copper flex, green boards, silver battery foil
   - **frosted glass** panels
   - **warm lighting** (the final storefront scene)

   Suggested order for the end of the page: Sam Circuit (yellow) → Samsoom (brushed aluminium, light) → Social (warm white studio) → Request console + Visit (graphite) → Final storefront scene (its own lighting).
4. **Realism.** Phones, parts, tools, pallets and buildings should look realistic: real proportions, materials, light and shadows. No flat, cartoon or "toy" shapes.
5. **Circuits in empty areas** of every section, subtle and animated, always with clear space around text, buttons and cards.

---

## 4. WHEN YOU'RE DONE

Show me the full home page top to bottom, including the footer, the new Samsoom and the new final scene. After this round we move to **Part C** of v4.
