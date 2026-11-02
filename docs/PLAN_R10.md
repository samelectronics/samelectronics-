# Round 10 · Finalization plan (agreed before coding)

Every point from the owner's message of 2 Nov (sections A–I), the older lists pasted with it (home fixes, detail pages,
Control Room v2 spec + additions A/B/C + extra ideas), and the new security/login requests. Each point has an ID so it can
be referred to. Status: **NEW** = not built yet · **REDO** = built before but not right, rebuild · **CHECK** = built and
deployed in R9, must be verified on the live site with screenshots (see Stage 0) and redone if it still looks wrong.

---

## Stage 0 · Verify before building (so nothing is repeated a 10th time)

- **0.1 Cache bug (fixed, deployed 2 Nov).** The website's offline cache kept old copies of images, fonts and data files
  forever (same file name = old picture). Re-rendered repair tools, part images etc. could look unchanged for returning
  visitors. Now cleared and refreshed on every visit.
- **0.2 Live audit.** Before any new work: open the live site (Vercel connector), screenshot every CHECK item below in
  English and Arabic, desktop and phone, and send a pass/fail sheet with pictures. Anything that fails moves to REDO.
- **0.3 Universal rules become automated checks** (run after every step, results sent with screenshots):
  no text overflow in 24 languages · no long dash in any text · all buttons lead somewhere real · no "AED 0" · every
  part image on a studio stage · stat boxes same size site-wide · no clipped elements · title colours from one palette.

---

## Stage 1 · Entrance and site-wide systems

### A · Entrance (the first 10 seconds)
- **A1 Real loading screen (REDO).** The loader tracks real progress (fonts, hero images, 3D, catalogue) and only ends
  when the home page is actually ready. Minimum time 2.4 s, maximum 6 s (then it lets you in anyway), always the same feel.
