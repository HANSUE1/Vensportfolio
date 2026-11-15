import { defineConfig } from 'astro/config';

// SITE and BASE_PATH are injected by the GitHub Pages workflow.
// Locally (npm run dev) the site lives at "/".
export default defineConfig({
  site: process.env.SITE || 'http://localhost:4321',
  base: process.env.BASE_PATH || '/',
});
