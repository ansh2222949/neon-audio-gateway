import app from '../src/index.js';

export const runtime = 'edge';

export default function handler(request: Request) {
  return app.fetch(request);
}
