# SAM ELECTRONICS: ROUND 2 BRIEF (v4)

*From the owner. Read all of it. v3 still holds the structure and facts; this file adds my review of the home page, the full design of every detailed page, and the complete Control Room. This is still the design stage: design everything fully so we can move to Claude Code.*

**Work order:** Part A (home fixes) → Part B (global rules) → Part C (every detailed page) → Part D (Control Room) → Part E (check the interactive parts). Show me each part when done.

---

## PART A: HOME PAGE FIXES

The structure is right and many sections are great (the bench test printing is excellent). The problem now: **after the hero, most sections feel dead.** Static cards, no movement, same backgrounds. Every section must feel as alive as the hero.

### A1. Hero
1. **Circuits on the yellow slab:** make them all one consistent grey (graphite, low opacity). Right now some are invisible and some yellow.
2. **"SINCE 2003 · Al Murar, Deira · wholesale & retail · shipped worldwide":** beautiful, but its position feels awkward. Place it more naturally with the headline.
3. **The headline is too small.** "Every part. Every model. Every grade." looks petite next to the search bar and buttons, which are bigger than it. Make it the dominant element of the hero (not giant, but clearly the hero), and balance the search and buttons below it.
4. **Search:**
   - The placeholder suggestions should cycle through many more examples, not just two.
   - Clicking the search opens a **full search panel** (command-palette style) with:
     - live suggestions as you type: models, parts, brands, and categories
     - **recent searches**: saved to the account when logged in, kept on the device for the session when not
     - popular searches.
5. **Hero buttons:**
   - Remove "Find My Part", because it's already in the nav.
   - Use buttons that lead to the essential areas: **Browse all parts · Trade prices · Book a repair · WhatsApp us**. Keep WhatsApp.
6. **A circuit overlaps the top-right button.** No circuit may ever cross text or buttons (see B3).
7. **The iPad and phone need a soft, realistic shadow** under them, plus contact shadows on the slab. It was requested before and is still missing.
8. **Phone ad, worldwide card:** replace the empty globe with a **real globe showing the world map**, routes glowing out of Dubai, gently rotating.
9. **Back cover and frame images look like toys** across the whole design, with no detail. Refine every product image to be far more 3D and realistic: camera bumps, buttons, finishes, edges, reflections.
10. **Toast and launcher overlaps:**
    - The "Added to cart" toast must not cover the iPad's products.
    - Samsoom's launcher must not cover any button.
11. **iPad products:** larger, more realistic product images.

### A2. Brands
Add these brands everywhere (rail, Find My Part, filters, estimator): **Tecno, Honor, Infinix, Vivo, POCO** (realme is already in).

The full list: Apple · Samsung · Xiaomi · Redmi · POCO · Realme · Oppo · Vivo · Huawei · Honor · Google · Sony · Tecno · Infinix.

Every logo must use **one consistent monochrome style at the same visual height**: no logo in a box, no icon-only marks. This applies in the rail, Find My Part, the repair estimator and filters. The brand rail needs soft fades at its edges, so text is never cut off hard.

### A3. Find My Part
Keep it as a **drop-down panel from the top**, opened from the nav button, over the current page:
1. brand
2. model, with search
3. part
4. grade, with price and stock

Only the final step takes you to the Shop. On mobile it's a bottom sheet. It must feel premium and animated (smooth step transitions, logos lighting up).

### A4. Teardown, rebuild it
- The plain white section right after the hero kills the cinematic feeling, and the phone and its parts still look cheap.
- **Rebuild it as a cinematic, dark, premium scene:**
  - a realistic 3D phone with real layers: glass, display, frame, battery, flex, board, cameras, back
  - dramatic lighting and depth
  - layers separating **smoothly with the scroll**: scrubbed, never frozen, never a long dead scroll.
- The part card shouldn't look greyed out or disabled in its first state.

### A5. Everything we offer
- The camera and tools images still look toy-like; match the realism of the rest.
- Add movement: cards that react, parts that rotate slightly, light sweeps.

### A6. Bench test
The animation is great. Keep it.
- **Fix the receipt:**
  - The PASSED stamp must not cover the title or the part name.
  - The receipt must stay inside its area.
- **The surroundings are dead.** Add ambient motion around it: moving circuits, floating parts, light sweeps, maybe a second bench working in the background.

**Do more of these** signature animations across the site (see Part C).

### A7. Model file, make its purpose obvious
Right now it's confusing, and only a few models are shown.
- **New headline idea:** "Pick your phone. See every part we have for it."
- **Make it play on its own:** it cycles through models automatically (pausing when the user interacts), highlights each category and grade, and the price bars animate.
- Show more models, with a search.
- Remove the visible grey scrollbar under the tabs.
- Fix the button text ("Open the full iPhone 15 Pro file" is spread strangely).

