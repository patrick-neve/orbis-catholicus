const fs = require("fs");
const path = require("path");
const topojson = require("topojson-client");
const { CATHOLICS, FOCI } = require("./catholics");
const { parseSeries, valueAt } = require("./lib");

// ---------- maps ----------
const snapFiles = fs.readdirSync(path.join(__dirname, "topo")).filter((f) => f.endsWith(".json"));
const maps = {};
for (const f of snapFiles) {
  const key = f.replace("world_", "").replace(".json", "");
  const year = key === "bc1" ? 1 : +key;
  const t = JSON.parse(fs.readFileSync(path.join(__dirname, "topo", f)));
  const objName = Object.keys(t.objects)[0];
  t.objects = { polys: t.objects[objName] };
  maps[year] = t;
}
// modern borders for the present day
const atlas = JSON.parse(fs.readFileSync(path.join(__dirname, "node_modules/world-atlas/countries-50m.json")));
const modern = { type: "Topology", arcs: atlas.arcs, transform: atlas.transform, objects: {
  polys: { type: "GeometryCollection", geometries: atlas.objects.countries.geometries
    .filter((g) => g.properties.name !== "Antarctica")
    .map((g) => ({ ...g, properties: { NAME: g.properties.name, SUBJECTO: g.properties.name } })) } } };
maps[2020] = modern;
const snaps = Object.keys(maps).map(Number).sort((a, b) => a - b);

// ---------- people ----------
function rng(seed) {
  let a = seed >>> 0;
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const CLIP = {
  "France": [-5.2, 41.3, 9.7, 51.2], "Netherlands": [3.2, 50.7, 7.3, 53.6], "Portugal": [-9.6, 36.9, -6.1, 42.2],
  "Spain": [-9.6, 35.9, 4.5, 43.9], "Norway": [4, 58, 31, 71.2], "Chile": [-76, -56, -66, -17],
  "United States of America": [-125, 24, -66, 49.5], "Canada": [-141, 42, -52, 60], "Russia": [27, 43, 60, 62],
  "Denmark": [8, 54.5, 15.5, 58], "Greece": [19, 34.5, 28.5, 41.8], "Brazil": [-74, -34, -34, 5.5], "Australia": [112, -39, 154, -10],
  "Kazakhstan": [46, 40, 88, 55], "Malaysia": [99, 0.8, 120, 7.5], "Mexico": [-118, 14, -86, 32.5],
  "India": [68, 6, 97, 36], "China": [75, 18, 135, 50], "Indonesia": [95, -11, 141, 6],
  "Ecuador": [-81.5, -5, -75, 1.5],
};
const geoms = atlas.objects.countries.geometries;
const feats = topojson.feature(atlas, atlas.objects.countries).features;
const byName = new Map(feats.map((f) => [f.properties.name, f]));

function inRing(x, y, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1], xj = ring[j][0], yj = ring[j][1];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
function polysOf(f) {
  const g = f.geometry;
  const polys = g.type === "Polygon" ? [g.coordinates] : g.coordinates;
  return polys.map((rings) => {
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    for (const [x, y] of rings[0]) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    return { rings, bbox: [x0, y0, x1, y1] };
  });
}
function inside(parts, x, y) {
  for (const p of parts) {
    const b = p.bbox;
    if (x < b[0] || x > b[2] || y < b[1] || y > b[3]) continue;
    if (!inRing(x, y, p.rings[0])) continue;
    let hole = false;
    for (let k = 1; k < p.rings.length; k++) if (inRing(x, y, p.rings[k])) { hole = true; break; }
    if (!hole) return true;
  }
  return false;
}
const toY = (lat) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
const toLat = (y) => (Math.atan(Math.sinh(y)) * 180) / Math.PI;
function gauss(r) { return Math.sqrt(-2 * Math.log(r() || 1e-9)) * Math.cos(2 * Math.PI * r()); }

function countAt(m) { return m < 0.004 ? 0 : Math.max(1, Math.round(m * 100)); }

const names = [], series = [], pts = [];
let total = 0;
for (const [name, ser] of Object.entries(CATHOLICS)) {
  const f = byName.get(name);
  if (!f) { console.warn("no geometry for", name); continue; }
  const s = parseSeries(ser);
  let peak = 0;
  for (let y = 1; y <= 2026; y++) peak = Math.max(peak, countAt(valueAt(s, y)));
  if (!peak) continue;
  const parts = polysOf(f);
  const clip = CLIP[name];
  const foci = FOCI[name];
  const r = rng([...name].reduce((a, c) => a * 31 + c.charCodeAt(0), 7));
  // area weights for polygon parts (bbox area proxy, clipped)
  const usable = parts.filter((p) => {
    if (!clip) return true;
    const b = p.bbox; return b[2] >= clip[0] && b[0] <= clip[2] && b[3] >= clip[1] && b[1] <= clip[3];
  });
  const weights = usable.map((p) => { const b = p.bbox; return Math.max(1e-4, (b[2] - b[0]) * (b[3] - b[1])); });
  const wsum = weights.reduce((a, b) => a + b, 0);
  const out = [];
  let guard = 0;
  while (out.length < peak * 2 && guard++ < peak * 4000) {
    let x, y;
    if (foci) {
      const tw = foci.reduce((a, c) => a + c[3], 0); let pick = r() * tw, fo = foci[0];
      for (const c of foci) { pick -= c[3]; if (pick <= 0) { fo = c; break; } }
      x = fo[0] + gauss(r) * fo[2]; y = fo[1] + gauss(r) * fo[2] * 0.8;
    } else {
      let pick = r() * wsum, p = usable[0];
      for (let i = 0; i < usable.length; i++) { pick -= weights[i]; if (pick <= 0) { p = usable[i]; break; } }
      const b = p.bbox;
      x = b[0] + r() * (b[2] - b[0]);
      y = toLat(toY(Math.max(-80, b[1])) + r() * (toY(Math.min(80, b[3])) - toY(Math.max(-80, b[1]))));
    }
    if (clip && (x < clip[0] || x > clip[2] || y < clip[1] || y > clip[3])) continue;
    if (!inside(parts, x, y)) continue;
    out.push(Math.round(x * 100), Math.round(y * 100));
  }
  // keep only `peak` people (out has 2 numbers each); order is random
  const flat = out.slice(0, peak * 2);
  if (flat.length < peak * 2) console.warn(name, "only placed", flat.length / 2, "of", peak);
  names.push(name); series.push(s); pts.push(flat); total += flat.length / 2;
}
console.log("countries", names.length, "people drawn at peak", total);

const DATA = { snaps, maps, names, series, pts };
const js = "window.DATA=" + JSON.stringify(DATA) + ";";
fs.writeFileSync(path.join(__dirname, "../site/data.js"), js);
console.log("data.js", (js.length / 1e6).toFixed(1) + " MB");
