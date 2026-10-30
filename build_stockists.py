# Port of the dashboard's map_accounts calc (files/map.js), trimmed to public fields for the website locator.
import json, re, sys, os, collections, datetime
B, OUT = sys.argv[1], sys.argv[2]
ld = lambda h: json.load(open(os.path.join(B, h + ".json")))
rad = ld("5f60b896b9b8f15e05c4cc17f0920722"); dist = ld("74320468fc7c6a5135ece6e75416805d"); sales = ld("8511b9038b58df2d0fe51dbe52bea9ea")
ageo = ld("d2326b92a0e7b71395328bb7117ebb10"); addrs = ld("3e1ff11c3a4a4779b9df9c0dfdc42928"); zipg = ld("f924c86a73f74bf809cb2fcd8d952391")
links = ld("cb23126048a2953ee50e1087caafa96f"); gcs = ld("7b57ac6910c9c6b7d18cfd8f88037e63")
today = datetime.date.today().isoformat()
norm = lambda x: re.sub(r'[^a-z0-9]', '', str(x or '').lower())
def z5(x):
    m = re.search(r'\d{5}', str(x or '')); return m.group(0) if m else ''
geo = {str(g.get('city') or '').strip().lower() + '|' + g['state']: g for g in ageo}
zips = {str(z['z']): z for z in zipg}
gk = lambda a, z: norm(a) + '|' + z5(z)
gc = {gk(g['address'], g['zip']): g for g in gcs if g.get('lat') is not None and g['type'] != 'APPROXIMATE'}
addr, byName = {}, {}
def put(name, st, a):
    addr[norm(name) + '|' + st] = a; n = norm(name)
    if n in byName and (byName[n] is None or byName[n]['zip'] != a['zip']): byName[n] = None
    else: byName[n] = a
for r in sorted(addrs, key=lambda r: str(r.get('last_seen'))):
    if r.get('zip') or r.get('address'): put(r['customer'], r['state'], {'address': r.get('address') or '', 'city': r.get('city') or '', 'zip': z5(r.get('zip'))})
for r in sorted(sales, key=lambda r: str(r['date'])):
    if r.get('address'):
        old = addr.get(norm(r['customer']) + '|' + r['region']) or {}
        put(r['customer'], r['region'], {'address': r['address'], 'city': r.get('city') or old.get('city', ''), 'zip': z5(r.get('zip')) or old.get('zip', '')})
def prod(p):
    x = str(p or '')
    if re.search(r'^gin$|fire island', x, re.I): return 'gin'
    if re.search(r'chili|mango', x, re.I): return 'mango'
    if re.search(r'cosmo', x, re.I): return 'cosmo'
    if re.search(r'mule', x, re.I): return 'mule'
    if re.search(r'espresso', x, re.I): return 'espresso'
    if re.search(r'combo', x, re.I): return 'variety'
    if re.search(r'vodka', x, re.I): return 'vodka'
    return None
m = {}
def add(cust, region, city, dist_, day, product, premise):
    key = norm(cust) + '|' + region + '|' + dist_
    a = m.get(key) or {'key': key, 'customer': str(cust).strip(), 'region': region, 'city': '', 'dist': dist_, 'premise': '', 'last': '', 'prod': collections.Counter()}
    if city and not a['city']: a['city'] = str(city).strip()
    if not a['premise'] and re.match(r'^on', premise or '', re.I): a['premise'] = 'on'
    elif not a['premise'] and re.match(r'^off', premise or '', re.I): a['premise'] = 'off'
    if day > a['last']: a['last'] = day
    p = prod(product)
    if p: a['prod'][p] += 1
    m[key] = a
for r in rad:
    if not r['sample'] and r['date'] <= today and not re.match(r'^skurnik', r['customer'] or '', re.I):
        add(r['customer'], r['region'] or '', r['city'], 'Skurnik', r['date'], r['product'], r['type'])
radMax = max(r['date'] for r in rad)
for r in sales:
    if r['date'] > radMax and r['date'] <= today and r['channel'] != 'NATIONAL' and not re.match(r'^skurnik', r['customer'] or '', re.I):
        add(r['customer'], r['region'] or '', r['city'], 'Skurnik', r['date'], r['product'], r['channel'])
for r in dist:
    if not r['sample'] and r['account'] and r['month']:
        add(r['account'], r['state'] or '', r['city'], r['distributor'], r['date'] or r['month'] + '-15', r['product'], r['premise'])
lk = {}
for l in links:
    if l.get('website') or l.get('instagram') or l.get('closed'):
        lk[str(l['key'])] = l; lk[norm(l['name']) + '|' + str(l['key']).split('|')[1]] = l
rows, prec = [], collections.Counter()
for a in m.values():
    ad = addr.get(norm(a['customer']) + '|' + a['region']) or byName.get(norm(a['customer']))
    zg = zips.get(ad['zip']) if ad and ad['zip'] else None
    city = a['city'] or (ad and ad['city']) or ''
    ex = gc.get(gk(ad['address'], ad['zip'])) if ad and ad['address'] else None
    if ex: g, pr = (ex['lat'], ex['lon']), 'address'
    elif zg: g, pr = (zg['a'], zg['o']), 'zip'
    else:
        cg = geo.get(city.lower() + '|' + a['region']) or geo.get('|' + a['region'])
        g = (cg['lat'], cg['lon']) if cg and cg.get('lat') is not None else None
        pr = ('city' if geo.get(city.lower() + '|' + a['region']) else 'state') if g else 'none'
    prec[pr] += 1
    l = lk.get(a['key']) or lk.get(norm(a['customer']) + '|' + a['region']) or {}
    rows.append(dict(a=a, ad=ad, city=city, g=g, pr=pr, l=l))
