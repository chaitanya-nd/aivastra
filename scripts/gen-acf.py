#!/usr/bin/env python3
"""seed/wp-full.json (ACF defs) → src/acf/definitions.json  (consumed by src/acf/build.ts)"""
import json, os, re, collections
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
d = json.load(open(os.path.join(root, 'seed/wp-full.json')))
groups, fields = d['acf']['groups'], d['acf']['fields']
by_parent = collections.defaultdict(list)
for f in fields: by_parent[f['parent']].append(f)
for l in by_parent.values(): l.sort(key=lambda f: (f['order'], f['id']))

TPL = {'default': 'default', 'front_page': 'front-page',
       'template-parts/category.php': 'category', 'template-parts/about-page-template.php': 'about',
       'template-parts/pricing-page.php': 'pricing', 'template-parts/template-contact.php': 'contact',
       'template-parts/virtual-try-on.php': 'virtual-try-on', 'template-parts/ai-showcase-page.php': 'ai-showcase',
       'template-parts/shopify-page.php': 'shopify', 'template-parts/market-places.php': 'market-places',
       'template-parts/case-studies-page-template.php': 'case-studies', 'template-parts/guide-page-template.php': 'guide',
       'template-parts/update-page-template.php': 'update', 'template-parts/template-document.php': 'document'}

def group_templates(g):
    out = set()
    for orr in g['location'].values():
        for r in orr.values():
            if r['param'] in ('page_template', 'page_type') and r['operator'] == '==' and r['value'] in TPL: out.add(TPL[r['value']])
    return sorted(out)

def build(f):
    if f['type'] in ('tab', 'message', 'accordion'): return None
    o = {'name': f['name'], 'label': f['label'], 'type': f['type']}
    c = f['cfg']
    if c.get('instructions'): o['instructions'] = c['instructions']
    if c.get('choices'): o['choices'] = c['choices']
    if f['type'] == 'repeater' or f['type'] == 'group':
        o['fields'] = [x for x in (build(s) for s in by_parent.get(f['id'], [])) if x]
    return o

merged = collections.OrderedDict()   # name -> field def (with templates)
out_groups = []
for g in sorted(groups, key=lambda g: (g['order'], g['id'])):
    tpls = group_templates(g)
    if not tpls: continue
    flds = []
    for f in by_parent.get(g['id'], []):
        b = build(f)
        if not b: continue
        if b['name'] in merged:
            merged[b['name']]['templates'] = sorted(set(merged[b['name']]['templates']) | set(tpls))
            continue
        b['templates'] = tpls
        merged[b['name']] = b
        flds.append(b)
    if flds: out_groups.append({'title': g['title'], 'fields': flds})
# options page (ACF "Global Content") → global fields
glob = []
for g in groups:
    for orr in g['location'].values():
        if any(r['param'] == 'options_page' for r in orr.values()):
            glob += [x for x in (build(f) for f in by_parent.get(g['id'], [])) if x]
json.dump({'templates': sorted(set(TPL.values())), 'groups': out_groups, 'globalContent': glob}, open(os.path.join(root, 'src/acf/definitions.json'), 'w'), indent=1, ensure_ascii=False)
n = sum(1 for _ in merged)
print('groups', len(out_groups), 'top-level fields', n, 'types', collections.Counter(f['type'] for f in merged.values()))
