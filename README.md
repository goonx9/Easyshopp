# Car Jump Starter — One-Product E-Commerce Website

A high-performance, single-product e-commerce website designed for Nigerian customers and built with vanilla HTML5, CSS3, and JavaScript. 

100% static and ready to host directly on **GitHub Pages** with zero build configuration or backend requirements.

---

## Features

- **Direct GitHub Pages Compatibility**: Pure static files (`index.html`, `jump-starter.html`, `assets/css/style.css`, `assets/js/main.js`).
- **Laser-Focused Conversion Layout**: Dedicated sales landing page on `index.html` and rich product detail configurator on `jump-starter.html`.
- **Zero MP4 Preload / Click-to-Load Videos**: Video files are never loaded or pre-fetched until the visitor clicks the play button overlay, preserving fast mobile page speeds and Core Web Vitals (LCP/FID/CLS).
- **LCP-Optimized Product Image**: Main hero image is given `fetchpriority="high"`, explicit dimensions, and responsive Cloudinary transformation URLs.
- **Interactive Variant Selection**:
  - **Standard Edition**: ₦59,900
  - **Premium Edition**: ₦69,900
- **Nigerian Customer Experience**:
  - Payment on Delivery reassurance.
  - Nigerian states dropdown for delivery.
  - Formatted WhatsApp order dispatch hook.
  - Pre-wired integration comments for Paystack and Flutterwave.
- **Meta Pixel Tracking**: Embedded Facebook Pixel tracking for `PageView`, `AddToCart`, `Lead`, and `Purchase` events.

---

## Project Structure

```text
├── index.html            # Main sales landing page
├── jump-starter.html     # Dedicated product & ordering page
├── assets/
│   ├── css/
│   │   └── style.css     # Clean CSS3 design system with CSS variables
│   └── js/
│       └── main.js       # Zero-dependency vanilla JS (Video, Cart, FAQ, Checkout)
└── README.md             # Project documentation
```

---

## How to Deploy to GitHub Pages

1. Create a new repository on GitHub.
2. Upload or push all project files directly into the repository root or `main` branch.
3. Go to **Repository Settings** > **Pages**.
4. Under **Source**, select `Deploy from a branch` and choose the `main` branch with `/ (root)` directory.
5. Click **Save**. GitHub Pages will deploy your site in seconds!
