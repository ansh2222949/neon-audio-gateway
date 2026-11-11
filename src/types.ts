/**
 * Data contracts and type definitions for Neon Music Addon.
 * Fully compatible with Neon Song and Stremio ecosystems.
 */

export type AudioQuality = '320' | '160' | '96';

export interface NeonSongTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  format: 'mp4' | 'm4a' | 'aac' | 'flac';
  quality: '320kbps' | '160kbps' | '96kbps';
  audioQuality: string;
  sampleRate: number;
  artworkURL?: string;
  streamURL?: string;
  year?: string;
  language?: string;
  explicit?: boolean;
}

export interface NeonStreamResponse {
  url: string;
  directUrl: string;
  streamUrl: string;
  downloadUrl: string;
  format: 'mp4' | 'm4a';
  codec: 'mp4a' | 'aac';
  quality: string;
  audioQuality: string;
  bitrate: number;
  sampleRate: number;
  bitDepth?: number;
  encrypted: boolean;
  contentLength?: number;
}

export interface StremioMeta {
  id: string;
  type: 'music';
  name: string;
  poster: string;
  posterShape?: 'square' | 'poster';
  banner?: string;
  description: string;
  releaseInfo?: string;
}

export interface StremioStream {
  name: string;
  title: string;
  url: string;
  behaviorHints?: {
    notWebReady?: boolean;
    bingeGroup?: string;
  };
}

export interface JioSaavnArtist {
  id?: string;
  name: string;
  role?: string;
  type?: string;
}

export interface JioSaavnSongRaw {
  id: string;
  title: string;
  subtitle?: string;
  header_desc?: string;
  type?: string;
  perma_url?: string;
  image?: string;
  language?: string;
  year?: string;
  play_count?: string;
  explicit_content?: string;
  list_count?: string;
  list_type?: string;
  list?: string;
  more_info?: {
    music?: string;
    album?: string;
    album_id?: string;
    label?: string;
    origin?: string;
    is_dolby_content?: boolean;
    encrypted_media_url?: string;
    encrypted_cache_url?: string;
    duration?: string;
    artistMap?: {
      primary_artists?: JioSaavnArtist[];
      featured_artists?: JioSaavnArtist[];
      artists?: JioSaavnArtist[];
    };
    singers?: string;
    starring?: string;
    release_date?: string;
    has_lyrics?: string;
  };
}

export interface JioSaavnSearchResponse {
  total: number;
  start: number;
  results: JioSaavnSongRaw[];
}

export interface LyricsResponse {
  id?: string;
  trackName: string;
  artistName: string;
  albumName?: string;
  duration?: number;
  syncedLyrics?: string;
  plainLyrics?: string;
  hasSynced: boolean;
}

export interface TrendingPlaylist {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  tracks: NeonSongTrack[];
}
