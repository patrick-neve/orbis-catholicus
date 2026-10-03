#!/bin/sh
# Re-download the historical border snapshots and simplify them into build/topo/.
set -e
cd "$(dirname "$0")"
mkdir -p ../raw topo
for y in bc1 100 200 300 400 500 600 700 800 900 1000 1100 1200 1279 1300 1400 1492 1500 1530 1600 1650 1700 1715 1783 1800 1815 1880 1900 1914 1920 1930 1938 1945 1960 1994 2000 2010; do
  curl -s -o ../raw/world_$y.geojson https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_$y.geojson
  npx mapshaper ../raw/world_$y.geojson -filter-fields NAME,SUBJECTO -simplify 7% keep-shapes -clean \
    -o topo/world_$y.json format=topojson quantization=20000
done
