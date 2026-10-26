#!/usr/bin/env node
// Hero 5 · re-copies the teardown's part code into scripts/productshot/stack.js (run after changing the teardown parts).
import fs from 'node:fs';
const src = fs.readFileSync('public/se-teardown-3d.js', 'utf8').split('\n');
const a = src.findIndex((l) => l.startsWith('  const W = 1.5, H = 3.1')), b = src.findIndex((l) => l.startsWith('  // per-layer material clones'));
const body = src.slice(a, b).join('\n').replace('const phone = new THREE.Group(); scene.add(phone);', 'const phone = new THREE.Group();');
const head = fs.readFileSync('scripts/productshot/stack.js', 'utf8').split('\n').slice(0, 5).join('\n');
fs.writeFileSync('scripts/productshot/stack.js', head + '\n' + body + '\n  return { L, NAMES, M, W, H, R, SG, phone, ISL, LENS };\n}\n');
console.log('stack.js synced:', b - a, 'lines');
