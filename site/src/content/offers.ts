// R6 Part E · the Control Room contract. The Excel (src/content/catalog.ts) gives the structure: brands, series, models
// and the fixed list of 30 parts, plus the master lists of qualities, colours and manufacturers. What a given part of a
// given model really has (which quality, colour, manufacturer, part number), how many are in stock and what it costs is
// set per offer in the Control Room. Until it exists, the home page shows SAMPLE offers only (`sample: true`).
export type Offer = {
  id: string;
  model: string; // catalog MODELS id
  part: string; // catalog PARTS id
  quality?: string; // catalog QUALITIES id
  manufacturer?: string; // catalog MANUFACTURERS id
  colour?: string; // catalog COLOURS id
  frame?: 'framed' | 'frameless'; // screens only (the Samsung example in the Excel)
  partNo?: string; // "Replacement part no."
  description?: string; // "Special description"
  stock: number | null; // null = unknown
  price: number | null; // retail, AED; null = ask
  wholesale?: number | null;
  sample: boolean;
};

// Real offers arrive from the Control Room. Empty on purpose: nothing about stock or prices is invented here.
export const OFFERS: Offer[] = [];