### A8. Deals and arrivals
- **Make it play:**
  - deal cards rotate or flip to new deals
  - price tags drop with animation
  - countdowns tick
  - more deals cycle through.
- **Fix the grid:** the fourth card sits alone on a second row. Use four in a row, or a smooth moving carousel.
- The shipment card shows a box moving along the route from Shenzhen to Dubai.

### A9. Repair Lab
- Make the before/after phone realistic.
- Add more animation, for example a repair sequence that plays: cracked screen → tools → new screen boots up.

### A10. Wholesale
It's static and dead. Add life:
- **The calculator:** boxes stack up as the quantity slider grows, the numbers roll.
- **A live trade ticker:** recent bulk quotes, as sample data.
- **The Partner card:** its own animation.

### A11. Worldwide network
- **Remove every airport idea:** no "Departures", no flap letters, no BOARDING / ON TIME / DEPARTED.
- Call it **"Shipments · DXB"** and use shipping statuses: **Packed · Dispatched · In transit · Customs · Delivered**.
- Fix the overlapping labels (Syria / Lebanon / Iraq) and "Saudi Arabia" running under Dubai.

### A12. Story and branches
- **The Dubai map is broken** ("Access blocked / 403"). Use a Google Maps embed or a styled dark static map.
- **Remove the fake "64%"** from Madrid; keep "Coming soon".

### A13. Open to everyone
- **Circuits collide with the titles.** Fix this.
- Add movement to the lanes.

### A14. Sam Circuit
- The battery animation is stuck: it only empties and refills when hovered. It should **charge continuously**, or **charge with the scroll**, tier by tier, always working.
- The cards are mostly empty yellow space. Add a battery visual per tier, icons, and a teaser of the perks ("coming soon").
- A circuit line runs through "Fully Charged · Our closest partners". Fix it.

### A15. Meet Samsoom
- **It got worse.** The earlier version played like a video: the chat demo ran by itself, with example messages for each suggestion and Samsoom changing emotes as it answered. Bring that back.
- **Language:** in English mode show English only (no "سمسوم" in the English view).
- **Make Samsoom cooler and more realistic:**
  - a more detailed, polished 3D character
  - eyes that follow the mouse
  - waves, blows kisses, celebrates when a part is found, a thinking animation, a sleepy idle
- The section needs its own alive environment, not plain white.

### A16. Social wall
- It looks the same as the Samsoom section (same layout, same background). **Every section must have its own environment.**
- **Create designed sample posts** for Instagram, TikTok and Facebook (product shots, repair clips, offers, team), the same way you created the other visuals. TikTok tiles should feel like video with a play state.
- Stronger calls to action ("Follow @samelectronics.uae for daily stock drops").

### A17. Reviews
Make the empty reviews card compact, with a clear "Write the first review" and "Review us on Google". No huge empty box.

### A18. Final call to action
- "A phone on your bench? We have the part." feels dead and cheap.
- Rebuild it as a strong, animated closing scene: Samsoom, moving parts, the circuit lighting up, and the main actions (Browse all parts · WhatsApp us · Visit Deira).

---

## PART B: GLOBAL RULES (whole site)

1. **Animations replay.**
   - Every animation runs whenever its section comes into view, including when scrolling back up. Never only once.
   - Scroll-linked animations follow the scroll both ways.
2. **Nothing static after the hero.** Every section needs at least one living element: motion, ambient light, a ticker, auto-playing content or reactive hover. The whole site should feel like the hero.
3. **Circuits never cross text, buttons or content.** Keep clear space around every element, everywhere.
4. **Every section has its own environment.** No two neighbouring sections share the same layout and background. Use varied surfaces:
   - living graphite with light beams
   - brushed metal
   - dark glass
   - blueprint grid
   - warm yellow light
   - clean fog with texture
5. **Colours:**
   - The site is drifting to black and losing the grey. Use the **graphite range** (`#3D3E3F`, `#26282B`, with gradients and light) instead of near-black, plus the bright yellow and white.
   - Avoid repeating the same colour block twice in a row.
6. **Nav glass:**
   - Clean everywhere.
   - No grey or dark smudge behind the middle of the bar in any section (it shows over the teardown, team and final call to action).
7. **Stronger copy and calls to action** in every section: specific, confident, action-led. Some are weak now.
8. **Realism:**
   - Every product, device and part looks like a real studio product shot.
   - Shadows, reflections and fine details everywhere.
9. **Language:** one language per view (English only in EN, Arabic only in عربي), with full right-to-left in Arabic.
10. **Smoothness:** 60fps, transform/opacity animations, nothing that freezes the page.

---

## PART C: DESIGN EVERY DETAILED PAGE

The home page is only a preview. **Each section opens a full page with much more inside.** Design every page completely, desktop and mobile, each with its own **signature animation** (like the bench test). All use the same nav, Signal Path breadcrumb, cart, Samsoom and footer.

