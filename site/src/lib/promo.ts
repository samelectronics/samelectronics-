// R9 · the pop-up and the seasonal event, set in the Control Room (Ads, pop-ups & events). Shared by the site and the editor.
export type Popup = { on: boolean; id: string; title: string; text: string; cta: string; href: string; img: string; delay: number; pages: 'all' | 'home' | 'shop'; from: string; to: string };
export type EventCfg = { on: boolean; id: string; msg: string; from: string; to: string };
export const POPUP_DEFAULT: Popup = { on: false, id: 'p1', title: 'Battery week', text: 'Genuine cells, tested before they ship. Up to 15% off this week.', cta: 'Shop batteries', href: '/shop?cat=BAT', img: '/assets/pose/part-bat-480.webp', delay: 8, pages: 'all', from: '', to: '' };
export const EVENT_DEFAULT: EventCfg = { on: false, id: 'ramadan', msg: '', from: '', to: '' };
/** presets: icon (svg path), colours and a default message */
export const EVENTS: Record<string, { name: string; icon: string; bg: string; ink: string; msg: string }> = {
  ramadan: { name: 'Ramadan', icon: 'M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z', bg: 'linear-gradient(90deg,#1B2340,#2B3566)', ink: '#F7C032', msg: 'Ramadan Kareem · our Ramadan hours are on the Contact page' },
  'eid-fitr': { name: 'Eid al-Fitr', icon: 'M12 2l2.4 6.9H22l-6 4.4 2.3 7L12 16l-6.3 4.3 2.3-7-6-4.4h7.6z', bg: 'linear-gradient(90deg,#0E5E4A,#138A6A)', ink: '#FFE9A8', msg: 'Eid Mubarak from all of us at Sam Electronics' },
  'eid-adha': { name: 'Eid al-Adha', icon: 'M12 2l2.4 6.9H22l-6 4.4 2.3 7L12 16l-6.3 4.3 2.3-7-6-4.4h7.6z', bg: 'linear-gradient(90deg,#3A2A12,#6B4E1F)', ink: '#F7C032', msg: 'Eid al-Adha Mubarak · check our holiday hours' },
  national: { name: 'UAE National Day', icon: 'M4 21V4M4 4h14l-3 4 3 4H4', bg: 'linear-gradient(90deg,#C8102E 0 10px,transparent 10px),linear-gradient(180deg,#00732F 0 33%,#FFFFFF 33% 66%,#000 66%) 0 0/34px 100% no-repeat,#26282B', ink: '#FFFFFF', msg: 'Happy UAE National Day' },
  diwali: { name: 'Diwali', icon: 'M12 3c2 3 3 5 0 8-3-3-2-5 0-8zM6 14h12l-2 6H8z', bg: 'linear-gradient(90deg,#4A1460,#7A2A8C)', ink: '#FFC94A', msg: 'Happy Diwali · festival offers in the shop' },
  christmas: { name: 'Christmas', icon: 'M12 2l5 7h-3l4 6h-4l3 5H7l3-5H6l4-6H7z', bg: 'linear-gradient(90deg,#7A1219,#A91D26)', ink: '#FFFFFF', msg: 'Merry Christmas and happy holidays' },
  newyear: { name: 'New Year', icon: 'M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8', bg: 'linear-gradient(90deg,#26282B,#3D3E3F)', ink: '#F7C032', msg: 'Happy New Year from Sam Electronics' },
  cny: { name: 'Chinese New Year', icon: 'M6 3h12v4H6zM8 7v14M16 7v14M6 12h12', bg: 'linear-gradient(90deg,#9E1B1B,#C8262B)', ink: '#FFD466', msg: 'Happy Lunar New Year' },
  whitefriday: { name: 'White Friday', icon: 'M20 12 12 20 4 12V4h8zM8 8h.01', bg: 'linear-gradient(90deg,#F2F3F4,#FFFFFF)', ink: '#26282B', msg: 'White Friday deals are live in the shop' },
  school: { name: 'Back to school', icon: 'M2 8l10-5 10 5-10 5zM6 10v5c3 2 9 2 12 0v-5', bg: 'linear-gradient(90deg,#F7C032,#FFD566)', ink: '#26282B', msg: 'Back to school: tablet and phone repairs while you wait' },
};
export const active = (from: string, to: string) => { const n = Date.now(); return (!from || n >= Date.parse(from)) && (!to || n <= Date.parse(to) + 864e5); };
