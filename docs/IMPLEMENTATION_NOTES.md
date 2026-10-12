# Implementation notes: Home v3 in Next.js

Branch `feat/nextjs-site`, app in `site/`. Status as of 12 October 2026.

## What was built

- Home v3 exactly as exported from Claude Design. Each section is its own component on the home
  page (`site/src/components/home/sections/` and `site/src/components/dc/`). No pages beyond `/`.
- The three.js teardown, parts library, teardown ad, finale/turntable 3D and globe data are the design
  files, byte-identical (`npm run dc:check`), loaded by the page at runtime.
- Checked in headless Chromium at 1440×900 against the original prototype:
  - the rendered DOM matches element for element (9,117 elements; the only differences are clocks,
    rotating messages and the country list changed below);
  - screenshots of the hero, teardown, What we offer and Repair Lab match;
  - the app logs fewer errors than the prototype.
- Real texts come from `site/src/content/facts.ts` (Company Facts PDF). Changes this made to the page:
  - **Story timeline numbering:** v1.0 Syria Tell 2003 → v2.0 current shop 2011 → v3.0 market branch →
    v4.0 Sam Electronics today, then Madrid (coming soon). It was v1.0 / v2.0 / v2.5 / v3.0 / v4.0.
  - **Worldwide map and list:** UAE (home) plus the 22 countries the facts list for the website map.
    Russia was shown before; it stays in the facts' example-countries list only.
  - **Contact, address, Plus Code, founder name, Madrid opening line, legal name:** now read from the facts
    file. The values are unchanged, so the page looks the same.
- **Bug fixed:** `SE World Map.html` called `grp.selectAll` outside the loop that defines `grp`, so the
  label anti-overlap pass threw and never ran (country labels could overlap). It now uses `rg`. The
  prototype has the same error.

## Not verified here

- **Teardown scroll tests:** the 8 tests (spec p.17) need a real browser with real scrolling. This
  container renders WebGL in software and cannot run them reliably.
- **CDNs:** the container blocks unpkg/esm.sh/jsDelivr, so the comparison served the same package
  versions from npm. Production browsers load them from the CDNs, as the design does.
- **Mobile:** not checked (G10: mobile is batch 11).

## Where the spec and the current design disagree

The PDF wins where they disagree, but the brief for this step was to build Home v3 as it is now, without
redesigning. These are the known gaps, in spec order. Each is a design round still to do (Section S
batches).

| Spec | Gap in the current Home v3 |
|---|---|
| Issue 1 (teardown) | The design's last report lists the 8 scroll tests as not run and the depth-of-field blur on inactive layers (steps 4–12) as missing. |
| Issue 2 (What we offer) | The design session stopped partway through this issue, so its entrance film, the three ads' films, the diagonal wipes and the circuits are not confirmed against pp. 23–26. |
| Issue 3 (Live Board) | Not rebuilt to the new layout (counter tiles, wiring channel, compact rows, filter tabs). |
| Issue 4 (circuits) | No circuit audit yet; per-section circuits and the busy background textures are as exported. |
| Issue 5 (Bench Test) | Not rebuilt as the pinned 300vh rig. |
| Issue 6 (Showcase) | The Model File (`SE Home Models`) is still on the home page; the spec removes it and adds The Showcase screen ads. |
| Issues 7–17 | Deals, Trade Floor, Worldwide colour fix, Story, Staff Badges, "Who are you?", Charging Station, Samsoom, Feed + Reviews, Request + Visit and the Finale have not been rebuilt to their scripts. |
| Issue 11 + facts §7 | Badge codes are T01 Parts Flow Controller, T02 Bench Engineer, T03 Finance & Checkout, T04 Parts Advisor, T05 Founder. The facts' version B (and the spec's order) is T01 Parts Advisor, T02 Parts Flow Controller, T03 Bench Engineer, T04 Finance & Checkout, T05 Founder. Left as designed until the badges are rebuilt; both role lists are TO CONFIRM. |
| Issue 10 vs facts §2 | The spec says "v3.0 RUNNING / v4.0 INSTALLING", but under the facts' numbering v4.0 is Sam Electronics today. The page shows v4.0 RUNNING and Madrid INSTALLING. Madrid's label (v5.0) is not in the facts and is marked TO CONFIRM. |
| Issue 18 (Find My Part) | Not redesigned. |
| Facts §11 | Family stock comes from the sample catalogue. Frames shows 11 brands where the facts table says 14 (Screens 2,211, Batteries 1,760 etc. match). |

## Open questions for the owner

`openQuestions()` in `site/src/content/facts.ts` lists every TO CONFIRM item (20 today). These include:
- which store phone is current;
- the full brand list;
- grades and warranty per grade;
- which repairs are offered and whether same-day is possible;
- VAT, trade tiers and shipping details;
- team names and role titles;
- Madrid's date and label;
- Sam Circuit perks;
- Ramadan and holiday hours;
- whether logic boards are sold;
- the Google review link, the domain, the logo SVGs and real photos.

## Technical notes

- **Client-only home page.** The home page renders in the browser only (the design code reads `window`
  during render), so search engines see the metadata but not the page text yet. Server rendering can come
  with the shop pages, when content moves to Supabase.
- **Strict mode.** React Strict Mode is off: the design's logic classes start timers on mount and were
  written for a single mount.
