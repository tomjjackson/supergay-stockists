"""List every visible price on supergayspirits.com with the text around it."""
import re, urllib.request, html, json, collections
UA = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) Chrome/124 Safari/537.36'}
def get(u): return urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=30).read().decode('utf-8', 'ignore')
sm = get('https://www.supergayspirits.com/sitemap.xml')
urls = re.findall(r'<loc>(.*?)</loc>', sm)
print('pages', len(urls))
rows = []
for u in urls:
    try: t = get(u)
    except Exception as e: print('ERR', u, e); continue
    body = re.sub(r'<script.*?</script>|<style.*?</style>', ' ', t, flags=re.S)
    txt = html.unescape(re.sub(r'<[^>]+>', ' | ', body)); txt = re.sub(r'(\s*\|\s*)+', ' | ', txt); txt = re.sub(r'\s+', ' ', txt)
    for m in re.finditer(r'\$\s?\d+(?:\.\d\d)?', txt):
        ctx = txt[max(0, m.start() - 90):m.end() + 15].replace('\n', ' ')
        rows.append((u.replace('https://www.supergayspirits.com', ''), m.group(0), ctx))
    for m in re.finditer(r'data-bclistingid="(\d+)"[^>]*data-bcvariantid="(\d+)"|data-bcvariantid="(\d+)"[^>]*data-bclistingid="(\d+)"', t):
        pass
for r in rows: print('P', r[0], '||', r[1], '||', r[2])
