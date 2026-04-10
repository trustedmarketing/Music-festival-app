// Artist catalog with pricing based on popularity tiers
// $5 = legendary/headliner, $4 = major star, $3 = popular, $2 = rising, $1 = indie/emerging
// Each round shows exactly 5 artists: one at each price point ($1-$5)

export interface Artist {
  id: string;
  name: string;
  price: number;
  genre: string;
  imageEmoji: string;
  popularity: number; // 1-100 scale for attendance prediction
  isSurprise?: boolean;
  surpriseRound?: number;
  karaokeSong?: string;
}

// Round 1: One artist per price tier
export const ROUND_1_ARTISTS: Artist[] = [
  { id: 'taylor', name: 'Taylor Swift', price: 5, genre: 'Pop', imageEmoji: '✨', popularity: 99, karaokeSong: 'Shake It Off' },
  { id: 'weeknd', name: 'The Weeknd', price: 4, genre: 'R&B/Pop', imageEmoji: '🌙', popularity: 92, karaokeSong: 'Blinding Lights' },
  { id: 'dua', name: 'Dua Lipa', price: 3, genre: 'Pop/Dance', imageEmoji: '💃', popularity: 85, karaokeSong: 'Levitating' },
  { id: 'tyler', name: 'Tyler, the Creator', price: 2, genre: 'Hip-Hop/Alt', imageEmoji: '🌻', popularity: 78, karaokeSong: 'See You Again' },
  { id: 'raye', name: 'RAYE', price: 1, genre: 'R&B/Pop', imageEmoji: '🎤', popularity: 55, karaokeSong: 'Escapism' },
];

// Round 2
export const ROUND_2_ARTISTS: Artist[] = [
  { id: 'rihanna', name: 'Rihanna', price: 5, genre: 'Pop/R&B', imageEmoji: '💎', popularity: 97, karaokeSong: 'Umbrella' },
  { id: 'post', name: 'Post Malone', price: 4, genre: 'Pop/Hip-Hop', imageEmoji: '🍺', popularity: 89, karaokeSong: 'Circles' },
  { id: 'olivia', name: 'Olivia Rodrigo', price: 3, genre: 'Pop/Rock', imageEmoji: '💜', popularity: 86, karaokeSong: "driver's license" },
  { id: 'steve', name: 'Steve Lacy', price: 2, genre: 'R&B/Indie', imageEmoji: '🎵', popularity: 70, karaokeSong: 'Bad Habit' },
  { id: 'caroline', name: 'Caroline Polachek', price: 1, genre: 'Art Pop', imageEmoji: '🫧', popularity: 48, karaokeSong: 'So Hot You\'re Hurting My Feelings' },
];

// Round 3
export const ROUND_3_ARTISTS: Artist[] = [
  { id: 'adele', name: 'Adele', price: 5, genre: 'Pop/Soul', imageEmoji: '🎙️', popularity: 96, karaokeSong: 'Someone Like You' },
  { id: 'harry', name: 'Harry Styles', price: 4, genre: 'Pop/Rock', imageEmoji: '🍉', popularity: 91, karaokeSong: 'As It Was' },
  { id: 'megan', name: 'Megan Thee Stallion', price: 3, genre: 'Hip-Hop', imageEmoji: '🐎', popularity: 83, karaokeSong: 'Savage' },
  { id: 'dominic', name: 'Dominic Fike', price: 2, genre: 'Indie/Alt', imageEmoji: '🧢', popularity: 58, karaokeSong: '3 Nights' },
  { id: 'arlo', name: 'Arlo Parks', price: 1, genre: 'Indie/Soul', imageEmoji: '🌸', popularity: 44, karaokeSong: 'Cola' },
];

