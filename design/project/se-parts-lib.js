// G15 Parts Library — single shared source of part renders.
// Renders the teardown's own 3D part models (se-teardown-3d.js, same studio lighting) once at a fixed 3/4 angle,
// caches them, and hands out data URLs. Index: 0 Screen · 1 Frame · 2 Flex cables · 3 Logic board · 4 Battery · 5 Cameras · 6 Small parts · 7 Back glass · 8 Assembled phone · 9 Phone front (screen off; lib.front = {ar, ph:[x,y,w,h] phone box, scr:[x,y,w,h] screen box as fractions of the phone box}).
// Usage: const lib = await window.seParts.get(); lib.large[i] (640px) · lib.thumb[i] (192px). Kinds: window.seParts.KIND.
const KEY = 'se-parts-lib-v5';
const KIND = { scr: 0, frm: 1, flx: 2, board: 3, bat: 4, cam: 5, sml: 6, bcv: 7, phone: 8, front: 9 };
const NAMES = ['Screen', 'Frame', 'Flex cables', 'Logic board', 'Battery', 'Cameras', 'Small parts', 'Back glass', 'Assembled phone', 'Phone (front)'];
let pending = null;
const down = (src, s) => new Promise((res) => { const im = new Image(); im.onload = () => { const c = document.createElement('canvas'); c.width = c.height = s; const x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(im, 0, 0, s, s); res(c.toDataURL('image/webp', 0.9)); }; im.onerror = () => res(src); im.src = src; });
async function build() {
  const host = document.createElement('div');
  host.style.cssText = 'position:fixed;left:-2000px;top:0;width:800px;height:600px;pointer-events:none;opacity:0';
  host.appendChild(document.createElement('canvas')); document.body.appendChild(host);
  const mod = await import(new URL('./se-teardown-3d.js', location.href).href);
  const st = { p: 0.185, snap: true, mob: false, oT: null, lib: true };
  const dispose = await mod.mount(host, st);
  const t0 = Date.now(); while (!st.renderLib && Date.now() - t0 < 30000) await new Promise((r) => setTimeout(r, 100));
  await new Promise((r) => setTimeout(r, 1500));
  const big = st.renderLib(640) || [];
  const large = await Promise.all(big.map((u) => down(u, 640)));
  const thumb = await Promise.all(big.map((u) => down(u, 192)));
  try { typeof dispose === 'function' && dispose(); } catch (e) {}
  host.remove();
  try { const sp = await screenPart(640); if (sp) { large[0] = await down(sp, 640); thumb[0] = await down(sp, 192); } } catch (e) { console.warn('se-parts-lib: screen part', e && e.message); }
  const lib = { v: 1, names: NAMES, large, thumb, front: st.libFront || null };
  memo = lib;
  await idb('readwrite', (st) => { st.delete('se-parts-lib-v4'); return st.put(lib, KEY); });
  try { localStorage.setItem(KEY, JSON.stringify({ ...lib, large: [] })); } catch (e) {}
  return lib;
}