print('accounts', len(rows), dict(prec), 'closed', sum(1 for r in rows if r['l'].get('closed')))
# public file: leave off reps, spirit specialists, warehouses (exclude.json)
X = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'exclude.json')))
NP = [re.compile(x, re.I) for x in X['name_patterns']]
ALLOW = set(X['venue_allow']); FORCE = set(X['person_force'])
VENUE = re.compile(r"\b(bar|wine|wines|spirits|liquor|liquors|cafe|café|kitchen|house|club|hotel|inn|restaurant|tavern|room|lounge|market|shop|store|pub|grill|co|llc|inc|bistro|tap|cellar|cellars|bottle|provisions|social|eatery|pizza|tacos|farm|garden|brewery|cocktail|merchants|the|and|of|catering|events|hall|deli|food|beer|diner|package|confectionery|saloon|local)\b|&|#|\d", re.I)
def is_person(n, pr):
    if n in FORCE: return True
    if n in ALLOW or pr not in ('city', 'state'): return False
    t = re.sub(r'\(.*?\)', '', n).strip().split()
    return 2 <= len(t) <= 4 and all(re.fullmatch(r"[A-Z][a-zA-Z'’.\-]+", w) for w in t) and not VENUE.search(n)
WEB = {}
try:
    for w in json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'web_addresses.json')))['found']:
        WEB[norm(w['name']) + '|' + w['state']] = w; WEB.setdefault(norm(w['name']), w)
except FileNotFoundError: pass
# accounts removed as Closed on the dashboard's Reps → Accounts tab (D1 table removed_accounts), same rule as rep_acct_list
nm2 = lambda x: re.sub(r'[^a-z0-9]+', '', str(x or '').lower().replace('&', 'and'))
try: CLOSED = {nm2(r['account']) for r in json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'removed_accounts.json'))) if r.get('reason') == 'Closed'}
except FileNotFoundError: CLOSED = set()
dropped = collections.Counter()
out = []
for r in rows:
    a, ad, l = r['a'], r['ad'], r['l']
    if not r['g'] or l.get('closed'): continue
    if nm2(a['customer']) in CLOSED: dropped['closed (Accounts tab)'] += 1; continue
    if any(p.search(a['customer']) for p in NP): dropped['rep/specialist/warehouse'] += 1; continue
    if is_person(a['customer'], r['pr']): dropped['person'] += 1; continue
    w = WEB.get(norm(a['customer']) + '|' + a['region']) or WEB.get(norm(a['customer']))
    if w and w.get('closed'): dropped['closed (web)'] += 1; continue
    if w and r['pr'] != 'address' and w.get('address'):
        ad = {'address': w['address'], 'city': w.get('city') or r['city'], 'zip': z5(w.get('zip')) or (ad or {}).get('zip', '')}
        zg = zips.get(ad['zip']) if ad['zip'] else None
        if zg: r['g'] = (zg['a'], zg['o'])
        r['pr'] = 'web'
        if re.fullmatch(r'[A-Z]{2}', w.get('state') or ''): r['st'] = w['state']
    slug = re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', (a['customer'] + ' ' + r['city'] + ' ' + a['region']).lower())).strip('-')
    o = {'id': slug, 'n': a['customer'], 'a': (ad or {}).get('address') or '', 'c': (ad or {}).get('city') or r['city'] if r['pr'] == 'web' else r['city'], 's': r.get('st') or a['region'], 'z': (ad or {}).get('zip') or '',
         'lat': round(r['g'][0], 5), 'lng': round(r['g'][1], 5), 'q': {'address': 'a', 'zip': 'z', 'web': 'w', 'city': 'c', 'state': 's'}[r['pr']], 't': a['premise'],
         'p': [p for p in ['vodka', 'gin', 'cosmo', 'mule', 'mango', 'espresso', 'variety'] if a['prod'][p]]}
    if l.get('website'): o['w'] = l['website']
    if l.get('instagram'): o['ig'] = str(l['instagram']).lstrip('@')
    if o['s'] == 'MO/KS':  # Vintegrity reports both states together: tell them apart by ZIP
        o['s'] = 'KS' if o['z'][:2] in ('66', '67') else 'MO' if o['z'][:2] in ('63', '64', '65') else 'MO/KS'
    out.append(o)
seen = collections.Counter(); cnt = collections.Counter(o['id'] for o in out)
for o in out:
    if cnt[o['id']] > 1: seen[o['id']] += 1; o['id'] += '-' + str(seen[o['id']])
out.sort(key=lambda o: (o['s'], o['c'], o['n']))
json.dump({'updated': today, 'count': len(out), 'stockists': out}, open(OUT, 'w'), separators=(',', ':'), ensure_ascii=False)
print('dropped', dict(dropped)); print('public', len(out), 'bytes', os.path.getsize(OUT))
print(collections.Counter(o['s'] for o in out).most_common())
print(collections.Counter(o['q'] for o in out))
