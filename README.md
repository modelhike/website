# ModelHike — marketing site

Static, dependency-free marketing site for **ModelHike**, the intent compiler.
Built for senior developers and optimized for AI agents.

## Stack

- Plain `index.html` at repo root; everything else static lives under `assets/` (`styles.css`, `app.js`, icons, OG image, manifest, section images). No bundler, no framework.
- Inter + Geist Mono via Google Fonts, plus locally-loaded **Wremena** for editorial serif headings (with system-font fallback throughout).
- Vanilla `IntersectionObserver` for reveals, counters, and the file-tree compile animation.

## Run locally

Any static server works. Two zero-install options:

```bash
# Python
python3 -m http.server 4000

# Node
npx serve -l 4000 .
```

Then open http://localhost:4000.

## Files

| File                       | Purpose                                                                 |
|----------------------------|-------------------------------------------------------------------------|
| `index.html`               | Single-page site. Semantic HTML5 + JSON-LD (Organization, SoftwareApp, FAQPage). |
| `assets/styles.css`        | Design system. Light warm, editorial. CSS variables.                   |
| `assets/app.js`            | Hero terminal, file-tree compile animation, counters, copy button.      |
| `assets/favicon.svg`       | SVG favicon (mountains-as-letter mark).                                 |
| `assets/og.svg`            | Open Graph / Twitter card image.                                        |
| `assets/site.webmanifest`  | PWA manifest.                                                           |
| `assets/images/`           | Section illustrations (`rethink.png`, `problem.png`, `solution_punchy.png`). |
| `llms.txt`                 | Concise machine-readable summary for LLMs ([llmstxt.org](https://llmstxt.org)). |
| `llms-full.txt`            | Full marketing copy for LLM ingestion.                                  |
| `robots.txt`               | Welcomes major AI crawlers explicitly.                                  |
| `sitemap.xml`              | Sitemap.                                                                |
| `index.md`                 | Markdown companion to `index.html` (same basename; full copy for humans + AI). | each `*.html` has a same-basename `*.md` with the full copy mirror for humans and AI (e.g. `index.html` + `index.md`). Add a new `.md` whenever you add a new HTML page.

## AI-agent optimization

This site is intentionally legible to AI crawlers and assistants:

- **Semantic HTML5**: `<header>`, `<main>`, `<section>`, `<article>`, `<nav>`, `<footer>`, single `<h1>`, descending headings.
- **Structured data**: JSON-LD for `Organization`, `SoftwareApplication`, and `FAQPage` so the FAQ can surface as rich results.
- **`llms.txt` + `llms-full.txt`**: concise + full content in the proposed [llms.txt](https://llmstxt.org/) format, linked from the `<head>` via `<link rel="alternate">` and from `robots.txt`.
- **Per-page `*.md` companions**: same basename as each HTML page (e.g. `index.md` for `index.html`), linked from `<head>` as `alternate` markdown for crawlers and editors.
- **Open Graph + Twitter cards** with a 1200×630 image.
- **Permissive `robots.txt`** with explicit allows for `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `Applebot-Extended`, `CCBot`, and friends.
- **No JS required to read**: the entire copy renders without scripts; animations are progressive enhancement only.

## Design notes

- Palette: warm-paper canvas (`#ffffff` with cream alts `#f8f5f0` / `#f0ece5`), deep navy ink (`#0A1128`), green diff-add (`#4ade80`) and red diff-remove (`#f87171`) used semantically — matching the slogan *Diff the why, not the what*.
- Typography: **Wremena** (serif) for editorial headings, **Inter** (sans) for UI prose, **Geist Mono** for code, declaration, terminal, and badges.
- Motion: 600ms ease-out reveal on intersection. Honors `prefers-reduced-motion`.
- Layout: 1180px max container, 760px narrow track for prose, generous whitespace.

## Deploying

Drop the folder on any static host: Vercel, Netlify, Cloudflare Pages, S3, GitHub Pages.
No build step required.
