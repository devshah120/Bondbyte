# BondByte — Website

Production Next.js rebuild of bondbyte.in.

**Stack:** Next.js 16 (App Router) · TypeScript (strict) · Tailwind CSS v4 · GSAP + ScrollTrigger · Framer Motion · Lenis · React Hook Form + Zod · Lucide.

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
npm start       # serve the build
npx eslint src  # lint
npx tsc --noEmit # typecheck
```

---

## Content is data, not markup

All copy that describes the company lives in `src/lib/constants/`. Edit these
files to update the site — no component changes needed.

| File | Holds |
| --- | --- |
| `constants/site.ts` | Name, email, phone, location, nav, social links |
| `constants/work.ts` | Projects, clients, owned products |
| `constants/company.ts` | Team, services, process, principles, stats, testimonials |
| `constants/technology.ts` | The technology grid (icons live in `components/ui/TechIcon.tsx`) |
| `constants/pricing.ts` | Pricing tiers and the delivery-model comparison |
| `constants/industries.ts` | Industries, packages, features and pricing (Work by Industry) |
| `constants/capabilities.ts` | "What we build" categories |
| `constants/insights.ts` | Blog/insight articles |
| `constants/keywords.ts` | Keyword marquee rows |

### A note on accuracy

Every figure and claim on this site is traceable to the existing BondByte site
or source. Several deliberate decisions to be aware of:

1. **Statistics** (`company.ts` → `STATS`) are derived from verified counts —
   projects in `work.ts`, people in `TEAM`. The legacy site's
   "500 projects / 200 clients / 15 years" values were **unmodified template
   placeholders** (bondbyte.in renders them as `0`) and were not carried over.
   Add a metric only once the number is confirmed.

2. **Testimonials** (`company.ts` → `TESTIMONIALS`) is an empty array. The
   section renders nothing while it is empty. Add real, attributable quotes and
   it appears automatically — never fill it with sample text.

3. **Project metrics** (`work.ts` → `metrics`) are empty for every project. No
   outcome figures are published, so none are shown.

4. **Industry package pricing is placeholder.** Every package in
   `constants/industries.ts` is flagged `isPlaceholder: true`. Yearly prices are
   *derived* from monthly via `YEARLY_DISCOUNT`, so the advertised saving can
   never drift out of sync — change the monthly figure and the toggle follows.

5. **The footer MSME badge is typographic, not the official emblem.** The State
   Emblem of India is restricted under the State Emblem of India (Prohibition of
   Improper Use) Act, 2005. To use your real certificate logo, follow the
   instructions in `components/ui/UdyamMark.tsx`.

6. **Privacy and Terms are baselines.** `/privacy` and `/terms` describe what
   the site actually does, but should be reviewed by a legal advisor before
   launch.

7. **Pricing is placeholder.** Every tier in `constants/pricing.ts` with
   `isPlaceholder: true` carries an invented rate and **must be replaced with
   BondByte's real prices before launch**. The comparison table deliberately
   compares *delivery models* (builder / freelancer / in-house / BondByte) on
   structural facts, and makes no claims about any named agency's price or
   quality.

---

## Wiring up email (required before the contact form can send)

The old site used PHP `mail()`, which Next.js cannot run. Delivery now goes
through a pluggable provider in `src/lib/email/provider.ts`.

**Until a provider is configured**, the API validates submissions, logs them to
the server console, and returns a clear message telling the visitor to email
`support@bondbyte.in` directly. It never pretends to have sent.

To enable sending with [Resend](https://resend.com) (recommended):

```bash
npm install resend
```

Add to `.env.local`:

```
RESEND_API_KEY=re_xxxxxxxxxxxx
```

Then uncomment the `resendProvider` block in `getEmailProvider()`
(`src/lib/email/provider.ts`) and verify your sending domain in Resend.

Any other transport (SendGrid, SMTP via nodemailer, an internal service) only
needs to satisfy the `EmailProvider` interface in the same file.

---

## Adding real project images

Case studies currently render designed abstract visuals. To use a real
screenshot:

1. Drop the file into `public/projects/` (WebP or AVIF preferred).
2. Set `image` on that project in `src/lib/constants/work.ts`:

```ts
{ slug: "kindify", /* … */ image: "/projects/kindify.webp" }
```

`ProjectVisual` swaps to a `next/image` render automatically — no layout work.

---

## Architecture

```
src/
├── app/                 # routes, API, sitemap, robots
├── components/
│   ├── animations/      # AnimatedText, Reveal
│   ├── hero/            # Hero + canvas system visual
│   ├── layout/          # SmoothScroll, PageTransition, StructuredData
│   ├── navigation/      # Navbar, MobileMenu
│   ├── sections/        # page sections
│   ├── services/  work/ # domain sections
│   ├── ui/  footer/     # primitives, footer
└── lib/
    ├── animations/      # reusable GSAP utilities
    ├── constants/       # all content
    ├── email/           # pluggable transport
    ├── utils/  validation/
```

**Client/server split:** pages and content sections are React Server
Components. Only genuinely interactive pieces (`"use client"`) ship JS — the
nav, cursor, hero, forms and scroll-driven sections.

**Theme bands:** the site is light (`#F8FAFF`) by default. Any section becomes
the tinted band with `data-band="tint"` or the deep navy band with
`data-band="dark"` — the tokens are redefined on that subtree, so components
inside keep using `bg-bg`, `text-fg`, `border-line` and invert automatically.
Never hardcode a colour on a section; set its band.

**Motion:** GSAP drives scroll work (reveals, parallax, pinned horizontal
scroll, counters); Framer Motion handles component/route/menu transitions.
Lenis is bound to GSAP's ticker so both share one RAF loop. Everything is
disabled under `prefers-reduced-motion`.
