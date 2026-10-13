#!/usr/bin/env node
/**
 * ARCHIVED (13 Oct 2026). This one-time converter produced the first version of src/components/ from
 * design/project on 12 Oct. The components are now maintained by hand (Round 4, 13 Oct), so running it
 * again would overwrite that work. Kept for reference only.
 *
 * Converts the Claude Design prototypes in design/project/*.dc.html into React components.
 *
 *   node scripts/dc-codegen.mjs           regenerate everything
 *   node scripts/dc-codegen.mjs --check   fail if public/ engine copies differ from design/project
 *
 * For every component listed in COMPONENTS it writes
 *   src/components/dc/<Name>.tsx        the template as JSX (exact DOM, styles and bindings)
 *   src/components/dc/<Name>.logic.js   the prototype's logic class, unchanged except for
 *                                       `export default` and webpackIgnore on runtime imports
 * Home v3's template is split so each page section is its own component in
 * src/components/home/sections/. Helmet <style> blocks and style-hover rules go to
 * src/styles/dc.generated.css; helmet scripts and font links to src/dc/head.generated.ts.
 * The three.js / parts-library / globe / ad engines and assets are copied byte-for-byte
 * into public/ (the code loads them by relative URL at runtime).
 *
 * Template semantics follow design/project/support.js (the design tool's runtime).
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { parseDocument } from 'htmlparser2';
import * as prettier from 'prettier';

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DESIGN = path.resolve(SITE, '../design/project');
const OUT_DC = path.join(SITE, 'src/components/dc');
const OUT_SECTIONS = path.join(SITE, 'src/components/home/sections');
const ROOT = 'Sam Electronics Home v3';

/** Every .dc.html Home v3 renders (root first; helmet CSS is emitted in this order). */
const COMPONENTS = [
  ROOT,
  'SE FMP Menu',
  'SE Brand Logo',
  'SE Part',
  'SE Teardown',
  'SE What We Offer',
  'SE Live Board',
  'SE Bench Test',
  'SE Home Models',
  'SE Home Deals',
  'SE Repair Sequence',
  'SE Wholesale Truck',
  'SE Home Samsoom',
  'SE Samsoom',
  'SE Finale',
  'SE Launcher',
];

/**
 * Company facts (src/content/facts.ts) replace these literals from the design, so contact details, names
 * and dates are changed in one place. Template literals become {{ $facts.… }} bindings (rendered as plain
 * text); logic literals become reads from `SITE`. Every rule must match, so a design change is noticed.
 */
const FACT_TEMPLATE_RULES = [
  ['samelectronics.uae@gmail.com', '{{ $facts.contact.email }}'],
  ['+971 4 273 3031', '{{ $facts.contact.storePhone }}'],
  ['+97142733031', '{{ $facts.contact.storeTel }}'],
  ['+971 50 342 0015', '{{ $facts.contact.mobile }}'],
  ['Al Murar, Deira, Dubai, UAE', '{{ $facts.contact.address }}'],
  ['78G4%2B3H2%20Dubai', '{{ $facts.contact.mapsQuery }}'],
  ['78G4+3H2', '{{ $facts.contact.plusCode }}'],
  ['Tarek Alchoumari', '{{ $facts.founder.name }}'],
  ['23 years with us', '{{ $facts.founder.years }} years with us'],
  ['Madrid · Plaza Mayor', '{{ $facts.madrid.name }}'],
  ['Opening date to be announced', '{{ $facts.madrid.opening }}'],
  ['OPENING DATE TO BE ANNOUNCED', '{{ $facts.madrid.openingCaps }}'],
  ['Formerly Syria Tell', 'Formerly {{ $facts.formerName }}'],
  ['© 2026 Sam Electronics L.L.C', '© 2026 {{ $facts.legalName }}'],
];
const FACT_LOGIC_RULES = [
  ["encodeURIComponent('78G4+3H2 Dubai')", "encodeURIComponent(SITE.contact.plusCode + ' Dubai')"],
  ["'mailto:samelectronics.uae@gmail.com?subject='", "'mailto:' + SITE.contact.email + '?subject='"],
  ["'https://wa.me/971503420015'", "'https://wa.me/' + SITE.contact.whatsapp"],
];
const factHits = new Map();

function applyFactRules(text, rules, file) {
  for (const [from, to] of rules) {
    const n = text.split(from).length - 1;
    if (n) {
      text = text.split(from).join(to);
      factHits.set(from, (factHits.get(from) || 0) + n);
    }
  }
  return text;
}

