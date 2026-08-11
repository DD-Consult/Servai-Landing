# ServAI Landing Page - PRD

## Overview
Marketing/landing page for ServAI, an AI-powered conversational food ordering platform (WhatsApp/Messenger based ordering with biometric payments and loyalty).

## Tech Stack
- React 19 (CRA + craco), Tailwind CSS, lucide-react icons, react-router-dom v7
- Single-page app (no backend API calls used by the footer/legal work; demo form posts via Netlify forms)

## What's Been Implemented
### 2026-08-11: Footer redesign + legal page routes
- Restructured footer into two sections:
  - Main footer (3 columns): "Product" nav links (How it Works/Features/Impact, smooth scroll), center ServAI brand block (logo, tagline, contact email), "Made By" column (DD Consulting logo/link, "Powered by" + AWS badge)
  - Sub-footer (separated by 1px divider): Privacy Policy (`/privacy-policy`) and Terms & Conditions (`/terms-and-conditions`) links, copyright text (13px)
  - All links have hover states (color/opacity/scale transitions)
- Added `react-router-dom` BrowserRouter wiring in `index.js`; `App.js` now exports a router (`Home` = landing page at `/`, plus the two new routes)
- Added `/app/frontend/src/components/LegalPage.js` — placeholder "coming soon" page (dark themed, "Back to Home" link) reused for both Privacy Policy and Terms & Conditions routes
- Verified via auto_frontend_testing_agent: all footer links, hover states, routing, and responsiveness (desktop/mobile) work; original sections (hero, how it works, features, impact, ROI calculator, demo form) unaffected

## Backlog / Next Steps
- P1: Replace placeholder Privacy Policy / Terms & Conditions content with real legal copy
- P2: Consider adding footer social links if ServAI wants social presence
