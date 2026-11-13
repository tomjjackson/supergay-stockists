import re, urllib.request
for u in ['https://www.supergayspirits.com/', 'https://www.supergayspirits.com/product-page-supergay-fire-island-gin']:
    t = urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'}), timeout=30).read().decode('utf-8', 'ignore')
    for m in re.findall(r'<script[^>]+src="([^"]+)"[^>]*>', t): print('S', u[-30:], m)
