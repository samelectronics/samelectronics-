// R6 Part E7 · the product shot (box + LCD) for each brand + manufacturer, as rendered by scripts/productshot/render.mjs
// into public/assets/shots/<id>-<240|480|960>.(webp|avif). The box is chosen by Manufacturer (Excel) and brand, per the
// owner's box photos (design/reference/boxes). TEMP = no photo yet (OEM, YK, Taiwan, Refurbished, OLED makers, Nokia):
// a neutral white box with a small Sam Electronics label until the owner sends one.
(function () {
  const shots = {
    'apple-sp': { box: 'apple-sp', lcd: 'iphone' },
    'apple-gx': { box: 'gx', lcd: 'iphone', label: 'GX-iPhone' },
    'apple-zy': { box: 'zy', lcd: 'iphone', label: 'iPhone' },
    'apple-temp': { box: 'temp', lcd: 'iphone', temp: true },
    'samsung-sp': { box: 'samsung-sp', lcd: 'frame' },
    'samsung-gx': { box: 'gx', lcd: 'plain', label: 'GX-Galaxy' },
    'samsung-zy': { box: 'zy', lcd: 'plain', label: 'Galaxy' },
    'samsung-temp': { box: 'temp', lcd: 'plain', temp: true },
    'google-sp': { box: 'svc-yellow', lcd: 'frame' },
    'xiaomi-sp': { box: 'xiaomi-sp', lcd: 'plain' },
    'huawei-sp': { box: 'huawei-sp', lcd: 'tabs' },
    'bbk-sp': { box: 'bbk-sp', lcd: 'plain' },
    'generic-gx': { box: 'gx', lcd: 'plain', label: 'GX' },
    'generic-zy': { box: 'zy', lcd: 'plain', label: 'LCD' },
    'generic-temp': { box: 'temp', lcd: 'plain', temp: true },
  };
  const SP = { apple: 'apple-sp', samsung: 'samsung-sp', google: 'google-sp', infinix: 'google-sp', tecno: 'google-sp', xiaomi: 'xiaomi-sp', redmi: 'xiaomi-sp', poco: 'xiaomi-sp', huawei: 'huawei-sp', honor: 'huawei-sp', oppo: 'bbk-sp', realme: 'bbk-sp', oneplus: 'bbk-sp', vivo: 'bbk-sp' };
  const pick = (brand, maker) => {
    const own = brand === 'apple' || brand === 'samsung' ? brand : 'generic';
    if (maker === 'service-pack') return SP[brand] || 'generic-temp';
    if (maker === 'gx') return own + '-gx';
    if (maker === 'zy') return own + '-zy';
    return own + '-temp';
  };
  // srcset helper: `base` = /assets/shots/<id>
  // Urgent 1: THE product pose (scripts/productshot/pose.html → public/assets/pose): carton behind, product in front,
  // both 20° right. Screens keep their brand / manufacturer box; every other part stands on its white carton.
  const PART = { BAT: 'part-bat', BCV: 'part-bcv', FLX: 'part-flx', CAM: 'part-cam', SML: 'part-sml', FRM: 'part-frm', BOARD: 'part-board' };
  const forCat = (cat, brand, maker) => (cat === 'SCR' ? pick(brand, maker) : PART[cat] || 'part-sml');
  const url = (id, w) => '/assets/pose/' + id + '-' + (w <= 240 ? 240 : w <= 480 ? 480 : 960) + '.webp';
  // the parts-library index (0 Screen · 1 Frame · 2 Flex · 3 Board · 4 Battery · 5 Cameras · 6 Small parts · 7 Back glass) → its pose
  const IDX = ['apple-sp', 'part-frm', 'part-flx', 'part-board', 'part-bat', 'part-cam', 'part-sml', 'part-bcv'];
  const byIndex = (i, w) => (IDX[i] ? url(IDX[i], w || 480) : '');
  const byKind = (k, w) => byIndex({ scr: 0, frm: 1, flx: 2, board: 3, bat: 4, cam: 5, sml: 6, bcv: 7 }[k], w);
  window.SE_SHOTS = { shots, pick, forCat, url, byIndex, byKind };
})();
