/**
 * Cyberpunk Liquid Glass Dashboard with Real-Time Audio Visualizer, 
 * Synced Karaoke Lyrics, Trending Charts, and Pro Floating Player Dock.
 */

export function renderDashboardHtml(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#040407" />
    <title>Neon Audio Gateway • 320kbps HiFi Core</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <style>
      :root {
        --bg-main: #040407;
        --bg-card: rgba(14, 15, 24, 0.65);
        --bg-glass: rgba(255, 255, 255, 0.035);
        --border-glass: rgba(255, 255, 255, 0.08);
        --border-glow: rgba(0, 240, 255, 0.35);
        --neon-cyan: #00f0ff;
        --neon-violet: #bd00ff;
        --neon-pink: #ff0055;
        --text-primary: #f2f4fa;
        --text-secondary: #9ea5b8;
        --text-muted: #5e667b;
        --radius: 16px;
        --font: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        --mono: 'JetBrains Mono', monospace;
      }

      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        background: var(--bg-main);
        color: var(--text-primary);
        font-family: var(--font);
        min-height: 100vh;
        overflow-x: hidden;
        -webkit-font-smoothing: antialiased;
        padding-bottom: 120px;
      }

      /* Dynamic Reactive Backdrop */
      #ambient-aura {
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 0;
        background: radial-gradient(circle at 50% -10%, rgba(0, 240, 255, 0.12) 0%, rgba(189, 0, 255, 0.05) 45%, transparent 70%);
        transition: background 1.2s ease;
      }

      .container {
        position: relative;
        z-index: 1;
        max-width: 1080px;
        margin: 0 auto;
        padding: 36px 24px;
      }

      header {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        margin-bottom: 36px;
      }

      .badge-tag {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 16px;
        border-radius: 999px;
        background: rgba(0, 240, 255, 0.06);
        border: 1px solid rgba(0, 240, 255, 0.25);
        color: var(--neon-cyan);
        font-family: var(--mono);
        font-size: 12px;
        font-weight: 600;
        margin-bottom: 18px;
        box-shadow: 0 0 20px rgba(0, 240, 255, 0.15);
      }

      .pulse-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--neon-cyan);
        box-shadow: 0 0 10px var(--neon-cyan);
        animation: pulse 1.8s infinite;
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.3; transform: scale(0.7); }
      }

      h1 {
        font-size: 2.8rem;
        font-weight: 800;
        letter-spacing: -0.03em;
        line-height: 1.15;
        margin-bottom: 12px;
        background: linear-gradient(135deg, #ffffff 40%, #00f0ff 75%, #bd00ff 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      p.sub {
        color: var(--text-secondary);
        font-size: 1.1rem;
        max-width: 640px;
        margin: 0 auto 28px;
      }

      .hero-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        justify-content: center;
      }

      .btn {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 12px 24px;
        border-radius: var(--radius);
        font-family: var(--font);
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        text-decoration: none;
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        border: none;
      }

      .btn-primary {
        background: linear-gradient(135deg, #00f0ff 0%, #0088ff 100%);
        color: #030305;
        box-shadow: 0 4px 20px rgba(0, 240, 255, 0.3);
      }
      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(0, 240, 255, 0.5);
      }

      .btn-glass {
        background: var(--bg-card);
        color: var(--text-primary);
        border: 1px solid var(--border-glass);
        backdrop-filter: blur(14px);
      }
      .btn-glass:hover {
        border-color: rgba(255, 255, 255, 0.25);
        background: rgba(255, 255, 255, 0.08);
        transform: translateY(-2px);
      }

      /* Main Navigation Tabs */
      .nav-tabs {
        display: flex;
        justify-content: center;
        gap: 8px;
        margin-bottom: 28px;
      }

      .tab-btn {
        padding: 10px 20px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid var(--border-glass);
        color: var(--text-secondary);
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
      .tab-btn.active {
        background: rgba(0, 240, 255, 0.12);
        border-color: var(--neon-cyan);
        color: #fff;
        box-shadow: 0 0 15px rgba(0, 240, 255, 0.2);
      }

      /* Glass Panels */
      .panel {
        background: var(--bg-card);
        border: 1px solid var(--border-glass);
        border-radius: calc(var(--radius) + 6px);
        padding: 28px;
        backdrop-filter: blur(24px);
        box-shadow: 0 12px 40px rgba(0,0,0,0.6);
        margin-bottom: 36px;
      }

      /* Search & Visualizer Header */
      .search-box-wrap {
        display: flex;
        gap: 12px;
        margin-bottom: 20px;
      }

      .search-input {
        flex: 1;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid var(--border-glass);
        color: #fff;
        padding: 14px 20px;
        border-radius: var(--radius);
        font-family: var(--font);
        font-size: 15px;
        outline: none;
        transition: border-color 0.2s;
      }
      .search-input:focus {
        border-color: var(--neon-cyan);
        box-shadow: 0 0 18px rgba(0, 240, 255, 0.25);
      }

      /* Visualizer Canvas */
      .visualizer-card {
        height: 64px;
        width: 100%;
        background: rgba(0, 0, 0, 0.4);
        border: 1px solid var(--border-glass);
        border-radius: var(--radius);
        margin-bottom: 24px;
        overflow: hidden;
        position: relative;
      }
      #vis-canvas {
        width: 100%;
        height: 100%;
        display: block;
      }

      /* Track Grids */
      .track-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
        gap: 14px;
        max-height: 480px;
        overflow-y: auto;
        padding-right: 6px;
      }

      .track-card {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 12px 14px;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: var(--radius);
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .track-card:hover {
        background: rgba(255, 255, 255, 0.07);
        border-color: rgba(0, 240, 255, 0.35);
        transform: translateY(-2px);
      }

      .track-thumb {
        width: 52px;
        height: 52px;
        border-radius: 10px;
        object-fit: cover;
        background: #14141e;
        flex-shrink: 0;
      }

      .track-meta {
        flex: 1;
        min-width: 0;
      }
      .track-title {
        font-size: 14px;
        font-weight: 700;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: var(--text-primary);
      }
      .track-sub {
        font-size: 12px;
        color: var(--text-secondary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-top: 3px;
      }

      .quality-tag {
        font-family: var(--mono);
        font-size: 11px;
        font-weight: 700;
        padding: 4px 8px;
        border-radius: 6px;
        background: rgba(0, 240, 255, 0.1);
        border: 1px solid rgba(0, 240, 255, 0.25);
        color: var(--neon-cyan);
      }

      /* Floating Pro Player Dock */
      .player-dock {
        position: fixed;
        bottom: 18px;
        left: 50%;
        transform: translateX(-50%);
        width: calc(100% - 36px);
        max-width: 960px;
        background: rgba(12, 13, 20, 0.88);
        border: 1px solid var(--border-glow);
        border-radius: 20px;
        padding: 12px 20px;
        backdrop-filter: blur(28px);
        box-shadow: 0 16px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 240, 255, 0.12);
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .dock-main {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
      }

      .dock-now-playing {
        display: flex;
        align-items: center;
        gap: 14px;
        width: 32%;
        min-width: 0;
      }

      .dock-art {
        width: 48px;
        height: 48px;
        border-radius: 10px;
        object-fit: cover;
        background: #181926;
      }

      .dock-info {
        min-width: 0;
      }
      .dock-title {
        font-size: 14px;
        font-weight: 700;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .dock-artist {
        font-size: 12px;
        color: var(--text-secondary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .dock-controls {
        display: flex;
        align-items: center;
        gap: 14px;
      }

      .dock-btn {
        background: none;
        border: none;
        color: #fff;
        cursor: pointer;
        padding: 6px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.15s, color 0.15s;
      }
      .dock-btn:hover {
        color: var(--neon-cyan);
        transform: scale(1.1);
      }

      .play-btn {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        background: var(--neon-cyan);
        color: #000;
        box-shadow: 0 0 15px rgba(0, 240, 255, 0.4);
      }
      .play-btn:hover {
        background: #fff;
        transform: scale(1.08);
      }

      .dock-scrubber-bar {
        display: flex;
        align-items: center;
        gap: 10px;
        font-family: var(--mono);
        font-size: 11px;
        color: var(--text-muted);
      }

      .scrubber {
        flex: 1;
        -webkit-appearance: none;
        height: 4px;
        border-radius: 2px;
        background: rgba(255, 255, 255, 0.15);
        outline: none;
        cursor: pointer;
      }
      .scrubber::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--neon-cyan);
        box-shadow: 0 0 8px var(--neon-cyan);
        cursor: pointer;
      }

      .dock-tools {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      /* Synced Karaoke Lyrics Drawer */
      .lyrics-overlay {
        position: fixed;
        inset: 0;
        background: rgba(4, 5, 10, 0.94);
        backdrop-filter: blur(30px);
        z-index: 2000;
        display: none;
        flex-direction: column;
        padding: 30px;
        animation: fadeIn 0.3s;
      }
      .lyrics-overlay.open {
        display: flex;
      }

      .lyrics-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 800px;
        margin: 0 auto;
        width: 100%;
        margin-bottom: 30px;
      }

      .lyrics-scroll-box {
        max-width: 800px;
        margin: 0 auto;
        width: 100%;
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 20px;
        text-align: center;
        padding: 40px 0;
      }

      .lyric-line {
        font-size: 1.6rem;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.3);
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        cursor: pointer;
      }
      .lyric-line.active {
        color: var(--neon-cyan);
        font-size: 2.1rem;
        text-shadow: 0 0 25px rgba(0, 240, 255, 0.6);
        transform: scale(1.05);
      }

      /* Toast */
      .toast {
        position: fixed;
        bottom: 90px;
        right: 30px;
        background: var(--neon-cyan);
        color: #030305;
        padding: 12px 20px;
        border-radius: 10px;
        font-weight: 700;
        font-size: 13px;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        z-index: 3000;
        box-shadow: 0 6px 20px rgba(0, 240, 255, 0.4);
      }
      .toast.show {
        transform: translateY(0);
        opacity: 1;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    </style>
  </head>
  <body>
    <div id="ambient-aura"></div>

    <div class="container">
      <header>
        <div class="badge-tag">
          <span class="pulse-dot"></span>
          <span>NEON AUDIO GATEWAY • V1.2.0</span>
        </div>
        <h1>High-Fidelity Audio Core</h1>
        <p class="sub">320kbps Lossless AAC Engine with Synchronized Karaoke Lyrics, Web Audio Visualizer & Direct CDN streaming.</p>

        <div class="hero-actions">
          <button class="btn btn-primary" onclick="copyAddonUrl()">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
            Copy Neon Song Manifest URL
          </button>
          <a class="btn btn-glass" id="stremio-link" href="#">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/></svg>
            Add to Stremio
          </a>
        </div>
      </header>

      <!-- Navigation Tabs -->
      <div class="nav-tabs">
        <button class="tab-btn active" id="tab-trending" onclick="switchTab('trending')">🔥 Trending Charts</button>
        <button class="tab-btn" id="tab-search" onclick="switchTab('search')">🔍 Search Music</button>
        <button class="tab-btn" id="tab-docs" onclick="switchTab('docs')">📡 API & Telemetry</button>
      </div>

      <!-- Tab 1: Trending Section -->
      <section id="view-trending" class="panel">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px;">
          <h2 style="font-size:1.3rem; font-weight:800;">🔥 Top Trending Tracks</h2>
          <span class="quality-tag">LIVE 320 KBPS</span>
        </div>
        <div id="trending-grid" class="track-grid">
          <div style="grid-column: 1/-1; text-align:center; padding: 40px; color: var(--text-muted);">
            Loading trending tracks from CDN...
          </div>
        </div>
      </section>

      <!-- Tab 2: Live Search & Visualizer Section -->
      <section id="view-search" class="panel" style="display:none;">
        <div class="search-box-wrap">
          <input type="text" id="search-input" class="search-input" placeholder="Search track, artist or movie (e.g. Arijit Singh, Diljit, Kesariya)..." onkeydown="if(event.key==='Enter') executeSearch()" />
          <button class="btn btn-primary" onclick="executeSearch()">Search</button>
        </div>

        <div class="visualizer-card">
          <canvas id="vis-canvas"></canvas>
        </div>

        <div id="search-results-grid" class="track-grid">
          <div style="grid-column: 1/-1; text-align:center; padding: 40px; color: var(--text-muted);">
            Enter a query above to search through millions of high-definition songs.
          </div>
        </div>
      </section>

      <!-- Tab 3: API & Telemetry Section -->
      <section id="view-docs" class="panel" style="display:none;">
        <h2 style="font-size:1.3rem; font-weight:800; margin-bottom: 20px;">📡 Addon Endpoints & Specifications</h2>
        
        <div style="display:flex; flex-direction:column; gap:12px;">
          <div class="track-card" onclick="copyText(window.location.origin + '/manifest.json')">
            <span class="quality-tag">GET</span>
            <div class="track-meta"><div class="track-title">/manifest.json</div><div class="track-sub">Dual Neon Song & Stremio Addon discovery manifest</div></div>
          </div>
          <div class="track-card" onclick="copyText(window.location.origin + '/trending')">
            <span class="quality-tag">GET</span>
            <div class="track-meta"><div class="track-title">/trending</div><div class="track-sub">Top trending charts for Neon Song Home shelves</div></div>
          </div>
          <div class="track-card" onclick="copyText(window.location.origin + '/lyrics/:id')">
            <span class="quality-tag">GET</span>
            <div class="track-meta"><div class="track-title">/lyrics/:id</div><div class="track-sub">Synchronized line-by-line LRC lyrics for karaoke mode</div></div>
          </div>
          <div class="track-card" onclick="copyText(window.location.origin + '/download/:id')">
            <span class="quality-tag">GET</span>
            <div class="track-meta"><div class="track-title">/download/:id</div><div class="track-sub">Direct 1-click download of 320kbps AAC track</div></div>
          </div>
          <div class="track-card" onclick="copyText(window.location.origin + '/health')">
            <span class="quality-tag">GET</span>
            <div class="track-meta"><div class="track-title">/health</div><div class="track-sub">Health & Edge decipher latency telemetry</div></div>
          </div>
        </div>
      </section>
    </div>

    <!-- Floating Pro Player Dock -->
    <div id="player-dock" class="player-dock" style="display:none;">
      <div class="dock-main">
        <div class="dock-now-playing">
          <img id="dock-art" class="dock-art" src="https://via.placeholder.com/48" alt="art" />
          <div class="dock-info">
            <div id="dock-title" class="dock-title">Select a song</div>
            <div id="dock-artist" class="dock-artist">Unknown Artist</div>
          </div>
        </div>

        <div class="dock-controls">
          <button class="dock-btn" onclick="skipTrack(-1)">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M4 4a.5.5 0 0 1 1 0v3.248l6.267-3.636c.54-.313 1.233.066 1.233.69v7.396c0 .624-.692 1.003-1.233.69L5 8.752V12a.5.5 0 0 1-1 0V4z"/></svg>
          </button>
          <button id="dock-play-btn" class="dock-btn play-btn" onclick="togglePlay()">
            <svg id="play-icon" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg>
            <svg id="pause-icon" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" style="display:none;"><path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/></svg>
          </button>
          <button class="dock-btn" onclick="skipTrack(1)">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M12.5 4a.5.5 0 0 0-1 0v3.248L5.233 3.612C4.693 3.3 4 3.678 4 4.302v7.396c0 .624.693 1.003 1.233.69L11.5 8.752V12a.5.5 0 0 0 1 0V4z"/></svg>
          </button>
        </div>

        <div class="dock-tools">
          <span class="quality-tag" id="dock-bitrate">320 KBPS</span>
          <button class="dock-btn" title="View Synced Lyrics" onclick="toggleLyricsModal()">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M2.5 3.5a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-11zm0 3a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-11zm0 3a.5.5 0 0 1 0-1h6a.5.5 0 0 1 0 1h-6zm0 3a.5.5 0 0 1 0-1h6a.5.5 0 0 1 0 1h-6z"/></svg>
          </button>
          <a id="dock-download-btn" class="dock-btn" title="Download 320k Track" href="#" target="_blank">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg>
          </a>
        </div>
      </div>

      <div class="dock-scrubber-bar">
        <span id="curr-time">0:00</span>
        <input type="range" id="scrubber" class="scrubber" min="0" max="100" value="0" oninput="onScrub(this.value)" />
        <span id="dur-time">0:00</span>
      </div>
    </div>

    <!-- Synced Lyrics Modal -->
    <div id="lyrics-modal" class="lyrics-overlay">
      <div class="lyrics-header">
        <div>
          <h2 id="lyrics-song-title" style="font-size:1.6rem; font-weight:800;">Lyrics</h2>
          <p id="lyrics-artist-name" style="color:var(--text-secondary); font-size:1rem;">Artist</p>
        </div>
        <button class="dock-btn" onclick="toggleLyricsModal()" style="font-size:1.8rem;">✕</button>
      </div>
      <div id="lyrics-content" class="lyrics-scroll-box">
        <div style="color:var(--text-muted); font-size:1.3rem;">Loading synchronized lyrics...</div>
      </div>
    </div>

    <audio id="audio-core" crossorigin="anonymous"></audio>
    <div id="toast" class="toast">Copied to clipboard!</div>

    <script>
      let currentTrackList = [];
      let currentIndex = -1;
      let audioCtx = null;
      let analyser = null;
      let parsedLyrics = [];

      const audio = document.getElementById('audio-core');
      const origin = window.location.origin;

      document.getElementById('stremio-link').href = 'stremio://' + window.location.host + '/manifest.json';

      // Load Trending on startup
      loadTrending();

      function switchTab(tab) {
        ['trending', 'search', 'docs'].forEach(t => {
          document.getElementById('view-' + t).style.display = (t === tab ? 'block' : 'none');
          document.getElementById('tab-' + t).classList.toggle('active', t === tab);
        });
        if (tab === 'search') setupVisualizer();
      }

      async function loadTrending() {
        try {
          const res = await fetch('/trending');
          const data = await res.json();
          currentTrackList = data.tracks || [];
          renderGrid('trending-grid', currentTrackList);
        } catch (err) {
          console.error(err);
        }
      }

      async function executeSearch() {
        const q = document.getElementById('search-input').value.trim();
        if (!q) return;

        const box = document.getElementById('search-results-grid');
        box.innerHTML = '<div style=\"grid-column: 1/-1; text-align:center; padding: 40px;\">Searching 320kbps streams...</div>';

        try {
          const res = await fetch('/search?q=' + encodeURIComponent(q) + '&quality=320');
          const data = await res.json();
          currentTrackList = data.tracks || [];
          renderGrid('search-results-grid', currentTrackList);
        } catch (err) {
          box.innerHTML = '<div style=\"color:var(--neon-pink); text-align:center; grid-column: 1/-1;\">Search error: ' + err.message + '</div>';
        }
      }

      function renderGrid(containerId, tracks) {
        const box = document.getElementById(containerId);
        if (!tracks || !tracks.length) {
          box.innerHTML = '<div style=\"grid-column: 1/-1; text-align:center; padding: 40px; color:var(--text-muted);\">No tracks found</div>';
          return;
        }

        box.innerHTML = tracks.map((t, idx) => \`
          <div class=\"track-card\" onclick=\"playTrackByIndex(\${idx})\">
            <img class=\"track-thumb\" src=\"\${t.artworkURL || 'https://via.placeholder.com/52'}\" alt=\"art\" />
            <div class=\"track-meta\">
              <div class=\"track-title\">\${escapeHtml(t.title)}</div>
              <div class=\"track-sub\">\${escapeHtml(t.artist)} • \${formatTime(t.duration)}</div>
            </div>
            <span class=\"quality-tag\">\${t.quality}</span>
          </div>
        \`).join('');
      }

      async function playTrackByIndex(idx) {
        if (!currentTrackList[idx]) return;
        currentIndex = idx;
        const track = currentTrackList[idx];

        document.getElementById('player-dock').style.display = 'flex';
        document.getElementById('dock-title').textContent = track.title;
        document.getElementById('dock-artist').textContent = track.artist;
        document.getElementById('dock-art').src = track.artworkURL || 'https://via.placeholder.com/48';
        document.getElementById('dock-download-btn').href = '/download/' + track.id;

        // Dynamic Ambient Glow
        const aura = document.getElementById('ambient-aura');
        aura.style.background = 'radial-gradient(circle at 50% 20%, rgba(0, 240, 255, 0.25) 0%, rgba(189, 0, 255, 0.12) 50%, transparent 80%)';

        showToast('Resolving 320kbps CDN stream...');

        try {
          const res = await fetch('/stream/' + track.id + '?quality=320');
          const stream = await res.json();
          if (!stream.url) throw new Error('No stream available');

          audio.src = stream.url;
          audio.play();
          setupVisualizer();
          loadLyrics(track);
        } catch (err) {
          showToast('Failed to stream: ' + err.message);
        }
      }

      function togglePlay() {
        if (audio.paused) {
          audio.play();
        } else {
          audio.pause();
        }
      }

      function skipTrack(dir) {
        if (!currentTrackList.length) return;
        let next = currentIndex + dir;
        if (next < 0) next = currentTrackList.length - 1;
        if (next >= currentTrackList.length) next = 0;
        playTrackByIndex(next);
      }

      audio.onplay = () => {
        document.getElementById('play-icon').style.display = 'none';
        document.getElementById('pause-icon').style.display = 'block';
      };

      audio.onpause = () => {
        document.getElementById('play-icon').style.display = 'block';
        document.getElementById('pause-icon').style.display = 'none';
      };

      audio.ontimeupdate = () => {
        const cur = audio.currentTime;
        const dur = audio.duration || 1;
        document.getElementById('curr-time').textContent = formatTime(cur);
        document.getElementById('dur-time').textContent = formatTime(dur);
        document.getElementById('scrubber').value = (cur / dur) * 100;

        syncLyrics(cur);
      };

      function onScrub(val) {
        if (audio.duration) {
          audio.currentTime = (val / 100) * audio.duration;
        }
      }

      // Real-time Canvas Audio Spectrum Visualizer
      function setupVisualizer() {
        if (audioCtx) return;
        try {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          analyser = audioCtx.createAnalyser();
          const source = audioCtx.createMediaElementSource(audio);
          source.connect(analyser);
          analyser.connect(audioCtx.destination);
          analyser.fftSize = 64;

          const canvas = document.getElementById('vis-canvas');
          const ctx = canvas.getContext('2d');
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          function draw() {
            requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const barWidth = (canvas.width / bufferLength) * 1.5;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
              const barHeight = (dataArray[i] / 255) * canvas.height * 0.85;
              const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
              grad.addColorStop(0, '#00f0ff');
              grad.addColorStop(1, '#bd00ff');

              ctx.fillStyle = grad;
              ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);
              x += barWidth;
            }
          }
          draw();
        } catch (e) {
          // AudioContext cross-origin restrictions in local file
        }
      }

      // Synced Karaoke Lyrics
      async function loadLyrics(track) {
        parsedLyrics = [];
        document.getElementById('lyrics-song-title').textContent = track.title;
        document.getElementById('lyrics-artist-name').textContent = track.artist;
        const box = document.getElementById('lyrics-content');
        box.innerHTML = '<div style=\"color:var(--text-muted); font-size:1.3rem;\">Loading synced lyrics...</div>';

        try {
          const res = await fetch('/lyrics/' + track.id);
          const data = await res.json();
          if (data.syncedLyrics) {
            parseLrc(data.syncedLyrics);
            renderLyrics();
          } else if (data.plainLyrics) {
            box.innerHTML = '<pre style=\"font-family:var(--font); font-size:1.2rem; line-height:2;\">' + escapeHtml(data.plainLyrics) + '</pre>';
          } else {
            box.innerHTML = '<div style=\"color:var(--text-muted); font-size:1.3rem;\">No synchronized lyrics found for this track.</div>';
          }
        } catch {
          box.innerHTML = '<div style=\"color:var(--text-muted); font-size:1.3rem;\">Lyrics unavailable</div>';
        }
      }

      function parseLrc(lrcText) {
        const lines = lrcText.split('\\n');
        parsedLyrics = [];
        const timeRegex = /\\[(\\d+):(\\d+\\.\\d+)\\]/;

        for (const line of lines) {
          const match = line.match(timeRegex);
          if (match) {
            const min = parseFloat(match[1]);
            const sec = parseFloat(match[2]);
            const totalSec = min * 60 + sec;
            const text = line.replace(timeRegex, '').trim();
            if (text) parsedLyrics.push({ time: totalSec, text });
          }
        }
      }

      function renderLyrics() {
        const box = document.getElementById('lyrics-content');
        box.innerHTML = parsedLyrics.map((item, idx) => \`
          <div id=\"line-\${idx}\" class=\"lyric-line\" onclick=\"audio.currentTime = \${item.time}\">\${escapeHtml(item.text)}</div>
        \`).join('');
      }

      function syncLyrics(currTime) {
        if (!parsedLyrics.length) return;
        let activeIdx = -1;
        for (let i = 0; i < parsedLyrics.length; i++) {
          if (currTime >= parsedLyrics[i].time) activeIdx = i;
        }

        if (activeIdx !== -1) {
          document.querySelectorAll('.lyric-line').forEach((el, idx) => {
            el.classList.toggle('active', idx === activeIdx);
          });
          const activeEl = document.getElementById('line-' + activeIdx);
          if (activeEl) {
            activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }

      function toggleLyricsModal() {
        document.getElementById('lyrics-modal').classList.toggle('open');
      }

      function showToast(text) {
        const t = document.getElementById('toast');
        t.textContent = text;
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 2200);
      }

      function copyAddonUrl() {
        navigator.clipboard.writeText(origin + '/manifest.json').then(() => {
          showToast('Copied! Paste in Neon Song Settings → Modules.');
        });
      }

      function copyText(str) {
        navigator.clipboard.writeText(str).then(() => {
          showToast('Copied: ' + str);
        });
      }

      function formatTime(s) {
        const sec = Math.floor(s || 0);
        const m = Math.floor(sec / 60);
        const rem = sec % 60;
        return m + ':' + (rem < 10 ? '0' : '') + rem;
      }

      function escapeHtml(str) {
        return (str || '').replace(/[&<>'"]/g, 
          tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', \"'\": '&#39;', '\"': '&quot;' }[tag] || tag)
        );
      }
    </script>
  </body>
</html>`;
}
