# SAM ELECTRONICS: MASTER BRIEF v2 (DESIGN SYSTEM FIRST)

*This replaces v1 completely. Discard every earlier Sam Electronics design. Do not reuse anything from it.*

---

## 0. READ THIS FIRST, CLAUDE

1. **Start from zero.** The previous design is rejected. It copied another project's look (tickets, stamps, departure boards, tilted sticker cards, huge condensed all-caps headlines, four stacked nav rows, marquees everywhere). **None of that belongs here.** Do not use any airport, travel, ticket, passport, stamp or boarding metaphor anywhere.
2. **Sam Electronics has its own identity: a modern, clean, premium tech store and parts supplier.** Think precision hardware, product launch pages, a modern repair lab. Calm, confident, airy, with depth and light. Never crowded, never loud for the sake of it.
3. **Build the design system first** (Section 3), get it approved, then build pages with it. Every page must use only these tokens and components.
4. **Language:** the site is fully bilingual with a **language switch (EN / عربي)**. Each view shows **one language at a time**, with full right-to-left layout in Arabic. Never mix Arabic and English in the same headline or section (the bilingual logo is the only exception).
5. **This brief is the minimum.** Be creative within the system: better compositions, better motion, better details. Creativity means *original and polished*, not *more stuff*.
6. Items marked 🔶 are unconfirmed. Use realistic sample data from one shared data module, clearly marked as sample.

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

---

## 2. BRAND DIRECTION

**Sam Electronics: every part, every model, every grade, since 2003.**

The energy comes from the **official logo artwork**: a living graphite surface with diagonal light, yellow circuit traces radiating from a clean white centre, real phone parts and tools around it. The website takes that energy and makes it **modern, clean and premium**:
- **Graphite is alive, not flat:** layered gradients, soft diagonal light beams, subtle depth, a faint grain, glows behind products.
- **Yellow is energy and light:** it flows through circuit lines, highlights what matters, and marks every action.
- **White is the clean store:** bright product areas where parts look sharp and easy to compare.
- **Real parts are the heroes:** high-quality product photography or 3D renders, never outline drawings.

**Voice:** short, clear, confident, a little clever. Sentence case. Never shouting.
- Slogan under the logo: **Quality · Warranty · Price**
- Lines to start from 🔶 (write better ones): *"Every part. Every model. Every grade."* / *"Tested parts. Real warranty. Fair prices."* / *"Since 2003, keeping phones alive."* / *"From Deira to the world."* / *"Your mobile, our priority."* / *"Same management, new name. Same trust since 2003."*

**Naming:** use plain, clear words: Shop, Repair, Wholesale, About, Contact, Cart, Account, Admin. No themed renaming.

---

## 3. DESIGN SYSTEM

### 3.1 Colour tokens
| Token | Hex | Use |
|---|---|---|
| `yellow-500` (Signal) | `#F7C032` | Primary actions, highlights, active states, circuit light |
| `yellow-300` (Glow) | `#FFDB6E` | Glows and light only (never large fills) |
| `yellow-100` | `#FFF4D1` | Soft tinted backgrounds, deal chips |
| `graphite-900` | `#1A1B1D` | Deepest surfaces, admin |
| `graphite-800` | `#26282B` | Dark sections base |
| `graphite-700` | `#3D3E3F` | Logo grey, elevated dark surfaces |
| `graphite-500` | `#5E6064` | Borders and muted text on dark |
| `slate-400` | `#8C9096` | Secondary text on light |
| `fog-100` | `#F2F3F4` | Light sections, product image backgrounds |
| `white` | `#FFFFFF` | Cards, content areas |
| `danger` | `#E5484D` | Errors and out of stock only |
| `success` | `#2BB673` | Order confirmed / in stock text only 🔶 |

**How colour is used (this is what makes it alive, not "yellow grey yellow grey"):**
- **Rough balance per page:** about 50% light (white/fog), 35% graphite, 15% yellow.
- **Every section uses a different mix:**
  - white section with yellow accents
  - graphite section with a yellow glow and white type
  - yellow band with graphite type
  - fog section with graphite cards
  - graphite with a white card floating on top
- **Dark sections are never flat:** a gradient (`graphite-700` → `graphite-900`), a diagonal light beam, a radial yellow glow behind the main object, and faint circuit traces at low opacity.
- **Yellow is used for energy and action**, not as a filler colour.