- **A2 Loader messages (REDO).** All icons the same size and spacing; "Waking Samsoom" uses a Samsoom icon at exactly
  icon size. A pool of ~15 messages ("Calibrating screens", "Charging batteries", "Testing flex cables", "Polishing
  glass", "Checking warranty stickers"…), 4 shown per visit, in the visitor's language.
- **A3 Public site never loads the Control Room (CHECK + enforce).** Control Room code stays in its own bundle; the
  public site never downloads it. Staff get their own loading screen after sign-in.
- **A4 One sequence, never overlapping (REDO).** Loader → fully faded out → Samsoom welcome / language → fully closed →
  cookie banner. Nothing else may appear before the previous step is gone. The Settings panel never opens by itself,
  only when the visitor presses it (bug: it opened during the entrance).

### B · Home hero and global controls
- **B1 Welcome picker rebuilt (REDO).**
  - Box only as big as needed; Samsoom stands right under his bubble (no gap), both vertically centred.
  - Language order: detected language pinned on top, then English, Arabic, Spanish, French, then the rest by how
    likely our buyers speak them (Russian, Hindi, Urdu, Persian, Chinese, Portuguese, German, Italian, Tagalog,
    Malayalam, Swahili, Amharic, Hausa, Romanian, Yoruba, Igbo, Oromo, Catalan, Galician, Basque).
  - Soft fade at the top and bottom of the scrolling list. As Samsoom's bubble cycles languages, the list scrolls
    smoothly to highlight the language being shown (the detected one stays pinned).
  - Glowing "scroll for more" stays.
- **B2 Samsoom in circles (REDO, everywhere).** Fixed inner padding so no hand, antenna or shadow ever leaves the circle.
- **B3 Tour never blocks what it points at (REDO).** Samsoom and his bubble move to the free side of the highlighted
  element (e.g. beside the language list, never on it); flipped in RTL.
- **B4 Cookies, clear and fun (REDO).**
  - Proposed names (familiar phone parts, with the plain legal type under each):
    **Battery** · essential (cart, language, sign-in, always on) · **Memory Chip** · preferences ·
    **Diagnostics** · anonymous statistics · **Antenna** · marketing and offers. (Owner can pick other names.)
  - Each one clickable with "Read more": what it stores, how long, why, and an example, plus a full Cookies page.
  - Icon: Samsoom biting a real-looking cookie with crumbs falling (animated once, then idle).
  - Choices stored with a date; "Cookie settings" link in the footer to change them any time.
- **B5 Find My Part, rebuilt and linked to the shop (REDO).**
  - Quick view: brand tabs → all models as a searchable grid (with model codes) → all parts for that model with grade
    chips and prices.
  - "See it all" opens the full Find My Part page; choosing a part opens the shop already filtered to it.
  - Remove the old "the shop arrives in Part C" message everywhere.
- **B6 Clock (REDO).** Open/closed pill and hours update on the exact minute (timer aligned to the clock, plus a re-check
  when the tab becomes visible).
- **B7 Quick settings button (REDO).** One smart button in the nav (globe + gear): opens a clean panel with two tabs,
  **Language** (ranked like B1) and **Settings** (sounds, currency, privacy, install app). No half-cut settings box under
  the language list.
- **B8 Sounds (REDO).** New sound set built around the notification-bell click the owner likes: soft, low, rich clicks;
  no squeaky high tones. Open and close keep their heavier sound. Packs: Classic, Soft, Studio. Still off in the Control Room.
- **B9 Notifications (REDO).** Bell items are clickable and open My Bench → Notifications (full history, mark read,
  filters). The welcome note opens My Bench, not the shop. Staff get their own bell in the Control Room.
- **B10 Nav hover (REDO).** No yellow circle: a soft yellow light that fades in under/behind the icon and fades out.
- **B11 Switching language (REDO).** The "switching" pill is written in the chosen language; the page switches as soon
  as the language file arrives. Fix the bug that shrinks the hero text after a language change and keeps it small after
  returning to English (the text-fitting script keeps old measurements).
- **B12 Hero phone ads (REDO).** The phone-reel ads open again when tapped.
- **B13 Online/offline messages.** Proposal: graphite pill in our style with a small green (back online) or red
  (offline) dot. Colour keeps the meaning, style matches the site.

### Universal design system (applies to every section and page)
- **U1 Studio stage for every phone/part (REDO).** One shared component: reflective floor fading into darkness (or
  white), soft spotlight from above, contact shadow under the object, colour and shadow reacting to light/dark sections.
  The old one-colour platform is removed everywhere.
- **U2 Circuit system (REDO).** One generator used by every section, copied from the home hero: traces enter from the
  sides, run down, bend inward, join other traces, glowing pulses travel continuously (no restarting), never touch text
  or elements, use empty space only, same thickness and size as the hero. No 2 cm stubs, no "lumps".
  **Detail pages: NO circuits filling or spammed across backgrounds.** At most a few iconic hero-style traces at the
  edges of a cover; content areas stay clean.
- **U3 Entry animations (REDO).** Every element (titles, text, boxes, cards, images, stats) enters like the hero.
- **U4 Mouse glow (NEW for home).** Blurred yellow light that follows the mouse, like the hero, on all home sections.
- **U5 One colour palette for titles (REDO).** No golden-yellow title on white pages; same yellow/graphite rules everywhere.
- **U6 Stat boxes (REDO).** One stat component with one size everywhere (Bench "Today on the rig" included).
- **U7 Cut-out quality (REDO).** Re-cut every screen/part image with clean anti-aliased edges (no white fringes).
- **U8 Smooth performance.** Animations at 60 fps on a mid-range phone; heavy effects pause off-screen.

### Section fixes
- **C1 Teardown scroll (REDO).** No kick-down: fast scrolling speeds the teardown up step by step and always stops at
  the final call. Skipping is only done with the Skip button.
- **C2 Final call parts (REDO).** Logic board and small parts animate like the rest; every part moves the same way
  (right in English, left in Arabic/RTL).
- **C3 Teardown background (REDO).** The yellow circles become soft blurred lights that drift and react to the mouse.
- **C4 Final call phone (REDO).** Time/battery icons with a proper safe margin; screen rendered sharp (higher
  resolution, no blur).
- **C5 Skip teardown (REDO).** Takes you to the final call (the ad still plays), not past it.
- **D1 What we offer.** Studio stages (U1); side circuits redone with U2.
- **E1 Bench test layout (REDO).** Same container width, spacing and text widths as other sections.
- **E2 Bench stats (REDO).** U6 stat boxes, never cut.
- **E3 Bench circuits (REDO).** U2.
- **E4 Showcase screens (REDO).** U7 clean edges.
- **F1 Deals list (REDO).** Every phone/part fully inside its frame.
- **G1 Story titles and timeline (REDO).** U5 colours; event markers rebuilt as glossy LED nodes in the bar's colours.
- **G2 Map (REDO).** Status light green when open, amber within 30 min of closing, red when closed (live). Embedded map
  pointed at the owner's link (maps.app.goo.gl/EsZiUQy8HmzfJg6QA, resolved to the exact place).
- **H1 Feed (REDO).** Username never cut; roomier layout; floor fades into darkness (no visible line).
- **I1 Finale (REDO).** Circuits run continuously from the sides; cinematic studio background with spotlight; no cut glows.
- **I2 Hours (REDO).** Monday to Sunday everywhere.

### Older home points (pasted again) · CHECK in Stage 0, redo if they fail
Samsoom auto-pop · LED hover on lock/profile/cart (now becomes B10) · one Samsoom button style · tour Skip in the
corner and equal Back/Next · scripted emotes · left yellow circuits without trailing outline · long FR/RU/ES words ·
teardown floor into grey/white · What we offer texture + parts open the shop · Live board circuits + clickable rows ·
Bench title sizes, cable to the edge, standard buttons, texture · Showcase background/shine, studio boxes, arrow buttons ·
Deals tick, "Live deals" eyebrow, several planes, 3D pre-orders, mouse glow · Wholesale circuits · Repair Lab background,
no dashes, opens the Repair page, dropdown in front · Worldwide textures · Membership premium cards, small logo, battery
bar, one title colour · Story font sizes, progress bar glow, faster map boxes · progress bar shine moving · Meet Samsoom
still avatar, sample questions from the user side · Who are you parts grounded, centred, bigger, real globe · Feed
lower phone area used · Request console only sends when complete, Google review link · legal pages · all buttons work.

---

## Stage 2 · Accounts, sign-in and security (owner can test everything)

- **S1 Owner account.** The owner signs up with tarek-chou@hotmail.com (password chosen by the owner, never in chat);
  after the e-mail is confirmed, that account becomes owner in Supabase. Only a confirmed address can be promoted.
- **S2 Sign-in and sign-up pages (REDO, customers and staff).** No Samsoom: logo, cinematic dark background like the
  teardown, slow blurred yellow lights, one focused glass card. Help link: "Talk to a person" (WhatsApp/live chat) or
  "Ask Samsoom".
- **S3 Real e-mails.** Codes, confirmations and password resets sent from a proper mail service (Resend) under the
  company's own domain, with SPF/DKIM so they land in the inbox like Gmail security mails. Needs the domain (buy it, then
  10 minutes of DNS). Until then Supabase's built-in mail (slow, few per hour).
