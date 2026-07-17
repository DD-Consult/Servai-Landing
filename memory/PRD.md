# ServAI Landing Page — PRD

## Original ask
Full-stack marketing site for ServAI (AI-powered conversational food ordering via WhatsApp/Messenger). Iterations covered: hero CTA cursor-glow effects, hero video ambient/border-beam light effect, and (latest) a full visual redesign to a new brand palette + typography.

## Architecture
React (CRA) frontend only (App.js/App.css, PhoneMockup component), no backend business logic beyond static Netlify-style form. Tailwind configured but most real styling lives in App.css.

## Latest work (July 2026) — Full Design System Refresh
- New palette: Deep Charcoal (#16181C) backgrounds, Mint/Teal (#2DD4BF) for accents/security/secondary CTAs, Warm Mango/Orange (#FF7A29) for primary CTAs/pricing/transactional highlights, off-white for light sections.
- Typography swapped globally: Inter/Manrope/JetBrains Mono → Plus Jakarta Sans (geometric sans-serif), loaded via Google Fonts in index.html.
- Updated: header nav buttons, hero buttons, hero background gradient, stat numbers, comparison cards, feature icons (5 teal + 1 mango), step cards/active states, ROI calculator, form submit button, footer wordmark colors, PhoneMockup gradient screens (QR scan/payment = teal, loyalty = mango).
- Hero "Schedule Demo" button: cursor-follow spotlight glow (idle auto-sweep + real cursor tracking on hover), contained within button bounds.
- Hero video: rotating border-beam effect (thin bright ring, warm+cool arcs 180° apart, continuously rotating, hollow center so video content stays clear).
- Verified via automated frontend testing agent — all sections, mobile viewport, and console errors checked, all passing.

## Known dead/unused CSS (not rendered, left untouched)
- `.preview-section`, `.video-glow`, `.video-glass` (unused product-preview block)
- `.footer`, `.footer-brand`, `.footer-credit` etc. (actual footer in JSX uses inline Tailwind arbitrary-value classes instead)

## Backlog / Next steps
- P1: Extend border-beam/glow treatment to other CTAs (header Request Demo, form submit) if requested
- P2: Consider tightening spacing/card radius further per "modern spacing" brief if user wants deeper polish
- P2: Review WhatsApp-authentic colors in PhoneMockup chat bubbles (kept as-is for product accuracy)