### 3.2 Typography
| Role | Font 🔶 | Rules |
|---|---|---|
| Display / headings | **Space Grotesk** (or Sora / Geist) | Sentence case, medium-bold weights, tight but readable. H1 max 64px desktop / 40px mobile, max 2 lines |
| Body | **Inter** | 16–18px, comfortable line height |
| Technical labels | **JetBrains Mono** (or Geist Mono) | Small (11–13px): part codes, model numbers, stock, prices metadata. Accents only |
| Arabic | **IBM Plex Sans Arabic** | Full RTL. Same scale and weights |

No condensed all-caps headlines. No page-filling text. Generous white space.

### 3.3 Shape, depth and surfaces
- **Corner radius:** 10px (buttons, inputs), 16px (cards), 24px (large panels). Consistent everywhere.
- **Shadows:** soft and layered (no hard offset "sticker" shadows, no rotated cards).
- **Glass:** the sticky nav and floating panels use a subtle blur on dark/light.
- **Signature motif:** **circuit traces with node dots** from the logo, used as fine lines connecting elements, dividing sections and glowing on interaction. Plus the **diagonal light** from the logo background. Use both with restraint.
- **Icons:** one clean line icon set (for example Lucide or Phosphor style, 1.5px stroke), plus custom icons for part categories.

### 3.4 Core components
- **Buttons:**
  - **Primary:** yellow fill, graphite text.
  - **Secondary:** outline.
  - **Ghost.**
  - All have a smooth hover (slight lift plus glow) and a press state.
- **Product card:**
  - **Image dominant** on a fog background, with a real photo or 3D render.
  - Grade chip, model name, part name, price, stock indicator and a quick "Add to cart".
  - Hover: card lifts, image tilts slightly in 3D, a thin yellow trace runs along the border.
  - Images must look premium. No grey boxes with text.
- **Category tile:** a large 3D/photographic part render (screen, battery, flex, frame, back cover, camera) on a graphite card with a yellow glow; it rotates gently on hover.
- **Stock indicator:** small phone-signal bars plus text (*In stock* / *Only 3 left* / *Out of stock*).
- **Grade chip:** compact, one consistent style per grade (Original, Service Pack, OLED, Incell, High Copy 🔶).
- **Deal badge:** yellow chip "−15%" with the old price struck through.
- **Inputs, filters, tabs, drawers, modals, toasts:** one consistent style, all keyboard accessible.

### 3.5 Motion principles
- **Never freeze the page and never hijack scrolling.** Scroll animations are *scroll-linked*: they move exactly with the user's scroll, smoothly, both directions.
- **60fps:** animate only transform and opacity. Use proper tools (for example Framer Motion, GSAP ScrollTrigger, Lenis for smooth scrolling, React Three Fiber or a pre-rendered image sequence for 3D).
- **Durations** 200–600ms, easing `cubic-bezier(0.2, 0.8, 0.2, 1)`. Stagger lists by 40–60ms.
- **Motion vocabulary** (reuse across the site):
  - **Current flow:** light travelling along circuit traces.
  - **Reveal:** fade plus rise on entering view.
  - **Lift and tilt:** on hover.
  - **Glow:** behind active objects.
  - **Count-up:** for numbers.
  - **Assemble:** parts docking into place.
- Respect **prefers-reduced-motion**.

### 3.6 Signature interactions
1. **Scroll progress "current":** a thin 2px line under the nav. As you scroll, yellow light flows along it like current through a circuit trace, with a soft moving glow pulse. At the end of the page the line finishes at a small node that lights up. **No icons on it.**
2. **The teardown hero:** a realistic 3D phone (or high-quality render sequence) that **separates into its real layers as you scroll** (glass, display, frame, battery, board, back cover). Each layer gets a small clean label with a circuit line pointing to it and links to its category. It must be **smooth and scrubbed with scroll**, never blocking the page.
3. **Circuit backgrounds:** faint traces in dark sections where current pulses travel occasionally, and lines that light up toward the element under the cursor.

### 3.7 The assistant mascot: Sammy
- **Sammy is a tiny phone with a screen face** (it echoes the two phones in the logo): rounded graphite body, yellow screen, two simple eyes.
- **Small:** a 56px round launcher bottom-right (about 64px on hover). No big pill.
- **Alive but subtle:**
  - it blinks every few seconds
  - its eyes follow the cursor
  - it smiles and waves when opened
  - a small yellow dot shows when it has a tip
- **Panel:** a clean 360px chat card with quick suggestions (*Find a part · Which grade? · Open now? · Shipping*). It answers from the real site data and can open WhatsApp.

