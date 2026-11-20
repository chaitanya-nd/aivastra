# AI Vastra — Next.js + Payload CMS

WordPress → Next.js migration for aivastra.com. One app: public site (Next.js 16, ISR) + admin (Payload 3) + Postgres.

## Design layer (visual only)

`src/app/(frontend)/design.css` + `src/components/theme/DesignMotion.tsx` apply the dark "Midnight" interface to every page: floating pill navigation, aurora glows, glass cards with a cursor spotlight, huge display type, scroll-reveal motion and a scroll progress bar. They never change text, headings or markup, so SEO is untouched. Colours, radii and fonts are tokens at the top of `design.css`. To go back to the original WordPress look, remove the `design.css` import and `<DesignMotion />` in `src/app/(frontend)/layout.tsx`.

## Run everything (site + admin) with one command

Payload is embedded in Next.js, so ONE process serves the public site (`/`) and the CMS admin (`/admin`).

| Command | What it does |
|---|---|
| `make dev` | Local development: Postgres in Docker + hot-reload site/admin on http://localhost:3100 |
| `make up` | **Everything in Docker** (Postgres + site + admin): migrates the DB, builds on first start, then serves on `:3100` |
| `make logs` / `make down` | Follow logs / stop (data kept) |
| `make build` | Rebuild the image and recreate the container (use after code changes) |
| `make import` / `make seed` | Load the WordPress export / demo data into the running container, then clear the page cache |
| `make reset` | DANGER: delete DB + media volumes |

Deploy on a server: copy `.env.example` to `.env`, set `PAYLOAD_SECRET`, `REVALIDATE_SECRET`, `POSTGRES_PASSWORD`, `NEXT_PUBLIC_SITE_URL`, `SITE_ENV=staging|production`, then `make up`. Put a reverse proxy (Caddy/nginx) with TLS in front of port 3100. The first start takes a few minutes (it builds); restarts are fast.

## Run locally

```bash
cp .env.example .env
pnpm install
pnpm docker:up        # Postgres 16 on 127.0.0.1:5443 (separate from propicly's 5442)
pnpm import:wp        # FULL WordPress import (needs seed/wp-full.json, see below)
# or: pnpm seed:reset # small demo dataset with generated placeholder images
pnpm dev              # http://localhost:3100  ·  admin: http://localhost:3100/admin
```

Seed logins (password `Admin123!`): `admin@aivastra.test` · `seo@aivastra.test` · `editor@aivastra.test`

| Command | What |
|---|---|
| `pnpm dev / build / start` | Next.js (port 3100) |
| `pnpm seed` / `seed:reset` | Seed if empty / wipe + seed |
| `pnpm generate:types` | Regenerate `src/payload-types.ts` after changing collections |
| `pnpm generate:importmap` | After adding/changing admin components |
| `pnpm docker:up / down / reset` | Postgres container |

## Importing the WordPress site

```bash
pnpm extract:wp ~/Projects/_aivastra-wp-archive/aivastra-com-*.wpress   # → seed/wp-full.json (reads only database.sql)
pnpm import:wp                                                          # wipes the local DB, then imports everything
```

Imports all posts/pages/guides/cases/updates/reviews with Rank Math SEO (title, description, focus keyword, robots, custom JSON-LD),
FAQs, categories/tags (hierarchy), authors, menus, redirects, page parents and original ACF values (`legacyFields`).
**No media is copied**: featured/inline images keep pointing at `https://aivastra.com/wp-content/uploads/…` until R2 is connected.
Page sections that were raw ACF HTML come in as editable **Custom HTML** blocks (unstyled until the theme CSS is ported).
After importing while `pnpm dev` is running, clear Next's cache: `POST /api/revalidate` with header `x-revalidate-secret` and `{"tag":"globals"}`.

## Page templates (WordPress theme → React)

The WordPress theme's own CSS/JS is reused (`pnpm port:theme <archive>` → `theme.css`, `public/theme/js/*`; images stay on the live site), so pages look like today's site.
Each page has a **Template** (sidebar) that decides its layout and which **ACF-style fields** show in the *Template fields* tab. Those fields are generated from the original ACF
definitions (`scripts/gen-acf.py` → `src/acf/definitions.json` → `src/acf/build.ts`).

