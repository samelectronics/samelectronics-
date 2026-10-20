/**
 * Sam Electronics company facts: the single source for every real text on the site.
 * Source: docs/Sam_Electronics_Company_Facts.pdf (12 October 2026). Section numbers below refer to it.
 *
 * Every value carries the status the PDF gives it:
 *   CONFIRMED   given by the owner, use as is
 *   TO_CONFIRM  use the value shown, keep it easy to change, list it for the owner before launch
 *   SAMPLE      placeholder data, always marked as sample on the site until real data replaces it
 * To change a text, change it here. `site` (the plain values) is what the page reads, both in the
 * generated components (src/components/**) and, through window.SE_FACTS, in public/se-data.js.
 */

export type Status = 'CONFIRMED' | 'TO_CONFIRM' | 'SAMPLE';
export type Fact<T> = { value: T; status: Status; note?: string };

const confirmed = <T,>(value: T, note?: string): Fact<T> => ({ value, status: 'CONFIRMED', note });
const toConfirm = <T,>(value: T, note: string): Fact<T> => ({ value, status: 'TO_CONFIRM', note });
const sample = <T,>(value: T, note?: string): Fact<T> => ({ value, status: 'SAMPLE', note });

/** Minutes from midnight, Dubai time (GST, UTC+4). */
type Shift = [open: number, close: number];
const hm = (h: number, m = 0) => h * 60 + m;