### 3.8 Design tokens in code (give these to Claude Code as the source of truth)
```css
:root {
  --yellow-500:#F7C032; --yellow-300:#FFDB6E; --yellow-100:#FFF4D1;
  --graphite-900:#1A1B1D; --graphite-800:#26282B; --graphite-700:#3D3E3F; --graphite-500:#5E6064;
  --slate-400:#8C9096; --fog-100:#F2F3F4; --white:#FFFFFF; --danger:#E5484D; --success:#2BB673;
  --font-display:"Space Grotesk",system-ui,sans-serif;
  --font-body:"Inter",system-ui,sans-serif;
  --font-mono:"JetBrains Mono",ui-monospace,monospace;
  --font-arabic:"IBM Plex Sans Arabic",system-ui,sans-serif;
  --radius-sm:10px; --radius-md:16px; --radius-lg:24px;
  --shadow-sm:0 1px 2px rgba(0,0,0,.06),0 2px 8px rgba(0,0,0,.06);
  --shadow-lg:0 8px 24px rgba(0,0,0,.10),0 24px 64px rgba(0,0,0,.12);
  --glow-yellow:0 0 40px rgba(247,192,50,.35);
  --ease:cubic-bezier(.2,.8,.2,1); --dur-fast:200ms; --dur:400ms; --dur-slow:600ms;
}
```

### 3.9 Do and don't
| Do | Don't |
|---|---|
| Clean, airy layouts with clear hierarchy | Crowded sections, text everywhere |
| Real product imagery and 3D renders | Outline drawings, grey boxes with text |
| Sentence-case headings, max 2 lines | Huge condensed all-caps text |
| Smooth scroll-linked motion | Animations that freeze or block scrolling |
| One language per view with a switch | Arabic and English mixed in one block |
| Living graphite with light and depth | Flat dead grey |
| Mixed colour roles per section | Yellow-grey-yellow-grey repetition |
| A small, cute Sammy | A large chat pill |
| Anything original to Sam Electronics | Tickets, stamps, boarding passes, departure boards, tilted sticker cards, marquees everywhere |

---

## 4. NAVIGATION AND STRUCTURE

The site must have **room to grow** into a full e-commerce store plus a management system. Plan the structure for that now.

**Top bar (one clean row, sticky, glass blur on scroll):**
- **Left:** the logo with **SAM ELECTRONICS** and the small slogan *Quality · Warranty · Price*.
- **Centre:** **Shop** (opens a mega menu: brands → series → models, plus part categories), **Repair**, **Wholesale**, **About**, **Contact**.
- **Right:**
  - a search icon that opens a large search
  - a live status dot ("Open now")
  - the language switch **EN / عربي**
  - Account
  - Cart with a count badge
- **Under the bar:** the 2px scroll "current" line (3.6).
- **Optional:** one slim announcement bar above everything (for example a current deal), dismissible.

**Breadcrumb** on inner pages: `Home / Shop / Apple / iPhone 16 Pro / Screens`, clean and small.

**Mobile:** a bottom tab bar (Home · Shop · Search · Cart · Account) plus the menu.

**Admin** is a separate app shell (left sidebar dashboard) at `/admin`. It is not part of the public navigation; there is a discreet "Staff login" link in the footer.

**Locations:** design the Contact/Visit area so it can hold **multiple branches** later (each with its address, hours, map and live status), even though there is one shop today.

---

## 5. PAGES

### 5.1 HOME
A clean, premium store front that shows the whole business without crowding.
1. **Hero:** split layout on a living graphite background (gradient, diagonal light, faint circuits).
   - **Left:** headline *"Every part. Every model. Every grade."*, a short subline (*"Genuine, tested mobile phone parts, wholesale and retail, from Deira since 2003."*) and a **large search bar** ("Search your model or part: iPhone 13 screen, A54 battery…"). Buttons: **Shop parts** (primary) and **Wholesale** (secondary).
   - **Right:** the 3D phone with a yellow glow behind it.
2. **Teardown (scroll-linked):** the phone separates into its layers as you scroll, each labelled and linked. Smooth, never blocking.
3. **Shop by brand:** a clean row of brand logos (Apple, Samsung, Xiaomi, Redmi, Realme, Oppo, Huawei, Google, Sony 🔶 more), hover glow, linking into the finder.
4. **Shop by part:** category tiles with 3D/photo part renders (Screens, Batteries, Charging & cables, Back covers, Frames, Cameras…).
5. **Deals:** a horizontal row of product cards with deal badges and stock indicators.
6. **Why Sam Electronics:** Quality / Warranty / Price as three refined panels, each with an icon and one line, on a yellow band.
7. **Repair:** before/after slider (cracked → new) and the repair steps (Diagnose → Quote → Repair → Test → Warranty) connected by a current line.
8. **Worldwide:** a dark world map with Dubai glowing and routes flowing to the Middle East, Africa, Europe and Asia; CTA to Wholesale.
9. **Since 2003:** count-up numbers (years, brands, parts 🔶) and the *"Same management, new name"* story (formerly Syria Tell) in one elegant block.
10. **Reviews:** real reviews (or an honest empty state) plus the "Review us on Google" card.
11. **Visit us:** live open/closed status, hours, map and WhatsApp.
12. Footer.

