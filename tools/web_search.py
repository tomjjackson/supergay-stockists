"""Fill phones/websites OpenStreetMap missed, from search-engine result snippets.
Writes tools/web_contacts.json only. A phone counts only if it appears in a snippet that also names the place's street number or city.
Usage: python tools/web_search.py [limit] [state]"""
import json, os, re, sys, time, html, urllib.request, urllib.parse, collections
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S = json.load(open(os.path.join(ROOT, 'stockists.json')))['stockists']
CP = os.path.join(ROOT, 'contacts.json'); C = json.load(open(CP))['places'] if os.path.exists(CP) else {}
WP = os.path.join(ROOT, 'tools', 'web_contacts.json'); W = json.load(open(WP)) if os.path.exists(WP) else {}
limit = int(sys.argv[1]) if len(sys.argv) > 1 else 10**6
state = sys.argv[2] if len(sys.argv) > 2 else ''
today = time.strftime('%Y-%m-%d')
SKIP = ('yelp.', 'facebook.', 'instagram.', 'tripadvisor.', 'mapquest.', 'doordash.', 'ubereats.', 'grubhub.', 'opentable.', 'yellowpages.', 'waze.', 'apple.com', 'google.', 'giftly.', 'toast', 'beermenus.', 'untappd.', 'drizly.', 'seamless.', 'zomato.', 'foursquare.', 'restaurantji', 'menupix', 'allmenus', 'zoominfo', 'bbb.org', 'manta.', 'chamberofcommerce', 'wikipedia', 'linkedin', 'tiktok', 'twitter', 'x.com', 'youtube', 'yahoo', 'bing.', 'duckduckgo', 'reddit', 'eater.', 'timeout.', 'infatuation', 'loc8nearme', 'birdeye', 'nextdoor', 'postmates', 'slice', 'resy', 'sevenrooms', 'tock', 'squareup', 'wine-searcher', 'totalwine.com', 'locator', 'condesa', 'mhw', 'supergay')
PH = re.compile(r'(?<!\d)(?:\+?1[\s.-]?)?\(?([2-9]\d\d)\)?[\s.-]?(\d{3})[\s.-]?(\d{4})(?!\d)')
UA = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36', 'Accept-Language': 'en-US,en;q=0.9'}
def get(url, data=None):
    r = urllib.request.Request(url, data=data, headers=UA)
    return urllib.request.urlopen(r, timeout=25).read().decode('utf-8', 'ignore')
def ddg(q):
    t = get('https://html.duckduckgo.com/html/', urllib.parse.urlencode({'q': q}).encode())
    out = []
    for m in re.finditer(r'class="result__a"[^>]*href="([^"]+)"[^>]*>(.*?)</a>.*?class="result__snippet"[^>]*>(.*?)</a>', t, re.S):
        u = m.group(1)
        if 'uddg=' in u: u = urllib.parse.unquote(re.search(r'uddg=([^&]+)', u).group(1))
        out.append((u, html.unescape(re.sub('<.*?>', '', m.group(2))), html.unescape(re.sub('<.*?>', '', m.group(3)))))
    return out
def bing(q):
    t = get('https://www.bing.com/search?' + urllib.parse.urlencode({'q': q, 'setlang': 'en-US', 'cc': 'US'}))
    out = []
    for m in re.finditer(r'<li class="b_algo".*?<h2[^>]*><a[^>]*href="([^"]+)"[^>]*>(.*?)</a>.*?(?:<p[^>]*>(.*?)</p>|</li>)', t, re.S):
        out.append((m.group(1), html.unescape(re.sub('<.*?>', '', m.group(2))), html.unescape(re.sub('<.*?>', '', m.group(3) or ''))))
    return out
def words(s): return [w for w in re.findall(r'[a-z0-9]+', s.lower()) if len(w) > 2 and w not in ('the', 'and', 'inc', 'llc', 'bar', 'wine', 'wines', 'spirits', 'liquor', 'liquors', 'store', 'restaurant', 'package')]
todo = [s for s in S if not s.get('ph') and not (C.get(s['id']) or {}).get('ph') and s['id'] not in W and (not state or s['s'] == state)][:limit]
print('to search:', len(todo), flush=True)
eng = [ddg, bing]; fails = collections.Counter(); got = 0
for i, s in enumerate(todo):
    num = (re.match(r'\s*(\d+)', s['a'] or '') or [None, None])[1]
    q = '%s %s %s %s phone' % (s['n'], s['a'] or '', s['c'], s['s'][:2])
    res = None
    for e in list(eng):
        try:
            res = e(q)
            if res: break
            fails[e.__name__] += 1
        except Exception as x:
            fails[e.__name__] += 1; print('  ', e.__name__, x, flush=True)
        if fails[e.__name__] >= 8 and len(eng) > 1: eng.remove(e); print('  dropping', e.__name__, flush=True)
    rec = {'checked': today, 'src': 'search'}
    if res:
        nw = words(s['n']); city = s['c'].lower()
        votes = collections.Counter()
        for u, ti, sn in res:
            txt = (ti + ' ' + sn); low = txt.lower()
            near = (num and re.search(r'\b%s\b' % num, txt)) or city in low
            named = any(w in low for w in nw) if nw else True
            if near and named:
                for m in PH.finditer(sn + ' ' + ti): votes['(%s) %s-%s' % m.groups()] += 1
        if votes: rec['ph'] = votes.most_common(1)[0][0]
        for u, ti, sn in res:
            dom = urllib.parse.urlparse(u).netloc.lower()
            if dom and not any(k in dom for k in SKIP) and any(w in (dom + ' ' + ti.lower()) for w in nw[:3]):
                rec['w'] = 'https://' + dom.removeprefix('www.') + '/' if False else 'https://' + dom + '/'; break
    if rec.get('ph'): got += 1
    if res is not None or True: W[s['id']] = rec if res else W.get(s['id'], {})
    if not res: W.pop(s['id'], None)
    if i % 10 == 9:
        print(i + 1, 'searched, phones', got, flush=True); json.dump(W, open(WP, 'w'), indent=1, sort_keys=True)
    time.sleep(2.5)
json.dump(W, open(WP, 'w'), indent=1, sort_keys=True)
print('done', len(todo), 'phones', got, 'engine fails', dict(fails))
