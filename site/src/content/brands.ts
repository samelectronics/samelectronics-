// R6 Part E2 · the owner's 15 brands in his 4 groups. One config for every brand strip, picker and count on the site.
// Display order = the reviewer's proposal (most-demanded first, groups kept together): to be confirmed by the owner.
// `models` comes from src/content/catalog.ts (the Excel); Vivo, Infinix and Tecno have none yet ("Models coming soon").
export type BrandGroup = { id: string; name: string };
export type Brand = { id: string; name: string; group: string; code: string };

export const BRAND_GROUPS: BrandGroup[] = [
  { id: 'standalone', name: 'Standalone' },
  { id: 'xiaomi-group', name: 'Xiaomi Group' },
  { id: 'bbk', name: 'BBK / OPlus Group' },
  { id: 'transsion', name: 'Transsion Group' },
];

export const BRANDS: Brand[] = [
  { id: 'apple', name: 'Apple', group: 'standalone', code: 'AP' },
  { id: 'samsung', name: 'Samsung', group: 'standalone', code: 'SA' },
  { id: 'xiaomi', name: 'Xiaomi', group: 'xiaomi-group', code: 'XI' },
  { id: 'redmi', name: 'Redmi', group: 'xiaomi-group', code: 'RM' },
  { id: 'poco', name: 'POCO', group: 'xiaomi-group', code: 'PC' },
  { id: 'huawei', name: 'Huawei', group: 'standalone', code: 'HW' },
  { id: 'honor', name: 'Honor', group: 'standalone', code: 'HN' },
  { id: 'oppo', name: 'Oppo', group: 'bbk', code: 'OP' },
  { id: 'realme', name: 'Realme', group: 'bbk', code: 'RL' },
  { id: 'oneplus', name: 'OnePlus', group: 'bbk', code: 'O+' },
  { id: 'vivo', name: 'Vivo', group: 'bbk', code: 'VV' },
  { id: 'infinix', name: 'Infinix', group: 'transsion', code: 'IX' },
  { id: 'tecno', name: 'Tecno', group: 'transsion', code: 'TC' },
  { id: 'google', name: 'Google', group: 'standalone', code: 'GO' },
  { id: 'nokia', name: 'Nokia', group: 'standalone', code: 'NK' },
];

export const BRAND_COUNT = BRANDS.length; // every "N brands" on the site reads this (15)
export const groupOf = (id: string) => BRAND_GROUPS.find((g) => g.id === BRANDS.find((b) => b.id === id)?.group);
