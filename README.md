# ServAI - AI-Powered Food Ordering Platform Landing Page

Professional landing page for ServAI, featuring interactive demonstrations and modern design.

## 🎨 Features

### Design System
- **Warm AI Design Guidelines** - Cream background (#FFF9F2), SF Mono fonts
- **Responsive Design** - Mobile, tablet, and desktop optimized
- **Modern UI Components** - Shadcn UI with custom styling
- **Smooth Animations** - Hover effects, transitions, and micro-interactions

### Page Sections
1. **Fixed Header** - Navigation with smooth scroll links
2. **Hero Section** - Background image with overlay, compelling CTA buttons
3. **Benefits Metrics** - 4 key statistics with animated cards
4. **Features Grid** - 6 features with lucide-react icons
5. **Demo Request Form** - Functional form with success state (mock data)
6. **Interactive "How It Works"** - Phone mockup with 6 animated screen states
7. **Footer** - Contact information and branding

### Interactive Elements
- **Phone Mockup** - Realistic iPhone with dynamic screen content
- **Step Cards** - Click to activate, hover for effects
- **Auto-Play** - Cycles through steps every 4 seconds
- **Screen States**: QR scan, WhatsApp chat, menu ordering, payment, dashboard, loyalty points
- **Smooth Transitions** - Between all interactive states

## 🚀 Quick Start

### Local Development

```bash
# Navigate to frontend
cd frontend

# Install dependencies
yarn install

# Start development server
yarn start

# Build for production
yarn build
```

Access at: http://localhost:3000

### Deployment to Netlify

**See:** `QUICK_DEPLOY.md` for 5-minute deployment guide

**Quick Steps:**
1. Push code to GitHub
2. Connect to Netlify
3. Configure:
   - Base directory: `frontend`
   - Build command: `yarn install && yarn build`
   - Publish directory: `frontend/build`
4. Deploy!

## 🐛 Getting 404 Error on Netlify?

**Most Common Solutions:**

### Fix 1: Check Build Settings
In Netlify Dashboard → Site settings → Build & deploy:
```
Base directory: frontend
Build command: yarn install && yarn build
Publish directory: frontend/build
```

### Fix 2: Verify netlify.toml
File exists at root: `/netlify.toml`
```toml
[build]
  base = "frontend"
  publish = "frontend/build"
```

### Fix 3: Clear Cache
Site settings → Build & deploy → Clear cache and deploy site

**See `NETLIFY_TROUBLESHOOTING.md` for complete guide**

## 📋 Documentation Files

- `QUICK_DEPLOY.md` - Fast deployment (5 minutes)
- `DEPLOYMENT.md` - Detailed deployment guide
- `NETLIFY_TROUBLESHOOTING.md` - Fix 404 and build errors
- `README.md` - This file

## 🛠 Tech Stack

- React 19 + React Router
- Lucide React (icons)
- Custom CSS (Warm AI design)
- Netlify (hosting)

## 📱 Test Checklist

After deployment, verify:
- [ ] Homepage loads
- [ ] All sections visible
- [ ] Navigation works
- [ ] Phone mockup interactive
- [ ] Form submission works
- [ ] Mobile responsive
- [ ] No console errors

## 📞 Support

Email: info@serv-ai.com

---

**Built for DD Consulting** | Powered by Emergent AI