// Round 4
export const ROUND_4_ARTISTS: Artist[] = [
  { id: 'beyonce', name: 'Beyoncé', price: 5, genre: 'Pop/R&B', imageEmoji: '👑', popularity: 98, karaokeSong: 'Halo' },
  { id: 'bruno', name: 'Bruno Mars', price: 4, genre: 'Pop/Funk', imageEmoji: '🪐', popularity: 93, karaokeSong: 'Just the Way You Are' },
  { id: 'charli', name: 'Charli XCX', price: 3, genre: 'Pop/Hyperpop', imageEmoji: '💚', popularity: 79, karaokeSong: '360' },
  { id: 'peggy', name: 'JPEGMAFIA', price: 2, genre: 'Experimental Hip-Hop', imageEmoji: '📀', popularity: 55, karaokeSong: 'BALD!' },
  { id: 'clairo', name: 'Clairo', price: 1, genre: 'Indie Pop', imageEmoji: '🍊', popularity: 50, karaokeSong: 'Sofia' },
];

// Round 5
export const ROUND_5_ARTISTS: Artist[] = [
  { id: 'drake', name: 'Drake', price: 5, genre: 'Hip-Hop', imageEmoji: '🦉', popularity: 95, karaokeSong: 'Hotline Bling' },
  { id: 'frank', name: 'Frank Ocean', price: 4, genre: 'R&B/Alt', imageEmoji: '🏊', popularity: 94, karaokeSong: 'Thinkin Bout You' },
  { id: 'ice_spice', name: 'Ice Spice', price: 3, genre: 'Hip-Hop', imageEmoji: '🌶️', popularity: 81, karaokeSong: 'Munch' },
  { id: 'boygenius', name: 'boygenius', price: 2, genre: 'Indie Rock', imageEmoji: '🌟', popularity: 68, karaokeSong: 'Not Strong Enough' },
  { id: 'noname', name: 'Noname', price: 1, genre: 'Hip-Hop', imageEmoji: '📚', popularity: 42, karaokeSong: 'Blaxploitation' },
];

// Surprise artists that appear in later rounds after spending
export const SURPRISE_ARTISTS: Artist[] = [
  { id: 'mj', name: 'Michael Jackson', price: 5, genre: 'Pop/R&B', imageEmoji: '🕺', popularity: 100, isSurprise: true, surpriseRound: 3, karaokeSong: 'Billie Jean' },
  { id: 'prince', name: 'Prince', price: 5, genre: 'Funk/Rock', imageEmoji: '☔', popularity: 98, isSurprise: true, surpriseRound: 4, karaokeSong: 'Purple Rain' },
  { id: 'freddie', name: 'Freddie Mercury', price: 5, genre: 'Rock', imageEmoji: '👸', popularity: 99, isSurprise: true, surpriseRound: 3, karaokeSong: 'Bohemian Rhapsody' },
  { id: 'bowie', name: 'David Bowie', price: 4, genre: 'Rock/Art', imageEmoji: '⚡', popularity: 95, isSurprise: true, surpriseRound: 4, karaokeSong: 'Space Oddity' },
  { id: 'amy', name: 'Amy Winehouse', price: 3, genre: 'Soul/Jazz', imageEmoji: '🖤', popularity: 88, isSurprise: true, surpriseRound: 5, karaokeSong: 'Rehab' },
  { id: 'nirvana', name: 'Nirvana', price: 3, genre: 'Grunge', imageEmoji: '😐', popularity: 90, isSurprise: true, surpriseRound: 5, karaokeSong: 'Smells Like Teen Spirit' },
];

export const ALL_ROUND_ARTISTS = [
  ROUND_1_ARTISTS,
  ROUND_2_ARTISTS,
  ROUND_3_ARTISTS,
  ROUND_4_ARTISTS,
  ROUND_5_ARTISTS,
];

// Genre catalog for onboarding
export const GENRES = [
  'Pop', 'Hip-Hop', 'R&B', 'Rock', 'Indie', 'Electronic',
  'Reggaeton', 'Soul', 'Punk', 'Psychedelic', 'Alt', 'Dance',
];
