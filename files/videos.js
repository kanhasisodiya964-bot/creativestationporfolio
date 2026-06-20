// /api/videos.js
// Serverless function (runs free on Vercel's Hobby plan).
// Stores the portfolio video list in Vercel KV (free tier: Upstash Redis under the hood).
//
// GET  /api/videos              -> returns the saved video list (or defaults)
// POST /api/videos              -> saves a new video list (protected by ADMIN_PASSWORD)
//
// SETUP (one-time, ~3 minutes):
// 1. In your Vercel project dashboard -> Storage tab -> Create Database -> KV -> connect it.
//    Vercel auto-adds the KV_* environment variables for you. That's it, no code changes needed.
// 2. In Vercel project -> Settings -> Environment Variables, add one more variable:
//    ADMIN_PASSWORD = (a password you choose, used to log into admin.html)
// 3. Redeploy.

import { kv } from '@vercel/kv';

const STORAGE_KEY = 'portfolio_videos';

// Fallback content shown the very first time, before you've saved anything.
const DEFAULT_VIDEOS = [
  { id: 'p1', title: 'Style Story — Client Name', tag: 'Fashion · Brand', url: '', poster: '', icon: '🎬', big: true },
  { id: 'p2', title: 'Food Reel Project', tag: 'Food · Restaurant', url: '', poster: '', icon: '🍽️', big: false },
  { id: 'p3', title: 'Beauty Transformation', tag: 'Beauty · Salon', url: '', poster: '', icon: '💄', big: false },
  { id: 'p4', title: 'Gym Motivation Reel', tag: 'Fitness · Lifestyle', url: '', poster: '', icon: '🏋️', big: false },
  { id: 'p5', title: 'Event Highlight Reel', tag: 'Events · Celebration', url: '', poster: '', icon: '🎂', big: false }
];

export default async function handler(req, res) {
  // Allow the admin page (and the live site) to call this from the browser.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const saved = await kv.get(STORAGE_KEY);
      return res.status(200).json({ videos: saved || DEFAULT_VIDEOS });
    } catch (err) {
      console.error('KV read failed:', err);
      // If KV isn't connected yet, don't break the live site — just show defaults.
      return res.status(200).json({ videos: DEFAULT_VIDEOS, warning: 'KV not connected yet' });
    }
  }

  if (req.method === 'POST') {
    const auth = req.headers.authorization || '';
    const providedPassword = auth.replace('Bearer ', '');

    if (!process.env.ADMIN_PASSWORD) {
      return res.status(500).json({ error: 'Server is missing ADMIN_PASSWORD env var. Add it in Vercel settings.' });
    }

    if (providedPassword !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Wrong password.' });
    }

    const { videos } = req.body || {};
    if (!Array.isArray(videos)) {
      return res.status(400).json({ error: 'Expected { videos: [...] }' });
    }

    try {
      await kv.set(STORAGE_KEY, videos);
      return res.status(200).json({ ok: true, videos });
    } catch (err) {
      console.error('KV write failed:', err);
      return res.status(500).json({ error: 'Could not save. Is KV connected in your Vercel project (Storage tab)?' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
