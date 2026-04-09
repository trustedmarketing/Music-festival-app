import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { GameProvider, useGame } from './src/context/GameContext';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { GameScreen } from './src/screens/GameScreen';
import { KaraokeScreen } from './src/screens/KaraokeScreen';
import { SurpriseRevealScreen } from './src/screens/SurpriseRevealScreen';
import { ResultsScreen } from './src/screens/ResultsScreen';

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
