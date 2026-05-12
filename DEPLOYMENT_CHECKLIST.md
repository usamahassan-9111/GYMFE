# Deployment Checklist

## Issues Fixed
✅ **vercel.json** - Added SPA fallback for all routes (prevents 404 on page refresh)
✅ **API Error Logging** - Added detailed error logging to identify issues
✅ **.env.production** - Created for production builds (uses `/api` for Vercel rewrites)
✅ **useApiResource Hook** - Improved error handling and data validation

## Deployment Steps

1. **Commit all changes**
   ```bash
   git add .
   git commit -m "Fix: Vercel routing, error logging, and production env config"
   ```

2. **Force rebuild on Vercel**
   - Go to: https://vercel.com/dashboard
   - Select your project
   - Go to "Deployments" tab
   - Click on latest deployment → "Redeploy"
   - Or use CLI: `vercel --prod --force`

3. **After deployment, test:**
   - [ ] Go to Dashboard - cards should load
   - [ ] Add Attendance - should save and show in list
   - [ ] Refresh page - should NOT show 404 error
   - [ ] Check Console (F12) for any red error messages
   - [ ] Test back/forward navigation

## Environment Setup
- **Local Dev** (.env.local): `http://148.66.156.43:3006/api`
- **Vercel Prod** (.env.production): `/api` (Vercel rewrites to backend)

## If Still Having Issues
1. Open DevTools (F12)
2. Go to Console tab
3. Check for red error messages
4. Go to Network tab
5. Look for failed requests (red entries)
6. Share the error URL and message
