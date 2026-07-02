# Aurelia Dental Studio

A premium, luxury dental clinic website built with pure HTML, CSS, and Vanilla JavaScript.

## Features

- **Responsive Design** — Works perfectly on mobile, tablet, and desktop
- **Luxury Aesthetic** — Burgundy & gold color scheme with elegant typography (Fraunces & Inter)
- **Interactive Elements**
  - Smooth scroll navigation with blur navbar
  - Mobile hamburger menu (fixed positioning bug resolved)
  - Animated counters for metrics
  - Before/After image slider
  - FAQ accordion with smooth expand/collapse
  - Testimonial carousel
  - Reveal-on-scroll animations

- **Accessibility**
  - Semantic HTML5
  - ARIA labels and live regions
  - Keyboard navigation support
  - Focus-visible states
  - Skip-to-content link

- **Performance**
  - No frameworks — pure vanilla JS
  - Lazy-loaded images
  - Responsive images with srcset
  - Optimized animations (transform/opacity only)
  - ~27KB CSS + ~7KB JS

- **SEO**
  - Structured data (JSON-LD)
  - Meta tags
  - Open Graph support
  - Semantic headings

## Tech Stack

- **HTML5** — Semantic markup
- **CSS3** — Grid, Flexbox, custom properties
- **Vanilla JavaScript** — No dependencies

## File Structure

```
.
├── index.html          # Main page
├── css/
│   └── style.css       # All styles (design tokens, components, responsive)
├── js/
│   └── script.js       # Interactions (navbar, modals, carousel, etc.)
├── README.md
└── .gitignore
```

## Local Development

1. Clone the repository
2. Open `index.html` in a browser (or serve via HTTP for best results)
3. No build step required — changes to CSS/JS are instant

## Deployment

### Netlify (Recommended)

1. Push to GitHub
2. Connect repo to Netlify (drag-and-drop or GitHub auth)
3. Build command: (leave empty)
4. Publish directory: (leave empty, root)
5. Deploy!

### Manual Hosting

Simply copy all files to your web host. Works on any HTTP server.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements

- Add a contact form backend
- Blog section
- Patient portal
- Online appointment booking
- Multilingual support

## License

© 2026 Aurelia Dental Studio. All rights reserved.
