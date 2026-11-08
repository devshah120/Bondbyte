# BondByte — Website

Production Next.js site for bondbyte.in, with an admin panel at `/admin` where
inquiries and everything on the website are managed.

**Stack:** Next.js 16 (App Router) · TypeScript (strict) · Tailwind CSS v4 · GSAP + ScrollTrigger · Framer Motion · Lenis · React Hook Form + Zod · Lucide.

**Backend:** Next.js route handlers (`src/app/api`) with **JSON file storage** — no database.

```bash
npm run dev       # http://localhost:3000  (admin: http://localhost:3000/admin)
npm run build     # production build (.next/standalone)
npm start         # serve the build
npm run lint
npx tsc --noEmit  # typecheck
```

## First run

```bash
npm install
cp .env.example .env.local   # then set ADMIN_PASSWORD and TOKEN_SECRET
npm run dev
```

On the first request the server creates `data/content.json` from the original
site content (`src/lib/cms/seed/`), so the site looks exactly as before. Sign in
at `/admin` with `ADMIN_USERNAME` / `ADMIN_PASSWORD`, then set your own login
under **Login and password**.

---

## Admin panel (`/admin`)

Everything is saved straight to the website when you press Save.

| Screen | What you can change |
| --- | --- |
| Overview | New inquiries, published pages, live projects and articles, the latest changes. |
| Inquiries | Every message from the contact form, newest first, with a badge for new ones. Search, filter (Inbox / New / Archived), read, reply by email, mark as new, archive, delete, download as CSV. |
| Pages | Every page in a list. Add, copy, publish or keep as a draft, delete. Open a page to change its name, address, search engine texts and its **sections**: add, reorder, copy, show/hide, remove, and edit each section's texts in place. |
| Projects, Insights | Case studies (`/work/<address>`) and articles (`/insights/<address>`) with their own pages. Switch live/hidden, reorder, copy. Articles are written as blocks (paragraph, heading, quote, bullet list). |
| Work / Company / Pricing lists | Products, testimonials, clients, services, "what we build", team, technology, process steps, principles, pricing tiers, comparison rows, industry packages. |
| Header, Footer, Brand | Menu links and button, footer columns and social profiles, logo, name and browser icon. |
| Media library | Upload, rename and delete images. Images in use cannot be deleted; the panel says where they are used. |
| General settings | Company name, contact email and phone, location, registration number, search engine texts, share image, package labels and yearly discount, option lists. |
| Version history | Every save is kept (the latest 150). Restore any version — the current one is kept too. Inquiries and uploads are never affected. |
| Login and password | Change the admin username and password. Saving signs out every other device. |

**Automatic values:** texts can contain `{company}`, `{legalName}`, `{email}`,
`{phone}`, `{city}`, `{region}`, `{country}`, `{year}`, `{teamCount}` and
`{projectCount}`, which stay up to date by themselves.

**Two people at once:** if the same part is saved from two devices, the second
save is refused instead of overwriting the first, and the latest version loads.

**Contact form:** messages are saved and shown under Inquiries. A hidden field
catches bots and one visitor can send at most 5 messages in 10 minutes. When
`SMTP_*` is set (see `.env.example`) each message is also emailed; without it
nothing is lost.

**Fixed addresses:** the home (`/`), work (`/work`) and insights (`/insights`)
pages keep their addresses because projects and articles live under them.
`/admin`, `/api` and `/uploads` are reserved.

---

## Where the data lives

Everything the admin creates is in `DATA_DIR` (default `./data`, in production
`/var/www/bondbyte/data`). **It is not in git: include it in server backups.**

| Path | What it is |
| --- | --- |
| `content.json` | All site content: settings, header, footer, brand, pages with their sections, and every list. |
| `inquiries.json` | Contact form messages. Not part of the version history. |
| `uploads/` + `media.json` | Uploaded images (served at `/uploads/...`) and their names. |
| `history/` | Saved versions for Version history. |
| `auth.json` | The admin login set in the dashboard (password stored hashed with scrypt). |

Writes are atomic (temp file + rename) and queued, so a crash never leaves half
a file. A hand edit of `content.json` is picked up without a restart.

**Forgot the admin password?** Delete `DATA_DIR/auth.json` and restart; the
login from the environment works again.

### Adding a field or section kind

1. Describe it in `src/lib/cms/schema.ts` (`OBJECTS`, `COLLECTIONS` or
   `SECTION_TYPES`). The admin form and server validation follow from it.
