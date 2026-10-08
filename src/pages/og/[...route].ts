import { OGImageRoute } from 'astro-og-canvas';

export const { getStaticPaths, GET } = await OGImageRoute({
  param: 'route',
  pages: {
    index: {
      title: "It's Done.",
      description: 'Same site. Fewer Tuesdays. A fair reply to "It Looks Done", with the third option it left out: a static site, built properly.',
    },
  },
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    bgGradient: [[14, 14, 13]],
    font: {
      title: { size: 96, color: [241, 241, 236], weight: 'Bold' },
      description: { size: 36, color: [76, 217, 138] },
    },
    padding: 80,
  }),
});
