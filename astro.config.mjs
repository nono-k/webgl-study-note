// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

import { siteConfig } from './src/config';

const { siteUrl } = siteConfig;

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "src/styles/mixin.scss";',
        },
      },
    },
  },
  integrations: [mdx()],
});
