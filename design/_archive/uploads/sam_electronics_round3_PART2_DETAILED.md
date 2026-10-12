# SAM ELECTRONICS: ROUND 3, PART 2 (DETAILED ENGINEERING SPEC)

*From the owner. This covers the sections not in Part 1: the hero devices, the teardown, the parts cabinet and the live parts board. Same format and the same global rules (§0 of Part 1: continuous circuit bus, graphite not black, nothing static, no overlaps, realism, replay on scroll).*

**Order on the page:** Hero → Teardown (graphite) → Parts Cabinet (**light**, never graphite: the sections above and below are graphite) → Live Parts Board (graphite) → Bench Test (yellow) → …

---

## H. HERO DEVICES (iPad and phone): small but important fixes

The hero itself is excellent. Keep everything else exactly as it is.

### H1. The phone ad reel, repair card
- **Problem:** it shows a random, unidentifiable component.
- **Fix:** show a **realistic phone with a cracked screen** that animates into a repaired screen:
  1. cracks glow yellow
  2. the cracks seal line by line (~1.2s)
  3. the screen boots with our logo
  4. text: "Cracked screen? Fixed, tested, guaranteed." with "Book a repair →".
- **Check every ad card** in the reel: each one shows the correct, realistic, recognisable product (screen, battery, back cover, frame, flex, camera, small parts) or service visual (repair, wholesale pallet, worldwide globe with the world map).

### H2. The iPad cart animation
- **Problem:** when a product is added, the iPad's cart turns into a plain yellow box with no animation. It looks fake.
- **Fix, a proper add-to-cart sequence inside the iPad screen (~1.4s):**
  1. A finger-tap ripple on the product card's "+" button.
  2. A small copy of the product image **flies in an arc** to the iPad's cart icon (top-right of the iPad screen), shrinking as it goes (600ms).
  3. The cart icon **bounces** (scale 1 → 1.2 → 1, 300ms), and its badge number rolls +1.
  4. A slim toast slides up from the bottom of the iPad screen: "✓ Added · Pixel 8 Pro Camera" (graphite, rounded). It stays 1.5s, then slides down.
  5. The browsing continues.
- The toast must never cover the product grid's key content. Keep it within the bottom 12% of the iPad screen.

### Done when
- [ ] Every phone ad card shows a correct, realistic visual.
- [ ] The iPad add-to-cart has the fly, bounce, badge and toast sequence, with no yellow box.

---

## T. THE TEARDOWN: full rebuild as a cinematic pinned scene

### Problem
- The phone is boxy with sharp corners, and the layers are misaligned: the board and battery hang off to the left.
- The same part list appears three times (left list, right labels, bottom card).
- Label lines cut diagonally across the phone.
- The scene sits in an inner box with a hard right edge and a cut-off half-circle "floor".
- The title is tiny and squeezed under the nav, and the bottom card is randomly placed.
- Nothing lights up or progresses.

### Goal
The most cinematic section on the site. As the user scrolls, a real phone opens layer by layer while lights switch on one by one.

### Structure (pinned scroll scene)
- **Height:** the section is ~350vh tall. Its inner stage (100vh) is **pinned** (sticky) while the user scrolls through it.
- **Scroll progress** (0 → 1) drives everything **frame by frame, both directions** (scrubbed, with light smoothing so it never jumps).
- **Each of the 8 layers** gets ~30–35vh of scroll, so there's always visible change and never a dead scroll.

### Stage
- Full width and full height. **No inner box, no hard edges, no cut-off floor.**
- Background: living graphite (`#3D3E3F` top → `#1F2022` bottom) with:
  - a soft **top spotlight** (a cone of light, white at 10% opacity) centred on the phone
  - a **reflective floor** where the phone's reflection fades into darkness (gradient mask, 30% → 0%)
  - faint background circuits at 10% opacity, with the global bus rails continuing at the edges.