- **S4 Control Room entry, three locks.**
  1. Control Room key (one strong shared key, set in Vercel) before the sign-in form even shows.
  2. Personal e-mail + password.
  3. Personal 6-digit code from an authenticator app (two-step, Supabase MFA), required for every staff account.
  Plus: new-device e-mail confirmation, sign-out from all devices, lock after repeated wrong tries.
- **S5 Staff accounts by invitation only.** The owner invites; the invite link sets the password and the authenticator;
  no public staff sign-up.
- **S6 Remove the design preview** once the owner can sign in (or keep it owner-only).
- **S7 Account recovery.** Password reset by e-mail; authenticator recovery codes shown once; owner can reset a staff
  member's two-step.

---

## Stage 3 · Detail pages, rebuilt one by one (each with its own idea, home-hero quality)

Rules for all: unique signature cover per page (no copy-paste), no background circuit spam (U2), U1–U8, Samsoom only as the bottom-right circle, themed
FAQ at the end of each page, more interactive information, never empty space, same-size cards with aligned buttons.

- **P1 Shop + Deals merged.** "Parts warehouse" cover: shelving racks with lit bins, scanner beam over the search.
  Deals/arrivals become shop tabs (the /deals page redirects). Search panel grows downward with history and saved
  searches (CHECK). My device picker (CHECK). Rotating, clickable ads, interleaved every few rows, max 3 boxes (CHECK).
  Customize panel: branded scrollbar, consistent title colours, quick filters in the sidebar clearly labelled
  "Quick filters", the full panel opens from "Customize everything" (REDO). Trade notice: black + yellow only (REDO).
