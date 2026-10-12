# Sam Electronics website (Next.js)

The public site for Sam Electronics L.L.C. The home page is the Claude Design prototype
`design/project/Sam Electronics Home v3.dc.html`, rebuilt as React components with the same DOM,
styles and behaviour.

- Spec: `docs/Round4_Directors_Edition.pdf` (where it disagrees with the design files, the PDF wins).
- Real texts: `docs/Sam_Electronics_Company_Facts.pdf`, encoded in `src/content/facts.ts`.
- Visual reference: `design/` (inventory in `design/INVENTORY.md`).
- Open items and known gaps: `docs/IMPLEMENTATION_NOTES.md`.

## Run

```bash
cd site
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Vercel: Root Directory `site/`, framework Next.js, no build overrides. Supabase variables are listed in
`.env.example` (not used by the home page yet).

## How it is put together

| Path | What it is |
|---|---|
| `src/app/` | App Router: `layout.tsx` (fonts, `window.SE_FACTS`, engine scripts), `page.tsx` (home) |
| `src/components/home/Home.tsx` | Client-only mount of the home page (the design code reads `window` while rendering) |
| `src/components/home/sections/*.tsx` | One component per home section: Nav, Hero, RepairLab, Wholesale, Worldwide, Story, Team, OpenToEveryone, SamCircuit, Social, RequestVisit, Footer, plus the overlays (BootIntro, FindMyPartPanel, SystemMapDrawer, CartDrawer, SamsoomChat, Toast) |
| `src/components/dc/*.tsx` | The design's components: the home root (`HomeV3`) and the sections built as their own files (`SETeardown`, `SEWhatWeOffer`, `SELiveBoard`, `SEBenchTest`, `SEHomeModels`, `SEHomeDeals`, `SEHomeSamsoom`, `SEFinale`) and shared parts (`SEPart`, `SEBrandLogo`, `SESamsoom`, `SELauncher`, `SEFMPMenu`, `SERepairSequence`, `SEWholesaleTruck`) |
| `src/components/dc/*.logic.js` | Each component's logic class from the design, unchanged |
| `src/dc/runtime.tsx` | The small host that runs those logic classes (state, lifecycle, bindings) |
| `src/content/facts.ts` | Company facts with CONFIRMED / TO_CONFIRM / SAMPLE status; `openQuestions()` lists what the owner must confirm |
| `public/se-teardown-3d.js`, `se-parts-lib.js`, `se-td-ad.js`, `se-3d.js`, `se-globe-data.js`, `image-slot.js` | three.js teardown, parts library, teardown ad, finale/turntable 3D and globe data: **unchanged** copies from the design, loaded by URL at runtime |
| `public/se-data.js` | Sample catalogue (stock, prices, deals) + the facts from `window.SE_FACTS` |
| `public/SE World Map.html` | Worldwide map iframe (design copy with one bug fix, see notes) |

### Generated code

`src/components/dc/`, `src/components/home/sections/`, `src/styles/dc.generated.css` and
`src/dc/head.generated.ts` are generated from `design/project/` by `scripts/dc-codegen.mjs`:

```bash
npm run dc:build   # regenerate from design/project
npm run dc:check   # verify public/ engine files are byte-identical to design/project
```

The generator turns each `.dc.html` template into JSX (exact markup and inline styles), keeps the logic
class as-is, splits Home v3 into the section components above, and replaces fact literals (phone, email,
address, founder, Madrid) with values from `src/content/facts.ts`. To hand-edit a generated component,
first remove it from `COMPONENTS` in the generator (or remove its section from `SECTIONS`) so it is not
overwritten.

### External resources at runtime

As in the design: three.js from esm.sh, d3/topojson from unpkg, world-atlas from jsDelivr, fonts from
Google Fonts, social icons from cdn.simpleicons.org, a QR image from api.qrserver.com and a Google Maps
embed. Brand logos are read from `public/assets/brands/<brand>.svg` when present (not supplied yet; the
typographic wordmarks are shown instead).
