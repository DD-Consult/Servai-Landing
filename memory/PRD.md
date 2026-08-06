# ServAI Landing Page - PRD

## Original ask
Static marketing landing page for "ServAI" (conversational AI food ordering platform). React frontend only, no backend/DB usage for this site (form submits via Netlify).

## Session: Color Palette Redesign (2026-07-30)
User requested replacing clinical turquoise/teal/orange palette with a warm palette:
- Soft Cream #F8F5EE - main page background
- Deep Charcoal #222A30 - dark UI (Hero, Footer, features section, results cards)
- Terracotta #C85A32 - primary buttons/CTAs
- Sage Green #809B73 - success states/icons/accents
- Footer wordmark: "Serv" = Terracotta, "AI" = Sage Green
- Typography explicitly NOT changed (kept Plus Jakarta Sans as before)

### Implemented
- Updated CSS variables & all hardcoded hex/rgba colors in /app/frontend/src/App.css, /app/frontend/src/components/PhoneMockup.css, /app/frontend/src/App.js
- Feature icons (6 cards) now use 3 tonal shades of Sage Green instead of cyan/amber/green
- Footer wordmark split-color applied; WhatsApp-authentic colors (chat bubbles, header) intentionally left unchanged for realism
- Verified via auto_frontend_testing_agent across all 9 page sections - all passed, no old colors remain, typography unchanged, no console errors

### Backlog / Next steps
- None outstanding from this request. Future: could regenerate header logo image asset (servai-logo.webp) to match new palette if desired.
