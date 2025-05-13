import { defineConfig } from 'astro/config';

import preact from "@astrojs/preact";
import pagefind from "astro-pagefind";

// https://astro.build/config
export default defineConfig({
  site: 'https://karan-rajbhar.github.io/',
  base: '/',
  integrations: [preact(), pagefind()],
  markdown: {
    shikiConfig: {
      theme: 'dracula',
      langs: [],
      wrap: true,
    },
  },
  vite: {
    ssr: {
      noExternal: ['@astrojs/preact']
    },
    build: {
      target: 'esnext'
    }
  }
});