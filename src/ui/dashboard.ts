/**
 * Cyberpunk / OLED Dark Web Dashboard with Live Search & Embedded 320kbps Audio Player
 */

export function renderDashboardHtml(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#08080c" />
    <title>Neon Music Core • 320kbps Lossless AAC Engine</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
    <style>
      :root {
        --bg-main: #060609;
        --bg-card: rgba(18, 18, 26, 0.7);
        --bg-glass: rgba(255, 255, 255, 0.03);
        --border-glass: rgba(255, 255, 255, 0.08);
        --border-active: rgba(0, 240, 255, 0.4);
        --neon-cyan: #00f0ff;
        --neon-violet: #bd00ff;
        --neon-glow: rgba(0, 240, 255, 0.15);
        --text-primary: #f0f2f8;
        --text-secondary: #9aa1b2;
        --text-muted: #5e6678;
        --radius: 14px;
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
      }

      /* Background Ambient Light Gradients */
      body::before {
        content: '';
        position: fixed;
        top: -150px;
        left: 50%;
        transform: translateX(-50%);
        width: 800px;
        height: 450px;
        background: radial-gradient(circle, rgba(0, 240, 255, 0.08) 0%, rgba(189, 0, 255, 0.04) 50%, transparent 80%);
        filter: blur(80px);
        z-index: 0;
        pointer-events: none;
      }

      .container {
        position: relative;
        z-index: 1;
        max-width: 980px;
        margin: 0 auto;
        padding: 40px 24px 80px;
      }

      header {
        text-align: center;
        margin-bottom: 40px;
      }

      .badge-tag {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 14px;
        border-radius: 999px;
        background: rgba(0, 240, 255, 0.06);
        border: 1px solid rgba(0, 240, 255, 0.2);
        color: var(--neon-cyan);
        font-family: var(--mono);
        font-size: 12px;
        font-weight: 500;
        margin-bottom: 16px;
      }

      .pulse-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: var(--neon-cyan);
        box-shadow: 0 0 10px var(--neon-cyan);
        animation: pulse 1.8s infinite;
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.4; transform: scale(0.8); }
      }

      h1 {
        font-size: 2.6rem;
        font-weight: 800;
        letter-spacing: -0.03em;
        line-height: 1.15;
        margin-bottom: 12px;
        background: linear-gradient(135deg, #ffffff 40%, #00f0ff 85%, #bd00ff 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      p.sub {
        color: var(--text-secondary);
        font-size: 1.05rem;
        max-width: 600px;
        margin: 0 auto 30px;
      }

      /* Quick Action Grid */
      .action-bar {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        justify-content: center;
        margin-bottom: 40px;
      }

      .btn {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 12px 22px;
        border-radius: var(--radius);
        font-family: var(--font);
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        text-decoration: none;
        transition: all 0.2s ease;
        border: none;
      }

      .btn-primary {
        background: linear-gradient(135deg, #00f0ff 0%, #00a2ff 100%);
        color: #060609;
        box-shadow: 0 4px 20px rgba(0, 240, 255, 0.25);
      }
      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 26px rgba(0, 240, 255, 0.4);
      }

      .btn-glass {
        background: var(--bg-card);
        color: var(--text-primary);
        border: 1px solid var(--border-glass);
      }
      .btn-glass:hover {
        border-color: rgba(255, 255, 255, 0.2);
        background: rgba(255, 255, 255, 0.06);
        transform: translateY(-2px);
      }

      /* Live Player & Search Console */
      .player-card {
        background: var(--bg-card);
        border: 1px solid var(--border-glass);
        border-radius: calc(var(--radius) + 4px);
        padding: 28px;
        margin-bottom: 40px;
        backdrop-filter: blur(20px);
        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
      }

      .player-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }

      .player-title {
        font-size: 1.15rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .search-form {
        display: flex;
        gap: 10px;
        margin-bottom: 24px;
      }

      .search-input {
        flex: 1;
        background: rgba(0, 0, 0, 0.4);
        border: 1px solid var(--border-glass);
        color: var(--text-primary);
        padding: 14px 18px;
        border-radius: var(--radius);
        font-family: var(--font);
        font-size: 15px;
        outline: none;
        transition: border-color 0.2s;
      }
      .search-input:focus {
        border-color: var(--neon-cyan);
        box-shadow: 0 0 15px rgba(0, 240, 255, 0.2);
      }

      .results-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 14px;
        margin-bottom: 24px;
        max-height: 480px;
        overflow-y: auto;
        padding-right: 4px;
      }

      .song-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: var(--radius);
        transition: all 0.2s;
        cursor: pointer;
      }
      .song-item:hover {
        background: rgba(255, 255, 255, 0.06);
        border-color: rgba(0, 240, 255, 0.3);
        transform: scale(1.01);
      }

      .song-art {
        width: 50px;
        height: 50px;
        border-radius: 8px;
        object-fit: cover;
        background: #1a1a24;
      }

      .song-info {
        flex: 1;
        min-width: 0;
      }
      .song-name {
        font-size: 14px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: var(--text-primary);
      }
      .song-sub {
        font-size: 12px;
        color: var(--text-secondary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-top: 2px;
      }

      .quality-badge {
        font-family: var(--mono);
        font-size: 10px;
        padding: 2px 6px;
        border-radius: 4px;
        background: rgba(0, 240, 255, 0.1);
        color: var(--neon-cyan);
        font-weight: 600;
      }

      /* Audio Player Container */
      .audio-container {
        padding: 16px;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: var(--radius);
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .now-playing {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 13px;
        color: var(--text-secondary);
      }
      .now-playing strong {
        color: var(--neon-cyan);
      }

      audio {
        width: 100%;
        outline: none;
        height: 38px;
      }

      /* Documentation & Endpoints */
      .docs-section {
        background: var(--bg-card);
        border: 1px solid var(--border-glass);
        border-radius: calc(var(--radius) + 4px);
        padding: 28px;
        margin-bottom: 40px;
      }

      .docs-section h2 {
        font-size: 1.3rem;
        margin-bottom: 16px;
      }

      .endpoint-row {
        background: rgba(0,0,0,0.3);
        border: 1px solid var(--border-glass);
        border-radius: 8px;
        padding: 12px 16px;
        font-family: var(--mono);
        font-size: 13px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
      }

      .method {
        font-weight: 700;
        color: var(--neon-cyan);
        margin-right: 12px;
      }

      .copy-btn {
        background: none;
        border: 1px solid var(--border-glass);
        color: var(--text-secondary);
        font-size: 12px;
        padding: 4px 10px;
        border-radius: 6px;
        cursor: pointer;
        transition: 0.2s;
      }
      .copy-btn:hover {
        color: #fff;
        border-color: #fff;
      }

      /* Toast */
      .toast {
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: #00f0ff;
        color: #000;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 13px;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        z-index: 100;
      }
      .toast.show {
        transform: translateY(0);
        opacity: 1;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <header>
        <div class="badge-tag">
          <span class="pulse-dot"></span>
          <span>NEON MUSIC CORE • V1.0.0</span>
        </div>
        <h1>High-Performance 320kbps Engine</h1>
        <p class="sub">Zero-allocation DES deciphering and direct high-speed CDN audio streaming for Neon Song & Stremio.</p>
        
        <div class="action-bar">
          <button class="btn btn-primary" onclick="copyAddonUrl()">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
            Copy Neon Song Module URL
          </button>
          <a class="btn btn-glass" id="stremio-install-btn" href="#">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/></svg>
            Install to Stremio
          </a>
        </div>
      </header>

      <!-- Live Search & Player Card -->
      <section class="player-card">
        <div class="player-card-header">
          <div class="player-title">
            <svg width="20" height="20" fill="var(--neon-cyan)" viewBox="0 0 16 16"><path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/><path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/><path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/></svg>
            Interactive Stream Tester
          </div>
          <span class="quality-badge">320 KBPS DIRECT</span>
        </div>

        <form class="search-form" onsubmit="handleSearch(event)">
          <input type="text" id="query-input" class="search-input" placeholder="Search track or artist (e.g. Kesariya, Arijit Singh, Diljit)..." required />
          <button type="submit" class="btn btn-primary" id="search-btn">Search</button>
        </form>

        <div id="results-box" class="results-grid"></div>

        <div class="audio-container">
          <div class="now-playing">
            <span id="playing-track">Ready to test. Select any track above.</span>
            <span id="stream-info" class="quality-badge" style="display:none;">AAC 320K</span>
          </div>
          <audio id="audio-player" controls preload="metadata"></audio>
        </div>
      </section>

      <!-- Protocol Endpoints -->
      <section class="docs-section">
        <h2>Native Protocol Endpoints</h2>
        
        <div class="endpoint-row">
          <div><span class="method">GET</span> <span>/manifest.json</span></div>
          <button class="copy-btn" onclick="copyEndpoint('/manifest.json')">Copy</button>
        </div>

        <div class="endpoint-row">
          <div><span class="method">GET</span> <span>/search?q={query}&quality=320</span></div>
          <button class="copy-btn" onclick="copyEndpoint('/search?q=Arijit&quality=320')">Copy</button>
        </div>

        <div class="endpoint-row">
          <div><span class="method">GET</span> <span>/stream/:id?quality=320</span></div>
          <button class="copy-btn" onclick="copyEndpoint('/stream/rjkrTnma?quality=320')">Copy</button>
        </div>

        <div class="endpoint-row">
          <div><span class="method">GET</span> <span>/health</span></div>
          <button class="copy-btn" onclick="copyEndpoint('/health')">Copy</button>
        </div>
      </section>
    </div>

    <div id="toast" class="toast">Copied to clipboard!</div>

    <script>
      const origin = window.location.origin;
      const stremioBtn = document.getElementById('stremio-install-btn');
      if (stremioBtn) {
        stremioBtn.href = 'stremio://' + window.location.host + '/manifest.json';
      }

      function showToast(text) {
        const t = document.getElementById('toast');
        t.textContent = text;
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 2200);
      }

      function copyAddonUrl() {
        navigator.clipboard.writeText(origin + '/manifest.json').then(() => {
          showToast('Module URL copied! Paste into Neon Song Settings.');
        });
      }

      function copyEndpoint(path) {
        navigator.clipboard.writeText(origin + path).then(() => {
          showToast('Copied: ' + origin + path);
        });
      }

      async function handleSearch(e) {
        e.preventDefault();
        const q = document.getElementById('query-input').value.trim();
        if (!q) return;

        const btn = document.getElementById('search-btn');
        btn.textContent = 'Searching...';
        btn.disabled = true;

        try {
          const res = await fetch('/search?q=' + encodeURIComponent(q) + '&quality=320');
          const data = await res.json();
          renderResults(data.tracks || []);
        } catch (err) {
          alert('Search failed: ' + err.message);
        } finally {
          btn.textContent = 'Search';
          btn.disabled = false;
        }
      }

      function renderResults(tracks) {
        const box = document.getElementById('results-box');
        if (!tracks.length) {
          box.innerHTML = '<div style=\"grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 20px;\">No tracks found</div>';
          return;
        }

        box.innerHTML = tracks.map(t => \`
          <div class=\"song-item\" onclick=\"playTrack('\${t.id}', '\${escapeHtml(t.title)}', '\${escapeHtml(t.artist)}')\">
            <img class=\"song-art\" src=\"\${t.artworkURL || 'https://via.placeholder.com/50'}\" alt=\"cover\" />
            <div class=\"song-info\">
              <div class=\"song-name\">\${escapeHtml(t.title)}</div>
              <div class=\"song-sub\">\${escapeHtml(t.artist)} • \${t.duration}s</div>
            </div>
            <span class=\"quality-badge\">\${t.quality}</span>
          </div>
        \`).join('');
      }

      async function playTrack(id, title, artist) {
        const player = document.getElementById('audio-player');
        const label = document.getElementById('playing-track');
        const badge = document.getElementById('stream-info');

        label.innerHTML = 'Resolving 320k stream for <strong>' + title + '</strong>...';

        try {
          const res = await fetch('/stream/' + id + '?quality=320');
          const stream = await res.json();
          if (!stream.url) throw new Error('No stream URL');

          player.src = stream.url;
          player.play();
          label.innerHTML = 'Playing: <strong>' + title + '</strong> • ' + artist;
          badge.style.display = 'inline-block';
          badge.textContent = (stream.bitrate / 1000) + ' KBPS AAC';
          showToast('Now streaming 320kbps AAC');
        } catch (err) {
          label.textContent = 'Playback error: ' + err.message;
        }
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
