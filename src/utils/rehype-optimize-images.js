import { visit } from 'unist-util-visit';

/**
 * Custom rehype plugin to optimize images in markdown
 * Adds lazy loading, proper sizing, and optimization attributes
 */
export function rehypeOptimizeImages() {
  return (tree) => {
    let imageCount = 0;
    
    visit(tree, 'element', (node) => {
      if (node.tagName === 'img') {
        imageCount++;
        
        // First image should load eagerly (above-the-fold content)
        if (imageCount === 1) {
          node.properties.loading = 'eager';
          node.properties.fetchpriority = 'high';
          node.properties.decoding = 'sync';
        } else {
          // Other images should lazy load
          node.properties.loading = 'lazy';
          node.properties.fetchpriority = 'auto';
          node.properties.decoding = 'async';
        }
        
        // Add responsive sizing if not present
        if (!node.properties.style) {
          node.properties.style = 'max-width: 100%; height: auto; aspect-ratio: auto;';
        }
        
        // Ensure alt text exists for accessibility
        if (!node.properties.alt) {
          console.warn('Image missing alt text:', node.properties.src);
          node.properties.alt = '';
        }
        
        // Add sizes attribute for responsive images if not present
        if (!node.properties.sizes) {
          node.properties.sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
        }
      }
    });
  };
} 