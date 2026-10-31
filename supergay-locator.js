/* Supergay Spirits — stockist locator (v1, Oct 30 2026)
   Drop into Webflow with:
     <div id="sg-locator"
          data-src="https://…/stockists.json"
          data-mapbox-token="pk.…"                (optional: without it the map runs on MapLibre + OpenFreeMap)
          data-mapbox-style="mapbox://styles/…"   (optional: a Mapbox Studio style; default light-v11)
     ></div>
     <script src="https://…/supergay-locator.js" defer></script>
   Data: window.SG_STOCKISTS (array) wins over data-src. Each row:
     {id, n, a, c, s, z, lat, lng, t: "on"|"off"|"", p: ["vodka","gin","cosmo","mule","mango","espresso","variety"], w?, ig?}
   Deep link: ?location=<id> opens that stockist. */
(function () {
  "use strict";
  var ROOT_ID = "sg-locator";
  var MAPBOX_JS = "https://api.mapbox.com/mapbox-gl-js/v3.7.0/mapbox-gl.js";
  var MAPBOX_CSS = "https://api.mapbox.com/mapbox-gl-js/v3.7.0/mapbox-gl.css";
  var LIBRE_JS = "https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js";
  var LIBRE_CSS = "https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css";
  var LIBRE_STYLE = "https://tiles.openfreemap.org/styles/positron";

  var PRODUCTS = {
    vodka: "Vodka", gin: "Fire Island Gin", cosmo: "Two Fruits Cosmo", mule: "Two Fruits Ginger Mule",
    mango: "Two Fruits Chili Mango Spritz", espresso: "Two Fruits Espresso Martini", variety: "Two Fruits Variety Pack"
  };
  var FRUITS = ["cosmo", "mule", "mango", "espresso", "variety"];
  var C = { ground: "#F1E9D8", ink: "#15110D", red: "#FF3D2E", forest: "#1F3B2E", line: "rgba(21,17,13,.18)" };

  var CSS = [
    "#sg-locator{--sg-bg:#F1E9D8;--sg-ink:#15110D;--sg-muted:#5c5348;--sg-line:rgba(21,17,13,.18);--sg-red:#FF3D2E;--sg-red-ink:#B8180C;--sg-forest:#1F3B2E;",
    "--sg-display:\"Funkis A\",\"FunkisA\",Anton,Oswald,Impact,sans-serif;--sg-body:\"Tiempos Text\",\"Source Serif 4\",Georgia,serif;--sg-mono:\"ABC ROM Mono\",\"IBM Plex Mono\",ui-monospace,Menlo,monospace;",
    "background:var(--sg-bg);color:var(--sg-ink);font-family:var(--sg-body);border-top:1px solid var(--sg-ink);border-bottom:1px solid var(--sg-ink);position:relative}",
    "#sg-locator *{box-sizing:border-box}",
    "#sg-locator{max-width:100%;overflow:hidden}",
    "#sg-locator .sg-wrap>*{min-width:0}",
    "#sg-locator .sg-wrap{display:grid;grid-template-columns:minmax(300px,400px) 1fr;height:min(760px,85vh);min-height:520px}",
    "#sg-locator .sg-side{display:flex;flex-direction:column;min-width:0;min-height:0;border-right:1px solid var(--sg-ink)}",
    "#sg-locator .sg-tools{padding:16px;display:grid;gap:12px;border-bottom:1px solid var(--sg-line)}",
    "#sg-locator .sg-search{display:flex;gap:8px}",
    "#sg-locator .sg-search input{flex:1;min-width:0;font:16px/1.2 var(--sg-body);color:var(--sg-ink);background:#fff;border:1px solid var(--sg-ink);border-radius:2px;padding:11px 12px}",
    "#sg-locator .sg-search input:focus{outline:2px solid var(--sg-red);outline-offset:1px}",
    "#sg-locator button{font:inherit;cursor:pointer}",
    "#sg-locator .sg-btn{font:600 12px/1 var(--sg-mono);letter-spacing:.14em;text-transform:uppercase;background:var(--sg-ink);color:var(--sg-bg);border:1px solid var(--sg-ink);border-radius:2px;padding:0 14px;min-height:42px;white-space:nowrap}",
    "#sg-locator .sg-btn:hover{background:#2b241d}",
    "#sg-locator .sg-btn.sg-ghost{background:transparent;color:var(--sg-ink)}",
    "#sg-locator .sg-btn.sg-ghost:hover{background:rgba(21,17,13,.06)}",
    "#sg-locator .sg-btn:focus-visible,#sg-locator .sg-chip:focus-visible,#sg-locator .sg-item:focus-visible,#sg-locator a:focus-visible{outline:2px solid var(--sg-red);outline-offset:2px}",
    "#sg-locator .sg-row{display:flex;flex-wrap:wrap;gap:6px;align-items:center}",
    "#sg-locator .sg-label{font:500 10px/1 var(--sg-mono);letter-spacing:.16em;text-transform:uppercase;color:var(--sg-muted);margin-right:4px}",
    "#sg-locator .sg-chip{font:500 11px/1 var(--sg-mono);letter-spacing:.1em;text-transform:uppercase;background:transparent;color:var(--sg-ink);border:1px solid var(--sg-ink);border-radius:2px;padding:8px 10px}",
    "#sg-locator .sg-chip[aria-pressed=true]{background:var(--sg-red);border-color:var(--sg-red);color:#fff}",
    "#sg-locator .sg-count{font:500 11px/1.3 var(--sg-mono);letter-spacing:.12em;text-transform:uppercase;color:var(--sg-muted);padding:10px 16px;border-bottom:1px solid var(--sg-line);display:flex;justify-content:space-between;gap:8px}",
    "#sg-locator .sg-count button{background:none;border:0;padding:0;color:var(--sg-ink);text-decoration:underline;font:inherit;letter-spacing:inherit;text-transform:inherit}",
    "#sg-locator .sg-list{list-style:none;margin:0;padding:0;overflow:auto;flex:1;min-height:0}",
    "#sg-locator .sg-item{display:block;width:100%;text-align:left;background:none;border:0;border-bottom:1px solid var(--sg-line);padding:14px 16px;color:inherit}",
    "#sg-locator .sg-item:hover{background:rgba(21,17,13,.04)}",
    "#sg-locator .sg-item[aria-current=true]{background:#fff}",
    "#sg-locator .sg-name{font:400 20px/1.05 var(--sg-display);text-transform:uppercase;letter-spacing:-.01em;margin:0 0 6px;display:flex;justify-content:space-between;gap:12px}",
    "#sg-locator .sg-dist{font:500 11px/1.6 var(--sg-mono);letter-spacing:.08em;color:var(--sg-muted);white-space:nowrap;text-transform:none}",
    "#sg-locator .sg-addr{font-size:14px;line-height:1.4;margin:0 0 8px;color:var(--sg-ink)}",
    "#sg-locator .sg-tags{display:flex;flex-wrap:wrap;gap:4px}",
    "#sg-locator .sg-tag{font:500 10px/1 var(--sg-mono);letter-spacing:.1em;text-transform:uppercase;border:1px solid var(--sg-line);padding:5px 6px;border-radius:2px}",
    "#sg-locator .sg-tag.sg-type{border-color:var(--sg-ink)}",
    "#sg-locator .sg-empty{padding:28px 16px;font-size:15px;line-height:1.5}",
    "#sg-locator .sg-empty b{font-family:var(--sg-display);font-weight:400;text-transform:uppercase;font-size:20px;display:block;margin-bottom:6px}",
    "#sg-locator .sg-detail{padding:16px;border-bottom:1px solid var(--sg-ink);background:#fff;display:grid;gap:12px}",
    "#sg-locator .sg-detail h3{font:400 30px/1 var(--sg-display);text-transform:uppercase;letter-spacing:-.01em;margin:0}",
    "#sg-locator .sg-detail p{margin:0;font-size:15px;line-height:1.45}",
    "#sg-locator .sg-actions{display:flex;flex-wrap:wrap;gap:6px}",
    "#sg-locator .sg-actions a,#sg-locator .sg-actions button{display:inline-flex;align-items:center;text-decoration:none}",
    "#sg-locator .sg-back{justify-self:start;background:none;border:0;padding:0;font:500 11px/1 var(--sg-mono);letter-spacing:.14em;text-transform:uppercase;color:var(--sg-ink)}",
    "#sg-locator .sg-note{font:500 10px/1.5 var(--sg-mono);letter-spacing:.08em;color:var(--sg-muted)}",
    "#sg-locator .sg-map{position:relative;min-width:0;min-height:0}",
    "#sg-locator .sg-map>.sg-canvas{position:absolute;inset:0}",
    "#sg-locator .sg-maperr{position:absolute;inset:0;display:grid;place-items:center;padding:24px;text-align:center;font-size:15px}",
    "#sg-locator .sg-toggle{display:none}",
    "#sg-locator .mapboxgl-ctrl-group,#sg-locator .maplibregl-ctrl-group{border-radius:2px;box-shadow:none;border:1px solid var(--sg-ink)}",
    "#sg-locator .mapboxgl-popup-content,#sg-locator .maplibregl-popup-content{border-radius:2px;border:1px solid var(--sg-ink);box-shadow:none;padding:8px 10px;font:400 16px/1.1 var(--sg-display);text-transform:uppercase;background:var(--sg-bg);color:var(--sg-ink)}",
    "#sg-locator .mapboxgl-popup-tip,#sg-locator .maplibregl-popup-tip{display:none}",
    "@media (max-width:820px){",
    "#sg-locator .sg-wrap{grid-template-columns:1fr;grid-template-rows:auto 1fr;height:auto;min-height:0}",
    "#sg-locator .sg-side{border-right:0;display:contents}",
    "#sg-locator .sg-tools{order:1;padding:14px}",
    "#sg-locator .sg-search{flex-wrap:wrap}",
    "#sg-locator .sg-search input{flex:1 1 100%}",
    "#sg-locator .sg-search .sg-btn{flex:1 1 0;min-width:0}",
    "#sg-locator .sg-row{gap:6px}",
    "#sg-locator .sg-label{flex:0 0 100%;margin:2px 0 0}",
    "#sg-locator .sg-chip{padding:8px 9px;letter-spacing:.06em}",
    "#sg-locator .sg-actions .sg-btn{flex:1 1 auto;justify-content:center}",
    "#sg-locator .sg-map{order:2;height:56vh;min-height:340px;border-top:1px solid var(--sg-ink);border-bottom:1px solid var(--sg-ink)}",
    "#sg-locator .sg-detail{order:3}",
    "#sg-locator .sg-count{order:4}",
    "#sg-locator .sg-list{order:5;max-height:none;overflow:visible}",
    "}",
    "@media (prefers-reduced-motion:reduce){#sg-locator *{transition:none!important}}"
  ].join("\n");

  // ---------- helpers ----------
  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === "text") e.textContent = attrs[k];
      else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] !== null && attrs[k] !== undefined) e.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) { if (c) e.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return e;
  }
  function loadCss(href) { if (document.querySelector('link[href="' + href + '"]')) return; document.head.appendChild(el("link", { rel: "stylesheet", href: href })); }
  function loadJs(src) {
    return new Promise(function (ok, bad) {
      var s = el("script", { src: src }); s.onload = ok; s.onerror = function () { bad(new Error("Couldn't load " + src)); };
      document.head.appendChild(s);
    });
  }
  function miles(a, b) {
    var R = 3958.8, r = Math.PI / 180, dLa = (b[1] - a[1]) * r, dLo = (b[0] - a[0]) * r;
    var h = Math.sin(dLa / 2) * Math.sin(dLa / 2) + Math.cos(a[1] * r) * Math.cos(b[1] * r) * Math.sin(dLo / 2) * Math.sin(dLo / 2);
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  function fmtMi(d) { return d < 0.1 ? "here" : d < 10 ? d.toFixed(1) + " mi" : Math.round(d) + " mi"; }
  function norm(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/&/g, "and").replace(/[^a-z0-9]+/g, " ").trim(); }
  function typeLabel(t) { return t === "on" ? "Bar / Restaurant" : t === "off" ? "Shop" : ""; }
  function addrLine(s) { if (!s.a) return [s.c, s.s].filter(Boolean).join(", ") + " · address not listed"; return [s.a, [s.c, [s.s, s.z].filter(Boolean).join(" ")].filter(Boolean).join(", ")].filter(Boolean).join(", "); }
  function param(name) { try { return new URLSearchParams(location.search).get(name); } catch (e) { return null; } }
  function setParam(name, val) {
    try {
      var u = new URL(location.href);
      if (val) u.searchParams.set(name, val); else u.searchParams.delete(name);
      history.replaceState(history.state, "", u.toString());
    } catch (e) { /* sandboxed or file:// */ }
  }

  // ---------- app ----------
  function start(root) {
    if (!document.getElementById("sg-locator-css")) document.head.appendChild(el("style", { id: "sg-locator-css", text: CSS }));
    var token = root.getAttribute("data-mapbox-token") || "";
    var useMapbox = /^pk\./.test(token);
    var styleUrl = root.getAttribute("data-mapbox-style") || "mapbox://styles/mapbox/light-v11";
    var src = root.getAttribute("data-src");
    try { // pin colours follow the page's theme tokens when the site sets them
      var cs = getComputedStyle(root);
      ["red", "ink"].forEach(function (k) { var v = cs.getPropertyValue("--sg-" + k).trim(); if (v) C[k] = v; });
      var bg = cs.getPropertyValue("--sg-bg").trim(); if (bg) C.ground = bg;
    } catch (e) { /* keep defaults */ }

    var state = { all: [], byId: {}, prod: "all", type: "all", origin: null, originLabel: "", selected: null, query: "", ready: false };

    // DOM
    var input = el("input", { id: "sg-q", type: "search", placeholder: "City, ZIP or bar name", "aria-label": "Search by city, ZIP code or place name", autocomplete: "off" });
    var form = el("form", { class: "sg-search", role: "search" }, [input, el("button", { class: "sg-btn", type: "submit", text: "Search" })]);
    var nearBtn = el("button", { class: "sg-btn sg-ghost", type: "button", text: "Near me" });
    form.appendChild(nearBtn);
    function chips(label, opts, key) {
      var row = el("div", { class: "sg-row", role: "group", "aria-label": label }, [el("span", { class: "sg-label", text: label })]);
      opts.forEach(function (o) {
        row.appendChild(el("button", { type: "button", class: "sg-chip", "data-k": key, "data-v": o[0], "aria-pressed": String(o[0] === "all"), text: o[1],
          onclick: function () {
            state[key] = o[0];
            [].forEach.call(row.querySelectorAll(".sg-chip"), function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-v") === o[0])); });
            applyFilter();
          } }));
      });
      return row;
    }
    var tools = el("div", { class: "sg-tools" }, [
      form,
      chips("Pour", [["all", "All"], ["vodka", "Vodka"], ["gin", "Gin"], ["fruits", "Two Fruits cans"]], "prod"),
      chips("Where", [["all", "All"], ["on", "Bars"], ["off", "Shops"]], "type")
    ]);
    var detail = el("div", { class: "sg-detail", hidden: "" });
    var countText = el("span", { text: "Loading stockists…" });
    var showAll = el("button", { type: "button", hidden: "", text: "Show all", onclick: function () { fitAll(); } });
    var count = el("div", { class: "sg-count", "aria-live": "polite" }, [countText, showAll]);
    var list = el("ul", { class: "sg-list", "aria-label": "Stockists" });
    var side = el("div", { class: "sg-side" }, [tools, detail, count, list]);
    var canvas = el("div", { class: "sg-canvas" });
    var mapBox = el("div", { class: "sg-map" }, [canvas]);
    root.textContent = "";
    root.appendChild(el("div", { class: "sg-wrap" }, [side, mapBox]));

    var map = null, lib = null, popup = null;

    // ---------- data ----------
    function getData() {
      if (Array.isArray(window.SG_STOCKISTS)) return Promise.resolve(window.SG_STOCKISTS);
      if (!src) return Promise.reject(new Error("No stockist list is set (data-src)."));
      return fetch(src, { cache: "no-cache" }).then(function (r) { if (!r.ok) throw new Error("Stockist list returned " + r.status); return r.json(); })
        .then(function (d) { return Array.isArray(d) ? d : (d.stockists || d.rows || []); });
    }
    function matches(s) {
      if (state.type !== "all" && s.t !== state.type) return false;
      if (state.prod === "fruits") return s.p.some(function (p) { return FRUITS.indexOf(p) > -1; });
      if (state.prod !== "all") return s.p.indexOf(state.prod) > -1;
      return true;
    }
    function filtered() { return state.all.filter(matches); }
    function pinned(s) { return s.q !== "c" && s.q !== "s"; }
    function geojson(rows) {
      return { type: "FeatureCollection", features: rows.filter(pinned).map(function (s) {
        return { type: "Feature", id: s._i, geometry: { type: "Point", coordinates: [s.lng, s.lat] }, properties: { id: s.id, n: s.n } };
      }) };
    }

    // ---------- list ----------
    function renderList() {
      var rows = filtered(), shown;
      if (map && state.ready) {
        var b = map.getBounds();
        shown = rows.filter(function (s) { return b.contains([s.lng, s.lat]); });
      } else shown = rows.slice();
      var ref = state.origin || (map ? [map.getCenter().lng, map.getCenter().lat] : null);
      if (ref) shown.forEach(function (s) { s._d = miles(ref, [s.lng, s.lat]); });
      shown.sort(function (a, b) { return ref ? a._d - b._d : a.n.localeCompare(b.n); });
      var total = rows.length;
      countText.textContent = shown.length === total ? total + " places" : shown.length + " of " + total + " places in this view" + (state.originLabel ? " · near " + state.originLabel : "");
      showAll.hidden = shown.length === total;
      list.textContent = "";
      if (!shown.length) {
        list.appendChild(el("li", { class: "sg-empty" }, [el("b", { text: "Nothing pouring here yet." }),
          "Zoom out or ", el("button", { type: "button", class: "sg-back", text: "see every stockist", onclick: fitAll }), ". Or ask your local shop to carry us."]));
        return;
      }
      shown.slice(0, 150).forEach(function (s) {
        var tags = el("div", { class: "sg-tags" });
        if (s.t) tags.appendChild(el("span", { class: "sg-tag sg-type", text: typeLabel(s.t) }));
        s.p.forEach(function (p) { tags.appendChild(el("span", { class: "sg-tag", text: PRODUCTS[p] || p })); });
        var item = el("button", { type: "button", class: "sg-item", "aria-current": String(state.selected === s), onclick: function () { select(s, true); } }, [
          el("div", { class: "sg-name" }, [el("span", { text: s.n }), state.origin ? el("span", { class: "sg-dist", text: fmtMi(s._d) }) : null]),
          el("p", { class: "sg-addr", text: addrLine(s) }), tags]);
        list.appendChild(el("li", null, [item]));
      });
      if (shown.length > 150) list.appendChild(el("li", { class: "sg-empty", text: "Showing the closest 150. Zoom in to see the rest." }));
    }

    // ---------- detail ----------
    function select(s, move) {
      state.selected = s;
      setParam("location", s ? s.id : null);
      if (!s) { detail.hidden = true; if (popup) popup.remove(); renderList(); return; }
      var q = encodeURIComponent(s.n + ", " + (s.a ? addrLine(s) : [s.c, s.s].filter(Boolean).join(", ")));
      var actions = el("div", { class: "sg-actions" }, [
        el("a", { class: "sg-btn", href: "https://www.google.com/maps/dir/?api=1&destination=" + q, target: "_blank", rel: "noopener", text: "Directions" }),
        el("a", { class: "sg-btn sg-ghost", href: "https://maps.apple.com/?daddr=" + q, target: "_blank", rel: "noopener", text: "Apple Maps" }),
        s.w ? el("a", { class: "sg-btn sg-ghost", href: s.w, target: "_blank", rel: "noopener", text: "Website" }) : null,
        s.ig ? el("a", { class: "sg-btn sg-ghost", href: "https://www.instagram.com/" + encodeURIComponent(s.ig) + "/", target: "_blank", rel: "noopener", text: "@" + s.ig }) : null,
        el("button", { class: "sg-btn sg-ghost", type: "button", text: "Copy link", onclick: function (ev) {
          var b = ev.currentTarget, link = location.origin + location.pathname + "?location=" + encodeURIComponent(s.id);
          (navigator.clipboard ? navigator.clipboard.writeText(link) : Promise.reject()).then(function () { b.textContent = "Copied"; }, function () { b.textContent = link; });
          setTimeout(function () { b.textContent = "Copy link"; }, 2500);
        } })
      ]);
      var tags = el("div", { class: "sg-tags" });
      if (s.t) tags.appendChild(el("span", { class: "sg-tag sg-type", text: typeLabel(s.t) }));
      s.p.forEach(function (p) { tags.appendChild(el("span", { class: "sg-tag", text: PRODUCTS[p] || p })); });
      detail.textContent = "";
      [el("button", { type: "button", class: "sg-back", text: "← All places", onclick: function () { select(null); } }),
       el("h3", { text: s.n }), el("p", { text: addrLine(s) }), tags, actions,
       el("p", { class: "sg-note", text: "Menus and shelves change. Call ahead for what’s pouring today." })].forEach(function (c) { detail.appendChild(c); });
      detail.hidden = false;
      if (map) {
        if (move) map.flyTo({ center: [s.lng, s.lat], zoom: Math.max(map.getZoom(), pinned(s) ? 14 : 11), speed: 1.4 });
        if (popup) popup.remove();
        if (!pinned(s)) { if (map.getSource("sg-sel")) map.getSource("sg-sel").setData({ type: "FeatureCollection", features: [] }); renderList(); return; }
        popup = new lib.Popup({ closeButton: false, offset: 14 }).setLngLat([s.lng, s.lat]).setText(s.n).addTo(map);
        if (map.getSource("sg-sel")) map.getSource("sg-sel").setData({ type: "FeatureCollection", features: [{ type: "Feature", geometry: { type: "Point", coordinates: [s.lng, s.lat] }, properties: {} }] });
      }
      renderList();
      if (window.matchMedia("(max-width:820px)").matches) detail.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    function fitAll() {
      state.origin = null; state.originLabel = "";
      var rows = filtered();
      if (!map || !rows.length) return renderList();
      var b = new lib.LngLatBounds();
      rows.forEach(function (s) { if (s.lng > -130 && s.lng < -60) b.extend([s.lng, s.lat]); }); // fit the US; Australia stays reachable by search
      if (b.isEmpty()) rows.forEach(function (s) { b.extend([s.lng, s.lat]); });
      map.fitBounds(b, { padding: 40, duration: 600, maxZoom: 12 });
    }

    function applyFilter() {
      if (map && map.getSource("sg")) map.getSource("sg").setData(geojson(filtered()));
      if (state.selected && !matches(state.selected)) select(null);
      renderList();
    }

    // ---------- search ----------
    function goTo(lng, lat, label, zoom) {
      state.origin = [lng, lat]; state.originLabel = label || "";
      if (map) map.flyTo({ center: [lng, lat], zoom: zoom || 11.5, speed: 1.6 });
      else renderList();
    }
    function geocode(q) {
      if (useMapbox) {
        return fetch("https://api.mapbox.com/search/geocode/v6/forward?country=us,au&limit=1&q=" + encodeURIComponent(q) + "&access_token=" + token)
          .then(function (r) { return r.json(); }).then(function (d) { var f = d.features && d.features[0]; return f ? { lng: f.geometry.coordinates[0], lat: f.geometry.coordinates[1], label: f.properties.name } : null; });
      }
      return fetch("https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=us,au&q=" + encodeURIComponent(q))
        .then(function (r) { return r.json(); }).then(function (d) { return d && d[0] ? { lng: +d[0].lon, lat: +d[0].lat, label: d[0].name || q } : null; });
    }
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var q = input.value.trim(); if (!q) return fitAll();
      var nq = norm(q);
      if (/^\d{5}$/.test(q)) { // ZIP we already know
        var z = state.all.filter(function (s) { return s.z === q; });
        if (z.length) return goTo(z[0].lng, z[0].lat, q, 13);
      }
      var byName = state.all.filter(function (s) { return norm(s.n).indexOf(nq) > -1; });
      if (byName.length === 1) return select(byName[0], true);
      var byCity = state.all.filter(function (s) { return norm(s.c) === nq || norm(s.c + " " + s.s) === nq; });
      if (byCity.length) {
        var lng = 0, lat = 0; byCity.forEach(function (s) { lng += s.lng; lat += s.lat; });
        return goTo(lng / byCity.length, lat / byCity.length, byCity[0].c, 11.5);
      }
      countText.textContent = "Looking up " + q + "…";
      geocode(q).then(function (r) {
        if (r) return goTo(r.lng, r.lat, r.label, 11.5);
        if (byName.length) { state.origin = null; map.fitBounds(byName.reduce(function (b, s) { return b.extend([s.lng, s.lat]); }, new lib.LngLatBounds()), { padding: 60, maxZoom: 13 }); return; }
        countText.textContent = "No match for “" + q + "”. Try a city or ZIP code.";
      }).catch(function () { countText.textContent = "Search is down right now. Drag the map instead."; });
    });
    nearBtn.addEventListener("click", function () {
      if (!navigator.geolocation) { countText.textContent = "Your browser doesn’t share location. Search a city instead."; return; }
      nearBtn.textContent = "Finding you…";
      navigator.geolocation.getCurrentPosition(function (p) {
        nearBtn.textContent = "Near me"; goTo(p.coords.longitude, p.coords.latitude, "you", 12);
      }, function () { nearBtn.textContent = "Near me"; countText.textContent = "Location is blocked. Search a city or ZIP instead."; }, { timeout: 10000, maximumAge: 600000 });
    });

    // ---------- map ----------
    function brandStyle() {
      // Warm the base map toward the label paper. Works on OpenFreeMap Positron and Mapbox light.
      (map.getStyle().layers || []).forEach(function (l) {
        try {
          if (l.type === "background") map.setPaintProperty(l.id, "background-color", "#EFE6D2");
          else if (/water/.test(l.id) && l.type === "fill") map.setPaintProperty(l.id, "fill-color", "#CFD9D2");
          else if (/park|landuse|wood|grass/.test(l.id) && l.type === "fill") map.setPaintProperty(l.id, "fill-color", "#E3DDC4");
          else if (l.type === "symbol" && l.layout && l.layout["text-field"]) map.setPaintProperty(l.id, "text-color", "#5c5348");
        } catch (e) { /* layer doesn't take that paint */ }
      });
    }
    function addLayers() {
      map.addSource("sg", { type: "geojson", data: geojson(filtered()), cluster: true, clusterRadius: 44, clusterMaxZoom: 12 });
      map.addSource("sg-sel", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
      map.addLayer({ id: "sg-clusters", type: "circle", source: "sg", filter: ["has", "point_count"],
        paint: { "circle-color": C.ink, "circle-radius": ["step", ["get", "point_count"], 14, 10, 18, 50, 24, 150, 30], "circle-stroke-width": 2, "circle-stroke-color": C.ground } });
      map.addLayer({ id: "sg-count", type: "symbol", source: "sg", filter: ["has", "point_count"],
        layout: { "text-field": ["get", "point_count_abbreviated"], "text-size": 12, "text-font": useMapbox ? ["DIN Pro Bold", "Arial Unicode MS Bold"] : ["Noto Sans Bold"] },
        paint: { "text-color": C.ground } });
      map.addLayer({ id: "sg-pins", type: "circle", source: "sg", filter: ["!", ["has", "point_count"]],
        paint: { "circle-color": C.red, "circle-radius": ["interpolate", ["linear"], ["zoom"], 8, 5, 14, 8], "circle-stroke-width": 1.5, "circle-stroke-color": C.ink } });
      map.addLayer({ id: "sg-sel", type: "circle", source: "sg-sel",
        paint: { "circle-color": C.red, "circle-radius": 12, "circle-stroke-width": 3, "circle-stroke-color": C.ink } });
      map.on("click", "sg-clusters", function (e) {
        var f = e.features[0];
        map.getSource("sg").getClusterExpansionZoom(f.properties.cluster_id, function (err, z) {
          if (!err) map.easeTo({ center: f.geometry.coordinates, zoom: z + 0.3 });
        });
        if (map.getSource("sg").getClusterExpansionZoom.length === 1) { // MapLibre 4 returns a promise
          map.getSource("sg").getClusterExpansionZoom(f.properties.cluster_id).then(function (z) { map.easeTo({ center: f.geometry.coordinates, zoom: z + 0.3 }); });
        }
      });
      map.on("click", "sg-pins", function (e) { var s = state.byId[e.features[0].properties.id]; if (s) select(s, false); });
      ["sg-clusters", "sg-pins"].forEach(function (id) {
        map.on("mouseenter", id, function () { map.getCanvas().style.cursor = "pointer"; });
        map.on("mouseleave", id, function () { map.getCanvas().style.cursor = ""; });
      });
      map.on("moveend", renderList);
    }
    function initMap() {
      loadCss(useMapbox ? MAPBOX_CSS : LIBRE_CSS);
      return loadJs(useMapbox ? MAPBOX_JS : LIBRE_JS).then(function () {
        lib = useMapbox ? window.mapboxgl : window.maplibregl;
        if (useMapbox) lib.accessToken = token;
        map = new lib.Map({ container: canvas, style: useMapbox ? styleUrl : LIBRE_STYLE, center: [-96, 39], zoom: 3.3, attributionControl: { compact: true }, cooperativeGestures: window.matchMedia("(max-width:820px)").matches });
        map.addControl(new lib.NavigationControl({ showCompass: false }), "top-right");
        return new Promise(function (ok) { map.on("load", function () { if (!root.hasAttribute("data-keep-style")) brandStyle(); addLayers(); ok(); }); });
      });
    }

    Promise.all([getData(), initMap().catch(function (e) {
      mapBox.appendChild(el("div", { class: "sg-maperr", text: "The map didn’t load. The list still works." }));
      console.warn("[sg-locator]", e);
    })]).then(function (r) {
      state.all = (r[0] || []).filter(function (s) { return isFinite(s.lat) && isFinite(s.lng); });
      state.all.forEach(function (s, i) { s._i = i; s.p = s.p || []; state.byId[s.id] = s; });
      if (map && map.getSource("sg")) map.getSource("sg").setData(geojson(filtered()));
      state.ready = true;
      var deep = state.byId[param("location") || ""];
      if (deep) { if (map) map.jumpTo({ center: [deep.lng, deep.lat], zoom: 14 }); select(deep, false); }
      else fitAll();
      renderList();
    }).catch(function (e) {
      countText.textContent = "Couldn’t load the stockist list. Refresh to try again.";
      console.warn("[sg-locator]", e);
    });
  }

  function boot() { var root = document.getElementById(ROOT_ID); if (root && !root.__sg) { root.__sg = 1; start(root); } }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
