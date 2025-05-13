export function searchPosts(posts, query) {
  if (!query) return [];
  
  const searchTerm = query.toLowerCase();
  return posts.filter(post => {
    const content = `${post.data.title} ${post.data.description} ${post.data.tags.join(' ')}`.toLowerCase();
    return content.includes(searchTerm);
  }).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
} 