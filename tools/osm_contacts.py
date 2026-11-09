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
todo = [s for s in S if s['id'] not in P][:limit]
print('to look up:', len(todo))
EP = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter']
found = 0
for i in range(0, len(todo), 20):
    batch = todo[i:i + 20]
    q = '[out:json][timeout:90];(' + ''.join('nwr(around:90,%s,%s)[name];' % (s['lat'], s['lng']) for s in batch) + ');out tags center;'
    els = None
    for attempt in range(4):
        try:
            req = urllib.request.Request(EP[attempt % 2], data=urllib.parse.urlencode({'data': q}).encode(), headers={'User-Agent': 'supergay-stockists/1.0 (supergayspirits.com store locator)'})
            els = json.load(urllib.request.urlopen(req, timeout=120))['elements']; break
        except Exception as e:
            print('retry', i, e); time.sleep(15)
    if els is None: continue
    for s in batch:
        best, bs = None, 0
        for e in els:
            t = e.get('tags', {}); c = e.get('center') or e
            if 'lat' not in c: continue
            if abs(c['lat'] - s['lat']) > 0.0015 or abs(c['lon'] - s['lng']) > 0.002: continue
            sc = sim(s['n'], t.get('name'))
            if sc > bs: best, bs = t, sc
        rec = {'checked': today}
        if best and bs >= 0.8:
            ph = best.get('phone') or best.get('contact:phone')
            w = best.get('website') or best.get('contact:website') or best.get('url')
            if ph: rec['ph'] = phone(ph)
            if w: rec['w'] = w if w.startswith('http') else 'https://' + w
            if ph or w: rec['src'] = 'osm'; found += 1
        P[s['id']] = rec
    print(i + len(batch), 'done, found', found)
    json.dump(C, open(CP, 'w'), indent=1, ensure_ascii=False)
    time.sleep(3)
print('found', found, 'of', len(todo))