/** Runtime files copied unchanged into public/ (paths relative to design/project). */
const PUBLIC_FILES = [
  'se-globe-data.js',
  'se-parts-lib.js',
  'se-teardown-3d.js',
  'se-td-ad.js',
  'se-3d.js',
  'image-slot.js',
  'assets/se-logo.png',
];

/** public/ files that started as design copies and are now maintained in site/ (not overwritten). */
const SITE_OWNED = [
  'se-data.js', // reads company facts (window.SE_FACTS)
  'SE World Map.html', // label pass referenced an out-of-scope `grp` and threw; uses `rg`
];

/**
 * How Home v3's template is split into section components: a matcher on an element
 * (and its parent sc-if condition, for overlays) → component name.
 */
const SECTIONS = [
  { name: 'BootIntro', ifValue: '{{ bootOn }}' },
  { name: 'Nav', tag: 'header' },
  { name: 'Hero', id: 'top' },
  { name: 'RepairLab', id: 'repair' },
  { name: 'Wholesale', id: 'wholesale' },
  { name: 'Worldwide', id: 'network' },
  { name: 'Story', id: 'story' },
  { name: 'Team', id: 'team' },
  { name: 'OpenToEveryone', id: 'everyone' },
  { name: 'SamCircuit', id: 'circuit' },
  { name: 'Social', id: 'social' },
  { name: 'RequestVisit', id: 'visit' },
  { name: 'Footer', tag: 'footer' },
  { name: 'FindMyPartPanel', ifValue: '{{ fmp.open }}' },
  { name: 'SystemMapDrawer', ifValue: '{{ drawer.map }}' },
  { name: 'CartDrawer', ifValue: '{{ drawer.cart }}' },
  { name: 'SamsoomChat', ifValue: '{{ chat.open }}' },
  { name: 'Toast', ifValue: '{{ hasToast }}' },
];

// ───────────────────────────── names ─────────────────────────────

const compName = (dcName) => (dcName === ROOT ? 'HomeV3' : dcName.replace(/[^A-Za-z0-9]+/g, ''));

// ───────────────────────────── expressions (mirror support.js resolve) ─────────────────────────────

const IDENT_RE = /^[A-Za-z_$][A-Za-z0-9_$]*/;
const NUMBER_RE = /^-?\d+(\.\d+)?$/;
const warnings = [];

function parensWrapWhole(expr) {
  let depth = 0;
  for (let i = 0; i < expr.length - 1; i++) {
    if (expr[i] === '(') depth++;
    else if (expr[i] === ')') {
      depth--;
      if (depth === 0) return false;
    }
  }
  return true;
}

function findTopLevelEquality(expr) {
  let depth = 0;
  for (let i = 0; i < expr.length; i++) {
    const c = expr[i];
    if (c === '[' || c === '(') depth++;
    else if (c === ']' || c === ')') depth--;
    else if (depth === 0 && (c === '=' || c === '!') && expr[i + 1] === '=') {
      if (i > 0 && (expr[i - 1] === '=' || expr[i - 1] === '!')) continue;
      if (!expr.slice(0, i).trim()) continue;
      const op = expr[i + 2] === '=' ? c + '==' : c + '=';
      return { index: i, op };
    }
  }
  return null;
}

/** Compile one {{ }} expression into JS reading from the scope object `v`. */
function compileExpr(src, ctx) {
  const expr = String(src).trim();
  if (!expr) return 'undefined';
  if (expr[0] === '(' && expr[expr.length - 1] === ')' && parensWrapWhole(expr)) return compileExpr(expr.slice(1, -1), ctx);
  const eq = findTopLevelEquality(expr);
  if (eq) return `(${compileExpr(expr.slice(0, eq.index), ctx)} ${eq.op} ${compileExpr(expr.slice(eq.index + eq.op.length), ctx)})`;
  if (expr[0] === '!') return `!${compileExpr(expr.slice(1), ctx)}`;
  if (expr === 'true' || expr === 'false' || expr === 'null' || expr === 'undefined') return expr;
  if (NUMBER_RE.test(expr)) return String(Number(expr));
  if (expr.length >= 2 && (expr[0] === '"' || expr[0] === "'") && expr[expr.length - 1] === expr[0]) return JSON.stringify(expr.slice(1, -1));
  return compilePath(expr, ctx);
}

