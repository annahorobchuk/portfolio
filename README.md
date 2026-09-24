# Portfolio

Static portfolio site. No build step — open `index.html` in a browser, or serve the
folder:

```bash
python3 -m http.server 8000 --directory /Users/anna.horobchuk/Downloads/portfolio
```

## Structure

Mirrors the layout of the reference site (pratibhajoshi.com):

```
index.html            Hero → work grid → mentions → let's connect
about.html            Bio → illustrations → photography
experiments.html      Side projects + exploration gallery
contact.html          Email + social links
work/
  cli-theme/          REAL case study — my-theme.json (OpenCode CLI theme)
  _template.html      Copy this to start a new case study
  case-study-2..6.html  Placeholder case studies
assets/
  css/style.css       All styles (design tokens at the top of the file)
  js/main.js          Mobile nav toggle + back-to-top button
  img/                Drop images here
```

## Page anatomy (home)

1. **Sticky nav** — logo mark left, Home / About / Experiments / Contact right.
2. **Hero** — large statement headline with the company name in accent pink, a
   "Previously at …" line, and a portrait sitting on an offset colour block.
3. **Work grid** — two-column tinted cards. Serif title, one-line description, an
   arrow CTA, and a cover image peeking in from the bottom edge of the card.
4. **Mentions** — logo grid of places that featured your work.
5. **Let's Connect** — email + social icons, on a soft grey band.
6. **Back-to-top** button, appears after 600px of scroll.

## Breadcrumbs

Every case study page carries `Home / Work / <title>` under the nav. "Work" links to
`index.html#work`, which is the id on the work grid section.

- Placeholder pages use `<nav class="wrap breadcrumb">` — styles live under the
  **Breadcrumb** heading in `style.css`. When you copy `_template.html`, update the
  last `<li>` to match the new `<h1 class="cs-title">`.
- The CLI theme page has its own dark design, so it gets a matching mono breadcrumb
  (`<nav class="brand crumbs">`) in its topbar instead, which works in both its dark
  and light modes.

## The CLI theme case study

`work/cli-theme/` is a **copy** of `~/Documents/personal/pf/CLI Theme/`, which stays
the source of truth (it holds the Figma-extracted database in `data/`). Two edits were
made to the copy only: a breadcrumb back to the portfolio in the topbar, and the CSS
for it. Re-sync after editing the original:

```bash
rsync -a --exclude='.DS_Store' "$HOME/Documents/personal/pf/CLI Theme/" \
  /Users/anna.horobchuk/Downloads/portfolio/work/cli-theme/
```

That overwrites the breadcrumb edit — re-add it in the `.brand` div if you re-sync.

It gets a dark card on the home page (`case-card--terminal`) whose colours are the
shipped `my-theme.json` dark palette, with a small CSS render of the terminal as the
cover instead of a screenshot.

## What to fill in

Everything marked `[Placeholder]`, `Placeholder`, or `Case Study One…Six`:

- **Name, role, company** — hero headline in `index.html`, plus each page `<title>`
  and the `.colophon` line in every footer.
- **Email** — `hello@example.com` appears in every footer and on `contact.html`.
- **Social links** — the `href="#"` values in the `.socials` block.
- **Portrait** — replace `<div class="portrait__ph">Portrait</div>` with
  `<img src="assets/img/portrait.jpg" alt="…">`.
- **Case study covers** — replace `<div class="thumb-ph">Cover image</div>` with
  `<img src="assets/img/case-1.png" alt="…">`.
- **Card tints** — swap the modifier class: `case-card--peach`, `--lavender`,
  `--periwinkle`, `--butter`, `--mint`, `--sky`.
- **Mentions logos** — replace the text inside each `.mention` with an `<img>`.

## Notes

- Colours, fonts, spacing and radii are CSS custom properties in the `:root` block at
  the top of `assets/css/style.css` — change them there, not per-component.
- One typeface throughout: **Poppins**, loaded from Google Fonts. Headings use
  `--font-display`, which is aliased to `--font-sans` — point it at a different family
  in `:root` to restyle every heading at once. (JetBrains Mono is loaded on the home
  page only, for the terminal card.)
- The footer and nav are duplicated as plain HTML on each page. If that becomes
  tedious to keep in sync, the next step is a small static-site generator
  (Eleventy, Astro) with the nav/footer as partials.