### C1. Shop parts
- **Signature:** a "parts scanner". Product cards glide in under a scan line. Changing filters re-sorts the cards with smooth motion, and hovering a card makes it separate into layers slightly.
- **Contents:**
  - full search (command palette)
  - filters with live counts: brand, model, part, grade, price, stock, deals
  - grid and list views, sorting
  - product cards with realistic images, grade chip, stock signal, price (wholesale only for approved accounts), save, add to cart
  - **Kit Builder** (screen + adhesive + tools, bundle price computed)
  - "Not sure which model?" helper
- **Product page:**
  - gallery with 360° spin
  - specs, compatible models
  - **grades side by side**
  - stock, warranty, related parts, "frequently bought together"
  - Add to cart, Ask on WhatsApp, Notify when back in stock
  - Q&A, reviews

### C2. Brands & models
- **Signature:** a brand wall where logos float in and connect by circuits. Picking a brand flies into its series.
- **Contents:**
  - all 14 brands → series → models, with search
  - **Model File page** (one template for every model): a rotatable 3D phone with **hotspots on each part**, where clicking a hotspot jumps to that part's list. Every category and grade, prices, stock, repair estimate, related models.

### C3. Repair Lab
- **Signature:** a full repair sequence that plays as you scroll: a cracked phone → diagnosis scan → parts swapped → the new screen boots → "TESTED" seal.
- **Contents:**
  - services and prices
  - full estimator
  - a repair tracker demo (Received → Diagnosing → Repairing → Testing → Ready)
  - warranty, before/after gallery, FAQ
  - booking form

### C4. Wholesale & trade
- **Signature:** a warehouse of boxes that stacks and ships as you scroll, and a live trade ticker.
- **Contents:**
  - trade tiers and benefits
  - the bulk calculator
  - bulk list upload (paste or file) with instant line-by-line matching to our catalogue
  - trade account application (steps, documents)
  - Partner with us (distributors abroad)
  - why trade with us, FAQ

### C5. Worldwide network
- **Signature:** a 3D globe that rotates to each region as you pick it, with shipping routes animating from Dubai.
- **Contents:**
  - regions as chapters with their countries
  - a shipment tracker demo (Packed → Dispatched → In transit → Customs → Delivered)
  - how we pack (batteries, screens), shipping quote request

### C6. Deals & arrivals
- **Signature:** a price-drop board where tags flip and drop. Incoming shipments move along routes with live countdowns.
- **Contents:** all deals, new arrivals, incoming shipments, pre-orders for new models, "notify me", vouchers.

### C7. Our story
- **Signature:** a scroll-driven timeline where the shopfront itself evolves:
  - 2003 Syria Tell
  - 2011 the bigger shop
  - 2015–2019 the market branch
  - 2020 Sam Electronics
  - Madrid coming soon
- **Contents:**
  - **Leadership:** the founder and managing director, Tarek Alchoumari.
  - Values: open to everyone, like family.
  - **The team:** shown as a circuit board where each role is a component that lights up. Featured members, then the full roster filtered by role, ratings and reviews per person (honest empty states), "leave a review" on a person.
  - **Careers:** open roles and a full application (role, availability, languages, CV upload).
  - **Branches:** each branch with photos, live status, map and contact.

### C8. Sam Circuit (membership)
- **Signature:** a battery that charges as you scroll through the tiers.
- **Contents:** how it works, the four tiers (Connected · Charged · Supercharged · Fully Charged), perks "coming soon", join, FAQ.

### C9. Ask Samsoom (full page)
- **Signature:** a large animated Samsoom reacting live to the conversation.
- **Contents:**
  - full chat with emotes, quick suggestions, typing indicator
  - "What Samsoom can do": six jobs, each linking to a page
  - "Prefer a human?": WhatsApp, phone, live status

### C10. My Bench (customer account)
- **Signature:** the dashboard powers on like a device. The order tracker is a signal path lighting up step by step.
- **Contents:**
  - sign up / log in (account type: Retail customer, Repair shop, Trader & exporter, Bulk buyer)
  - profile with photo, member ID, Sam Circuit tier
  - live stats
  - orders and requests with tracking, saved parts with price-drop alerts, recently viewed, search history
  - trade status, messages with the team, addresses, settings

### C11. Cart and request flow
- Cart drawer → review → choose: send via WhatsApp (formatted), send as request, or email.
- Then a printed **work-order confirmation** with a reference number.
- Clear notice that online payment and delivery booking come later.

### C12. Request & contact
- The Request Console: its type changes the form, and it ends with a printed work order.
- Branch cards with working maps, hours and live status.
- Contact details and FAQ.

### C13. Help & legal
FAQ, warranty policy, shipping, returns, privacy, terms. Clean, searchable.