function compilePath(expr, ctx) {
  const head = expr.match(IDENT_RE);
  if (!head) return unresolved(expr, ctx);
  let code = `v[${JSON.stringify(head[0])}]`;
  if (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(head[0])) code = `v.${head[0]}`;
  let i = head[0].length;
  while (i < expr.length) {
    if (expr[i] === '.') {
      const m = expr.slice(i + 1).match(IDENT_RE) || expr.slice(i + 1).match(/^\d+/);
      if (!m) return unresolved(expr, ctx);
      code += /^\d/.test(m[0]) ? `?.[${m[0]}]` : `?.${m[0]}`;
      i += 1 + m[0].length;
    } else if (expr[i] === '[') {
      let depth = 1;
      let j = i + 1;
      while (j < expr.length && depth > 0) {
        if (expr[j] === '[') depth++;
        else if (expr[j] === ']') {
          depth--;
          if (depth === 0) break;
        }
        j++;
      }
      if (depth !== 0) return unresolved(expr, ctx);
      code += `?.[${compileExpr(expr.slice(i + 1, j), ctx)}]`;
      i = j + 1;
    } else {
      return unresolved(expr, ctx);
    }
  }
  return code;
}

function unresolved(expr, ctx) {
  warnings.push(`${ctx.file}: "{{ ${expr} }}" is not a path the runtime can resolve; it renders as undefined (same as the prototype)`);
  return 'undefined';
}

const WHOLE_RE = /^\s*\{\{([\s\S]+?)\}\}\s*$/;
const PARTS_RE = /\{\{([\s\S]+?)\}\}/g;