export const facts = {
  // 1. Identity
  identity: {
    legalName: confirmed('Sam Electronics L.L.C'),
    shortName: confirmed('Sam Electronics'),
    arabicName: confirmed('Sam Lil-Electroniyat', 'Copy the Arabic spelling exactly from the logo file.'),
    formerName: confirmed('Syria Tell', 'Same management.'),
    tradingSince: confirmed(2003),
    slogan: confirmed('Quality · Warranty · Price', 'Always Signal Yellow on the site.'),
    businessCardLine: confirmed('Same management, new name. Your trusted electronics partner since 2003.'),
    teamSize: confirmed('6 to 20 people, including the owner'),
  },

  // 2. History and branches (the site tells it as "versions")
  history: [
    { v: confirmed('v1.0'), years: confirmed('2003–2011'), title: confirmed('Syria Tell opens in Deira'), d: confirmed('Our first shop, same area, opposite side of the road.') },
    { v: confirmed('v2.0'), years: confirmed('2011–2020'), title: confirmed('A bigger, better shop'), d: confirmed('Syria Tell moves to our current location in Al Murar.') },
    { v: confirmed('v3.0'), years: confirmed('2015–2019'), title: confirmed('Market branch'), d: confirmed('A third Syria Tell branch, inside the market.') },
    { v: confirmed('v4.0'), years: confirmed('2020–today'), title: confirmed('Sam Electronics'), d: confirmed('Same management, new name.') },
    {
      v: toConfirm('v5.0', 'The facts give Madrid no version number; v5.0 continues the timeline.'),
      years: confirmed('Coming soon'),
      title: confirmed('Sam Electronics Madrid'),
      d: confirmed('Plaza Mayor district, Spain.'),
    },
  ],
  historyPhotos: toConfirm(null, 'The owner supplies a photo for each version.'),
  madrid: {
    name: confirmed('Madrid · Plaza Mayor'),
    area: confirmed('Plaza Mayor district, Madrid, Spain'),
    opening: toConfirm('Opening date to be announced', 'Never show a date or a percentage until the owner gives one.'),
  },

  // 3. Location and contact
  contact: {
    address: confirmed('Al Murar, Deira, Dubai, UAE'),
    plusCode: confirmed('78G4+3H2'),
    storePhone: confirmed('+971 4 273 3031'),
    storeTel: confirmed('+97142733031'),
    storePhoneAlt: toConfirm('+971 4 266 0958', 'Also given by the owner: which store number is current?'),
    mobile: confirmed('+971 50 342 0015'),
    whatsapp: confirmed('971503420015'),
    email: confirmed('samelectronics.uae@gmail.com'),
    social: confirmed('@samelectronics.uae', 'Instagram, TikTok and Facebook.'),
    googleReviewLink: toConfirm(null, 'The exact Google review link is needed.'),
    domain: toConfirm(null, 'Not chosen yet.'),
  },

  // 4. Opening hours (Dubai time). 0 = Sunday.
  hours: confirmed<Record<number, Shift[]>>(
    {
      0: [],
      1: [[hm(10, 30), hm(14)], [hm(16), hm(22)]],
      2: [[hm(10, 30), hm(14)], [hm(16), hm(22)]],
      3: [[hm(10, 30), hm(14)], [hm(16), hm(22)]],
      4: [[hm(10, 30), hm(14)], [hm(16), hm(22)]],
      5: [[hm(10, 30), hm(12)], [hm(16), hm(22)]],
      6: [[hm(10, 30), hm(14)], [hm(16), hm(22)]],
    },
    'Closing soon = within 30 minutes of closing.',
  ),
  holidayHours: toConfirm([] as { date: string; shifts: Shift[] }[], 'Ramadan and public holiday hours, editable from the Control Room.'),

  // 5. What we sell
  categories: confirmed(['Screens', 'Batteries', 'Flex cables', 'Back covers', 'Frames & housings', 'Cameras', 'Small parts', 'Tools']),
  logicBoardsSold: toConfirm(null, 'The teardown shows a Logic board layer; is it sold as a product?'),
  // R6 Part E: Quality and Manufacturer are the Excel's two master lists (src/content/catalog.ts); High Copy is gone.
  grades: confirmed([
    { name: 'Quality', meaning: 'Original · Compatible · Standard · AAA · AA · OLED Soft · OLED Big · OLED Small · Incell · Other' },
    { name: 'Manufacturer', meaning: 'Service Pack · OEM · Refurbished · OLED · GX · ZY · YK · Taiwan · Other' },
  ]),
  gradeAvailability: toConfirm(null, 'Which grades exist for each brand and part, and the warranty for each grade.'),
  // R6 Part E: the owner's 15 brands in 4 groups (src/content/brands.ts); only the display order is still to confirm
  brandsConfirmed: confirmed(['Apple', 'Samsung', 'Xiaomi', 'Redmi', 'POCO', 'Huawei', 'Honor', 'Oppo', 'Realme', 'OnePlus', 'Vivo', 'Infinix', 'Tecno', 'Google', 'Nokia']),
  brandsToConfirm: toConfirm(['Apple · Samsung · Xiaomi Group · Huawei · Honor · BBK / OPlus Group · Transsion Group · Google · Nokia'], 'Display order (reviewer proposal).'),
  services: {
    screenReplacement: confirmed('Screen (LCD/OLED) replacement'),
    batteryRepair: confirmed('Battery repair and replacement'),
    boardRepair: confirmed('Circuit board fault repair'),
    portAndCameraRepair: toConfirm('Charging port and camera repairs', 'Offered?'),
    sameDayRepairs: toConfirm('Same-day repairs', 'Possible?'),
    wholesale: confirmed('Wholesale and bulk orders with full support for large orders'),
    shipping: confirmed('Worldwide shipping: fast, tracked, securely packed'),
  },

  // 6. Customers and markets
  customerTypes: confirmed(['Retail customer', 'Repair shop', 'Trader & exporter', 'Bulk buyer']),
  regions: confirmed([
    { id: 'me', name: 'Middle East' },
    { id: 'af', name: 'Africa' },
    { id: 'eu', name: 'Europe' },
    { id: 'as', name: 'Asia' },
  ]),
  /** Countries on the website map, labelled "Example destinations · owner-provided". `geo` = world-atlas name. */
  mapCountries: confirmed([
    ['UK', 'United Kingdom', 'eu'], ['Spain', 'Spain', 'eu'], ['Romania', 'Romania', 'eu'], ['Türkiye', 'Turkey', 'me'],
    ['Azerbaijan', 'Azerbaijan', 'as'], ['Syria', 'Syria', 'me'], ['Lebanon', 'Lebanon', 'me'], ['Iraq', 'Iraq', 'me'],
    ['Iran', 'Iran', 'me'], ['Tunisia', 'Tunisia', 'af'], ['Algeria', 'Algeria', 'af'], ['Morocco', 'Morocco', 'af'],
    ['Libya', 'Libya', 'af'], ['Egypt', 'Egypt', 'af'], ['Saudi Arabia', 'Saudi Arabia', 'me'], ['Oman', 'Oman', 'me'],
    ['Yemen', 'Yemen', 'me'], ['Sudan', 'Sudan', 'af'], ['Eritrea', 'Eritrea', 'af'], ['Ethiopia', 'Ethiopia', 'af'],
    ['Nigeria', 'Nigeria', 'af'], ['Uganda', 'Uganda', 'af'],
  ] as [name: string, geo: string, region: string][]),
  exampleCountries: confirmed(
    'Russia, Iran, Türkiye, Iraq, Syria, Lebanon, Egypt, Yemen, Saudi Arabia, UAE, Oman, Azerbaijan, Libya, Eritrea, Ethiopia, Morocco, Algeria, Tunisia, Uganda, Nigeria, Sudan, Romania, UK, Spain and more',
  ),
  shippingDetails: toConfirm(null, 'Couriers, delivery times, minimum order, number of countries.'),

  // 7. People
  founder: {
    name: confirmed('Tarek Alchoumari'),
    role: confirmed('Founder & Managing Director'),
    since: confirmed(2003),
  },
  teamMembers: toConfirm(null, 'Names, years with the company and photos: use role monograms until photos arrive.'),
  teamRolesA: toConfirm(['Dispatch Technician', 'Parts Specialist', 'Accounts & Front Desk', 'Repair Engineer', 'Sales Lead', 'Founder & Managing Director'], 'Brief v3 list; merge with version B before launch.'),
  teamRolesB: toConfirm(['T01 Parts Advisor', 'T02 Parts Flow Controller', 'T03 Bench Engineer', 'T04 Finance & Checkout', 'T05 Founder'], 'Home page "Staff Badges" list; merge with version A before launch.'),

  // 8. Named features and fixed lists
  membershipTiers: confirmed(['Connected', 'Charged', 'Supercharged', 'Fully Charged']),
  membershipPerks: toConfirm(null, 'Perks for each Sam Circuit tier.'),
  requestTypes: confirmed(['Order parts', 'Bulk quote', 'Book a repair', 'Trade account', 'Shipping quote', 'General']),
  orderStatus: confirmed(['New', 'Quoted', 'Confirmed', 'Ready', 'Collected / Shipped', 'Closed']),
  shipmentStatus: confirmed(['Packed', 'Dispatched', 'In transit', 'Customs', 'Delivered']),
  tradeTiers: toConfirm([10, 50, 100, 500], 'Minimum order and price tiers.'),

  // 10. Business rules shown as text
  vatIncluded: toConfirm(null, 'UAE VAT 5%: do displayed prices include VAT?'),
  warrantyPeriods: toConfirm(null, 'Warranty period for each grade and for repairs.'),

  // 11. Sample data used in the designs
  serviceStats: sample(
    { repairs: 'Same day', tradeMin: 10, countries: 24 },
    'Same-day repairs, minimum trade units and countries shipped to are marked * on the site until the owner confirms them.',
  ),
  familySample: sample(
    [
      { family: 'Screens', stock: 2211, brands: 15, from: 70 },
      { family: 'Frames', stock: 464, brands: 15, from: 60 },
      { family: 'Flex cables', stock: 1629, brands: 15, from: 25 },
      { family: 'Logic boards', stock: 461, brands: 15, from: 25 },
      { family: 'Batteries', stock: 1760, brands: 15, from: 35 },
      { family: 'Cameras', stock: 566, brands: 11, from: 130 },
      { family: 'Small parts', stock: 377, brands: 15, from: 25 },
      { family: 'Back glass / back covers', stock: 1698, brands: 15, from: 30 },
    ],
    'Reference values from the approved designs. The page computes stock from the sample catalogue in public/se-data.js.',
  ),
} as const;

