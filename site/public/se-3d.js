// Shared three.js studio + realistic phone builder. Used by Model File turntable and the finale.
let _T;
async function T() {
  if (_T) return _T;
  const THREE = await import('https://esm.sh/three@0.160.0');
  const { RoomEnvironment } = await import('https://esm.sh/three@0.160.0/examples/jsm/environments/RoomEnvironment.js');
  const { RoundedBoxGeometry } = await import('https://esm.sh/three@0.160.0/examples/jsm/geometries/RoundedBoxGeometry.js');
  return (_T = { THREE, RoomEnvironment, RoundedBoxGeometry });
}
function stage(canvas, { THREE, RoomEnvironment }, opts = {}) {
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
  r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5)); r.outputColorSpace = THREE.SRGBColorSpace; r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = opts.exposure || 1.05;
  r.shadowMap.enabled = false; r.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene(), pm = new THREE.PMREMGenerator(r); scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  const cam = new THREE.PerspectiveCamera(opts.fov || 28, 1, 0.1, 100);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x26282b, 0.35));
  const key = new THREE.SpotLight(0xffffff, opts.key || 70, 30, Math.PI / 7, 0.65, 1.4); key.position.set(-3, 7, 5); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.radius = 8; scene.add(key, key.target);
  const rim = new THREE.PointLight(0xf7c032, opts.rim || 26, 12, 1.6); rim.position.set(3, 1.8, -2.6); scene.add(rim);
  const fill = new THREE.PointLight(0xffffff, 6, 12, 1.6); fill.position.set(-3, 0, 3); scene.add(fill);
  if (opts.floor !== false) { const f = new THREE.Mesh(new THREE.CircleGeometry(10, 64), new THREE.MeshStandardMaterial({ color: opts.floorColor || 0x26282b, metalness: 0.6, roughness: 0.3 })); f.rotation.x = -Math.PI / 2; f.position.y = opts.floorY ?? -2; f.receiveShadow = true; scene.add(f); }
  return { r, scene, cam, pm, key, rim };
}
const BODY = { titanium: [0xb9b4aa, 0.9, 0.32], graphite: [0x3d3f43, 0.85, 0.35], silver: [0xd5d8dc, 1, 0.25], black: [0x2a2c30, 0.6, 0.4], blue: [0x3a4a66, 0.7, 0.35], green: [0x4a5a4e, 0.7, 0.35] };
export function buildPhone({ THREE, RoundedBoxGeometry }, o = {}) {
  const W = 1.5, H = 3.1, R = o.round ?? 0.22, D = 0.16, body = BODY[o.body || 'graphite'];
  const M = {
    frame: new THREE.MeshStandardMaterial({ color: body[0], metalness: body[1], roughness: body[2] }),
    back: new THREE.MeshPhysicalMaterial({ color: o.backColor ?? body[0], metalness: 0.15, roughness: o.matte ? 0.55 : 0.15, clearcoat: o.matte ? 0.2 : 1, clearcoatRoughness: 0.08 }),
    lens: new THREE.MeshPhysicalMaterial({ color: 0x050608, metalness: 0.3, roughness: 0.05, clearcoat: 1 }),
    ring: new THREE.MeshStandardMaterial({ color: 0xd5d8dc, metalness: 1, roughness: 0.18 }),
    screen: new THREE.MeshPhysicalMaterial({ color: 0x050506, metalness: 0.1, roughness: 0.12, clearcoat: 1, emissive: 0x000000 }),
    btn: new THREE.MeshStandardMaterial({ color: body[0], metalness: body[1], roughness: body[2] * 0.8 }),
    foil: new THREE.MeshStandardMaterial({ color: 0xd9dce0, metalness: 0.9, roughness: 0.42 }),
    pcb: new THREE.MeshStandardMaterial({ color: 0x1f5a3f, metalness: 0.15, roughness: 0.55 }),
    chip: new THREE.MeshStandardMaterial({ color: 0x1a1b1d, metalness: 0.3, roughness: 0.4 }),
    shield: new THREE.MeshStandardMaterial({ color: 0xc9ccd0, metalness: 1, roughness: 0.35 }),
    copper: new THREE.MeshStandardMaterial({ color: 0xc8823a, metalness: 0.9, roughness: 0.35 })
  };
  const rb = (w, h, d, r, m) => { const me = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 5, r), m); me.castShadow = true; me.receiveShadow = true; return me; };
  const g = new THREE.Group(), parts = {};
  const add = (k, obj) => { parts[k] = obj; g.add(obj); return obj; };
  // frame band
  { const s = new THREE.Shape(), rr = (sh, w, h, r) => { sh.moveTo(-w / 2 + r, -h / 2); sh.lineTo(w / 2 - r, -h / 2); sh.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r); sh.lineTo(w / 2, h / 2 - r); sh.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2); sh.lineTo(-w / 2 + r, h / 2); sh.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r); sh.lineTo(-w / 2, -h / 2 + r); sh.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2); };
    rr(s, W, H, R); const hole = new THREE.Path(); rr(hole, W - 0.06, H - 0.06, R - 0.03); s.holes.push(hole);
    const geo = new THREE.ExtrudeGeometry(s, { depth: D - 0.04, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.018, bevelSegments: 4, curveSegments: 20 }); geo.translate(0, 0, -(D - 0.04) / 2);
    const f = new THREE.Group(); const fm = new THREE.Mesh(geo, M.frame); fm.castShadow = true; f.add(fm);
    [[W / 2 + 0.008, 0.62, 0.34], [-W / 2 - 0.008, 0.86, 0.14], [-W / 2 - 0.008, 0.56, 0.22], [-W / 2 - 0.008, 0.3, 0.22]].forEach(([x, y, h]) => { const b = rb(0.02, h, 0.06, 0.009, M.btn); b.position.set(x, y, 0); f.add(b); });
    const port = rb(0.3, 0.05, 0.05, 0.022, M.chip); port.position.set(0, -H / 2, 0); f.add(port);
    add('frame', f); }
  // back + camera
  { const b = new THREE.Group(); b.add(rb(W - 0.02, H - 0.02, 0.03, R - 0.01, M.back)); b.position.z = -D / 2 + 0.01;
    const cams = new THREE.Group(); cams.position.z = -0.03;
    const lens = (x, y, rad) => { const r = new THREE.Mesh(new THREE.CylinderGeometry(rad, rad, 0.05, 48), M.ring); r.rotation.x = Math.PI / 2; r.position.set(x, y, -0.01); r.castShadow = true; cams.add(r); const l = new THREE.Mesh(new THREE.CylinderGeometry(rad * 0.78, rad * 0.78, 0.055, 48), M.lens); l.rotation.x = Math.PI / 2; l.position.set(x, y, -0.012); cams.add(l); };
    const L = o.cams || 'tri';
    if (L === 'tri') { const bump = rb(0.64, 0.68, 0.04, 0.16, M.back); bump.position.set(-0.36, 1.1, 0.0); cams.add(bump); lens(-0.5, 1.26, 0.12); lens(-0.5, 0.94, 0.12); lens(-0.22, 1.1, 0.12); }
    else if (L === 'col') { [1.2, 0.9, 0.6].forEach((y) => lens(-0.48, y, 0.13)); }
    else if (L === 'bar') { const bar = rb(W - 0.06, 0.34, 0.06, 0.15, M.btn); bar.position.set(0, 1.0, 0); cams.add(bar); lens(-0.42, 1.0, 0.1); lens(-0.12, 1.0, 0.1); }
    else { const disk = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.05, 64), M.back); disk.rotation.x = Math.PI / 2; disk.position.set(0, 0.95, 0); cams.add(disk); lens(-0.16, 1.1, 0.1); lens(0.16, 1.1, 0.1); lens(-0.16, 0.8, 0.1); lens(0.16, 0.8, 0.1); }
    b.add(cams); add('back', b); }
  // internals (for assembly)
  { const bat = rb(1.08, 1.6, 0.06, 0.05, M.foil); bat.position.set(0, -0.5, 0); add('battery', bat);
    const brd = new THREE.Group(); brd.add(rb(1.28, 0.95, 0.03, 0.04, M.pcb)); const s1 = rb(0.48, 0.34, 0.035, 0.015, M.shield); s1.position.set(-0.3, 0.15, 0.02); brd.add(s1); const c1 = rb(0.24, 0.24, 0.03, 0.01, M.chip); c1.position.set(0.3, 0.18, 0.02); brd.add(c1); brd.position.set(0, 0.9, 0); add('board', brd);
    const fx = rb(0.1, 2.0, 0.01, 0.004, M.copper); fx.position.set(0.56, -0.1, 0.02); add('flex', fx); }
  // display + glass
  { const s = new THREE.Group(); const panel = rb(W - 0.05, H - 0.05, 0.03, R - 0.025, M.screen); s.add(panel);
    const isl = rb(0.36, 0.1, 0.005, 0.05, new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.3 })); isl.position.set(0, H / 2 - 0.16, 0.018); s.add(isl);
    s.position.z = D / 2 - 0.012; add('screen', s); parts.screenMat = M.screen; parts.screenPanel = panel; }
  g.userData.parts = parts; g.userData.M = M;
  return g;
}
function logoTexture(THREE) { return new Promise((res) => new THREE.TextureLoader().load(new URL('assets/se-logo.png', document.baseURI).href, (t) => { t.colorSpace = THREE.SRGBColorSpace; res(t); }, undefined, () => res(null))); }
function loop(host, r, cam, scene, onFrame) {
  let alive = true, vis = true, w = 0, h = 0, t0 = performance.now();
  const io = new IntersectionObserver(([e]) => (vis = e.isIntersecting), { threshold: 0.01 }); io.observe(host);
  const tick = (now) => { if (!alive) return; requestAnimationFrame(tick); if (!vis || document.hidden) return; const b = host.getBoundingClientRect(); if (b.width !== w || b.height !== h) { w = b.width; h = b.height; r.setSize(w, h, false); cam.aspect = w / Math.max(1, h); cam.updateProjectionMatrix(); } onFrame((now - t0) / 1000); r.render(scene, cam); };
  requestAnimationFrame(tick);
  return () => { alive = false; io.disconnect(); r.dispose(); };
}
const PRESET = { apple: { body: 'titanium', cams: 'tri', matte: true }, samsung: { body: 'graphite', cams: 'col' }, google: { body: 'black', cams: 'bar' }, xiaomi: { body: 'black', cams: 'ring' }, redmi: { body: 'blue', cams: 'col' }, poco: { body: 'black', cams: 'col' }, huawei: { body: 'green', cams: 'ring' }, honor: { body: 'silver', cams: 'ring' }, oppo: { body: 'silver', cams: 'ring' }, vivo: { body: 'blue', cams: 'ring' }, realme: { body: 'green', cams: 'col' }, tecno: { body: 'blue', cams: 'ring' }, infinix: { body: 'graphite', cams: 'col' } };
// Turntable: state = { brand, show } ; ±25° oscillation, 12s period
export async function mountTurntable(host, state) {
  const L = await T(), { THREE } = L, { r, scene, cam } = stage(host.querySelector('canvas'), L, { floorY: -1.62, floorColor: 0x2e3033 });
  let cur = null, curBrand = null, fade = 1, next = null;
  const make = (b) => { const ph = buildPhone(L, PRESET[b] || PRESET.samsung); ph.scale.setScalar(1); scene.add(ph); return ph; };
  return loop(host, r, cam, scene, (t) => {
    if (state.brand !== curBrand) { curBrand = state.brand; next = make(curBrand); next.position.y = -0.1; next.traverse((m) => { if (m.material) { m.material = m.material.clone(); m.material.transparent = true; m.material.opacity = 0; } }); fade = 0; }
    if (next) { fade = Math.min(1, fade + 0.04); next.traverse((m) => m.material && (m.material.opacity = fade)); if (cur) cur.traverse((m) => { if (m.material) { m.material.transparent = true; m.material.opacity = 1 - fade; } }); if (fade >= 1) { if (cur) scene.remove(cur); cur = next; next = null; cur.traverse((m) => { if (m.material) { m.material.transparent = false; m.material.opacity = 1; } }); } }
    const a = Math.sin((t / 12) * Math.PI * 2) * (25 * Math.PI / 180) + Math.PI;
    [cur, next].forEach((p) => { if (p) { p.rotation.set(-0.06, a, 0); p.position.y = 0.02 + Math.sin(t * 0.9) * 0.025; } });
    cam.position.set(0, 0.35, 8.6); cam.lookAt(0, 0, 0);
  });
}
// Finale: state = { start (ms timestamp or 0), p: unused }
export async function mountFinale(host, state) {
  const L = await T(), { THREE } = L, { r, scene, cam, key } = stage(host.querySelector('canvas'), L, { floorY: -1.75, key: 90, rim: 34, fov: 26 });
  const ph = buildPhone(L, { body: 'graphite', cams: 'tri' }); scene.add(ph);
  const P = ph.userData.parts, logo = await logoTexture(THREE);
  const logoMesh = new THREE.Mesh(new THREE.CircleGeometry(0.34, 64), new THREE.MeshBasicMaterial({ map: logo, transparent: true, opacity: 0 })); logoMesh.position.set(0, 0.1, 0.02); P.screen.add(logoMesh);
  const sweep = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 4), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })); sweep.rotation.z = 0.5; sweep.position.z = 0.03; P.screen.add(sweep);
  const order = ['frame', 'board', 'battery', 'flex', 'back', 'screen'];
  const from = { frame: [0, -4.5, 0], board: [-5, 1.5, 1], battery: [5, -1, 1], flex: [4, 3, -1], back: [-4, -2, -3], screen: [0, 4.5, 3] };
  const rot = { frame: [0, 0, 0.6], board: [0.8, 0.4, 0], battery: [-0.6, 0.5, 0.3], flex: [0, 0, 1.2], back: [0.5, -0.8, 0], screen: [-0.7, 0, 0.2] };
  order.forEach((k) => { P[k].userData.home = P[k].position.clone(); });
  const flash = new THREE.PointLight(0xffdb6e, 0, 4, 2); scene.add(flash);
  const ease = (x) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
  return loop(host, r, cam, scene, () => {
    const t = state.start ? (performance.now() - state.start) / 1000 : 0;
    let fl = 0;
    order.forEach((k, i) => { const a = i * 0.32, e = ease((t - a) / 1.0), f = from[k], h = P[k].userData.home, sep = t > 8 ? Math.max(0, Math.sin((t - 8) * 0.9 + i)) * 0.05 * (Math.sin((t - 8) * 0.25) > 0.6 ? 1 : 0) : 0;
      P[k].position.set(h.x + f[0] * (1 - e), h.y + f[1] * (1 - e), h.z + f[2] * (1 - e) + (i - 2.5) * sep);
      P[k].rotation.set(rot[k][0] * (1 - e), rot[k][1] * (1 - e), rot[k][2] * (1 - e));
      const dt = t - a - 1.0; if (dt > 0 && dt < 0.25) fl = Math.max(fl, 1 - dt / 0.25); });
    flash.intensity = fl * 12;
    const on = ease((t - 2.6) / 0.8); P.screenMat.emissive.setRGB(0.05 * on, 0.05 * on, 0.055 * on); logoMesh.material.opacity = on;
    const sw = (t - 3.0) / 0.9; sweep.material.opacity = sw > 0 && sw < 1 ? Math.sin(sw * Math.PI) * 0.35 : 0; sweep.position.x = -1.2 + sw * 2.4;
    const idle = Math.max(0, t - 3.5);
        ph.rotation.y = Math.sin(idle * 0.35) * (15 * Math.PI / 180) * Math.min(1, idle);
    ph.position.y = Math.sin(idle * 0.8) * 0.03;
    key.intensity = 90 + Math.sin(performance.now() / 700) * 6;
    cam.position.set(0, 0.5, 9.4); cam.lookAt(0, 0, 0);
  });
}
