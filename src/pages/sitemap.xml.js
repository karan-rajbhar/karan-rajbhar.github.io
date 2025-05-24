import { getCollection } from 'astro:content';

export async function GET({ site }) {
  const articles = await getCollection('articles');
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${site}</loc>
      <changefreq>weekly</changefreq>
      <priority>1.0</priority>
    </url>
    <url>
      <loc>${site}/articles</loc>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>${site}/about</loc>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
    </url>
    ${articles.map(article => `
    <url>
      <loc>${site}/articles/${article.data.slug || article.slug}</loc>
      <lastmod>${article.data.pubDate.toISOString()}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.6</priority>
    </url>`).join('')}
    ${articles.flatMap(article =>
      article.data.tags?.map(tag => `
    <url>
      <loc>${site}/tags/${tag}</loc>
      <changefreq>monthly</changefreq>
      <priority>0.5</priority>
    </url>`) || []
    ).join('')}
  </urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
} 