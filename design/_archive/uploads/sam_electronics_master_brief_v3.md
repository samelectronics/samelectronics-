# SAM ELECTRONICS: WEBSITE STRUCTURE & DESIGN BRIEF v3

*From the owner. This replaces v2 for structure and adds the design fixes. Keep the design rules of v2 §3 (colours, type, motion) unless this file says otherwise. Read all of it before designing.*

---

## 0. HOW TO WORK

1. **The visual direction is chosen:** our current hero ("Live Circuit" with the iPad and phone on the yellow slab, circuits on living graphite). Everything else on the site must carry **the same spirit**: alive, techy, premium, clean, fun. No section may look plain or come from an older direction.
2. **The home page is a trailer for the whole business.** Every section shows a *piece* of a full page in its own layout and ends with a clear button to that page. **Never repeat the same content twice.**
3. **Every interactive thing does something real:** filters, counts, countdowns, prices, statuses are all computed from one shared data file (`se-data.js`). One template drives many pages (for example every phone model).
4. **Fixed lists, used everywhere the same way:** brands, part categories, grades, team roles, customer types, membership tiers, request types, order statuses (Section 9).
5. **First deliverable:** the complete home page (desktop + mobile) with all sections in Section 5 and all fixes in Section 2. Then we go page by page.
6. Treat this brief as the minimum. Add your own creativity, as long as it stays clean and premium.

---

## 1. WHO WE ARE (facts)

- **Sam Electronics L.L.C**, Al Murar, Deira, Dubai, UAE (Plus Code 78G4+3H2). Trading **since 2003, more than 20 years**.
- **Our history:**
  - **2003–2011:** Syria Tell, first shop in Deira (same area, opposite side of the road).
  - **2011–2020:** Syria Tell moves to a bigger, better shop: **our current location**.
  - **2015–2019:** a third Syria Tell branch, inside the market.
  - **2020–today:** rebranded as **Sam Electronics**. Same management, new name.
  - **Coming soon:** **Sam Electronics Madrid**, Plaza Mayor district, Spain.
- **What we sell:**
  - Wholesale and retail mobile phone spare parts: LCD & OLED screens, batteries, flex cables, back covers, frames & housings, cameras, small parts (buttons, speakers, charging ports, board components).
  - Plus repairs and worldwide delivery.
- **Brands:** Apple, Samsung, Xiaomi, Redmi, Realme, Oppo, Huawei, Google, Sony and more.
- **Grades:** Original · Service Pack · OLED · Incell · High Copy (for example GX). Customers choose by budget and job.
- **Customers:** repair shops, technicians, traders, exporters, bulk buyers and everyday retail customers. We welcome everyone like family.
- **Worldwide:** we work mainly with Africa, the Middle East, Europe and Asia.
  - Example countries: Russia, Iran, Türkiye, Iraq, Syria, Lebanon, Egypt, Yemen, Saudi Arabia, UAE, Oman, Azerbaijan, Libya, Eritrea, Ethiopia, Morocco, Algeria, Tunisia, Uganda, Nigeria, Sudan, Romania, UK, Spain and more.
- **Founder & Managing Director:** Tarek Alchoumari.
- **Contact:**
  - store +971 4 273 3031
  - WhatsApp +971 50 342 0015
  - samelectronics.uae@gmail.com
  - @samelectronics.uae (Instagram, TikTok, Facebook)
- **Hours (Dubai time):**
  - Sat–Thu 10:30–14:00 and 16:00–22:00
  - Fri 10:30–12:00 and 16:00–22:00
  - Sunday closed
- **Slogan:** Quality · Warranty · Price. Write like a business that has known this market for two decades: specific and confident, no empty marketing words.
- Owner-provided details (history, countries, services, hours) are our business information. All stock and prices are **sample data, labelled as sample**.

---

## 2. FIXES TO THE CURRENT DESIGN (do these first)

**Realism and quality**
1. **Product images must be ultra-realistic**, studio-style renders until our photos arrive (or one consistent premium 3D style).
   - No toy-like shapes: the yellow L-shaped "flex cable" and the cartoon battery must go.
   - Every part should look like the real part, with soft shadows and subtle motion.
2. **The iPad and phone in the hero must look more realistic:** real perspective, metal edges with highlights, glass reflections, and a soft **contact shadow** on the slab. Make the slab reflection very faint or remove it. Screen content must stay readable (no skewed text).
3. **iPad = live inventory browser** with a proper **image space on every product card**, ready for our real product photos.
4. **Phone = ad reel** that covers everything we offer:
   - LCD screens, batteries, back covers, frames, flex cables, cameras, small parts (buttons, board components)
   - then repair service, wholesale and worldwide delivery
   - with a glass shine every few seconds and no orphan words.