| Template | Status |
|---|---|
| Front page, Category (8 landing pages), Pricing, Contact, About, Virtual try-on, AI showcase, Documentation hub, Case studies / Guides / Updates listings (+ their category archives), Default pages, Blog index + category archives, Single post / guide / case / update / review, Search, 404, **Shopify app, Marketplaces** | ✅ ported (`src/components/theme/pages/`) — every WordPress template now has a React port |

The theme CSS is scoped by WordPress body classes (`page-template-shopify-page`, `single-case`, `blog`, …); `BodyClass` adds them per page.
The Marketplaces template is only used by a **draft** page in WordPress; publish it in the admin when ready.

Known intentional deviations: blog category tabs link to `/category/{slug}/` (static, crawlable) instead of `?cat_filter=`; "View More" is `/blog/page/N/` instead of AJAX;
theme scripts are loaded after hydration (`ThemeScripts`) and two upstream bugs in `custom-scripts.js` are guarded by `scripts/port-theme.py`.

## What replaced what (WordPress → here)

| WordPress | Here |
|---|---|
| Posts / Pages / CPTs guide, case, update, review | Collections `posts pages guides cases updates reviews` (same URLs) |
| ACF field groups + page templates | Page-builder **blocks** (`src/blocks/config.ts`, rendered in `components/Blocks.tsx`) |
| ACF Options "Global Content" | Global `global-content` |
| Menus | Global `navigation` (header w/ dropdowns, footer columns, legal) |
| Rank Math (title/desc/OG/canonical/robots/schema) | `meta` tab on every doc (`@payloadcms/plugin-seo` + `src/fields/seo.ts`) |
| Rank Math sitemap / robots / llms | `sitemap.xml`, `robots.txt`, `llms.txt` driven by Site settings |
| EPS 301 Redirects | `redirects` collection + **auto-301 when a slug changes** |
| Schema & Structured Data | Article/BlogPosting, FAQPage, BreadcrumbList, Organization, WebSite JSON-LD |
| Breadcrumb NavXT / LuckyWP TOC | `Breadcrumbs` component / `Toc` from headings |
| Contact Form 7 / Mailchimp | `forms` + `form-submissions` (form builder); Mailchimp = TODO |
| Insert Headers & Footers | Site settings → *Scripts & robots* |
| Classic Editor | Lexical rich-text editor |
| WP Admin dashboard | Custom dashboard + **SEO audit** (`/admin/seo-audit`) |

## URLs (kept identical to WordPress)

`/` · `/{page}/` · `/{parent}/{child}/` · `/{post}/` · `/category/{slug}/` · `/tag/{slug}/` · `/blog/page/2/` ·
`/guide/{slug}/` · `/case/{slug}/` · `/updates/{slug}/` · `/review/{slug}/` · `/guide-category|case-category|update-category/{slug}/` ·
`/feed/` · `/sitemap.xml` · `/robots.txt` · `/llms.txt`.
Public paths always end in `/` (see `src/proxy.ts`); `/api` and `/admin` are untouched. URL logic lives in `src/lib/urls.ts`.

## Roles

`admin` everything · `seo` content + SEO + redirects + site settings · `editor` content only.

## Storage

Media goes to `./media` (gitignored). To move to Cloudflare R2 later see `src/storage.ts` (`@payloadcms/storage-s3`).
The 8.8 GB WordPress `.wpress` archive is **not** in this repo (kept at `~/Projects/_aivastra-wp-archive/`).

## Going live checklist

| Area | How it works here |
|---|---|
| **Environment safety** | `SITE_ENV=local\|staging\|production`. Only `production` is indexable; every other environment gets `noindex` meta, `X-Robots-Tag` header and `Disallow: /` automatically (plus the *Block all search engines* switch in Site settings). The admin dashboard shows the current environment. |
| **Database** | Dev uses auto-sync (`push`). Production runs the committed migrations in `src/migrations` at startup (`prodMigrations`). After changing collections: `pnpm migrate:create <name>`; apply manually with `pnpm migrate`. Verified: the initial migration builds all 195 tables on an empty DB. |
| **Build / deploy order** | `pnpm migrate` → `pnpm build` → `pnpm start` (against a migrations-managed database). Don't run a production-mode build against your dev database: it was created by auto-sync, and Payload will stop to ask about data loss. To verify locally, create a scratch DB (`create database aivastra_build`), point `DATABASE_URL` at it, run `NODE_ENV=production pnpm migrate && pnpm build`. |
| **Form emails** | Set `SMTP_*` + `EMAIL_FROM`. Each form's *Emails* tab decides who is notified (`{{*:table}}` = all fields). `FORM_NOTIFY_TO` pre-fills it on import. Without `SMTP_HOST`, emails are logged to the console. |
| **Mailchimp** | Set `MAILCHIMP_API_KEY` + `MAILCHIMP_LIST_ID`, then tick *Subscribe to Mailchimp* on a form (the "Newsletter" form has it). Failures never block a submission. |
| **Media (R2)** | Not wired yet — see `src/storage.ts`; images currently load from the live site. |
| **Parity check** | `pnpm crawl:diff` compares every imported URL on the live site with this build (status, redirects, title, description, canonical, H1, JSON-LD) → `reports/crawl-diff.json`. Run it against staging before launch: `pnpm crawl:diff --local https://staging.example.com`. |

