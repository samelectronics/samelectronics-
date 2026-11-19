// Owner (18 Nov): "translate the part words in product names, keep the model name as it is". The longest known part
// phrase in a title is swapped for its translation ("iPhone 13 Screen" → "iPhone 13 شاشة"); everything else (model,
// codes, brackets) stays exactly as written. Used by ptitle() and by the page translator for [data-i18n-part] names.
export const PART_WORDS = ['Back cover with chassis', 'Full Display Screen', 'Charging connector Flex', 'Charging flex mix', 'Incell screens', 'Charging board', 'Charging flex', 'Charging port',
  'Power flex', 'Volume flex', 'Rear camera', 'Front camera', 'Camera lens', 'Back covers', 'Back cover', 'Back glass', 'SIM tray', 'Loudspeaker', 'Earpiece', 'Vibrator', 'Speaker', 'Housing',
  'Batteries', 'Battery', 'Screens', 'Screen', 'Display', 'Camera', 'Frame', 'Flex', 'Tool'];
const PART_RX = new RegExp('(^|\\s)(' + PART_WORDS.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')(?=\\s|$|[),.])', 'i');
export function swapPart(title: string, tr: (s: string) => string): string {
  const m = title.match(PART_RX); if (!m) return title;
  const key = PART_WORDS.find((w) => w.toLowerCase() === m[2].toLowerCase()) || m[2];
  const out = tr(key); if (!out || out === key) return title;
  return title.slice(0, (m.index || 0) + m[1].length) + out + title.slice((m.index || 0) + m[0].length);
}
