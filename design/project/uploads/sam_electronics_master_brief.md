# SAM ELECTRONICS: MASTER WEBSITE DESIGN & BUILD BRIEF

*The single source of truth for designing and building the Sam Electronics website. Give this whole file to Claude Design first (with the brand images), then hand the approved design and this same file to Claude Code.*

---

## 0. READ THIS FIRST, CLAUDE

1. **This brief is the minimum, not the ceiling.** Every idea here is a starting point. Push further: more beauty, more motion, more surprise, more polish, in every section. If you see a way to make something more alive, more satisfying or more memorable, do it. Never settle for "safe corporate neat". We want **controlled wow**.
2. **We already built one site at this level: Patty Passport** (a Mediterranean burger restaurant themed as an airport terminal). Section 3 explains exactly what made it great. **Copy the discipline, never the theme.** Sam Electronics is a completely different world: mobile technology, repair, parts, signals, circuits, trade.
3. **Brand colours come from the official logo** (the grey background artwork with the open phone, circuit traces and spare parts, logo in a white circle in the centre). Yellow and grey are the brand. White supports. See Section 4.
4. **Real data later, real-looking now.** The first build can use realistic sample data, but every list (brands, models, parts, tiers, staff, reviews) must come from one shared data source shaped exactly like the future database (Section 12), never hard-coded per page.
5. **Honesty rules (from Patty Passport):** no fake reviews, no stock photos pretending to be real staff, no invented prices presented as real. Sample data is clearly marked as sample. Missing photos use one consistent, designed "photo coming soon" placeholder.
6. Items marked 🔶 are suggestions or unconfirmed facts. Build them, but keep them easy to change.
7. **Work in steps** (Section 13). Design system first, then Home, then one page at a time.

---

## 1. THE BUSINESS

**Sam Electronics L.L.C** (Arabic: **سام للإلكترونيات**) is an established, trusted supplier of mobile phone spare parts, based in **Deira, Dubai**, trading **since 2003**.

- **What it does:** wholesale and retail of mobile phone spare parts, plus repair.
  - Main lines: **LCD and OLED screens, batteries, cables / charging flex, back covers, frames**, and much more.
  - Repair: screen replacement, battery repair and replacement, circuit board fault repair.
- **Brands covered:** Apple (iPhone), Samsung, Xiaomi, Redmi, Realme, Oppo, Huawei, Google, Sony. 🔶 Likely also Honor, Vivo, OnePlus, Infinix, Tecno, Nokia, Motorola: confirm with the client.
- **Quality options:** genuine/original and tested parts, plus multiple grade options for many models (for example original, service pack, OLED, incell, high quality copy). Customers choose by budget and need.
- **Who buys:** repair shops and technicians, traders and distributors, wholesale bulk buyers, and everyday retail customers.
- **Reach:** ships internationally with fast, tracked, secure delivery to customers across **the Middle East, Africa (North, East, West, Central and Southern), Europe and Asia**.
- **Owner and manager:** **Tarek Alchoumari**, running the business since 2003. Long-serving, highly experienced staff who grew with the company.
- **History detail (use it):** the business was previously known as **Syria Tell**. The business card says it best: ***"Same management, new name. Your trusted electronics partner since 2003."*** That is a real story to tell.
- **Size:** 6 to 20 people.

### 1.1 The official description (owner's own words, keep the meaning)
> Welcome to Sam Electronics LLC, a leading, established and trusted supplier of spare parts for all types of mobile phones since 2003. As a major supplier and wholesaler of mobile phone spare parts, we offer high quality LCD screens, batteries and spare parts at competitive prices, using genuine, tested components and providing full support for large and bulk orders. Our technicians expertly replace LCD screens, repair batteries and fix circuit board faults for leading brands such as Apple, Samsung, Xiaomi, Redmi, Realme, Oppo and Huawei. We ship internationally, serving customers in Africa, the Middle East, Europe and Asia with fast, tracked and reliable delivery. Sam Electronics: offering best Quality, Warranty, Price.

### 1.2 Contact facts
| Item | Value |
|---|---|
| Address | Al Murar, Deira, Dubai, U.A.E. (Plus Code **78G4+3H2**) |
| Store phone | **+971 4 273 3031** (on business card and posters) 🔶 the owner also gave **+971 4 266 0958**: confirm which is current |
| Mobile / WhatsApp | **+971 50 342 0015** |
| Email | samelectronics.uae@gmail.com |
| Social | **@samelectronics.uae** on Instagram, TikTok and Facebook |
| Google reviews | "Review us on Google" QR / NFC cards exist: link to the Google review page |

