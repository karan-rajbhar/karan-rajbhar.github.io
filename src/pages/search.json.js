import { getCollection } from 'astro:content';

export async function GET() {
  try {
    const posts = await getCollection('posts');
    
    const searchData = posts.map(post => ({
      title: post.data.title,
      description: post.data.description || '',
      url: `/posts/${post.slug}`,
      tags: post.data.tags || [],
      content: post.body.slice(0, 500) // First 500 chars for search
    }));

    return new Response(JSON.stringify(searchData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error generating search data:', error);
    return new Response('[]', {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} 