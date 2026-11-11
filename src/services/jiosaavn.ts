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
 * Search JioSaavn catalog by query with intelligent multi-entity resolution.
 * If query matches an artist (e.g. Ado, 9lane/9lana, Arijit Singh), the artist's
 * top hit tracks are fetched and prioritized at the top of results.
 */
export async function searchTracks(
  query: string,
  quality: AudioQuality = '320',
  limit: number = 25,
  page: number = 1
): Promise<NeonSongTrack[]> {
  const cleanQ = query.trim();
  if (!cleanQ) return [];

  // Handle common phonetic/spelling aliases
  const normalizedQuery = cleanQ.toLowerCase().replace(/[^a-z0-9]/g, '') === '9lane' ? '9lana' : cleanQ;
  const qLower = normalizedQuery.toLowerCase();

  // 1. Prepare song search URL
  const trackUrl = new URL(JIOSAAVN_ENDPOINT);
  trackUrl.searchParams.set('__call', 'search.getResults');
  trackUrl.searchParams.set('_format', 'json');
  trackUrl.searchParams.set('_marker', '0');
  trackUrl.searchParams.set('api_version', '4');
  trackUrl.searchParams.set('ctx', 'web6dot0');
  trackUrl.searchParams.set('p', String(page));
  trackUrl.searchParams.set('n', String(limit));
  trackUrl.searchParams.set('q', normalizedQuery);

  // 2. Prepare artist search URL (first page only for artist hits)
  const artistUrl = new URL(JIOSAAVN_ENDPOINT);
  artistUrl.searchParams.set('__call', 'search.getArtistResults');
  artistUrl.searchParams.set('_format', 'json');
  artistUrl.searchParams.set('_marker', '0');
  artistUrl.searchParams.set('api_version', '4');
  artistUrl.searchParams.set('ctx', 'web6dot0');
  artistUrl.searchParams.set('p', '1');
  artistUrl.searchParams.set('n', '10');
  artistUrl.searchParams.set('q', normalizedQuery);

  const [trackRes, artistRes] = await Promise.all([
    fetch(trackUrl.toString(), {
      headers: { 'User-Agent': getRandomUserAgent(), Accept: 'application/json, text/plain, */*' },
    }).then(r => (r.ok ? r.json() : null)).catch(() => null),
    page === 1
      ? fetch(artistUrl.toString(), {
          headers: { 'User-Agent': getRandomUserAgent(), Accept: 'application/json, text/plain, */*' },
        }).then(r => (r.ok ? r.json() : null)).catch(() => null)
      : Promise.resolve(null),
  ]);

  const rawSongResults: JioSaavnSongRaw[] = (trackRes as any)?.results || [];
  const artists: Array<{ id: string; name?: string; title?: string }> = (artistRes as any)?.results || [];

  let artistTopSongs: JioSaavnSongRaw[] = [];
  if (artists.length > 0) {
    // Prioritize exact artist match, then prefix match
    let matchedArtist = artists.find(a => (a.name || a.title || '').trim().toLowerCase() === qLower);
    if (!matchedArtist) {
      matchedArtist = artists.find(a => (a.name || a.title || '').trim().toLowerCase().startsWith(qLower));
    }

    if (matchedArtist?.id) {
      const pageUrl = new URL(JIOSAAVN_ENDPOINT);
      pageUrl.searchParams.set('__call', 'artist.getArtistPageDetails');
      pageUrl.searchParams.set('_format', 'json');
      pageUrl.searchParams.set('_marker', '0');
      pageUrl.searchParams.set('api_version', '4');
      pageUrl.searchParams.set('ctx', 'web6dot0');
      pageUrl.searchParams.set('artistId', matchedArtist.id);

      try {
        const pageRes = await fetch(pageUrl.toString(), {
          headers: { 'User-Agent': getRandomUserAgent(), Accept: 'application/json, text/plain, */*' },
        }).then(r => (r.ok ? r.json() : null));
        if (pageRes && Array.isArray(pageRes.topSongs)) {
          artistTopSongs = pageRes.topSongs;
        }
      } catch {
        // Fallback to song results
      }
    }
  }

  // Combine artist top songs first, followed by general song results, deduplicated
  const seenIds = new Set<string>();
  const combinedTracks: NeonSongTrack[] = [];

  for (const raw of [...artistTopSongs, ...rawSongResults]) {
    if (raw && raw.id && !seenIds.has(raw.id)) {
      seenIds.add(raw.id);
      combinedTracks.push(formatTrack(raw, quality));
    }
  }

  return combinedTracks;
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

/**
 * Retrieve full song details by ID.
 */
export async function getSongDetails(songId: string, quality: AudioQuality = '320'): Promise<NeonSongTrack | null> {
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

  if (!res.ok) return null;
  const rawData = (await res.json()) as Record<string, any>;
  let song: JioSaavnSongRaw | null = null;
  if (Array.isArray(rawData?.songs) && rawData.songs.length > 0) {
    song = rawData.songs[0];
  } else if (rawData?.[cleanId]) {
    song = rawData[cleanId];
  }
  return song ? formatTrack(song, quality) : null;
}

/**
 * Fetch top trending/viral tracks for the home feed.
 */
export async function getTrendingTracks(quality: AudioQuality = '320'): Promise<NeonSongTrack[]> {
  try {
    const url = new URL(JIOSAAVN_ENDPOINT);
    url.searchParams.set('__call', 'playlist.getDetails');
    url.searchParams.set('_format', 'json');
    url.searchParams.set('_marker', '0');
    url.searchParams.set('api_version', '4');
    url.searchParams.set('ctx', 'web6dot0');
    url.searchParams.set('listid', '902306817');

    const res = await fetch(url.toString(), {
      headers: {
        'User-Agent': getRandomUserAgent(),
        Accept: 'application/json, text/plain, */*',
      },
    });

    if (res.ok) {
      const data = (await res.json()) as any;
      const list = data?.list || [];
      if (Array.isArray(list) && list.length > 0) {
        return list.map((item: JioSaavnSongRaw) => formatTrack(item, quality));
      }
    }
  } catch (err) {
    console.error('Failed to fetch trending playlist, fallback to search:', err);
  }

  return searchTracks('Trending Songs', quality, 20);
}
