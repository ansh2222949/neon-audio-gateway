import { Hono } from 'hono';
import { withCache, EDGE_CACHE_HEADERS } from '../services/cache.js';
import {
  searchTracks,
  resolveStream,
  normalizeQuality,
  getTrendingTracks,
  getSongDetails,
} from '../services/jiosaavn.js';
import { fetchLyrics } from '../services/lyrics.js';

export const neonSongRouter = new Hono();

// Addon Manifest for Neon Song App
neonSongRouter.get('/manifest.json', (c) => {
  for (const [k, v] of Object.entries(EDGE_CACHE_HEADERS)) {
    c.header(k, v);
  }
  return c.json({
    id: 'org.neonsong.addon.320k',
    name: 'Neon Music 320kbps Core',
    version: '1.3.0',
    description: 'High-fidelity 320kbps AAC streaming & synced lyrics engine for Neon Song',
    resources: ['search', 'stream', 'trending', 'lyrics', 'download'],
    types: ['music'],
    settings: [
      {
        key: 'quality',
        type: 'select',
        default: '320',
        options: [
          { label: '320 kbps Master (Direct CDN)', value: '320' },
          { label: '160 kbps High (Balanced)', value: '160' },
          { label: '96 kbps Data Saver', value: '96' },
        ],
      },
    ],
  });
});

// Top Trending Tracks endpoint
neonSongRouter.get('/trending', async (c) => {
  const quality = normalizeQuality(c.req.query('quality'));
  const cacheKey = `trending:${quality}`;
  try {
    const tracks = await withCache(cacheKey, 3600, () => getTrendingTracks(quality));
    for (const [k, v] of Object.entries(EDGE_CACHE_HEADERS)) {
      c.header(k, v);
    }
    return c.json({ tracks });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Trending fetch failed';
    return c.json({ error: message, tracks: [] }, 500);
  }
});

// Search tracks endpoint
neonSongRouter.get('/search', async (c) => {
  const query = String(c.req.query('q') || c.req.query('search') || '').trim();
  const quality = normalizeQuality(c.req.query('quality'));
  const page = Math.max(1, parseInt(String(c.req.query('page') || '1'), 10) || 1);

  if (!query) {
    return c.json({ tracks: [] });
  }

  const cacheKey = `search:${quality}:${page}:${query.toLowerCase()}`;
  try {
    const tracks = await withCache(cacheKey, 86400, () => searchTracks(query, quality, 25, page));
    for (const [k, v] of Object.entries(EDGE_CACHE_HEADERS)) {
      c.header(k, v);
    }
    return c.json({ tracks, page });
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

// Synchronized Karaoke Lyrics endpoint by song ID
neonSongRouter.get('/lyrics/:id', async (c) => {
  const songId = c.req.param('id');
  if (!songId) return c.json({ error: 'Missing track ID' }, 400);

  const cacheKey = `lyrics:${songId}`;
  try {
    const lyrics = await withCache(cacheKey, 86400, async () => {
      const track = await getSongDetails(songId);
      if (!track) return null;
      return fetchLyrics(track.title, track.artist, track.duration);
    });

    if (!lyrics) {
      return c.json({ error: 'Lyrics not found', hasSynced: false }, 404);
    }

    for (const [k, v] of Object.entries(EDGE_CACHE_HEADERS)) {
      c.header(k, v);
    }
    return c.json(lyrics);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lyrics resolution error';
    return c.json({ error: message, hasSynced: false }, 500);
  }
});

// Synchronized Karaoke Lyrics endpoint by query parameters
neonSongRouter.get('/lyrics', async (c) => {
  const track = c.req.query('track') || c.req.query('title') || '';
  const artist = c.req.query('artist') || '';
  const duration = parseFloat(c.req.query('duration') || '0');

  if (!track) return c.json({ error: 'Missing track title' }, 400);

  const cacheKey = `lyrics:query:${track.toLowerCase()}:${artist.toLowerCase()}`;
  try {
    const lyrics = await withCache(cacheKey, 86400 * 7, () => fetchLyrics(track, artist, duration));
    if (!lyrics) {
      return c.json({ error: 'Lyrics not found', hasSynced: false }, 404);
    }
    for (const [k, v] of Object.entries(EDGE_CACHE_HEADERS)) {
      c.header(k, v);
    }
    return c.json(lyrics);
  } catch (err: unknown) {
    return c.json({ error: 'Failed to fetch lyrics', hasSynced: false }, 500);
  }
});

// Direct 1-Click M4A Audio Download endpoint
neonSongRouter.get('/download/:id', async (c) => {
  const songId = c.req.param('id');
  const quality = normalizeQuality(c.req.query('quality'));

  const [track, stream] = await Promise.all([
    getSongDetails(songId, quality),
    resolveStream(songId, quality),
  ]);

  if (!stream?.url) {
    return c.json({ error: 'Download stream unavailable' }, 404);
  }

  const upstream = await fetch(stream.url);
  if (!upstream.ok || !upstream.body) {
    return c.redirect(stream.url, 302);
  }

  const safeFilename = `${track?.title || songId} - ${track?.artist || 'NeonMusic'} [${quality}kbps].m4a`
    .replace(/[\\/:*?"<>|]/g, '_');

  return new Response(upstream.body, {
    status: 200,
    headers: {
      'Content-Type': 'audio/mp4',
      'Content-Disposition': `attachment; filename="${safeFilename}"`,
      'Cache-Control': 'public, max-age=86400',
    },
  });
});
