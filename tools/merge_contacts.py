"""Fold contacts.json (phone ph, website w) into stockists.json without a full rebuild. build_stockists.py does the same on the daily refresh."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sp = os.path.join(ROOT, 'stockists.json'); D = json.load(open(sp))
con = json.load(open(os.path.join(ROOT, 'contacts.json')))['places']
for o in D['stockists']:
    k = con.get(o['id']) or {}
    if k.get('ph'): o['ph'] = k['ph']
    if k.get('w') and not o.get('w'): o['w'] = k['w']
json.dump(D, open(sp, 'w'), separators=(',', ':'), ensure_ascii=False)
print('phones', sum(1 for o in D['stockists'] if o.get('ph')), 'websites', sum(1 for o in D['stockists'] if o.get('w')), 'of', len(D['stockists']))
