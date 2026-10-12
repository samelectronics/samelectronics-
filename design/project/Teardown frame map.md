# Teardown "The Stack" · scroll / frame map

Desktop: section 780vh, stage pinned 100vh, p = 0 → 1 (frame = round(p × 239)). Mobile: not pinned, the same p is auto-played on scroll-in (prev/next + replay).

| p | What happens | Lights On |
|---|---|---|
| 0.000–0.050 | Title word by word, blur → sharp | near-black #141517, grain, narrow spot on title |
| 0.050–0.100 | "We stock every layer." in, title docks top | |
| 0.100–0.150 | Phone rises standing | spot moves to phone |
| 0.140–0.180 | Screen on: logo + light sweep | |
| 0.190–0.260 | Phone tips back to isometric (55° tilt, 30° turn), moves right; left column in | |
| 0.270 + n×0.055 | Layer n lifts (01 Screen · 02 Frame · 03 Flex cables · 04 Logic board · 05 Battery · 06 Cameras · 07 Small parts), base stays on the floor, yellow edge + LED + leader line, earlier layers 70%; left story column scrolls so the open card sits at screen centre | studio cyclorama + polished floor, scan beam 05–06 |
| 0.655–0.680 | 08 Back glass (base) LED | |
| 0.680–0.745 | Showcase: stack turns ±15°, all LEDs lit | |
| 0.750–0.850 | Reassembly bottom-up (cameras → front glass), click + spark per seam | stage starts lighting |
| 0.852–0.890 | Phone stands to front view, moves left | finale: fog → yellow gradient |
| 0.885–1.000 | Phone-screen advert (time-based, ~3.7s): Screens./Batteries./Cameras./Flex. 0.3s each → "All in stock." → "Get yours today." → logo slam + sweep + slogan, holds (replays on re-entry; FMP button pulses at logo land). Headline, count-ups, Shop-by-layer chips (hover lifts that layer out), buttons; block scales to fit | |

Below the stage: Repair Lab · Wholesale · Worldwide service cards (SE Services.dc.html).
Reverse: everything is scrubbed, scrolling up plays it backwards.

Round 8: constant camera distance (fit = exploded stack and standing phone inside the safe area, nav 72 + 40px top, 40px bottom); object always rests on floor line = top + 0.93 × safe height. Shadows/reflection are screen-space canvases in se-teardown-3d.js. Capture page: `Preview Teardown Frame.dc.html?w=1366&h=768` (forced viewport, default 1440×900).
