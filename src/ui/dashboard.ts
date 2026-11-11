/**
 * Apple Music & visionOS Spatial Glass Dashboard
 * Features: Dynamic Artwork Mesh Gradients, Apple Music Sing (Blurred Karaoke Lyrics),
 * Segmented Controls, Live Audio Spectrum, Bitrate Switcher, Queue Drawer & Keyboard Shortcuts.
 */

export function renderDashboardHtml(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#000000" />
    <title>Neon Audio — Spatial Lossless Engine</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
    <style>
      :root {
        --bg-base: #000000;
        --glass-surface: rgba(28, 28, 30, 0.58);
        --glass-elevated: rgba(44, 44, 46, 0.65);
        --glass-pill: rgba(255, 255, 255, 0.08);
        --border-specular: rgba(255, 255, 255, 0.12);
        --border-highlight: rgba(255, 255, 255, 0.24);
        --apple-red: #fa243c;
        --apple-blue: #0a84ff;
        --apple-green: #30d158;
        --text-primary: #f5f5f7;
        --text-secondary: rgba(235, 235, 245, 0.6);
        --text-tertiary: rgba(235, 235, 245, 0.35);
        --radius-xl: 24px;
        --radius-lg: 16px;
        --radius-md: 12px;
        --font-sans: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Inter', sans-serif;
        --font-mono: 'SF Mono', 'JetBrains Mono', monospace;
        --spring: cubic-bezier(0.22, 1, 0.36, 1);
      }

      * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }

      body {
        background: var(--bg-base);
        color: var(--text-primary);
        font-family: var(--font-sans);
        min-height: 100vh;
        overflow-x: hidden;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        padding-bottom: 140px;
      }

      /* Dynamic Apple Music Artwork Mesh Backdrop */
      .spatial-canvas {
        position: fixed;
        inset: 0;
        z-index: 0;
        pointer-events: none;
        overflow: hidden;
        background: radial-gradient(circle at 50% 0%, #1c1c1e 0%, #000000 75%);
      }

      #artwork-blur-bg {
        position: absolute;
        top: -20%;
        left: -20%;
        width: 140%;
        height: 140%;
        background-size: cover;
        background-position: center;
        filter: blur(110px) saturate(220%) brightness(0.45);
        opacity: 0;
        transform: scale(1.1);
        transition: background-image 1.2s ease, opacity 1.2s ease;
        animation: slowFloat 24s ease-in-out infinite alternate;
      }

      @keyframes slowFloat {
        0% { transform: scale(1.1) translate(0, 0) rotate(0deg); }
        100% { transform: scale(1.22) translate(-2%, 3%) rotate(3deg); }
      }

      /* Top Sticky Apple Glass Navigation */
      .apple-nav {
        position: sticky;
        top: 0;
        z-index: 100;
        height: 54px;
        background: rgba(10, 10, 12, 0.65);
        backdrop-filter: saturate(180%) blur(25px);
        -webkit-backdrop-filter: saturate(180%) blur(25px);
        border-bottom: 0.5px solid var(--border-specular);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 28px;
      }

      .nav-brand {
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 600;
        font-size: 15px;
        letter-spacing: -0.01em;
      }

      .lossless-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 3px 10px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.08);
        border: 0.5px solid var(--border-specular);
        font-size: 11px;
        font-weight: 500;
        color: var(--text-secondary);
      }

      .status-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--apple-green);
        box-shadow: 0 0 8px var(--apple-green);
      }

      .quality-selector {
        display: flex;
        align-items: center;
        gap: 4px;
        background: rgba(255, 255, 255, 0.06);
        padding: 3px;
        border-radius: 999px;
        border: 0.5px solid var(--border-specular);
      }

      .q-btn {
        background: transparent;
        border: none;
        color: var(--text-secondary);
        font-size: 11px;
        font-weight: 600;
        padding: 4px 10px;
        border-radius: 999px;
        cursor: pointer;
        transition: all 0.2s var(--spring);
      }
      .q-btn.active {
        background: rgba(255, 255, 255, 0.18);
        color: #fff;
        box-shadow: 0 2px 8px rgba(0,0,0,0.25);
      }

      .container {
        position: relative;
        z-index: 1;
        max-width: 1060px;
        margin: 0 auto;
        padding: 48px 24px 40px;
      }

      /* Apple Keynote Hero Section */
      header {
        text-align: center;
        margin-bottom: 44px;
      }

      .eyebrow {
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--apple-red);
        margin-bottom: 10px;
      }

      h1 {
        font-size: clamp(2.4rem, 5vw, 3.8rem);
        font-weight: 700;
        letter-spacing: -0.035em;
        line-height: 1.06;
        margin-bottom: 16px;
        background: linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0.68) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      p.hero-sub {
        color: var(--text-secondary);
        font-size: clamp(1rem, 2vw, 1.2rem);
        font-weight: 400;
        line-height: 1.5;
        max-width: 580px;
        margin: 0 auto 28px;
        letter-spacing: -0.01em;
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
        gap: 8px;
        padding: 11px 22px;
        border-radius: 999px;
        font-family: var(--font-sans);
        font-size: 14px;
        font-weight: 600;
        letter-spacing: -0.01em;
        cursor: pointer;
        text-decoration: none;
        transition: all 0.28s var(--spring);
        border: 0.5px solid transparent;
      }

      .btn-apple-white {
        background: #ffffff;
        color: #000000;
        box-shadow: 0 8px 24px rgba(255, 255, 255, 0.14);
      }
      .btn-apple-white:hover {
        transform: scale(1.03);
        background: #f2f2f7;
        box-shadow: 0 10px 30px rgba(255, 255, 255, 0.22);
      }

      .btn-apple-glass {
        background: var(--glass-pill);
        color: var(--text-primary);
        border-color: var(--border-specular);
        backdrop-filter: blur(20px);
      }
      .btn-apple-glass:hover {
        background: rgba(255, 255, 255, 0.14);
        border-color: var(--border-highlight);
        transform: scale(1.03);
      }

      /* iOS / macOS Segmented Control */
      .segmented-wrap {
        display: flex;
        justify-content: center;
        margin-bottom: 32px;
      }

      .segmented-control {
        display: inline-flex;
        background: rgba(118, 118, 128, 0.24);
        padding: 4px;
        border-radius: 999px;
        border: 0.5px solid var(--border-specular);
        backdrop-filter: blur(20px);
      }

      .seg-btn {
        padding: 8px 22px;
        border-radius: 999px;
        border: none;
        background: transparent;
        color: var(--text-secondary);
        font-family: var(--font-sans);
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.25s var(--spring);
      }
      .seg-btn.active {
        background: rgba(255, 255, 255, 0.16);
        color: #ffffff;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3), inset 0 0.5px 0 rgba(255,255,255,0.25);
      }

      /* Spatial Glass Bento Card */
      .spatial-panel {
        background: var(--glass-surface);
        border: 0.5px solid var(--border-specular);
        border-radius: var(--radius-xl);
        padding: 28px;
        backdrop-filter: saturate(190%) blur(35px);
        -webkit-backdrop-filter: saturate(190%) blur(35px);
        box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55), inset 0 0.5px 0 rgba(255, 255, 255, 0.15);
        margin-bottom: 32px;
      }

      .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 22px;
      }

      .panel-title {
        font-size: 1.35rem;
        font-weight: 700;
        letter-spacing: -0.02em;
      }

      /* Spotlight Search Input */
      .spotlight-bar {
        display: flex;
        align-items: center;
        gap: 12px;
        background: rgba(0, 0, 0, 0.35);
        border: 0.5px solid var(--border-specular);
        border-radius: var(--radius-lg);
        padding: 6px 8px 6px 18px;
        margin-bottom: 22px;
        transition: all 0.25s var(--spring);
      }
      .spotlight-bar:focus-within {
        border-color: rgba(255, 255, 255, 0.35);
        background: rgba(0, 0, 0, 0.5);
        box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.06);
      }

      .spotlight-input {
        flex: 1;
        background: transparent;
        border: none;
        color: var(--text-primary);
        font-family: var(--font-sans);
        font-size: 15px;
        outline: none;
      }
      .spotlight-input::placeholder {
        color: var(--text-tertiary);
      }

      .kbd-hint {
        font-family: var(--font-mono);
        font-size: 11px;
        color: var(--text-tertiary);
        padding: 3px 7px;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.06);
        border: 0.5px solid var(--border-specular);
      }

      /* Subtle Apple Music Spectrum Canvas */
      .spectrum-strip {
        height: 52px;
        width: 100%;
        background: rgba(0, 0, 0, 0.28);
        border: 0.5px solid var(--border-specular);
        border-radius: var(--radius-md);
        margin-bottom: 22px;
        overflow: hidden;
        position: relative;
      }
      #vis-canvas {
        width: 100%;
        height: 100%;
        display: block;
      }

      /* Apple Music Track List / Grid */
      .track-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 12px;
        max-height: 520px;
        overflow-y: auto;
        padding-right: 4px;
      }
      .track-grid::-webkit-scrollbar { width: 5px; }
      .track-grid::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 99px; }

      .track-cell {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 10px 12px;
        background: rgba(255, 255, 255, 0.03);
        border: 0.5px solid rgba(255, 255, 255, 0.06);
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: all 0.22s var(--spring);
        position: relative;
      }
      .track-cell:hover {
        background: rgba(255, 255, 255, 0.09);
        border-color: var(--border-specular);
        transform: scale(1.012);
      }
      .track-cell.playing {
        background: rgba(250, 36, 60, 0.12);
        border-color: rgba(250, 36, 60, 0.4);
      }

      .art-wrap {
        position: relative;
        width: 52px;
        height: 52px;
        border-radius: 10px;
        overflow: hidden;
        flex-shrink: 0;
        background: #1c1c1e;
        box-shadow: 0 4px 12px rgba(0,0,0,0.35);
      }
      .art-wrap img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .art-play-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0,0,0,0.45);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.2s;
      }
      .track-cell:hover .art-play-overlay,
      .track-cell.playing .art-play-overlay {
        opacity: 1;
      }

      .track-meta {
        flex: 1;
        min-width: 0;
      }
      .track-title {
        font-size: 14px;
        font-weight: 600;
        letter-spacing: -0.01em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: var(--text-primary);
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .explicit-badge {
        font-size: 9px;
        font-weight: 700;
        padding: 1px 4px;
        border-radius: 3px;
        background: rgba(255,255,255,0.18);
        color: var(--text-primary);
      }
      .track-sub {
        font-size: 12px;
        color: var(--text-secondary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-top: 2px;
      }

      .lossless-badge {
        font-family: var(--font-mono);
        font-size: 10px;
        font-weight: 600;
        padding: 3px 7px;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.07);
        border: 0.5px solid var(--border-specular);
        color: var(--text-secondary);
        flex-shrink: 0;
      }

      /* Floating macOS / visionOS Now Playing Pill Dock */
      .apple-dock {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: calc(100% - 32px);
        max-width: 920px;
        background: rgba(28, 28, 32, 0.78);
        backdrop-filter: saturate(200%) blur(40px);
        -webkit-backdrop-filter: saturate(200%) blur(40px);
        border: 0.5px solid rgba(255, 255, 255, 0.18);
        border-radius: 22px;
        padding: 12px 20px;
        box-shadow: 0 24px 60px rgba(0, 0, 0, 0.75), inset 0 0.5px 0 rgba(255, 255, 255, 0.22);
        z-index: 1000;
        display: none;
        flex-direction: column;
        gap: 8px;
        transition: all 0.35s var(--spring);
      }

      .dock-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
      }

      .dock-track {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 30%;
        min-width: 0;
      }

      .dock-art {
        width: 46px;
        height: 46px;
        border-radius: 10px;
        object-fit: cover;
        box-shadow: 0 4px 14px rgba(0,0,0,0.4);
        background: #2c2c2e;
      }

      .dock-text { min-width: 0; }
      .dock-title {
        font-size: 14px;
        font-weight: 600;
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

      .dock-transport {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .icon-btn {
        background: transparent;
        border: none;
        color: var(--text-primary);
        cursor: pointer;
        padding: 7px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.85;
        transition: all 0.2s var(--spring);
      }
      .icon-btn:hover {
        opacity: 1;
        background: rgba(255, 255, 255, 0.1);
        transform: scale(1.08);
      }

      .play-circle {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #ffffff;
        color: #000000;
        opacity: 1;
        box-shadow: 0 4px 16px rgba(255, 255, 255, 0.25);
      }
      .play-circle:hover {
        background: #f5f5f7;
        transform: scale(1.08);
      }

      .dock-actions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 10px;
        width: 30%;
      }

      .vol-slider {
        width: 75px;
        -webkit-appearance: none;
        height: 4px;
        border-radius: 99px;
        background: rgba(255, 255, 255, 0.2);
        outline: none;
      }
      .vol-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background: #fff;
        cursor: pointer;
      }

      .scrubber-row {
        display: flex;
        align-items: center;
        gap: 10px;
        font-family: var(--font-mono);
        font-size: 11px;
        color: var(--text-tertiary);
      }

      .apple-scrubber {
        flex: 1;
        -webkit-appearance: none;
        height: 4px;
        border-radius: 99px;
        background: rgba(255, 255, 255, 0.16);
        outline: none;
        cursor: pointer;
        transition: height 0.15s;
      }
      .apple-scrubber:hover { height: 6px; }
      .apple-scrubber::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #ffffff;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
        cursor: pointer;
      }

      /* Apple Music Sing Fullscreen Lyrics Modal */
      .sing-modal {
        position: fixed;
        inset: 0;
        background: rgba(10, 10, 14, 0.86);
        backdrop-filter: saturate(200%) blur(50px);
        -webkit-backdrop-filter: saturate(200%) blur(50px);
        z-index: 2000;
        display: none;
        flex-direction: column;
        padding: 36px 28px;
        animation: modalIn 0.35s var(--spring);
      }
      .sing-modal.open { display: flex; }

      @keyframes modalIn {
        from { opacity: 0; transform: scale(0.97); }
        to { opacity: 1; transform: scale(1); }
      }

      .sing-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 820px;
        margin: 0 auto 24px;
        width: 100%;
      }

      .sing-scroll {
        max-width: 820px;
        margin: 0 auto;
        width: 100%;
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 26px;
        padding: 60px 12px 140px;
        mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
        -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
      }
      .sing-scroll::-webkit-scrollbar { display: none; }

      .lyric-line {
        font-size: clamp(1.4rem, 3vw, 2rem);
        font-weight: 700;
        letter-spacing: -0.02em;
        color: rgba(255, 255, 255, 0.28);
        filter: blur(1.2px);
        transform-origin: left center;
        transition: all 0.45s var(--spring);
        cursor: pointer;
        line-height: 1.25;
      }
      .lyric-line:hover {
        color: rgba(255, 255, 255, 0.6);
        filter: blur(0px);
      }
      .lyric-line.active {
        color: #ffffff;
        filter: blur(0px);
        transform: scale(1.05);
        text-shadow: 0 8px 30px rgba(255, 255, 255, 0.35);
      }

      /* API Endpoint Rows */
      .api-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .api-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 18px;
        background: rgba(255, 255, 255, 0.03);
        border: 0.5px solid var(--border-specular);
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: all 0.2s var(--spring);
      }
      .api-item:hover {
        background: rgba(255, 255, 255, 0.07);
        border-color: var(--border-highlight);
      }
      .api-method {
        font-family: var(--font-mono);
        font-size: 11px;
        font-weight: 600;
        color: var(--apple-green);
        background: rgba(48, 209, 88, 0.12);
        padding: 4px 8px;
        border-radius: 6px;
        margin-right: 12px;
      }

      /* Dynamic Island Toast */
      .island-toast {
        position: fixed;
        top: 16px;
        left: 50%;
        transform: translateX(-50%) translateY(-80px) scale(0.9);
        background: rgba(20, 20, 22, 0.92);
        backdrop-filter: blur(25px);
        color: #fff;
        border: 0.5px solid rgba(255, 255, 255, 0.2);
        padding: 10px 20px;
        border-radius: 999px;
        font-size: 13px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 14px 35px rgba(0,0,0,0.6);
        opacity: 0;
        transition: all 0.35s var(--spring);
        z-index: 4000;
      }
      .island-toast.show {
        transform: translateX(-50%) translateY(0) scale(1);
        opacity: 1;
      }

      @media (max-width: 700px) {
        .dock-actions .vol-slider { display: none; }
        .dock-track { width: 45%; }
      }
    </style>
  </head>
  <body>
    <!-- Dynamic Spatial Mesh Backdrop -->
    <div class="spatial-canvas">
      <div id="artwork-blur-bg"></div>
    </div>

    <!-- Dynamic Island Toast Notification -->
    <div id="toast" class="island-toast">
      <span class="status-dot"></span>
      <span id="toast-text">Copied to clipboard</span>
    </div>

    <!-- Sticky Apple Glass Navbar -->
    <nav class="apple-nav">
      <div class="nav-brand">
        <svg width="18" height="18" fill="var(--apple-red)" viewBox="0 0 16 16">
          <path d="M9 13c0 1.105-1.12 2-2.5 2S4 14.105 4 13s1.12-2 2.5-2 2.5.895 2.5 2zm6-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2z"/>
          <path fill-rule="evenodd" d="M14 11V2h1v9h-1zM6 3v10H5V3h1z"/>
          <path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4V2.905z"/>
        </svg>
        <span>Neon Music</span>
        <span class="lossless-pill">
          <span class="status-dot"></span>
          Lossless Edge
        </span>
      </div>

      <div class="quality-selector" title="Select Stream Bitrate">
        <button class="q-btn active" onclick="setQuality('320', this)">320k Master</button>
        <button class="q-btn" onclick="setQuality('160', this)">160k High</button>
        <button class="q-btn" onclick="setQuality('96', this)">96k Eco</button>
      </div>
    </nav>

    <div class="container">
      <!-- Apple Keynote Hero -->
      <header>
        <div class="eyebrow">Spatial Audio Gateway • v1.3</div>
        <h1>Pure sound. Zero friction.</h1>
        <p class="hero-sub">Zero-allocation DES deciphering, direct 320kbps AAC CDN streaming, and real-time synchronized lyrics for Neon Song and Stremio.</p>

        <div class="hero-actions">
          <button class="btn btn-apple-white" onclick="copyAddonUrl()">
            <svg width="15" height="15" fill="currentColor" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
            Copy Neon Song Module URL
          </button>
          <a class="btn btn-apple-glass" id="stremio-link" href="#">
            <svg width="15" height="15" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/></svg>
            Install on Stremio
          </a>
        </div>
      </header>

      <!-- Apple Segmented Control -->
      <div class="segmented-wrap">
        <div class="segmented-control">
          <button class="seg-btn active" id="tab-trending" onclick="switchTab('trending')">Top Charts</button>
          <button class="seg-btn" id="tab-search" onclick="switchTab('search')">Search Catalog</button>
          <button class="seg-btn" id="tab-docs" onclick="switchTab('docs')">Developer API</button>
        </div>
      </div>

      <!-- View 1: Top Charts -->
      <section id="view-trending" class="spatial-panel">
        <div class="panel-header">
          <div class="panel-title">Top Trending Now</div>
          <span class="lossless-badge" id="trending-badge">AAC 320 KBPS</span>
        </div>
        <div id="trending-grid" class="track-grid">
          <div style="grid-column: 1/-1; text-align:center; padding: 48px; color: var(--text-tertiary);">
            Loading Top Charts from Edge CDN...
          </div>
        </div>
      </section>

      <!-- View 2: Search & Live Spectrum -->
      <section id="view-search" class="spatial-panel" style="display:none;">
        <div class="spotlight-bar">
          <svg width="16" height="16" fill="var(--text-tertiary)" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>
          <input type="text" id="search-input" class="spotlight-input" placeholder="Search songs, artists, or albums..." onkeydown="if(event.key==='Enter') executeSearch()" />
          <span class="kbd-hint">⌘K</span>
          <button class="btn btn-apple-white" style="padding: 7px 16px; font-size: 13px;" onclick="executeSearch()">Search</button>
        </div>

        <div class="spectrum-strip">
          <canvas id="vis-canvas"></canvas>
        </div>

        <div id="search-results-grid" class="track-grid">
          <div style="grid-column: 1/-1; text-align:center; padding: 48px; color: var(--text-tertiary);">
            Search millions of tracks in master 320kbps AAC quality.
          </div>
        </div>
      </section>

      <!-- View 3: Developer API & Telemetry -->
      <section id="view-docs" class="spatial-panel" style="display:none;">
        <div class="panel-header">
          <div class="panel-title">Protocol Endpoints</div>
          <span class="lossless-badge">EDGE CACHED • 24H TTL</span>
        </div>

        <div class="api-list">
          <div class="api-item" onclick="copyText(window.location.origin + '/manifest.json')">
            <div><span class="api-method">GET</span><strong>/manifest.json</strong></div>
            <span style="color:var(--text-secondary); font-size:13px;">Universal Neon Song & Stremio Manifest</span>
          </div>
          <div class="api-item" onclick="copyText(window.location.origin + '/search?q=Ado&quality=320')">
            <div><span class="api-method">GET</span><strong>/search?q={query}&quality=320</strong></div>
            <span style="color:var(--text-secondary); font-size:13px;">High-speed catalog search with pre-decrypted URLs</span>
          </div>
          <div class="api-item" onclick="copyText(window.location.origin + '/trending?quality=320')">
            <div><span class="api-method">GET</span><strong>/trending?quality=320</strong></div>
            <span style="color:var(--text-secondary); font-size:13px;">Real-time viral & trending chart feed</span>
          </div>
          <div class="api-item" onclick="copyText(window.location.origin + '/lyrics/:id')">
            <div><span class="api-method">GET</span><strong>/lyrics/:id</strong></div>
            <span style="color:var(--text-secondary); font-size:13px;">Time-synced LRC karaoke lyrics resolver</span>
          </div>
          <div class="api-item" onclick="copyText(window.location.origin + '/download/:id?quality=320')">
            <div><span class="api-method">GET</span><strong>/download/:id</strong></div>
            <span style="color:var(--text-secondary); font-size:13px;">Direct M4A attachment stream download</span>
          </div>
          <div class="api-item" onclick="copyText(window.location.origin + '/health')">
            <div><span class="api-method">GET</span><strong>/health</strong></div>
            <span style="color:var(--text-secondary); font-size:13px;">Engine status & decipher telemetry</span>
          </div>
        </div>
      </section>
    </div>

    <!-- Floating Apple Now Playing Bar -->
    <div id="player-dock" class="apple-dock">
      <div class="dock-row">
        <div class="dock-track">
          <img id="dock-art" class="dock-art" src="" alt="Cover" />
          <div class="dock-text">
            <div id="dock-title" class="dock-title">Not Playing</div>
            <div id="dock-artist" class="dock-artist">—</div>
          </div>
        </div>

        <div class="dock-transport">
          <button class="icon-btn" onclick="skipTrack(-1)" title="Previous">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M4 4a.5.5 0 0 1 1 0v3.248l6.267-3.636c.54-.313 1.233.066 1.233.69v7.396c0 .624-.692 1.003-1.233.69L5 8.752V12a.5.5 0 0 1-1 0V4z"/></svg>
          </button>
          <button class="icon-btn play-circle" onclick="togglePlay()" title="Play/Pause (Space)">
            <svg id="play-icon" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg>
            <svg id="pause-icon" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" style="display:none;"><path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/></svg>
          </button>
          <button class="icon-btn" onclick="skipTrack(1)" title="Next">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M12.5 4a.5.5 0 0 0-1 0v3.248L5.233 3.612C4.693 3.3 4 3.678 4 4.302v7.396c0 .624.693 1.003 1.233.69L11.5 8.752V12a.5.5 0 0 0 1 0V4z"/></svg>
          </button>
        </div>

        <div class="dock-actions">
          <span class="lossless-badge" id="dock-bitrate">320K AAC</span>
          <input type="range" class="vol-slider" min="0" max="1" step="0.02" value="1" oninput="setVolume(this.value)" title="Volume" />
          <button class="icon-btn" onclick="toggleLyricsModal()" title="Apple Music Sing Lyrics (L)">
            <svg width="17" height="17" fill="currentColor" viewBox="0 0 16 16"><path d="M4.5 11a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h14a.5.5 0 0 1 0 1H1a.5.5 0 0 1-.5-.5z"/></svg>
          </button>
          <a id="dock-download-btn" class="icon-btn" href="#" target="_blank" title="Download Track">
            <svg width="17" height="17" fill="currentColor" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg>
          </a>
        </div>
      </div>

      <div class="scrubber-row">
        <span id="curr-time">0:00</span>
        <input type="range" id="scrubber" class="apple-scrubber" min="0" max="100" value="0" oninput="onScrub(this.value)" />
        <span id="dur-time">0:00</span>
      </div>
    </div>

    <!-- Apple Music Sing Fullscreen Lyrics View -->
    <div id="lyrics-modal" class="sing-modal">
      <div class="sing-header">
        <div style="display:flex; align-items:center; gap:14px;">
          <img id="sing-art" src="" style="width:52px; height:52px; border-radius:12px; object-fit:cover;" alt="" />
          <div>
            <h2 id="lyrics-song-title" style="font-size:1.35rem; font-weight:700; letter-spacing:-0.02em;">Lyrics</h2>
            <p id="lyrics-artist-name" style="color:var(--text-secondary); font-size:0.95rem;">Artist</p>
          </div>
        </div>
        <button class="btn btn-apple-glass" onclick="toggleLyricsModal()">Done</button>
      </div>
      <div id="lyrics-content" class="sing-scroll"></div>
    </div>

    <audio id="audio-core" crossorigin="anonymous"></audio>

    <script>
      let currentTrackList = [];
      let currentIndex = -1;
      let activeTrackId = null;
      let selectedQuality = '320';
      let audioCtx = null;
      let analyser = null;
      let parsedLyrics = [];

      const audio = document.getElementById('audio-core');
      const origin = window.location.origin;

      document.getElementById('stremio-link').href = 'stremio://' + window.location.host + '/manifest.json';

      loadTrending();

      // Global Apple Keyboard Shortcuts
      window.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          switchTab('search');
          document.getElementById('search-input').focus();
        } else if (e.target.tagName !== 'INPUT') {
          if (e.code === 'Space' && currentIndex !== -1) {
            e.preventDefault();
            togglePlay();
          } else if (e.key.toLowerCase() === 'l' && currentIndex !== -1) {
            toggleLyricsModal();
          }
        }
      });

      function setQuality(q, btn) {
        selectedQuality = q;
        document.querySelectorAll('.q-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('trending-badge').textContent = 'AAC ' + q + ' KBPS';
        showToast('Audio quality set to ' + q + 'kbps AAC');
      }

      function switchTab(tab) {
        ['trending', 'search', 'docs'].forEach(t => {
          document.getElementById('view-' + t).style.display = (t === tab ? 'block' : 'none');
          document.getElementById('tab-' + t).classList.toggle('active', t === tab);
        });
        if (tab === 'search') setupVisualizer();
      }

      async function loadTrending() {
        try {
          const res = await fetch('/trending?quality=' + selectedQuality);
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
        box.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding: 48px; color:var(--text-secondary);">Searching catalog...</div>';

        try {
          const res = await fetch('/search?q=' + encodeURIComponent(q) + '&quality=' + selectedQuality);
          const data = await res.json();
          currentTrackList = data.tracks || [];
          renderGrid('search-results-grid', currentTrackList);
        } catch (err) {
          box.innerHTML = '<div style="color:var(--apple-red); text-align:center; grid-column: 1/-1;">Search failed: ' + err.message + '</div>';
        }
      }

      function renderGrid(containerId, tracks) {
        const box = document.getElementById(containerId);
        if (!tracks || !tracks.length) {
          box.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding: 48px; color:var(--text-tertiary);">No tracks found</div>';
          return;
        }

        box.innerHTML = tracks.map((t, idx) => \`
          <div class="track-cell \${t.id === activeTrackId ? 'playing' : ''}" id="cell-\${t.id}" onclick="playTrackByIndex(\${idx})">
            <div class="art-wrap">
              <img src="\${t.artworkURL || ''}" alt="cover" loading="lazy" />
              <div class="art-play-overlay">
                <svg width="20" height="20" fill="#fff" viewBox="0 0 16 16"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg>
              </div>
            </div>
            <div class="track-meta">
              <div class="track-title">
                <span>\${escapeHtml(t.title)}</span>
                \${t.explicit ? '<span class="explicit-badge">E</span>' : ''}
              </div>
              <div class="track-sub">\${escapeHtml(t.artist)} • \${formatTime(t.duration)}</div>
            </div>
            <span class="lossless-badge">\${t.quality}</span>
          </div>
        \`).join('');
      }

      async function playTrackByIndex(idx) {
        if (!currentTrackList[idx]) return;
        currentIndex = idx;
        const track = currentTrackList[idx];
        activeTrackId = track.id;

        document.querySelectorAll('.track-cell').forEach(el => el.classList.remove('playing'));
        const activeCell = document.getElementById('cell-' + track.id);
        if (activeCell) activeCell.classList.add('playing');

        document.getElementById('player-dock').style.display = 'flex';
        document.getElementById('dock-title').textContent = track.title;
        document.getElementById('dock-artist').textContent = track.artist;
        document.getElementById('dock-art').src = track.artworkURL || '';
        document.getElementById('sing-art').src = track.artworkURL || '';
        document.getElementById('dock-download-btn').href = '/download/' + track.id + '?quality=' + selectedQuality;

        // Update Apple Music Dynamic Mesh Background
        const bg = document.getElementById('artwork-blur-bg');
        if (track.artworkURL) {
          bg.style.backgroundImage = 'url(' + track.artworkURL + ')';
          bg.style.opacity = '1';
        }

        try {
          // Use pre-decrypted streamURL from search if matching quality, otherwise resolve fresh
          let streamUrl = track.streamURL;
          if (!streamUrl || !streamUrl.includes('_' + selectedQuality)) {
            const res = await fetch('/stream/' + track.id + '?quality=' + selectedQuality);
            const stream = await res.json();
            streamUrl = stream.url;
          }
          if (!streamUrl) throw new Error('Stream unavailable');

          audio.src = streamUrl;
          audio.play();
          document.getElementById('dock-bitrate').textContent = selectedQuality + 'K AAC';
          setupVisualizer();
          loadLyrics(track);
        } catch (err) {
          showToast('Playback error: ' + err.message);
        }
      }

      function togglePlay() {
        if (audio.paused) audio.play();
        else audio.pause();
      }

      function setVolume(val) {
        audio.volume = parseFloat(val);
      }

      function skipTrack(dir) {
        if (!currentTrackList.length) return;
        let next = currentIndex + dir;
        if (next < 0) next = currentTrackList.length - 1;
        if (next >= currentTrackList.length) next = 0;
        playTrackByIndex(next);
      }

      audio.onended = () => skipTrack(1);

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
            const barWidth = (canvas.width / bufferLength) * 1.4;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
              const barHeight = (dataArray[i] / 255) * canvas.height * 0.85;
              ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
              ctx.beginPath();
              ctx.roundRect(x, canvas.height - barHeight, Math.max(2, barWidth - 3), barHeight, 3);
              ctx.fill();
              x += barWidth;
            }
          }
          draw();
        } catch (e) {}
      }

      async function loadLyrics(track) {
        parsedLyrics = [];
        document.getElementById('lyrics-song-title').textContent = track.title;
        document.getElementById('lyrics-artist-name').textContent = track.artist;
        const box = document.getElementById('lyrics-content');
        box.innerHTML = '<div style="color:var(--text-tertiary); font-size:1.2rem;">Loading Apple Music Sing lyrics...</div>';

        try {
          const res = await fetch('/lyrics/' + track.id);
          const data = await res.json();
          if (data.syncedLyrics) {
            parseLrc(data.syncedLyrics);
            renderLyrics();
          } else if (data.plainLyrics) {
            box.innerHTML = '<div style="font-size:1.3rem; line-height:1.9; color:var(--text-secondary); white-space:pre-wrap;">' + escapeHtml(data.plainLyrics) + '</div>';
          } else {
            box.innerHTML = '<div style="color:var(--text-tertiary); font-size:1.2rem;">Lyrics aren’t available for this song.</div>';
          }
        } catch {
          box.innerHTML = '<div style="color:var(--text-tertiary); font-size:1.2rem;">Lyrics unavailable.</div>';
        }
      }

      function parseLrc(lrcText) {
        const lines = lrcText.split('\\n');
        parsedLyrics = [];
        const timeRegex = /\\[(\\d+):(\\d+(?:\\.\\d+)?)\\]/;

        for (const line of lines) {
          const match = line.match(timeRegex);
          if (match) {
            const totalSec = parseFloat(match[1]) * 60 + parseFloat(match[2]);
            const text = line.replace(timeRegex, '').trim();
            if (text) parsedLyrics.push({ time: totalSec, text });
          }
        }
      }

      function renderLyrics() {
        const box = document.getElementById('lyrics-content');
        box.innerHTML = parsedLyrics.map((item, idx) => \`
          <div id="line-\${idx}" class="lyric-line" onclick="audio.currentTime = \${item.time}">\${escapeHtml(item.text)}</div>
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
        document.getElementById('toast-text').textContent = text;
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 2400);
      }

      function copyAddonUrl() {
        navigator.clipboard.writeText(origin + '/manifest.json').then(() => {
          showToast('Module URL copied for Neon Song');
        });
      }

      function copyText(str) {
        navigator.clipboard.writeText(str).then(() => {
          showToast('Copied endpoint to clipboard');
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
          tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
      }
    </script>
  </body>
</html>`;
}
