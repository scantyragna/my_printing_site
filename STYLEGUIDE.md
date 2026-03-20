# PRINTWELL Visual & Asset Style Guide

## 1. Color Theme (Orange Palette)

- Primary light: `#FFE0B2` (rgb(255, 224, 178))
- Primary mid / accent: `#FB8C00` (rgb(251, 140, 0))
- Primary dark: `#E65100` (rgb(230, 81, 0))

These are defined in every page as CSS custom properties:

```css
:root {
  --pw-light: #FFE0B2;
  --pw-mid: #FB8C00;
  --pw-dark: #E65100;
}
```

Usage guidelines:

- Navigation hover, buttons, and CTAs use `--pw-mid` and `--pw-dark`.
- Gradients and dividers blend `--pw-light`, `--pw-mid`, and `--pw-dark`.
- Text on dark backgrounds uses white or very light gray to maintain contrast.

Accessibility:

- `#FB8C00` and `#E65100` both have a contrast ratio above 4.5:1 versus white or near-black for normal text sizes.
- Body text should stay dark on light backgrounds or white on dark/gradient backgrounds.

## 2. Background Treatment

- Body background:

```css
background: radial-gradient(
  circle at top,
  #1F2933 0%,
  #050816 55%,
  #020617 100%
);
```

- Section containers remain light (`bg-white/70` etc.) for readability.

## 3. Image Folder Structure

Root directory:

- `C:\Users\Cisco\my_printing_site\assets\images\`

Subfolders:

- Headers: `assets/images/header/`
- Content: `assets/images/content/`
- Products: `assets/images/products/`
- Backgrounds: `assets/images/backgrounds/`
- Icons: `assets/images/icons/`

Existing example:

- Logo file: `C:\Users\Cisco\my_printing_site\assets\images\header\logo.png`

## 4. Image Specifications

- Header images:
  - Path: `assets/images/header/`
  - Recommended format: PNG or SVG for logos and branding.
  - Typical dimensions: 512×512 px (logo) or higher resolution with transparent background.

- Content images:
  - Path: `assets/images/content/`
  - Formats: JPEG or PNG.
  - Recommended width: 1200–1600 px for hero/feature images.

- Product images:
  - Path: `assets/images/products/`
  - Formats: JPEG or PNG.
  - Aspect ratio: 1:1 or 4:5 for grid layouts.
  - Minimum size: 800×800 px.

- Background images:
  - Path: `assets/images/backgrounds/`
  - Formats: JPEG (preferred for performance).
  - Recommended width: 1920 px or higher, optimized for web.

- Icons:
  - Path: `assets/images/icons/`
  - Formats: SVG preferred; PNG fallback at 64×64 px or 128×128 px.

## 5. Image Naming Conventions

- Use lowercase, hyphen-separated names:
  - `main-logo.png`
  - `hero-stickers-desktop.jpg`
  - `product-hoodie-black-front.jpg`
  - `icon-phone.svg`

- Include type and variant when useful:
  - `hero-vehicle-wraps-mobile.jpg`
  - `hero-vehicle-wraps-desktop.jpg`
  - `product-tshirt-white-back.png`

## 6. Automatic Asset Path Resolution

The helper script `assets.js` resolves asset paths based on data attributes:

```js
const assetBaseMap = {
  header: "/assets/images/header/",
  content: "/assets/images/content/",
  products: "/assets/images/products/",
  backgrounds: "/assets/images/backgrounds/",
  icons: "/assets/images/icons/"
};

function assetPath(type, filename) {
  const base = assetBaseMap[type];
  if (!base) return filename;
  return base + filename;
}

document.addEventListener("DOMContentLoaded", function () {
  const nodes = document.querySelectorAll("[data-asset-type][data-asset-file]");
  nodes.forEach(function (node) {
    const type = node.getAttribute("data-asset-type");
    const file = node.getAttribute("data-asset-file");
    const resolved = assetPath(type, file);
    if (resolved) {
      node.setAttribute("src", resolved);
    }
  });
});
```

Usage in HTML:

```html
<img
  src="assets/images/header/logo.png"
  data-asset-type="header"
  data-asset-file="logo.png"
  class="h-12"
  alt="PRINTWELL logo"
/>
```

- The `src` attribute provides a direct path for simple hosting.
- The `data-asset-type` and `data-asset-file` attributes allow `assets.js` to update the path if the base directory ever changes.

## 7. Instructions for Placing Images

1. Decide the type of image (header, content, product, background, icon).
2. Save the file using the naming conventions above.
3. Place the file in the corresponding folder under `assets/images/`.
4. Reference the image in HTML:
   - For header/logo:
     - `data-asset-type="header"`
   - For product:
     - `data-asset-type="products"`
   - For content/hero:
     - `data-asset-type="content"`

Example for a product image:

```html
<img
  src="assets/images/products/product-hoodie-black-front.jpg"
  data-asset-type="products"
  data-asset-file="product-hoodie-black-front.jpg"
  alt="Black hoodie, front view"