- **P2 Product view.** No inner scrollbar; page scrolls normally; new icon set for Star/Compare/Save/Alert/Share;
  custom named lists ("Shop order June", "For Ahmed"); grade colours (CHECK); plain note "Prices and stock shown are test
  data while the shop is set up" (no "until the owner"); reviews only after confirmed purchase (done).
- **P3 Repair Lab.** Exploded phone you can click (screen, battery, camera, port…) → that repair for your model with
  every grade, fitting fee meter (gauge) and total; model-code finder (done, polish); booking as a printed-style job
  ticket with QR; live "bench now" status.
- **P4 Brands & manufacturers.** Story told as a supply chain: factory → box → Deira → your bench, animated on scroll.
  Manufacturers as chips on a circuit board, each wired to the grades it makes; tap a chip for its story, box photo,
  warranty and parts. Grades as an interactive comparison (brightness, colour, touch, battery, price, warranty bars).
  Brand cards same size, buttons on one line.
- **P5 Ask Samsoom (professional AI page).** Like a real assistant app: history sidebar, welcome with capabilities,
  suggestion cards, attach a photo of a broken phone, model-code helper, "talk to a person" handover, answers with
  product cards and buttons.
- **P6 Account (My Bench).** Profile photo (done), dashboard with order/repair tracking timelines, warranty check by
  code/QR, notify-me list, named lists, notifications history (B9), Sam Circuit card; trade: reorder last order, quick
  order by pasting codes, download trade price list PDF.
- **P7 Wholesale.** Trade floor: pallets, live trade calculator (retail vs trade savings), application tracker.
- **P8 Worldwide.** Live route map with flights/ships, shipping methods and times per region, customs notes, payment
  methods (done).
- **P9 Membership.** Premium techy cards (embossed small logo, NFC chip, holographic edge), battery charging level by
  level, points simulator slider.
- **P10 Story.** Firmware history as a boot log / version timeline; branch maps with live open status.
- **P11 Contact & help.** Switchboard: WhatsApp, call, visit, live chat with staff or Samsoom, opening hours live.
- **P12 Legal, Cookies, FAQ, Payments, Cart.** Clean reading layouts with a side index; cookie page (B4); payments
  (done, polish); cart (done, polish).

---

## Stage 4 · Control Room v2 (Daftra is the brain, the website is the face)

