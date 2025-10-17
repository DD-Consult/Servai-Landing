# DD Consulting Chatbot Widget Setup

## ✅ Code Embedded

The chatbot widget code has been successfully embedded in `/app/frontend/public/index.html` at the bottom of the page, just before the closing `</body>` tag.

## 📍 Current Configuration

```html
<!-- DD Consulting Chatbot Widget -->
<script src="http://localhost:3002/widget.js"></script>
<script>
  DDChatbotWidget.init({
    apiKey: "dd_servai-e_17HNv9v7oC6hp_4Kv6S5pnQNX7Jp05y9QWGblYByiO0",
    apiUrl: "https://askdd-api.ddconsult.net.au",
    position: "bottom-right"
  });
</script>
```

## ⚠️ Important: Production Deployment

### Issue with Current Setup
The widget script is loading from `http://localhost:3002/widget.js`, which will:
- ✅ Work in your local development environment (if localhost:3002 is running)
- ❌ **NOT work** when deployed to Netlify or any production environment

### Solution Options

#### Option 1: Hosted Widget URL (Recommended)
Replace `http://localhost:3002/widget.js` with a production-ready hosted URL:

```html
<!-- Replace localhost with production URL -->
<script src="https://your-cdn.com/widget.js"></script>
<!-- OR -->
<script src="https://askdd-api.ddconsult.net.au/widget.js"></script>
```

#### Option 2: Self-Host Widget File
1. Copy `widget.js` to `/app/frontend/public/`
2. Update the script tag:
```html
<script src="%PUBLIC_URL%/widget.js"></script>
```

#### Option 3: Environment-Based URL
Use different URLs for development vs production:

```html
<script>
  // Load widget based on environment
  var widgetUrl = window.location.hostname === 'localhost' 
    ? 'http://localhost:3002/widget.js'
    : 'https://your-production-cdn.com/widget.js';
  
  var script = document.createElement('script');
  script.src = widgetUrl;
  document.head.appendChild(script);
  
  script.onload = function() {
    DDChatbotWidget.init({
      apiKey: "dd_servai-e_17HNv9v7oC6hp_4Kv6S5pnQNX7Jp05y9QWGblYByiO0",
      apiUrl: "https://askdd-api.ddconsult.net.au",
      position: "bottom-right"
    });
  };
</script>
```

## 🧪 Testing

### Local Development
1. Ensure your chatbot widget server is running on port 3002
2. Open http://localhost:3000
3. Check bottom-right corner for chatbot widget

### Production (After Deploying to Netlify)
1. Update widget URL to production URL
2. Deploy to Netlify
3. Visit your Netlify URL
4. Chatbot should appear in bottom-right corner

## 🎯 Widget Configuration

Current settings:
- **API Key**: `dd_servai-e_17HNv9v7oC6hp_4Kv6S5pnQNX7Jp05y9QWGblYByiO0`
- **API URL**: `https://askdd-api.ddconsult.net.au`
- **Position**: `bottom-right`

To change position, update to:
- `bottom-left`
- `bottom-right` (current)
- `top-left`
- `top-right`

## 📝 Next Steps

1. **Get Production Widget URL**
   - Contact your chatbot widget provider
   - Ask for production CDN URL for widget.js

2. **Update index.html**
   - Replace localhost URL with production URL
   - Commit and push changes

3. **Deploy to Netlify**
   - Widget will now load on production site

4. **Test**
   - Visit deployed site
   - Verify chatbot appears
   - Test chatbot functionality

## 🔧 Troubleshooting

### Chatbot Not Appearing?

**Check 1: Console Errors**
- Open browser DevTools (F12)
- Check Console tab for errors
- Look for "Failed to load widget.js" errors

**Check 2: Network Tab**
- Open DevTools → Network tab
- Look for widget.js request
- Check if it's 404 or blocked

**Check 3: Widget Initialization**
- In Console, type: `window.DDChatbotWidget`
- Should return an object if loaded correctly

**Check 4: API Key**
- Verify API key is correct
- Check with your chatbot provider

## 📦 Files Modified

- `/app/frontend/public/index.html` - Chatbot widget code added

## 🚀 Deployment Checklist

Before deploying to production:
- [ ] Replace localhost:3002 with production widget URL
- [ ] Test chatbot loads in development
- [ ] Verify API key is correct
- [ ] Test chatbot functionality
- [ ] Deploy to Netlify
- [ ] Test on production URL
- [ ] Verify chatbot appears in bottom-right
- [ ] Test chatbot conversations

---

**Current Status**: Code embedded, ready for production URL update.
