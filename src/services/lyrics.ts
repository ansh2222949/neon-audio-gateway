import type { LyricsResponse } from '../types.js';

const LRCLIB_ENDPOINT = 'https://lrclib.net/api';

/**
 * Fetch synchronized or plain lyrics from LRCLIB.
 */
export async function fetchLyrics(
  trackName: string,
  artistName: string = '',
  durationSec: number = 0
): Promise<LyricsResponse | null> {
  const cleanTrack = trackName
    .replace(/\(.*?\)/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/ft\..*$/i, '')
    .replace(/feat\..*$/i, '')
    .trim();

  const cleanArtist = artistName.split(',')[0].trim();

  const url = new URL(`${LRCLIB_ENDPOINT}/get`);
  url.searchParams.set('track_name', cleanTrack);
  if (cleanArtist) url.searchParams.set('artist_name', cleanArtist);
  if (durationSec > 0) url.searchParams.set('duration', String(Math.round(durationSec)));

  try {
    const res = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'NeonSong-Gateway/1.0 (https://github.com/ansh2222949/neon-audio-gateway)',
        Accept: 'application/json',
      },
    });

    if (res.ok) {
      const data = (await res.json()) as any;
      if (data && (data.syncedLyrics || data.plainLyrics)) {
        return {
          id: String(data.id || ''),
          trackName: data.trackName || trackName,
          artistName: data.artistName || artistName,
          albumName: data.albumName,
          duration: data.duration,
          syncedLyrics: data.syncedLyrics || undefined,
          plainLyrics: data.plainLyrics || undefined,
          hasSynced: !!data.syncedLyrics,
        };
      }
    }

    // Fallback: Try general search
    const searchUrl = new URL(`${LRCLIB_ENDPOINT}/search`);
    searchUrl.searchParams.set('q', `${cleanTrack} ${cleanArtist}`.trim());

    const searchRes = await fetch(searchUrl.toString(), {
      headers: {
        'User-Agent': 'NeonSong-Gateway/1.0',
        Accept: 'application/json',
      },
    });

    if (searchRes.ok) {
      const results = (await searchRes.json()) as any[];
      if (Array.isArray(results) && results.length > 0) {
        const best = results[0];
        return {
          id: String(best.id || ''),
          trackName: best.trackName || trackName,
          artistName: best.artistName || artistName,
          albumName: best.albumName,
          duration: best.duration,
          syncedLyrics: best.syncedLyrics || undefined,
          plainLyrics: best.plainLyrics || undefined,
          hasSynced: !!best.syncedLyrics,
        };
      }
    }
  } catch (err) {
    console.error('Lyrics fetch error:', err);
  }

  return null;
}