### 5.2 SHOP (parts catalogue)
The heart of the site. Simple for the customer, powerful underneath.
- **Finder:** **Brand → Series → Model → Part category → Grade → Product**. Example: *Apple → iPhone 16 series → iPhone 16 Pro → Screens → OLED*.
  - Big brand tiles, then a model grid with phone images and search, then category tiles with item counts, then grade options, then results.
  - Each step transitions smoothly.
- **Search:** by model ("A54"), model number ("SM-A546") or part ("iPhone 13 battery"). Typo-tolerant, with instant suggestions.
- **"Which model do I have?"** helper per brand.
- **Filters:** brand, model, category, grade, price, in stock, on deal. They combine, show live counts, and appear as a side panel on desktop and a sheet on mobile.

**Grades** 🔶 (confirm names with the client): Original · Service Pack · OLED · Incell · High Copy.

**Categories** 🔶: Screens · Batteries · Charging & cables · Back covers · Frames & housings · Cameras · Speakers & audio · Buttons & flex · Small parts · Tools.

**Product card:** see 3.4.

**Product page:**
- Large gallery, specs and compatible models.
- **Compare grades side by side** for this exact model: price, quality, brightness, warranty.
- Related parts, warranty info, and Add to cart / Save / Ask on WhatsApp.

**Prices:** retail is public. **Wholesale prices show only to approved trade accounts** (this fixes his wholesale/retail pricing mistakes). Signed-out visitors see *"Trade price available: apply for a trade account."* 🔶 Confirm retail visibility and VAT.

### 5.3 REPAIR
- Services: screen replacement, battery repair/replacement, board-level faults, charging port, cameras 🔶.
- **Repair estimator:** brand → model → problem → grade gives an estimated price range and time, from real data.
- Before/after sliders, the process steps, and warranty info 🔶.
- **Book a repair** (form or WhatsApp).

### 5.4 WHOLESALE
- **Interactive world map:** Dubai at the centre, routes flowing to regions. Region filters: All · Middle East · North Africa · East Africa · West Africa · Central & Southern Africa · Europe · Asia. Selecting a region highlights it.
- **Trade account application** (unlocks wholesale prices).
- **Bulk order request:** paste or upload a parts list (model, part, grade, quantity) or send the cart.
- Shipping promise (tracked, securely packed, fast 🔶 details) and why trade with us.

### 5.5 ABOUT
- The story since 2003: a clean vertical timeline with a current line growing as you scroll (2003 founded in Deira → formerly Syria Tell → new name Sam Electronics → 2026 the digital store). Only real milestones 🔶.
- **Founder:** Tarek Alchoumari, owner and manager since 2003 (real photo when provided, a tasteful placeholder until then).
- **Values** 🔶: tested before sold · every grade honestly labelled · same respect for one part or one thousand · warranty that means something · fast answers.
- **Team:** roles 🔶 (Sales, Trade accounts, Repair technicians, Stock & logistics), cards with photo, name, role, years with the company, and reviews per person (honest empty state).
- **Careers:** a simple application form 🔶.

### 5.6 CONTACT / VISIT
- **Live status:** Dubai time, "Open now · closes 14:00" or "Closed · opens 16:00" with countdown; handles split shifts, the short Friday and closed Sunday. Holiday hours editable in Admin.
- Weekly hours (today highlighted), map, Plus Code, directions, WhatsApp (prefilled), call, email, socials, contact form.
- **Built for multiple branches later** (one card per branch).

### 5.7 REVIEWS
- Business and team reviews with a 5-star widget and an honest empty state.
- "Review us on Google" card (Google keeps its own colours inside the badge).
- 🔶 Later: the live Google rating.

### 5.8 ACCOUNT (customers)
- Sign up / log in in a clean modal. Account type: Retail customer · Repair shop · Trader.
- **Dashboard:**
  - profile (photo, name, type)
  - saved parts with price-drop alerts
  - orders and requests with status
  - recently viewed
  - preferred brands/models
  - deals for you
  - trade account status
  - messages to the team
  - loyalty level 🔶

