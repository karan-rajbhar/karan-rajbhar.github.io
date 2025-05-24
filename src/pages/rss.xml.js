import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
const articles = await getCollection('articles');

export async function GET(context) {
  return rss({
    title: 'Karan Rajbhar',
    description: 'My thoughts on web development and technology',
    items: articles.map((article) => ({
      ...article.data,
      pubDate: article.data.pubDate,
      link: `/articles/${article.slug}/`,
    })),
    site: context.site,
  });
}