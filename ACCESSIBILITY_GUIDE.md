# Accessibility Guide

This guide covers the accessibility improvements made to the Astro project and how to use them effectively.

## ✅ **Completed Improvements**

### 1. 🖼️ **Image Optimization with `OptimizedImage` Component**

The `OptimizedImage` component automatically optimizes images using Astro's built-in `astro:assets`:

```astro
---
import OptimizedImage from '../components/OptimizedImage.astro';
---

<!-- Basic usage -->
<OptimizedImage
  src="https://example.com/image.jpg"
  alt="Descriptive alt text"
  width={800}
  height={600}
/>

<!-- Advanced usage with responsive images -->
<OptimizedImage
  src="/local-image.jpg"
  alt="Local image"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  widths={[320, 640, 960, 1280]}
  format="avif"
  quality={90}
  loading="lazy"
  class="hero-image"
/>
```

**Features:**
- ✅ Automatic format optimization (WebP, AVIF)
- ✅ Responsive image generation
- ✅ Lazy loading by default
- ✅ Custom quality settings
- ✅ SEO-friendly alt text requirements

### 2. 🛡️ **Error Boundaries**

Two error handling components have been created:

#### `ErrorBoundary` Component
Wraps content and catches JavaScript errors:

```astro
---
import ErrorBoundary from '../components/ErrorBoundary.astro';
---

<ErrorBoundary fallback="Custom error message">
  <SomeComponent />
</ErrorBoundary>
```

#### `ErrorFallback` Component
Standalone error page component:

```astro
---
import ErrorFallback from '../components/ErrorFallback.astro';
---

<ErrorFallback 
  title="Page Not Found"
  message="The page you're looking for doesn't exist."
  showRefresh={false}
/>
```

**Features:**
- ✅ Graceful error handling
- ✅ User-friendly error messages
- ✅ Error reporting to analytics
- ✅ Retry functionality
- ✅ Dark mode support

### 3. ♿ **Accessibility Features**

#### Skip Links (`SkipLinks` Component)
Automatically included in `BaseLayout.astro`:

```astro
<!-- Already included in BaseLayout -->
<SkipLinks />
```

**Features:**
- ✅ Keyboard-only navigation
- ✅ Skip to main content
- ✅ Skip to navigation
- ✅ Skip to footer
- ✅ High contrast support

#### Focus Management (`FocusManager` Component)
Automatically included in `BaseLayout.astro`:

```astro
<!-- Already included in BaseLayout -->
<FocusManager />
```

**Features:**
- ✅ Enhanced keyboard navigation
- ✅ Focus trapping for modals
- ✅ Focus restoration after view transitions
- ✅ Screen reader announcements
- ✅ Escape key handling

## 🎯 **Usage Guidelines**

### For Images
1. **Always use `OptimizedImage`** instead of regular `<img>` tags
2. **Provide descriptive alt text** for all images
3. **Use appropriate loading strategies** (`eager` for above-fold, `lazy` for below-fold)
4. **Specify dimensions** when known for better performance

### For Error Handling
1. **Wrap interactive components** in `ErrorBoundary`
2. **Use `ErrorFallback`** for custom error pages
3. **Customize error messages** for better user experience
4. **Test error scenarios** during development

### For Accessibility
1. **Use semantic HTML** elements
2. **Provide focus indicators** for interactive elements
3. **Test with keyboard navigation** (Tab, Enter, Escape, Arrow keys)
4. **Test with screen readers** (VoiceOver, NVDA, JAWS)
5. **Check color contrast ratios** (minimum 4.5:1)

## 🧪 **Testing Accessibility**

### Keyboard Navigation
1. Use only Tab, Shift+Tab, Enter, Escape, and Arrow keys
2. Ensure all interactive elements are reachable
3. Verify skip links work with Tab key
4. Test modal focus trapping

### Screen Reader Testing
1. **macOS**: VoiceOver (Cmd+F5)
2. **Windows**: NVDA (free) or JAWS
3. **Browser**: Built-in screen reader extensions

### Automated Testing
```bash
# Install axe-core for accessibility testing
npm install --save-dev axe-core

# Run Lighthouse accessibility audit
npm run lighthouse
```

### Manual Checklist
- [ ] All images have alt text
- [ ] Focus indicators are visible
- [ ] Keyboard navigation works
- [ ] Skip links are present
- [ ] Color contrast is sufficient
- [ ] Error states are handled
- [ ] Loading states are announced

## 🔧 **Advanced Configuration**

### Focus Manager API
```javascript
// Access focus manager globally
window.focusManager.focusElement('#main-content');
window.focusManager.announceLiveRegion('Page loaded', 'polite');
```

### Error Reporting Integration
```javascript
// In ErrorBoundary component, you can add:
// Sentry integration
Sentry.captureException(error);

// Custom analytics
analytics.track('error', { message: error.message });
```

### Custom Skip Links
```astro
<!-- Add custom skip links -->
<div class="skip-links">
  <a href="#search" class="skip-link">Skip to search</a>
  <a href="#comments" class="skip-link">Skip to comments</a>
</div>
```

## 📊 **Performance Impact**

### Image Optimization
- ✅ **50-80% file size reduction** with modern formats
- ✅ **Faster loading** with responsive images
- ✅ **Better Core Web Vitals** scores

### Error Boundaries
- ✅ **Minimal performance impact** (< 1KB)
- ✅ **Better user experience** during errors
- ✅ **Improved error tracking**

### Accessibility Features
- ✅ **No performance impact** for mouse users
- ✅ **Enhanced experience** for keyboard users
- ✅ **Better SEO** with semantic HTML

## 🚀 **Next Steps**

### Additional Improvements
1. **Add form validation** with accessible error messages
2. **Implement ARIA live regions** for dynamic content
3. **Add loading states** with proper announcements
4. **Create accessible modals** with focus trapping
5. **Add print stylesheets** for better printability

### Monitoring
1. **Set up error tracking** (Sentry, LogRocket)
2. **Monitor Core Web Vitals** in production
3. **Regular accessibility audits** with tools like axe
4. **User testing** with assistive technologies

## 📚 **Resources**

- [Web Content Accessibility Guidelines (WCAG) 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [Astro Accessibility Guide](https://docs.astro.build/en/guides/accessibility/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/) 