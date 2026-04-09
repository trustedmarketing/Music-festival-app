import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Artist, ALL_ROUND_ARTISTS, SURPRISE_ARTISTS } from '../data/artists';

export interface GameState {
  currentRound: number;
  totalBudget: number;
  remainingBudget: number;
  selectedArtists: Artist[];
  roundSelections: Artist[][]; // Artists selected per round
  availableArtists: Artist[];
  surpriseArtists: Artist[];
  revealedSurprises: Artist[];
  favoriteGenres: string[];
  spotifyArtistNames: string[];
  onboardingComplete: boolean;
  gamePhase: 'onboarding' | 'selection' | 'karaoke' | 'results' | 'surprise_reveal';
  festivalName: string;
}

type GameAction =
  | { type: 'SET_ONBOARDING_COMPLETE'; favoriteGenres: string[]; spotifyArtistNames?: string[]; festivalName: string }
  | { type: 'SELECT_ARTIST'; artist: Artist }
  | { type: 'DESELECT_ARTIST'; artistId: string }
  | { type: 'CONFIRM_ROUND' }
  | { type: 'FINISH_KARAOKE' }
  | { type: 'ACKNOWLEDGE_SURPRISE' }
  | { type: 'RESET_GAME' };

const TOTAL_BUDGET = 15;
const TOTAL_ROUNDS = 5;

const initialState: GameState = {
  currentRound: 1,
  totalBudget: TOTAL_BUDGET,
  remainingBudget: TOTAL_BUDGET,
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
};

function getPersonalizedArtists(baseArtists: Artist[], favoriteGenres: string[]): Artist[] {
  if (favoriteGenres.length === 0) return baseArtists;

  // Sort to show preferred genres first, but keep all artists available
  return [...baseArtists].sort((a, b) => {
    const aMatch = favoriteGenres.some(g => a.genre.includes(g)) ? 0 : 1;
    const bMatch = favoriteGenres.some(g => b.genre.includes(g)) ? 0 : 1;
    return aMatch - bMatch;
  });
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_ONBOARDING_COMPLETE':
      return {
        ...state,
        favoriteGenres: action.favoriteGenres,
        spotifyArtistNames: action.spotifyArtistNames || [],
        festivalName: action.festivalName,
        onboardingComplete: true,
        gamePhase: 'selection',
        availableArtists: getPersonalizedArtists(ALL_ROUND_ARTISTS[0], action.favoriteGenres),
      };

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

      // Only allow deselecting artists from the current round
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

      // Check for surprise reveals in the next round
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

      // Show karaoke first if picks were made
      if (thisRoundPicks.length > 0) {
        return {
          ...state,
          roundSelections: newRoundSelections,
          gamePhase: 'karaoke',
        };
      }

      // If no picks, check for surprises or move to next round
      if (surprisesForNextRound.length > 0) {
        return {
          ...state,
          currentRound: nextRound,
          roundSelections: newRoundSelections,
          revealedSurprises: surprisesForNextRound,
          gamePhase: 'surprise_reveal',
        };
      }

      // Just advance to next round
      const nextArtists = nextRound <= TOTAL_ROUNDS
        ? getPersonalizedArtists(ALL_ROUND_ARTISTS[nextRound - 1], state.favoriteGenres)
        : [];

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

      // Check for surprise reveals
      const surprises = state.surpriseArtists.filter(a => a.surpriseRound === nextRound);

      if (surprises.length > 0) {
        return {
          ...state,
          currentRound: nextRound,
          revealedSurprises: surprises,
          gamePhase: 'surprise_reveal',
        };
      }

      const nextArtists = getPersonalizedArtists(ALL_ROUND_ARTISTS[nextRound - 1], state.favoriteGenres);
      return {
        ...state,
        currentRound: nextRound,
        availableArtists: nextArtists,
        gamePhase: 'selection',
      };
    }

    case 'ACKNOWLEDGE_SURPRISE': {
      const nextArtists = state.currentRound <= TOTAL_ROUNDS
        ? [
            ...getPersonalizedArtists(ALL_ROUND_ARTISTS[state.currentRound - 1], state.favoriteGenres),
            ...state.revealedSurprises,
          ]
        : [];

      return {
        ...state,
        availableArtists: nextArtists,
        revealedSurprises: [],
        gamePhase: 'selection',
      };
    }

    case 'RESET_GAME':
      return { ...initialState };

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
