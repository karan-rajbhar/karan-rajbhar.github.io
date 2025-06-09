import { defineConfig } from 'astro/config';
import remarkUnwrapImages from 'remark-unwrap-images';
import rehypeImgSize from 'rehype-img-size';
import { rehypeOptimizeImages } from './src/utils/rehype-optimize-images.js';
import pagefind from "astro-pagefind";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: 'https://karan-rajbhar.github.io/',
  base: '/',
  integrations: [
    mdx(),
    pagefind(),
    sitemap()
  ],
  markdown: {
    shikiConfig: {
      theme: 'dracula',
      langs: [],
      wrap: true,
    },
    remarkPlugins: [
      remarkUnwrapImages, // Unwrap images from paragraphs for better styling
    ],
    rehypePlugins: [
      [rehypeImgSize, { dir: 'public' }], // Add width/height attributes automatically
      rehypeOptimizeImages, // Add lazy loading and optimization attributes
    ],
  },
  image: {
    domains: ["images.unsplash.com", "via.placeholder.com"],
    remotePatterns: [{ protocol: "https" }],
  },
  compressHTML: true,
  vite: {
    build: {
      target: 'esnext',
      cssMinify: true
    }
  }
});