### 5.9 CART
- A slide-in drawer from the right. Items grouped by model, quantity controls, subtotal, VAT 5% 🔶, total.
- Notice: *"Online delivery isn't live yet. Send your cart as a request and our team will confirm stock, price and delivery."*
- Actions: **Send via WhatsApp** (formatted message), **Send request**, **Save to account**.

### 5.10 ADMIN (staff management system)
A separate dashboard app with a clean left sidebar, light and dark modes, the same tokens.
- **Roles** 🔶: Owner (full) · Manager · Sales · Technician · Stock. Permissions are enforced on the server.
- **Overview:**
  - visitors and views
  - top searches
  - new requests
  - low-stock alerts
  - active deals
  - recent reviews
- **Products:** add/edit, bulk import/update (CSV/Excel), images, grades, categories, visibility.
- **Pricing:** retail and wholesale (wholesale can never exceed retail), bulk changes (+5% on a brand), price history.
- **Stock:** movements in/out with reason, thresholds, alerts.
- **Deals and vouchers:** dates and automatic badges.
- **Requests/orders pipeline:** New → Quoted → Confirmed → Ready → Collected/Shipped → Closed.
- **Customers:** history, loyal customers, trade approvals.
- **Reviews:** moderation.
- **Content:** hours, branches, team, announcement bar.
- **Reports:** exports (CSV/PDF).
- **Activity log.**

### 5.11 FOOTER (every page)
- Dark graphite with a fine yellow line and faint circuits.
- Logo, slogan, *"Same management, new name. Your trusted electronics partner since 2003."*
- Links, address and Plus Code, phones, WhatsApp, email, live status, socials, Google review.
- Staff login, © 2026 Sam Electronics L.L.C, Privacy · Terms · Warranty.

---

## 6. ACCESSIBILITY, PERFORMANCE AND RESPONSIVENESS
- Mobile-first: most retail customers use phones. Every interaction must work by touch.
- Contrast: yellow text only on dark backgrounds, or as large display text. Body text on yellow is graphite.
- Keyboard accessible, visible focus states, alt text, reduced-motion support.
- Fast: optimised images, lazy loading, animations on transform/opacity only.
- Full Arabic/RTL via the language switch from the start; layouts mirror correctly.

---

## 7. WHAT IS FRONT-END NOW VS REAL LATER
- **Phase 1 (design and front-end):** everything above with realistic sample data from one shared data module. Accounts, cart, reviews and Admin can run as clearly labelled demo states.
- **Phase 2 (real system):** Supabase database, real logins and roles, real product/stock/price management, image storage, work orders.
- **Later:** online payments, Daftra accounting sync, WhatsApp automation, email notifications, Google rating API.

---

## 8. DATA SHAPE (so the front end matches the future database)
- **brands** (id, name, logo)
- **series** (id, brand_id, name)
- **models** (id, series_id, name, model_numbers[], image)
- **part_categories** (closed list)
- **grades** (closed list: code, name, description)
- **products** (id, model_id, category, grade, title, specs, images[], retail_price, wholesale_price, stock_qty, low_stock_threshold, badges[], visible)
- **deals** (id, product_id, discount, starts, ends)
- **stock_movements** (id, product_id, type in/out, qty, reason, user, time)
- **requests** (id, customer, items[], status, channel, created)
- **customers** (id, name, type, trade_status, saved[], history)
- **team** (id, name, role, years, bio, photo)
- **branches** (id, name, address, plus_code, phones, hours, map)
- **reviews** (id, target business/team member, stars, text, date)
- **hours** (weekly schedule + exceptions)

Environment variable names already set in Vercel: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

---

## 9. BUILD SEQUENCE

**In Claude Design:**
1. **Design system page first** (Section 3): colours, type, buttons, product card, category tile, stock indicator, grade chips, nav with the current line, Sammy. Get approval.
2. **Home** (5.1), desktop and mobile. Get approval.
3. **Shop**: finder, product card, product page (5.2).
4. Repair, Wholesale, About, Contact, Reviews.
5. Account, Cart, Admin.
6. Arabic (RTL) versions of the key pages.

**In Claude Code** (Next.js App Router, TypeScript, Tailwind, deployed on Vercel from GitHub, Supabase backend):
1. Design tokens (3.8) and shared components, nav, cart, Sammy, footer, and i18n (EN/AR with RTL, for example next-intl).
2. One shared sample-data module shaped like Section 8.
3. Pages in the same order as above. Commit after each.
4. Then connect Supabase (Phase 2).

---

## 10. OPEN QUESTIONS FOR THE CLIENT 🔶
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

