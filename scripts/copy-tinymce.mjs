// Serve TinyMCE (skins, themes, plugins, icons) from /public so the admin editor works offline.
import { cpSync, existsSync, mkdirSync } from 'node:fs'
const src = 'node_modules/tinymce'
if (existsSync(src)) {
  mkdirSync('public/tinymce', { recursive: true })
  for (const d of ['skins', 'themes', 'plugins', 'icons', 'models']) cpSync(`${src}/${d}`, `public/tinymce/${d}`, { recursive: true })
  cpSync(`${src}/tinymce.min.js`, 'public/tinymce/tinymce.min.js')
  cpSync(`${src}/license.md`, 'public/tinymce/license.md')
}