### The phone
- A **realistic 3D model** (WebGL / Three.js, or a high-quality pre-rendered image sequence of 120+ frames).
- Real proportions (about 71.5 × 146.5 × 8mm), **rounded corners and curved edges**, real camera layout, buttons, ports.
- **8 layers, in real order (front to back):**
  1. **Front glass:** thin, transparent, with reflections
  2. **Display:** the OLED panel, with a flex tail
  3. **Frame:** the metal mid-frame, rounded, with antenna lines
  4. **Flex cables:** orange/amber ribbon cables with connectors
  5. **Logic board:** a green PCB with chips, shields and connectors
  6. **Battery:** a black pouch with a printed label and connector
  7. **Cameras:** the camera module cluster with lenses
  8. **Back glass:** frosted, with the camera bump cut-out
- **Separation:** along **one smooth axis** (the depth axis, seen from a ¾ angle), evenly spaced, perfectly aligned, every layer the same outline.
- **Lighting:** a key light from the top-left, a rim light, reflections on glass and metal, soft shadows between layers.

### Scroll timeline (progress 0 → 1)
| Progress | What happens |
|---|---|
| 0.00–0.08 | **Opening:** the closed phone faces the viewer, centred, screen on with our logo and a slow light sweep. A large centred headline: **"Take any phone apart."** (64px, white). |
| 0.08–0.15 | The headline **shrinks and docks top-left** (to 40px), the second line **"We stock every layer."** fades in under it (yellow), and the phone **rotates smoothly to a ¾ view** and moves to the right-centre of the stage. |
| 0.15–0.95 | **8 steps** (~0.10 each). In each step: layer N **separates** from the stack by one spacing unit (eased), its **LED switches on**, its **edges glow yellow** (outline 2px, glow 16px), the previous layers **dim to 70%**, and the **info panel updates** to layer N. |
| 0.95–1.00 | **Finale:** all 8 LEDs lit, and the layers **fan out horizontally** in a row along the bottom of the stage, ready to drop into the Parts Cabinet below. |

### The LED rail (your "lightbulbs")
- **Position:** a vertical rail on the **left side** of the stage, under the docked headline, about 480px tall.
- **8 LEDs** (14px circles, each with a 6px inner dot), evenly spaced, joined by a circuit line. Each has a short label next to it (01 Front glass … 08 Back glass, mono font).
- **Off state:** graphite, with an unlit dot.
- **On state:** yellow dot, 20px soft glow, label in white.
- **Between LEDs:** when an LED turns on, **current flows** along the line to the next one (a 400ms pulse), as if powering it up.
- **Scrolling up** turns the LEDs off in reverse.

### The info panel (one only)
- **Remove** the left list, the right labels and the bottom card.
- **One panel** (graphite glass, rounded 20px, ~360px wide) placed **beside the active layer**, connected to it by one clean straight leader line with a node. The line never crosses the phone body.
- **Contents:**
  - the step number "03 / 08"
  - the part name (28px bold)
  - stock (rolls to its number in 500ms)
  - grade chips (Original · Service Pack · OLED · Incell · High Copy, only those available)
  - "From AED X"
  - **"Shop [part] →"** (primary yellow button)
- **On each layer change:** the old text fades out (150ms), the new text **types in** (name) and **rolls** (numbers), and the panel slides slightly to align with the new layer.

### Reverse
Scrolling up runs everything backwards: layers rejoin, LEDs turn off, the headline grows back to centre, the phone rotates back to front view.

### Mobile
- No heavy pinning.
- The phone image sits at the top of each step, and each layer step is a full-width block: the layer render lights up as it enters the view, its LED (in a horizontal row of 8 at the top) turns on, and the info panel sits under it.

### Don't
- No boxy rectangles.
- No misaligned layers.
- No diagonal label lines across the phone.
- No inner box, no half-circle floor, no repeated lists.
- No long scroll where nothing changes.

### Done when
- [ ] The phone looks real and rounded.
- [ ] The layers separate cleanly in order.
- [ ] The LEDs light up one by one with flowing current.
- [ ] One info panel updates per layer.
- [ ] It's pinned and smooth in both directions.
- [ ] The finale fans the layers out.

