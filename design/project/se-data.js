// Sam Electronics — shared sample data (brief v3 §9 fixed lists). Shaped like the future database.
// Business facts are owner-provided. ALL stock, prices, shipments and events are SAMPLE.
(function () {
  const brands = [
    { id: 'apple', name: 'Apple', code: 'AP' }, { id: 'samsung', name: 'Samsung', code: 'SA' },
    { id: 'xiaomi', name: 'Xiaomi', code: 'XI' }, { id: 'redmi', name: 'Redmi', code: 'RM' },
    { id: 'poco', name: 'POCO', code: 'PC' }, { id: 'realme', name: 'Realme', code: 'RL' },
    { id: 'oppo', name: 'Oppo', code: 'OP' }, { id: 'vivo', name: 'Vivo', code: 'VV' },
    { id: 'huawei', name: 'Huawei', code: 'HW' }, { id: 'honor', name: 'Honor', code: 'HN' },
    { id: 'google', name: 'Google', code: 'GO' }, { id: 'sony', name: 'Sony', code: 'SO' },
    { id: 'tecno', name: 'Tecno', code: 'TC' }, { id: 'infinix', name: 'Infinix', code: 'IX' }
  ];
  // [brand, series, name, model numbers, tier 1-3, short code]
  const M = [
    ['apple','iPhone 16','iPhone 16 Pro Max',['A3084'],3,'IP16PM'],['apple','iPhone 16','iPhone 16 Pro',['A3083'],3,'IP16P'],['apple','iPhone 16','iPhone 16',['A3081'],2,'IP16'],
    ['apple','iPhone 15','iPhone 15 Pro Max',['A2849'],3,'IP15PM'],['apple','iPhone 15','iPhone 15 Pro',['A2848'],3,'IP15P'],['apple','iPhone 15','iPhone 15',['A2846'],2,'IP15'],
    ['apple','iPhone 14','iPhone 14 Pro',['A2650'],3,'IP14P'],['apple','iPhone 14','iPhone 14',['A2649'],2,'IP14'],
    ['apple','iPhone 13','iPhone 13 Pro',['A2483'],2,'IP13P'],['apple','iPhone 13','iPhone 13',['A2482'],2,'IP13'],
    ['apple','iPhone 12','iPhone 12',['A2172'],1,'IP12'],['apple','iPhone 11','iPhone 11',['A2111'],1,'IP11'],
    ['samsung','Galaxy S','Galaxy S24 Ultra',['SM-S928'],3,'S24U'],['samsung','Galaxy S','Galaxy S23',['SM-S911'],2,'S23'],
    ['samsung','Galaxy A','Galaxy A54',['SM-A546'],2,'A54'],['samsung','Galaxy A','Galaxy A34',['SM-A346'],1,'A34'],['samsung','Galaxy A','Galaxy A14',['SM-A145'],1,'A14'],
    ['xiaomi','Xiaomi 14','Xiaomi 14',['23127PN0CG'],3,'XI14'],['xiaomi','Xiaomi 13T','Xiaomi 13T',['2306EPN60G'],2,'XI13T'],
    ['redmi','Redmi Note','Redmi Note 13',['23129RAA4G'],1,'RN13'],['redmi','Redmi Note','Redmi Note 12',['23021RAA2Y'],1,'RN12'],['redmi','Redmi C','Redmi 13C',['23100RN82L'],1,'R13C'],
    ['realme','Realme Number','Realme 12 Pro',['RMX3842'],2,'RL12P'],['realme','Realme C','Realme C55',['RMX3710'],1,'RLC55'],
    ['oppo','Reno','Oppo Reno 11',['CPH2599'],2,'RENO11'],['oppo','A series','Oppo A78',['CPH2565'],1,'OPA78'],
    ['huawei','P series','Huawei P60 Pro',['MNA-LX9'],3,'P60P'],['huawei','Nova','Huawei Nova 11',['FOA-LX9'],2,'NOVA11'],
    ['google','Pixel','Pixel 8 Pro',['GC3VE'],3,'PX8P'],['google','Pixel','Pixel 8',['GKWS6'],2,'PX8'],['google','Pixel a','Pixel 7a',['GWKK3'],1,'PX7A'],
    ['sony','Xperia 1','Xperia 1 V',['XQ-DQ72'],3,'XP1V'],['sony','Xperia 10','Xperia 10 V',['XQ-DC72'],1,'XP10V'],
    ['poco','POCO X','POCO X6 Pro',['2311DRK48G'],2,'POX6P'],['poco','POCO F','POCO F6',['24069PC21G'],2,'POF6'],
    ['vivo','V series','Vivo V30',['V2318'],2,'VV30'],['vivo','Y series','Vivo Y36',['V2247'],1,'VY36'],
    ['honor','Magic','Honor Magic6 Pro',['BVL-N49'],3,'HNM6P'],['honor','Honor X','Honor X9b',['ALI-NX1'],1,'HNX9B'],
    ['tecno','Camon','Tecno Camon 30',['CL6'],1,'TCC30'],['tecno','Spark','Tecno Spark 20 Pro',['KJ6'],1,'TCS20P'],
    ['infinix','Note','Infinix Note 40',['X6853'],1,'IXN40'],['infinix','Hot','Infinix Hot 40i',['X6528B'],1,'IXH40I']
  ];
  const models = M.map((m, i) => ({ id: 'm' + i, brand_id: m[0], series: m[1], name: m[2], model_numbers: m[3], tier: m[4], code: m[5] }));

  const categories = [
    { id: 'SCR', name: 'Screens', one: 'Screen', ar: 'شاشات' }, { id: 'BAT', name: 'Batteries', one: 'Battery', ar: 'بطاريات' },
    { id: 'FLX', name: 'Flex cables', one: 'Charging flex', ar: 'فليكس' }, { id: 'BCV', name: 'Back covers', one: 'Back cover', ar: 'أغطية خلفية' },
    { id: 'FRM', name: 'Frames & housings', one: 'Frame', ar: 'إطارات' }, { id: 'CAM', name: 'Cameras', one: 'Rear camera', ar: 'كاميرات' },
    { id: 'SML', name: 'Small parts', one: 'Charging port', ar: 'قطع صغيرة' }, { id: 'TLS', name: 'Tools', one: 'Tool', ar: 'أدوات' }
  ];
  const grades = [
    { code: 'OR', name: 'Original', desc: 'Genuine manufacturer part', rank: 5 },
    { code: 'SP', name: 'Service Pack', desc: 'Genuine, official service packaging', rank: 5 },
    { code: 'OL', name: 'OLED', desc: 'High-quality OLED alternative', rank: 4 },
    { code: 'IN', name: 'Incell', desc: 'Budget LCD alternative', rank: 2 },
    { code: 'HQ', name: 'High Copy', desc: 'Quality aftermarket, for example GX', rank: 3 }
  ];
  const gradeMul = { OR: 1, SP: 1, OL: 0.56, IN: 0.32, HQ: 0.44 };
  const tierBase = { 1: 170, 2: 340, 3: 560 };
  const catPlan = (m) => {
    const scr = m.brand_id === 'apple' ? ['SP', 'OL', 'IN'] : m.brand_id === 'samsung' ? ['SP', 'OL', 'IN'] : ['OR', 'HQ'];
    const p = [['SCR', scr, 1], ['BAT', ['OR', 'HQ'], 0.2], ['FLX', ['OR', 'HQ'], 0.12], ['BCV', ['OR', 'HQ'], 0.16], ['SML', ['OR'], 0.07]];
    if (m.tier >= 2) p.push(['CAM', ['OR'], 0.34], ['FRM', ['HQ'], 0.22]);
    return p;
  };
  const hash = (s) => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return Math.abs(h); };
  const products = [];
  models.forEach((m) => catPlan(m).forEach(([cat, gs, mul]) => gs.forEach((g) => {
    const id = `SE-${m.code}-${cat}-${g}`, h = hash(id);
    const retail = Math.round((tierBase[m.tier] * mul * (cat === 'SCR' ? gradeMul[g] : g === 'HQ' ? 0.6 : 1)) / 5) * 5 + 15;
    const r = h % 20, stock = r < 2 ? 0 : r < 5 ? 1 + (h % 3) : 6 + (h % 40);
    const badges = [];
    if (h % 11 === 0) badges.push('New arrival');
    if (h % 7 === 0) badges.push('Best seller');
    products.push({ id, model_id: m.id, category: cat, grade: g, title: `${m.name} ${categories.find((c) => c.id === cat).one}`,
      retail_price: retail, wholesale_price: Math.round(retail * 0.78), stock_qty: stock, low_stock_threshold: 3, badges, visible: true, sample: true });
  })));
  [['SE-TLS-KIT', 'Precision screwdriver kit', 85, 34], ['SE-TLS-SEP', 'LCD separator plate', 420, 6], ['SE-TLS-B7000', 'B-7000 adhesive 50ml', 15, 120], ['SE-TLS-OPN', 'Opening picks · 10 pack', 10, 80]]
    .forEach(([id, title, price, stock]) => products.push({ id, model_id: null, category: 'TLS', grade: 'OR', title, retail_price: price, wholesale_price: Math.round(price * 0.78), stock_qty: stock, low_stock_threshold: 3, badges: [], visible: true, sample: true }));

  const now = Date.now();
  const dealIds = ['SE-A54-BAT-OR', 'SE-IP15P-SCR-OL', 'SE-RN13-SCR-OR', 'SE-S24U-BCV-OR', 'SE-PX8P-CAM-OR', 'SE-IP13-FLX-OR'];
  const deals = dealIds.map((pid, i) => ({ id: 'd' + i, product_id: pid, discount: [15, 12, 20, 10, 18, 25][i], starts: now - 864e5, ends: now + [5.2, 27.5, 49, 9.8, 71, 3.4][i] * 36e5, sample: true }));

  // Live Parts Board feed (sample). type: arrival | low | drop | shipped | restock
  const events = [
    { type: 'arrival', pid: 'SE-IP15P-SCR-OL' }, { type: 'low', pid: 'SE-A54-BAT-OR' }, { type: 'drop', pid: 'SE-RN13-SCR-OR', note: '−20%' },
    { type: 'shipped', city: 'Lagos', country: 'Nigeria', note: '42 parts' }, { type: 'restock', pid: 'SE-S24U-SCR-SP' }, { type: 'arrival', pid: 'SE-XI14-CAM-OR' },
    { type: 'shipped', city: 'Baghdad', country: 'Iraq', note: '120 parts' }, { type: 'drop', pid: 'SE-IP15P-SCR-OL', note: '−12%' }, { type: 'low', pid: 'SE-PX8-SCR-OR' },
    { type: 'shipped', city: 'Bucharest', country: 'Romania', note: '18 parts' }, { type: 'arrival', pid: 'SE-RL12P-BAT-OR' }, { type: 'shipped', city: 'Casablanca', country: 'Morocco', note: '64 parts' },
    { type: 'restock', pid: 'SE-IP13-BAT-OR' }, { type: 'drop', pid: 'SE-A54-BAT-OR', note: '−15%' }, { type: 'shipped', city: 'Kampala', country: 'Uganda', note: '30 parts' }
  ];

  // Incoming shipments are set by admin (sample).
  const shipments = [{ id: 'SH-2611', label: 'Screens & batteries · 2,400 parts', origin: 'Shenzhen', lands: now + (3 * 24 + 4.3) * 36e5, sample: true }];
  const preorders = [
    // Neutral placeholders — real model names are set by the owner in the Control Room (Pre-orders panel).
    { model: 'Next Galaxy Ultra', parts: 'Screens · Batteries · Back covers', status: 'Coming soon', placeholder: true, editable: 'control-room', sample: true },
    { model: 'Next Pixel Pro', parts: 'Screens · Back covers', status: 'Coming soon', placeholder: true, editable: 'control-room', sample: true },
    { model: 'Next Xiaomi flagship', parts: 'Screens · Batteries', status: 'Coming soon', placeholder: true, editable: 'control-room', sample: true }
  ];

  const regions = [
    { id: 'me', name: 'Middle East' }, { id: 'af', name: 'Africa' }, { id: 'eu', name: 'Europe' }, { id: 'as', name: 'Asia' }
  ];
  // Owner-provided example countries; `geo` is the name used by the world map data.
  const countries = [
    ['UAE', 'United Arab Emirates', 'me'], ['Saudi Arabia', 'Saudi Arabia', 'me'], ['Oman', 'Oman', 'me'], ['Iraq', 'Iraq', 'me'], ['Iran', 'Iran', 'me'],
    ['Syria', 'Syria', 'me'], ['Lebanon', 'Lebanon', 'me'], ['Yemen', 'Yemen', 'me'], ['Türkiye', 'Turkey', 'me'],
    ['Egypt', 'Egypt', 'af'], ['Libya', 'Libya', 'af'], ['Sudan', 'Sudan', 'af'], ['Eritrea', 'Eritrea', 'af'], ['Ethiopia', 'Ethiopia', 'af'], ['Uganda', 'Uganda', 'af'],
    ['Nigeria', 'Nigeria', 'af'], ['Morocco', 'Morocco', 'af'], ['Algeria', 'Algeria', 'af'], ['Tunisia', 'Tunisia', 'af'],
    ['UK', 'United Kingdom', 'eu'], ['Spain', 'Spain', 'eu'], ['Romania', 'Romania', 'eu'], ['Russia', 'Russia', 'eu'],
    ['Azerbaijan', 'Azerbaijan', 'as']
  ].map(([name, geo, region]) => ({ name, geo, region }));

  // Dubai time (GST, UTC+4). Minutes from midnight. 0 = Sunday. Owner-provided.
  const split = [[630, 840], [960, 1320]];
  const hours = { 0: [], 1: split, 2: split, 3: split, 4: split, 5: [[630, 720], [960, 1320]], 6: split, exceptions: [] };

  const branches = [
    { id: 'dxb', name: 'Dubai · Deira', city: 'Dubai', address: 'Al Murar, Deira, Dubai, UAE', plus: '78G4+3H2', status: 'live', since: 2011 },
    { id: 'mad', name: 'Madrid · Plaza Mayor', city: 'Madrid', address: 'Plaza Mayor district, Madrid, Spain', status: 'soon' }
  ];
  const history = [
    { v: 'v1.0', years: '2003–2011', title: 'Syria Tell opens in Deira', d: 'Our first shop, same area, opposite side of the road.' },
    { v: 'v2.0', years: '2011–2020', title: 'A bigger, better shop', d: 'Syria Tell moves to our current location in Al Murar.' },
    { v: 'v2.5', years: '2015–2019', title: 'Market branch', d: 'A third Syria Tell branch, inside the market.' },
    { v: 'v3.0', years: '2020–today', title: 'Sam Electronics', d: 'Same management, new name.' },
    { v: 'v4.0', years: 'Coming soon', title: 'Sam Electronics Madrid', d: 'Plaza Mayor district, Spain.' }
  ];

  const teamRoles = ['Dispatch Technician', 'Parts Specialist', 'Accounts & Front Desk', 'Repair Engineer', 'Sales Lead', 'Founder & Managing Director'];
  const team = [ // names and photos to come from the owner; only the founder is known
    { role: 'Founder & Managing Director', name: 'Tarek Alchoumari', since: 2003 },
    { role: 'Sales Lead' }, { role: 'Repair Engineer' }, { role: 'Parts Specialist' }, { role: 'Accounts & Front Desk' }, { role: 'Dispatch Technician' }
  ];
  const customerTypes = ['Retail customer', 'Repair shop', 'Trader & exporter', 'Bulk buyer'];
  const tiers = ['Connected', 'Charged', 'Supercharged', 'Fully Charged'];
  const requestTypes = ['Order parts', 'Bulk quote', 'Book a repair', 'Trade account', 'Shipping quote', 'General'];
  const orderStatus = ['New', 'Quoted', 'Confirmed', 'Ready', 'Collected / Shipped', 'Closed'];
  const repairs = [ // sample bench labour by problem (AED)
    { id: 'SCR', name: 'Cracked screen', cat: 'SCR', labour: 60, time: '45–90 min' },
    { id: 'BAT', name: 'Battery drains fast', cat: 'BAT', labour: 40, time: '30–45 min' },
    { id: 'FLX', name: 'Won’t charge', cat: 'FLX', labour: 50, time: '45–60 min' },
    { id: 'BCV', name: 'Broken back glass', cat: 'BCV', labour: 80, time: '1–2 hrs' },
    { id: 'CAM', name: 'Camera blurry', cat: 'CAM', labour: 50, time: '30–60 min' }
  ];

  const contact = { address: 'Al Murar, Deira, Dubai, UAE', plus: '78G4+3H2', phone: '+971 4 273 3031', tel: '+97142733031', mobile: '+971 50 342 0015', wa: '971503420015', email: 'samelectronics.uae@gmail.com', social: '@samelectronics.uae' };

  window.SE_DATA = { brands, models, categories, grades, products, deals, events, shipments, preorders, regions, countries, hours, branches, history, teamRoles, team, customerTypes, tiers, requestTypes, orderStatus, repairs, contact,
    // SAMPLE: owner to confirm (same-day repairs, minimum trade order, number of countries)
    serviceStats: { repairs: 'Same day', tradeMin: 10, countries: 24, sample: true } };
})();
