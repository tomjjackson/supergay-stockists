"""For stockists with a website but no phone, read the phone number off their own homepage (tel: link first, then a US number in the page).
Only checks each site once (phone_checked). Usage: python tools/site_phones.py"""
import json, re, os, time, urllib.request
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S = json.load(open(os.path.join(ROOT, 'stockists.json')))['stockists']
CP = os.path.join(ROOT, 'contacts.json')
C = json.load(open(CP)); P = C['places']
today = time.strftime('%Y-%m-%d')
def fmt(d):
    d = re.sub(r'\D', '', d)
    if len(d) == 11 and d[0] == '1': d = d[1:]
    return '(%s) %s-%s' % (d[:3], d[3:6], d[6:]) if len(d) == 10 and d[0] not in '01' else None
n = got = 0
for s in S:
    rec = P.setdefault(s['id'], {})
    w = s.get('w') or rec.get('w')
    if not w or rec.get('ph') or rec.get('phone_checked'): continue
    n += 1; rec['phone_checked'] = today
    try:
        req = urllib.request.Request(w, headers={'User-Agent': 'Mozilla/5.0 (supergay-stockists store locator)'})
        html = urllib.request.urlopen(req, timeout=20).read(600000).decode('utf-8', 'ignore')
    except Exception as e:
        continue
    ph = None
    for m in re.finditer(r'href=["\']tel:([^"\']+)', html, re.I):
        ph = fmt(m.group(1))
        if ph: break
    if not ph:
        z = s.get('s')
        for m in re.finditer(r'(?<!\d)(?:\+?1[\s.-]?)?\(?([2-9]\d{2})\)?[\s.-]?(\d{3})[\s.-](\d{4})(?!\d)', re.sub(r'<[^>]+>', ' ', html)):
            ph = fmt(''.join(m.groups())); break
    if ph:
        rec['ph'] = ph; rec.setdefault('src', 'site'); rec['ph_src'] = 'site'; got += 1
json.dump(C, open(CP, 'w'), indent=1, ensure_ascii=False)
print('sites checked', n, 'phones found', got)