---

## C. THE PARTS CABINET (replaces "Everything we offer")

### Problem
- Eight identical cards in a grid, a flat background, no motion.
- A generic services row.
- Toy-like frame and tools images.

### Goal
It feels like walking into a pro repair workshop's lit parts wall. It's unique to us and full of motion.

### Environment (must differ from the graphite sections above and below)
- A **light, premium workshop wall:** bright brushed aluminium or warm fog (`#F2F3F4` → `#E9EAEC`) with a fine horizontal brushed texture.
- **Warm yellow light** washing from the top (a radial glow at 20% opacity).
- Subtle wall panel seams.
- The global bus rails continue (graphite at 25% opacity on light).

### Headline
- Eyebrow "EVERYTHING WE OFFER".
- Headline **"Every part family, on one wall."**
- Count-up stat line: **"8 part families · 14 brands · 9,000+ parts on the shelf"** (sample), the numbers rolling on scroll-in.

### The cabinet
- **Layout:** a wall of **8 drawers in 2 rows of 4** (desktop), each ~300 × 200px, inside a cabinet frame (anodised graphite metal with rounded corners and screw heads).
- **Each drawer front** is brushed metal (slightly darker than the wall) with:
  - a **recessed handle** (polished metal)
  - a **label plate** with the code (SCR, BAT, FLX, BCV, FRM, CAM, SML, TLS) and the family name
  - a **small LED** top-right (off: grey; lit: yellow glow)
  - a **stock signal** (4 bars) and the stock number in mono.
- **The Sam Electronics node:** a glowing circular node with our logo, mounted at the top-centre of the cabinet. Faint circuit traces run from it **behind the cabinet** to every drawer.

### Transition from the teardown (on scroll-in)
- The 8 layers fanned out at the end of the teardown **slide down** into this section and each **drops into its drawer** (front glass and display → SCR, frame → FRM, flex → FLX, logic board → SML, battery → BAT, cameras → CAM, back glass → BCV).
- As each part lands (90ms stagger), the drawer **closes with a soft bump**, its **LED lights**, and current flows from the node to that drawer.
- TLS (tools) lights last, with a small toolbox click.

### Hover / tap a drawer
1. The drawer **slides out toward the viewer** (translateZ / scale 1.08, 400ms), revealing its inside: a **black foam insert** with the **realistic part** sitting in a cut-out.
2. The part **rotates slowly** (±20°, 6s loop).
3. A detail tag **types in** beside the drawer: name, stock (rolls), "from AED X", grade chips, and **"Shop [part] →"**.
4. A current pulse runs from the node to that drawer, and its LED brightens.
5. Moving away closes the drawer smoothly.

### Brand chips (above the cabinet)
- All · Apple · Samsung · Xiaomi · Redmi · POCO · Realme · Oppo · Vivo · Huawei · Honor · Google · Sony · Tecno · Infinix. One consistent monochrome logo style, horizontally scrollable.
- **Selecting a brand:** every drawer's stock number **rolls** to that brand's count (500ms), its signal bars update, and drawers with **0 stock dim** to 40% with the LED off.

### Live details (idle)
Every 4–6 seconds a random drawer's LED **flickers** and a small tag pops above it: **"+40 · iPhone 15 Pro OLED"** (sample). It fades after 2s.

### The three services: looping mini-scenes (a row under the cabinet)
Three wide cards, each with a **live mini-scene** (~220px tall) on top and text plus a button below:
1. **Repair Lab:** a realistic cracked phone screen; the cracks glow yellow and **seal** line by line (1.5s), the screen boots with our logo, a "TESTED" seal stamps, then the loop restarts. Text "Fixed, tested, guaranteed." · button **"Book a repair"**.
2. **Wholesale:** cartons **drop** onto a pallet and stack, shrink-wrap sweeps, and a price tag **flips** from "Retail AED 125" to "Trade AED 98". Text "Stock up. Cost down." · button **"Get trade prices"**.
3. **Worldwide:** a small **rotating globe with the real world map**; a parcel travels from Dubai to a different country each loop (Lagos → Baghdad → Istanbul → London), with its status changing Packed → In transit → Delivered. Text "From Deira to the world." · button **"Ship to my country"**.

