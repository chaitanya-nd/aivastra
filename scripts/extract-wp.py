#!/usr/bin/env python3
"""
Extract everything we need from an All-in-One WP Migration (.wpress) archive
into seed/wp-full.json — WITHOUT unpacking media or backups.

    python3 -I scripts/extract-wp.py ~/Projects/_aivastra-wp-archive/aivastra-com-*.wpress

Reads only `database.sql` from the archive (a few hundred MB at most).
"""
import collections, json, os, re, sys, tempfile

SRC = sys.argv[1]
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'seed', 'wp-full.json')
H = 4377

def extract_sql(src, dest):
    with open(src, 'rb') as f:
        while True:
            h = f.read(H)
            if len(h) < H or h == b'\0' * H: raise SystemExit('database.sql not found')
            name = h[:255].split(b'\0')[0].decode('utf8', 'replace')
            size = int(h[255:269].split(b'\0')[0] or 0)
            path = h[281:].split(b'\0')[0].decode('utf8', 'replace')
            if name == 'database.sql' and path in ('', '.'):
                with open(dest, 'wb') as o:
                    r = size
                    while r > 0:
                        b = f.read(min(r, 1 << 24)); o.write(b); r -= len(b)
                return
            f.seek(f.tell() + size)

tmp = tempfile.mkdtemp(prefix='wpsql-')
sql_path = os.path.join(tmp, 'database.sql')
extract_sql(SRC, sql_path)
sql = open(sql_path, encoding='utf8', errors='replace').read()
os.remove(sql_path); os.rmdir(tmp)

def rows(table):
    res = []
    for m in re.finditer(r"INSERT INTO `SERVMASK_PREFIX_%s` VALUES " % table, sql):
        i = m.end(); n = len(sql)
        while i < n:
            while sql[i] in ' ,\n': i += 1
            if sql[i] == ';': break
            i += 1; row = []
            while True:
                c = sql[i]
                if c == "'":
                    j = i + 1; buf = []
                    while True:
                        c2 = sql[j]
                        if c2 == '\\':
                            nx = sql[j + 1]; buf.append({'n': '\n', 'r': '\r', 't': '\t', '0': '\0'}.get(nx, nx)); j += 2
                        elif c2 == "'":
                            if sql[j + 1] == "'": buf.append("'"); j += 2
                            else: break
                        else: buf.append(c2); j += 1
                    row.append(''.join(buf)); i = j + 1
                else:
                    j = i
                    while sql[j] not in ',)': j += 1
                    v = sql[i:j]; row.append(None if v == 'NULL' else v); i = j
                if sql[i] == ',': i += 1; continue
                if sql[i] == ')': i += 1; break
            res.append(row)
    return res

C = ['ID','author','date','date_gmt','content','title','excerpt','status','cstatus','pstatus','pw','name','to_ping','pinged','mod','mod_gmt','filt','parent','guid','menu','type','mime','cc']
posts = {int(r[0]): dict(zip(C, r)) for r in rows('posts')}
meta = collections.defaultdict(dict)
for r in rows('postmeta'): meta[int(r[1])][r[2]] = r[3]
opt = {r[1]: r[2] for r in rows('options')}
terms = {r[0]: r for r in rows('terms')}
tts = rows('term_taxonomy')           # id, term_id, taxonomy, description, parent, count
tt = {r[0]: r for r in tts}
rel = collections.defaultdict(list)
for r in rows('term_relationships'): rel[int(r[0])].append(r[1])

def php_unserialize(b):
    """Minimal PHP unserialize (arrays, strings, ints, bools, floats, null)."""
    raw = b.encode('utf8'); pos = 0
    def rd():
        nonlocal pos
        t = raw[pos:pos+1]
        if t == b'N': pos += 2; return None
        if t in b'bi': e = raw.index(b';', pos); v = int(raw[pos+2:e]); pos = e+1; return bool(v) if t == b'b' else v
        if t == b'd': e = raw.index(b';', pos); v = float(raw[pos+2:e]); pos = e+1; return v
        if t == b's':
            c = raw.index(b':', pos+2); n = int(raw[pos+2:c]); v = raw[c+2:c+2+n].decode('utf8', 'replace'); pos = c+2+n+2; return v
        if t == b'a':
            c = raw.index(b':', pos+2); n = int(raw[pos+2:c]); pos = c+2; out = {}
            for _ in range(n):
                k = rd(); out[k] = rd()
            pos += 1; return out
        raise ValueError('bad serialize at %d: %r' % (pos, raw[pos:pos+20]))
    return rd()

