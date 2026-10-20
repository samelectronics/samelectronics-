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
  const url = (id, w) => '/assets/shots/' + id + '-' + (w <= 240 ? 240 : w <= 480 ? 480 : 960) + '.webp';
  window.SE_SHOTS = { shots, pick, url };
})();
