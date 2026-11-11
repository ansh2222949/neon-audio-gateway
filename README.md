<div align="center">

# ⚡ Neon Audio Gateway

### **High-Performance Edge Audio Resolver & Apple Spatial Web Player**
*Built on Hono v4 & Cloudflare Workers for [Neon Song](https://github.com/ansh2222949/Neon-song) (Android) and [Stremio](https://stremio.com).*

<br/>

[![Framework](https://img.shields.io/badge/Framework-Hono%20v4-E36002?style=for-the-badge&logo=hono&logoColor=white)](https://hono.dev)
[![Runtime](https://img.shields.io/badge/Runtime-Cloudflare%20Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Audio](https://img.shields.io/badge/Audio-320kbps%20Master%20AAC-00f0ff?style=for-the-badge&logo=apple&logoColor=white)](#-key-architectural-innovations)
[![Client](https://img.shields.io/badge/Client-Neon%20Song%20Android-00D26A?style=for-the-badge&logo=android&logoColor=white)](https://github.com/ansh2222949/Neon-song)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

<br/>

[**🚀 1-Click Deploy**](#-deploy-to-cloud) • [**🏛️ Architecture**](#-key-architectural-innovations) • [**🍏 Spatial Web Player**](#-visionos--apple-spatial-glass-web-player) • [**📡 API Matrix**](#-api-reference) • [**💻 Local Setup**](#-local-development)

---

<p align="center">
  <a href="https://deploy.workers.cloudflare.com/?url=https://github.com/ansh2222949/neon-audio-gateway"><img src="https://deploy.workers.cloudflare.com/button" alt="Deploy to Cloudflare Workers" height="32" /></a>
  &nbsp;&nbsp;
  <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fansh2222949%2Fneon-audio-gateway"><img src="https://vercel.com/button" alt="Deploy with Vercel" height="32" /></a>
</p>

</div>

<br/>

## ✨ Why Neon Audio Gateway? (At a Glance)

| ⚡ **Zero-Allocation DES Engine** | 🎵 **320kbps Master CDN** | 🍏 **visionOS Spatial Player** | 🔄 **Unified Dual-Protocol** |
| :--- | :--- | :--- | :--- |
| Precomputed 16-round subkeys & reusable 32-bit `Uint8Array` buffers. Zero GC pauses on global Edge isolates. | Direct stream resolution from official high-speed Akamai CDNs (`aac.saavncdn.com`) with instant HTTP Range seeking. | Dynamic artwork mesh gradients (`blur(110px)`), Apple Music Sing blurred karaoke lyrics, and live spectrum visualizer. | Seamless dual-stack compatibility for **Neon Song Android Module** and **Stremio Addon Protocol** (`/catalog`, `/meta`, `/stream`). |

---

## 🚀 Key Architectural Innovations

Traditional streaming addons and scrapers rely on heavy Node.js runtimes that unpack bytes into bit arrays (`[0, 1, 0, 1]`) and allocate thousands of temporary heap objects per track decryption. 

**Neon Audio Gateway** re-engineers this pipeline from first principles:

1. **⚡ Zero-Allocation DES Deciphering (`src/crypto/des.ts`):**
   - Precomputes 16-round subkeys for JioSaavn's static key (`38346591`) on worker instantiation.
   - Executes Feistel round transformations using reusable 32-bit typed arrays without heap garbage collection overhead.
   - Runs natively across Cloudflare Workers, Vercel Edge, Deno, Bun, and Node.js without legacy OpenSSL provider flags.

2. **🎵 Official 320kbps Direct CDN Streaming (`src/services/jiosaavn.ts`):**
   - Resolves tracks directly from official high-speed Akamai/Jio CDNs (`aac.saavncdn.com`).
   - Upgrades default streams to true **320 kbps AAC (`mp4a` container)** with automatic multi-bitrate fallback (`160 kbps`, `96 kbps`).
   - Supports HTTP Range requests for instant, buffer-free seeking.

3. **🔍 Smart Multi-Entity Search Engine:**
   - Parallel query resolution querying both track titles and artist catalogs simultaneously.
   - Intelligent Japanese / Global artist phonetic mapping (e.g., `Ado`, `9lane` -> `9Lana`, anime sound tracks).
   - Resolves top artist hits directly from verified artist discographies when searching by artist name.

4. **🍏 visionOS & Apple Spatial Glass Web Player (`src/ui/dashboard.ts`):**
   - Immersive full-screen player with dynamic album artwork mesh gradients (`blur(110px) saturate(220%)`).
   - **Apple Music Sing** synced lyrics experience with live focus luminescence and background line blur.
   - Real-time bit-rate selector (`320kbps Master`, `160kbps High`, `96kbps Eco`), live audio visualizer spectrum, queue drawer, and keyboard shortcuts (`Space`, `⌘K`, `L`).

5. **🔄 Unified Dual-Protocol Compatibility:**
   - **Neon Song Native Module**: `/manifest.json`, `/search`, `/stream/:id`, `/recommendations/:id`, `/lyrics/:id`.
   - **Stremio Addon Protocol**: Full support for Stremio catalog discovery, track metadata with rich 500x500 posters, and direct playback streams (`/catalog/...`, `/meta/...`, `/stream/...`).

---

## 🛠️ Deploy to Cloud

### Option 1: 1-Click Deploy to Cloudflare Workers (Recommended)
1. Click the button below:  
   [![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ansh2222949/neon-audio-gateway)
2. Log into your free Cloudflare account.
3. Your worker will be live globally in `<30` seconds on:  
   `https://neon-audio-gateway.<your-subdomain>.workers.dev`

### Option 2: Deploy via Wrangler CLI
```bash
# Clone the repository
git clone https://github.com/ansh2222949/neon-audio-gateway.git
cd neon-audio-gateway

# Install dependencies
npm install

# Deploy to Cloudflare Workers
npx wrangler deploy
```

### Option 3: Deploy to Vercel Edge
```bash
npx vercel --prod
```

---

## 📱 How to Connect to Neon Song & Stremio

### 1. In Neon Song (Android App)
1. Open **Neon Song** on your phone.
2. Go to **Settings → Modules & Addons**.
3. Under **Custom Addon URL**, paste your deployed gateway manifest URL:
   ```text
   https://neon-audio-gateway.<your-subdomain>.workers.dev/manifest.json
   ```
4. Tap **Save / Connect**. Neon Song verifies the manifest and unlocks high-speed 320kbps direct streaming and lyrics!

### 2. In Stremio (Desktop / Android / Android TV)
1. In your browser or Stremio app, enter:
   ```text
   stremio://neon-audio-gateway.<your-subdomain>.workers.dev/manifest.json
   ```
2. Tap **Install**.
3. Search for any artist or track in the Music tab to stream 320kbps master audio with full album artwork.

---

## 📡 API Reference

| Method | Endpoint | Description | Cache Policy |
|---|---|---|---|
| `GET` | `/` | Apple visionOS Spatial Glass Web Player & Stream Tester | `public, max-age=3600` |
| `GET` | `/health` | Service health, cipher engine status & latency telemetry | `no-cache` |
| `GET` | `/manifest.json` | Dual Neon Song & Stremio Addon Manifest | `public, max-age=86400` |
| `GET` | `/search?q={query}&quality={320\|160\|96}` | Smart artist & track search (returns Neon Song JSON) | `public, max-age=86400` |
| `GET` | `/trending` | Fetch trending & top weekly charts | `public, max-age=3600` |
| `GET` | `/lyrics/:id` | Fetch synchronized lyrics & LRC by song ID | `public, max-age=86400` |
| `GET` | `/stream/:id?quality={320\|160\|96}` | Resolve direct 320kbps CDN playback URL | `public, max-age=86400` |
| `GET` | `/download/:id?quality={320\|160\|96}` | Direct 320kbps audio download stream | `public, max-age=86400` |
| `GET` | `/catalog/music/:catalogId/:extra.json` | Stremio catalog search endpoint | `public, max-age=86400` |
| `GET` | `/meta/music/:id.json` | Stremio track metadata endpoint with 500x500 posters | `public, max-age=86400` |
| `GET` | `/stream/music/:id.json` | Stremio stream resolution endpoint | `public, max-age=86400` |

---

## 💻 Local Development

```bash
# 1. Clone the repository
git clone https://github.com/ansh2222949/neon-audio-gateway.git
cd neon-audio-gateway

# 2. Install dependencies
npm install

# 3. Start local edge development server
npm run dev

# 4. Run test suite
npm test
```

Local server starts at `http://localhost:8787`.

---

## 📄 License & Legal Disclaimer

* **License:** Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.
* **Disclaimer:** This project is an educational proof-of-concept for high-performance edge computing, cryptographic optimization, and open streaming protocols. All audio media is streamed directly from official public CDNs without being re-hosted or stored by this service.

<div align="center">
<br/>

**Neon Audio Gateway** — *Crafted with architectural precision by **Ansh Shrivastava** for high-speed lossless edge audio streaming.*

</div>