Last full run (local vs live, 183 URLs): 0 status/redirect/title/H1 differences; the only differences are **added** structured data (BlogPosting / FAQPage / BreadcrumbList / Organization — the live site has none on posts).

Still to do: connect R2 + move images into the Media library, add analytics (Site settings → Scripts), final DNS/redirect cutover.

## Admin ↔ WordPress parity (what lives where)
- **Edit screens** (`src/components/admin/wp/*`): Publish box, Permalink, Categories/Tags, Screen Options + Help (`EditTop`), and for pages a read-only **Page code** box (`PageCode`, `/api/av/page-code`) showing the Next.js files that render the page's template.
- **Body editor**: TinyMCE (Visual/Text + Add Media), self-hosted from `public/tinymce` (copied by `pnpm tinymce:copy`, runs on install and in the Docker build). Bodies are HTML in `contentHtml`; the old Lexical `content` is a hidden fallback.
- **List screens**: status links, bulk actions, Quick Edit, Screen Options, real Trash (soft delete: Restore / Delete permanently).
- **Redirections**: matched in `src/proxy.ts` via `/api/av/redirect` so 301/302/307/410/451 are sent with their exact status (rules cached 15 s, cleared on change).
- **Sitemaps**: Rank Math style — `/sitemap_index.xml`, `/post-sitemap.xml`, `/post-sitemap2.xml`… split by *Links per sitemap*, with images (`src/app/(frontend)/api/av/sitemap`).
- **Contact forms**: Messages tab, confirmation type/redirect, and Additional settings (`demo_mode`, `skip_mail`, `subscribers_only`) are applied (`src/hooks/formSettings.ts`, `FormRenderer`).
- **Tools**: Backups (JSON + media .tar.gz when local files exist), Site Health, Cache.
- **Comments**: `comments` collection (pending / approved / spam / trash, threaded). Public submit/list API `/api/av/comment` (honeypot, time trap, rate limit, duplicate check, WordPress moderation rules). Rendered on posts by `components/Comments*.tsx`. Settings in Plugin settings → Discussion (default **off**, same as the original site; per-post override in the post's Discussion box).
- **Other screens**: Settings → Permalinks (read-only: structure is fixed to WordPress's), Appearance → Widgets (hub to each widget area), Tools → Export & Import (JSON, matched by slug).
- **Not built**: WordPress plugin/theme install screens.

## Deploying a test copy safely (no indexing, no side effects)

Search engines are blocked unless **all three** hold: `SITE_ENV=production`, the site host is in `INDEXABLE_HOSTS`,
and **Admin → Search visibility → Block search engines** is OFF. Anything else = blocked (noindex meta + `X-Robots-Tag`
on every response, `robots.txt` Disallow, sitemap/feed/`llms.txt` return 404).

Test deploy `.env`:

```
SITE_ENV=staging
NEXT_PUBLIC_SITE_URL=https://test.example.com
INDEXABLE_HOSTS=                 # leave empty
TEST_MAIL_TO=you@example.com     # optional: form mail goes here instead of real recipients
```

Analytics/tracking scripts, form emails and Mailchimp are off on any non-live host. After deploying:

```
pnpm check:indexing https://test.example.com
```

Go-live: `SITE_ENV=production`, `INDEXABLE_HOSTS=aivastra.com,www.aivastra.com`, then turn the
switch OFF in Search visibility (it asks you to type ALLOW; every change is logged with who/when).

## After deploying this version

```
pnpm payload migrate        # applies the new migrations
pnpm seo:rescore            # stores the SEO score for existing content (list column / filters)
pnpm media:regenerate       # only after media files are local: builds the new medium/large sizes
```

Scheduled publishing needs the app server to stay running (built-in job runner, `JOBS_AUTORUN`).
