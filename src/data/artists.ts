// Artist catalog with pricing based on popularity tiers
// $5 = legendary/headliner, $4 = major star, $3 = popular, $2 = rising, $1 = indie/emerging
// Each round shows exactly 5 artists: one randomly picked at each price point ($1-$5)

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

// Large artist pools by price tier — each game picks randomly from these

export const TIER_5_ARTISTS: Artist[] = [
  { id: 'taylor', name: 'Taylor Swift', price: 5, genre: 'Pop', imageEmoji: '✨', popularity: 99, karaokeSong: 'Shake It Off' },
  { id: 'beyonce', name: 'Beyoncé', price: 5, genre: 'Pop/R&B', imageEmoji: '👑', popularity: 98, karaokeSong: 'Halo' },
  { id: 'drake', name: 'Drake', price: 5, genre: 'Hip-Hop', imageEmoji: '🦉', popularity: 95, karaokeSong: 'Hotline Bling' },
  { id: 'rihanna', name: 'Rihanna', price: 5, genre: 'Pop/R&B', imageEmoji: '💎', popularity: 97, karaokeSong: 'Umbrella' },
  { id: 'adele', name: 'Adele', price: 5, genre: 'Pop/Soul', imageEmoji: '🎙️', popularity: 96, karaokeSong: 'Someone Like You' },
  { id: 'travis', name: 'Travis Scott', price: 5, genre: 'Hip-Hop', imageEmoji: '🌵', popularity: 94, karaokeSong: 'SICKO MODE' },
  { id: 'ed', name: 'Ed Sheeran', price: 5, genre: 'Pop', imageEmoji: '🎸', popularity: 95, karaokeSong: 'Shape of You' },
  { id: 'kanye', name: 'Kanye West', price: 5, genre: 'Hip-Hop', imageEmoji: '🐻', popularity: 96, karaokeSong: 'Stronger' },
  { id: 'lady_gaga', name: 'Lady Gaga', price: 5, genre: 'Pop', imageEmoji: '🌟', popularity: 94, karaokeSong: 'Bad Romance' },
  { id: 'eminem', name: 'Eminem', price: 5, genre: 'Hip-Hop', imageEmoji: '🎤', popularity: 93, karaokeSong: 'Lose Yourself' },
  { id: 'ariana', name: 'Ariana Grande', price: 5, genre: 'Pop/R&B', imageEmoji: '🌙', popularity: 95, karaokeSong: 'Thank U, Next' },
  { id: 'coldplay', name: 'Coldplay', price: 5, genre: 'Rock/Pop', imageEmoji: '🌈', popularity: 93, karaokeSong: 'Fix You' },
  { id: 'bruno_h', name: 'Bruno Mars', price: 5, genre: 'Pop/Funk', imageEmoji: '🪐', popularity: 95, karaokeSong: 'Just the Way You Are' },
  { id: 'billie_h', name: 'Billie Eilish', price: 5, genre: 'Pop/Alt', imageEmoji: '🕷️', popularity: 92, karaokeSong: 'Bad Guy' },
  { id: 'j_balvin', name: 'J Balvin', price: 5, genre: 'Reggaeton', imageEmoji: '🎨', popularity: 90, karaokeSong: 'Mi Gente' },
];

