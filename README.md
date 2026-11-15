# Venelle Matutina · Portfolio

A playful, motion-rich portfolio built with Astro and GSAP: dotted-paper background, giant handwritten
tickers that move with scroll, a magnetic hero circle, a custom cursor with a spark trail, and case-study pages.

## Run locally

```bash
npm install
npm run dev        # http://localhost:4321
```

If the dev server shows "Outdated Optimize Dep" errors after dependencies change, stop it and run `npm run dev` again.

## Pages

| URL | What it shows |
|---|---|
| `/` | Works: hero, tickers, "Currently" panel, case-study grid, "What I've been up to" gallery |
| `/work/<slug>/` | Case study with sticky contents and reading progress |
| `/leadership/` | Student leadership roles |
| `/learning/` | Reading Log of seminars, filterable by theme |
| `/about/` | Bio, education, skills |

## Edit content

All text lives in `src/data/`:

| File | What's in it |
|---|---|
| `experience.ts` | Profile, case studies (`works`), leadership roles, education |
| `seminars.ts` | The Reading Log |
| `skills.ts` | Skills on the About page |

Search for `TODO(Venelle)` to find things that still need her input. Wrap a phrase in `**double asterisks**`
inside a summary to make it bold.

## Photos

Portraits live in `src/assets/` and are resized and converted to WebP at build time:

| File | Where it appears |
|---|---|
| `src/assets/portrait-circle.jpg` | Home hero circle (square crop) |
| `src/assets/portrait.jpg` | About page (4:5) and the link-preview image |
| `src/assets/candid.jpg` | Small dashed photo on the About page |

Replace a file with the same name to change the photo.

Cards show generated art until a photo is added. Drop files into `public/` and rebuild:

| File | Where it appears |
|---|---|
| `public/work/<slug>.jpg` | A case-study card and its cover, e.g. `work/literacy-tutor.jpg` |
| `public/work/literacy-tutor-2.jpg`, `-3.jpg` | The two small tiles in the "Currently" panel |
| `public/work/<leadership-id>.jpg` | Leadership cards, e.g. `work/class-secretary.jpg` |

Blur or crop out children's faces unless you have consent.

## Background

The dotted background on Works, Leadership, Learning and case-study pages is an interactive WebGL dot grid
(`src/scripts/dotgrid.js`, ported from the React Bits `<DotGrid />` component to plain JavaScript). Dots light up
orange near the cursor and ripple out from clicks. Tweak colors, size and spacing in `initDotGrid()` in
`src/scripts/site.ts`. Browsers without WebGL2 fall back to the static CSS dots.

## Motion and accessibility

- Visitors with "reduce motion" turned on get a static page: no loader, tickers, trail or reveals.
- The custom cursor only appears on desktop with a mouse; touch devices keep the normal behavior.
- If JavaScript fails to load, a 3-second failsafe reveals all content.

## Deploy

`.github/workflows/deploy.yml` publishes to GitHub Pages on every push to `main`
(enable it under Settings → Pages → Source: GitHub Actions). For Vercel or Netlify instead, import the repo
there and delete that workflow file. No code changes are needed.
