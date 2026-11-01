// R9 · branded dropdowns everywhere (no grey browser lists). Every <select> keeps its place and its React onChange; with a
// mouse, clicking it opens our own list (search when it is long, keyboard arrows, groups), and picking sets the value and
// fires the normal change event. On touch screens the phone's own picker stays (it is the better one there).
// Opt out with data-native. Styles in src/styles/dc-base.css (.bsel-*).
let pop: HTMLDivElement | null = null, cur: HTMLSelectElement | null = null;
const close = () => { pop?.remove(); pop = null; cur?.classList.remove('bsel-open'); cur = null; };
function pick(s: HTMLSelectElement, v: string) {
  const set = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')!.set!; set.call(s, v);
  s.dispatchEvent(new Event('change', { bubbles: true })); s.dispatchEvent(new Event('input', { bubbles: true })); close(); s.focus();
}
function open(s: HTMLSelectElement) {
  close(); cur = s; s.classList.add('bsel-open');
  const r = s.getBoundingClientRect(), opts = Array.from(s.options), long = opts.length > 9;
  const p = document.createElement('div'); p.className = 'bsel-pop'; p.setAttribute('role', 'listbox');
  const below = innerHeight - r.bottom > 280 || r.top < 300;
  Object.assign(p.style, { left: Math.max(8, Math.min(r.left, innerWidth - Math.max(r.width, 220) - 8)) + 'px', minWidth: Math.max(r.width, 200) + 'px', [below ? 'top' : 'bottom']: (below ? r.bottom + 6 : innerHeight - r.top + 6) + 'px' });
  if (s.closest('[dir="rtl"]') || document.documentElement.dir === 'rtl') p.dir = 'rtl';
  let q: HTMLInputElement | null = null;
  if (long) { q = document.createElement('input'); q.className = 'bsel-q'; q.placeholder = (window as unknown as { seI18n?: { t: (s: string) => string } }).seI18n?.t('Search') || 'Search'; p.appendChild(q); }
  const list = document.createElement('div'); list.className = 'bsel-list'; p.appendChild(list);
  let hi = Math.max(0, s.selectedIndex);
  const draw = () => {
    list.textContent = ''; const f = (q?.value || '').toLowerCase(); let lastGroup: Element | null = null; let k = 0;
    opts.forEach((o, i) => {
      if (f && !o.text.toLowerCase().includes(f)) return;
      const g = o.parentElement && o.parentElement.tagName === 'OPTGROUP' ? o.parentElement : null;
      if (g && g !== lastGroup) { const h = document.createElement('div'); h.className = 'bsel-g'; h.textContent = (g as HTMLOptGroupElement).label; list.appendChild(h); } lastGroup = g;
      const b = document.createElement('button'); b.type = 'button'; b.className = 'bsel-o' + (i === s.selectedIndex ? ' on' : '') + (i === hi ? ' hi' : ''); b.textContent = o.text; b.disabled = o.disabled; b.dataset.i = String(i); b.setAttribute('role', 'option');
      b.onclick = () => pick(s, o.value); b.onmouseenter = () => { hi = i; list.querySelectorAll('.hi').forEach((x) => x.classList.remove('hi')); b.classList.add('hi'); };
      list.appendChild(b); k++;
    });
    if (!k) { const n = document.createElement('div'); n.className = 'bsel-none'; n.textContent = '—'; list.appendChild(n); }
    (list.querySelector('.hi') || list.querySelector('.on'))?.scrollIntoView({ block: 'nearest' });
  };
  draw(); document.body.appendChild(p); pop = p; if (q) { q.oninput = () => { hi = -1; draw(); }; q.focus(); }
  p.onkeydown = (e) => {
    const vis = Array.from(list.querySelectorAll<HTMLButtonElement>('.bsel-o:not(:disabled)')); const at = vis.findIndex((b) => +b.dataset.i! === hi);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); const n = vis[Math.max(0, Math.min(vis.length - 1, at + (e.key === 'ArrowDown' ? 1 : -1)))]; if (n) { hi = +n.dataset.i!; vis.forEach((b) => b.classList.toggle('hi', b === n)); n.scrollIntoView({ block: 'nearest' }); } }
    else if (e.key === 'Enter') { e.preventDefault(); const b = vis[at] || vis[0]; if (b) b.click(); }
    else if (e.key === 'Escape' || e.key === 'Tab') { e.preventDefault(); close(); s.focus(); }
  };
  if (!q) { p.tabIndex = -1; p.focus(); }
}
let done = false;
export function installBrandSelects() {
  if (done || typeof window === 'undefined') return; done = true;
  const fine = () => window.matchMedia('(pointer: fine)').matches;
  const ok = (t: EventTarget | null) => { const s = t instanceof HTMLSelectElement ? t : null; return s && !s.disabled && !s.multiple && !s.hasAttribute('data-native') && fine() ? s : null; };
  document.addEventListener('mousedown', (e) => { const s = ok(e.target); if (!s) { if (pop && !pop.contains(e.target as Node)) close(); return; } e.preventDefault(); if (cur === s) close(); else { s.focus(); open(s); } }, true);
  document.addEventListener('keydown', (e) => { const s = ok(e.target); if (s && !pop && (e.key === ' ' || e.key === 'Enter' || ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && e.altKey))) { e.preventDefault(); open(s); } }, true);
  window.addEventListener('resize', close); window.addEventListener('scroll', (e) => { if (pop && !pop.contains(e.target as Node)) close(); }, true);
}
