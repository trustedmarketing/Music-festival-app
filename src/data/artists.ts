// Artist catalog with pricing based on popularity tiers
// $5 = legendary/headliner, $4 = major star, $3 = popular, $2 = rising, $1 = indie/emerging

export interface Artist {
  id: string;
  name: string;
  price: number;
  genre: string;
  imageEmoji: string; // Emoji representation for cross-platform compatibility
  popularity: number; // 1-100 scale for attendance prediction
  isSurprise?: boolean;
  surpriseRound?: number;
  karaokeSong?: string;
}

// Round 1-2: Standard picks
export const ROUND_1_ARTISTS: Artist[] = [
  { id: 'beyonce', name: 'Beyoncé', price: 5, genre: 'Pop/R&B', imageEmoji: '👑', popularity: 98, karaokeSong: 'Halo' },
  { id: 'drake', name: 'Drake', price: 5, genre: 'Hip-Hop', imageEmoji: '🦉', popularity: 95, karaokeSong: 'Hotline Bling' },
  { id: 'taylor', name: 'Taylor Swift', price: 5, genre: 'Pop', imageEmoji: '✨', popularity: 99, karaokeSong: 'Shake It Off' },
  { id: 'weeknd', name: 'The Weeknd', price: 4, genre: 'R&B/Pop', imageEmoji: '🌙', popularity: 92, karaokeSong: 'Blinding Lights' },
  { id: 'billie', name: 'Billie Eilish', price: 4, genre: 'Pop/Alt', imageEmoji: '🕷️', popularity: 90, karaokeSong: 'Bad Guy' },
  { id: 'kendrick', name: 'Kendrick Lamar', price: 4, genre: 'Hip-Hop', imageEmoji: '🔥', popularity: 93, karaokeSong: 'HUMBLE.' },
  { id: 'dua', name: 'Dua Lipa', price: 3, genre: 'Pop/Dance', imageEmoji: '💃', popularity: 85, karaokeSong: 'Levitating' },
  { id: 'sza', name: 'SZA', price: 3, genre: 'R&B', imageEmoji: '🌊', popularity: 88, karaokeSong: 'Kill Bill' },
  { id: 'bad_bunny', name: 'Bad Bunny', price: 3, genre: 'Reggaeton', imageEmoji: '🐰', popularity: 91, karaokeSong: 'Tití Me Preguntó' },
  { id: 'tyler', name: 'Tyler, the Creator', price: 2, genre: 'Hip-Hop/Alt', imageEmoji: '🌻', popularity: 78, karaokeSong: 'See You Again' },
  { id: 'phoebe', name: 'Phoebe Bridgers', price: 2, genre: 'Indie', imageEmoji: '👻', popularity: 65, karaokeSong: 'Motion Sickness' },
  { id: 'tame', name: 'Tame Impala', price: 2, genre: 'Psychedelic', imageEmoji: '🌀', popularity: 72, karaokeSong: 'The Less I Know The Better' },
  { id: 'japanese', name: 'Japanese Breakfast', price: 1, genre: 'Indie Pop', imageEmoji: '🍳', popularity: 45, karaokeSong: 'Be Sweet' },
  { id: 'khruangbin', name: 'Khruangbin', price: 1, genre: 'Psychedelic/Funk', imageEmoji: '🎸', popularity: 42, karaokeSong: 'Time (You and I)' },
  { id: 'raye', name: 'RAYE', price: 1, genre: 'R&B/Pop', imageEmoji: '🎤', popularity: 55, karaokeSong: 'Escapism' },
];

export const ROUND_2_ARTISTS: Artist[] = [
  { id: 'travis', name: 'Travis Scott', price: 5, genre: 'Hip-Hop', imageEmoji: '🌵', popularity: 94, karaokeSong: 'SICKO MODE' },
  { id: 'rihanna', name: 'Rihanna', price: 5, genre: 'Pop/R&B', imageEmoji: '💎', popularity: 97, karaokeSong: 'Umbrella' },
  { id: 'post', name: 'Post Malone', price: 4, genre: 'Pop/Hip-Hop', imageEmoji: '🍺', popularity: 89, karaokeSong: 'Circles' },
  { id: 'doja', name: 'Doja Cat', price: 4, genre: 'Pop/Rap', imageEmoji: '🐱', popularity: 87, karaokeSong: 'Say So' },
  { id: 'arctic', name: 'Arctic Monkeys', price: 3, genre: 'Rock', imageEmoji: '🐵', popularity: 80, karaokeSong: 'Do I Wanna Know?' },
  { id: 'olivia', name: 'Olivia Rodrigo', price: 3, genre: 'Pop/Rock', imageEmoji: '💜', popularity: 86, karaokeSong: "driver's license" },
  { id: 'lana', name: 'Lana Del Rey', price: 3, genre: 'Indie Pop', imageEmoji: '🌹', popularity: 82, karaokeSong: 'Summertime Sadness' },
  { id: 'steve', name: 'Steve Lacy', price: 2, genre: 'R&B/Indie', imageEmoji: '🎵', popularity: 70, karaokeSong: 'Bad Habit' },
  { id: 'mitski', name: 'Mitski', price: 2, genre: 'Indie Rock', imageEmoji: '🦋', popularity: 60, karaokeSong: 'My Love Mine All Mine' },
  { id: 'kaytranada', name: 'KAYTRANADA', price: 2, genre: 'Electronic', imageEmoji: '🎧', popularity: 62, karaokeSong: 'GLOWED UP' },
  { id: 'men_i_trust', name: 'Men I Trust', price: 1, genre: 'Indie/Dream Pop', imageEmoji: '☁️', popularity: 38, karaokeSong: 'Tailwhip' },
  { id: 'black_midi', name: 'black midi', price: 1, genre: 'Experimental', imageEmoji: '🎹', popularity: 35, karaokeSong: 'John L' },
  { id: 'caroline', name: 'Caroline Polachek', price: 1, genre: 'Art Pop', imageEmoji: '🫧', popularity: 48, karaokeSong: 'So Hot You\'re Hurting My Feelings' },
];

