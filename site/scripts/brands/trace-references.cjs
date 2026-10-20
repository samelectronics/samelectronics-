const potrace = require('potrace'), fs = require('fs'), path = require('path');
const [src, dst] = process.argv.slice(2);
for (const f of fs.readdirSync(src)) {
  potrace.trace(path.join(src, f), { threshold: 128, turdSize: 8, optTolerance: 0.6, alphaMax: 1.0 }, (err, svg) => {
    if (err) throw err;
    const n = f.replace(/\.png$/, '');
    const w = +svg.match(/width="(\d+)"/)[1] - 20, h = +svg.match(/height="(\d+)"/)[1] - 20, k = 100 / h;
    // coordinates are absolute (M/C/L): shift by the 10px padding, scale to a 100-unit height, round to 0.1
    let i = 0; const d = svg.match(/ d="([^"]+)"/)[1].replace(/-?\d+(\.\d+)?/g, (v) => { const o = (+v - 10) * k; i++; return (Math.round(o * 10) / 10).toString(); });
    const W = Math.round(w * k * 10) / 10;
    fs.writeFileSync(path.join(dst, n + '.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} 100"><path fill-rule="evenodd" d="${d}"/></svg>\n`);
    console.log(n, W + 'x100', (d.length / 1024).toFixed(1) + 'KB');
  });
}
