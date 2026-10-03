(() => {
  "use strict";
  const D = window.DATA;
  const PERSON = 10000; // Catholics per little figure
  const ROME = [12.4964, 41.9028];
  const MIN_YEAR = 1, MAX_YEAR = 2026;

  const $ = (id) => document.getElementById(id);
  const stage = $("stage"), mapCv = $("map"), pplCv = $("people"), cityCv = $("cities");
  const mctx = mapCv.getContext("2d"), pctx = pplCv.getContext("2d"), cctx = cityCv.getContext("2d");
  const slider = $("slider");

  // ---------------------------------------------------------------- history
  // [year, title, text, approximate?]
  const EVENTS = [
    [1, "Anno Domini", "Traditional year of Christ's birth. The Church does not yet exist."],
    [33, "Pentecost", "The Holy Spirit descends on the Apostles in Jerusalem; Peter preaches and thousands are baptized.", 1],
    [49, "Council of Jerusalem", "The Apostles decide that Gentile converts need not keep the Mosaic law. The faith opens to all nations.", 1],
    [64, "Peter & Paul at Rome", "Under Nero, Peter and Paul are martyred in Rome, which becomes the See of Peter.", 1],
    [70, "Jerusalem Destroyed", "Rome razes the Temple. The mother church scatters, and the centre of Christianity moves west."],
    [107, "Ignatius of Antioch", "On the road to martyrdom in Rome, Ignatius is the first to call the Church \u201ccatholic\u201d.", 1],
    [177, "Martyrs of Lyon", "Persecution in Gaul, and Irenaeus becomes bishop of Lyon."],
    [250, "Decian Persecution", "The first empire-wide persecution; many martyrs and many who lapse."],
    [303, "Great Persecution", "Diocletian's final and fiercest attempt to destroy the Church."],
    [313, "Edict of Milan", "Constantine ends the persecutions. The Church comes out of the catacombs."],
    [325, "Council of Nicaea", "The Church defines the divinity of Christ and writes the Creed."],
    [380, "Faith of the Empire", "Theodosius makes Nicene Christianity the religion of the Roman Empire."],
    [397, "The Biblical Canon", "The Council of Carthage confirms the list of books of the New Testament."],
    [410, "Sack of Rome", "Alaric's Goths take the city. Augustine answers with The City of God."],
    [431, "Council of Ephesus", "Mary is proclaimed Theotokos, \u201cGod-bearer\u201d."],
    [451, "Council of Chalcedon", "Rome defines Christ's two natures; several Eastern churches part ways."],
    [476, "Western Empire Falls", "With the emperors gone, bishops and monks hold civilization together."],
    [496, "Clovis Baptized", "The king of the Franks becomes Catholic, and a new Christian Europe begins to form."],
    [529, "Monte Cassino", "Benedict founds the monastery whose Rule will shape Western monasticism."],
    [590, "Gregory the Great", "A monk-pope reorganizes Rome's charity and sends missionaries north."],
    [597, "Augustine to England", "Pope Gregory the Great sends monks to convert the Anglo-Saxons."],
    [638, "Jerusalem Falls", "The Caliphate takes the Holy City, and Syria, Egypt and North Africa follow."],
    [698, "Carthage Falls", "Arab conquests begin to erase the ancient Christian churches of North Africa and the Near East."],
    [732, "Battle of Tours", "Charles Martel halts the Muslim advance into Gaul."],
    [754, "Papal States", "Pepin the Short gives the pope lands in central Italy."],
    [800, "Charlemagne Crowned", "Pope Leo III crowns Charlemagne emperor in Rome on Christmas Day."],
    [863, "Cyril & Methodius", "The brothers bring the Gospel and a Slavic alphabet to Great Moravia."],
    [910, "Cluny Founded", "A monastery answering only to Rome starts a movement of reform."],
    [966, "Poland Baptized", "Duke Mieszko I accepts baptism and Poland enters Latin Christendom."],
    [988, "Baptism of Rus'", "Prince Vladimir is baptized at Kyiv, bringing the East Slavs into the Church."],
    [1000, "Hungary Christian", "Stephen is crowned king with a crown sent from Rome.", 1],
    [1054, "East\u2013West Schism", "Rome and Constantinople break communion. The Eastern churches no longer count among the Catholics shown here."],
    [1077, "Walk to Canossa", "Emperor Henry IV does penance before Pope Gregory VII over who appoints bishops."],
    [1095, "First Crusade", "Pope Urban II calls Latin Christendom to the aid of the East."],
    [1204, "Constantinople Sacked", "Crusaders plunder the Eastern capital and deepen the rift."],
    [1209, "Francis of Assisi", "The pope approves the way of life of the Friars Minor. Dominic's preachers follow in 1216."],
    [1215, "Fourth Lateran Council", "The high-water mark of the medieval papacy."],
    [1274, "Aquinas Dies", "The Summa Theologiae is left unfinished as the Second Council of Lyon meets."],
    [1309, "Avignon Papacy", "The popes leave Rome for nearly seventy years."],
    [1348, "The Black Death", "Plague kills a third of Europe, and Christendom shrinks for generations."],
    [1378, "Western Schism", "Rival popes divide Latin Christendom until 1417."],
    [1439, "Council of Florence", "A brief reunion with the Greeks, soon rejected in the East."],
    [1453, "Constantinople Falls", "The Ottomans take the Byzantine capital."],
    [1492, "A New World", "Columbus reaches the Americas as the Reconquista ends in Spain."],
    [1517, "The Reformation", "Luther's protest splits Western Christendom; Northern Europe is lost to Rome."],
    [1531, "Our Lady of Guadalupe", "The apparition at Tepeyac sets off the conversion of millions in Mexico."],
    [1540, "The Jesuits", "Paul III approves Ignatius of Loyola's new order, soon to span the globe."],
    [1545, "Council of Trent", "The Catholic Reformation begins, and with it a great missionary age."],
    [1549, "Xavier in Japan", "St. Francis Xavier brings the Gospel to Japan, soon to be scattered by persecution."],
    [1565, "The Philippines", "Spanish settlers and friars found the first Catholic nation in Asia."],
    [1571, "Battle of Lepanto", "A Holy League fleet checks Ottoman power in the Mediterranean."],
    [1583, "Ricci in China", "The Jesuit Matteo Ricci enters China, dressed as a scholar."],
    [1622, "Propaganda Fide", "Rome founds a congregation to direct the worldwide missions."],
    [1634, "Catholic Maryland", "The Ark and the Dove bring the first Catholic colonists to English America."],
    [1648, "Peace of Westphalia", "The wars of religion end with Europe's confessional map largely fixed."],
    [1773, "Jesuits Suppressed", "Under royal pressure the pope dissolves the Society. It is restored in 1814."],
    [1789, "French Revolution", "The Church of France is stripped of property, and the old Catholic order shaken."],
    [1854, "Immaculate Conception", "Pius IX defines the dogma. Mary appears at Lourdes four years later."],
    [1870, "Vatican I", "The Council defines papal infallibility; the Papal States fall to Italy."],
    [1891, "Rerum Novarum", "Leo XIII launches modern Catholic social teaching."],
    [1917, "Fatima", "Three children at Fatima report apparitions, as war and revolution engulf Europe."],
    [1929, "Vatican City", "The Lateran Treaty restores the pope's independent sovereignty."],
    [1962, "Vatican II", "The Council opens, with the Church now more African, Asian and American than ever."],
    [1978, "John Paul II", "The first Polish pope, who will travel the globe."],
    [2000, "Great Jubilee", "Millions of pilgrims come to Rome to mark two thousand years since Christ's birth."],
    [2005, "Benedict XVI", "A German theologian succeeds John Paul II."],
    [2013, "Pope Francis", "The first pope from the Americas. Most Catholics now live in the Global South."],
    [2025, "Pope Leo XIV", "The first American pope is elected."],
  ];
  // world events: [year, title, text, approx, "w"]
  EVENTS.push(
    [117, "Rome at Its Height", "The Empire reaches its greatest extent, from Britain to Mesopotamia, linked by roads along which the faith will travel.", 1, "w"],
    [220, "Fall of the Han", "China's great dynasty ends and the land splits into three kingdoms.", 0, "w"],
    [224, "Sasanian Persia", "A new Persian dynasty rises as Rome's great rival in the East.", 0, "w"],
    [330, "Constantinople Founded", "Constantine dedicates a \u201cNew Rome\u201d on the Bosporus.", 0, "w"],
    [395, "The Empire Divided", "After Theodosius the Roman world is split for good into East and West.", 0, "w"],
    [622, "The Hijra", "Muhammad's journey to Medina marks the start of the Islamic era.", 0, "w"],
    [762, "Baghdad Founded", "The Abbasid caliphs build a new capital that becomes a centre of world learning.", 0, "w"],
    [1066, "Norman Conquest", "William of Normandy takes England.", 0, "w"],
    [1206, "Genghis Khan", "The Mongol Empire begins and will span Eurasia.", 0, "w"],
    [1271, "Marco Polo", "A Venetian sets out along the Silk Road to the court of the Great Khan.", 0, "w"],
    [1368, "Ming Dynasty", "China is ruled once more by a native dynasty.", 0, "w"],
    [1498, "Da Gama Reaches India", "The sea route to Asia opens, and with it a new age of missions.", 0, "w"],
    [1588, "Spanish Armada", "Philip II's great fleet fails to take England.", 0, "w"],
    [1607, "Jamestown", "The first lasting English settlement in North America.", 0, "w"],
    [1776, "American Independence", "Thirteen colonies declare independence; a nation with a tiny Catholic minority is born.", 0, "w"],
    [1815, "Waterloo", "Napoleon falls, and the Congress of Vienna redraws Europe.", 0, "w"],
    [1861, "Italian Unification", "The Kingdom of Italy is proclaimed, soon to take Rome itself.", 0, "w"],
    [1914, "The Great War", "Europe goes to war and the old world order collapses.", 0, "w"],
    [1939, "World War II", "The deadliest conflict in history begins.", 0, "w"],
    [1945, "War's End", "The war ends and the Cold War begins, dividing Europe by an iron curtain.", 0, "w"],
    [1949, "Communist China", "Missionaries are expelled; the Church in China goes underground.", 0, "w"],
    [1989, "Berlin Wall Falls", "Communism collapses across Europe and the Church of the East walks free.", 0, "w"],
    [2020, "The Pandemic", "Churches close across the world during COVID-19.", 0, "w"],
  );
  EVENTS.sort((p, q) => p[0] - q[0]);
  const WORLD_POP = [[1, 230], [200, 250], [400, 270], [600, 260], [1000, 295], [1200, 400], [1340, 440], [1400, 370], [1500, 460], [1600, 550],
    [1700, 610], [1800, 990], [1900, 1650], [1950, 2500], [1960, 3030], [1980, 4440], [2000, 6150], [2026, 8200]];

  function lerpTable(tab, y) {
    if (y <= tab[0][0]) return tab[0][1];
    for (let i = 1; i < tab.length; i++) if (y <= tab[i][0]) {
      const [y0, v0] = tab[i - 1], [y1, v1] = tab[i];
      return v0 + ((v1 - v0) * (y - y0)) / (y1 - y0);
    }
    return tab[tab.length - 1][1];
  }
  function valueAt(ser, y) {
    if (y < ser[0][0]) return 0;
    const last = ser[ser.length - 1];
    if (y >= last[0]) return last[1];
    for (let i = 0; i < ser.length - 1; i++) {
      const [y0, m0] = ser[i], [y1, m1] = ser[i + 1];
      if (y >= y0 && y < y1) {
        const t = (y - y0) / (y1 - y0);
        return m0 > 0 && m1 > 0 ? m0 * Math.pow(m1 / m0, t) : m0 + (m1 - m0) * t;
      }
    }
    return 0;
  }
  const countFor = (m) => (m < 0.004 ? 0 : Math.max(1, Math.round((m * 1e6) / PERSON)));

  function roman(n) {
    const t = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
    let s = "";
    for (const [v, r] of t) while (n >= v) { s += r; n -= v; }
    return s;
  }
  function fmtPeople(millions) {
    const n = millions * 1e6;
    if (n >= 1e9) return (n / 1e9).toFixed(2) + " billion";
    if (n >= 1e7) return Math.round(n / 1e6) + " million";
    if (n >= 1e6) return (n / 1e6).toFixed(1) + " million";
    return Math.round(n).toLocaleString("en-US");
  }
  const fmtThousands = (n) => Math.round(n).toLocaleString("en-US");
  function fmtTotal(millions) {
    const n = millions * 1e6;
    if (n >= 1e6) return "≈ " + fmtPeople(millions);
    return "≈ " + fmtThousands(Math.round(n / 1000) * 1000 || n);
  }

  // ---------------------------------------------------------------- map data
  const snapYears = D.snaps;
  const snapCache = new Map();
  const PALETTE = ["#d9a35f", "#8fae83", "#cf8479", "#8fb0c0", "#d1b45e", "#b693be", "#c9926a", "#7fb0a0"];

  function snapFor(year) {
    let s = snapYears[0];
    for (const y of snapYears) if (y <= year) s = y;
    return s;
  }
  // d3 fills spherical polygons by winding; flip any polygon that would cover "everything else"
  function fixWinding(f) {
    const g = f.geometry;
    if (!g) return;
    const fix = (rings) => {
      if (d3.geoArea({ type: "Polygon", coordinates: rings }) > 2 * Math.PI) rings.forEach((r) => r.reverse());
    };
    if (g.type === "Polygon") fix(g.coordinates);
    else if (g.type === "MultiPolygon") g.coordinates.forEach(fix);
  }
  function loadSnap(y) {
    if (snapCache.has(y)) return snapCache.get(y);
    const topo = D.maps[y];
    const obj = topo.objects.polys;
    const feats = topojson.feature(topo, obj).features;
    if (y !== 2020) feats.forEach(fixWinding); // historical data has mixed ring winding
    const geoms = obj.geometries;
    // colour subjects so that neighbours differ
    const nb = topojson.neighbors(geoms);
    const subj = geoms.map((g) => g.properties.SUBJECTO || null);
    const adj = new Map();
    subj.forEach((s, i) => {
      if (!s) return;
      if (!adj.has(s)) adj.set(s, new Set());
      for (const j of nb[i]) if (subj[j] && subj[j] !== s) adj.get(s).add(subj[j]);
    });
    const color = new Map();
    [...adj.keys()].sort((a, b) => adj.get(b).size - adj.get(a).size).forEach((s) => {
      const used = new Set([...adj.get(s)].map((n) => color.get(n)));
      let c = 0; while (used.has(c)) c++;
      color.set(s, c % PALETTE.length);
    });
    const fcol = subj.map((s) => (s ? PALETTE[color.get(s)] : null));
    const borders = topojson.mesh(topo, obj, (a, b) => a !== b && (a.properties.SUBJECTO || "") !== (b.properties.SUBJECTO || ""));
    const coast = topojson.mesh(topo, obj, (a, b) => a === b);
    const snap = { year: y, feats, fcol, borders, coast, labels: null };
    snapCache.set(y, snap);
    return snap;
  }

  // ---------------------------------------------------------------- geometry / sizing
  let W = 0, H = 0, dpr = 1, base = 1, WW = 1, worldX0 = 0, worldX1 = 0, modernPaths = null;
  let proj, path, T = d3.zoomIdentity, yTop = 0, yBot = 0;
  let pplXY = []; // per-country Float32Array of projected x,y

  function setup() {
    const r = stage.getBoundingClientRect();
    W = r.width; H = r.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    for (const c of [mapCv, pplCv, cityCv]) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); }
    const barH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--bar-h")) || 118;
    const topH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--top-h")) || 56;
    const visH = H - barH;
    // fit the world to the width on wide screens; on tall phone screens fit it to the height instead,
    // so the map stays big and you pan sideways
    base = Math.max(W / (2 * Math.PI), (H - barH - topH) / 3.75);
    WW = 2 * Math.PI * base; worldX0 = W / 2 - WW / 2; worldX1 = W / 2 + WW / 2;
    proj = d3.geoMercator().scale(base).translate([W / 2, 0]).precision(0.3);
    const ty = visH / 2 - proj([0, 30])[1];
    proj.translate([W / 2, ty]);
    yTop = proj([0, 80])[1]; yBot = proj([0, -60])[1];
    path = d3.geoPath(proj);
    pplXY = D.pts.map((flat) => {
      const a = new Float32Array(flat.length);
      for (let i = 0; i < flat.length; i += 2) {
        const p = proj([flat[i] / 100, flat[i + 1] / 100]);
        a[i] = p[0]; a[i + 1] = p[1];
      }
      return a;
    });
    for (const s of snapCache.values()) { s.labels = null; s.p = null; }
    staticPaths = null; modernPaths = null;
    centroid.fill(null); radiusCache.length = 0; cityXY.length = 0;
    zoom.translateExtent([[worldX0, yTop - 8], [worldX1, yBot + 8]]).extent([[0, 0], [W, H]]);
    drawFrame();
  }

  // ---------------------------------------------------------------- map drawing
  const SEAS = [
    ["Oceanus Atlanticus", -35, 18, 1], ["Oceanus Pacificus", -150, 8, 1], ["Oceanus Pacificus", 170, -20, 1], ["Oceanus Indicus", 78, -20, 1],
    ["Mare Internum", 17, 34.6, 3.2], ["Mare Germanicum", 3, 55, 4], ["Oceanus Aethiopicus", -5, -17, 1.6], ["Mare Caribbaeum", -77, 15, 3.4],
    ["Oceanus Arcticus", 40, 77, 1.3], ["Mare Ponticum", 34, 43.3, 5], ["Sinus Arabicus", 63, 15, 2.6],
  ];

  function ensureLabels(snap) {
    if (snap.labels) return snap.labels;
    const bySubj = new Map();
    for (const f of snap.feats) {
      const name = f.properties.NAME;
      const subj = f.properties.SUBJECTO;
      if (!subj || /^\d+$/.test(subj)) continue;
      const key = subj;
      const a = Math.abs(path.area(f));
      const cur = bySubj.get(key);
      if (!cur || a > cur.a) bySubj.set(key, { a, f, name: subj });
    }
    const out = [];
    for (const { a, f, name } of bySubj.values()) {
      if (a < 90) continue;
      // centroid of the largest polygon part
      let target = f;
      if (f.geometry.type === "MultiPolygon") {
        let best = -1, bp = null;
        for (const coords of f.geometry.coordinates) {
          const g = { type: "Polygon", coordinates: coords };
          const ar = Math.abs(path.area(g));
          if (ar > best) { best = ar; bp = g; }
        }
        target = bp;
      }
      const c = path.centroid(target);
      if (!isFinite(c[0])) continue;
      out.push({ name, x: c[0], y: c[1], a: Math.abs(path.area(target)) });
    }
    out.sort((p, q) => q.a - p.a);
    snap.labels = out;
    return out;
  }

  let staticPaths = null;
  function ensureStatic() {
    if (staticPaths) return staticPaths;
    const str = d3.geoPath(proj); // no context: returns SVG path strings
    const grat = new Path2D(str(d3.geoGraticule().step([15, 15]).extentMajor([[-180, -60], [180, 80]])()));
    const rh = new Path2D();
    const hubs = [[-38, 8], [-140, 6], [76, -16], [-30, -34], [150, -30]];
    for (const [lon, lat] of hubs) {
      const c = proj([lon, lat]);
      for (let i = 0; i < 32; i++) {
        const an = (i / 32) * Math.PI * 2;
        rh.moveTo(c[0], c[1]);
        rh.lineTo(c[0] + Math.cos(an) * W * 1.4, c[1] + Math.sin(an) * W * 1.4);
      }
    }
    staticPaths = { grat, rh };
    return staticPaths;
  }
  // Some historical polygons are degenerate (NaN coordinates, whole-world rings). One bad subpath
  // makes the browser drop everything after it, so strip them out.
  const cleanPath = (s) => (s || "").split("M").filter((seg) => seg && !seg.includes("NaN")).map((seg) => "M" + seg).join("");
  // Historical realm outlines are drawn with straight, coarse edges. Rounding them with a centripetal
  // Catmull-Rom curve gives soft, organic shapes. Anything that wraps the antimeridian falls back to d3.
  const lineClosed = d3.line().curve(d3.curveCatmullRomClosed.alpha(0.5));
  const lineOpen = d3.line().curve(d3.curveCatmullRom.alpha(0.5));
  function projectRing(ring) {
    const pts = [];
    for (const c of ring) {
      const q = proj(c);
      if (!isFinite(q[0]) || !isFinite(q[1])) return null;
      const l = pts[pts.length - 1];
      if (l && Math.abs(q[0] - l[0]) < 0.05 && Math.abs(q[1] - l[1]) < 0.05) continue;   // drop duplicates
      if (l && Math.abs(q[0] - l[0]) > WW * 0.4) return null;                              // wraps the globe
      pts.push(q);
    }
    return pts;
  }
  function smoothFeature(f) {
    const g = f.geometry;
    if (!g) return null;
    const polys = g.type === "Polygon" ? [g.coordinates] : g.type === "MultiPolygon" ? g.coordinates : null;
    if (!polys) return null;
    const p = new Path2D();
    for (const rings of polys) for (const ring of rings) {
      const pts = projectRing(ring);
      if (!pts) return null;
      if (pts.length > 1 && pts[0][0] === pts[pts.length - 1][0] && pts[0][1] === pts[pts.length - 1][1]) pts.pop();
      if (pts.length < 3) continue;
      lineClosed.context(p)(pts);
    }
    return p;
  }
  function smoothMesh(m) {
    const p = new Path2D();
    const lines = m.type === "MultiLineString" ? m.coordinates : m.type === "LineString" ? [m.coordinates] : [];
    for (const line of lines) {
      let chunk = [], prev = null;
      const flush = () => { if (chunk.length > 1) lineOpen.context(p)(chunk); chunk = []; };
      for (const c of line) {
        const q = proj(c);
        if (!isFinite(q[0]) || !isFinite(q[1])) { flush(); prev = null; continue; }
        if (prev && Math.abs(q[0] - prev[0]) > WW * 0.4) flush();
        if (!prev || Math.abs(q[0] - prev[0]) > 0.05 || Math.abs(q[1] - prev[1]) > 0.05) { chunk.push(q); prev = q; }
      }
      flush();
    }
    return p;
  }
  function ensurePaths(snap) {
    if (snap.p) return snap.p;
    const str = d3.geoPath(proj);
    const maxArea = 6 * base * base;
    const ok = snap.feats.map((f) => Math.abs(path.area(f)) < maxArea);
    const feat = snap.feats.map((f, i) => {
      if (!snap.fcol[i] || !ok[i]) return null;
      return smoothFeature(f) || new Path2D(cleanPath(str(f)));
    });
    snap.p = { feat, borders: smoothMesh(snap.borders) };
    return snap.p;
  }

  // The old border data has coarse, blocky coastlines. So the coast and land are always drawn from the
  // accurate modern outline; each era supplies only its realms, colours and borders, clipped to that land.
  let modernGeo = null;
  function ensureModern() {
    if (modernPaths) return modernPaths;
    if (!modernGeo) {
      const topo = D.maps[2020], obj = topo.objects.polys;
      modernGeo = { feats: topojson.feature(topo, obj).features, coast: topojson.mesh(topo, obj, (a, b) => a === b) };
    }
    const str = d3.geoPath(proj);
    modernPaths = {
      land: new Path2D(modernGeo.feats.map((f) => cleanPath(str(f))).join("")),
      coast: new Path2D(cleanPath(str(modernGeo.coast))),
    };
    return modernPaths;
  }

  let currentSnap = null;
  function drawMap() {
    const snap = currentSnap;
    if (!snap) return;
    const k = T.k;
    const P = ensurePaths(snap), S = ensureStatic(), M = ensureModern();
    mctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    mctx.clearRect(0, 0, W, H);
    mctx.save();
    mctx.setTransform(dpr * k, 0, 0, dpr * k, dpr * T.x, dpr * T.y);
    mctx.beginPath(); mctx.rect(worldX0 - 2, yTop, WW + 4, yBot - yTop); mctx.clip(); // crop polar regions

    // sea
    const sea = mctx.createLinearGradient(0, yTop, 0, yBot);
    sea.addColorStop(0, "#9eb7b5"); sea.addColorStop(0.5, "#a9c2b9"); sea.addColorStop(1, "#97b4b2");
    mctx.fillStyle = sea;
    mctx.fillRect(worldX0 - 2, yTop, WW + 4, yBot - yTop);

    // rhumb lines & graticule (land is painted over them)
    mctx.lineWidth = 0.7 / k; mctx.strokeStyle = "rgba(95,70,45,.17)"; mctx.stroke(S.rh);
    mctx.lineWidth = 0.5 / k; mctx.strokeStyle = "rgba(80,55,30,.22)"; mctx.stroke(S.grat);
    // watery coast shading
    mctx.lineJoin = "round";
    for (const [w, al] of [[11, 0.06], [7.5, 0.07], [4.5, 0.09], [2.2, 0.12]]) {
      mctx.lineWidth = w / k; mctx.strokeStyle = `rgba(58,98,104,${al})`; mctx.stroke(M.coast);
    }

    // land
    mctx.fillStyle = "#f2e5bd"; mctx.fill(M.land);

    // watercoloured realms and borders, kept inside the true coastline
    mctx.save(); mctx.clip(M.land);
    const fast = dragging;
    for (let i = 0; i < P.feat.length; i++) {
      const p = P.feat[i];
      if (!p) continue;
      const c = snap.fcol[i];
      mctx.globalAlpha = 0.34; mctx.fillStyle = c; mctx.fill(p, "evenodd");
      if (!fast) {
        mctx.save(); mctx.clip(p, "evenodd");
        mctx.globalAlpha = 0.5; mctx.strokeStyle = c; mctx.lineWidth = 7 / k; mctx.stroke(p);
        mctx.restore();
      }
    }
    mctx.globalAlpha = 1;

    // borders
    mctx.setLineDash([5 / k, 2.2 / k, 1.2 / k, 2.2 / k]);
    mctx.lineWidth = 1.1 / k; mctx.strokeStyle = "rgba(92,50,25,.8)"; mctx.stroke(P.borders);
    mctx.setLineDash([]);
    mctx.restore();
    // coast
    mctx.lineWidth = 1.25 / k; mctx.strokeStyle = "#3f2a16"; mctx.stroke(M.coast);
    mctx.restore();

    drawLabels(snap, k);
  }

  function drawLabels(snap, k) {
    const ctx = mctx;
    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    const placed = [];
    const hit = (r) => placed.some((p) => r[0] < p[2] && r[2] > p[0] && r[1] < p[3] && r[3] > p[1]);
    // seas
    ctx.fillStyle = "rgba(40,70,85,.62)";
    for (const [name, lon, lat, minK] of SEAS) {
      if (k < minK * 0.85 && minK > 1) continue;
      if (k > 7 && minK <= 1) continue;
      const p = proj([lon, lat]);
      const x = p[0] * k + T.x, y = p[1] * k + T.y;
      if (x < -150 || x > W + 150 || y < -50 || y > H + 50) continue;
      const fs = Math.min(26, 11 + 3.2 * Math.sqrt(k));
      ctx.font = `italic ${fs}px "IM Fell English", serif`;
      ctx.save(); ctx.translate(x, y);
      ctx.rotate(minK > 1 ? 0 : -0.08);
      const txt = name.split("").join(String.fromCharCode(8202));
      ctx.fillText(txt, 0, 0); ctx.restore();
      const wd = ctx.measureText(txt).width;
      placed.push([x - wd / 2, y - fs, x + wd / 2, y + fs]);
    }
    // realms
    const labels = ensureLabels(snap);
    ctx.fillStyle = "#2f1b0b";
    for (const L of labels) {
      const area = L.a * k * k;
      if (area < 2600) continue;
      const x = L.x * k + T.x, y = L.y * k + T.y;
      if (x < -80 || x > W + 80 || y < -30 || y > H + 30) continue;
      let fs = Math.max(8.5, Math.min(24, Math.sqrt(area) * 0.105));
      const txt = L.name.toUpperCase();
      ctx.font = `${fs}px "IM Fell English SC", "IM Fell English", serif`;
      let wd = ctx.measureText(txt).width + txt.length * fs * 0.16;
      const maxW = Math.sqrt(area) * 1.5;
      if (wd > maxW) { fs = Math.max(7.5, fs * (maxW / wd)); ctx.font = `${fs}px "IM Fell English SC", "IM Fell English", serif`; wd = ctx.measureText(txt).width + txt.length * fs * 0.16; }
      const r = [x - wd / 2, y - fs * 0.7, x + wd / 2, y + fs * 0.7];
      if (hit(r)) continue;
      placed.push(r);
      ctx.save();
      ctx.globalAlpha = 0.82;
      ctx.shadowColor = "rgba(244,232,198,.9)"; ctx.shadowBlur = 3;
      ctx.letterSpacing = (fs * 0.16).toFixed(1) + "px";
      ctx.fillText(txt, x, y);
      ctx.restore();
    }
    ctx.restore();
  }

  // ---------------------------------------------------------------- people
  const sprites = [];
  function makeSprite(fill, edge) {
    const c = document.createElement("canvas");
    c.width = 40; c.height = 64;
    const g = c.getContext("2d");
    g.lineJoin = "round";
    const shape = () => {
      g.beginPath();
      g.arc(20, 11, 8.2, 0, Math.PI * 2); // head
      g.moveTo(10, 24); g.quadraticCurveTo(20, 19, 30, 24); // shoulders
      g.lineTo(33, 46); g.lineTo(26.5, 46); g.lineTo(25.5, 61); g.lineTo(14.5, 61); g.lineTo(13.5, 46); g.lineTo(7, 46);
      g.closePath();
    };
    shape(); g.lineWidth = 3; g.strokeStyle = edge; g.stroke();
    shape(); g.fillStyle = fill; g.fill();
    return c;
  }
  sprites.push(makeSprite("#8a1c12", "rgba(246,236,205,.85)"), makeSprite("#a3261a", "rgba(246,236,205,.85)"), makeSprite("#6f130c", "rgba(246,236,205,.85)"));
  const lg = $("legendFig").getContext("2d"); lg.drawImage(sprites[0], 0, 0);

  let counts = new Int32Array(D.names.length);
  let totalMillions = 0, totalFigs = 0;

  // ---- figures pop up as they are born and pop out as they are lost.
  // A country's first N figures are the living ones, so growth adds indices [old,new) and decline removes them.
  const offs = new Int32Array(D.names.length + 1);
  for (let i = 0; i < D.names.length; i++) offs[i + 1] = offs[i] + D.pts[i].length / 2;
  const birth = new Float64Array(offs[D.names.length]), death = new Float64Array(offs[D.names.length]);
  const ghostMax = new Int32Array(D.names.length);
  const DUR_IN = 850, DUR_OUT = 700, SPREAD = 500, MAXANIM = 600;
  let animUntil = 0;
  const stagger = (f) => ((((f * 2654435761) >>> 0) % 1000) / 1000) * SPREAD;
  const backOut = (t) => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
  function computeYear(year, animate) {
    totalMillions = 0; totalFigs = 0;
    const now = performance.now();
    for (let i = 0; i < D.series.length; i++) {
      const m = valueAt(D.series[i], year);
      totalMillions += m;
      const c = Math.min(countFor(m), D.pts[i].length / 2), old = counts[i];
      if (animate && c !== old && Math.abs(c - old) <= MAXANIM) {
        const base = offs[i];
        if (c > old) {
          for (let f = old; f < c; f++) { birth[base + f] = now; death[base + f] = 0; }
          animUntil = Math.max(animUntil, now + DUR_IN + SPREAD + 60);
        } else {
          for (let f = c; f < old; f++) { death[base + f] = now; birth[base + f] = 0; }
          ghostMax[i] = Math.max(ghostMax[i], old);
          animUntil = Math.max(animUntil, now + DUR_OUT + SPREAD + 60);
        }
      }
      counts[i] = c; totalFigs += c;
    }
  }
  function countAtYear(i, y) { return Math.min(countFor(valueAt(D.series[i], y)), D.pts[i].length / 2); }

  function drawPeople() {
    const k = T.k, now = performance.now(), anim = now < animUntil;
    pctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    pctx.clearRect(0, 0, W, H);
    const h = Math.min(34, (2.2 + 6.5 * Math.exp(-totalFigs / 6000)) * Math.pow(k, 0.5));
    const w = h * 0.625;
    const small = h < 3.6;
    const m = 30;
    const sw = Math.max(1.05, h * 0.5), sh = Math.max(1.9, h);
    let active = false;
    const glow = anim ? new Path2D() : null;
    const gr = Math.max(3, h * 1.1);
    if (small) { pctx.fillStyle = "#8a1c12"; pctx.beginPath(); }   // one big path is far cheaper than ~130k separate fillRects
    for (let i = 0; i < counts.length; i++) {
      const c = counts[i], gmax = anim ? ghostMax[i] : 0;
      if (!c && !gmax) continue;
      const a = pplXY[i], base = offs[i];
      for (let f = 0; f < c; f++) {
        const j = f * 2, x = a[j] * k + T.x, y = a[j + 1] * k + T.y;
        if (x < -m || x > W + m || y < -m || y > H + m) continue;
        let s = 1;
        if (anim) {
          const b = birth[base + f];
          if (b) {
            const age = now - b - stagger(f);
            if (age < DUR_IN) {
              active = true;
              if (age <= 0) continue;
              s = backOut(age / DUR_IN);
              glow.moveTo(x + gr, y - h * 0.5); glow.arc(x, y - h * 0.5, gr * (0.6 + 0.8 * (age / DUR_IN)), 0, 6.2832);
            }
          }
        }
        if (small) pctx.rect(x - (sw * s) / 2, y - sh * s, sw * s, sh * s);
        else pctx.drawImage(sprites[f % 3], x - (w * s) / 2, y - h * s, w * s, h * s);
      }
      // figures that have just been lost shrink away where they stood
      if (gmax > c) {
        let any = false;
        for (let f = c; f < gmax; f++) {
          const d = death[base + f];
          if (!d) continue;
          const age = now - d - stagger(f);
          if (age >= DUR_OUT) continue;
          any = true; active = true;
          const j = f * 2, x = a[j] * k + T.x, y = a[j + 1] * k + T.y;
          if (x < -m || x > W + m || y < -m || y > H + m) continue;
          const t = Math.max(0, age) / DUR_OUT, s = Math.max(0, 1 - t * t * (1.6 - 0.6 * t));
          if (small) pctx.rect(x - (sw * s) / 2, y - sh * s, sw * s, sh * s);
          else { pctx.globalAlpha = 1 - t * 0.8; pctx.drawImage(sprites[f % 3], x - (w * s) / 2, y - h * s, w * s, h * s); pctx.globalAlpha = 1; }
        }
        if (!any) ghostMax[i] = 0;
      }
    }
    if (small) pctx.fill();
    if (anim) { pctx.fillStyle = "rgba(255,214,120,.32)"; pctx.fill(glow); }
    return active;
  }

  // ---------------------------------------------------------------- Rome + panel
  // ---------------------------------------------------------------- cities
  const CITY_ZOOM = { 1: 1, 2: 2.1, 3: 3.8 };
  function cityState(c, y) {
    if (c[4] && y >= c[4]) return null;
    let cur = null;
    for (const n of c[3]) if (y >= n[0]) cur = n;
    return cur;
  }
  const cityXY = [];
  function drawCities() {
    const k = T.k;
    cctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cctx.clearRect(0, 0, W, H);
    if (!window.CITIES) return;
    const items = [];
    for (let i = 0; i < CITIES.length; i++) {
      const c = CITIES[i], st = cityState(c, year);
      if (!st) continue;
      const rank = st[2];
      if (k < CITY_ZOOM[rank]) continue;
      if (!cityXY[i]) cityXY[i] = proj([c[1], c[2]]);
      const x = cityXY[i][0] * k + T.x, y = cityXY[i][1] * k + T.y;
      if (x < -60 || x > W + 60 || y < -30 || y > H + 30) continue;
      items.push({ x, y, rank, name: st[1], age: year - c[3][0][0], founded: c[3][0][0] });
    }
    items.sort((a, b) => a.rank - b.rank);
    cctx.textBaseline = "middle";
    const placed = [];
    cctx.lineJoin = "round";
    for (const it of items) {
      const big = it.rank === 1;
      const r = big ? 3.4 : it.rank === 2 ? 2.6 : 2;
      // a ring flares around a city in the decades after it is founded
      const young = year - it.founded;
      if (young >= 0 && young < 60 && it.founded > 1) {
        const u = young / 60;
        cctx.strokeStyle = `rgba(255,215,130,${(0.7 * (1 - u)).toFixed(3)})`; cctx.lineWidth = 1;
        cctx.beginPath(); cctx.arc(it.x, it.y, r + 3 + u * 22, 0, 6.2832); cctx.stroke();
      }
      cctx.fillStyle = "rgba(10,6,3,.9)"; cctx.strokeStyle = big ? "#f3dca0" : "rgba(239,227,196,.85)"; cctx.lineWidth = big ? 1.4 : 1.1;
      cctx.beginPath(); cctx.arc(it.x, it.y, r, 0, 6.2832); cctx.fill(); cctx.stroke();
      if (big) { cctx.fillStyle = "#f3dca0"; cctx.beginPath(); cctx.arc(it.x, it.y, 1.1, 0, 6.2832); cctx.fill(); }
      // label (skip if it would collide with one already placed)
      const fs = big ? 11 : 9.5;
      cctx.font = `${fs}px "Cinzel", serif`;
      const txt = it.name.toUpperCase();
      const w = cctx.measureText(txt).width + txt.length * 1.2;
      const hit = (b) => placed.some((p) => b[0] < p[2] && b[2] > p[0] && b[1] < p[3] && b[3] > p[1]);
      let box = [it.x + r + 4, it.y - fs * 0.7, it.x + r + 4 + w, it.y + fs * 0.7], left = false;
      if (hit(box)) {                         // try the other side of the dot before giving up
        box = [it.x - r - 4 - w, it.y - fs * 0.7, it.x - r - 4, it.y + fs * 0.7]; left = true;
        if (hit(box)) continue;
      }
      placed.push(box);
      cctx.letterSpacing = "1.2px";
      cctx.textAlign = "left";
      cctx.lineWidth = 2.4; cctx.strokeStyle = "rgba(8,5,2,.6)"; cctx.strokeText(txt, box[0], it.y + 0.5);
      cctx.fillStyle = big ? "#fff3cf" : "#e8dab4"; cctx.fillText(txt, box[0], it.y + 0.5);
    }
    cctx.letterSpacing = "0px";
  }

  const romeEl = $("rome");
  function placeRome() {
    const p = proj(ROME);
    romeEl.style.transform = `translate(${p[0] * T.k + T.x}px, ${p[1] * T.k + T.y}px)`;
  }

  function updatePanel(year) {
    $("yearBig").textContent = year;
    $("roman").textContent = roman(year);
    $("catTotal").textContent = year < 33 ? "none yet" : fmtTotal(totalMillions);
    const pop = lerpTable(WORLD_POP, year);
    const pct = (totalMillions / pop) * 100;
    $("catPct").textContent = year < 33 ? "—" : pct < 0.1 ? "< 0.1%" : pct.toFixed(pct < 10 ? 1 : 0) + "%";
    let ev = EVENTS[0];
    for (const e of EVENTS) if (e[0] <= year) ev = e;
    document.querySelectorAll("#pins button").forEach((b) => b.classList.toggle("on", +b.dataset.y === ev[0]));
  }

  // ---------------------------------------------------------------- frame + compass
  function drawFrame() {
    if (W < 60 || H < 60) return;
    const f = $("frame");
    f.setAttribute("viewBox", `0 0 ${W} ${H}`);
    f.innerHTML = `<rect x="9" y="9" width="${W - 18}" height="${H - 18}" fill="none" stroke="#e2bb62" stroke-opacity=".28" stroke-width="1"/>`;
  }

  // ---------------------------------------------------------------- zoom
  let dragging = false, queued = false, camMoving = false, camSelfCall = false;
  const zoom = d3.zoom().scaleExtent([1, 90])
    .on("start", (e) => { stage.classList.add("dragging"); if (e.sourceEvent && !camSelfCall) setCinema(false); })
    .on("zoom", (e) => { T = e.transform; dragging = true; schedule(true); })
    .on("end", () => { stage.classList.remove("dragging"); dragging = false; schedule(true); })
    .filter((e) => !e.target.closest("#controls, #zoomBtns, #info, #top-bar, #intro, #splash, #foot") && (!e.ctrlKey || e.type === "wheel") && !e.button);
  d3.select(stage).call(zoom).on("dblclick.zoom", null);
  d3.select(stage).on("dblclick", (e) => {
    if (e.target.closest("#controls, #zoomBtns, #info, #intro")) return;
    setCinema(false);
    d3.select(stage).transition().duration(350).call(zoom.scaleBy, 2, d3.pointer(e, stage));
  });
  $("zin").onclick = () => { setCinema(false); d3.select(stage).transition().duration(300).call(zoom.scaleBy, 1.7); };
  $("zout").onclick = () => { setCinema(false); d3.select(stage).transition().duration(300).call(zoom.scaleBy, 1 / 1.7); };
  $("zhome").onclick = () => { setCinema(false); d3.select(stage).transition().duration(600).call(zoom.transform, d3.zoomIdentity); };
  const viewCY = () => {
    const barH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--bar-h")) || 132;
    const topH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--top-h")) || 54;
    return (topH + H - barH) / 2;
  };
  function flyTo(lonlat, k) {
    const p = proj(lonlat);
    const t = d3.zoomIdentity.translate(W / 2 - p[0] * k, viewCY() - p[1] * k).scale(k);
    d3.select(stage).transition().duration(1100).call(zoom.transform, t);
  }
  $("zrome").onclick = () => { setCinema(false); flyTo(ROME, 9); };

  // ---------------------------------------------------------------- render loop
  let year = MAX_YEAR, needMap = true;
  function schedule(map) { if (map) needMap = true; if (queued) return; queued = true; requestAnimationFrame(render); }
  function render() {
    queued = false;
    const sy = snapFor(year);
    if (!currentSnap || currentSnap.year !== sy) { currentSnap = loadSnap(sy); needMap = true; $("snapYear").textContent = sy === 1 ? "1 BC" : sy >= 2020 ? "the present" : "c. " + sy; }
    if (needMap) { drawMap(); needMap = false; }
    const flashing = drawPeople();
    drawCities();
    placeRome();
    placeFocus();
    if (flashing) schedule(false);
  }

  function setYear(y, fromSlider, animate) {
    year = Math.max(MIN_YEAR, Math.min(MAX_YEAR, Math.round(y)));
    if (!fromSlider) slider.value = year;
    computeYear(year, animate);
    updatePanel(year);
    if (window.Music) Music.setIntensity(0.2 + 0.72 * Math.pow((year - 1) / 2025, 0.7));
    schedule(false);
  }
  // ================================================================ the director
  const MAJOR = new Set([33, 64, 313, 325, 330, 380, 451, 496, 597, 622, 638, 800, 988, 1054, 1095, 1206, 1348, 1453, 1492, 1517, 1531, 1545, 1549, 1565, 1776, 1789, 1870, 1914, 1939, 1962, 1978, 1989, 2013, 2025]);
  const R = [12.5, 41.9], JER = [35.22, 31.78], CPL = [28.98, 41.01], AVI = [4.8, 43.95], CAR = [10.2, 36.85], BER = [13.4, 52.52];
  const LOC = {
    33: [...JER, 9], 49: [...JER, 9], 64: [...R, 10], 70: [...JER, 9], 107: [36.16, 36.2, 8], 117: [35, 34, 4], 177: [4.83, 45.76, 9], 220: [112.45, 34.62, 6], 224: [44.58, 33.09, 7],
    250: [...R, 7], 303: [29.9, 40.77, 9], 313: [9.19, 45.46, 9], 325: [29.72, 40.43, 10], 330: [...CPL, 10], 380: [...CPL, 10], 395: [...CPL, 8], 397: [...CAR, 9], 410: [...R, 10],
    431: [27.35, 37.94, 10], 451: [29.03, 40.99, 10], 476: [12.2, 44.42, 9], 496: [4.03, 49.25, 9], 529: [13.81, 41.49, 10], 590: [...R, 10], 597: [1.08, 51.28, 9], 622: [39.6, 24.47, 6],
    638: [...JER, 9], 698: [...CAR, 9], 732: [0.69, 47.39, 9], 754: [...R, 9], 762: [44.36, 33.31, 8], 800: [...R, 10], 863: [17.1, 48.9, 8], 910: [4.66, 46.43, 10], 966: [17.6, 52.53, 9],
    988: [30.52, 50.45, 9], 1000: [18.74, 47.79, 9], 1054: [...CPL, 10], 1066: [0.48, 50.91, 9], 1077: [10.45, 44.58, 10], 1095: [3.08, 45.78, 9], 1204: [...CPL, 10], 1206: [102.84, 47.2, 4.5],
    1209: [12.62, 43.07, 10], 1215: [...R, 10], 1271: [12.33, 45.44, 9], 1274: [4.83, 45.76, 9], 1309: [...AVI, 10], 1348: [10, 45, 4.5], 1368: [118.8, 32.06, 6], 1378: [...AVI, 10],
    1439: [11.25, 43.77, 10], 1453: [...CPL, 10], 1492: [-74.5, 24, 5], 1498: [75.78, 11.25, 7], 1517: [12.65, 51.87, 9], 1531: [-99.13, 19.43, 9], 1540: [...R, 10], 1545: [11.12, 46.07, 10],
    1549: [130.55, 31.6, 8], 1565: [123.9, 10.3, 8], 1571: [21.3, 38.37, 9], 1583: [112.45, 23.05, 7], 1588: [-2, 49.5, 6], 1607: [-76.78, 37.21, 9], 1622: [...R, 10], 1634: [-76.4, 38.2, 9],
    1648: [7.63, 51.96, 9], 1773: [...R, 10], 1776: [-75.16, 39.95, 9], 1789: [2.35, 48.85, 10], 1815: [4.41, 50.68, 9], 1854: [...R, 10], 1861: [7.69, 45.07, 9], 1870: [...R, 10], 1891: [...R, 10],
    1914: [18.41, 43.86, 9], 1917: [-8.67, 39.63, 10], 1929: [...R, 11], 1939: [21.01, 52.23, 8], 1945: [...BER, 8], 1949: [116.4, 39.9, 7], 1962: [...R, 11], 1978: [...R, 11],
    1989: [...BER, 9], 2000: [...R, 11], 2005: [...R, 11], 2013: [...R, 11], 2020: [...R, 9], 2025: [...R, 11],
  };
  const evOf = new Map(EVENTS.map((e) => [e[0], e]));
  const spotEl = $("spot"), focusEl = $("focus"), splash = $("splash"), growthEl = $("growth");
  let cinema = true, cam = null, camTarget = null, focusLL = null;
  let hold = 0, splashTimer = 0, finished = false, evPhase = null /* 'flying' | 'holding' | null */, flight = null;

  const speedBtns = [...document.querySelectorAll("#speed button")];
  const speedVal = () => +speedBtns.find((b) => b.classList.contains("on")).dataset.v;
  const pace = () => +speedBtns.find((b) => b.classList.contains("on")).dataset.pace; // longer on slow, shorter on fast
  speedBtns.forEach((b) => b.addEventListener("click", () => { speedBtns.forEach((x) => x.classList.toggle("on", x === b)); }));

  function setCinema(on) {
    if (cinema === on) return;
    cinema = on;
    $("cine").classList.toggle("on", on);
    $("cine").setAttribute("aria-pressed", on);
    if (!on) { cam = null; camTarget = null; flight = null; growthEl.classList.remove("on"); camMoving = false; if (evPhase === "flying") arriveEvent(); }
  }
  $("cine").onclick = () => { setCinema(!cinema); if (cinema && !playing) idleView(); };

  // ---- camera: every move is a flight that pulls back and settles in again, never a cut
  const ease = (u) => -(Math.cos(Math.PI * u) - 1) / 2;   // gentle sine in-out: no abrupt starts or stops
  const viewState = () => cam || { cx: (W / 2 - T.x) / T.k, cy: (viewCY() - T.y) / T.k, lk: Math.log(T.k) };
  function aim(lonlat, k, opts = {}) {
    const p = proj(lonlat);
    camTarget = { cx: p[0], cy: p[1], k, ll: lonlat };
    const from = viewState();
    const dist = Math.hypot(camTarget.cx - from.cx, camTarget.cy - from.cy);
    const lk1 = Math.log(k), dlk = Math.abs(lk1 - from.lk);
    if (!cam) cam = { ...from };
    if (dist < 3 && dlk < 0.04) { flight = null; if (opts.onDone) opts.onDone(); return; }
    // pull back in the middle of the move: more for long hops, never below the whole-world view
    // same city or neighbourhood: glide, don't zoom out. Only a real change of place pulls the camera back.
    const near = dist < WW * 0.03 && dlk < 0.8;
    const avg = (from.lk + lk1) / 2;
    const dip = near ? 0 : Math.max(0, Math.min(avg * 0.92, 0.95 + 1.0 * Math.min(1, dist / (WW * 0.5))));
    const dur = (opts.dur || (near ? 2.2 + 0.5 * dlk : 3.0 + 1.8 * Math.min(1, dist / (WW * 0.7)) + 0.6 * dlk)) * (opts.fixed ? 1 : pace() ** 0.5);
    flight = { t0: performance.now(), dur: dur * 1000, from: { ...from }, to: { cx: camTarget.cx, cy: camTarget.cy, lk: lk1 }, dip, onDone: opts.onDone };
  }
  function camStep(now) {
    if (!cinema || !cam) return;
    const cyView = viewCY();
    let moving = false;
    if (flight) {
      const u = Math.min(1, (now - flight.t0) / flight.dur), e = ease(u);
      cam.cx = flight.from.cx + (flight.to.cx - flight.from.cx) * e;
      cam.cy = flight.from.cy + (flight.to.cy - flight.from.cy) * e;
      cam.lk = Math.max(0, flight.from.lk + (flight.to.lk - flight.from.lk) * e - flight.dip * Math.sin(Math.PI * u));
      moving = true;
      if (u >= 1) { const f = flight; flight = null; moving = false; if (f.onDone) f.onDone(); }
    } else if (camTarget) {
      // barely-there handheld drift so the frame never feels frozen
      const t = now / 1000, k0 = camTarget.k;
      cam.cx = camTarget.cx + Math.sin(t * 0.37) * 1.6 / k0;
      cam.cy = camTarget.cy + Math.cos(t * 0.29) * 1.1 / k0;
      cam.lk = Math.log(k0);
    }
    const k = Math.exp(cam.lk);
    camSelfCall = true;
    d3.select(stage).call(zoom.transform, d3.zoomIdentity.translate(W / 2 - cam.cx * k, cyView - cam.cy * k).scale(k));
    camSelfCall = false;
    if (camMoving && !moving) schedule(true);
    camMoving = moving;
  }
  (function camLoop() {
    const tick = (ts) => { camStep(performance.now()); requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  })();

  // ---- where the Church is growing
  const centroid = D.pts.map(() => null);
  function centroidOf(i) {
    if (centroid[i]) return centroid[i];
    const a = pplXY[i], n = Math.min(a.length / 2, 400);
    let sx = 0, sy = 0;
    for (let j = 0; j < n; j++) { sx += a[j * 2]; sy += a[j * 2 + 1]; }
    return (centroid[i] = [sx / n, sy / n]);
  }
  const radiusCache = [];
  function radiusOf(i) {
    if (radiusCache[i] != null) return radiusCache[i];
    const c = centroidOf(i), arr = pplXY[i], n = Math.min(arr.length / 2, 400);
    let s = 0;
    for (let j = 0; j < n; j++) s += (arr[j * 2] - c[0]) ** 2 + (arr[j * 2 + 1] - c[1]) ** 2;
    return (radiusCache[i] = Math.sqrt(s / n));
  }
  const niceName = (n) => ({ "United States of America": "United States", "Dem. Rep. Congo": "DR Congo", "Bosnia and Herz.": "Bosnia" }[n] || n);
  let lastGrowthKey = "", growthTick = 0;
  const unproj = (c) => proj.invert ? proj.invert(c) : [0, 0];
  function steerToGrowth(force) {
    const win = 45, y0 = year, y1 = Math.min(MAX_YEAR, year + win);
    const back = y1 - y0 < win * 0.6;
    const a = back ? Math.max(MIN_YEAR, year - win) : y0, b = back ? year : y1;
    const rows = [];
    for (let i = 0; i < D.names.length; i++) {
      const d = countAtYear(i, b) - countAtYear(i, a);
      if (d > 0) rows.push([i, d]);
    }
    rows.sort((p, q) => q[1] - p[1]);
    const top = rows.slice(0, 3);
    if (!top.length || year < 33) { idleView(); growthEl.classList.remove("on"); return; }
    if (!force) growthTick++;
    const idx = growthTick % top.length;
    const [ci] = top[idx];
    const c = centroidOf(ci), rad = radiusOf(ci);
    const k = Math.max(2.4, Math.min(7.5, (Math.min(W, H - 190) * 0.62) / (rad * 2 + 40)));
    const ll = proj.invert([c[0], c[1]]);
    aim(ll, k);
    const html = top.map(([i], n) => (n === idx ? `<span class="cur">${niceName(D.names[i])}</span>` : niceName(D.names[i]))).join(" · ");
    if (html !== lastGrowthKey) { lastGrowthKey = html; $("growthList").innerHTML = html; }
    growthEl.classList.toggle("on", !!playing && cinema && !evPhase);
  }
  // a calm wide view of the world as it stands that year
  function idleView() { aim(year < 33 ? [20, 36] : [14, 38], year < 33 ? 1.4 : 1.7); }

  // ---- event title cards
  function showSplash(ev) {
    $("sYear").textContent = (ev[3] ? "Circa " : "") + "A.D. " + ev[0] + (ev[4] === "w" ? " · The World" : "");
    $("sTitle").textContent = ev[1];
    $("sText").textContent = ev[2];
    splash.classList.add("on");
  }
  function hideSplash() {
    clearTimeout(splashTimer);
    splash.classList.remove("on"); spotEl.classList.remove("on"); focusEl.classList.remove("on");
    focusLL = null; hold = 0; evPhase = null;
  }
  function placeFocus() {
    if (!focusLL) return;
    const p = proj(focusLL), x = p[0] * T.k + T.x, y = p[1] * T.k + T.y;
    focusEl.style.transform = `translate(${x}px, ${y}px)`;
    spotEl.style.setProperty("--sx", x + "px"); spotEl.style.setProperty("--sy", y + "px");
  }
  let curEvent = null, curManual = false, curMinor = false;
  const kmBetween = (p, q) => {
    const r = Math.PI / 180, dLat = (q[1] - p[1]) * r, dLon = (q[0] - p[0]) * r;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(p[1] * r) * Math.cos(q[1] * r) * Math.sin(dLon / 2) ** 2;
    return 12742 * Math.asin(Math.sqrt(h));
  };
  // is the next great moment in the same part of the world as where the camera already is?
  function nextMajorNearby() {
    if (!camTarget || !camTarget.ll) return false;
    for (const e of EVENTS) if (e[0] > year && MAJOR.has(e[0])) {
      const l = LOC[e[0]];
      return !!l && e[0] - year < 160 && kmBetween(camTarget.ll, [l[0], l[1]]) < 850;
    }
    return false;
  }
  function arriveEvent() {                 // the camera has settled: reveal the card
    if (!curEvent) return;
    evPhase = "holding"; curMinor = false;
    showSplash(curEvent);
    focusEl.classList.add("on"); spotEl.classList.add("on");
    if (window.Music) Music.hit(MAJOR.has(curEvent[0]) ? 1 : 0.6);
    if (curManual) { clearTimeout(splashTimer); splashTimer = setTimeout(() => { if (evPhase === "holding" && !playing) { splash.classList.remove("on"); spotEl.classList.remove("on"); } }, 12000); }
    else hold = (curEvent[0] === 33 ? 6.5 : 5) * pace();
  }
  function beginEvent(ev, manual) {
    const loc = LOC[ev[0]] || [...R, 9];
    curEvent = ev; curManual = !!manual;
    splash.classList.remove("on"); spotEl.classList.remove("on");
    focusLL = [loc[0], loc[1]];
    growthEl.classList.remove("on");
    clearTimeout(splashTimer);
    evPhase = "flying";
    if (cinema) aim(focusLL, loc[2], { onDone: arriveEvent });
    else arriveEvent();
  }
  function beginMinor(ev) {                // a lesser milestone: time pauses and the card lingers, the camera stays put
    curEvent = ev; curMinor = true;
    showSplash(ev);
    evPhase = "holding"; hold = 3.4 * pace();
    // if it happened close by, let the camera glide there (no zoom-out); otherwise stay with the story
    const l = LOC[ev[0]];
    if (cinema && l && camTarget && camTarget.ll && kmBetween(camTarget.ll, [l[0], l[1]]) < 850) aim([l[0], l[1]], l[2]);
  }
  function finale() {
    stopPlay(); finished = true;
    const pop = lerpTable(WORLD_POP, MAX_YEAR);
    curEvent = [MAX_YEAR, "The Church Today", `About ${fmtPeople(totalMillions)} Catholics, roughly one in ${Math.round(pop / totalMillions)} people alive, in every land on earth.`];
    curManual = true; focusLL = null;
    splash.classList.remove("on");
    growthEl.classList.remove("on");
    evPhase = "flying";
    const done = () => { evPhase = "holding"; curMinor = false; if (window.Music) Music.hit(1.3); showSplash(curEvent); clearTimeout(splashTimer); splashTimer = setTimeout(() => { splash.classList.remove("on"); evPhase = null; }, 14000); };
    if (cinema) aim([10, 22], 1.05, { onDone: done, fixed: true, dur: 4 }); else done();
  }

  // ---- stepping between events
  const NAV = EVENTS.filter((e) => e[0] > 1);
  function goEvent(dir) {
    stopPlay();
    const cands = dir > 0 ? NAV.filter((e) => e[0] > year) : NAV.filter((e) => e[0] < year).reverse();
    const ev = cands[0];
    if (!ev) { if (dir > 0 && year < MAX_YEAR) { setYear(MAX_YEAR); finale(); } return; }
    if (!cinema) setCinema(true);
    setYear(ev[0], false, true);
    beginEvent(ev, true);
  }
  $("prevEv").onclick = () => goEvent(-1);
  $("nextEv").onclick = () => goEvent(1);

  // ---- scrubbing the slider: a label follows the thumb, the story settles when you let go
  const scrubTip = $("scrubTip");
  let scrubTimer = 0;
  function updateScrubTip() {
    let near = null;
    for (const e of NAV) if (Math.abs(e[0] - year) <= Math.max(6, year * 0.01) && (!near || Math.abs(e[0] - year) < Math.abs(near[0] - year))) near = e;
    scrubTip.innerHTML = `${year}${near ? `<small>${near[1]}</small>` : ""}`;
    const w = slider.clientWidth - 13;
    scrubTip.style.left = 6.5 + ((year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * w + "px";
  }
  function settleOnYear() {
    scrubTip.classList.remove("on");
    let ev = null;
    for (const e of NAV) if (e[0] <= year) ev = e;
    if (ev && year - ev[0] <= 35) { if (!cinema) setCinema(true); beginEvent(ev, true); }
    else if (cinema) { hideSplash(); steerToGrowth(true); }
  }
  slider.addEventListener("input", () => {
    stopPlay(); hideSplash();
    setYear(+slider.value, true);
    updateScrubTip(); scrubTip.classList.add("on");
    clearTimeout(scrubTimer); scrubTimer = setTimeout(settleOnYear, 650);
  });

  // ================================================================ play
  let playing = false, last = 0, growthClock = 0;
  const playBtn = $("play"), playIc = playBtn.querySelector(".ic"), playTx = playBtn.querySelector(".tx");
  function frame(ts) {
    if (!playing) return;
    const dt = Math.min(0.1, (ts - last) / 1000); last = ts;
    if (evPhase === "flying") { requestAnimationFrame(frame); return; }   // the camera is travelling; time waits
    if (evPhase === "holding") {                                          // the story pauses on a great moment
      hold -= dt;
      if (hold <= 0) {
        hold = 0; evPhase = null;
        const wasMinor = curMinor; curMinor = false;
        splash.classList.remove("on"); spotEl.classList.remove("on"); focusEl.classList.remove("on"); focusLL = null;
        growthClock = 0;
        // pull back out toward the growth only if the story is about to move somewhere else
        if (cinema && !wasMinor && !nextMajorNearby()) steerToGrowth(true);
      }
      requestAnimationFrame(frame); return;
    }
    // time slows as the Church's growth gets faster, so the camera can linger on it
    const slow = cinema ? (year < 1400 ? 1 : year < 1800 ? 0.75 : year < 1900 ? 0.5 : 0.3) : 1;
    frame.acc = (frame.acc || 0) + speedVal() * slow * dt;
    const step = Math.floor(frame.acc);
    if (step >= 1) {
      frame.acc -= step;
      const target = Math.min(MAX_YEAR, year + step);
      const ev = EVENTS.find((e) => e[0] > year && e[0] <= target && e[0] > 1);
      if (ev && ev[0] < MAX_YEAR) {
        setYear(ev[0], false, true);
        if (MAJOR.has(ev[0])) beginEvent(ev, false); else beginMinor(ev);
        requestAnimationFrame(frame); return;
      }
      if (target >= MAX_YEAR) { setYear(MAX_YEAR, false, true); finale(); return; }
      setYear(target, false, true);
    }
    growthClock += dt;
    if (cinema && growthClock > 6.5 * pace() && !flight && !nextMajorNearby()) { growthClock = 0; steerToGrowth(false); }
    requestAnimationFrame(frame);
  }
  function startPlay() {
    hideSplash(); finished = false; scrubTip.classList.remove("on"); clearTimeout(scrubTimer);
    if (year >= MAX_YEAR) setYear(MIN_YEAR);
    playing = true; playIc.textContent = "❚❚"; playTx.textContent = "Pause"; playBtn.setAttribute("aria-label", "Pause");
    last = performance.now(); frame.acc = 0; growthClock = 0;
    if (cinema) steerToGrowth(true);
    requestAnimationFrame(frame);
  }
  function stopPlay() { if (!playing) return; playing = false; playIc.textContent = "▶"; playTx.textContent = "Time-lapse"; playBtn.setAttribute("aria-label", "Play time-lapse"); growthEl.classList.remove("on"); }
  playBtn.onclick = () => (playing ? stopPlay() : startPlay());
  window.addEventListener("keydown", (e) => {
    if (e.target.tagName === "SELECT" || document.body.classList.contains("intro-on")) return;
    if (e.key === " " && e.target !== slider && e.target.tagName !== "BUTTON") { e.preventDefault(); playing ? stopPlay() : startPlay(); }
    else if ((e.key === "ArrowRight" || e.key === "ArrowLeft") && e.target !== slider) { e.preventDefault(); goEvent(e.key === "ArrowRight" ? 1 : -1); }
  });

  // ---------------------------------------------------------------- slider furniture
  function buildTimeline() {
    const ticks = $("ticks"), pins = $("pins");
    const pct = (y) => ((y - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100;
    for (const y of [1, 250, 500, 750, 1000, 1250, 1500, 1750, 2026]) {
      const s = document.createElement("span"); s.style.left = pct(y) + "%"; s.textContent = y === 1 ? "1 A.D." : y; ticks.appendChild(s);
    }
    const tip = $("tip");
    const pinEls = [];
    for (const [y, title] of EVENTS) {
      if (y === 1) continue;
      const b = document.createElement("button");
      b.style.left = pct(y) + "%"; b.dataset.y = y; b.setAttribute("aria-label", `${title}, ${y}`);
      if (MAJOR.has(y)) b.classList.add("major");
      if (evOf.get(y)[4] === "w") b.classList.add("world");
      b.addEventListener("click", () => { stopPlay(); setYear(y); beginEvent(evOf.get(y), true); });
      b.addEventListener("mouseenter", () => {
        const r = b.getBoundingClientRect();
        tip.innerHTML = `<b>${title}</b> \u00b7 ${y}`;
        tip.style.left = Math.max(8, Math.min(W - 240, r.left - 60)) + "px"; tip.style.top = r.top - 36 + "px"; tip.classList.add("on");
      });
      b.addEventListener("mouseleave", () => tip.classList.remove("on"));
      pins.appendChild(b); pinEls.push(b);
    }
    // stagger pins into rows so neighbours never sit on top of each other
    layoutPins = () => {
      const w = pins.clientWidth || 1, rowsX = [-99, -99, -99];
      for (const b of pinEls) {
        const x = ((+b.dataset.y - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * w;
        let row = rowsX.findIndex((rx) => x - rx >= 11);
        if (row < 0) row = rowsX.indexOf(Math.min(...rowsX));
        rowsX[row] = x;
        b.style.top = 1 + row * 14 + "px";
      }
    };
    layoutPins();
  }
  let layoutPins = () => {};

  // ---------------------------------------------------------------- go
  year = MIN_YEAR; slider.value = year;
  buildTimeline();
  setup();
  computeYear(year);
  updatePanel(year);
  aim([20, 36], 1.0, { fixed: true, dur: 0.01 });
  schedule(true);
  // drifting embers
  (() => {
    const m = $("motes");
    for (let i = 0; i < 12; i++) {
      const el = document.createElement("i");
      el.style.left = Math.random() * 100 + "%";
      el.style.animationDuration = 12 + Math.random() * 16 + "s";
      el.style.animationDelay = -Math.random() * 20 + "s";
      el.style.setProperty("--dx", (Math.random() * 120 - 40) + "px");
      const s = 1.5 + Math.random() * 2.5; el.style.width = el.style.height = s + "px";
      m.appendChild(el);
    }
  })();
  const closeIntro = () => document.body.classList.remove("intro-on");
  // ---- music: starts on the first click (browsers require a gesture), with volume and mute
  const volEl = $("vol"), muteBtn = $("mute");
  let vol = 0.55, muted = false;
  try { const sv = JSON.parse(localStorage.getItem("orbis-audio") || "{}"); if (typeof sv.vol === "number") vol = sv.vol; if (sv.muted) muted = true; } catch (e) {}
  const paintAudio = () => {
    volEl.value = Math.round(vol * 100);
    muteBtn.classList.toggle("muted", muted || vol === 0);
    muteBtn.parentElement.classList.toggle("is-muted", muted || vol === 0);
    muteBtn.setAttribute("aria-label", muted ? "Unmute music" : "Mute music");
  };
  const saveAudio = () => { try { localStorage.setItem("orbis-audio", JSON.stringify({ vol, muted })); } catch (e) {} };
  function setAudio() { if (!window.Music) return; Music.setVolume(vol); Music.setMuted(muted); paintAudio(); saveAudio(); }
  volEl.addEventListener("input", () => { vol = +volEl.value / 100; if (vol > 0) muted = false; if (window.Music) Music.start(); setAudio(); });
  muteBtn.addEventListener("click", () => { muted = !muted; if (!muted && vol === 0) vol = 0.55; if (window.Music) Music.start(); setAudio(); });
  window.addEventListener("keydown", (e) => { if (e.key === "m" || e.key === "M") { muted = !muted; if (window.Music) Music.start(); setAudio(); } });
  const startMusic = () => { if (!window.Music) return; Music.start(); setAudio(); };
  paintAudio();

  // primary: explore the timeline by hand. secondary: sit back and watch the time-lapse.
  $("begin").onclick = () => { startMusic(); closeIntro(); setCinema(true); finished = false; setYear(33); beginEvent(evOf.get(33), true); };
  $("explore").onclick = () => { startMusic(); closeIntro(); setCinema(true); finished = false; setYear(MIN_YEAR); setTimeout(startPlay, 1400); };
  let rz;
  window.addEventListener("resize", () => {
    clearTimeout(rz);
    rz = setTimeout(() => {
      const tgt = camTarget, phase = evPhase;
      layoutPins(); setup(); cam = null; flight = null; T = d3.zoomIdentity;
      camSelfCall = true; d3.select(stage).call(zoom.transform, d3.zoomIdentity); camSelfCall = false;
      if (cinema && tgt) aim(tgt.ll, tgt.k, { fixed: true, dur: 0.01, onDone: phase === "flying" ? arriveEvent : undefined });
      schedule(true);
    }, 120);
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => schedule(true));
  window.__app = { render, drawMap, setYear: (y, anim) => setYear(y, false, anim), flyTo, beginEvent, finale, evOf, steerToGrowth, startPlay, setCinema, goEvent, get T() { return T; }, dbg: () => ({ cam, camTarget, W, H, cinema, base, yTop, yBot }) };
})();
