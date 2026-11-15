# Venelle Matutina · Portfolio

An editorial, animation-driven portfolio ("The Annotated Page") built with Astro, GSAP and Lenis.

## Run locally

```bash
npm install
npm run dev        # http://localhost:4321
```

## Edit content

All text lives in `src/data/`:

| File | What's in it |
|---|---|
| `experience.ts` | Profile, teaching case studies, leadership roles, writing |
| `seminars.ts` | The Reading Log (trainings and seminars) |
| `skills.ts` | The Toolkit section |

Search for `TODO(Venelle)` to find things that still need her input.

**Photo:** save a portrait as `public/portrait.jpg` (4:5 ratio, about 544×680). Until then a monogram shows.

## Deploy (free, online 24/7)

Pushing to `main` builds and publishes the site with GitHub Actions (`.github/workflows/deploy.yml`).

One-time setup: GitHub repo → **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Structure

```
src/
  data/          content (edit here)
  layouts/       page shell, header, footer
  components/    Pen.astro (red-pen underline)
  pages/         home + /teaching/[slug] case studies
  scripts/       motion.ts (GSAP, ScrollTrigger, SplitText, Flip, Lenis)
  styles/        global.css (design tokens, layout, motion states)
```

Motion respects `prefers-reduced-motion`, and every section stays readable if JavaScript fails.
