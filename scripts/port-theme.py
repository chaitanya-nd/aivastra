#!/usr/bin/env python3
"""
Port the WordPress child theme's CSS/JS into the Next app (code only — images stay on the live site).

    python3 -I scripts/port-theme.py ~/Projects/_aivastra-wp-archive/aivastra-com-*.wpress

writes  src/app/(frontend)/theme.css          style.css + responsive.css + owl css (url() → live site)
        public/theme/js/{jquery,owl.carousel,custom-scripts}.js
"""
import os, re, sys
SRC = sys.argv[1]
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
LIVE = 'https://aivastra.com/wp-content/themes/aivastrachild/'
WANT = {'themes/aivastra/style.css', 'themes/aivastrachild/style.css', 'themes/aivastrachild/responsive.css', 'themes/aivastrachild/css/owl.carousel.min.css',
        'themes/aivastrachild/js/jquery.min.js', 'themes/aivastrachild/js/owl.carousel.min.js', 'themes/aivastrachild/js/custom-scripts.js'}
got = {}
H = 4377
with open(SRC, 'rb') as f:
    while True:
        h = f.read(H)
        if len(h) < H or h == b'\0' * H: break
        name = h[:255].split(b'\0')[0].decode(); size = int(h[255:269].split(b'\0')[0] or 0); path = h[281:].split(b'\0')[0].decode()
        full = (path + '/' + name) if path not in ('', '.') else name
        if full in WANT: got[full] = f.read(size)
        else: f.seek(f.tell() + size)

def fix_urls(css, base):
    def rep(m):
        q, u = m.group(1) or '', m.group(2).strip()
        if re.match(r'^(https?:|data:|#|//)', u): return m.group(0)
        u = re.sub(r'^(\.\./|\./)+', '', u)
        return f'url({q}{LIVE}{u}{q})'
    return re.sub(r'url\(\s*(["\']?)([^)"\']+)\1\s*\)', rep, css)

t = 'themes/aivastrachild/'
css = ''
css += '/* ── parent theme style.css ── */\n' + fix_urls(got['themes/aivastra/style.css'].decode('utf8', 'replace'), 'parent') + '\n'
for name in ('css/owl.carousel.min.css', 'style.css', 'responsive.css'):
    css += f'/* ── {name} ── */\n' + fix_urls(got[t + name].decode('utf8', 'replace'), name) + '\n'
css = css.replace('https://aivastra.com/wp-content/themes/aivastrachild/images/', LIVE + 'images/')
open(os.path.join(ROOT, 'src/app/(frontend)/theme.css'), 'w').write(css)
js_dir = os.path.join(ROOT, 'public/theme/js'); os.makedirs(js_dir, exist_ok=True)
for n in ('jquery.min.js', 'owl.carousel.min.js', 'custom-scripts.js'):
    data = got[t + 'js/' + n]
    if n == 'custom-scripts.js':  # the theme assumes a .copy-btn exists on every page (it only does on posts)
        data = data.replace(b'const copyBtn = document.querySelector(".copy-btn");', b'const copyBtn = document.querySelector(".copy-btn");\n    if (!copyBtn) return;')
    if n == 'custom-scripts.js':  # home-only carousel timer throws on every other page
        data = data.replace(b'function changeActive(index) {', b'function changeActive(index) {\n    if (!items.length) return;')
    open(os.path.join(js_dir, n), 'wb').write(data)
print('theme.css', round(len(css) / 1024), 'KB;', 'js', sorted(os.listdir(js_dir)))
