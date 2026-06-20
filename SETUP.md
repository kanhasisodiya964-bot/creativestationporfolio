# Creative Station — Video Setup Guide

Your portfolio now loads videos dynamically and has a private admin page
to add/edit/reorder/remove them — no code edits needed after today.

## What changed
- `index.html` — the 5 portfolio boxes now render real `<video>` reels,
  pulled live from `/api/videos`. If a slot has no video yet, it shows
  a friendly placeholder instead of breaking.
- `admin.html` — a password-protected page where you manage your reels.
- `api/videos.js` — a free serverless function (runs on Vercel) that
  stores your video list.
- `package.json` — tells Vercel to install the one small package the
  API needs.

## One-time setup (about 5 minutes)

### Step 1 — Push these files to your Vercel project
Replace your old `index.html` with this one, and add the new
`admin.html`, `api/videos.js`, and `package.json` files at the same
folder level (so `api/videos.js` sits in an `api` folder next to
`index.html`). Push/redeploy as you normally do.

### Step 2 — Connect a free database (Vercel KV)
This is what lets `/admin.html` save your changes permanently.
1. Open your project on vercel.com → **Storage** tab.
2. Click **Create Database** → choose **KV** (this is a free Redis
   database from Upstash, included free on Vercel's Hobby plan).
3. Click **Connect Project** and select this project. Vercel
   automatically adds the required environment variables for you —
   you don't need to copy/paste any keys.
4. Redeploy the project once (Vercel may prompt you to, or just push
   any small change) so the new environment variables take effect.

### Step 3 — Set your admin password
1. In the same project → **Settings** → **Environment Variables**.
2. Add a new variable:
   - Name: `ADMIN_PASSWORD`
   - Value: any password you choose (e.g. `Aashish2026!`)
3. Redeploy.

That's it — setup is done forever. Steps 2 and 3 only happen once.

## Your day-to-day workflow

### If a reel is already on Instagram/YouTube
The cleanest free option is to re-upload the same file to Cloudinary
(takes 30 seconds) rather than linking Instagram directly — Instagram
links aren't direct video files and won't play embedded. Steps below.

### If the reel is only on your phone
1. Go to **cloudinary.com** → free sign up (no credit card).
2. In your Cloudinary dashboard, click **Upload** → choose your video.
3. Once uploaded, click the file → copy its **URL** (ends in `.mp4`).
4. Go to `yoursite.com/admin.html` on your site.
5. Log in with the password you set in Step 3 above.
6. Paste the Cloudinary URL into **Video URL**, fill in the **Title**
   and **Category Tag** (e.g. "Beauty · Salon"), and click
   **Save All Changes**.
7. Refresh your live site — the reel is there, autoplaying muted as
   visitors scroll past it (tap to unmute, tap again to pause).

### Editing or removing a video later
Open `/admin.html`, change the title/tag/URL, reorder with the ↑↓
buttons, or click **Remove** — then **Save All Changes**.

## Why this setup (and what's free)
- **Cloudinary free tier**: 25 GB storage + 25 GB bandwidth/month,
  no credit card required — plenty for a portfolio reel page.
- **Vercel KV free tier**: included on Vercel's Hobby plan, no card
  required, generous enough for a small portfolio's video list.
- **No app to maintain**: `admin.html` is just a page on your existing
  site, so there's nothing extra to host or pay for.

## If something looks off
- Reels not loading on the live site? Open browser dev tools (F12) →
  Console tab, and check for a red error — usually it means KV isn't
  connected yet (see Step 2).
- Admin page says "Wrong password"? Double-check the `ADMIN_PASSWORD`
  environment variable value matches exactly, and that you redeployed
  after adding it.
- Video doesn't play, just shows black? Make sure the URL you pasted
  ends in a real video file (`.mp4`) and not an Instagram page link.