### 1.3 Opening hours (Dubai time, GST, UTC+4)
| Day | Hours |
|---|---|
| Saturday | 10:30–14:00, 16:00–22:00 |
| **Sunday** | **Closed** |
| Monday to Thursday | 10:30–14:00, 16:00–22:00 |
| Friday | 10:30–12:00, 16:00–22:00 |

These must drive **real live logic** (Section 8.9): open now / closed / opens in X, computed in Dubai time.

### 1.4 What the client told us he needs (from his research surveys)
He wants, in his words: **"انشاء متجر احترافي و موقع مميز و برنامج ادارة متكامل و ذكي"**, which means *"a professional store, a distinctive website, and an integrated, smart management program."*

His survey answers say the site must solve these problems:
- **No single place where customers can find everything** (products, prices, information).
- **Unprofessional image:** no website, no online marketing.
- **Hard to find information quickly**, hard to produce reports, hard to track order status and history.
- **Pricing mistakes**, especially wholesale vs retail.
- **Too many disconnected tools:** WhatsApp, email and spreadsheets, plus Daftra accounting.
- He finds it hard to **keep continuous contact with customers**.

He rated these: **branding = critical**, **automation = critical**, **roles and permissions = very important**. It must work on **phones and computers**. Look and feel: **clean, professional, modern and striking, and friendly**. His design reference: **gsmpartscenter.com** (structure reference only, never copy it).

---

## 2. THE CONCEPT

**Sam Electronics is not a parts shop with a website. It is a live mobile-parts command centre: the place where broken phones come back to life.**

The site should feel like you are **inside a phone**: circuits light up, components dock into place, signals travel, the screen powers on. The logo already shows this world (an open phone, circuit traces radiating from the centre, spare parts and tools around it). The website makes that logo come alive.

**The one-sentence idea:** *"You are not buying a part. You are bringing a phone back to life."*

### 2.1 Brand voice
Confident, technical, clear, a little playful. Sharp short lines, smart rhymes, tech wordplay. Never empty buzzwords, never cheesy. A business that has known this market for over two decades, now stepping into its digital future.

### 2.2 Slogans and lines (🔶 starters: write even better ones)
- **Main slogan (under the logo, everywhere):** ***Quality · Warranty · Price***
- From the posters: *"Your mobile, our priority."* / *"Trusted in perfection since 2003."* / *"Offering best quality LCD."*
- Hero idea: ***"You're not buying a part. You're bringing a phone back to life."***
- *"Every model. Every part. Every grade."*
- *"Quality you can test. Warranty you can trust. Prices that pass inspection."*
- *"Since 2003, we've kept the world's phones switched on."*
- *"From Deira to the world: packed, tracked, delivered."*
- *"Cracked screen? Clear solution."* / *"Low battery? We stock the cure."*
- *"Same management, new name. Same trust since 2003."*
- 404 page: *"Signal lost. This page switched to airplane mode."*
- Loading: *"Booting up…"*

### 2.3 Site vocabulary (themed, but always show the plain word too)
| Plain term | Sam Electronics term |
|---|---|
| Menu / site directory | **System Map** |
| Breadcrumb | **Signal Path** |
| Quick links bar | **Quick Ports** |
| Cart | **Parts Tray** |
| Order / quote request | **Work Order** |
| Customer account | **My Bench** |
| Staff login / admin | **Control Room** |
| Stock level | **Signal** (full / weak / no signal) |
| Product grade | **Grade** |
| Promotions | **Power Deals** |
| AI assistant | **Sammy** |
| Team | **The Lab Crew** |

---

## 3. WHAT WE LEARNED FROM PATTY PASSPORT (apply these principles)

Patty Passport felt alive and premium because of **system discipline**, not random effects:

1. **A closed palette, remixed per section.** Five colours, never more, but their **role and ratio change constantly**: one section yellow-dominant, the next dark with yellow accents, the next white with grey lines. Cards in a grid cycle through palette colours by index so neighbours always differ. **Every colour anywhere must trace back to the core palette.** When an off-palette green and purple crept into Patty Passport, that was treated as a defect and removed.
2. **A small alphabet of motion primitives**, each named by what it does, not where it is used: drift, pulse, ticker, dash, scroll-reveal, parallax, word-stagger. The same primitive appears on unrelated content, so the site keeps feeling new without becoming chaotic.
3. **The homepage is a remix trailer.** It shows a fragment of every other page, recomposed, never a copy. Exploring further feels like discovering more of something already glimpsed.
4. **Closed vocabularies** for anything repeatable: exactly 5 crew roles with 2-letter codes, exactly 3 passport types, exactly 5 routes. Filters, badges and search stay consistent everywhere.
5. **Real logic behind the cool stuff:** live countdowns, a working stamp tracker, computed combo prices, date-aware booking. Motion lands better when attached to real state.
6. **Honest placeholders:** missing photos and empty reviews look deliberately "not yet filled", never faked.
7. **One unchanging ending:** every page closes on the same dark, information-dense footer. That frame makes the variety above it feel intentional.
8. **Compact directory, deep pages:** the side menu had only about 12 entries, but each page was a whole world (Our Story held the story, values, team structure, staff, reviews, the full roster and a job application).
9. **Always know where you are:** a breadcrumb under the nav (for example *All destinations / Levant route / Lebanon*) to step back in one click.

