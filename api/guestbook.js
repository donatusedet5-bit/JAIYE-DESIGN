// Signature wall: everyone who visits can leave a drawn signature.
// Stored as one JSON file in Vercel Blob (BLOB_READ_WRITE_TOKEN is set on the project).
import { put, list } from '@vercel/blob';

const KEY = 'guestbook/guestbook.json';
const MAX = 5000;
const PATH_RE = /^[ML0-9 .\-]+$/;

async function load() {
  const { blobs } = await list({ prefix: KEY, limit: 1 });
  if (!blobs.length) return [];
  const r = await fetch(blobs[0].url + '?t=' + Date.now(), { cache: 'no-store' });
  if (!r.ok) return [];
  const j = await r.json().catch(() => []);
  return Array.isArray(j) ? j : [];
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    if (req.method === 'GET') {
      const items = await load();
      return res.status(200).json({ items: items.slice(-60).reverse(), count: items.length });
    }
    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') body = JSON.parse(body || '{}');
      const name = String(body?.name || '').trim().replace(/[<>]/g, '').slice(0, 40);
      const d = String(body?.d || '');
      if (!name) return res.status(400).json({ error: 'Add your name' });
      if (!d || d.length > 12000 || !PATH_RE.test(d)) return res.status(400).json({ error: 'Draw a signature first' });
      const items = await load();
      const item = { name, d, t: Date.now() };
      items.push(item);
      const keep = items.slice(-MAX);
      await put(KEY, JSON.stringify(keep), {
        access: 'public', addRandomSuffix: false, allowOverwrite: true, contentType: 'application/json', cacheControlMaxAge: 0,
      });
      return res.status(200).json({ ok: true, ...item, count: keep.length });
    }
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: 'Could not reach the wall right now' });
  }
}
