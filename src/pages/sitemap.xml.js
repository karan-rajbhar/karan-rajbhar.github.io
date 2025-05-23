import { getCollection } from 'astro:content';

export async function GET() {
  const posts = await getCollection('posts');
  const site = 'https://karan-rajbhar.github.io';

  const staticPages = [
    '',
    '/about',
    '/articles',
    '/tags'
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => `
  <url>
    <loc>${site}${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.7'}</priority>
  </url>`).join('')}
  ${posts.map(post => `
  <url>
    <loc>${site}/posts/${post.slug}</loc>
    <lastmod>${new Date(post.data.pubDate).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
  ${posts.flatMap(post => 
    post.data.tags?.map(tag => `
  <url>
    <loc>${site}/tags/${tag.toLowerCase()}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`) || []
  ).filter((value, index, self) => self.indexOf(value) === index).join('')}
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
} 