### 4.0 Structure and look (REDO first)
- Sidebar grouped like Daftra, short and clean; each group expands to its pages:
  **Home** (Dashboard, Activity Center, Notifications) · **Sales** (Requests & orders, Quotations, Invoices, Customers &
  trade, Payments) · **Repairs** (Job cards, Warranty & returns) · **Inventory** (Products & prices, Stock & locations,
  Purchasing & suppliers, Shipments, Scanner, QR & labels) · **Website** (Visual editor, Ads & pop-ups, Events, FAQ,
  Translations, Media, Samsoom) · **Documents** (Brand Studio, Excel & price lists, Reports) · **Messages** (Campaigns,
  Reminders, Live chat) · **Shop floor** (Queue, Shop TV, Tasks, Calendar) · **Team & security** · **Daftra** · **Settings**.
- Layout fix: no cut boxes, no white gaps; cards fill the width; branded textures and the soft shine like the home hero.
- Real charts and grids (lines, bars, donuts with axes and values), not coloured boxes.
- Control Room in every site language; Samsoom for staff knows every feature (4.18).

### 4.1 Dashboard with live Daftra data
Sales chart (invoices per day: total, paid, unpaid, returns), payments summary (paid/unpaid donut), daily payments,
low-stock list, website requests, repairs due today, trade applications, live team activity. Daftra data comes through
the server bridge; whether Daftra's API exposes its own activity log is to be checked (if not, our Activity Center logs
website actions and Daftra documents created from the website).

### 4.2–4.25 Modules (spec agreed earlier, in build order)
1. Daftra connection + matching tool (done: read, match, pull, Send to Daftra). Next: parse Daftra names into
   brand/model/part/colour/quality automatically.
2. Requests & orders inbox: statuses, assign, notes, one-tap WhatsApp replies, convert to Daftra quotation/invoice
   (done), Confirm purchase (unlocks reviews), quotation expiry + follow-up reminders, manual orders and manual repairs.
3. Repairs job cards: intake (model code, IMEI, problem, damage photos, arrival checklist), QR ticket, technician,
   parts used out of stock, statuses with WhatsApp at each step, pickup signature, warranty sticker QR, rating → Google.
4. Returns & warranty claims, batch numbers per supplier delivery, faulty-rate per supplier.
5. QR for everything (products, shelves, cartons, invoices, quotations, tickets, stickers, parcels, flyers, door):
   staff scan opens the exact item with actions; customer scan opens the public page; flyer QR scan counts.
6. Phone scanner (web): stock in/out, stock count with variance report, receiving against purchase orders.
7. Stock & locations: shelf/bin, thresholds, dead stock, history, branches (Madrid in EUR).
8. Purchasing & suppliers: to-order list (low stock + lost sales + notify-me + no-result searches), purchase orders,
   incoming shipments feeding the website planes, reservations before landing.
9. Pricing: margin rules, bulk changes with preview, trade levels, price history, deal scheduler, coupons, vouchers,
   bundles; owner approval above a discount; price display modes in bulk (done per product: exact/range/from/WhatsApp/
   call/trade + note; add per category/brand/site-wide).
10. Customers & trade: profiles, Daftra balance, tags, notes, points, trade approvals with licence, credit limit +
    statement PDF, referrals, privacy export/delete, consent records.
11. Delivery & shipping: drivers with route and proof photo/signature, carriers + tracking page, branded packing list
    and commercial invoice, battery air-freight notes.
12. Brand Studio: brand kit (logo, colours, fonts, slogan, stamp, signature); template editor (click, type, move) for
    invoices, quotations, proforma, delivery notes, receipts, proposals, letters, warranty cards, repair tickets, emails,
    WhatsApp, SMS, social posts, labels, flyers, posters; fill-in fields; every language incl. RTL; ready-to-copy texts.
13. Catalogue & price-list builder (done: filters, columns, tabs, branded Excel + print). Add: photos, brand logos on
    tabs, cover sheet with customer name, currency AED/USD/EUR, language, trade levels, saved presets, regenerate in one
    click, send by e-mail/WhatsApp, live share link, scheduled sends, PDF.
