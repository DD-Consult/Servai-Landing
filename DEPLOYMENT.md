# ServAI - Netlify Deployment Guide

## Prerequisites
- GitHub/GitLab/Bitbucket account
- Netlify account (free tier works)
- Your repository pushed to Git

## Deployment Steps

### Option 1: Automatic Deployment via Netlify Dashboard

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - ServAI landing page"
   git branch -M main
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Choose your Git provider (GitHub/GitLab/Bitbucket)
   - Select your repository

3. **Build Settings** (should auto-detect from netlify.toml)
   - Base directory: `frontend`
   - Build command: `yarn install && yarn build`
   - Publish directory: `frontend/build`
   - Node version: 18 (set in netlify.toml)

4. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy your site
   - You'll get a URL like: `https://your-site-name.netlify.app`

### Option 2: Manual Deployment via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Build your app locally**
   ```bash
   cd frontend
   yarn install
   yarn build
   ```

4. **Deploy**
   ```bash
   netlify deploy --dir=frontend/build --prod
   ```

## Troubleshooting 404 Errors

### Issue 1: Build Failed
- Check Netlify build logs for errors
- Ensure all dependencies are in package.json
- Make sure Node version is 18 or higher

### Issue 2: 404 on Page Refresh
- This is fixed by the redirect rule in netlify.toml
- All routes redirect to index.html (SPA routing)

### Issue 3: Assets Not Loading
- Check publish directory is correct: `frontend/build`
- Verify base directory is set to `frontend`
- Check that build completed successfully

### Issue 4: Environment Variables
If you need to add backend URL later:
1. Go to Site settings → Environment variables
2. Add: `REACT_APP_BACKEND_URL` = your backend URL
3. Redeploy the site

## Custom Domain Setup

1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow DNS configuration instructions
4. SSL certificate is automatically provisioned

## Continuous Deployment

Once connected to Git:
- Every push to `main` branch triggers automatic deployment
- Pull request previews available on higher tiers
- Build status shows in your Git commits

## Build Configuration Files

- `/netlify.toml` - Root level config (recommended)
- `/frontend/netlify.toml` - Frontend specific config
- `/frontend/.nvmrc` - Node version specification

## Performance Optimization

The netlify.toml includes:
- Static asset caching (1 year)
- Image optimization headers
- Security headers
- Gzip compression (automatic)

## Support

If deployment still fails:
1. Check build logs in Netlify dashboard
2. Verify package.json has all dependencies
3. Test local build: `cd frontend && yarn build`
4. Check Node version matches: `node --version`

## Success Checklist

- [ ] Code pushed to Git repository
- [ ] Netlify site created and connected
- [ ] Build completes successfully
- [ ] Site loads at Netlify URL
- [ ] All pages accessible (no 404s)
- [ ] Images and assets load correctly
- [ ] Mobile responsive design works
- [ ] Form submissions work (mock data)

Your ServAI landing page should now be live! 🎉
