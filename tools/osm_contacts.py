"""Look up phone numbers and websites for stockists in OpenStreetMap (Overpass API).
Only fills places that contacts.json does not already cover. Usage: python tools/osm_contacts.py [limit]
Map data (c) OpenStreetMap contributors, ODbL."""
import json, re, sys, time, urllib.request, urllib.parse, difflib, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S = json.load(open(os.path.join(ROOT, 'stockists.json')))['stockists']
CP = os.path.join(ROOT, 'contacts.json')
C = json.load(open(CP)) if os.path.exists(CP) else {'_note': 'Phone (ph) and website (w) per stockist id. src: osm = OpenStreetMap, web = web search, manual = set by hand. checked = date looked up, kept so a place is not looked up again every week.', 'places': {}}
P = C['places']
today = time.strftime('%Y-%m-%d')
limit = int(sys.argv[1]) if len(sys.argv) > 1 else 10**9
norm = lambda s: re.sub(r'\b(the|bar|restaurant|wine|wines|liquor|liquors|spirits|shop|store|nyc|llc|inc)\b', '', re.sub(r'[^a-z0-9 ]', ' ', str(s or '').lower().replace('&', ' and '))).split()
def sim(a, b):
    a, b = ' '.join(norm(a)), ' '.join(norm(b))
    if not a or not b: return 0
    if a in b or b in a: return 0.95
    return difflib.SequenceMatcher(None, a, b).ratio()
def phone(p):
    d = re.sub(r'\D', '', p or '')
    if len(d) == 11 and d[0] == '1': d = d[1:]
    return '(%s) %s-%s' % (d[:3], d[3:6], d[6:]) if len(d) == 10 else (p or '').split(';')[0].strip()
todo = [s for s in S if not P.get(s['id'], {}).get('checked')][:limit]
print('to look up:', len(todo), flush=True)
EP = ['https://overpass-api.de/api/interpreter', 'https://overpass.private.coffee/api/interpreter', 'https://maps.mail.ru/osm/tools/overpass/api/interpreter']
# group places into ~0.25 degree cells; one bbox query per cell for named places that have a phone or website tag
cells = {}
for s in todo: cells.setdefault((round(s['lat'] * 4), round(s['lng'] * 4)), []).append(s)
print('cells:', len(cells), flush=True)
found = done = 0
def query(q):
    for attempt in range(6):
        try:
            req = urllib.request.Request(EP[attempt % len(EP)], data=urllib.parse.urlencode({'data': q}).encode(), headers={'User-Agent': 'supergay-stockists/1.0 (supergayspirits.com store locator)'})
            return json.load(urllib.request.urlopen(req, timeout=100))['elements']
        except Exception as e:
            print('  retry', attempt, str(e)[:80], flush=True); time.sleep(10)
    return None
for key, group in cells.items():
    la = [s['lat'] for s in group]; lo = [s['lng'] for s in group]
    bb = '%.5f,%.5f,%.5f,%.5f' % (min(la) - .002, min(lo) - .002, max(la) + .002, max(lo) + .002)
    q = '[out:json][timeout:90];(nwr[name][~"^(phone|contact:phone|website|contact:website|url)$"~"."](%s););out tags center;' % bb
    els = query(q)
    if els is None: continue
    for s in group:
        best, bs = None, 0
        for e in els:
            t = e.get('tags', {}); c = e.get('center') or e
            if 'lat' not in c: continue
            if abs(c['lat'] - s['lat']) > 0.0015 or abs(c['lon'] - s['lng']) > 0.002: continue
            sc = sim(s['n'], t.get('name'))
            if sc > bs: best, bs = t, sc
        rec = P.get(s['id']) or {}; rec['checked'] = today
        if best and bs >= 0.8:
            ph = best.get('phone') or best.get('contact:phone')
            w = best.get('website') or best.get('contact:website') or best.get('url')
            if ph and not rec.get('ph'): rec['ph'] = phone(ph)
            if w and not rec.get('w'): rec['w'] = w if w.startswith('http') else 'https://' + w
            if ph or w: rec.setdefault('src', 'osm'); found += 1
        P[s['id']] = rec
    done += len(group)
    print(done, 'places done, found', found, flush=True)
    json.dump(C, open(CP, 'w'), indent=1, ensure_ascii=False)
    time.sleep(1)
print('found', found, 'of', len(todo), flush=True)
