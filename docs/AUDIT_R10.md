# R10 Stage 0 · Audit (2 Nov, current commit, EN/AR × desktop 1440 / phone 390)

Screenshots: one sheet per two home sections (EN desktop · AR desktop · EN phone · AR phone) + entrance timeline.

| Item | Result | What is wrong → moves to |
|---|---|---|
| Entrance sequence | FAIL | Cookie banner shows together with the language picker from 1.2 s → **A4** |
| Welcome picker | FAIL | Box much bigger than needed, bubble text overflows in French ("Choisissez votre langue") → **B1** |
| Hero | PASS (desktop) / CHECK phone AR | AR phone shows the device mock-ups first, title pushed down → **B1/U3** |
| Teardown | PASS look · phone OK | scroll behaviour tested in C1 |
| What we offer | FAIL phone | 4 cards squeezed in one row on phone, title one word per line → **D1** |
| Live board | FAIL phone | Stat boxes and the feed terminal cut at the right edge → **U6** |
| Bench test | FAIL phone | Rig pushes the title into a narrow column; stats missing → **E1/E2** |
| Showcase | PASS | edges re-cut in **E4** |
| Deals | FAIL | Desktop: first carousel card cut at the left; phone: title squeezed beside the button → **F1** |
| Wholesale | FAIL | Pallet builder right panel is an empty grey box (desktop) |
| Repair Lab | PASS | |
| Worldwide | FAIL phone AR | Shipment list overlaps the map |
| Sam Circuit | FAIL phone AR | Card hidden, tiers cut |
| Story | FAIL | Timeline photos are empty beige boxes; phone shows a tiny scaled desktop → **G1** |
| Team | FAIL | AR desktop: founder badge cut at the left; phone: order tags off-edge |
| Meet Samsoom | PASS | |
| Who are you | PASS | |
| Feed | FAIL | "@samelectronics.uae" cut (EN + AR); phone QR cards cut at the right → **H1** |
| Request console / Visit | PASS | |
| Reviews | FAIL | Cards cut at both edges, "us." alone on a line, Google box cut on phone |
| Finale | FAIL | Logo dim grey, half the section empty → **I1** |

Summary: the phone layout is the biggest gap (9 sections). All FAIL items are now REDO and fixed in Stage 1, then
re-shot with the same script.

## Fixed (R10 Stage 1, batch 1 · re-shot with the same script, smoke test 84 runs ALL CLEAN)
- A1/A2 loader: real progress, 2.4–6 s, 15 messages (4 per visit, 12 languages), all icons one size incl. Samsoom.
- A4 one sequence: loader → language picker → welcome → cookie banner, never together. Settings no longer opens by itself
  (the live-settings refresh used the same event as the Settings button).
- B1 picker: compact box, Samsoom right under his bubble, ranked languages (detected pinned), list follows the bubble,
  top/bottom fades. Phone bubble was invisible (fade-out animation ended at 0) → fixed.
- Phone layouts (new src/styles/phone.css): What we offer (2-column cards), Live board, Bench test (portrait stage),
  Deals, Story (portrait album), Worldwide (map then list), Sam Circuit (card first), Feed, Reviews.
- Arabic on phones: hero title and Bench text were off-screen → fixed; nav icons overlapped (hide rules used the English
  title text) → fixed with classes, also fixes the lock icon showing on Arabic desktop.
- H1 Feed handle on its own line, never cut. Reviews marquee fades at the edges. Finale reveals in 2.5 s instead of 4+.
- B6 clock ticks on the exact minute + re-check when the tab returns. G2 amber 30 min before closing. I2 Monday→Sunday.
- B10 nav hover: soft light, no circle. B11 text-fit no longer shrinks titles and resets after a language change.
- B12 phone-reel ads open their poster again (the shared reel controller pointed at a discarded page instance).

