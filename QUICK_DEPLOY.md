# Quick Netlify Deployment Checklist

## ✅ Pre-Deployment Checklist

- [x] Code is working locally
- [x] Build succeeds: `cd frontend && yarn build`
- [x] netlify.toml exists at root
- [x] .nvmrc specifies Node 18
- [x] All files committed to Git

## 🚀 Deploy to Netlify (5 Minutes)

### Step 1: Push to GitHub
```bash
# If not already done
git init
git add .
git commit -m "ServAI landing page ready for deployment"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Connect Netlify
1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub and select your repository

### Step 3: Configure Build Settings

**IMPORTANT:** Use these exact settings:

```
Base directory: frontend
Build command: yarn install && yarn build
Publish directory: frontend/build
```

Or let it auto-detect from netlify.toml (recommended)

### Step 4: Deploy
- Click "Deploy site"
- Wait 2-3 minutes
- Your site will be live at: `https://random-name.netlify.app`

## 🔧 If You Get 404 Error

### Quick Fix #1: Check Publish Directory
Make sure it's set to:
- `frontend/build` (if base is `frontend`)
- OR just `build` (if base is empty)

### Quick Fix #2: Clear Cache
1. Site settings → Build & deploy
2. Click "Clear cache and deploy site"

### Quick Fix #3: Verify netlify.toml
Check that `/netlify.toml` exists in your repo with:
```toml
[build]
  base = "frontend"
  command = "yarn install && yarn build"
  publish = "frontend/build"
```

## 📱 Test Your Deployment

Visit your Netlify URL and test:
- [ ] Homepage loads
- [ ] Scroll through all sections
- [ ] Click navigation links
- [ ] Interactive phone mockup works
- [ ] Form submission works
- [ ] Mobile responsive design
- [ ] Page refresh doesn't break

## 🎉 Success!

Your ServAI landing page is now live!

**Next Steps:**
- Custom domain: Site settings → Domain management
- SSL: Automatic (nothing to do)
- Updates: Just `git push` to deploy

## 📞 Need Help?

See detailed guides:
- `DEPLOYMENT.md` - Full deployment guide
- `NETLIFY_TROUBLESHOOTING.md` - Fix 404 and build errors
