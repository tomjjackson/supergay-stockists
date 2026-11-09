"""For web_contacts.json entries with a website but no phone, read the phone off the store's own site (tel: links first). Each site is checked once."""
import json, os, re, time, collections, urllib.request
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WP = os.path.join(ROOT, 'tools', 'web_contacts.json'); W = json.load(open(WP))
PH = re.compile(r'(?<!\d)(?:\+?1[\s.-]?)?\(?([2-9]\d\d)\)?[\s.-]?(\d{3})[\s.-]?(\d{4})(?!\d)')
UA = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36'}
def get(u): return urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=20).read().decode('utf-8', 'ignore')
n = got = 0
for k, r in W.items():
    if not r.get('w') or r.get('ph') or r.get('phone_checked'): continue
    n += 1; r['phone_checked'] = time.strftime('%Y-%m-%d'); base = r['w'].rstrip('/') + '/'
    for path in ('', 'contact', 'contact-us', 'about', 'visit'):
        try: page = get(base + path)
        except Exception: continue
        tel = [re.sub(r'\D', '', x)[-10:] for x in re.findall(r'href=["\']tel:([^"\']+)', page)]
        tel = [x for x in tel if len(x) == 10]
        if not tel:
            txt = re.sub(r'<script.*?</script>|<style.*?</style>|<[^>]+>', ' ', page, flags=re.S)
            tel = [''.join(m.groups()) for m in PH.finditer(txt)]
        if tel:
            x = collections.Counter(tel).most_common(1)[0][0]
            r['ph'] = '(%s) %s-%s' % (x[:3], x[3:6], x[6:]); r['ph_src'] = 'site'; got += 1; break
    if n % 20 == 0: print(n, 'sites, phones', got, flush=True); json.dump(W, open(WP, 'w'), indent=1, sort_keys=True)
json.dump(W, open(WP, 'w'), indent=1, sort_keys=True)
print('sites checked', n, 'phones found', got)
