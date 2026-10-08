// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// TODO: replace with the real domain before deploying.
export default defineConfig({
  site: 'https://itsdone.example',
  integrations: [sitemap()],
  // Local stand-in for the host-level 301 in public/_redirects.
  redirects: { '/prodcuts': '/' },
  build: { inlineStylesheets: 'never' },
  // Keep every script/style an external file so the CSP can stay free of 'unsafe-inline'.
  vite: { build: { assetsInlineLimit: 0 } },
});