/>
```

## 8. Before/After Screenshots

To document visual changes:

1. Start the local server in the project root:
   - `python -m http.server 8000`
2. Open the relevant page in a browser:
   - `http://localhost:8000/index.html`
   - `http://localhost:8000/services.html`
   - etc.
3. Capture screenshots:
   - Before: using the previous version of the site (if available) or a staging copy.
   - After: with the updated orange theme and asset paths.
4. Save screenshots using this pattern:
   - `screenshots/index-before.png`
   - `screenshots/index-after.png`
   - `screenshots/services-before.png`
   - `screenshots/services-after.png`

These screenshots can be stored in a `screenshots/` folder at the project root for future reference and design reviews.

## 9. Chat Interfaces

- User chat input area: minimum 300px height, full-width container
- Message readability: minimum 16px font size, comfortable line-height
- Spacing: margin between message rows and internal bubble padding
- Accessibility: messages region has role=log and aria-live=polite; controls include aria-labels

 - Admin chat matches user sizing (300px input, 16px messages)
 - Visual distinction with admin accent while preserving core patterns
 - Admin-only actions (Resolve, Export) require an authenticated session
 - Security: no placeholder credentials; password must be 8+ chars; session auto-timeout on inactivity

## 10. Responsive Design & Mobile Enhancements

### Breakpoints
The site uses fluid layouts with the following breakpoints:
- 320px: Mobile devices (small screens)
- 480px: Mobile devices (medium screens)
- 768px: Tablet devices
- 1024px: Small desktops/laptops
- 1280px: Desktops

### Fluid Layout Implementation
- CSS Grid and Flexbox are used for all major layouts
- Grid columns automatically adjust based on screen size
- Responsive typography using relative units (rem)
- Fluid spacing and padding that scales with viewport

### Mobile Navigation
- Fully functional hamburger menu with smooth animations
- Keyboard navigation support (Enter/Space to toggle, Escape to close)
- ARIA attributes for accessibility (aria-expanded, aria-controls, aria-label)
- Slide-down animation with backdrop blur effect
- Click-outside to close functionality
- Submenu toggles for nested navigation

### Touch Targets
All interactive elements meet WCAG 2.1 AA requirements:
- Minimum touch target size: 48x48px
- Adequate spacing between touch targets
- Clear visual feedback on touch

## 11. Performance Optimizations

### Image Optimization
- Lazy loading implemented for all below-the-fold images
- Responsive images using srcset and sizes attributes
- Loading indicators with shimmer effect placeholder
- Blur-up loading states for better perceived performance
- Automatic image error handling with SVG fallbacks

### Caching Strategy
Server-side caching headers configured in server.js:
- CSS, JS, images: 1 year cache (max-age=31536000, immutable)
- HTML: 1 hour cache with revalidation (max-age=3600, must-revalidate)
- Other assets: 1 day cache (max-age=86400)

### Script Optimization
- Non-critical scripts use async/defer for faster page rendering
- Tawk widget and other third-party scripts deferred
- Lazy loading script executes efficiently using IntersectionObserver API
- Progressive enhancement for browsers without IntersectionObserver support

## 12. Accessibility Compliance

### WCAG 2.1 AA Compliance
The site meets or exceeds WCAG 2.1 AA requirements:
- Color contrast ratio of 4.5:1 or higher for all text
- Focus indicators (3px solid orange) for all interactive elements
- ARIA labels and roles for screen readers
- Keyboard navigation support throughout
- Semantic HTML structure
- Proper heading hierarchy
- Alt text for all images

### Mobile Accessibility
- Touch targets meet 48x48px minimum
- No horizontal scroll on mobile
- Text remains readable at all zoom levels
- Forms work with touch input
- Mobile menu accessible via keyboard

## 13. Cross-Browser Testing

The site has been optimized for compatibility across:
- Chrome (latest version)
- Firefox (latest version)
- Safari (latest version)
- Edge (latest version)
- iOS Safari (iOS 12+)
- Chrome for Android
- Samsung Internet

### Tested Features
- Responsive layouts
- Lazy loading
- Mobile navigation
- Image optimization
- Form interactions
- Carousel functionality

## 14. Implementation Notes

### Updated Files
- `assets/responsive.css`: Complete responsive design overhaul
- `components/header.html`: Enhanced mobile menu with accessibility
- `assets/js/layout.js`: Updated to handle new menu scripts
- `assets/js/lazyload.js`: New lazy loading functionality
- `server.js`: Added caching headers for performance
- `index.html`: Updated with lazy loading attributes and optimized scripts

### Key Features Added
1. Fluid responsive layouts with proper breakpoints
2. Functional hamburger menu with animations
3. Lazy loading for all images
4. Loading indicators and placeholder states
5. Caching strategies for static assets
6. WCAG 2.1 AA compliant touch targets
7. Keyboard navigation for mobile menu
8. Responsive image syntax (srcset/sizes)
9. Error handling for missing images
10. Progressive enhancement approach

### Best Practices Applied
- Mobile-first responsive design
- Performance optimization (lazy loading, caching)
- Accessibility-first development
- Cross-browser compatibility
- Progressive enhancement
- Semantic HTML
- CSS custom properties for theming
- Efficient JavaScript execution

