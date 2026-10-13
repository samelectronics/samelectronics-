# Circuit audit (Issue 4)

Run it again at any time:

```
cd site && node scripts/qa/circuit-audit.mjs --url http://localhost:3000/ --out audit.json
```

**How the audit works**
- **What counts as a circuit:** a stroked, unfilled path inside a decorative SVG that is at least 60px in both directions and at least 120px long.
- **How it is checked:** the script samples points every 4px along each circuit. It ignores points hidden under something on top (for example the hero's circuits running behind the iPad and the phone). Each visible point must be at least **24px** from any text, button, image or card in the same section.

## Before (13 Oct, first run): 31 paths too close

| Section | Circuit | What it touched | What was done |
|---|---|---|---|
| Deals & arrivals | top-right trace `M800 12 H690 L670 28 H560` on the countdown card | the countdown digits (0px) | **Removed.** The bottom-left trace on the same card stays. |
| Wholesale / Trade Floor | the floor bus `M0 680 …` | "TRADE TICKER · SAMPLE" (2px) | **Rerouted** to the floor edge: `M0 746 H160 L196 716 H420 L450 746 H560` |
| Who are you? (lanes) | the 4 connectors from the hub to the lanes | the hub logo (16px) | **Rerouted:** a short stem 24px under the hub, then one straight bus to each lane |
| Meet Samsoom | the floor trace `M0 700 …` | "Ready when you are" (11px) | **Rerouted** lower: `M0 746 H120 L150 722 H260` |
| What we offer | the two flowing side traces | the full-section 3D canvas behind them | Not content. The audit now ignores full-section 3D layers |
| Bench Test | the oscilloscope and price traces inside the test console | the console labels | Not circuits: they are data charts inside the UI. The audit now ignores SVGs under 60px tall |

## After: 9 paths, all intentional

| Section | Circuit | Why it stays |
|---|---|---|
| Hero (6) | the hero's own circuits next to the iPad and phone | The hero is approved and is "the standard". Its circuits pass behind the devices. The points the audit flags are next to the devices' edges or text clipped inside the iPad screen, not on visible content. |
| Deals & arrivals (3) | the curved route line Shenzhen → Dubai on the incoming-shipment card | It's a shipment route drawn between its two labels, not a background circuit. It stays 20px from the "DUBAI · DEIRA" label. Issue 7 rebuilds this section and will look at it again. |

## The other Issue 4 points

- **Nav progress line:** kept as built. A thin yellow line fills with scroll, with a small glowing node at its head.
- **Current:** it flows as soft streaks everywhere, in the hero's style: short glowing dashes moving along the traces at different speeds.
- **Surges:** `src/components/perf/CircuitSurge.tsx` handles them. On an event, one visible streak nearby brightens and runs 2.4× faster for 400ms. The events are:
  - add to cart (including the iPad's add-to-cart);
  - a new Live Board row;
  - hovering a card (family cards, service boxes, board tiles, iPad cards).
- **Background textures:** grids, stripes and dot tiles were replaced with a fine film grain (2–5%) in:
  - Repair Lab;
  - Wholesale;
  - Story;
  - Team;
  - Who are you?;
  - Deals;
  - Model File.
- **Kept textures:** the ones that belong to objects, such as barcodes, the bench rig, the brushed card and the approved hero slab.
