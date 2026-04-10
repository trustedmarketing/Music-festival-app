import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Artist, ALL_ROUND_ARTISTS, SURPRISE_ARTISTS } from '../data/artists';
import { Venue, VENUES, getAvailableVenues } from '../data/venues';
import { getUnlockedLegendaries } from '../data/legendaryArtists';

export interface PlayerStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  h2hWins: number;
  h2hLosses: number;
  socialLikes: number;
  socialDMs: number;
  gamesPlayed: number;
  totalAttendanceGenerated: number;
}

export interface GameState {
  // Core game
  currentRound: number;
  totalBudget: number;
  remainingBudget: number;
  selectedArtists: Artist[];
  roundSelections: Artist[][];
  availableArtists: Artist[];
  surpriseArtists: Artist[];
  revealedSurprises: Artist[];
  favoriteGenres: string[];
  spotifyArtistNames: string[];
  onboardingComplete: boolean;
  gamePhase:
    | 'onboarding' | 'selection' | 'karaoke' | 'results'
    | 'surprise_reveal' | 'poster' | 'h2h_lobby' | 'h2h_battle'
    | 'h2h_results' | 'venue_select' | 'profile' | 'store';
  festivalName: string;

  // Venue system
  currentVenue: Venue;
  unlockedVenues: Venue[];

  // Player progression
  playerStats: PlayerStats;

  // Head-to-head
  isMultiplayer: boolean;
  opponentLineup: Artist[];
  opponentName: string;
  opponentVenue: Venue;

  // Social / poster
  posterShared: boolean;
  lastPredictedAttendance: number;
}

type GameAction =
  | { type: 'SET_ONBOARDING_COMPLETE'; favoriteGenres: string[]; spotifyArtistNames?: string[]; festivalName: string }
  | { type: 'SELECT_ARTIST'; artist: Artist }
  | { type: 'DESELECT_ARTIST'; artistId: string }
  | { type: 'CONFIRM_ROUND' }
  | { type: 'FINISH_KARAOKE' }
  | { type: 'ACKNOWLEDGE_SURPRISE' }
  | { type: 'RESET_GAME' }
  // Venue
  | { type: 'SELECT_VENUE'; venue: Venue }
  | { type: 'SHOW_VENUE_SELECT' }
  // Multiplayer
  | { type: 'START_H2H' }
  | { type: 'SET_OPPONENT'; name: string; lineup: Artist[]; venue: Venue }
  | { type: 'FINISH_H2H' }
  // Social
  | { type: 'SHOW_POSTER' }
  | { type: 'SHARE_POSTER' }
  | { type: 'ADD_SOCIAL_LIKES'; count: number }
  | { type: 'ADD_SOCIAL_DMS'; count: number }
  // Profile
  | { type: 'SHOW_PROFILE' }
  | { type: 'BACK_TO_MENU' }
  // Store
  | { type: 'SHOW_STORE' }
  | { type: 'ADD_BUDGET_POINTS'; points: number }
  // Attendance result
  | { type: 'SET_PREDICTED_ATTENDANCE'; attendance: number };

const BASE_BUDGET = 15;
const TOTAL_ROUNDS = 5;
const XP_PER_LEVEL = 100;

function calculateLevel(xp: number): { level: number; xpToNextLevel: number } {
  const level = Math.floor(xp / XP_PER_LEVEL);
  const xpToNextLevel = XP_PER_LEVEL - (xp % XP_PER_LEVEL);
  return { level, xpToNextLevel };
}

function getBudgetForLevel(level: number): number {
  // Every 3 levels, budget increases by $5 (15 -> 20 -> 25)
  return BASE_BUDGET + Math.floor(level / 3) * 5;
}

const defaultStats: PlayerStats = {
  level: 0,
  xp: 0,
  xpToNextLevel: XP_PER_LEVEL,
  h2hWins: 0,
  h2hLosses: 0,
  socialLikes: 0,
  socialDMs: 0,
  gamesPlayed: 0,
  totalAttendanceGenerated: 0,
};