export const TIER_4_ARTISTS: Artist[] = [
  { id: 'weeknd', name: 'The Weeknd', price: 4, genre: 'R&B/Pop', imageEmoji: '🌙', popularity: 92, karaokeSong: 'Blinding Lights' },
  { id: 'kendrick', name: 'Kendrick Lamar', price: 4, genre: 'Hip-Hop', imageEmoji: '🔥', popularity: 93, karaokeSong: 'HUMBLE.' },
  { id: 'post', name: 'Post Malone', price: 4, genre: 'Pop/Hip-Hop', imageEmoji: '🍺', popularity: 89, karaokeSong: 'Circles' },
  { id: 'harry', name: 'Harry Styles', price: 4, genre: 'Pop/Rock', imageEmoji: '🍉', popularity: 91, karaokeSong: 'As It Was' },
  { id: 'frank', name: 'Frank Ocean', price: 4, genre: 'R&B/Alt', imageEmoji: '🏊', popularity: 94, karaokeSong: 'Thinkin Bout You' },
  { id: 'doja', name: 'Doja Cat', price: 4, genre: 'Pop/Rap', imageEmoji: '🐱', popularity: 87, karaokeSong: 'Say So' },
  { id: 'sza_h', name: 'SZA', price: 4, genre: 'R&B', imageEmoji: '🦋', popularity: 90, karaokeSong: 'Kill Bill' },
  { id: 'lil_nas', name: 'Lil Nas X', price: 4, genre: 'Pop/Hip-Hop', imageEmoji: '🤠', popularity: 88, karaokeSong: 'MONTERO' },
  { id: 'bad_bunny', name: 'Bad Bunny', price: 4, genre: 'Reggaeton', imageEmoji: '🐰', popularity: 93, karaokeSong: 'Tití Me Preguntó' },
  { id: 'lizzo', name: 'Lizzo', price: 4, genre: 'Pop/Hip-Hop', imageEmoji: '💖', popularity: 85, karaokeSong: 'Truth Hurts' },
  { id: 'tyler_h', name: 'Tyler, the Creator', price: 4, genre: 'Hip-Hop/Alt', imageEmoji: '🌻', popularity: 88, karaokeSong: 'See You Again' },
  { id: 'imagine', name: 'Imagine Dragons', price: 4, genre: 'Rock/Pop', imageEmoji: '🐉', popularity: 87, karaokeSong: 'Believer' },
  { id: 'miley', name: 'Miley Cyrus', price: 4, genre: 'Pop/Rock', imageEmoji: '🌸', popularity: 88, karaokeSong: 'Flowers' },
  { id: 'twenty_one', name: 'Twenty One Pilots', price: 4, genre: 'Alt/Pop', imageEmoji: '🔴', popularity: 85, karaokeSong: 'Stressed Out' },
  { id: 'future', name: 'Future', price: 4, genre: 'Hip-Hop', imageEmoji: '🔮', popularity: 86, karaokeSong: 'Mask Off' },
];

export const TIER_3_ARTISTS: Artist[] = [
  { id: 'dua', name: 'Dua Lipa', price: 3, genre: 'Pop/Dance', imageEmoji: '💃', popularity: 85, karaokeSong: 'Levitating' },
  { id: 'olivia', name: 'Olivia Rodrigo', price: 3, genre: 'Pop/Rock', imageEmoji: '💜', popularity: 86, karaokeSong: "driver's license" },
  { id: 'megan', name: 'Megan Thee Stallion', price: 3, genre: 'Hip-Hop', imageEmoji: '🐎', popularity: 83, karaokeSong: 'Savage' },
  { id: 'arctic', name: 'Arctic Monkeys', price: 3, genre: 'Rock', imageEmoji: '🐵', popularity: 80, karaokeSong: 'Do I Wanna Know?' },
  { id: 'charli', name: 'Charli XCX', price: 3, genre: 'Pop/Hyperpop', imageEmoji: '💚', popularity: 79, karaokeSong: '360' },
  { id: 'lana', name: 'Lana Del Rey', price: 3, genre: 'Indie Pop', imageEmoji: '🌹', popularity: 82, karaokeSong: 'Summertime Sadness' },
  { id: 'ice_spice', name: 'Ice Spice', price: 3, genre: 'Hip-Hop', imageEmoji: '🌶️', popularity: 81, karaokeSong: 'Munch' },
  { id: 'gorillaz', name: 'Gorillaz', price: 3, genre: 'Alt/Electronic', imageEmoji: '🦍', popularity: 76, karaokeSong: 'Feel Good Inc.' },
  { id: 'tame', name: 'Tame Impala', price: 3, genre: 'Psychedelic', imageEmoji: '🌀', popularity: 78, karaokeSong: 'The Less I Know The Better' },
  { id: 'hozier', name: 'Hozier', price: 3, genre: 'Indie/Folk', imageEmoji: '🌿', popularity: 80, karaokeSong: 'Take Me to Church' },
  { id: 'chappell', name: 'Chappell Roan', price: 3, genre: 'Pop', imageEmoji: '🗡️', popularity: 83, karaokeSong: 'Good Luck, Babe!' },
  { id: 'sabrina', name: 'Sabrina Carpenter', price: 3, genre: 'Pop', imageEmoji: '☕', popularity: 84, karaokeSong: 'Espresso' },
  { id: 'glass', name: 'Glass Animals', price: 3, genre: 'Indie/Electronic', imageEmoji: '🍍', popularity: 78, karaokeSong: 'Heat Waves' },
  { id: 'gracie', name: 'Gracie Abrams', price: 3, genre: 'Pop', imageEmoji: '🌙', popularity: 76, karaokeSong: 'That\'s So True' },
  { id: 'peso', name: 'Peso Pluma', price: 3, genre: 'Regional Mexican', imageEmoji: '🪶', popularity: 82, karaokeSong: 'Ella Baila Sola' },
];

