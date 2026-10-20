// R6 Part C7 · what each Quality and Manufacturer name means (the Excel's two lists). Shown by the small "i" button next
// to every quality/manufacturer chip. English source text; Arabic lives in src/i18n/ar.ts (French and Spanish later).
// Warranty periods are not stated here: they come from the Control Room per product.
export type SpecInfo = { what: string; quality: string; warranty: string };

export const QUALITY_INFO: Record<string, SpecInfo> = {
  Original: { what: 'The genuine part made for the phone by its brand.', quality: 'The best colour, brightness and touch.', warranty: 'Covered by our warranty. Ask us for the period.' },
  Compatible: { what: 'A replacement part made to fit and work like the original.', quality: 'Good everyday quality at a lower price.', warranty: 'Covered by our warranty. Ask us for the period.' },
  Standard: { what: 'A dependable replacement for everyday repairs.', quality: 'Solid quality for the price.', warranty: 'Covered by our warranty. Ask us for the period.' },
  AAA: { what: 'A high-grade copy, the closest copy to the original.', quality: 'Very good colour and touch.', warranty: 'Covered by our warranty. Ask us for the period.' },
  AA: { what: 'A copy grade one step below AAA.', quality: 'Good quality for a budget repair.', warranty: 'Covered by our warranty. Ask us for the period.' },
  'OLED Soft': { what: 'A flexible (soft) OLED replacement screen.', quality: 'Deep blacks and true colour, close to the original.', warranty: 'Covered by our warranty. Ask us for the period.' },
  'OLED Big': { what: 'An OLED replacement screen in the larger panel size.', quality: 'Deep blacks and bright colour.', warranty: 'Covered by our warranty. Ask us for the period.' },
  'OLED Small': { what: 'An OLED replacement screen in the smaller panel size.', quality: 'Deep blacks at a lower price.', warranty: 'Covered by our warranty. Ask us for the period.' },
  Incell: { what: 'An LCD screen with the touch layer built into the panel.', quality: 'Good everyday quality, budget friendly.', warranty: 'Covered by our warranty. Ask us for the period.' },
  Other: { what: 'Any other quality we stock for this part.', quality: 'Ask us which one fits your job.', warranty: 'Ask us.' },
};

export const MAKER_INFO: Record<string, SpecInfo> = {
  'Service Pack': { what: 'The brand’s own spare part, sealed in its service box.', quality: 'Original quality, straight from the maker.', warranty: 'Covered by our warranty. Ask us for the period.' },
  OEM: { what: 'Made by the factory that supplies the brand.', quality: 'Original-level parts without the brand box.', warranty: 'Covered by our warranty. Ask us for the period.' },
  Refurbished: { what: 'An original part that was restored and tested.', quality: 'Original panel, renewed.', warranty: 'Covered by our warranty. Ask us for the period.' },
  OLED: { what: 'A maker that produces OLED replacement screens.', quality: 'Deep blacks and true colour.', warranty: 'Covered by our warranty. Ask us for the period.' },
  GX: { what: 'GX, a well-known maker of replacement screens.', quality: 'Reliable quality for repair shops.', warranty: 'Covered by our warranty. Ask us for the period.' },
  ZY: { what: 'ZY, a maker of replacement screens (often Incell).', quality: 'Good value for everyday repairs.', warranty: 'Covered by our warranty. Ask us for the period.' },
  YK: { what: 'YK, a maker of replacement parts.', quality: 'Good value for everyday repairs.', warranty: 'Covered by our warranty. Ask us for the period.' },
  Taiwan: { what: 'Parts made in Taiwan.', quality: 'Ask us about this part.', warranty: 'Covered by our warranty. Ask us for the period.' },
  Other: { what: 'Any other maker we stock for this part.', quality: 'Ask us which one fits your job.', warranty: 'Ask us.' },
};
