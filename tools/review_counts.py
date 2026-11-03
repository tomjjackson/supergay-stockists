"""Build reviews/counts.json from Webflow form submissions.

Usage: python3 tools/review_counts.py SUBMISSION_FILE [SUBMISSION_FILE ...]
Each input file is any JSON (or a Webflow MCP tool-result dump) that contains
form submission objects. Only "Comment Form" submissions with a star rating
and real text are counted. Spam (links, non-Latin ad text, random letters,
blank or numeric-only text) is skipped.
"""
import json, re, sys, collections, datetime

def objects(path):
    raw = open(path, encoding='utf-8').read()
    dec = json.JSONDecoder()
    def walk(o):
        if isinstance(o, dict):
            if 'formResponse' in o and 'id' in o:
                yield o
            for v in o.values():
                yield from walk(v)
        elif isinstance(o, list):
            for v in o:
                yield from walk(v)
        elif isinstance(o, str) and o.lstrip().startswith(('{', '[')) and 'formResponse' in o:
            yield from scan(o)
    def scan(txt):
        i = 0
        while True:
            j = min([k for k in (txt.find('{', i), txt.find('[', i)) if k >= 0], default=-1)
            if j < 0:
                return
            try:
                o, end = dec.raw_decode(txt, j)
            except ValueError:
                i = j + 1
                continue
            i = end
            yield from walk(o)
    yield from scan(raw)

def texts(fr):
    return [str(v).strip() for k, v in fr.items()
            if k != 'star-radio' and 'mail' not in k.lower() and str(v).strip()]

def classify(s):
    fr = s.get('formResponse') or {}
    vals = texts(fr)
    joined = ' '.join(vals)
    if re.search(r'https?://|\[url|<a |www\.|\.ru\b', joined, re.I):
        return 'link'
    if re.search(r'[Ѐ-ӿ؀-ۿ一-鿿]', joined):
        return 'foreign'
    if vals and all(re.fullmatch(r'[A-Za-z]{8,}', v) and re.search(r'[a-z][A-Z]', v) for v in vals):
        return 'random'
    if not fr.get('star-radio'):
        return 'norating'
    if not vals or all(re.fullmatch(r'[\d\W]*', v) for v in vals):
        return 'empty'
    return 'ok'

def main(paths):
    seen, subs = set(), []
    for p in paths:
        for s in objects(p):
            if s['id'] in seen or 'omment' not in (s.get('displayName') or ''):
                continue
            seen.add(s['id'])
            subs.append(s)
    stats = collections.Counter(classify(s) for s in subs)
    agg = collections.defaultdict(list)
    for s in subs:
        if classify(s) == 'ok' and s.get('publishedPath'):
            agg[s['publishedPath']].append(int(s['formResponse']['star-radio']))
    out = {'updated': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%MZ'),
           'products': {p: {'n': len(v), 'avg': round(sum(v) / len(v), 1)} for p, v in sorted(agg.items())}}
    json.dump(out, open('reviews/counts.json', 'w'), indent=1)
    print('submissions', len(subs), dict(stats))
    for p, v in out['products'].items():
        print(p, v)

if __name__ == '__main__':
    main(sys.argv[1:])