**Scroll animation**

5. **The teardown must move with the scroll, smoothly.** Animation progress is tied directly to scroll position, over a short distance (about 1.5 screens), so every bit of scrolling changes something. Never freeze, never make people scroll "for ages" with nothing happening. Use realistic layers, not flat drawings.
   - When the phone finishes opening, **the full list of what we offer unfolds right below it** in the same section (Section 5, item 3). No separate boxes repeating the same items.

**Consistency**

6. **One design style everywhere.**
   - Remove styles taken from the old exploration (for example the yellow highlighter behind headline text).
   - **No plain white sections:** light sections need texture, depth, motion and yellow energy too, matching the hero's spirit.
7. **Circuits:** yellow on graphite, **dark graphite at low opacity on yellow**. One consistent circuit system, never random colours.
8. **Nav:** keep the current effect but make it consistent and clean over every section. No muddy grey: dark glass over dark sections, light glass over light ones, same style throughout.
9. **Wordmark:** "SAM ELECTRONICS" is too fat and heavy. Use medium or semibold weight with refined spacing; the slogan stays small and light. It must feel premium.
10. **Buttons must be clearly visible:** strong contrast, one corner radius, clear hover states.

**Hero**

11. **Headline as a stacked list** again (Every part. / Every model. / Every grade.), not a paragraph.
12. **Fill the empty space under the text** with the essential buttons: **Find My Part · Wholesale prices · Book a repair · WhatsApp us**, plus small trust badges (Tested · Warranty · Since 2003).
13. **Status pill:** readable but calmer (not a thick yellow border).

**Other sections**

14. **Brand logos:** every brand in one colour, at the same visual height and weight, as logos (no logo inside a box while others are text). No cut-off text.
15. **Grade picker:** always default to an **in-stock** product. No truncated text, no big empty gaps.
16. **The Quality · Warranty · Price band** must become a creative, alive section, not three generic icon cards.
17. **Footer:** add social icons, both branches, full hours, Google review link, the language switch and the staff login, cleanly laid out.
18. **The assistant (Samsoom, Section 7) must appear on every page.**

---

## 3. NAVIGATION (every page)

**Top bar**
- Left: logo + wordmark.
- Centre: **Find My Part** (yellow, the most important button on the site) · Shop · Repair · Wholesale · Contact.
- Right:
  - live open/closed status
  - EN / عربي switch (one language per view, full right-to-left in Arabic)
  - **My Bench** (account)
  - **Cart**
  - a small **🔒 Staff** icon that opens the Control Room login page
  - ☰ menu
- Under the bar: the thin **current line** that fills as you scroll, with light flowing like current through a trace.

