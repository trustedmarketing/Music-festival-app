import { Artist } from '../data/artists';

// Attendance prediction model
// Factors: artist popularity, genre diversity, surprise factor, total spend efficiency

interface PredictionResult {
  totalAttendees: number;
  breakdown: {
    baseAttraction: number;
    genreDiversityBonus: number;
    surpriseBonus: number;
    headlinerMultiplier: number;
    synergyBonus: number;
  };
  festivalRating: string;
  festivalTier: 'Local Gathering' | 'Community Fest' | 'Regional Festival' | 'Major Festival' | 'Legendary Festival';
}

export function predictAttendance(lineup: Artist[]): PredictionResult {
  if (lineup.length === 0) {
    return {
      totalAttendees: 0,
      breakdown: {
        baseAttraction: 0,
        genreDiversityBonus: 0,
        surpriseBonus: 0,
        headlinerMultiplier: 1,
        synergyBonus: 0,
      },
      festivalRating: '0/10',
      festivalTier: 'Local Gathering',
    };
  }

  // Base attraction: sum of artist popularity * price weight
  const baseAttraction = lineup.reduce((sum, artist) => {
    const priceMultiplier = artist.price >= 4 ? 1.5 : artist.price >= 3 ? 1.2 : 1.0;
    return sum + (artist.popularity * 100 * priceMultiplier);
  }, 0);

  // Genre diversity bonus: more unique genres = bigger crowd
  const uniqueGenres = new Set(lineup.flatMap(a => a.genre.split('/')));
  const genreDiversityBonus = Math.min(uniqueGenres.size * 2000, 20000);

  // Surprise artist bonus
  const surpriseArtists = lineup.filter(a => a.isSurprise);
  const surpriseBonus = surpriseArtists.length * 15000;

  // Headliner multiplier: having $5 artists draws exponentially more
  const headliners = lineup.filter(a => a.price === 5);
  const headlinerMultiplier = headliners.length > 0
    ? 1 + (headliners.length * 0.3)
    : 0.7;

  // Synergy bonus: complementary genres
  const synergyPairs = [
    ['Pop', 'R&B'], ['Hip-Hop', 'R&B'], ['Rock', 'Indie'],
    ['Electronic', 'Dance'], ['Pop', 'Dance'], ['Soul', 'R&B'],
  ];
  let synergyBonus = 0;
  const genreSet = Array.from(uniqueGenres);
  for (const [g1, g2] of synergyPairs) {
    if (genreSet.includes(g1) && genreSet.includes(g2)) {
      synergyBonus += 5000;
    }
  }

  const rawTotal = (baseAttraction + genreDiversityBonus + surpriseBonus + synergyBonus) * headlinerMultiplier;

  // Scale to realistic festival numbers (5,000 - 250,000)
  const totalAttendees = Math.min(
    Math.max(Math.round(rawTotal / 10), 5000),
    250000
  );

  // Rating
  const ratingNum = Math.min(10, Math.round((totalAttendees / 25000) * 10) / 10);
  const festivalRating = `${ratingNum}/10`;

  // Tier
  let festivalTier: PredictionResult['festivalTier'];
  if (totalAttendees >= 150000) festivalTier = 'Legendary Festival';
  else if (totalAttendees >= 80000) festivalTier = 'Major Festival';
  else if (totalAttendees >= 40000) festivalTier = 'Regional Festival';
  else if (totalAttendees >= 15000) festivalTier = 'Community Fest';
  else festivalTier = 'Local Gathering';

  return {
    totalAttendees,
    breakdown: {
      baseAttraction,
      genreDiversityBonus,
      surpriseBonus,
      headlinerMultiplier,
      synergyBonus,
    },
    festivalRating,
    festivalTier,
  };
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
  return num.toString();
}
