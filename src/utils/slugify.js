/**
 * Convert a string to a URL-friendly slug
 * @param {string} text - The text to convert to a slug
 * @returns {string} - The slugified text
 */
export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Remove special characters except hyphens
    .replace(/[^\w\-]+/g, '')
    // Replace multiple hyphens with single hyphen
    .replace(/\-\-+/g, '-')
    // Remove hyphens from start and end
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Generate a slug from article title, limiting to reasonable length
 * @param {string} title - The article title
 * @param {number} maxLength - Maximum length of the slug (default: 50)
 * @returns {string} - The generated slug
 */
export function generateArticleSlug(title, maxLength = 50) {
  const slug = slugify(title);
  
  if (slug.length <= maxLength) {
    return slug;
  }
  
  // Truncate at word boundary if too long
  const words = slug.split('-');
  let result = '';
  
  for (const word of words) {
    if ((result + word).length > maxLength) {
      break;
    }
    result += result ? '-' + word : word;
  }
  
  return result || slug.substring(0, maxLength);
} 