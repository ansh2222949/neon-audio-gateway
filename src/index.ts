import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { neonSongRouter } from './protocols/neonsong.js';
import { stremioRouter, STREMIO_MANIFEST } from './protocols/stremio.js';
import { renderDashboardHtml } from './ui/dashboard.js';
import { EDGE_CACHE_HEADERS } from './services/cache.js';

const app = new Hono();

// Global CORS Middleware
app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'HEAD', 'OPTIONS'],
    allowHeaders: ['*'],
    exposeHeaders: ['Content-Length', 'Content-Range', 'Cache-Control'],
    maxAge: 86400,
  })
);

// Support path stripping for token routing (e.g. /a/:token/search -> /search)
app.use('/a/:token/*', async (c) => {
  const strippedPath = c.req.path.replace(/^\/a\/[^/]+/, '') || '/';
  const url = new URL(c.req.url);
  url.pathname = strippedPath;
  return app.fetch(new Request(url.toString(), c.req.raw), c.env, c.executionCtx);
});

// Interactive Web Dashboard
app.get('/', (c) => {
  c.header('Content-Type', 'text/html; charset=utf-8');
  c.header('Cache-Control', 'public, max-age=3600');
  return c.html(renderDashboardHtml());
});

// Health check endpoint
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    engine: 'Neon Music Core',
    version: '1.0.0',
    decipher: 'Zero-Allocation DES-ECB',
    maxBitrate: '320kbps AAC',
    supportedClients: ['Neon Song App', 'Stremio', 'Web Dashboard'],
    timestamp: new Date().toISOString(),
  });
});

// Dual Manifest: Serves both Neon Song modules and Stremio discovery
app.get('/manifest.json', (c) => {
  for (const [k, v] of Object.entries(EDGE_CACHE_HEADERS)) {
    c.header(k, v);
  }
  return c.json({
    ...STREMIO_MANIFEST,
    // Neon Song specific properties
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

// Mount Neon Song Routes
app.route('/', neonSongRouter);

// Mount Stremio Routes
app.route('/', stremioRouter);

export default app;