### 3.1 Patty Passport mechanics to reinterpret (not copy)
| Patty Passport | Sam Electronics version |
|---|---|
| 4-row fixed nav: logo row, rotating Quick Gates, Now Playing strip, progress bar | Same structure: logo row, rotating **Quick Ports**, **Live Stock strip**, **charging bar** (Section 7) |
| Scroll progress bar, red→yellow gradient, plane riding the edge | **Battery charging bar**: fills graphite → yellow, a glowing **spark/lightning bolt** rides the edge, and at 100% it flashes **"Fully charged"** |
| Boarding tickets drifting in the hero, two columns scrolling opposite ways | **Exploded phone parts** drifting (screens, batteries, flex cables, frames, chips) as **part tags**: two columns scrolling in opposite directions, each clickable into its category |
| Ticket assembles and gets stamped as you scroll | A **work order / warranty card assembles** as you scroll and gets a **"TESTED ✓" stamp** (the posters already use a red stamp: *"Quality, Warranty and unbeatable prices"*) |
| Mediterranean route map with region filters | **Global supply map** from Dubai with animated shipping routes and region filters |
| My Passport with stamps and rewards | **My Bench** with saved parts, work orders, loyalty level and trade status |
| Patty Tooty mascot chatbot | **Sammy**, a cute animated phone-bot assistant |
| Bag icon bottom-left, slides open on add | **Parts Tray** bottom-left, slides open on add |
| Crew roles with 2-letter codes, staff reviews | **Lab Crew** roles with 2-letter codes, staff reviews |

---

## 4. COLOUR SYSTEM

Extracted from the official logo and confirmed against the posters and business cards.

| Name | Hex | Role |
|---|---|---|
| **Signal Yellow** | `#F7C032` | The brand colour: CTAs, highlights, active states, circuit glow, progress fill |
| **Spark** | `#FFE07A` | Glow tint only: light trails, hover halos, the leading edge of the charging bar. Never a background block |
| **Graphite** | `#3D3E3F` | Logo background grey: big dark sections, the nav, the footer |
| **Slate** | `#727679` | Poster/card grey: secondary surfaces, borders, muted text on light backgrounds |
| **Circuit Black** | `#151617` | Deepest surfaces: phone screens, the Control Room, high-contrast panels |
| **White** | `#FFFFFF` | Logo circle white: clean content areas, cards, text on dark |
| **Fog** | `#EEEEEC` | Business card background: soft light sections, table rows |

**Rules:**
- **Remix, don't repeat.** Change which colour is background, accent, border or text from section to section. Example rhythm: hero on Graphite with yellow circuits → white catalogue with slate hairlines → full yellow wholesale band with graphite type → black Lab section with glowing yellow traces → fog story section.
- **Cycle by index** in card grids so neighbours always differ.
- **Gradients allowed only between palette colours** (Graphite → Circuit Black, Signal Yellow → Spark). The charging bar runs Slate → Signal Yellow → Spark.
- **Functional states use palette plus shape and icon, not new colours.** The single exception: **Alert `#E5484D`**, only for errors, "out of stock" and failed actions, never decoration. 🔶
- **Brand assets keep their own colours** only inside their own badge: the Google review card (Google colours) and social icons.
- **Governance:** any colour not in this table is a bug.

---

## 5. VISUAL LANGUAGE

**Typography** 🔶 (Claude may choose better, keep it to 3 families):
- **Display:** a bold condensed sans, matching the posters' tall "SAM ELECTRONICS" lettering (for example Oswald, Bebas Neue or Archivo Condensed). Big, tight, confident.
- **Body:** a clean sans (Inter or Roboto, matching the business card).
- **Mono:** for part codes, model numbers, prices and status labels (JetBrains Mono or IBM Plex Mono). This is what makes it feel like a technical system.
- **Arabic:** IBM Plex Sans Arabic or Cairo. The brand is bilingual (the logo carries **سام للإلكترونيات**), so Arabic headings appear as design accents now, with full Arabic/RTL as a later phase.

