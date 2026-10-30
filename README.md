# Supergay stockists

The store locator on supergayspirits.com/find-us.

- `stockists.json` — every place that pours or sells Supergay, rebuilt daily from the Supergay Sales Dashboard map.
- `supergay-locator.js` — the map and list. Mapbox GL with a Mapbox token, MapLibre + OpenFreeMap without one.
- `build_stockists.py` — builds `stockists.json` from the dashboard's data files.
- `exclude.json` — who stays off the public map: reps, spirit specialists, warehouses.
- `web_addresses.json` — street addresses found online for accounts the distributor reports list without one.

## Webflow embed

```html
<div id="sg-locator"
     data-src="https://cdn.jsdelivr.net/gh/tomjjackson/supergay-stockists@main/stockists.json"
     data-mapbox-token="pk.YOUR_PUBLIC_TOKEN"></div>
<script src="https://cdn.jsdelivr.net/gh/tomjjackson/supergay-stockists@main/supergay-locator.js" defer></script>
```

Deep link to one place: `/find-us?location=<id>`.
