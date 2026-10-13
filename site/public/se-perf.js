// G16 frame-rate guard shared by every particle system (dust, bokeh, sparks).
// window.seQuality.level is 1 when the page runs smoothly and drops step by step (to 0.4 at most) while the
// frame rate stays under 50fps; it climbs back when the page is smooth again. Particle loops draw
// Math.ceil(count * level) items, so the look stays the same and only the density adapts.
(function () {
  if (window.seQuality) return;
  var q = { level: 1, fps: 60 }, frames = 0, t0 = performance.now(), low = 0, high = 0;
  function tick(t) {
    frames++;
    if (t - t0 >= 1000) {
      var fps = (frames * 1000) / (t - t0); q.fps = Math.round(fps); frames = 0; t0 = t;
      if (!document.hidden) {
        if (fps < 50) { low++; high = 0; } else if (fps > 57) { high++; low = 0; } else { low = high = 0; }
        if (low >= 2) { q.level = Math.max(0.4, +(q.level - 0.15).toFixed(2)); low = 0; }
        if (high >= 4) { q.level = Math.min(1, +(q.level + 0.1).toFixed(2)); high = 0; }
      }
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  q.count = function (n) { return Math.max(1, Math.ceil(n * q.level)); };
  window.seQuality = q;
})();