These cards use their own surfaces (one graphite, one yellow, one white) so they contrast with the light wall.

### Realism
Every part inside the drawers is a **detailed studio render**. **Frames** have antenna lines, button cut-outs and screw holes. **Tools** are a real precision screwdriver, spudger and tweezers. **Small parts** are buttons, a speaker mesh and a charging port.

### Mobile
- The cabinet becomes a **horizontal swipe** of drawers (one and a half visible). Tapping opens a drawer.
- The services stack vertically, with their animations running.

### Done when
- [ ] Light workshop environment (not graphite).
- [ ] The parts drop into drawers from the teardown.
- [ ] Drawers slide out on hover with rotating realistic parts.
- [ ] The brand chips roll the counts.
- [ ] Live flickers.
- [ ] Three animated service scenes.

---

## B. LIVE PARTS BOARD: connect the left side to the board

### Problem
- The board on the right is good. The left side is dead and messy.
- A circuit node touches the "See deals & arrivals" button.
- A meaningless "SE-BUS" circuit fragment floats in empty space.
- The four counters are static, with a big dead gap above the button.
- The two sides don't feel connected.

### Layout (left column)
1. Eyebrow, headline "What's moving on our shelves, right now.", body text.
2. **4 counter tiles** in a 2×2 grid (Just landed · Low stock · Price drops · Shipped today).
3. **"Trending right now"** row (new).
4. **The "See deals & arrivals" button**, directly under the trending row: 32px gap, aligned left, with **48px clear space around it**. No circuit within 24px.

**Remove** the SE-BUS fragment and any decorative circuit that carries nothing.

### The live link (core idea)
- Each counter tile is connected to the board by **its own circuit trace**, running from the tile's right edge to the board's left edge, with clean 45° bends and never crossing text.
- **Every time a new row lands on the board** (every 3–4s, from sample data), a **current pulse** travels from the board, along the matching trace, **into the matching counter** (Shipped row → "Shipped today"; Price drop row → "Price drops"…), taking about 700ms.
- **When the pulse arrives:**
  - the tile **flashes** (its border glows yellow for 400ms)
  - its number **ticks up** with a roll (5 → 6)
  - its mini chart adds a point.

### Counter tiles, alive
Each tile (graphite glass, rounded 16px) shows:
- a small **animated icon**:
  - Just landed: a box dropping
  - Low stock: a battery draining
  - Price drops: a tag falling
  - Shipped: a truck moving
- the label (mono, coloured dot)
- the big number
- a **tiny live sparkline** of today's activity (draws in on scroll-in, adds points live).

**Click a tile** to filter the board to that type; the active tile glows (yellow border plus inner glow). Click again to clear it.

### Trending right now
- A row of 3–4 chips that **keeps changing**, for example "iPhone 13 screen · 24 searches", "A54 battery · 18", "Redmi Note 13 LCD · 15", from sample data.
- Every 3s one chip slides out to the left and a new one slides in from the right. The search counts roll.

### The board (right)
- Keep the current design.
- **New rows slide in at the top** (from 12px above, 300ms) and their text **types in**. The **newest row glows** briefly (a yellow left border plus a background tint for 1.2s).
- Fix truncated text ("Service P…"): allow two lines or shorten names smartly.

### Mobile
The counters become a 2×2 grid above the board, the traces are hidden, and the counters still flash when matching rows arrive.

### Done when
- [ ] No circuit touches any element.
- [ ] No filler circuits.
- [ ] Pulses travel from board rows into the matching counters and the numbers tick.
- [ ] Sparklines and icons are animated.
- [ ] The trending chips rotate.
- [ ] The button sits right under the content.

---

**Final instruction:** apply Part 2 together with Part 1. Then show me the full home page from top to bottom, with recordings or step screenshots of the hero devices, the teardown, the parts cabinet and the live parts board.