/** Attribute value → { code, dynamic } (mirrors compileAttr). */
function compileAttr(raw, ctx) {
  const whole = raw.match(WHOLE_RE);
  if (whole) return { code: compileExpr(whole[1], ctx), dynamic: true, whole: true };
  if (raw.includes('{{')) {
    ctx.use('s');
    const parts = raw.split(PARTS_RE);
    const tpl = parts.map((p, i) => (i & 1 ? '${s(' + compileExpr(p, ctx) + ')}' : p.replace(/[`\\$]/g, (c) => '\\' + c))).join('');
    return { code: '`' + tpl + '`', dynamic: true, whole: false };
  }
  return { code: JSON.stringify(raw), dynamic: false, value: raw };
}

// ───────────────────────────── DOM attribute naming ─────────────────────────────

const EVENT_MAP = {
  onclick: 'onClick', onchange: 'onChange', oninput: 'onInput', onsubmit: 'onSubmit', onkeydown: 'onKeyDown', onkeyup: 'onKeyUp',
  onkeypress: 'onKeyPress', onmousedown: 'onMouseDown', onmouseup: 'onMouseUp', onmouseenter: 'onMouseEnter', onmouseleave: 'onMouseLeave',
  onfocus: 'onFocus', onblur: 'onBlur', ondoubleclick: 'onDoubleClick', oncontextmenu: 'onContextMenu', onmousemove: 'onMouseMove',
  onmouseover: 'onMouseOver', onmouseout: 'onMouseOut', onpointerdown: 'onPointerDown', onpointerup: 'onPointerUp', onpointermove: 'onPointerMove',
  onpointerenter: 'onPointerEnter', onpointerleave: 'onPointerLeave', onpointercancel: 'onPointerCancel', onpointerover: 'onPointerOver',
  onpointerout: 'onPointerOut', ongotpointercapture: 'onGotPointerCapture', onlostpointercapture: 'onLostPointerCapture',
  ontouchstart: 'onTouchStart', ontouchend: 'onTouchEnd', ontouchmove: 'onTouchMove', ontouchcancel: 'onTouchCancel',
  ondragstart: 'onDragStart', ondragend: 'onDragEnd', ondragenter: 'onDragEnter', ondragleave: 'onDragLeave', ondragover: 'onDragOver',
  onanimationstart: 'onAnimationStart', onanimationend: 'onAnimationEnd', onanimationiteration: 'onAnimationIteration', ontransitionend: 'onTransitionEnd',
};

/** HTML attribute names React spells differently (React maps them back to the same DOM attribute). */
const REACT_ATTR = {
  class: 'className', for: 'htmlFor', tabindex: 'tabIndex', readonly: 'readOnly', maxlength: 'maxLength', minlength: 'minLength',
  autocomplete: 'autoComplete', autofocus: 'autoFocus', autoplay: 'autoPlay', colspan: 'colSpan', rowspan: 'rowSpan', crossorigin: 'crossOrigin',
  referrerpolicy: 'referrerPolicy', allowfullscreen: 'allowFullScreen', frameborder: 'frameBorder', playsinline: 'playsInline',
  spellcheck: 'spellCheck', enterkeyhint: 'enterKeyHint', inputmode: 'inputMode', contenteditable: 'contentEditable', srcset: 'srcSet',
  'xlink:href': 'xlinkHref', 'xml:space': 'xmlSpace', 'accept-charset': 'acceptCharset', 'http-equiv': 'httpEquiv',
};

/** SVG tag names the HTML parser restores to camelCase. */
const SVG_TAGS = Object.fromEntries(
  ['clipPath', 'linearGradient', 'radialGradient', 'foreignObject', 'textPath', 'feGaussianBlur', 'feOffset', 'feBlend', 'feColorMatrix',
    'feComposite', 'feFlood', 'feMerge', 'feMergeNode', 'feMorphology', 'feTurbulence', 'feDisplacementMap', 'feDropShadow',
    'feComponentTransfer', 'feFuncA', 'feFuncR', 'feFuncG', 'feFuncB', 'feImage', 'feTile', 'feSpecularLighting', 'feDiffuseLighting',
    'fePointLight', 'feDistantLight', 'feSpotLight', 'animateMotion', 'animateTransform', 'glyphRef'].map((n) => [n.toLowerCase(), n]),
);

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);

/** Hyphenated SVG presentation attributes → React camelCase (stroke-width → strokeWidth). */
function reactAttrName(name) {
  if (REACT_ATTR[name]) return REACT_ATTR[name];
  if (name.startsWith('aria-') || name.startsWith('data-')) return name;
  if (/^[a-z]+(-[a-z]+)+$/.test(name)) return name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  return name;
}

// ───────────────────────────── style-hover etc. (mirror pseudo.ts) ─────────────────────────────

const pseudoRules = new Map(); // key → { cls, rule }

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, ' ');
}
function importantify(css) {
  css = stripComments(css);
  const decls = [];
  let start = 0, depth = 0, quote = '';
  for (let i = 0; i < css.length; i++) {
    const c = css[i];
    if (quote) {
      if (c === '\\') i++;
      else if (c === quote) quote = '';
    } else if (c === "'" || c === '"') quote = c;
    else if (c === '(') depth++;
    else if (c === ')') depth = Math.max(0, depth - 1);
    else if (c === ';' && depth === 0) {
      decls.push(css.slice(start, i));
      start = i + 1;
    }
  }
  decls.push(css.slice(start));
  return decls.map((d) => d.trim()).filter(Boolean).map((d) => (/!\s*important$/i.test(d) ? d : d + ' !important')).join(';');
}
function pseudoClass(pseudo, css, ctx) {
  if (css.includes('{{')) throw new Error(`${ctx.file}: style-${pseudo} with bindings is not supported`);
  const key = pseudo + '|' + css;
  let hit = pseudoRules.get(key);
  if (!hit) {
    const cls = 'scp-' + crypto.createHash('sha1').update(key).digest('hex').slice(0, 8);
    const pe = pseudo === 'before' || pseudo === 'after';
    hit = { cls, rule: `.${cls}${pe ? '::' : ':'}${pseudo}{${pe ? css : importantify(css)}}` };
    pseudoRules.set(key, hit);
  }
  return hit.cls;
}

// ───────────────────────────── template → JSX ─────────────────────────────

const jsxText = (txt) => (/[{}<>]/.test(txt) || /^\s|\s$/.test(txt) ? `{${JSON.stringify(txt)}}` : txt);

function cssToObjStatic(css) {
  const o = {};
  for (const decl of css.split(';')) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    const prop = decl.slice(0, i).trim();
    o[prop.startsWith('--') ? prop : prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = decl.slice(i + 1).trim();
  }
  return o;
}

/** Attributes React types as numbers; a static numeric value is emitted as a number (same DOM output). */
const NUMERIC_ATTR = new Set(['tabIndex', 'maxLength', 'minLength', 'rows', 'cols', 'colSpan', 'rowSpan', 'span', 'size']);

function attrJsx(name, { code, dynamic, value }) {
  if (!dynamic && NUMERIC_ATTR.has(name) && /^-?\d+$/.test(value)) return `${name}={${value}}`;
  if (!dynamic && !/["{}\n\\]/.test(value)) return `${name}="${value}"`;
  return `${name}={${code}}`;
}

class Ctx {
  constructor(file) {
    this.file = file;
    this.imports = new Set(); // dc component names used
    this.helpers = new Set();
    this.helmet = { css: [], scripts: [], links: [], title: null };
    this.sections = []; // { name, jsx }
  }
  use(h) {
    this.helpers.add(h);
    return h;
  }
}

function walkChildren(nodes, ctx, sectionMode) {
  return nodes.map((n) => walk(n, ctx, sectionMode)).filter((x) => x != null);
}

function walk(node, ctx, sectionMode) {
  if (node.type === 'text') return walkText(node, ctx);
  if (node.type === 'comment' || node.type === 'directive') return null;
  if (node.type === 'script' || node.type === 'style' || node.type === 'tag') {
    const tag = node.name.toLowerCase();
    if (sectionMode) {
      const sec = matchSection(node);
      if (sec) return emitSection(sec, node, ctx);
    }
    if (tag === 'helmet') return walkHelmet(node, ctx);
    if (tag === 'sc-for') return walkFor(node, ctx, sectionMode);
    if (tag === 'sc-if') return walkIf(node, ctx, sectionMode);
    if (tag === 'dc-import') return walkComponent(node, ctx, sectionMode);
    if (tag === 'x-import') return walkXImport(node, ctx);
    return walkElement(node, ctx, sectionMode);
  }
  return null;
}

function walkText(node, ctx) {
  const txt = node.data ?? '';
  if (!txt.includes('{{')) {
    if (!txt.trim() && !txt.includes(' ')) return null;
    return jsxText(txt);
  }
  const parts = txt.split(PARTS_RE);
  return parts
    .map((p, i) => {
      if (!(i & 1)) return p ? jsxText(p) : '';
      if (p.trim().startsWith('$facts.')) return `{String(${compileExpr(p, ctx)} ?? '')}`; // company facts: plain text
      ctx.use('t');
      return `{t(${compileExpr(p, ctx)})}`;
    })
    .join('');
}

function walkFor(el, ctx, sectionMode) {
  const list = compileAttr(el.attribs.list || '', ctx);
  const as = el.attribs.as || 'item';
  const kids = walkChildren(el.children, ctx, sectionMode).join('');
  // scope per item = { ...v, [as]: item, $index } exactly like the runtime
  return `{(Array.isArray(${list.code}) ? ${list.code} : []).map((__it: any, __i: number) => { const v2 = { ...v, ${JSON.stringify(as)}: __it, $index: __i }; return ((v: Vals) => <React.Fragment key={__i}>${kids}</React.Fragment>)(v2); })}`;
}

function walkIf(el, ctx, sectionMode) {
  const val = compileAttr(el.attribs.value || '', ctx);
  const kids = walkChildren(el.children, ctx, sectionMode).join('');
  return `{${val.code} ? <>${kids}</> : null}`;
}

function walkComponent(el, ctx, sectionMode) {
  const name = el.attribs.name || el.attribs.component || '';
  if (!COMPONENTS.includes(name)) throw new Error(`${ctx.file}: dc-import of unknown component "${name}"`);
  ctx.imports.add(name);
  const props = [];
  for (const [rawKey, value] of Object.entries(el.attribs)) {
    if (['name', 'component', 'sc-name', 'hint-size'].includes(rawKey) || rawKey.startsWith('style-')) continue;
    if (rawKey === 'style') {
      const a = compileAttr(value, ctx);
      ctx.use('hostPositionStyle');
      props.push(`__hostStyle={hostPositionStyle(${a.code})}`);
      continue;
    }
    let key = rawKey.includes('-') ? rawKey.replace(/-([a-z])/g, (_, c) => c.toUpperCase()) : rawKey;
    const a = compileAttr(value, ctx);
    if (key === 'dcProps') props.push(`{...(${a.code} || {})}`);
    else props.push(attrJsx(key, a));
  }
  const kids = walkChildren(el.children, ctx, sectionMode).join('');
  const C = compName(name);
  return kids.trim() ? `<${C} ${props.join(' ')}>${kids}</${C}>` : `<${C} ${props.join(' ')} />`;
}

function walkXImport(el, ctx) {
  const global = el.attribs['component-from-global-scope'];
  if (!global || !global.includes('-') || global.includes('{{')) throw new Error(`${ctx.file}: only custom-element x-imports are supported`);
  const props = [];
  let hostStyle = null;
  for (const [rawKey, value] of Object.entries(el.attribs)) {
    if (['component-from-global-scope', 'component', 'from', 'hint-size', 'sc-name'].includes(rawKey) || rawKey.startsWith('style-')) continue;
    const a = compileAttr(value, ctx);
    if (rawKey === 'style') {
      hostStyle = a.code;
      continue;
    }
    const key = rawKey.includes('-') && !(rawKey.startsWith('aria-') || rawKey.startsWith('data-')) ? rawKey.replace(/-([a-z])/g, (_, c) => c.toUpperCase()) : rawKey;
    props.push(attrJsx(key === 'className' ? 'class' : key, a));
  }
  ctx.use('hostPositionStyle');
  const style = hostStyle ? `hostPositionStyle(${hostStyle}) || { display: 'contents' }` : `{ display: 'contents' }`;
  return `<div className="sc-host-x" style={${style}}><${global} ${props.join(' ')} /></div>`;
}

function walkElement(el, ctx, sectionMode) {
  const lower = el.name.toLowerCase();
  const tag = SVG_TAGS[lower] || lower;
  const props = [];
  const pseudo = [];
  let className = null;
  for (const [rawKey, value] of Object.entries(el.attribs)) {
    if (rawKey === 'sc-name' || rawKey === 'data-dc-tpl') continue;
    if (rawKey.startsWith('style-')) {
      pseudo.push(pseudoClass(rawKey.slice(6), value, ctx));
      continue;
    }
    const a = compileAttr(value, ctx);
    if (rawKey === 'style') {
      if (a.dynamic) props.push(a.whole ? `style={${ctx.use('st')}(${a.code})}` : `style={${ctx.use('cssToObj')}(${a.code})}`);
      else {
        const o = cssToObjStatic(value);
        const cast = Object.keys(o).some((k) => k.startsWith('--')) ? ' as React.CSSProperties' : '';
        props.push(`style={${JSON.stringify(o)}${cast}}`);
      }
      continue;
    }
    let key;
    if (rawKey.startsWith('on')) key = EVENT_MAP[rawKey.toLowerCase()] || 'on' + rawKey[2].toUpperCase() + rawKey.slice(3);
    else key = reactAttrName(rawKey);
    if (key === 'className') {
      className = a;
      continue;
    }
    if (key.startsWith('on') && !a.dynamic) throw new Error(`${ctx.file}: static event handler ${rawKey}="${value}"`);
    if (key === 'value' && a.dynamic) props.push(`value={${ctx.use('val')}(${a.code})}`);
    else if (key === 'checked' && a.dynamic) props.push(`checked={${ctx.use('chk')}(${a.code})}`);
    else props.push(attrJsx(key, a));
  }
  if (pseudo.length) {
    const base = className ? className.code : 'undefined';
    props.push(className && !className.dynamic ? `className="${[className.value, ...pseudo].filter(Boolean).join(' ')}"` : `className={${ctx.use('cx')}(${base}, ${pseudo.map((p) => JSON.stringify(p)).join(', ')})}`);
  } else if (className) props.push(attrJsx('className', className));

  if (lower === 'style' || lower === 'script') {
    const text = el.children.map((c) => c.data || '').join('');
    return `<${tag} ${props.join(' ')} dangerouslySetInnerHTML={{ __html: ${JSON.stringify(text)} }} />`;
  }
  if (VOID.has(lower)) return `<${tag} ${props.join(' ')} />`;
  const kids = walkChildren(el.children, ctx, sectionMode).join('');
  return `<${tag} ${props.join(' ')}>${kids}</${tag}>`;
}

function walkHelmet(el, ctx) {
  for (const c of el.children) {
    if (c.type !== 'tag' && c.type !== 'script' && c.type !== 'style') continue;
    const tag = c.name.toLowerCase();
    if (tag === 'style') ctx.helmet.css.push(c.children.map((x) => x.data || '').join(''));
    else if (tag === 'script') {
      if (!c.attribs.src) throw new Error(`${ctx.file}: inline helmet script not supported`);
      ctx.helmet.scripts.push(c.attribs.src.replace(/^\.\//, ''));
    } else if (tag === 'link') ctx.helmet.links.push(c.attribs);
    else if (tag === 'title') ctx.helmet.title = c.children.map((x) => x.data || '').join('');
    else if (tag === 'meta') ctx.helmet.links.push({ meta: true, ...c.attribs });
  }
  return null;
}

// ───────────────────────────── Home v3 section split ─────────────────────────────

function matchSection(node) {
  for (const s of SECTIONS) {
    if (s.id && node.attribs?.id === s.id) return s;
    if (s.tag && node.name.toLowerCase() === s.tag) return s;
    if (s.ifValue && node.name.toLowerCase() === 'sc-if' && node.attribs.value === s.ifValue) return s;
  }
  return null;
}

function emitSection(sec, node, ctx) {
  const sub = new Ctx(ctx.file + ' › ' + sec.name);
  const jsx = walk(node, sub, false);
  const wrapped = jsx.startsWith('{') ? `<>${jsx}</>` : jsx;
  ctx.sections.push({ name: sec.name, jsx: wrapped, ctx: sub });
  sub.imports.forEach((i) => ctx.imports.add(i));
  return `<${sec.name} v={v} />`;
}

// ───────────────────────────── logic class ─────────────────────────────

function extractLogic(html, file) {
  const m = html.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>\s*<\/body>/);
  if (!m) return null;
  let src = m[1];
  if (!/class\s+Component\s+extends/.test(src)) return null;
  // Module URLs are resolved by the browser at runtime (files in public/), never bundled.
  src = src.replace(/\bimport\(\s*(?!\/\*\s*webpackIgnore)/g, 'import(/* webpackIgnore: true */ ');
  const before = src;
  src = applyFactRules(src, FACT_LOGIC_RULES, file);
  const usesSite = src !== before;
  return `// @ts-nocheck\n/* eslint-disable */\n// Logic class from design/project/${file}.dc.html, unchanged except for this header, the export\n// and webpackIgnore on runtime imports. Generated by scripts/dc-codegen.mjs.\nimport React from 'react';\nimport { DCLogic, StreamableLogic } from '@/dc/runtime';\n${usesSite ? "import { site as SITE } from '@/content/facts';\n" : ''}\n${src.trim()}\n\nexport default Component;\n`;
}

// ───────────────────────────── emit ─────────────────────────────

const HEADER = (src) => `// GENERATED from design/project/${src} by scripts/dc-codegen.mjs. Do not edit by hand: change the generator
// (or detach this file from the generator's COMPONENTS list before hand-editing it).\n`;

function runtimeImport(ctx) {
  const names = [...ctx.helpers].sort();
  return `import { ${['type Vals', ...names].join(', ')} } from '@/dc/runtime';`;
}

function dcImports(ctx, fromDir) {
  return [...ctx.imports]
    .sort()
    .map((n) => {
      const rel = path.relative(fromDir, path.join(OUT_DC, compName(n))).replace(/\\/g, '/');
      return `import ${compName(n)} from '${rel.startsWith('.') ? rel : './' + rel}';`;
    })
    .join('\n');
}

async function fmt(code, file) {
  try {
    return await prettier.format(code, { parser: 'typescript', printWidth: 140, singleQuote: true });
  } catch (e) {
    fs.writeFileSync(path.join(SITE, '.codegen-error.tsx'), code);
    throw new Error(`prettier failed on ${file}: ${e.message.split('\n')[0]} (raw output in site/.codegen-error.tsx)`);
  }
}

async function convert(dcName) {
  const file = dcName + '.dc.html';
  const html = fs.readFileSync(path.join(DESIGN, file), 'utf8');
  const a = html.indexOf('<x-dc>');
  const b = html.lastIndexOf('</x-dc>');
  const tpl = applyFactRules(html.slice(a + 6, b), FACT_TEMPLATE_RULES, file);
  const doc = parseDocument(tpl, { lowerCaseAttributeNames: false, lowerCaseTags: false, recognizeSelfClosing: true, decodeEntities: true });
  const ctx = new Ctx(file);
  const isRoot = dcName === ROOT;
  const body = walkChildren(doc.children, ctx, isRoot).join('');
  const C = compName(dcName);
  const logic = extractLogic(html, dcName);
  if (logic) fs.writeFileSync(path.join(OUT_DC, C + '.logic.js'), logic);

  const sectionImports = ctx.sections.map((s) => `import ${s.name} from '../home/sections/${s.name}';`).join('\n');
  const code = `${HEADER(file)}'use client';
import React from 'react';
${runtimeImport(ctx).replace("type Vals, ", "type Vals, createDC, ")}
${logic ? `import Logic from './${C}.logic.js';` : ''}
${dcImports(ctx, OUT_DC)}
${sectionImports}

function render(v: Vals) {
  return <>${body}</>;
}

const ${C} = createDC(${JSON.stringify(dcName)}, ${logic ? 'Logic' : 'null'}, render);
export default ${C};
`;
  fs.writeFileSync(path.join(OUT_DC, C + '.tsx'), await fmt(code, file));

  for (const s of ctx.sections) {
    const sc = `${HEADER(file)}// Home v3 section "${s.name}". Renders against the home page's values (\`v\`, from HomeV3's logic class).
'use client';
import React from 'react';
${runtimeImport(s.ctx)}
${dcImports(s.ctx, OUT_SECTIONS)}

export default function ${s.name}({ v }: { v: Vals }) {
  return ${s.jsx};
}
`;
    fs.writeFileSync(path.join(OUT_SECTIONS, s.name + '.tsx'), await fmt(sc, file + ' › ' + s.name));
  }
  return ctx;
}

function copyPublic(check) {
  const diffs = [];
  for (const f of PUBLIC_FILES) {
    const src = path.join(DESIGN, f);
    const dst = path.join(SITE, 'public', f);
    const same = fs.existsSync(dst) && Buffer.compare(fs.readFileSync(src), fs.readFileSync(dst)) === 0;
    if (same) continue;
    if (check) diffs.push(f);
    else {
      fs.mkdirSync(path.dirname(dst), { recursive: true });
      fs.copyFileSync(src, dst);
    }
  }
  return diffs;
}

async function main() {
  if (process.argv.includes('--check')) {
    const d = copyPublic(true);
    if (d.length) {
      console.error('public/ differs from design/project for: ' + d.join(', '));
      process.exit(1);
    }
    console.log('public/ engine files match design/project.');
    return;
  }
  fs.mkdirSync(OUT_DC, { recursive: true });
  fs.mkdirSync(OUT_SECTIONS, { recursive: true });
  const css = [];
  const scripts = [];
  const links = [];
  let title = null;
  for (const n of COMPONENTS) {
    const ctx = await convert(n);
    if (ctx.helmet.css.length) css.push(`/* ── ${n}.dc.html ── */\n` + ctx.helmet.css.join('\n'));
    for (const sc of ctx.helmet.scripts) if (!scripts.includes(sc)) scripts.push(sc);
    for (const l of ctx.helmet.links) if (!links.some((x) => JSON.stringify(x) === JSON.stringify(l))) links.push(l);
    if (n === ROOT) title = ctx.helmet.title;
  }
  const pseudo = [...pseudoRules.values()].map((r) => r.rule).join('\n');
  fs.mkdirSync(path.join(SITE, 'src/styles'), { recursive: true });
  fs.writeFileSync(
    path.join(SITE, 'src/styles/dc.generated.css'),
    `/* GENERATED by scripts/dc-codegen.mjs from the <helmet> styles and style-hover/style-focus attributes in design/project. */\n\n${css.join('\n\n')}\n\n/* style-hover / style-focus */\n${pseudo}\n`,
  );
  for (const sc of scripts) if (!PUBLIC_FILES.includes(sc) && !SITE_OWNED.includes(sc)) throw new Error('helmet script not in public/: ' + sc);
  const fonts = links.filter((l) => !l.meta && /stylesheet/.test(l.rel || '')).map((l) => l.href);
  fs.mkdirSync(path.join(SITE, 'src/dc'), { recursive: true });
  fs.writeFileSync(
    path.join(SITE, 'src/dc/head.generated.ts'),
    `// GENERATED by scripts/dc-codegen.mjs from the <helmet> blocks in design/project.\n` +
      `export const DC_TITLE = ${JSON.stringify(title)};\n` +
      `/** Scripts the components expect on window, in load order (served from public/). */\n` +
      `export const DC_SCRIPTS: string[] = ${JSON.stringify(scripts, null, 2)};\n` +
      `/** Font stylesheets. */\n` +
      `export const DC_FONT_CSS: string[] = ${JSON.stringify(fonts, null, 2)};\n`,
  );
  copyPublic(false);
  const missed = [...FACT_TEMPLATE_RULES, ...FACT_LOGIC_RULES].filter(([from]) => !factHits.has(from));
  if (missed.length) throw new Error('company-facts rules matched nothing (design changed?): ' + missed.map((m) => m[0]).join(' | '));
  for (const w of warnings) console.warn('warn: ' + w);
  console.log(`Generated ${COMPONENTS.length} components, ${SECTIONS.length} home sections, ${pseudoRules.size} pseudo-class rules; scripts: ${scripts.join(', ')}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