### C14. Staff login
- A dedicated branded page: dark, the logo powering on, "Authorised staff only".
- Email and password, 2FA, forgot password.

---

## PART D: CONTROL ROOM (full business platform)

**After login, staff land in a complete business platform:** a real operations and management system in our brand style (light and dark mode, works on mobile). Every part of the public website must be **editable from here, section by section.** Design every screen. Every feature a business like ours could need or dream of:

### D1. Command centre (dashboard)
- **Today at a glance:**
  - visitors and page views
  - searches, including **searches with no results** (stock we should get)
  - new requests and orders
  - repairs in progress
  - low-stock alerts
  - deals ending
  - incoming shipments
  - reviews waiting
  - messages
- Charts, a tasks list, a notifications centre, global search, quick actions.

### D2. Catalogue
- Products: add, edit, duplicate, archive.
- **Grades as variants**, each with its own price, stock and warranty.
- **Compatibility mapping:** which models each part fits.
- Images: single and **bulk upload**.
- Titles and descriptions in **English and Arabic side by side**.
- SEO fields, visibility, featured.
- **Bulk import (CSV/Excel):** preview, validation, an error report, then apply.
- Bulk edit.
- Brands, series, models and categories management.

### D3. Pricing
- Retail, wholesale and tier prices. **Wholesale can never exceed retail.**
- **Bulk price updates** by brand, model, category or grade, by percentage or amount, with a preview.
- Scheduled price changes, full price history.
- Cost price and margin warnings.
- VAT settings, currencies.

### D4. Inventory
- Stock levels per product and grade.
- Stock movements: in, out, adjustment, return, damaged, each with a reason and the person.
- Low-stock thresholds and alerts, reorder suggestions.
- Suppliers, purchase orders.
- **Incoming shipments** with ETA (these feed the website countdowns).
- Stock-take / cycle counts, barcode and label printing, stock value report.

### D5. Orders & requests
- A pipeline board: **New → Quoted → Confirmed → Ready → Collected / Shipped → Closed**.
- Create and send quotes, print work orders and packing slips.
- Payment status (manual for now), shipping and tracking numbers.
- Assign to staff, internal notes, full history per order.

### D6. Repairs
- Repair tickets: device intake (model, problem, photos, customer).
- Technician assignment, status updates (the customer gets notified).
- Parts used are deducted from stock automatically.
- Warranty records, repair history per customer.

### D7. Customers (CRM)
- Profiles, type, full history, notes, tags.
- Sam Circuit tier, loyal customers.
- **Trade account approvals** with documents, credit and terms.
- Segments, export.

### D8. Communications
- **One inbox** for website messages, contact forms, requests and Samsoom handoffs.
- Reply from the inbox; **send WhatsApp** (click-to-chat now, WhatsApp Business API later) and **email**.
- Message templates (quote ready, order ready, back in stock).
- Broadcasts to customer segments (later), notification settings.

### D9. Reviews
- Approve or hide, **reply publicly** to reviews.
- Staff reviews.
- Send review requests (website and Google link).

### D10. Marketing
- Deals, vouchers and codes.
- Price-drop campaigns, pre-orders.
- Announcement bar, Live Parts Board messages.
- Featured products on the home page, phone ad reel cards.
- Social wall posts (upload, order, link).

### D11. Website editor (section by section)
- Edit every section of the website:
  - hero texts and buttons
  - the iPad and phone content
  - every home section (show, hide, reorder)
  - all detailed pages
- Hours, holiday hours and branches.
- Team members and the story timeline.
- FAQ and legal pages, SEO.
- **Translations:** English and Arabic side by side.
- Preview before publishing.

### D12. Samsoom settings
- Knowledge and answers.
- Handoff-to-human rules.
- Conversation logs.
- Common questions report.

### D13. Reports & analytics
- Sales and requests by period, top parts, top models, top countries.
- Search terms and zero-result searches, conversion funnel.
- Stock value and aging stock.
- Staff performance, repair turnaround.
- Export CSV/PDF, scheduled reports by email.

### D14. Team & security
- Staff accounts, **roles and a permissions matrix** (Owner, Manager, Sales, Technician, Stock, Accounts).
- Activity / audit log, login sessions, 2FA.

### D15. Settings
- Business info, currencies, VAT.
- Shipping zones and rates, payment methods (later).
- **Integrations:** Daftra accounting, WhatsApp, email, Google (later phases).
- Backups, data export.

*All data in the design is sample data. Design every screen now; we will build it in phases in Claude Code.*

---

## PART E: SHOW ME THE INTERACTIVE PARTS

When you present the work, include screens or recordings of:
1. Find My Part (all 4 steps)
2. The search panel
3. Cart drawer → WhatsApp send
4. Arabic / right-to-left
5. Mobile home
6. Samsoom chat open
7. Staff login + Control Room dashboard
8. My Bench
