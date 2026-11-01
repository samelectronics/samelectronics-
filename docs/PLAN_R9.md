# Round 9 · Master plan (agreed before coding)

Sources: owner messages of 29 Oct to 1 Nov 2026 (home fixes, detail-page rebuild, Control Room v2 spec + additions A/B/C).
Rules: no long dashes in site text, American spelling, every new string in every language, no real Daftra data in code or seeds.

## Phase 1 · Home fixes
- Samsoom pops up ~1 s after the first visit; nav lock/profile/cart get the yellow LED hover.
- Samsoom buttons: one consistent style (primary yellow, others matched, Close grey).
- Tour: small Skip top-right; Back (grey) and Next (white) equal width; mirrored in RTL.
- Tour emotes scripted per step (point + smile/blink, hand under chin + blush, …).
- Yellow-side circuits: fast strong glow, no trailing outline. Progress bar glows and moves all the time.
- Long translations shortened (fr/ru/es first); every language checked against EN/AR layout.
- Repair tools re-rendered realistically; remove the yellow LED "magic fix" sweep.
- Teardown final call: reflective floor fades smoothly into grey/white.
- What we offer: remove half-page wall texture, subtle full-bleed texture; parts open the shop filtered.
- Live board: rebalance and fix circuits; every list row clickable.
- Bench test: shared title sizes, cable to the edge, site-standard buttons, hero texture.
- Studio scene (floor fading to distance + spotlight) behind EVERY part/box visual site-wide; fix cut glows.
- Showcase: mouse-follow shine on white sections, new arrow buttons.
- Deals: no glowing tick, "Live deals" before the title, several planes (HK, VN…), 3D pre-order parts, mouse-follow yellow glow.
- Wholesale/Worldwide: circuits both sides, textures.
- Repair Lab: model dropdown above buttons, no leading dash on small titles, main button opens /repair.
- Membership: premium techy cards, small embossed logo, battery fills bar by bar, one title colour.
- Story: shared font sizes, smooth glowing timeline (no black ring), faster map entry.
- Meet Samsoom: static avatar except while listening/typing; sample questions sent from the user side.
- Who are you: parts grounded, centred, bigger; realistic globe from the hero.
- Feed: use the empty lower phone area, real floor background.
- Request console: send only when complete, otherwise open full form keeping input; Google review opens maps.app.goo.gl/wiMCNcX3SqyPpM9S6.
- Footer: brand notice, Warranty, Shipping, Privacy, Terms open real pages. Every button audited.

## Phase 2 · Site-wide systems
- 24 languages: en, ar, es, fr, fa, ru, hi, ur + tl, ml, ca, de, it, pt, ro, zh (Simplified) + gl, eu, sw, am, ha, yo, om, ig.
  Fonts loaded per language (Ethiopic, Malayalam, CJK). Length budget vs English; translations editor flags overflow.
- Welcome: Samsoom left, scrollable language list right (own-script names, detected language on top, glowing "scroll for more").
- Help button offers a tour of the current page; every page has its own tour.
- Samsoom only as the bottom-right circle on detail pages.
- Sounds: original synthesized tech sounds per action; settings to pick a sound pack, volume, mute. Off in the Control Room.
- Cookie banner (Core Circuit / Memory Chip / Signal Meter / Booster): accept all, deny all, choose; choices recorded.
- Ads system: auto-rotating clickable banners; horizontal ads between product rows; max 3 boxes per ad.
- Notifications for customers and staff. Themed FAQ at the end of each page + one FAQ page.
- Prices in AED / USD / EUR; installable as an app (PWA).

## Phase 3 · Detail pages rebuilt (each with its own signature cover)
- Shop (Deals merged as a tab): search opens a full panel with recent/saved searches; branded My device picker with model-code search; no Find My Part inside the shop; Customize panel with site scrollbar and clear sidebar shortcut; yellow/black trade notice.
- Product view: scroll fix, no stray scrollbar, new action icons, custom named lists, grade colours, plain test-data note, reviews only after staff-confirmed purchase.
- Price display modes: exact, range, from, ask on WhatsApp, call for price, trade-only; optional editable note ("confirm on WhatsApp").
- Repair: exploded phone, model-code lookup with per-brand "find your code" guide, live fee meter, step-by-step booking ticket.
- Brands & manufacturers: supply-chain story, equal cards, aligned buttons, interactive grade/manufacturer comparison.
- Wholesale, Worldwide (route map, shipping methods, payment methods page), Membership (simulator), Story, Contact, Legal.
- Ask Samsoom: professional AI layout (welcome, capabilities, suggestions, history side panel).
- Account: profile photo/initials, new sign-in/sign-up, notifications, lists, tracking, warranty check, notify me; trade: reorder, quick order by codes, price-list PDF.
- Payment methods: full list shown, owner toggles each one in the Control Room.

## Phase 4 · Control Room v2 (Daftra is the brain, the website is the face)
Build order:
1. Daftra connection (server-side key, read-only first, then quotation/invoice creation) + name-matching tool.
2. Requests & orders inbox (statuses, assign, notes, WhatsApp replies, convert to Daftra, confirm purchase, quotation follow-up).
3. Repairs job cards (intake, QR ticket, technician, parts out of stock, statuses + messages, signature, warranty sticker, rating).
4. QR for everything + phone scanner (stock in/out, counts, receiving, tickets).
5. Stock & locations, purchasing & suppliers (to-order list, lost sales, incoming shipments), pricing (margins, bulk, trade levels, coupons, bundles, approvals), returns & batch claims.
6. Customers & trade (credit, statements, approvals, privacy export/delete), delivery & shipping (drivers, tracking, branded documents).
7. Brand Studio (brand kit, template editor for every document/message, fill-in fields, copy library) + catalogue/price-list builder (filters, columns, tab layouts, cover, currency, presets, schedule, live link) + branded Excel import/export.
8. Messages & campaigns (email now; SMS/WhatsApp API when accounts exist; reminders; stats; consent).
9. Visual website editor (live preview any page/device/language, click to edit text/images/3D/icons/links, toggle/reorder/add sections, drafts, publish, schedule, changes library with compare/restore, owner approval) + ads & pop-up builder (placements, triggers, frequency, stats, A/B).
10. Samsoom settings + staff Samsoom; seasons & events; shop floor (queue, TV, counter tablet, tasks, calendar); reports; AI helpers; health & data quality; training; security (roles, 2-step, devices).
Activity Center: every action by everyone incl. owner, before/after, dashboard widget + own page + per-item history, role-based visibility, alerts, evening summary. No screen recording.
All controls in brand style (no native grey widgets). All exports branded.
