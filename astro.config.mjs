import { defineConfig } from 'astro/config';

// Public URL of the deployed site, used for canonical and Open Graph links.
// GitHub Pages: SITE/BASE_PATH come from .github/workflows/deploy.yml.
// Netlify sets URL; Vercel sets VERCEL_PROJECT_PRODUCTION_URL. Locally none are set,
// so `site` stays undefined and the layout simply omits absolute URLs.
const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const site = process.env.SITE || process.env.URL || (vercel ? `https://${vercel}` : undefined);

export default defineConfig({
  site,
  base: process.env.BASE_PATH || '/',
  // The dev toolbar overlays hover tooltips on the page during `npm run dev`; off for a clean preview.
  devToolbar: { enabled: false },
});