**Find My Part (the owner's priority)**
- Clicking it opens a panel **on top of the current page**:
  1. Brand logos
  2. The brand's models, with search
  3. The parts for that model (screens, batteries, back covers…)
  4. The grades (Original, Service Pack, OLED, Incell, High Copy), with price and stock
- The last step opens the **Shop page with those filters applied**. On mobile it is a bottom sheet.

**☰ System Map (full directory)**

12 entries, numbered, each with a one-line description and an arrow:

| # | Entry | Line |
|---|---|---|
| 01 | Shop parts | Every part, every grade |
| 02 | Brands & models | Every model's full parts file |
| 03 | Repair Lab | Fixed, tested, guaranteed |
| 04 | Wholesale & trade | Stock up. Cost down. |
| 05 | Worldwide network | From Deira to the world |
| 06 | Deals & arrivals | Price drops, new stock, incoming shipments |
| 07 | Our story | Since 2003: branches, team, careers |
| 08 | Sam Circuit | Our membership |
| 09 | Ask Samsoom | Your parts assistant |
| 10 | My Bench | Orders, saved parts, your tier |
| 11 | Request & contact | Orders, quotes, repairs, visits |
| 12 | Home | The full system, top to bottom |

The bottom of the drawer shows both branches with live status and today's hours.

**Signal Path** (breadcrumb) on inner pages, for example `Home / Shop / Apple / iPhone 15 Pro / Screens`. Styled as a small circuit trace, every step clickable.

**Persistent:** cart drawer, Samsoom bottom-right, the same footer everywhere.

---

## 4. MOTION ALPHABET (reuse across the whole site)

| Motion | Use |
|---|---|
| **Current flow** | Light travelling along circuit traces: hero, dividers, progress line, team, map |
| **Boot-up** | Sections and screens power on like a display waking |
| **Scan reveal** | Product images appear under a scan line |
| **Solder spark** | A tiny spark on Add to cart and main buttons |
| **Signal bars** | Stock levels, loading states |
| **Charge fill** | Progress, membership tiers, count-ups |
| **Micro-teardown** | On hover, a product's layers separate slightly |
| **Metal glare tilt** | Cards tilt toward the cursor with a moving reflection |
| **Data packets** | Dots travelling along map routes and circuits |
| **Terminal typing** | Live board entries type in |
| **Circuit wipe** | Page transitions |
| **Cursor glow** | A soft yellow light following the mouse on dark sections |

All smooth (60fps, transform/opacity), scroll-linked where relevant, and respecting reduced-motion settings.

---

## 5. HOME PAGE (the trailer, in this order)

1. **Hero:**
   - stacked headline, subline, search bar
   - essential buttons (Find My Part · Wholesale prices · Book a repair · WhatsApp us) and trust badges
   - the iPad (live inventory) and phone (ad reel) on the yellow slab.
2. **Brand stock rail:** moving brand logos with live stock counts and signal bars. Hover pauses it and opens a mini panel. "View all brands".
3. **Teardown → Everything we offer** (one continuous section):
   - the phone opens with the scroll, each layer lighting up with its label
   - then the full offer unfolds: every part category (realistic image, stock, "from" price) and every service (repair, wholesale, worldwide delivery), each linking to its page.
4. **Live Parts Board:** a live terminal-style board of what's happening. Entries type in and rotate, all from data:
   - "Just landed · iPhone 15 Pro OLED"
   - "Low stock · Galaxy A54 battery"
   - "Price drop · Redmi Note 13 LCD −12%"
   - "Shipped · Lagos, Nigeria"
5. **Bench Test** (our quality story):
   - as you scroll, a part runs a diagnostic: Display ✓ Touch ✓ True Tone ✓ Battery health ✓
   - then a **"TESTED · WARRANTY" card** assembles and prints with part, grade, warranty and "Packed in Deira".
   - Shows that every part is tested before it leaves.
6. **Model file teaser:**
   - pick a model and see all its parts and grades with prices (always in-stock defaults)
   - "Same part. The grade that fits the job."
   - Link to Brands & models.
7. **Deals and arrivals:**
   - product cards with price-drop badges and stock signals
   - plus an **incoming shipment countdown** ("Next shipment lands in 3d 04h", set by admin) and pre-orders for new models.
8. **Repair Lab:** before/after slider, a mini repair estimator (brand → model → problem → grade gives a price range), "Book a repair".
9. **Wholesale:** ***"Stock up. Cost down."***
   - trade prices for approved accounts, bulk order requests, "Apply for a trade account"
   - plus **Partner with us** for distributors and resellers abroad.
10. **Worldwide network:**
    - a **realistic world map** with Dubai at the centre, glowing pins and animated shipping routes
    - region filters (Middle East · Africa · Europe · Asia) and an animated board of the countries we serve
    - delivery info (tracked, securely packed).
11. **Our story & branches:**
    - the timeline (2003 Syria Tell → 2011 new shop → 2015–2019 market branch → 2020 Sam Electronics → Madrid coming soon), styled like system versions
    - ending in **branch cards**: Dubai (live status, hours, map, directions) and Madrid (coming soon, image space).
12. **The team:**
    - shown as a circuit, each role a component connected to the next
    - photo space, name, role, years with us, star rating
    - "Meet the full team" and "Join the team".
13. **Open to everyone:** four customer lanes, each with its own path and button:
    - Retail customer
    - Repair shop
    - Trader & exporter
    - Bulk buyer

    We serve everyone like family.
14. **Sam Circuit preview:** the membership with tiers shown as a battery charging up. Perks "coming soon".
15. **Meet Samsoom:** an animated chat preview with example questions, "Ask Samsoom".
16. **Social wall:** our latest Instagram/TikTok posts, @samelectronics.uae, follow buttons.
17. **Reviews:** customer reviews (honest empty state if none) plus the "Review us on Google" card.
18. **Request console + Visit us:** the quick request console (Section 6.11) and the Dubai branch with map, live hours and WhatsApp.
19. **Final call to action**, then the footer.

---

## 6. INNER PAGES (each one deep)

1. **Shop parts:**
   - finder, search with suggestions, filters (brand, model, category, grade, price, in stock, on deal) with live counts, product cards
   - **Kit Builder:** screen + adhesive + tools with a computed bundle price.
   - **Product page:** gallery, specs, compatible models, **grade comparison side by side**, related parts, warranty, Add to cart / Save / Ask on WhatsApp.
2. **Brands & models:**
   - all brands → series → models
   - **one Model File template for every model:** model image, all its parts by category and grade, prices, stock, repair estimate, related models.
3. **Repair Lab:** services, the full estimator, process steps, warranty, before/after gallery, booking.
4. **Wholesale & trade:**
   - trade account application, bulk order request (paste or upload a list), trade tiers
   - why trade with us, Partner with us (distributors abroad).
5. **Worldwide network:** full interactive map, regions as chapters with their countries, shipping info, shipping quote request.
6. **Deals & arrivals:** all deals, new arrivals, incoming shipments with countdowns, pre-orders, vouchers.
7. **Our story:**
   - the full timeline, all branches with photos and info
   - founder (and leadership 🔶), values, "open to everyone"
   - **team:** featured members plus the full roster filtered by role, ratings and reviews per person
   - **careers:** a full job application with role, availability and CV upload.
8. **Sam Circuit:** membership explained, tiers, how to join, perks "coming soon".
9. **Ask Samsoom:** full-page chat, what Samsoom can do (six jobs, each linking to a page), and "Prefer a human?" with WhatsApp and phone.
10. **My Bench** (account):
    - profile photo, name, customer type, member ID (`SE-2026-0001`)
    - a 4-box live stat strip (orders, saved parts, open requests, membership tier)
    - saved parts with price-drop alerts, orders and requests with status tracking, recently viewed, preferred brands, trade status, messages.
11. **Request & contact:**
    - **Request Console:** pick the type and the form changes to match (Order parts · Bulk quote · Book a repair · Trade account · Shipping quote · General). It ends with a printed **work-order ticket** you can send by WhatsApp or email.
    - Both branches, hours, map, contact details.
12. **Help & legal:** FAQ, warranty policy, shipping, returns, privacy, terms.

---

## 7. SAMSOOM (سمسوم): OUR ASSISTANT MASCOT

- **Look:** a small, cute robot whose body is a phone, echoing the two phones in our logo.
  - The screen is the face: simple pixel eyes and mouth.
  - Short flex-cable arms, a tiny screwdriver in one hand, a little antenna that sparks yellow.
  - Yellow and graphite.
- **Emotes:**
  - **Idle:** blinks, looks around, follows the cursor with its eyes.
  - **Thinking:** loading-dot eyes, taps the screwdriver.
  - **Answering:** smiles, thumbs up.
  - **Found a part:** holds up a magnifier.
  - **Doesn't understand:** "low battery" face.
  - **Greeting:** waves.
- **Launcher:** small and round (about 56px) bottom-right, with a blinking dot when it has a tip.
- **Chat panel:**
  - header with Samsoom and "Online"
  - quick suggestions that disappear once the user types: *Find my part · Which grade? · Are you open? · Do you ship to my country? · Trade prices*
  - typing indicator, answers from our real data, links to the right page, opens WhatsApp.

---

## 8. CONTROL ROOM (staff and admin)

- Opened from the 🔒 Staff icon and the footer.
- **Login page:** a dedicated, branded page (dark, the logo powering on, "Authorised staff only").
- **Inside:** an operations command centre in our style, with roles (Owner, Manager, Sales, Technician, Stock) enforced on the server.
  - **Dashboard:** visitors, top searches, new requests, low-stock alerts.
  - **Products:** single and bulk import, images, grades.
  - **Pricing:** retail and wholesale; wholesale can never exceed retail.
  - **Operations:** stock movements, deals and vouchers, incoming shipments, request pipeline.
  - **People and reviews:** customers and trade approvals, team profiles, review moderation.
  - **Site content:** hours and branches, announcements.
  - **Reports and log:** reports and exports, activity log.

---

## 9. FIXED LISTS

| List | Values |
|---|---|
| Grades | Original · Service Pack · OLED · Incell · High Copy |
| Categories | Screens · Batteries · Flex cables · Back covers · Frames & housings · Cameras · Small parts · Tools |
| Customer types | Retail customer · Repair shop · Trader & exporter · Bulk buyer |
| Team roles (entry to senior) | Dispatch Technician · Parts Specialist · Accounts & Front Desk · Repair Engineer · Sales Lead · Founder & Managing Director |
| Membership (Sam Circuit) | Connected · Charged · Supercharged · Fully Charged (perks coming soon) |
| Request types | Order parts · Bulk quote · Book a repair · Trade account · Shipping quote · General |
| Order status | New · Quoted · Confirmed · Ready · Collected / Shipped · Closed |
| Regions | Middle East · Africa · Europe · Asia |

---

**Start with the complete home page (Section 5) and every fix in Section 2. Show it to me before moving on.**