KEEP = {'post', 'page', 'guide', 'case', 'update', 'review'}
def clean_meta(i):
    m = meta.get(i, {})
    out = {k: v for k, v in m.items() if not k.startswith('_') or k in ('_thumbnail_id', '_wp_page_template')}
    return {k: v for k, v in out.items() if k not in ('rank_math_internal_links_processed', 'rank_math_seo_score', 'rank_math_contentai_score', 'rank_math_news_sitemap_robots')}

items = []
for i, p in sorted(posts.items()):
    if p['type'] in KEEP and p['status'] in ('publish', 'draft', 'private', 'future'):
        items.append({
            'id': i, 'type': p['type'], 'status': p['status'], 'title': p['title'], 'slug': p['name'],
            'date': p['date_gmt'] if p['date_gmt'] != '0000-00-00 00:00:00' else p['date'], 'modified': p['mod_gmt'],
            'excerpt': p['excerpt'], 'html': p['content'], 'parent': int(p['parent']), 'menuOrder': int(p['menu']),
            'author': int(p['author']), 'terms': rel.get(i, []), 'meta': clean_meta(i),
        })

attachments = {}
for i, p in posts.items():
    if p['type'] == 'attachment':
        attachments[i] = {'file': meta.get(i, {}).get('_wp_attached_file'), 'alt': meta.get(i, {}).get('_wp_attachment_image_alt', ''), 'guid': p['guid']}

menus = {}
for tid, r in tt.items():
    if r[2] == 'nav_menu':
        t = terms[r[1]]; menus[t[2]] = {'name': t[1], 'items': []}
for i, p in posts.items():
    if p['type'] == 'nav_menu_item' and p['status'] == 'publish':
        m = meta.get(i, {})
        for tid in rel.get(i, []):
            r = tt.get(tid)
            if r and r[2] == 'nav_menu':
                menus[terms[r[1]][2]]['items'].append({'id': i, 'parent': int(m.get('_menu_item_menu_item_parent') or 0), 'order': int(p['menu']), 'title': p['title'], 'type': m.get('_menu_item_type'), 'object': m.get('_menu_item_object'), 'objectId': int(m.get('_menu_item_object_id') or 0), 'url': m.get('_menu_item_url')})
for m in menus.values(): m['items'].sort(key=lambda x: x['order'])

# ── ACF definitions (field groups + fields) ──
acf_groups, acf_fields = [], []
for i, p in sorted(posts.items(), key=lambda kv: (int(kv[1]['menu']), kv[0])):
    if p['status'] not in ('publish',): continue
    if p['type'] == 'acf-field-group':
        try: cfg = php_unserialize(p['content'])
        except Exception: cfg = {}
        acf_groups.append({'id': i, 'key': p['name'], 'title': p['title'], 'order': int(p['menu']), 'location': cfg.get('location', []), 'active': cfg.get('active', True)})
    elif p['type'] == 'acf-field':
        try: cfg = php_unserialize(p['content'])
        except Exception: cfg = {}
        acf_fields.append({'id': i, 'parent': int(p['parent']), 'key': p['name'], 'label': p['title'], 'name': p['excerpt'], 'order': int(p['menu']), 'type': cfg.get('type'), 'cfg': {k: cfg[k] for k in ('choices','default_value','return_format','layout','instructions','required','multiple','allow_null','min','max') if k in cfg}})

data = {
    'acf': {'groups': acf_groups, 'fields': acf_fields},
    'site': {k: opt.get(k) for k in ('blogname', 'blogdescription', 'permalink_structure', 'page_on_front', 'page_for_posts', 'siteurl')},
    'users': [{'id': int(r[0]), 'name': r[9] or r[3]} for r in rows('users')],
    'terms': [{'id': r[0], 'tax': r[2], 'name': terms[r[1]][1], 'slug': terms[r[1]][2], 'parent': r[4], 'description': r[3]} for r in tts],
    'items': items, 'attachments': attachments, 'menus': menus,
    'redirects': [{'from': r[1], 'toId': int(r[2]) if r[2].isdigit() else None, 'toUrl': None if r[2].isdigit() else r[2], 'type': r[3]} for r in rows('redirects')],
    'acfOptions': {k[8:]: v for k, v in opt.items() if k.startswith('options_') and v},
    'rankMathTitles': opt.get('rank_math_titles'),
}
os.makedirs(os.path.dirname(OUT), exist_ok=True)
json.dump(data, open(OUT, 'w'), ensure_ascii=False)
c = collections.Counter((x['type'], x['status']) for x in items)
print('wrote', os.path.abspath(OUT), round(os.path.getsize(OUT) / 1e6, 1), 'MB')
print(dict(c)); print('terms', len(data['terms']), 'attachments', len(attachments), 'menus', {k: len(v['items']) for k, v in menus.items()})