export const ROUND_3_ARTISTS: Artist[] = [
  { id: 'adele', name: 'Adele', price: 5, genre: 'Pop/Soul', imageEmoji: '🎙️', popularity: 96, karaokeSong: 'Someone Like You' },
  { id: 'harry', name: 'Harry Styles', price: 4, genre: 'Pop/Rock', imageEmoji: '🍉', popularity: 91, karaokeSong: 'As It Was' },
  { id: 'megan', name: 'Megan Thee Stallion', price: 3, genre: 'Hip-Hop', imageEmoji: '🐎', popularity: 83, karaokeSong: 'Savage' },
  { id: 'gorillaz', name: 'Gorillaz', price: 3, genre: 'Alt/Electronic', imageEmoji: '🦍', popularity: 76, karaokeSong: 'Feel Good Inc.' },
  { id: 'dominic', name: 'Dominic Fike', price: 2, genre: 'Indie/Alt', imageEmoji: '🧢', popularity: 58, karaokeSong: '3 Nights' },
  { id: 'wet_leg', name: 'Wet Leg', price: 2, genre: 'Indie Rock', imageEmoji: '🦵', popularity: 52, karaokeSong: 'Chaise Longue' },
  { id: 'arlo', name: 'Arlo Parks', price: 1, genre: 'Indie/Soul', imageEmoji: '🌸', popularity: 44, karaokeSong: 'Cola' },
  { id: 'alvvays', name: 'Alvvays', price: 1, genre: 'Indie Pop', imageEmoji: '🌊', popularity: 40, karaokeSong: 'Archie, Marry Me' },
];

export const ROUND_4_ARTISTS: Artist[] = [
  { id: 'bruno', name: 'Bruno Mars', price: 4, genre: 'Pop/Funk', imageEmoji: '🪐', popularity: 93, karaokeSong: 'Just the Way You Are' },
  { id: 'charli', name: 'Charli XCX', price: 3, genre: 'Pop/Hyperpop', imageEmoji: '💚', popularity: 79, karaokeSong: '360' },
  { id: 'peggy', name: 'JPEGMAFIA', price: 2, genre: 'Experimental Hip-Hop', imageEmoji: '📀', popularity: 55, karaokeSong: 'BALD!' },
  { id: 'fka', name: 'FKA twigs', price: 2, genre: 'Art Pop/Electronic', imageEmoji: '🌿', popularity: 58, karaokeSong: 'Cellophane' },
  { id: 'clairo', name: 'Clairo', price: 1, genre: 'Indie Pop', imageEmoji: '🍊', popularity: 50, karaokeSong: 'Sofia' },
  { id: 'turnstile', name: 'Turnstile', price: 1, genre: 'Punk/Hardcore', imageEmoji: '🔄', popularity: 46, karaokeSong: 'MYSTERY' },
];

export const ROUND_5_ARTISTS: Artist[] = [
  { id: 'frank', name: 'Frank Ocean', price: 4, genre: 'R&B/Alt', imageEmoji: '🏊', popularity: 94, karaokeSong: 'Thinkin Bout You' },
  { id: 'ice_spice', name: 'Ice Spice', price: 3, genre: 'Hip-Hop', imageEmoji: '🌶️', popularity: 81, karaokeSong: 'Munch' },
  { id: 'boygenius', name: 'boygenius', price: 2, genre: 'Indie Rock', imageEmoji: '🌟', popularity: 68, karaokeSong: 'Not Strong Enough' },
  { id: 'noname', name: 'Noname', price: 1, genre: 'Hip-Hop', imageEmoji: '📚', popularity: 42, karaokeSong: 'Blaxploitation' },
  { id: 'bartees', name: 'Bartees Strange', price: 1, genre: 'Indie/Alt', imageEmoji: '🎯', popularity: 36, karaokeSong: 'Heavy Heart' },
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
