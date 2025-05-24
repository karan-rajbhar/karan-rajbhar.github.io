import { defineConfig } from 'astro/config';

import preact from "@astrojs/preact";
import pagefind from "astro-pagefind";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: 'https://karan-rajbhar.github.io/',
  base: '/',
  integrations: [
    preact(),
    pagefind(),
    sitemap()
  ],
  markdown: {
    shikiConfig: {
      theme: 'dracula',
      langs: [],
      wrap: true,
    },
    remarkPlugins: [],
    rehypePlugins: [],
  },
  image: {
    domains: ["images.unsplash.com", "via.placeholder.com"],
    remotePatterns: [{ protocol: "https" }],
  },
  compressHTML: true,
  vite: {
    ssr: {
      noExternal: ['@astrojs/preact']
    },
    build: {
      target: 'esnext',
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['preact']
          }
        }
      }
    }
  }
});