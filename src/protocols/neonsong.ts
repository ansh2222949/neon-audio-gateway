import { Hono } from 'hono';
import { withCache, EDGE_CACHE_HEADERS } from '../services/cache.js';
import { searchTracks, resolveStream, normalizeQuality } from '../services/jiosaavn.js';

export const neonSongRouter = new Hono();

// Addon Manifest for Neon Song App
neonSongRouter.get('/manifest.json', (c) => {
  for (const [k, v] of Object.entries(EDGE_CACHE_HEADERS)) {
    c.header(k, v);
  }
  return c.json({
    id: 'org.neonsong.addon.320k',
    name: 'Neon Music 320kbps Core',
    version: '1.0.0',
    description: 'High-quality 320kbps AAC streaming resolver for Neon Song',
    resources: ['search', 'stream'],
    types: ['music'],
    settings: [
      {
        key: 'quality',
        type: 'select',
        default: '320',
        options: [
          { label: '320 kbps Ultra (Direct CDN)', value: '320' },
          { label: '160 kbps High (Balanced)', value: '160' },
          { label: '96 kbps Data Saver', value: '96' },
        ],
      },
    ],
  });
});

// Search tracks endpoint
neonSongRouter.get('/search', async (c) => {
  const query = String(c.req.query('q') || c.req.query('search') || '').trim();
  const quality = normalizeQuality(c.req.query('quality'));

  if (!query) {
    return c.json({ tracks: [] });
  }

  const cacheKey = `search:${quality}:${query.toLowerCase()}`;
  try {
    const tracks = await withCache(cacheKey, 86400, () => searchTracks(query, quality, 25));
    for (const [k, v] of Object.entries(EDGE_CACHE_HEADERS)) {
      c.header(k, v);
    }
    return c.json({ tracks });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Search failed';
    return c.json({ error: message, tracks: [] }, 500);
  }
});

// Stream resolution endpoint
neonSongRouter.get('/stream/:id', async (c) => {
  const songId = c.req.param('id');
  const quality = normalizeQuality(c.req.query('quality'));

  if (!songId) {
    return c.json({ error: 'Missing track ID' }, 400);
  }

  const cacheKey = `stream:${quality}:${songId}`;
  try {
    const stream = await withCache(cacheKey, 86400, () => resolveStream(songId, quality));
    if (!stream) {
      return c.json({ error: 'Track not found or stream unavailable' }, 404);
    }

    for (const [k, v] of Object.entries(EDGE_CACHE_HEADERS)) {
      c.header(k, v);
    }
    return c.json(stream);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Stream resolution error';
    return c.json({ error: message }, 500);
  }
});
