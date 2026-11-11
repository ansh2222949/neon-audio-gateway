# ⚡ Neon Audio Gateway (`neon-audio-gateway`)

> High-performance, modular **Audio Streaming Resolver & Gateway** built on [Hono](https://hono.dev). Engineered for [Neon Song](https://github.com/ansh2222949/Neon-song) and [Stremio](https://stremio.com).

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ansh2222949/neon-audio-gateway)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fansh2222949%2Fneon-audio-gateway)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Framework: Hono](https://img.shields.io/badge/Framework-Hono%20v4-E36002.svg)](https://hono.dev)
[![Audio Quality](https://img.shields.io/badge/Audio-320kbps%20AAC-00f0ff.svg)](#)

---

## 🚀 Key Architectural Innovations

Traditional streaming addons and resolvers rely on slow, memory-intensive script engines that convert bytes into bit arrays (`[0, 1, 0, 1]`) and allocate thousands of temporary heap objects per track decryption. 

**Neon Music Core** redesigns this pipeline from the ground up:

1. **⚡ Zero-Allocation DES Deciphering**:
   - Precomputes 16-round subkeys for JioSaavn's static key (`38346591`) on startup.
   - Executes Feistel round transformations using reusable 32-bit `Uint8Array` buffers without intermediate garbage collection overhead.
   - Runs seamlessly across Cloudflare Workers, Vercel Edge, Deno, Bun, and Node.js without legacy OpenSSL provider flags.

2. **🎵 Official 320kbps Direct CDN Streaming**:
   - Resolves tracks directly from official high-speed Akamai/Jio CDNs (`aac.saavncdn.com`).
   - Upgrades default streams to true **320 kbps AAC (`mp4a` container)** with multi-bitrate fallback (`160 kbps`, `96 kbps`).
   - Supports HTTP Range requests for instant, buffer-free seeking.

3. **🔄 Unified Dual-Protocol Compatibility**:
   - **Neon Song Native Module**: `/manifest.json`, `/search`, `/stream/:id`.
   - **Stremio Addon Protocol**: Full support for Stremio catalog discovery, track metadata, and direct streams (`/catalog/...`, `/meta/...`, `/stream/...`).

4. **✨ Cyberpunk Web Dashboard & Live Stream Tester**:
   - Integrated dark OLED web console at `/` matching the Neon Song design language.
   - Built-in live search and HTML5 audio player allowing immediate track testing right in your browser.
   - One-click copy buttons for Neon Song and Stremio installation.

---

## 🛠️ Deploy to Cloud

### Option 1: 1-Click Deploy to Cloudflare Workers (Recommended)

1. Click the button below:  
   [![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ansh2222949/neon-audio-gateway)
2. Log into your free Cloudflare account.
3. Your worker will be deployed to a global edge domain like `https://neon-audio-gateway.<your-subdomain>.workers.dev`.

### Option 2: Deploy via Wrangler CLI

```bash
git clone https://github.com/ansh2222949/neon-audio-gateway.git
cd neon-audio-gateway
npm install
npx wrangler deploy
```

### Option 3: Deploy to Vercel Edge

```bash
npx vercel --prod
```

---

## 📱 How to Use

### 1. In Neon Song (Android App)
1. Open **Neon Song** on your phone.
2. Go to **Settings → Modules & Addons**.
3. Under **Custom Addon URL**, paste your deployed domain:
   ```text
   https://neon-audio-gateway.<your-worker>.workers.dev/manifest.json
   ```
4. Neon Song will instantly verify the manifest and stream 320kbps tracks with synced lyrics and trending charts!

### 2. In Stremio (Desktop / Android / TV)
1. In your browser or Stremio app, enter:
   ```text
   stremio://neon-audio-gateway.<your-worker>.workers.dev/manifest.json
   ```
2. Click **Install**.
3. Search for any song in the Music tab to stream 320kbps audio.

---

## 📡 API Reference

| Method | Endpoint | Description | Cache |
|---|---|---|---|
| `GET` | `/` | Cyberpunk Liquid Glass Web Dashboard & Audio Player | 1 Hour |
| `GET` | `/health` | Service health, cipher engine & latency telemetry | No-cache |
| `GET` | `/manifest.json` | Dual Neon Song & Stremio Addon Manifest | 24 Hours |
| `GET` | `/search?q={query}&quality={320\|160\|96}` | Search tracks (returns Neon Song JSON schema) | 24 Hours |
| `GET` | `/trending` | Fetch trending & top weekly charts | 1 Hour |
| `GET` | `/lyrics?track={title}&artist={artist}` | Fetch synchronized LRC and plain lyrics | 24 Hours |
| `GET` | `/lyrics/:id` | Fetch synced lyrics by song ID | 24 Hours |
| `GET` | `/stream/:id?quality={320\|160\|96}` | Resolve direct 320kbps CDN playback URL | 24 Hours |
| `GET` | `/download/:id?quality={320\|160\|96}` | Direct 320kbps audio download link | 24 Hours |
| `GET` | `/catalog/music/:catalogId/:extra.json` | Stremio catalog search endpoint | 24 Hours |
| `GET` | `/meta/music/:id.json` | Stremio track metadata endpoint | 24 Hours |
| `GET` | `/stream/music/:id.json` | Stremio stream resolution endpoint | 24 Hours |

### Example Stream Response (`/stream/:id?quality=320`):

```json
{
  "url": "https://aac.saavncdn.com/320/4d91932291471256b3c9313360ebb834_320.mp4",
  "directUrl": "https://aac.saavncdn.com/320/4d91932291471256b3c9313360ebb834_320.mp4",
  "streamUrl": "https://aac.saavncdn.com/320/4d91932291471256b3c9313360ebb834_320.mp4",
  "downloadUrl": "https://aac.saavncdn.com/320/4d91932291471256b3c9313360ebb834_320.mp4",
  "format": "mp4",
  "codec": "mp4a",
  "quality": "320kbps",
  "audioQuality": "320kbps",
  "bitrate": 320000,
  "sampleRate": 44100,
  "encrypted": false
}
```

---

## 💻 Local Development

```bash
# Clone the repository
git clone https://github.com/ansh2222949/neon-audio-gateway.git
cd neon-audio-gateway

# Install dependencies
npm install

# Start local edge dev server
npm run dev

# Run unit tests
npm test
```

Local server starts at `http://localhost:8787`.

---

## 📄 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for details.

### Disclaimer
This project is an educational proof-of-concept for high-performance edge computing, cryptographic optimization, and open streaming protocols. All audio media is streamed directly from official public CDNs without being re-hosted or stored by this service.