const initialState: GameState = {
  currentRound: 1,
  totalBudget: BASE_BUDGET,
  remainingBudget: BASE_BUDGET,
  selectedArtists: [],
  roundSelections: [],
  availableArtists: ALL_ROUND_ARTISTS[0],
  surpriseArtists: SURPRISE_ARTISTS,
  revealedSurprises: [],
  favoriteGenres: [],
  spotifyArtistNames: [],
  onboardingComplete: false,
  gamePhase: 'onboarding',
  festivalName: 'My Festival',
  currentVenue: VENUES[0],
  unlockedVenues: [VENUES[0]],
  playerStats: defaultStats,
  isMultiplayer: false,
  opponentLineup: [],
  opponentName: '',
  opponentVenue: VENUES[0],
  posterShared: false,
  lastPredictedAttendance: 0,
};

function getPersonalizedArtists(baseArtists: Artist[], favoriteGenres: string[]): Artist[] {
  if (favoriteGenres.length === 0) return baseArtists;
  return [...baseArtists].sort((a, b) => {
    const aMatch = favoriteGenres.some(g => a.genre.includes(g)) ? 0 : 1;
    const bMatch = favoriteGenres.some(g => b.genre.includes(g)) ? 0 : 1;
    return aMatch - bMatch;
  });
}

// Add unlocked legendary artists to the available pool
function addLegendaryArtists(artists: Artist[], stats: PlayerStats): Artist[] {
  const unlocked = getUnlockedLegendaries(stats);
  const legendaryArtists = unlocked.map(lu => lu.artist);
  // Only add if not already in pool
  const newLegendaries = legendaryArtists.filter(la =>
    !artists.some(a => a.id === la.id)
  );
  return [...artists, ...newLegendaries];
}

