# PYMLABS TECHNOLOGY: official website

React + Vite + TypeScript + Tailwind CSS + Framer Motion + Lucide icons.
Every route is pre-rendered to static HTML at build time, so the output runs on any static or shared
host (no Node.js on the server). See **[DEPLOYMENT.md](DEPLOYMENT.md)** for uploading to ProFreeHost.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server (http://localhost:5173) |
| `npm run typecheck` | TypeScript check |
| `npm run build` | Type-check, client build, SSR build, pre-render every page into `dist/` |
| `node scripts/serve.mjs` | Serve `dist/` the way Apache shared hosting does (no SPA fallback) |
| `npm run package` | Build and create `release/pymlabs-website-htdocs.zip` for `/htdocs` |
| `node tools/qa.mjs http://localhost:4173` | Headless-Chrome QA: console errors, broken links/images, h1s, menu, slider, form |

## Structure

```
src/
  config/site.ts        Site URL, email, founder, social links, form endpoint, image credits
  data/                 routes.ts (titles/meta), nav.ts, services.ts, solutions.ts, projects.ts
  components/           Header, Footer, Logo, Button, Reveal, PageHero, CtaSection, StageSlider,
                        ContactForm, LegalPage, RouteEffects, fragments/ (illustrative UI pieces)
  pages/                Home, About, Services, Solutions, Portfolio, Contact, Privacy, Terms, NotFound
  lib/head.ts           Per-page <head>: title, description, canonical, Open Graph, Twitter, JSON-LD
  styles/index.css      Design tokens, type steps, motion (all respects prefers-reduced-motion)
  entry-server.tsx      Render function used by the pre-renderer
  main.tsx              Client entry (hydrates the pre-rendered HTML)
scripts/
  prerender.mjs         Writes dist/<route>/index.html, 404.html, sitemap.xml, robots.txt, .htaccess
  package.mjs           Creates the deployment ZIP
  serve.mjs             Apache-like local static server
public/                 Icons, Open Graph image, logo files (brand/)
brand-source/           Original logo file supplied by PYMLABS (not deployed)
tools/                  Templates used to render og-image.png, QA scripts (not deployed)
```

## Content rules

- Only verified facts. No invented clients, testimonials, numbers, awards or addresses.
- Portfolio entries go in `src/data/projects.ts` only with permission to publish them.
- The interface fragments on the site are labelled as examples of the kind of software PYMLABS
  builds. They are not client work.
- If you add third-party photos, check their licence and credit them where the licence requires.
