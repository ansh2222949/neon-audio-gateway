import { decryptJioSaavnUrl } from '../crypto/des.js';
import type {
  AudioQuality,
  JioSaavnSearchResponse,
  JioSaavnSongRaw,
  NeonSongTrack,
  NeonStreamResponse,
  StremioMeta,
  StremioStream,
} from '../types.js';

const JIOSAAVN_ENDPOINT = 'https://www.jiosaavn.com/api.php';

const BROWSER_USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64; rv:132.0) Gecko/20100101 Firefox/132.0',
];

function getRandomUserAgent(): string {
  return BROWSER_USER_AGENTS[Math.floor(Math.random() * BROWSER_USER_AGENTS.length)];
}

/**
 * Clean HTML entity escapes commonly returned by JioSaavn's JSON API.
 */
export function sanitizeText(input?: string): string {
  if (!input) return '';
  return input
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\\"/g, '"')
    .trim();
}

/**
 * Upscale JioSaavn artwork thumbnails to high-definition 500x500.
 */
export function upscaleArtwork(rawUrl?: string): string {
  if (!rawUrl) return '';
  return rawUrl
    .replace(/(50x50|150x150)/g, '500x500')
    .replace(/^http:\/\//, 'https://')
    .trim();
}

/**
 * Normalizes quality parameter to standard bitrate strings ('320', '160', '96').
 */
export function normalizeQuality(raw?: string): AudioQuality {
  const q = String(raw || '').toLowerCase();
  if (q.includes('96') || q.includes('low') || q.includes('saver')) return '96';
  if (q.includes('160') || q.includes('med')) return '160';
  return '320';
}

/**
 * Transform a raw JioSaavn song object into a rich, normalized NeonSongTrack.
 */
export function formatTrack(raw: JioSaavnSongRaw, requestedQuality: AudioQuality = '320'): NeonSongTrack {
  const more = raw.more_info || {};

  // Extract primary artists
  const primaryList = more.artistMap?.primary_artists?.map((a) => sanitizeText(a.name)).filter(Boolean) || [];
  const artistName = primaryList.length > 0
    ? primaryList.join(', ')
    : sanitizeText(raw.subtitle?.split('-')[0] || more.music || raw.more_info?.singers || 'Unknown Artist');

  const title = sanitizeText(raw.title);
  const album = sanitizeText(more.album || 'Single');
  const durationSec = Math.round(parseFloat(more.duration || '0'));
  const artwork = upscaleArtwork(raw.image);

  let streamURL: string | undefined = undefined;
  if (more.encrypted_media_url) {
    try {
      const decrypted = decryptJioSaavnUrl(more.encrypted_media_url);
      if (decrypted) {
        streamURL = applyQualityToCdnUrl(decrypted, requestedQuality);
      }
    } catch {
      // Ignored: stream will resolve on-demand via /stream/:id
    }
  }

  const qualityLabel: '320kbps' | '160kbps' | '96kbps' = `${requestedQuality}kbps`;

  return {
    id: raw.id,
    title,
    artist: artistName,
    album,
    duration: durationSec,
    format: 'mp4',
    quality: qualityLabel,
    audioQuality: qualityLabel,
    sampleRate: 44100,
    artworkURL: artwork || undefined,
    streamURL,
    year: raw.year || undefined,
    language: raw.language || undefined,
    explicit: raw.explicit_content === '1',
  };
}

/**
 * Adjusts the CDN URL suffix to match the requested bitrate.
 */
export function applyQualityToCdnUrl(baseCdnUrl: string, quality: AudioQuality): string {
  let url = baseCdnUrl.replace(/^http:\/\//, 'https://');
  if (quality === '320') {
    url = url.replace(/_(96|160)\.mp4/i, '_320.mp4');
  } else if (quality === '160') {
    url = url.replace(/_(96|320)\.mp4/i, '_160.mp4');
  } else {
    url = url.replace(/_(160|320)\.mp4/i, '_96.mp4');
  }
  return url;
}

/**
 * Search JioSaavn catalog by query.
 */
export async function searchTracks(
  query: string,
  quality: AudioQuality = '320',
  limit: number = 20,
  page: number = 1
): Promise<NeonSongTrack[]> {
  const cleanQ = query.trim();
  if (!cleanQ) return [];

  const url = new URL(JIOSAAVN_ENDPOINT);
  url.searchParams.set('__call', 'search.getResults');
  url.searchParams.set('_format', 'json');
  url.searchParams.set('_marker', '0');
  url.searchParams.set('api_version', '4');
  url.searchParams.set('ctx', 'web6dot0');
  url.searchParams.set('p', String(page));
  url.searchParams.set('n', String(limit));
  url.searchParams.set('q', cleanQ);

  const res = await fetch(url.toString(), {
    headers: {
      'User-Agent': getRandomUserAgent(),
      Accept: 'application/json, text/plain, */*',
    },
  });

  if (!res.ok) {
    throw new Error(`JioSaavn search failed with HTTP ${res.status}`);
  }

  const data = (await res.json()) as JioSaavnSearchResponse;
  const results = data.results || [];
  return results.map((item) => formatTrack(item, quality));
}

/**
 * Resolve direct audio stream by track ID.
 */
export async function resolveStream(
  songId: string,
  quality: AudioQuality = '320'
): Promise<NeonStreamResponse | null> {
  const cleanId = songId.trim();
  if (!cleanId) return null;

  const url = new URL(JIOSAAVN_ENDPOINT);
  url.searchParams.set('__call', 'song.getDetails');
  url.searchParams.set('_format', 'json');
  url.searchParams.set('_marker', '0');
  url.searchParams.set('api_version', '4');
  url.searchParams.set('ctx', 'web6dot0');
  url.searchParams.set('pids', cleanId);

  const res = await fetch(url.toString(), {
    headers: {
      'User-Agent': getRandomUserAgent(),
      Accept: 'application/json, text/plain, */*',
    },
  });

  if (!res.ok) {
    throw new Error(`JioSaavn song details lookup failed with HTTP ${res.status}`);
  }

  const rawData = (await res.json()) as Record<string, any>;
  let song: JioSaavnSongRaw | null = null;

  if (Array.isArray(rawData?.songs) && rawData.songs.length > 0) {
    song = rawData.songs[0];
  } else if (rawData?.[cleanId]) {
    song = rawData[cleanId];
  } else {
    const firstKey = Object.keys(rawData || {})[0];
    if (firstKey && rawData[firstKey]?.id) {
      song = rawData[firstKey];
    }
  }

  if (!song?.more_info?.encrypted_media_url) {
    return null;
  }

  const decrypted = decryptJioSaavnUrl(song.more_info.encrypted_media_url);
  if (!decrypted) {
    return null;
  }

  const finalStreamUrl = applyQualityToCdnUrl(decrypted, quality);
  const bitrate = quality === '320' ? 320000 : quality === '160' ? 160000 : 96000;

  return {
    url: finalStreamUrl,
    directUrl: finalStreamUrl,
    streamUrl: finalStreamUrl,
    downloadUrl: finalStreamUrl,
    format: 'mp4',
    codec: 'mp4a',
    quality: `${quality}kbps`,
    audioQuality: `${quality}kbps`,
    bitrate,
    sampleRate: 44100,
    encrypted: false,
  };
}

/**
 * Maps a NeonSongTrack to Stremio Meta catalog format.
 */
export function toStremioMeta(track: NeonSongTrack): StremioMeta {
  return {
    id: `neon:${track.id}`,
    type: 'music',
    name: `${track.title} - ${track.artist}`,
    poster: track.artworkURL || '',
    posterShape: 'square',
    description: `Track: ${track.title}\nArtist: ${track.artist}\nAlbum: ${track.album} (${track.year || 'Unknown'})\nQuality: ${track.quality} AAC`,
    releaseInfo: track.year || '',
  };
}

/**
 * Maps a NeonStreamResponse to Stremio Streams format.
 */
export function toStremioStream(stream: NeonStreamResponse, trackTitle?: string): StremioStream {
  return {
    name: `Neon [${stream.quality}]`,
    title: `${trackTitle ? `${trackTitle} • ` : ''}${stream.bitrate / 1000}kbps AAC (Direct CDN)`,
    url: stream.url,
  };
}