// H5: dedicated replacement-screen render (own scene; the teardown model is not touched).
// 3/4 angle, cover glass with visible thickness, thin black border, metal backplate edge, softbox reflection, copper flex tail folding back into a connector with gold contacts.
async function screenPart(OS) {
  const THREE = await import('https://esm.sh/three@0.160.0');
  const { RoundedBoxGeometry } = await import('https://esm.sh/three@0.160.0/examples/jsm/geometries/RoundedBoxGeometry.js');
  const R = 1024, cv = document.createElement('canvas'); cv.width = cv.height = R;
  const rd = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true, preserveDrawingBuffer: true });
  rd.setPixelRatio(1); rd.setSize(R, R, false); rd.outputColorSpace = THREE.SRGBColorSpace; rd.toneMapping = THREE.ACESFilmicToneMapping; rd.toneMappingExposure = 1.0; rd.setClearColor(0x000000, 0);
  const es = new THREE.Scene(); es.background = new THREE.Color(0x17181a);
  const panelL = (w, h, k, x, y, z, warm) => { const c = warm ? new THREE.Color(1, 0.86, 0.66) : new THREE.Color(1, 1, 1); c.multiplyScalar(k); const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); es.add(m); };
  panelL(4.2, 2.6, 7, -2.6, 3.4, 4.4); panelL(0.7, 5, 3.2, 4.2, 0.4, 2.2); panelL(9, 2.4, 0.7, 0, -4.2, 1.2, true); panelL(3, 1, 1.2, 1.5, 3.5, -3);
  const pm = new THREE.PMREMGenerator(rd), env = pm.fromScene(es, 0.03).texture;
  const sc = new THREE.Scene(); sc.environment = env;
  const k1 = new THREE.DirectionalLight(0xffffff, 1.5); k1.position.set(-2, 3, 4); sc.add(k1);
  const k2 = new THREE.DirectionalLight(0xfff0d8, 0.5); k2.position.set(3, -1, 2); sc.add(k2);
  sc.add(new THREE.AmbientLight(0xffffff, 0.15));
  const g = new THREE.Group(); sc.add(g);
  const W = 0.74, H = 1.56, RR = 0.08;
  const back = new THREE.Mesh(new RoundedBoxGeometry(W - 0.014, H - 0.014, 0.02, 4, RR - 0.008), new THREE.MeshStandardMaterial({ color: 0xC9CDD2, metalness: 1, roughness: 0.26 })); back.position.z = -0.036; g.add(back);
  const pan = new THREE.Mesh(new RoundedBoxGeometry(W - 0.006, H - 0.006, 0.014, 4, RR - 0.004), new THREE.MeshStandardMaterial({ color: 0x0b0c0e, roughness: 0.55, metalness: 0.2 })); pan.position.z = -0.02; g.add(pan);
  const glass = new THREE.Mesh(new RoundedBoxGeometry(W, H, 0.026, 6, RR), new THREE.MeshPhysicalMaterial({ color: 0x3A434B, roughness: 0.06, metalness: 0.2, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 1.5 })); g.add(glass);
  const fc = document.createElement('canvas'); fc.width = 512; fc.height = Math.round(512 * H / W); const fx = fc.getContext('2d'), FW = fc.width, FH = fc.height, rr = (x, y, w, h, r) => { fx.beginPath(); fx.moveTo(x + r, y); fx.arcTo(x + w, y, x + w, y + h, r); fx.arcTo(x + w, y + h, x, y + h, r); fx.arcTo(x, y + h, x, y, r); fx.arcTo(x, y, x + w, y, r); fx.closePath(); };
  const cr = (RR / W) * FW; rr(0, 0, FW, FH, cr); fx.fillStyle = '#000000'; fx.fill();
  const bd = FW * 0.035, gr = fx.createLinearGradient(0, 0, FW * 0.4, FH); gr.addColorStop(0, '#1A1E23'); gr.addColorStop(0.5, '#101317'); gr.addColorStop(1, '#0A0B0D'); rr(bd, bd, FW - 2 * bd, FH - 2 * bd, cr - bd * 0.8); fx.fillStyle = gr; fx.fill();
  fx.beginPath(); fx.arc(FW / 2, bd + FW * 0.05, FW * 0.022, 0, Math.PI * 2); fx.fillStyle = '#000000'; fx.fill();
  fx.save(); rr(bd, bd, FW - 2 * bd, FH - 2 * bd, cr - bd * 0.8); fx.clip(); const sb = fx.createLinearGradient(FW * 0.05, FH * 0.02, FW * 0.62, FH * 0.36); sb.addColorStop(0, 'rgba(255,255,255,0)'); sb.addColorStop(0.42, 'rgba(255,255,255,.16)'); sb.addColorStop(0.58, 'rgba(255,255,255,.16)'); sb.addColorStop(1, 'rgba(255,255,255,0)'); fx.fillStyle = sb; fx.beginPath(); fx.moveTo(FW * 0.18, 0); fx.lineTo(FW * 0.62, 0); fx.lineTo(0, FH * 0.42); fx.lineTo(0, FH * 0.14); fx.closePath(); fx.fill(); fx.restore();
  const ft = new THREE.CanvasTexture(fc); ft.colorSpace = THREE.SRGBColorSpace; ft.anisotropy = 8;
  const face = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.004, H - 0.004), new THREE.MeshPhysicalMaterial({ map: ft, transparent: true, roughness: 0.03, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 1.6 })); face.position.z = 0.0132; g.add(face);
  // flex tail: from under the panel, down past the bottom edge, folds back toward the front and ends in a connector
  const y0 = -H / 2, pts = [], zb = -0.04, fr = 0.045, L1 = 0.34, L2 = 0.2;
  for (let i = 0; i <= 8; i++) pts.push(new THREE.Vector3(0, y0 + 0.08 - (i / 8) * (0.08 + L1), zb));
  for (let i = 1; i <= 14; i++) { const a = Math.PI * (i / 14); pts.push(new THREE.Vector3(0, y0 - L1 - Math.sin(a) * fr, zb + fr - Math.cos(a) * fr)); }
  for (let i = 1; i <= 8; i++) pts.push(new THREE.Vector3(0, y0 - L1 + (i / 8) * L2, zb + 2 * fr));
  const FWD = 0.2, pos = [], uv = [], idx = [];
  pts.forEach((p, i) => { const v = i / (pts.length - 1); pos.push(-FWD / 2, p.y, p.z, FWD / 2, p.y, p.z); uv.push(0, v, 1, v); if (i) { const a = (i - 1) * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); } });
  const rg = new THREE.BufferGeometry(); rg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); rg.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); rg.setIndex(idx); rg.computeVertexNormals();
  const tc = document.createElement('canvas'); tc.width = 128; tc.height = 4; const tx = tc.getContext('2d'); tx.fillStyle = '#C8692B'; tx.fillRect(0, 0, 128, 4); for (let i = 0; i < 9; i++) { tx.fillStyle = 'rgba(150,70,22,.75)'; tx.fillRect(14 + i * 12, 0, 3, 4); tx.fillStyle = 'rgba(232,150,90,.5)'; tx.fillRect(18 + i * 12, 0, 1, 4); }
  const ttex = new THREE.CanvasTexture(tc); ttex.colorSpace = THREE.SRGBColorSpace;
  g.add(new THREE.Mesh(rg, new THREE.MeshPhysicalMaterial({ map: ttex, roughness: 0.36, metalness: 0.2, clearcoat: 0.7, clearcoatRoughness: 0.2, side: THREE.DoubleSide, envMapIntensity: 1.1 })));
  const cy = y0 - L1 + L2, cz = zb + 2 * fr;
  const stiff = new THREE.Mesh(new THREE.BoxGeometry(FWD + 0.01, 0.1, 0.006), new THREE.MeshStandardMaterial({ color: 0xB4581F, roughness: 0.4, metalness: 0.2 })); stiff.position.set(0, cy - 0.02, cz - 0.004); g.add(stiff);
  const con = new THREE.Mesh(new RoundedBoxGeometry(0.23, 0.085, 0.024, 2, 0.006), new THREE.MeshStandardMaterial({ color: 0x141516, roughness: 0.45, metalness: 0.3 })); con.position.set(0, cy - 0.01, cz + 0.014); g.add(con);
  const gold = new THREE.MeshStandardMaterial({ color: 0xF0C46A, metalness: 0.9, roughness: 0.28, emissive: 0x5A3E0A, emissiveIntensity: 0.6 });
  for (let i = 0; i < 12; i++) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.011, 0.055, 0.006), gold); p.position.set(-0.0935 + i * 0.017, cy - 0.01, cz + 0.028); g.add(p); }
  g.rotation.set(-0.3, -0.62, 0.02);
  const cam = new THREE.PerspectiveCamera(16, 1, 0.1, 50); const bb = new THREE.Box3().setFromObject(g), ctr = bb.getCenter(new THREE.Vector3()), sz = bb.getSize(new THREE.Vector3());
  const dist = (Math.max(sz.x, sz.y) * 0.62) / Math.tan((16 * Math.PI) / 360); cam.position.set(ctr.x, ctr.y, ctr.z + dist); cam.lookAt(ctr);
  rd.render(sc, cam);
  const rc = document.createElement('canvas'); rc.width = rc.height = R; const rx = rc.getContext('2d'); rx.drawImage(cv, 0, 0); const d = rx.getImageData(0, 0, R, R).data;
  let x0 = R, y1 = R, x1 = 0, y2 = 0; for (let y = 0; y < R; y++) for (let x = 0; x < R; x++) if (d[(y * R + x) * 4 + 3] > 12) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y1) y1 = y; if (y > y2) y2 = y; }
  try { pm.dispose(); rd.dispose(); rd.forceContextLoss && rd.forceContextLoss(); } catch (e) {}
  if (x1 <= x0) return null;
  const bw = x1 - x0 + 1, bh = y2 - y1 + 1, k = Math.min((OS * 0.8) / bh, (OS * 0.66) / bw), o = document.createElement('canvas'); o.width = o.height = OS; const oc = o.getContext('2d'); oc.imageSmoothingQuality = 'high';
  oc.drawImage(rc, x0, y1, bw, bh, (OS - bw * k) / 2, OS * 0.9 - bh * k, bw * k, bh * k);
  return o.toDataURL('image/png');
}
let memo = null, idbP = null;
const idb = (mode, fn) => new Promise((res) => { try { const rq = indexedDB.open('se-parts-lib', 1); rq.onupgradeneeded = () => rq.result.createObjectStore('lib'); rq.onerror = () => res(null); rq.onsuccess = () => { try { const tx = rq.result.transaction('lib', mode), st = tx.objectStore('lib'), r = fn(st); tx.oncomplete = () => res(r && 'result' in r ? r.result : true); tx.onerror = () => res(null); } catch (e) { res(null); } }; } catch (e) { res(null); } });
const full = (j) => j && j.large && j.large.length === 10 && j.thumb && j.thumb.length === 10;
function cached() { if (memo) return memo; try { const j = JSON.parse(localStorage.getItem(KEY) || 'null'); if (j && j.thumb && j.thumb.length === 10) memo = j; return memo; } catch (e) { return null; } }
// large renders live in IndexedDB (too big for localStorage); thumbs stay in localStorage for instant sync peek()
const fromIdb = () => idbP || (idbP = idb('readonly', (st) => st.get(KEY)).then((j) => { if (full(j)) { memo = j; window.dispatchEvent(new CustomEvent('se:parts-lib', { detail: j })); return j; } return null; }));
try { ['se-parts-lib-v1', 'se-parts-lib-v2', 'se-parts-lib-v3', 'se-parts-lib-v4'].forEach((k) => localStorage.removeItem(k)); } catch (e) {}
window.seParts = {
  KIND, NAMES, KEY,
  peek: cached,
  get(force) { const c = !force && cached(); if (full(c)) return Promise.resolve(c); if (!pending) pending = (force ? Promise.resolve(null) : fromIdb()).then((h) => h || build().then((l) => { window.dispatchEvent(new CustomEvent('se:parts-lib', { detail: l })); return l; })); return pending; },
};
cached(); fromIdb();
