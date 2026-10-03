# Orbis Catholicus

An old-world map of the growth of the Catholic Church, AD 1 to 2026. Drag the slider (or press play) and
the borders change with the centuries while little figures, each standing for 10,000 Catholics, fill the map.
A pulsing seal marks Rome.

## Run it

Open `site/index.html` in a browser (no server needed), or serve the folder:

    cd site && python3 -m http.server 8000

Controls: slider / play button, click a ✝ pin for a historical event, scroll or pinch to zoom, drag to pan,
✠ button flies to Rome. Space = play/pause, arrow keys = step through years.

## How it is built

- `build/catholics.js`  – Catholic population estimates per country (keyframes, millions) and where
  within big countries the people cluster. **These are rough, hand-assembled estimates** – edit them freely.
  Before 1054 the count is the undivided Church; afterwards only those in communion with Rome.
- `build/build.js`      – places one figure per 10,000 Catholics inside each country's land and bakes
  everything into `site/data.js` (`cd build && npm install && node build.js`).
- `build/fetch-and-simplify.sh` – downloads/simplifies the historical border snapshots (needs `npx mapshaper`).
- `site/`               – the static website (d3 + topojson-client, vendored in `site/lib`).

## Data credits & licensing

- Historical borders: [aourednik/historical-basemaps](https://github.com/aourednik/historical-basemaps) (GPL-3.0).
  Because the simplified border data ships inside `site/data.js`, check that licence before publishing the site.
- Modern borders: Natural Earth via `world-atlas` (public domain).
- Fonts: IM Fell, UnifrakturCook (SIL OFL).