// Generate a random AI opponent
function generateOpponent(): { name: string; lineup: Artist[]; venue: Venue } {
  const names = ['DJ Shadow', 'MC Sparkle', 'BeatBoss', 'VinylViper', 'BassQueen', 'RiffLord', 'SynthWave Sam'];
  const name = names[Math.floor(Math.random() * names.length)];

  // Pick random artists with a $15 budget
  const allArtists = ALL_ROUND_ARTISTS.flat();
  const shuffled = [...allArtists].sort(() => Math.random() - 0.5);
  let budget = 15;
  const lineup: Artist[] = [];
  for (const artist of shuffled) {
    if (budget >= artist.price && lineup.length < 6) {
      lineup.push(artist);
      budget -= artist.price;
    }
  }

  const venueIndex = Math.floor(Math.random() * 3);
  const venue = VENUES[Math.min(venueIndex, VENUES.length - 1)];

  return { name, lineup, venue };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_ONBOARDING_COMPLETE': {
      const budget = getBudgetForLevel(state.playerStats.level);
      let artists = getPersonalizedArtists(ALL_ROUND_ARTISTS[0], action.favoriteGenres);
      artists = addLegendaryArtists(artists, state.playerStats);
      return {
        ...state,
        favoriteGenres: action.favoriteGenres,
        spotifyArtistNames: action.spotifyArtistNames || [],
        festivalName: action.festivalName,
        onboardingComplete: true,
        gamePhase: 'selection',
        totalBudget: budget,
        remainingBudget: budget,
        availableArtists: artists,
      };
    }

    case 'SELECT_ARTIST': {
      if (state.remainingBudget < action.artist.price) return state;
      if (state.selectedArtists.find(a => a.id === action.artist.id)) return state;
      return {
        ...state,
        selectedArtists: [...state.selectedArtists, action.artist],
        remainingBudget: state.remainingBudget - action.artist.price,
      };
    }

    case 'DESELECT_ARTIST': {
      const artist = state.selectedArtists.find(a => a.id === action.artistId);
      if (!artist) return state;
      const currentRoundStart = state.roundSelections.flat().length;
      const currentRoundSelections = state.selectedArtists.slice(currentRoundStart);
      if (!currentRoundSelections.find(a => a.id === action.artistId)) return state;
      return {
        ...state,
        selectedArtists: state.selectedArtists.filter(a => a.id !== action.artistId),
        remainingBudget: state.remainingBudget + artist.price,
      };
    }

    case 'CONFIRM_ROUND': {
      const currentRoundStart = state.roundSelections.flat().length;
      const thisRoundPicks = state.selectedArtists.slice(currentRoundStart);
      const newRoundSelections = [...state.roundSelections, thisRoundPicks];
      const nextRound = state.currentRound + 1;

      const surprisesForNextRound = state.surpriseArtists.filter(
        a => a.surpriseRound === nextRound
      );

      if (nextRound > TOTAL_ROUNDS) {
        return {
          ...state,
          roundSelections: newRoundSelections,
          gamePhase: 'results',
        };
      }

      if (thisRoundPicks.length > 0) {
        return {
          ...state,
          roundSelections: newRoundSelections,
          gamePhase: 'karaoke',
        };
      }

      if (surprisesForNextRound.length > 0) {
        return {
          ...state,
          currentRound: nextRound,
          roundSelections: newRoundSelections,
          revealedSurprises: surprisesForNextRound,
          gamePhase: 'surprise_reveal',
        };
      }

      let nextArtists = nextRound <= TOTAL_ROUNDS
        ? getPersonalizedArtists(ALL_ROUND_ARTISTS[nextRound - 1], state.favoriteGenres)
        : [];
      nextArtists = addLegendaryArtists(nextArtists, state.playerStats);

      return {
        ...state,
        currentRound: nextRound,
        roundSelections: newRoundSelections,
        availableArtists: nextArtists,
        gamePhase: 'selection',
      };
    }

    case 'FINISH_KARAOKE': {
      const nextRound = state.currentRound + 1;
      if (nextRound > TOTAL_ROUNDS) {
        return { ...state, gamePhase: 'results' };
      }

      const surprises = state.surpriseArtists.filter(a => a.surpriseRound === nextRound);
      if (surprises.length > 0) {
        return {
          ...state,
          currentRound: nextRound,
          revealedSurprises: surprises,
          gamePhase: 'surprise_reveal',
        };
      }

      let nextArtists = getPersonalizedArtists(ALL_ROUND_ARTISTS[nextRound - 1], state.favoriteGenres);
      nextArtists = addLegendaryArtists(nextArtists, state.playerStats);
      return {
        ...state,
        currentRound: nextRound,
        availableArtists: nextArtists,
        gamePhase: 'selection',
      };
    }

    case 'ACKNOWLEDGE_SURPRISE': {
      let nextArtists = state.currentRound <= TOTAL_ROUNDS
        ? [
            ...getPersonalizedArtists(ALL_ROUND_ARTISTS[state.currentRound - 1], state.favoriteGenres),
            ...state.revealedSurprises,
          ]
        : [];
      nextArtists = addLegendaryArtists(nextArtists, state.playerStats);
      return {
        ...state,
        availableArtists: nextArtists,
        revealedSurprises: [],
        gamePhase: 'selection',
      };
    }

    // Venue
    case 'SHOW_VENUE_SELECT':
      return { ...state, gamePhase: 'venue_select' };

    case 'SELECT_VENUE':
      return {
        ...state,
        currentVenue: action.venue,
        gamePhase: 'selection',
      };

    // Multiplayer
    case 'START_H2H': {
      const opponent = generateOpponent();
      return {
        ...state,
        isMultiplayer: true,
        opponentName: opponent.name,
        opponentLineup: opponent.lineup,
        opponentVenue: opponent.venue,
        gamePhase: 'h2h_lobby',
      };
    }

    case 'FINISH_H2H': {
      // Compare attendance — already calculated in the H2H results screen
      return { ...state, gamePhase: 'h2h_results' };
    }

    // Social poster
    case 'SHOW_POSTER':
      return { ...state, gamePhase: 'poster' };

    case 'SHARE_POSTER': {
      const xpGain = 25;
      const newXp = state.playerStats.xp + xpGain;
      const { level, xpToNextLevel } = calculateLevel(newXp);
      return {
        ...state,
        posterShared: true,
        playerStats: {
          ...state.playerStats,
          xp: newXp,
          level,
          xpToNextLevel,
        },
        unlockedVenues: getAvailableVenues(level),
      };
    }

    case 'ADD_SOCIAL_LIKES': {
      const newLikes = state.playerStats.socialLikes + action.count;
      const xpGain = action.count * 2;
      const newXp = state.playerStats.xp + xpGain;
      const { level, xpToNextLevel } = calculateLevel(newXp);
      return {
        ...state,
        playerStats: {
          ...state.playerStats,
          socialLikes: newLikes,
          xp: newXp,
          level,
          xpToNextLevel,
        },
        totalBudget: getBudgetForLevel(level),
        unlockedVenues: getAvailableVenues(level),
      };
    }

    case 'ADD_SOCIAL_DMS': {
      const newDMs = state.playerStats.socialDMs + action.count;
      const xpGain = action.count * 5;
      const newXp = state.playerStats.xp + xpGain;
      const { level, xpToNextLevel } = calculateLevel(newXp);
      return {
        ...state,
        playerStats: {
          ...state.playerStats,
          socialDMs: newDMs,
          xp: newXp,
          level,
          xpToNextLevel,
        },
        totalBudget: getBudgetForLevel(level),
        unlockedVenues: getAvailableVenues(level),
      };
    }

    case 'SET_PREDICTED_ATTENDANCE': {
      const xpGain = 50 + Math.floor(action.attendance / 5000);
      const newXp = state.playerStats.xp + xpGain;
      const { level, xpToNextLevel } = calculateLevel(newXp);
      const newStats = {
        ...state.playerStats,
        xp: newXp,
        level,
        xpToNextLevel,
        gamesPlayed: state.playerStats.gamesPlayed + 1,
        totalAttendanceGenerated: state.playerStats.totalAttendanceGenerated + action.attendance,
      };
      return {
        ...state,
        lastPredictedAttendance: action.attendance,
        playerStats: newStats,
        totalBudget: getBudgetForLevel(level),
        unlockedVenues: getAvailableVenues(level),
      };
    }

    case 'SHOW_PROFILE':
      return { ...state, gamePhase: 'profile' };

    case 'SHOW_STORE':
      return { ...state, gamePhase: 'store' };

    case 'ADD_BUDGET_POINTS':
      return {
        ...state,
        totalBudget: state.totalBudget + action.points,
        remainingBudget: state.remainingBudget + action.points,
      };

    case 'BACK_TO_MENU': {
      const budget = getBudgetForLevel(state.playerStats.level);
      return {
        ...state,
        gamePhase: 'selection',
        currentRound: 1,
        totalBudget: budget,
        remainingBudget: budget,
        selectedArtists: [],
        roundSelections: [],
        availableArtists: addLegendaryArtists(
          getPersonalizedArtists(ALL_ROUND_ARTISTS[0], state.favoriteGenres),
          state.playerStats
        ),
        posterShared: false,
        isMultiplayer: false,
      };
    }

    case 'RESET_GAME': {
      const budget = getBudgetForLevel(state.playerStats.level);
      return {
        ...initialState,
        onboardingComplete: state.onboardingComplete,
        favoriteGenres: state.favoriteGenres,
        festivalName: state.festivalName,
        playerStats: state.playerStats,
        currentVenue: state.currentVenue,
        unlockedVenues: state.unlockedVenues,
        totalBudget: budget,
        remainingBudget: budget,
        gamePhase: state.onboardingComplete ? 'selection' : 'onboarding',
        availableArtists: addLegendaryArtists(
          getPersonalizedArtists(ALL_ROUND_ARTISTS[0], state.favoriteGenres),
          state.playerStats
        ),
      };
    }

    default:
      return state;
  }
}

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
}