const v = <T,>(f: Fact<T>) => f.value;
const now = new Date();

/** Plain values the page renders. */
export const site = {
  name: v(facts.identity.shortName),
  legalName: v(facts.identity.legalName),
  formerName: v(facts.identity.formerName),
  since: v(facts.identity.tradingSince),
  slogan: v(facts.identity.slogan),
  contact: {
    address: v(facts.contact.address),
    plusCode: v(facts.contact.plusCode),
    storePhone: v(facts.contact.storePhone),
    storeTel: v(facts.contact.storeTel),
    mobile: v(facts.contact.mobile),
    whatsapp: v(facts.contact.whatsapp),
    email: v(facts.contact.email),
    social: v(facts.contact.social),
    /** Google Maps query for the shop (Plus Code + city), URL-encoded. */
    mapsQuery: encodeURIComponent(v(facts.contact.plusCode) + ' Dubai'),
  },
  madrid: {
    name: v(facts.madrid.name),
    area: v(facts.madrid.area),
    opening: v(facts.madrid.opening),
    openingCaps: v(facts.madrid.opening).toUpperCase(),
  },
  founder: {
    name: v(facts.founder.name),
    role: v(facts.founder.role),
    since: v(facts.founder.since),
    years: now.getFullYear() - v(facts.founder.since),
  },
};

/** What public/se-data.js reads (window.SE_FACTS) for its contact, hours, story and list data. */
export function windowFacts() {
  return {
    contact: {
      address: site.contact.address,
      plus: site.contact.plusCode,
      phone: site.contact.storePhone,
      tel: site.contact.storeTel,
      mobile: site.contact.mobile,
      wa: site.contact.whatsapp,
      email: site.contact.email,
      social: site.contact.social,
    },
    hours: { ...v(facts.hours), exceptions: v(facts.holidayHours) },
    history: facts.history.map((h) => ({ v: v(h.v), years: v(h.years), title: v(h.title), d: v(h.d) })),
    madrid: site.madrid,
    founder: site.founder,
    teamRoles: v(facts.teamRolesA),
    customerTypes: v(facts.customerTypes),
    tiers: v(facts.membershipTiers),
    requestTypes: v(facts.requestTypes),
    orderStatus: v(facts.orderStatus),
    regions: v(facts.regions),
    countries: v(facts.mapCountries).map(([name, geo, region]) => ({ name, geo, region })),
    serviceStats: { ...v(facts.serviceStats), sample: true },
  };
}

/** Every TO_CONFIRM item, for the owner's pre-launch list. */
export function openQuestions(): { path: string; value: unknown; note?: string }[] {
  const out: { path: string; value: unknown; note?: string }[] = [];
  const walk = (o: unknown, p: string) => {
    if (!o || typeof o !== 'object') return;
    if ('status' in o && 'value' in o) {
      const f = o as Fact<unknown>;
      if (f.status === 'TO_CONFIRM') out.push({ path: p, value: f.value, note: f.note });
      return;
    }
    for (const [k, x] of Object.entries(o)) walk(x, p ? p + '.' + k : k);
  };
  walk(facts, '');
  return out;
}
