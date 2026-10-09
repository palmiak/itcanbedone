import { OGImageRoute } from 'astro-og-canvas';

// The share image uses the same night sky, badge and type as the site. The background and badge are drawn
// by scripts/og-assets.py; the fonts come from the bundled @fontsource packages, so no network is needed.
export const { getStaticPaths, GET } = await OGImageRoute({
  param: 'route',
  pages: {
    index: {
      title: 'Looks done.\nIs done.',
      description: 'Same site. Same Tuesday. Almost nothing to patch.',
    },
  },
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    bgImage: { path: './src/og/background.png', fit: 'cover' },
    logo: { path: './src/og/badge.png', size: [80] },
    padding: 72,
    fonts: [
      './node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff',
      './node_modules/@fontsource-variable/inter-tight/files/inter-tight-latin-wght-normal.woff2',
    ],
    font: {
      title: { families: ['Instrument Serif'], size: 128, lineHeight: 1.0, color: [255, 255, 255] },
      description: { families: ['Inter Tight'], size: 38, lineHeight: 1.25, color: [190, 194, 228] },
    },
  }),
});
