# PWA Install - Quick Reference Card

## 🎯 To See Install Option:

### 1. Start App
```bash
npm run dev
```

### 2. Open Browser
```
http://localhost:3000
```

### 3. Look For:
- 🔧 Debug icon (bottom-right) → Click it → Shows install status
- Install button at bottom of screen
- ⊕ Install icon in Chrome address bar
- Chrome menu → "Install Hikma Students App"

## 🔍 Debug Tools

### Built-in Debug Panel
- Click 🔧 icon in bottom-right corner
- Shows real-time PWA status
- One-click install when ready
- Detailed logs and troubleshooting

### Test Page
```
http://localhost:3000/TEST-PWA.html
```
- Comprehensive diagnostics
- Tests all PWA requirements
- Shows what's working/failing

### Chrome DevTools
```
F12 → Application Tab
```
- Manifest: Check app details
- Service Workers: Check registration
- Console: Check for errors

## ✅ Requirements Checklist

- [x] HTTPS or localhost ✓
- [x] Valid manifest.json ✓
- [x] Service worker registered ✓
- [x] Icons (192x192, 512x512) ✓
- [x] Install prompt handler ✓

## 🚨 Troubleshooting

### Not showing install option?

**Quick Fixes:**
1. Refresh page 2-3 times
2. Clear cache: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
3. Check console for errors (F12)
4. Click 🔧 debug icon for details

**Common Issues:**
- Already installed? Check if running in standalone mode
- Wrong URL? Use `localhost:3000` not `127.0.0.1`
- Service worker error? Check DevTools → Application → Service Workers

### Manual Install Check:
```javascript
// Paste in Console (F12):
navigator.serviceWorker.getRegistration().then(r => 
  console.log('SW:', r ? '✅ Registered' : '❌ Not registered')
);
```

## 📱 Install Methods

### Desktop (Chrome/Edge):
1. **Auto prompt** - Appears after page loads
2. **Address bar** - Click ⊕ icon
3. **Menu** - ⋮ → Install Hikma Students App
4. **App button** - Bottom of screen

### Mobile (Android):
1. **Banner** - "Add to Home screen"
2. **Menu** - ⋮ → Install app
3. **App button** - Bottom of screen

### Mobile (iOS):
1. Share button → Add to Home Screen

## 🎉 Success Signs

When working correctly:
- 🔧 Debug tool shows "Ready to Install"
- Install button appears at bottom
- Chrome shows install icon in address bar
- Console shows: "beforeinstallprompt event fired"

## 📞 Quick Help

**Problem:** Install option not appearing
**Solution:** Click 🔧 icon - it will tell you exactly what's wrong

**Problem:** Service worker not registering  
**Solution:** Check DevTools → Application → Service Workers

**Problem:** Manifest errors
**Solution:** Check DevTools → Application → Manifest

**Problem:** Already installed
**Solution:** Uninstall first, then reinstall

## 🔗 Files Reference

- `public/manifest.json` - App configuration
- `public/service-worker.js` - Offline support
- `src/pwa-install.ts` - Install logic
- `src/InstallDebug.tsx` - Debug tool
- `TEST-PWA.html` - Diagnostic page

## 💡 Pro Tips

1. **Use the debug tool** - It's your best friend
2. **Check console first** - Errors show up there
3. **Refresh helps** - Install prompt may need a refresh
4. **Clear cache** - When in doubt, clear it out
5. **Test page** - Use TEST-PWA.html for full diagnostics

---

**Need detailed help?** Check `INSTALL-NOW.md`
**Want to understand the code?** Check `PWA-CODE-SUMMARY.md`
**Full setup guide?** Check `PWA-SETUP.md`
