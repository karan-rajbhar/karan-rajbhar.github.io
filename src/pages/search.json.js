import { getCollection } from 'astro:content';

export async function GET() {
  const articles = await getCollection('articles');
  
  const searchData = articles.map(article => ({
    title: article.data.title,
    description: article.data.description,
    url: `/articles/${article.slug}`,
    content: article.body,
  }));

  return new Response(JSON.stringify(searchData), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
} 