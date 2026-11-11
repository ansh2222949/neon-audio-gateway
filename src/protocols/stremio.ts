import { Hono } from 'hono';
import { withCache, EDGE_CACHE_HEADERS } from '../services/cache.js';
import {
  searchTracks,
  resolveStream,
  toStremioMeta,
  toStremioStream,
  formatTrack,
} from '../services/jiosaavn.js';

export const stremioRouter = new Hono();

// Stremio Addon Manifest
export const STREMIO_MANIFEST = {
  id: 'org.neonsong.stremio.320k',
  version: '1.0.0',
  name: 'Neon Music (320kbps Lossless AAC)',
  description: 'Stream official 320kbps music on Stremio via high-speed direct CDN resolver',
  types: ['music'],
  resources: ['catalog', 'meta', 'stream'],
  catalogs: [
    {
      type: 'music',
      id: 'neon_music',
      name: 'Neon 320k Music',
      extra: [
        {
          name: 'search',
          isRequired: false,
        },
      ],
    },
  ],
};

// Stremio Catalog Handler
stremioRouter.get('/catalog/music/:catalogId/:extra?.json', async (c) => {
  const extraParam = c.req.param('extra') || '';
  let searchQuery = '';

  const searchMatch = extraParam.match(/search=([^&]+)/);
  if (searchMatch) {
    searchQuery = decodeURIComponent(searchMatch[1]);
  } else {
    searchQuery = c.req.query('search') || 'Arijit Singh';
  }

  const cacheKey = `stremio:catalog:${searchQuery.toLowerCase()}`;
  try {
    const tracks = await withCache(cacheKey, 86400, () => searchTracks(searchQuery, '320', 25));
    const metas = tracks.map((t) => toStremioMeta(t));

    for (const [k, v] of Object.entries(EDGE_CACHE_HEADERS)) {
      c.header(k, v);
    }
    return c.json({ metas });
  } catch (err: unknown) {
    return c.json({ metas: [] });
  }
});

// Stremio Meta Handler
stremioRouter.get('/meta/music/:id.json', async (c) => {
  const rawId = c.req.param('id');
  const songId = rawId.replace(/^neon:/, '').replace(/\.json$/, '');

  const cacheKey = `stremio:meta:${songId}`;
  try {
    const stream = await withCache(cacheKey, 86400, () => resolveStream(songId, '320'));
    if (!stream) {
      return c.json({ meta: null });
    }

    const meta = {
      id: `neon:${songId}`,
      type: 'music',
      name: `Track #${songId}`,
      poster: '',
      description: `320kbps AAC Direct Stream`,
    };

    for (const [k, v] of Object.entries(EDGE_CACHE_HEADERS)) {
      c.header(k, v);
    }
    return c.json({ meta });
  } catch {
    return c.json({ meta: null });
  }
});

// Stremio Stream Handler
stremioRouter.get('/stream/music/:id.json', async (c) => {
  const rawId = c.req.param('id');
  const songId = rawId.replace(/^neon:/, '').replace(/\.json$/, '');

  const cacheKey = `stremio:stream:${songId}`;
  try {
    const stream = await withCache(cacheKey, 86400, () => resolveStream(songId, '320'));
    if (!stream || !stream.url) {
      return c.json({ streams: [] });
    }

    const stremioStream = toStremioStream(stream);

    for (const [k, v] of Object.entries(EDGE_CACHE_HEADERS)) {
      c.header(k, v);
    }
    return c.json({ streams: [stremioStream] });
  } catch {
    return c.json({ streams: [] });
  }
});
