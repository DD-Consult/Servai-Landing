# ServAI — Landing Page PRD

## Original Problem Statement
Build and refine the "ServAI" (Conversational AI-Powered Food Ordering) landing page to precisely match a Google Stitch design prototype and a reference HTML artifact (`serv-ai-design.html`). Goal is pixel-perfect layout, typography, and a production-quality motion design engine.

## App Type
Marketing / Landing Page — React frontend + FastAPI backend (backend untouched)

## Core Requirements
- Transparent header that blurs on scroll (glassmorphism)
- Dark/Gold/Teal design token system
- Hero section with restaurant background image
- Scroll-reveal animations (IntersectionObserver)
- Hero spring entrance (cubic-bezier spring)
- Staggered section reveals
- Animated stat counters (easeOutCubic)
- Why ServAI comparison cards with distinct hover effects
- Features grid with per-column stagger
- How It Works with phone mockup + auto-play step carousel
- ROI Calculator with live sliders
- Product Preview video section
- Demo request form
- Responsive for mobile/tablet/desktop

## What's Been Implemented

### 2025 (Session 1–2)
- Resolved frontend startup issues (craco/react-scripts)
- Initial header & hero redesign from Google Stitch screenshot
- Background image from Google AIDA CDN
- Transparent header with scroll-triggered backdrop-blur
- Typography, ghost buttons, dark pill buttons

### 2025 (Session 3)
- Full App.js motion engine: IntersectionObserver scroll reveal, hero spring entrance (120ms delay, cubic-bezier(0.16, 1, 0.3, 1)), stat counter (easeOutCubic RAF), auto-play step carousel

### 2026 (Current Session — Hero Redesign)
- **Rebuilt** hero section from full-width bg-image to two-column dark layout matching `servai.html` reference:
  - Left: SERVAI brand label → heading → body → SCHEDULE DEMO (teal) + START FREE TRIAL (ghost)
  - Right: Video player glass container (thumbnail + custom play button, click-to-play)
  - Background: `#1a1c22` dark slate with teal + mustard ambient glows
- **Fixed** hero video file permissions (`chmod 644`) — was root-only, causing `ERR_ABORTED`
- **Fixed** right column visibility: removed `hero-spring` from `hero-right` (was permanently `opacity:0`)
- **Separate video states**: `heroPlaying/heroVideoRef` (hero) vs `isPlaying/videoRef` (preview section)

## Architecture
- `/app/frontend/src/App.js` — main React component, all sections, motion JS
- `/app/frontend/src/App.css` — all custom CSS, design tokens, motion engine
- `/app/frontend/src/components/PhoneMockup.jsx` — phone UI component
- Backend: FastAPI + MongoDB (untouched)

## Prioritized Backlog

### P0
- None currently blocking

### P1
- Provide 4-part design breakdown to user (Design Digest, Blueprint, Motion Engine, Implementation Notes) — user explicitly requested this in the last session

### P2
- Backend integration (form submission, leads DB)
- Further pixel-perfect audit of all sections against reference HTML
- CSS modularisation (App.css is ~1250 lines; candidate for splitting into modules)

### Future / Backlog
- WhatsApp/Messenger deep-link on CTA
- Real product demo video replacement (currently BigBuckBunny sample)
- Analytics / conversion tracking
- SEO meta tags audit
