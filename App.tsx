import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GameProvider, useGame } from './src/context/GameContext';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { GameScreen } from './src/screens/GameScreen';
import { KaraokeScreen } from './src/screens/KaraokeScreen';
import { SurpriseRevealScreen } from './src/screens/SurpriseRevealScreen';
import { ResultsScreen } from './src/screens/ResultsScreen';
import { PosterScreen } from './src/screens/PosterScreen';
import { H2HLobbyScreen } from './src/screens/H2HLobbyScreen';
import { VenueSelectScreen } from './src/screens/VenueSelectScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';

function GameNavigator() {
  const { state } = useGame();

  switch (state.gamePhase) {
    case 'onboarding':
      return <OnboardingScreen />;
    case 'selection':
      return <GameScreen />;
    case 'karaoke':
      return <KaraokeScreen />;
    case 'surprise_reveal':
      return <SurpriseRevealScreen />;
    case 'results':
      return <ResultsScreen />;
    case 'poster':
      return <PosterScreen />;
    case 'h2h_lobby':
    case 'h2h_battle':
    case 'h2h_results':
      return <H2HLobbyScreen />;
    case 'venue_select':
      return <VenueSelectScreen />;
    case 'profile':
      return <ProfileScreen />;
    default:
      return <OnboardingScreen />;
  }
}

export default function App() {
  return (
    <GameProvider>
      <StatusBar style="light" />
      <GameNavigator />
    </GameProvider>
  );
}
