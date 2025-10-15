# Netlify Deployment - 404 Error Troubleshooting Guide

## Common 404 Issues and Solutions

### Issue 1: Build Directory Not Found (Most Common)

**Symptoms:**
- 404 error on main site
- Build succeeds but site shows "Page Not Found"

**Solution:**
Make sure these settings are correct in Netlify:

**If your repo root contains the frontend folder:**
- Base directory: `frontend`
- Build command: `yarn install && yarn build`
- Publish directory: `frontend/build` (or just `build` if base is set)

**If you deployed only the frontend folder as root:**
- Base directory: (leave empty)
- Build command: `yarn install && yarn build`
- Publish directory: `build`

### Issue 2: SPA Routing (Page Refresh 404s)

**Symptoms:**
- Homepage loads fine
- Clicking navigation works
- Refreshing on any route shows 404

**Solution:**
The netlify.toml file handles this with redirects. Verify it exists at:
- `/netlify.toml` (root of repo) OR
- `/frontend/netlify.toml`

The redirect rule should be:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Issue 3: Build Fails

**Check Netlify Build Logs:**
1. Go to Netlify Dashboard → Your Site → Deploys
2. Click on the failed deploy
3. Scroll to see error messages

**Common Build Errors:**

**Error: "yarn: command not found"**
```toml
[build]
  command = "npm install && npm run build"
```

**Error: "Node version too old"**
```toml
[build.environment]
  NODE_VERSION = "20"
```

**Error: "Module not found"**
- Check all imports in your code
- Verify component paths are correct
- Ensure PhoneMockup.js and PhoneMockup.css exist

### Issue 4: Environment Variables

If you have REACT_APP_BACKEND_URL:
1. Go to Site settings → Environment variables
2. Add variable: `REACT_APP_BACKEND_URL`
3. Trigger redeploy

**Note:** Don't use quotes in Netlify env values:
- ✅ Correct: `https://api.example.com`
- ❌ Wrong: `"https://api.example.com"`

### Issue 5: Mixed Content (HTTPS/HTTP)

If images or assets don't load:
- All external URLs must be HTTPS
- Check image URLs in your code
- Netlify serves everything over HTTPS

## Step-by-Step Deployment Verification

### Step 1: Verify Local Build
```bash
cd frontend
yarn install
yarn build
```
- Should create `frontend/build` folder
- No errors in console
- `build/index.html` should exist

### Step 2: Test Build Locally
```bash
cd frontend/build
npx serve -s .
```
Visit `http://localhost:3000` - site should work

### Step 3: Check Git Repository
```bash
git status
git log --oneline -5
```
- Latest code is committed
- No uncommitted changes
- Pushed to remote

### Step 4: Netlify Settings

**Manual Configuration:**
1. Log into Netlify
2. Go to Site settings → Build & deploy
3. Verify these settings:

```
Base directory: frontend
Build command: yarn install && yarn build
Publish directory: frontend/build
```

4. Deploy settings → Build image selection → Ubuntu Focal 20.04 (default)

### Step 5: Trigger Deploy
- Go to Deploys tab
- Click "Trigger deploy" → "Deploy site"
- Watch build logs

## Quick Fixes

### Fix 1: Clear Cache and Redeploy
1. Site settings → Build & deploy
2. Click "Clear cache and deploy site"

### Fix 2: Update Node Version
Add to netlify.toml:
```toml
[build.environment]
  NODE_VERSION = "20"
```

### Fix 3: Ignore Build Warnings
Add to netlify.toml:
```toml
[build.environment]
  CI = "false"
```

### Fix 4: Use Different Package Manager
Change build command to:
```toml
[build]
  command = "npm ci && npm run build"
```

## Files Checklist

Ensure these files exist in your repo:

```
/netlify.toml              ✅ Main config (recommended)
/frontend/netlify.toml     ✅ Alternative location
/frontend/.nvmrc           ✅ Node version
/frontend/package.json     ✅ Dependencies
/frontend/build/           ⚠️  (created during build, not in git)
```

## Testing Different Configurations

### Config A: Root Level (Recommended)
```toml
# /netlify.toml
[build]
  base = "frontend"
  command = "yarn install && yarn build"
  publish = "frontend/build"
```

### Config B: Frontend Level
```toml
# /frontend/netlify.toml
[build]
  command = "yarn install && yarn build"
  publish = "build"
```
**In Netlify Dashboard:** Set base directory to `frontend`

### Config C: No Base Directory
Move everything from `/frontend/*` to root `/`:
```toml
# /netlify.toml
[build]
  command = "yarn install && yarn build"
  publish = "build"
```

## Debug Checklist

- [ ] Local build works: `yarn build`
- [ ] netlify.toml exists in repo
- [ ] Base directory is correct
- [ ] Publish directory points to build output
- [ ] Node version is 18+
- [ ] No build errors in Netlify logs
- [ ] Redirect rule exists for SPA routing
- [ ] Site URL loads (not 404)
- [ ] All routes work after refresh

## Still Having Issues?

### Check Build Logs Location
Netlify Dashboard → Deploys → Click latest deploy → Scroll down

### Common Log Messages

**"Deploy site didn't complete deploy"**
- Build failed, check logs above

**"Site is live"**
- Build succeeded, check publish directory

**"No cached dependencies found"**
- Normal on first deploy

### Get Help
1. Copy full build log
2. Note exact error message
3. Check Netlify community forums
4. Verify all files are committed to Git

## Success Indicators

When deployment works correctly:

1. ✅ Build completes in 2-5 minutes
2. ✅ "Site is live" message appears
3. ✅ Site URL loads homepage
4. ✅ All navigation links work
5. ✅ Page refresh doesn't cause 404
6. ✅ Images and CSS load correctly
7. ✅ Interactive phone mockup works
8. ✅ Form submissions work (mock data)

## Emergency Rollback

If deployment breaks:
1. Go to Deploys tab
2. Find previous working deploy
3. Click "..." → "Publish deploy"

Your site will revert to that version immediately.
