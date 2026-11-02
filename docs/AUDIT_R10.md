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
