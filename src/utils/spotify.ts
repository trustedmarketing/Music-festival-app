// Spotify integration utility for onboarding personalization
// Uses Spotify Web API to fetch user's top artists
// Note: expo-auth-session and expo-web-browser must be installed
// separately to enable Spotify OAuth: npm install expo-auth-session expo-web-browser

import { Platform } from 'react-native';

// Spotify API configuration
// In production, these would come from environment variables
const SPOTIFY_CLIENT_ID = 'YOUR_SPOTIFY_CLIENT_ID';

export interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
  popularity: number;
  imageUrl?: string;
}

export async function fetchTopArtists(accessToken: string): Promise<SpotifyArtist[]> {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/top/artists?limit=20&time_range=medium_term', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) throw new Error('Failed to fetch top artists');

    const data = await response.json();
    return data.items.map((item: any) => ({
      id: item.id,
      name: item.name,
      genres: item.genres,
      popularity: item.popularity,
      imageUrl: item.images?.[0]?.url,
    }));
  } catch (error) {
    console.error('Error fetching Spotify top artists:', error);
    return [];
  }
}

// Map Spotify genres to our game genres for personalization
export function mapSpotifyGenresToGameGenres(spotifyGenres: string[]): string[] {
  const genreMap: Record<string, string[]> = {
    'Pop': ['pop', 'synth-pop', 'electropop', 'dance pop', 'indie pop'],
    'Hip-Hop': ['hip hop', 'rap', 'trap', 'drill'],
    'R&B': ['r&b', 'soul', 'neo soul', 'contemporary r&b'],
    'Rock': ['rock', 'alt-rock', 'classic rock', 'hard rock', 'garage rock'],
    'Indie': ['indie', 'indie rock', 'indie pop', 'indie folk', 'dream pop'],
    'Electronic': ['electronic', 'edm', 'house', 'techno', 'ambient'],
    'Reggaeton': ['reggaeton', 'latin', 'latin pop'],
    'Soul': ['soul', 'neo soul', 'motown'],
    'Punk': ['punk', 'punk rock', 'post-punk', 'hardcore'],
    'Psychedelic': ['psychedelic', 'psych rock'],
    'Alt': ['alternative', 'alt-rock', 'experimental'],
    'Dance': ['dance', 'disco', 'house', 'club'],
  };

  const matched = new Set<string>();
  for (const spotifyGenre of spotifyGenres) {
    const lower = spotifyGenre.toLowerCase();
    for (const [gameGenre, keywords] of Object.entries(genreMap)) {
      if (keywords.some(k => lower.includes(k))) {
        matched.add(gameGenre);
      }
    }
  }
  return Array.from(matched);
}

export function isSpotifyConfigured(): boolean {
  return SPOTIFY_CLIENT_ID !== 'YOUR_SPOTIFY_CLIENT_ID' && Platform.OS !== 'web';
}
