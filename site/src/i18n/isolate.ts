/** Keep numbers with separators left-to-right inside RTL text (Unicode isolates). Tiny, so it loads with the site. */
const NUM_RUN = /[A-Z]{1,4}-\d[\dA-Z-]*|\+?\d[\d,.:]*(?:(?:\s?[–\-\/×:]\s?|\s)\+?\d[\d,.:]*)+/g;
export function isolateNumbers(s: string): string {
  if (!/\d/.test(s)) return s;
  return s.replace(NUM_RUN, (m) => '\u2066' + m + '\u2069');
}