14. Branded Excel import (done). Add: dropdowns inside the template, 3D box picker for products without a photo.
15. Visual website editor: live preview of any page (desktop/tablet/phone, every language); click any element to edit
    text, image, 3D product, button, link, icon (branded set), colours (brand palette), background, spacing; toggle any
    element or section; drag to reorder; duplicate/add blocks; Save as draft / Publish / Schedule; Changes library
    (every draft and version with who/when and before/after; restore, compare, reuse saved setups like "Ramadan home");
    owner approval option; links manager + redirects; media library incl. 3D renders; translations editor with length
    warning; FAQ editor; SEO titles; smart shared fields (phone, hours, payment methods… change once, update everywhere:
    site, templates, Samsoom, PDFs, e-mails).
16. Ads & pop-up builder (done: shop ads, pop-up, events). Add: click-and-type designer with 3D product, placements
    (home, shop, product pages, brand/model, hero phone reel, iPad, between rows, Samsoom bubble), triggers (seconds,
    scroll %, leaving, first/returning, trade only, language, device, dates), frequency cap, stats, A/B test.
17. Messages & campaigns: e-mail now (Resend), SMS and automatic WhatsApp when accounts exist; one customer or a segment;
    templates; now or scheduled; automatic reminders (repair ready/not collected, unpaid, warranty ending, back in stock,
    price drop, unanswered request); delivery/open/click stats; consent + unsubscribe.
18. Samsoom settings + staff Samsoom: name per language, tone, greetings, answers library, unanswered questions,
    handover; staff Samsoom knows every Control Room feature and where everything is, and can act after confirmation.
19. Seasons & events (done: ribbon presets). Add: Samsoom outfits, greetings in the welcome and from the circle every X
    minutes, light themes, banner + discount, automatic dates (owner confirms moon-based dates).
20. Shop floor: walk-in queue (tablet ticket + TV), shop TV with ads, counter tablet catalogue, task board +
    announcements, calendar.
21. Reports: sales by brand/part/quality/staff, repair turnaround, requests vs sales, no-result searches, lost sales,
    supplier faults, campaign/ad results; branded Excel/PDF exports.
22. Team & security: roles incl. driver, per-feature permissions, Stage 2 locks, Activity Center (below).
23. Activity Center: every action by everyone incl. the owner (who, what, when, where, before → after); dashboard widget
    with live feed and who is online on which page; full page with filters, search, export; per-item history on every
    product/order/repair/customer; alerts for important actions; daily summary in the owner's evening report; sensitive
    items by role. No screen recording (staff informed in writing).
24. AI helpers: descriptions in all languages, supplier-invoice photo → purchase, handwritten list reader, template
    translation, new-arrival social images.
25. Health & data quality: site down/slow alerts, speed dashboard, missing photo/price/brand/quality list, duplicate
    finder, export everything.
26. Training: guide per feature, onboarding checklist.
27. Daily owner summary by e-mail (WhatsApp later).

### Honest limits
- Live staff monitoring = activity feed + who is online and on which page. No screen recording.
- Automatic WhatsApp needs the WhatsApp Business API (paid provider); SMS needs a provider and a UAE sender ID; e-mail
  needs the domain. Click-to-WhatsApp works today.
- A WhatsApp "app" (Samsoom, catalogue, status messages, booking forms inside WhatsApp) is possible through the Business
  API later; the site is already installable as an app; store apps can come later on the same system.
- Daftra features depend on what Daftra's API exposes; anything it does not expose is shown as a link into Daftra.

---

## Final review rule
Every step ends with a review pass: anything cut, clipped, overlapping, misaligned or off-palette is fixed before it
is reported, in English and Arabic, desktop and phone.

## Order of work
Stage 0 (audit, already started) → Stage 1 (entrance, home, universal system) → Stage 2 (owner + security, so the
owner tests the real Control Room) → Stage 3 (detail pages, Shop first) → Stage 4 (Control Room: structure, dashboard,
then modules in the order above). Screenshots and the live link after every step.