export const TIER_2_ARTISTS: Artist[] = [
  { id: 'steve', name: 'Steve Lacy', price: 2, genre: 'R&B/Indie', imageEmoji: '🎵', popularity: 70, karaokeSong: 'Bad Habit' },
  { id: 'dominic', name: 'Dominic Fike', price: 2, genre: 'Indie/Alt', imageEmoji: '🧢', popularity: 58, karaokeSong: '3 Nights' },
  { id: 'mitski', name: 'Mitski', price: 2, genre: 'Indie Rock', imageEmoji: '🦋', popularity: 60, karaokeSong: 'My Love Mine All Mine' },
  { id: 'boygenius', name: 'boygenius', price: 2, genre: 'Indie Rock', imageEmoji: '🌟', popularity: 68, karaokeSong: 'Not Strong Enough' },
  { id: 'phoebe', name: 'Phoebe Bridgers', price: 2, genre: 'Indie', imageEmoji: '👻', popularity: 65, karaokeSong: 'Motion Sickness' },
  { id: 'wet_leg', name: 'Wet Leg', price: 2, genre: 'Indie Rock', imageEmoji: '🦵', popularity: 52, karaokeSong: 'Chaise Longue' },
  { id: 'peggy', name: 'JPEGMAFIA', price: 2, genre: 'Experimental Hip-Hop', imageEmoji: '📀', popularity: 55, karaokeSong: 'BALD!' },
  { id: 'fka', name: 'FKA twigs', price: 2, genre: 'Art Pop/Electronic', imageEmoji: '🌿', popularity: 58, karaokeSong: 'Cellophane' },
  { id: 'kaytranada', name: 'KAYTRANADA', price: 2, genre: 'Electronic', imageEmoji: '🎧', popularity: 62, karaokeSong: 'GLOWED UP' },
  { id: 'mac', name: 'Mac DeMarco', price: 2, genre: 'Indie/Lo-Fi', imageEmoji: '🚬', popularity: 60, karaokeSong: 'Chamber of Reflection' },
  { id: 'beabadoobee', name: 'beabadoobee', price: 2, genre: 'Indie Rock', imageEmoji: '🍓', popularity: 58, karaokeSong: 'Glue Song' },
  { id: 'wallows', name: 'Wallows', price: 2, genre: 'Indie Pop', imageEmoji: '🏖️', popularity: 56, karaokeSong: 'Are You Bored Yet?' },
  { id: 'remi_wolf', name: 'Remi Wolf', price: 2, genre: 'Pop/Funk', imageEmoji: '🐺', popularity: 52, karaokeSong: 'Photo ID' },
  { id: 'jungle', name: 'Jungle', price: 2, genre: 'Electronic/Funk', imageEmoji: '🌴', popularity: 55, karaokeSong: 'Back on 74' },
  { id: 'omar_apollo', name: 'Omar Apollo', price: 2, genre: 'R&B/Pop', imageEmoji: '🌕', popularity: 60, karaokeSong: 'Evergreen' },
];

export const TIER_1_ARTISTS: Artist[] = [
  { id: 'raye', name: 'RAYE', price: 1, genre: 'R&B/Pop', imageEmoji: '🎤', popularity: 55, karaokeSong: 'Escapism' },
  { id: 'caroline', name: 'Caroline Polachek', price: 1, genre: 'Art Pop', imageEmoji: '🫧', popularity: 48, karaokeSong: 'So Hot You\'re Hurting My Feelings' },
  { id: 'arlo', name: 'Arlo Parks', price: 1, genre: 'Indie/Soul', imageEmoji: '🌸', popularity: 44, karaokeSong: 'Cola' },
  { id: 'clairo', name: 'Clairo', price: 1, genre: 'Indie Pop', imageEmoji: '🍊', popularity: 50, karaokeSong: 'Sofia' },
  { id: 'noname', name: 'Noname', price: 1, genre: 'Hip-Hop', imageEmoji: '📚', popularity: 42, karaokeSong: 'Blaxploitation' },
  { id: 'japanese', name: 'Japanese Breakfast', price: 1, genre: 'Indie Pop', imageEmoji: '🍳', popularity: 45, karaokeSong: 'Be Sweet' },
  { id: 'turnstile', name: 'Turnstile', price: 1, genre: 'Punk/Hardcore', imageEmoji: '🔄', popularity: 46, karaokeSong: 'MYSTERY' },
  { id: 'alvvays', name: 'Alvvays', price: 1, genre: 'Indie Pop', imageEmoji: '🌊', popularity: 40, karaokeSong: 'Archie, Marry Me' },
  { id: 'bartees', name: 'Bartees Strange', price: 1, genre: 'Indie/Alt', imageEmoji: '🎯', popularity: 36, karaokeSong: 'Heavy Heart' },
  { id: 'khruangbin', name: 'Khruangbin', price: 1, genre: 'Psychedelic/Funk', imageEmoji: '🎸', popularity: 42, karaokeSong: 'Time (You and I)' },
  { id: 'men_i_trust', name: 'Men I Trust', price: 1, genre: 'Indie/Dream Pop', imageEmoji: '☁️', popularity: 38, karaokeSong: 'Tailwhip' },
  { id: 'black_midi', name: 'black midi', price: 1, genre: 'Experimental', imageEmoji: '🎹', popularity: 35, karaokeSong: 'John L' },
  { id: 'snail_mail', name: 'Snail Mail', price: 1, genre: 'Indie Rock', imageEmoji: '🐌', popularity: 40, karaokeSong: 'Pristine' },
  { id: 'ethel_cain', name: 'Ethel Cain', price: 1, genre: 'Indie/Gothic', imageEmoji: '⛪', popularity: 42, karaokeSong: 'American Teenager' },
  { id: 'mk_xyz', name: 'Mk.gee', price: 1, genre: 'Indie/Alt', imageEmoji: '🔧', popularity: 38, karaokeSong: 'DNM' },
];