## Laptops (owner, 2 Nov: "I was talking about laptop") · 1280×720, 1366×768, 1536×864, EN + AR
- 1536: all 19 sections pass.
- 1280 / 1366: Bench title ballooned to 4 lines and pushed the stats off (title size divided by the stage scale) → capped.
  Team badges swung into each other and covered the role names → swing limited to the free gap, badges a bit smaller.
- Re-shot after the fix: Bench 2 lines with stats visible; badges clear, EN and AR. Smoke test ALL CLEAN.

## Stage 1, batch 2
- B2 Samsoom fully inside every circle (even padding, centred). B7 one quick-settings button (globe + gear) with
  Language (ranked) | Settings (sounds, currency, privacy, all settings) tabs. B8 new sound set around the bell click:
  soft, low, no squeaky tones; packs Classic, Soft, Studio. B9 bell items open My Bench → Notifications (filters,
  mark read, clear; also for signed-out visitors), "See all", Escape closes. B13 online/offline: graphite pill with a
  green / red / amber dot, no veil.

## Stage 0 redone for LAPTOPS (owner, 2 Nov) · 1440×900 and 1280×720, full-size frames, every section
| # | Section | Finding | Plan ID |
|---|---|---|---|
| L1 | Bench test | Buttons smaller than every other section and touching the bottom (no safe space); on 1280 they wrap to two rows | E1/E2 |
| L2 | Bench test | "Today on the rig" numbers and labels tiny | U6/E2 |
| L3 | Bench, What we offer, Live board, Wholesale | Side circuits are short stubs / lumps, not hero traces | U2/D1/E3 |
| L4 | All light sections (offer, showcase, repair, story, who are you, reviews) | Golden-yellow title line on white | U5 |
| L5 | Many sections | Main buttons not one size (finale ~34px, deals 48px, story small, board 52px) | standard buttons |
| L6 | Deals | Carousel cards cut at both edges; big empty dark gap under shipment/pre-order boxes; pre-order list starts with a half-hidden row on 1280 | F1 |
| L7 | Live board, Wholesale ticker | Marquee first item hard-cut at the edge | no clipped elements |
| L8 | Worldwide | Shipping-quote ticket shows "AED 0"; tracking label cut on 1280 | no AED 0 |
| L9 | Showcase | On 1280×720 the card is taller than the screen, its button falls below the fold | fit |
| L10 | Team | Founder badge band text cut on 1280 | no clipped elements |
| L11 | Reviews | Title leaves "us." alone on a line | text |
| L12 | Story | Timeline markers plain grey dots, not glossy LED nodes | G1 |
| L13 | Finale | Small buttons; circuits broken into segments, not continuous from the sides | I1 |
| L14 | Stat boxes | Different sizes per section (bench, wholesale, samsoom, finale, offer boxes) | U6 |

### Laptop fixes done (re-shot at 1440×900, 1366×768, 1280×720, EN + AR; smoke test ALL CLEAN)
- L1 Bench buttons: standard 52px / 16px (counter-scaled against the stage), one row, 112px yellow safe margin below.
- L2/L14 one stat size (src/styles/system.css): bench, wholesale, Samsoom facts, finale; bench stats never touch.
- L3 U2: the old stub/lump circuits removed; one generator draws long traces down every section's empty side gutters
  (enter from the edge, run down, 45° jogs, a joining trace with a junction, pads at the ends, continuous pulses).
- L4 U5: no golden-yellow title lines on white sections (graphite); dark sections keep white + yellow; yellow keep graphite.
- L5 one button size for every section's main buttons.
- L6 Deals: empty gap removed (pre-order list fills its card), wider soft fade on the deal belt.
- L7 marquees fade at both edges. L8 Worldwide quote counts 140 → 185 (never AED 0), tracking number on its own line.
- L9 Showcase fits one screen on 1280×720. L10 Team band text fits. L11 titles balanced (no lone word).
- L12 G1 Story markers are glossy LED nodes.
- Still open from this list: L13 Finale circuits continuous from the sides (with I1, next).
