import { Hono } from 'hono';
import { withCache, EDGE_CACHE_HEADERS } from '../services/cache.js';
import {
  searchTracks,
  resolveStream,
  getSongDetails,
  getTrendingTracks,
  toStremioMeta,
  toStremioStream,
} from '../services/jiosaavn.js';

export const stremioRouter = new Hono();

export const STREMIO_MANIFEST = {
  id: 'org.neonsong.stremio.320k',
  version: '1.3.0',
  name: 'Neon Music (320kbps Lossless AAC)',
  description: 'Stream official 320kbps music on Stremio via high-speed direct CDN resolver',
  types: ['music'],
  resources: ['catalog', 'meta', 'stream'],
  catalogs: [
    {
      type: 'music',
      id: 'neon_music',
      name: 'Neon 320k Top Charts',
      extra: [
        {
          name: 'search',
          isRequired: false,
        },
      ],
    },
  ],
};

// Stremio Catalog Handler (Serves Trending Charts by default, or Search results)
stremioRouter.get('/catalog/music/:catalogId/:extra?.json', async (c) => {
  const extraParam = c.req.param('extra') || '';
  const searchMatch = extraParam.match(/search=([^&]+)/);
  const searchQuery = searchMatch
    ? decodeURIComponent(searchMatch[1])
    : (c.req.query('search') || '').trim();

  const cacheKey = searchQuery
    ? `stremio:catalog:${searchQuery.toLowerCase()}`
    : `stremio:catalog:trending`;

  try {
    const tracks = await withCache(cacheKey, 3600, () =>
      searchQuery ? searchTracks(searchQuery, '320', 25) : getTrendingTracks('320')
    );
    const metas = tracks.map((t) => toStremioMeta(t));

    for (const [k, v] of Object.entries(EDGE_CACHE_HEADERS)) {
      c.header(k, v);
    }
    return c.json({ metas });
  } catch {
    return c.json({ metas: [] });
  }
});

// Stremio Meta Handler (Now resolves full song details + 500x500 artwork)
stremioRouter.get('/meta/music/:id', async (c) => {
  const rawId = String(c.req.param('id') || '');
  const songId = rawId.replace(/^neon:/, '').replace(/\.json$/, '');

  const cacheKey = `stremio:meta:${songId}`;
  try {
    const track = await withCache(cacheKey, 86400, () => getSongDetails(songId, '320'));
    if (!track) {
      return c.json({ meta: null });
    }

    const meta = toStremioMeta(track);

    for (const [k, v] of Object.entries(EDGE_CACHE_HEADERS)) {
      c.header(k, v);
    }
    return c.json({ meta });
  } catch {
    return c.json({ meta: null });
  }
});

// Stremio Stream Handler
stremioRouter.get('/stream/music/:id', async (c) => {
  const rawId = String(c.req.param('id') || '');
  const songId = rawId.replace(/^neon:/, '').replace(/\.json$/, '');

  const cacheKey = `stremio:stream:${songId}`;
  try {
    const [stream, track] = await Promise.all([
      withCache(cacheKey, 86400, () => resolveStream(songId, '320')),
      withCache(`stremio:meta:${songId}`, 86400, () => getSongDetails(songId, '320')),
    ]);

    if (!stream || !stream.url) {
      return c.json({ streams: [] });
    }

    const stremioStream = toStremioStream(stream, track ? `${track.title} - ${track.artist}` : undefined);

    for (const [k, v] of Object.entries(EDGE_CACHE_HEADERS)) {
      c.header(k, v);
    }
    return c.json({ streams: [stremioStream] });
  } catch {
    return c.json({ streams: [] });
  }
});