// ALL_TIERS used for random selection
export const ALL_TIERS = [TIER_1_ARTISTS, TIER_2_ARTISTS, TIER_3_ARTISTS, TIER_4_ARTISTS, TIER_5_ARTISTS];

// Pick a random artist from a tier, excluding already-used IDs
function pickRandom(pool: Artist[], usedIds: Set<string>): Artist | null {
  const available = pool.filter(a => !usedIds.has(a.id));
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

// Generate a random round of 5 artists (one per price $1-$5)
export function generateRound(usedIds: Set<string>): Artist[] {
  const round: Artist[] = [];
  const tiers = [TIER_1_ARTISTS, TIER_2_ARTISTS, TIER_3_ARTISTS, TIER_4_ARTISTS, TIER_5_ARTISTS];

  for (const tier of tiers) {
    const pick = pickRandom(tier, usedIds);
    if (pick) {
      round.push(pick);
      usedIds.add(pick.id);
    }
  }

  // Return sorted by price descending ($5 at top)
  return round.sort((a, b) => b.price - a.price);
}

// Generate all 5 rounds at once with no repeats
export function generateAllRounds(): Artist[][] {
  const usedIds = new Set<string>();
  const rounds: Artist[][] = [];
  for (let i = 0; i < 5; i++) {
    rounds.push(generateRound(usedIds));
  }
  return rounds;
}

// Surprise artists that appear in later rounds after spending
export const SURPRISE_ARTISTS: Artist[] = [
  { id: 'mj', name: 'Michael Jackson', price: 5, genre: 'Pop/R&B', imageEmoji: '🕺', popularity: 100, isSurprise: true, surpriseRound: 3, karaokeSong: 'Billie Jean' },
  { id: 'prince', name: 'Prince', price: 5, genre: 'Funk/Rock', imageEmoji: '☔', popularity: 98, isSurprise: true, surpriseRound: 4, karaokeSong: 'Purple Rain' },
  { id: 'freddie', name: 'Freddie Mercury', price: 5, genre: 'Rock', imageEmoji: '👸', popularity: 99, isSurprise: true, surpriseRound: 3, karaokeSong: 'Bohemian Rhapsody' },
  { id: 'bowie', name: 'David Bowie', price: 4, genre: 'Rock/Art', imageEmoji: '⚡', popularity: 95, isSurprise: true, surpriseRound: 4, karaokeSong: 'Space Oddity' },
  { id: 'amy', name: 'Amy Winehouse', price: 3, genre: 'Soul/Jazz', imageEmoji: '🖤', popularity: 88, isSurprise: true, surpriseRound: 5, karaokeSong: 'Rehab' },
  { id: 'nirvana', name: 'Nirvana', price: 3, genre: 'Grunge', imageEmoji: '😐', popularity: 90, isSurprise: true, surpriseRound: 5, karaokeSong: 'Smells Like Teen Spirit' },
];

// Legacy exports for backward compatibility
export const ALL_ROUND_ARTISTS = generateAllRounds();

// Genre catalog for onboarding
export const GENRES = [
  'Pop', 'Hip-Hop', 'R&B', 'Rock', 'Indie', 'Electronic',
  'Reggaeton', 'Soul', 'Punk', 'Psychedelic', 'Alt', 'Dance',
];