**Recurring motifs** (from the brand's own artwork, used consistently everywhere):
- **Circuit traces with node circles:** lines radiating from the logo. The signature motif.
- **Diagonal slashes and angled cuts:** the yellow and grey slashes on every poster. Use cut-corner (chamfered) cards and diagonal section dividers.
- **Dot-matrix grids:** the dot patterns from the posters.
- **Chevrons `>>>`:** from the banner, for direction and CTAs.
- **Concentric rings:** from the LCD poster, for radar/scan effects and around the logo.
- **The ribbon banner:** from the logo, for section labels.
- **The "TESTED" stamp:** a rotated circular stamp, used on quality and warranty moments.
- **Exploded-view components:** real phone parts photographed or rendered floating apart.

**Structure:** crisp hairline borders, cut corners, glass/metal surfaces on dark sections, subtle grain or scan lines on black panels. Cards should feel like **components on a workbench**, not flat rectangles.

**Icons:** one custom icon set for every recurring concept (each part category, each grade, each crew role, signal bars, battery, warranty shield). Never emoji, never text initials.

---

## 6. MOTION ALPHABET (name by what it does, reuse anywhere)

| Primitive | Mechanic | Example uses |
|---|---|---|
| **seTrace** | Circuit line draws itself on (stroke-dashoffset), node lights at the end | Hero logo traces, section dividers, connecting cards, the map routes |
| **seCharge** | Fill grows with a glowing spark at the tip | Scroll progress bar, warranty meters, loyalty progress, stock bars |
| **sePing** | Expanding ring that fades (LED ping) | "Open now" dot, live stock dot, new-arrival badge, Sammy notification |
| **seBlink** | Steady LED blink | Status lights, Live strip dot, Control Room indicators |
| **seScan** | Horizontal scan line sweeps an element | Product image reveal, the "diagnosis" moment, loading states |
| **seDock** | Components fly in and lock into place with a tiny overshoot | Exploded phone assembling, card grids arriving, tray items |
| **seFloat** | Slow float plus micro-rotation, staggered per element | Hero parts, story props, wholesale boxes |
| **seTick** | Seamless marquee (list concatenated with itself) | Live Stock strip, brand logo ticker, review ticker, regions ticker |
| **sePowerOn** | Screen flicker into full brightness | Section headlines on dark backgrounds, page loads, phone mockups |
| **seCount** | Numbers count up when visible | "Since 2003", years, brands, models, countries shipped to |
| **seReveal** | Fade plus slide on entering view, staggered, replays on scroll back | Every heading and card grid |
| **seWord** | Headline split into words, each arriving in turn | All major headings |
| **seGlow** | Hover lights the element's traces and border | Buttons, cards, map nodes |

All motion respects **prefers-reduced-motion** with one global switch. Motion must stay smooth on phones (transform and opacity only).

---

## 7. THE NAVIGATION (fixed, persistent on every page)

**Row 1: logo and controls**
- Left: the round logo, **SAM ELECTRONICS** and **سام للإلكترونيات**, and underneath, small spaced caps: **QUALITY · WARRANTY · PRICE**. A tiny circuit trace glows from the logo on load.
- Right: **live status pill** (yellow pulsing dot plus "OPEN NOW · closes 14:00", or slate "CLOSED · opens 16:00"), **My Bench** button (swaps to the user's first name plus "'s Bench" when signed in), **Control Room** (small, staff only), and **System Map** (menu).

**Row 2: Quick Ports.** Four port buttons at a time, each with a small LED dot, auto-rotating every few seconds. Rotation starts on the group containing the current page, which is highlighted. A counter on the right reads **"PORT 1 / 3"**.

**Row 3: Live Stock strip.** A dark strip with a blinking dot and a **seTick** marquee of real catalogue events: *"BACK IN STOCK · iPhone 16 Pro OLED"*, *"POWER DEAL · Galaxy A54 battery −15%"*, *"NEW ARRIVAL · Redmi Note 13 back cover"*. Pulled from data, never hard-coded.

**Row 4: the charging bar.** A thin track; the fill grows with scroll position, gradient Slate → Signal Yellow → Spark, and a small **lightning-bolt spark** rides the leading edge. A tiny battery percentage readout can sit at the right ("67%"). At 100% the bar flashes once and shows **"FULLY CHARGED"**. Smooth via requestAnimationFrame.

**Under the nav: the Signal Path** (breadcrumb), on every page except Home:
`Home / Parts / Apple / iPhone 16 Pro / Screens / OLED`
Each step clickable, the current step in yellow, mono font, with a tiny trace line connecting the steps. On the right, a context code (for example `SE-IP16P-LCD`).

**The System Map** (side drawer, opened from the menu button): a dark panel titled **SYSTEM MAP**, numbered like Patty's directory, **9 entries maximum**, each with a one-line description and an arrow:

| # | Entry | Line |
|---|---|---|
| 01 | Home | The full system, top to bottom |
| 02 | Parts Catalogue | Every brand, model, part and grade |
| 03 | Repair Lab | Screens, batteries, boards: fixed right |
| 04 | Wholesale & Shipping | Bulk orders, trade accounts, worldwide delivery |
| 05 | Our Story & Crew | Since 2003, the people behind the parts |
| 06 | Reviews | What customers say, and leave yours |
| 07 | Ask Sammy | Your parts assistant |
| 08 | My Bench | Saved parts, work orders, your deals |
| 09 | Visit & Contact | Deira, hours, WhatsApp, map |

The bottom of the drawer shows the address, today's hours with live status, and social icons. Staff login sits as a small separate link: **"Crew? Enter the Control Room →"**.

**Persistent widgets on every page:** **Parts Tray** (bottom-left) and **Sammy** (bottom-right). Optional **Tour** button: a guided walkthrough with spotlight tooltips explaining each nav element.

---

## 8. PAGES

Each page is a deep world: many sections, tabs, filters and reveals, all reached from the 9 entries above.

### 8.1 HOME: "Boot Sequence" (the remix trailer)
1. **Boot screen** (first visit, short, skippable): the logo powers on with **sePowerOn**, circuit traces draw outward like the logo artwork, "Booting up…", then the page arrives.
2. **Hero:** split layout. Left: huge display headline (*"YOU'RE NOT BUYING A PART. YOU'RE BRINGING A PHONE BACK TO LIFE."*), with "BACK TO LIFE" in Signal Yellow, plus two CTAs: **Find Your Part** and **Send a Work Order**. Right: two columns of floating **part tags** (Screen · OLED, Battery, Charging flex, Back cover, Frame, Camera…), each tag a cut-corner card with a part code and signal bars, one column scrolling up, the other down, each clickable into its category.
3. **Counter strip** with **seCount**: *Since 2003 · 20+ years · 9+ brands · thousands of parts · 4 continents* 🔶 confirm numbers.
4. **The exploded phone:** as you scroll, a phone separates into its layers (glass, display, frame, battery, board, back cover). Each layer labels itself and links to its category. Scrolling further, it **docks back together** and the screen powers on with the logo.
5. **Quick Finder teaser:** the Brand → Model → Part selector (compact version of 8.2), with a search box ("Type your model: A54, iPhone 13, Note 12…").
6. **Brand wall:** brand marks in a **seTick** ticker; hovering lights a trace to the brand's model count.
7. **Power Deals preview:** 3 to 4 deal cards with price-drop badges and live "only 3 left" signals.
8. **Repair Lab teaser:** before/after split slider (cracked screen → new screen).
9. **Global map teaser:** Dubai node with animated routes pulsing out to the four regions; CTA to Wholesale & Shipping.
10. **The quality promise:** Quality / Warranty / Price as three big panels, each a different palette mix, with the **TESTED stamp** landing as you scroll.
11. **Story teaser:** "Same management, new name": Syria Tell → Sam Electronics transition card, 2003 → today.
12. **Crew teaser:** 3 to 4 crew cards, different layout from the full page.
13. **Reviews teaser:** a review ticker plus the Google review card.
14. **Sammy teaser:** Sammy waves, with 3 example questions.
15. **Visit block:** live open/closed status, today's hours, mini map, WhatsApp button.
16. **Closing CTA**, then the footer.

### 8.2 PARTS CATALOGUE: "Find your exact part"
The heart of the site. Simple for the customer, powerful underneath.

**The finder tree** (each step animates like going one layer deeper into the device):
**Brand → Series → Model → Part category → Grade → Product**
Example: *Apple → iPhone 16 series → iPhone 16 Pro → Screens → OLED (service pack)*.
- Big visual brand tiles → model grid with phone silhouettes and search → part category icons with item counts → grade cards → results.
- **Search anywhere:** by model ("A54"), model number ("SM-A546") or part ("iPhone 13 battery"). Typo-tolerant.
- **"Which model do I have?"** helper: how to find your model in Settings, per brand.
- **Filters:** brand, model, category, grade, price range, in stock only, on deal. All combine (AND logic), with live result counts.

**Grades** (closed vocabulary, 🔶 confirm exact names with the client):
| Code | Grade | Meaning |
|---|---|---|
| OR | Original | Genuine manufacturer part |
| SP | Service Pack | Genuine, official service packaging |
| OL | OLED | High-quality OLED alternative |
| IN | Incell | Budget LCD alternative |
| HQ | High Copy | High-quality aftermarket (for example GX) |

**Part categories** (closed vocabulary, 🔶 confirm): Screens · Batteries · Charging & cables · Back covers · Frames & housings · Cameras · Speakers & audio · Buttons & flex · Small parts · Tools.

**Product card:** image (with a **seScan** reveal), title, compatible models, grade badge, key specs (display type, with/without frame, colour, warranty), **signal bars** for stock, retail price, deal state, and actions: **Add to Parts Tray**, **Save (star)**, **Ask about it**.
- **Stock as phone signal:** 4 bars = in stock, 1 to 2 bars + "Only 3 left" = low, crossed-out signal = out of stock (with "Notify me").
- **Price drop:** old price struck through, new price in yellow, a lightning badge "−15%", optional countdown if the deal ends.
- **Badges:** New arrival · Best seller · Trade favourite · Power Deal.

**Product page:** gallery, all specs, **compare grades side by side** (Original vs Service Pack vs OLED vs Incell for this exact model: price, quality, brightness, warranty), compatible models list, related parts (*"Replacing the screen? Most shops also take: adhesive, frame"*), and the **"TESTED" stamp + warranty card** assembling as you scroll.

**Wholesale prices:** retail prices are public. **Wholesale prices appear only for approved trade accounts** (this directly solves his wholesale/retail pricing mistakes). Signed-out visitors see a lock: *"Trade price available. Apply for a trade account."* 🔶 confirm with the client whether retail prices are public.

### 8.3 REPAIR LAB: "Fixed right, the first time"
- Services: screen replacement, battery repair/replacement, board-level fault repair, charging port, cameras 🔶 confirm the list.
- **Repair estimator** (the survey asked for a calculator): pick brand → model → problem → grade → shows an estimated price range and time. Real logic from the data.
- Before/after sliders, the process as an animated timeline (Diagnose → Quote → Repair → Test → Warranty), each step with **seTrace** connecting them.
- Warranty explained clearly 🔶 durations to confirm.
- CTA: **Book a repair / send a work order** (WhatsApp or form).

### 8.4 WHOLESALE & SHIPPING: "From Deira to the world"
- **Global supply map:** a dark world map, Dubai glowing at the centre, animated routes (**seTrace**) to every region. Region filter chips: *All · Middle East · North Africa · East Africa · West Africa · Central & Southern Africa · Europe · Asia*. Selecting a region dims the others and lights its routes and nodes (like Patty's route map). 🔶 Show example countries per region once confirmed.
- **Trade account application** (staged form, the reward is wholesale pricing).
- **Bulk order request:** paste or upload a parts list (model + part + grade + quantity), or build one from the Parts Tray.
- Shipping promise: tracked, securely packed, fast. 🔶 Exact couriers, times and policies to confirm. Online delivery checkout is **not live yet**: requests go to the team.
- Why trade with us: 20+ years, genuine tested parts, full support for large orders, grade options.

### 8.5 OUR STORY & CREW: "Since 2003"
- **Timeline as firmware versions:** *v1.0 · 2003 · Founded in Deira* → milestones 🔶 → *v2.0 · New name: Syria Tell becomes Sam Electronics* → *v3.0 · 2026 · The digital system goes live*. Honest: nothing marked done that isn't.
- **Founder section:** Tarek Alchoumari, owner and manager since 2003. Larger card, distinct from the crew grid. Honest photo placeholder until a real photo is provided.
- **Values** (5 cards, each a different palette mix) 🔶: *Tested, not trusted blindly · Every grade, honestly labelled · Bulk or single, same respect · Warranty means something · Fast answers*.
- **The Lab Crew** (closed role vocabulary, 🔶 confirm roles and names):
  | Code | Role | Description |
  |---|---|---|
  | FO | Founder & Owner | Leads the business since 2003 |
  | SD | Sales Desk | Retail customers, quotes and the counter |
  | TA | Trade Accounts | Wholesale buyers, bulk orders, shipping |
  | RT | Repair Technician | Screens, batteries, boards |
  | SL | Stock & Logistics | Receiving, stock levels, packing and dispatch |
  Each crew card: photo or placeholder, name, role badge (code + title), years with the company (long service is a selling point), short bio, star rating, **Leave a review**.
- Filter the crew by role. Featured crew on the story section, full crew below.
- **Join the crew:** a job application form, themed like a work order. 🔶

### 8.6 REVIEWS: "Signal strength: excellent"
- The **Google review card** (QR plus "Review us on Google" button linking to the real Google listing). Inside its badge, Google keeps its own colours.
- Customer reviews of the business and of individual crew members, 5-star widget, honest empty state (*"No reviews yet. Be the first."*).
- 🔶 Later: show the real Google rating via the Google Places API.

### 8.7 ASK SAMMY: the AI assistant
- **Sammy** is a cute little **phone-bot**: a phone body whose screen is a face (blinking eyes, smiles, a small wave, little antenna with a ping when there's a new message). Yellow and graphite. Never a generic chat bubble.
- **Closed:** a pill bottom-right, "Ask Sammy", with Sammy's face blinking and a small notification dot (**sePing**).
- **Open:** a chat panel with header (Sammy + "Online" with blinking dot), message bubbles, a typing indicator, and quick chips: *"Find a part"*, *"Which grade should I pick?"*, *"Are you open now?"*, *"Do you ship to my country?"*, *"Trade prices?"*. Chips disappear once the user types.
- **Knows the real data:** finds models and parts, explains grades, reads live opening hours, links to the right page, opens WhatsApp. Stays warm and on-brand for off-topic messages. Full-page version on the Ask Sammy page (the floating bubble hides there).

### 8.8 MY BENCH: customer accounts
- **Signed out:** split hero, *"YOUR BENCH IS READY."*, with Create account / Log in. The modal is styled like a workshop terminal ("BENCH ACCESS").
- **Account type at sign-up:** Retail customer · Repair shop · Trader / wholesale.
- **Signed in:** avatar upload (local preview first), name, account type and member ID (`SE-2026-0001`), and a **4-box stat strip** in different palette mixes: saved parts, open work orders, total orders, loyalty level.
- **Sections:** saved/starred parts (with price-drop alerts on saved items), work orders and their status, recently viewed, preferred brands/models, **Power Deals for you**, trade account status ("Under review" → "Approved: trade prices unlocked"), questions sent to the team, and a loyalty ladder 🔶 (levels and perks to confirm).

### 8.9 VISIT & CONTACT
- **Live status card:** computes Dubai time. "OPEN NOW · closes in 1h 12m" or "CLOSED · opens Monday 10:30" with a countdown. Handles the split shifts, short Friday and closed Sunday. 🔶 Ramadan/holiday hours editable from the Control Room.
- Full weekly hours with today highlighted.
- Google Map embed, Plus Code, "Get directions".
- WhatsApp (prefilled message), call, email, social links.
- Contact form (becomes a work order in the Control Room).

### 8.10 PARTS TRAY (persistent widget)
- Bottom-left icon with a count badge. Adding an item makes the icon pulse and the tray slides open.
- Items grouped by brand/model. Adding the same item twice increases the quantity.
- Subtotal, **VAT (UAE 5%)** 🔶 confirm whether prices include VAT, and total.
- Clear notice: *"Online delivery isn't live yet. Send this tray as a work order and our team will confirm stock, price and delivery."*
- Actions: **Send via WhatsApp** (builds a formatted message of the tray), **Send as work order** (form), **Save to My Bench**.

### 8.11 CONTROL ROOM: staff and admin
Entered from the small staff link. The login screen is themed (a dark terminal, the logo powering on, "CONTROL ROOM · AUTHORISED CREW ONLY"). It feels like an **operations command centre**, part of the same brand world, not a default admin template.
- **Roles** (closed vocabulary): **Owner** (full control) · **Manager** · **Sales** · **Technician** · **Stock** 🔶. Permissions are enforced on the server, not just hidden in the UI.
- **Dashboard home:** visitors and page views, top searched models, new work orders, low-stock alerts, today's deals, recent reviews, quick actions.
- **Products:** add/edit single products, **bulk import/update by CSV or spreadsheet**, image upload, grade and category assignment, visibility.
- **Pricing:** retail and wholesale per product, bulk price changes (for example +5% on a brand), price history. Wholesale can never exceed retail (validation).
- **Stock:** stock movements in/out with reason, low-stock thresholds and alerts, "back in stock" feeding the Live strip.
- **Power Deals:** discounts, vouchers, start/end dates, automatic badges and countdowns.
- **Work orders:** pipeline **New → Quoted → Confirmed → Ready → Collected / Shipped → Closed**, with customer history.
- **Customers:** accounts, history, loyal customers, trade applications (approve / reject).
- **Reviews:** moderate, reply.
- **Content:** hours and holiday hours, announcement banner, crew profiles, Live strip messages.
- **Reports:** sales/requests by period, top parts, stock value, exports (CSV/PDF).
- **Activity log:** who changed what and when.

### 8.12 FOOTER (identical on every page)
Full-width **Graphite** block with a thin **Signal Yellow** line on top and a faint circuit pattern:
- Logo, slogan, *"Same management, new name. Your trusted electronics partner since 2003."*
- System Map links, address with Plus Code, phones, WhatsApp, email, live hours status.
- Social icons, Google review button.
- © 2026 Sam Electronics L.L.C. All rights reserved. · Privacy · Terms · Warranty policy.

---

## 9. LAYOUT VARIETY RULES
- Never repeat "title on top, text below, three cards" twice in a row.
- Mix split screens, full-bleed bands, diagonal sections, offset grids, overlapping cards, sticky side panels, horizontal scroll rails, bento grids, and huge display type against small mono labels.
- Alternate dark and light sections, and change the palette role every section.
- Every section has at least one living element (a trace, a pulse, a counter, a ticker, a hover reveal).
- Buttons follow one pattern: solid fill, bold uppercase label, arrow or chevron `>>>` pushed right, a glow on hover.

---

## 10. ACCESSIBILITY, PERFORMANCE AND RESPONSIVENESS
- Mobile-first: most retail customers use phones. Every interaction must work by touch.
- Contrast: yellow text only on dark backgrounds, or as large display text. Body text on yellow is Graphite or Circuit Black.
- Keyboard accessible, visible focus states, alt text, reduced-motion support.
- Fast: optimised images, lazy loading, animations on transform/opacity only.
- RTL-ready layout so Arabic can be switched on later without redesign.

---

## 11. WHAT IS FRONT-END NOW VS REAL LATER
- **Phase 1 (design and front-end):** everything above with realistic sample data from one shared data module. Accounts, tray, reviews and Control Room can run as clearly labelled demo states.
- **Phase 2 (real system):** Supabase database, real logins and roles, real product/stock/price management, image storage, work orders.
- **Later:** online payments, Daftra accounting sync, WhatsApp automation, email notifications, full Arabic, Google rating API.

---

## 12. DATA SHAPE (so the front end matches the future database)
- **brands** (id, name, logo)
- **series** (id, brand_id, name)
- **models** (id, series_id, name, model_numbers[], image)
- **part_categories** (closed list)
- **grades** (closed list: code, name, description)
- **products** (id, model_id, category, grade, title, specs, images[], retail_price, wholesale_price, stock_qty, low_stock_threshold, badges[], visible)
- **deals** (id, product_id, discount, starts, ends)
- **stock_movements** (id, product_id, type in/out, qty, reason, user, time)
- **work_orders** (id, customer, items[], status, channel, created)
- **customers** (id, name, type, trade_status, saved[], history)
- **crew** (id, name, role_code, years, bio, photo)
- **reviews** (id, target business/crew, stars, text, date)
- **hours** (weekly schedule + exceptions)

Environment variable names already set in Vercel: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

---

## 13. BUILD SEQUENCE

**In Claude Design:**
1. **Design system:** colours, type, icons, motifs, buttons, cards, signal bars, badges, the nav with charging bar.
2. **Home** (8.1). Get approval before continuing.
3. **Parts Catalogue** finder + product card + product page (8.2).
4. Repair Lab, Wholesale & Shipping (with the map), Our Story & Crew, Reviews, Visit & Contact.
5. My Bench, Parts Tray, Sammy, Control Room.
6. Desktop and mobile versions of each.

**In Claude Code** (Next.js App Router, TypeScript, Tailwind, deployed on Vercel from GitHub, Supabase backend):
1. Shared design system components and the persistent nav, tray, Sammy and footer.
2. One shared sample-data module shaped like Section 12.
3. Pages in the same order as above. Commit after each.
4. Then connect Supabase (Phase 2).

---

## 14. OPEN QUESTIONS FOR THE CLIENT 🔶
1. Which store phone is current: +971 4 273 3031 or +971 4 266 0958?
2. Exact grade names and which grades exist per brand.
3. Full brand list and part categories.
4. Are retail prices public? Do prices include 5% VAT?
5. Warranty durations per grade.
6. Repair services offered (board repair included?).
7. Shipping: couriers, regions, typical times, minimum order.
8. Crew names, roles, years of service and photos.
9. Milestones for the timeline (Syria Tell years, name change year).
10. Loyalty levels and perks.
11. Real product photos, logo source files (SVG), and the domain name.

**Final instruction: this is the minimum. Make it more beautiful, more alive, more interactive and more Sam Electronics than anything described here.**

*End of brief*
