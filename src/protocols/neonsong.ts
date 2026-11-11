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
    version: '1.2.0',
    description: 'High-quality 320kbps AAC streaming resolver with synced lyrics & trending charts for Neon Song',
    resources: ['search', 'stream', 'lyrics', 'trending'],
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

// Trending tracks endpoint for Neon Song Home / Discovery
neonSongRouter.get('/trending', async (c) => {
  const quality = normalizeQuality(c.req.query('quality'));
  const cacheKey = `trending:${quality}`;

  try {
    const tracks = await withCache(cacheKey, 21600, () => getTrendingTracks(quality));
    for (const [k, v] of Object.entries(EDGE_CACHE_HEADERS)) {
      c.header(k, v);
    }
    return c.json({ tracks });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Trending fetch failed';
    return c.json({ error: message, tracks: [] }, 500);
  }
});

// Synced & Plain Lyrics endpoint
neonSongRouter.get('/lyrics/:id', async (c) => {
  const songId = c.req.param('id');
  if (!songId) return c.json({ error: 'Missing track ID' }, 400);

  const cacheKey = `lyrics:id:${songId}`;
  try {
    const lyrics = await withCache(cacheKey, 86400 * 7, async () => {
      const song = await getSongDetails(songId);
      if (!song) return null;
      return fetchLyrics(song.title, song.artist, song.duration);
    });

    if (!lyrics) {
      return c.json({ error: 'Lyrics not available for this track' }, 404);
    }

    for (const [k, v] of Object.entries(EDGE_CACHE_HEADERS)) {
      c.header(k, v);
    }
    return c.json(lyrics);
  } catch (err: unknown) {
    return c.json({ error: 'Failed to resolve lyrics' }, 500);
  }
});

// Direct query lyrics endpoint
neonSongRouter.get('/lyrics', async (c) => {
  const track = c.req.query('track') || c.req.query('title') || '';
  const artist = c.req.query('artist') || '';
  const duration = parseFloat(c.req.query('duration') || '0');

  if (!track) return c.json({ error: 'Missing track title' }, 400);

  const cacheKey = `lyrics:query:${track.toLowerCase()}:${artist.toLowerCase()}`;
  try {
    const lyrics = await withCache(cacheKey, 86400 * 7, () => fetchLyrics(track, artist, duration));
    if (!lyrics) {
      return c.json({ error: 'Lyrics not found' }, 404);
    }
    for (const [k, v] of Object.entries(EDGE_CACHE_HEADERS)) {
      c.header(k, v);
    }
    return c.json(lyrics);
  } catch (err: unknown) {
    return c.json({ error: 'Failed to fetch lyrics' }, 500);
  }
});

// Direct Download endpoint
neonSongRouter.get('/download/:id', async (c) => {
  const songId = c.req.param('id');
  const quality = normalizeQuality(c.req.query('quality'));

  if (!songId) return c.json({ error: 'Missing track ID' }, 400);

  const stream = await resolveStream(songId, quality);
  if (!stream?.url) {
    return c.json({ error: 'Stream not found' }, 404);
  }

  // Redirect to direct CDN stream URL
  return c.redirect(stream.url, 302);
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
