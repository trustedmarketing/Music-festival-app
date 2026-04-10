// Legendary artists unlocked through social engagement and leveling up

import { Artist } from './artists';

export interface LegendaryUnlock {
  artist: Artist;
  unlockMethod: 'social_likes' | 'social_dms' | 'level' | 'h2h_wins';
  requirement: number;
  description: string;
}

export const LEGENDARY_ARTISTS: LegendaryUnlock[] = [
  {
    artist: {
      id: 'beatles',
      name: 'The Beatles',
      price: 5,
      genre: 'Rock/Pop',
      imageEmoji: '🪲',
      popularity: 100,
      isSurprise: true,
      karaokeSong: 'Hey Jude',
    },
    unlockMethod: 'social_likes',
    requirement: 50,
    description: 'Get 50 likes on your festival poster',
  },
  {
    artist: {
      id: 'u2',
      name: 'U2',
      price: 5,
      genre: 'Rock',
      imageEmoji: '🎸',
      popularity: 96,
      isSurprise: true,
      karaokeSong: 'With or Without You',
    },
    unlockMethod: 'social_likes',
    requirement: 100,
    description: 'Get 100 likes on your festival poster',
  },
  {
    artist: {
      id: 'elvis',
      name: 'Elvis Presley',
      price: 5,
      genre: 'Rock/Pop',
      imageEmoji: '🕺',
      popularity: 98,
      isSurprise: true,
      karaokeSong: "Can't Help Falling in Love",
    },
    unlockMethod: 'social_dms',
    requirement: 10,
    description: 'Get 10 "count me in" DMs on your poster',
  },
  {
    artist: {
      id: 'whitney',
      name: 'Whitney Houston',
      price: 5,
      genre: 'Pop/R&B',
      imageEmoji: '🌟',
      popularity: 97,
      isSurprise: true,
      karaokeSong: 'I Will Always Love You',
    },
    unlockMethod: 'social_dms',
    requirement: 25,
    description: 'Get 25 "I\'d go" DMs on your poster',
  },
  {
    artist: {
      id: 'led_zeppelin',
      name: 'Led Zeppelin',
      price: 5,
      genre: 'Rock',
      imageEmoji: '🎸',
      popularity: 97,
      isSurprise: true,
      karaokeSong: 'Stairway to Heaven',
    },
    unlockMethod: 'level',
    requirement: 10,
    description: 'Reach level 10',
  },
  {
    artist: {
      id: 'aretha',
      name: 'Aretha Franklin',
      price: 4,
      genre: 'Soul/R&B',
      imageEmoji: '👑',
      popularity: 96,
      isSurprise: true,
      karaokeSong: 'Respect',
    },
    unlockMethod: 'h2h_wins',
    requirement: 3,
    description: 'Win 3 head-to-head matches',
  },
  {
    artist: {
      id: 'hendrix',
      name: 'Jimi Hendrix',
      price: 5,
      genre: 'Rock',
      imageEmoji: '🎸',
      popularity: 98,
      isSurprise: true,
      karaokeSong: 'Purple Haze',
    },
    unlockMethod: 'h2h_wins',
    requirement: 5,
    description: 'Win 5 head-to-head matches',
  },
  {
    artist: {
      id: 'madonna',
      name: 'Madonna',
      price: 4,
      genre: 'Pop/Dance',
      imageEmoji: '💎',
      popularity: 95,
      isSurprise: true,
      karaokeSong: 'Like a Prayer',
    },
    unlockMethod: 'level',
    requirement: 5,
    description: 'Reach level 5',
  },
];

export function getUnlockedLegendaries(stats: {
  socialLikes: number;
  socialDMs: number;
  level: number;
  h2hWins: number;
}): LegendaryUnlock[] {
  return LEGENDARY_ARTISTS.filter(lu => {
    switch (lu.unlockMethod) {
      case 'social_likes': return stats.socialLikes >= lu.requirement;
      case 'social_dms': return stats.socialDMs >= lu.requirement;
      case 'level': return stats.level >= lu.requirement;
      case 'h2h_wins': return stats.h2hWins >= lu.requirement;
      default: return false;
    }
  });
}

export function getNextUnlockable(stats: {
  socialLikes: number;
  socialDMs: number;
  level: number;
  h2hWins: number;
}): LegendaryUnlock | null {
  const locked = LEGENDARY_ARTISTS.filter(lu => {
    switch (lu.unlockMethod) {
      case 'social_likes': return stats.socialLikes < lu.requirement;
      case 'social_dms': return stats.socialDMs < lu.requirement;
      case 'level': return stats.level < lu.requirement;
      case 'h2h_wins': return stats.h2hWins < lu.requirement;
      default: return true;
    }
  });
  // Return the one closest to being unlocked
  return locked.sort((a, b) => {
    const aProgress = getProgress(a, stats);
    const bProgress = getProgress(b, stats);
    return bProgress - aProgress;
  })[0] || null;
}

function getProgress(lu: LegendaryUnlock, stats: {
  socialLikes: number;
  socialDMs: number;
  level: number;
  h2hWins: number;
}): number {
  switch (lu.unlockMethod) {
    case 'social_likes': return stats.socialLikes / lu.requirement;
    case 'social_dms': return stats.socialDMs / lu.requirement;
    case 'level': return stats.level / lu.requirement;
    case 'h2h_wins': return stats.h2hWins / lu.requirement;
    default: return 0;
  }
}