2. Add it to the types in `src/lib/cms/types.ts` (and a starting value in
   `defaults.ts` if existing content should get one).
3. Render it: section kinds are mapped to components in
   `src/components/site/SectionView.tsx`.

Content saved by an older version gets default values for new fields
automatically (`normalizeContent` in `src/lib/cms/content.ts`).

---

## Deploying (VPS with nginx + pm2)

`next.config.ts` builds a **standalone** Node server. Pushing to `main` runs
`.github/workflows/deploy.yml`: lint, build, upload, unpack into
`/var/www/bondbyte/releases/<time>-<sha>`, switch the `current` symlink and
`pm2 startOrReload`. The three newest releases are kept; `data/` is never
touched by a deploy.

### First-time server setup

The previous version of the site was a static export served straight by nginx.
Do this once **before** pushing this version to `main`:

```bash
# Node 22 and pm2
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt-get install -y nodejs
sudo npm install -g pm2
pm2 startup            # follow the printed command so pm2 starts on boot

# Folders (owned by the deploy user)
sudo mkdir -p /var/www/bondbyte/{releases,shared,data}
sudo chown -R $USER /var/www/bondbyte

# Secrets: copy .env.example and fill in ADMIN_PASSWORD, TOKEN_SECRET and SMTP_*
nano /var/www/bondbyte/shared/.env
chmod 600 /var/www/bondbyte/shared/.env
```

Then push (or run the workflow by hand) and, once it reports `Published`,
switch nginx from the static folder to the Node server:

```bash
sudo cp deploy/nginx-bondbyte.conf /etc/nginx/sites-available/bondbyte
sudo nginx -t && sudo systemctl reload nginx
```

The old `/var/www/bondbyte/out` folder can be deleted afterwards. Useful
commands: `pm2 logs bondbyte`, `pm2 restart bondbyte`. To roll back, point
`current` at an older release and `pm2 reload bondbyte`.

---

## A note on accuracy

Every figure and claim on this site is traceable to the existing BondByte site
or source. Keep it that way when editing in the admin panel:

1. **Testimonials** are empty and the section renders nothing until a real,
   attributable quote is added — never sample text.
2. **Project results** are empty for every project; add only verified numbers.
3. **Industry package and pricing tier prices are placeholders** and must be
   replaced with BondByte's real rates. Yearly package prices are derived from
   the monthly price and the yearly discount in General settings.
4. **The footer MSME badge is typographic, not the official emblem** (see
   `components/ui/UdyamMark.tsx`).
5. **Privacy and Terms are baselines** and should be reviewed by a legal
   advisor.

---

## Architecture

```
src/
├── app/
│   ├── (site)/              # public site: layout (header/footer), [[...slug]] CMS pages, work/ and insights/ detail pages
│   ├── admin/               # the admin panel (client app)
│   ├── api/admin/[...path]  # admin API (one router: src/lib/cms/server/admin-api.ts)
│   ├── api/inquiries        # contact form
│   └── uploads/[file]       # serves media library files
├── components/
│   ├── admin/               # panel: shell, screens/, schema-driven fields, media picker
│   ├── site/                # SiteProvider, SectionView (section kind → component)
│   └── animations/ hero/ layout/ navigation/ sections/ services/ work/ ui/ footer/
└── lib/
    ├── cms/
    │   ├── schema.ts        # every editable field, shared by forms and validation
    │   ├── types.ts  content.ts  defaults.ts
    │   ├── seed/            # the original content, used for a fresh install
    │   └── server/          # JSON store, history, inquiries, media, auth (server only)
    ├── animations/  email/  validation/  utils/
```

**Rendering:** public pages are rendered per request (`force-dynamic`) from the
in-memory copy of `content.json`, so admin changes show immediately.

**Security:** the admin session is a signed, expiring token in an httpOnly,
SameSite=Strict cookie. Every admin request that changes something must carry
an `x-bondbyte-admin` header, which a cross-site form cannot send. Sign in and
the contact form are rate limited per IP. Uploads are checked by their bytes
(never the file name), SVGs with scripts are refused, and uploads are served
with a sandboxing Content-Security-Policy.

**Theme bands:** the site is light (`#F8FAFF`) by default. Any section becomes
the tinted band with `data-band="tint"` or the deep navy band with
`data-band="dark"`. Never hardcode a colour on a section; set its band.

**Motion:** GSAP drives scroll work; Framer Motion handles component/route/menu
transitions. Lenis is bound to GSAP's ticker. Everything is disabled under
`prefers-reduced-motion`.
