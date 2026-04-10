import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Platform,
} from 'react-native';
import { GradientBackground } from '../components/GradientBackground';
import { useGame } from '../context/GameContext';
import { colors, fontSize, spacing, borderRadius } from '../utils/theme';

export function H2HLobbyScreen() {
  const { state, dispatch } = useGame();

  const handleStartBattle = () => {
    // Go to regular selection mode — after completing the game,
    // it will compare against the opponent's lineup
    dispatch({ type: 'BACK_TO_MENU' });
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <Text style={styles.title}>HEAD TO HEAD</Text>
        <Text style={styles.subtitle}>Build a better lineup than your opponent!</Text>

        {/* VS Card */}
        <View style={styles.vsCard}>
          <View style={styles.playerSide}>
            <Text style={styles.playerEmoji}>🎪</Text>
            <Text style={styles.playerName}>You</Text>
            <Text style={styles.playerDetail}>Lv.{state.playerStats.level}</Text>
            <Text style={styles.playerDetail}>
              {state.currentVenue.emoji} {state.currentVenue.name}
            </Text>
          </View>

          <View style={styles.vsCenter}>
            <Text style={styles.vsText}>VS</Text>
          </View>

          <View style={styles.playerSide}>
            <Text style={styles.playerEmoji}>🤖</Text>
            <Text style={styles.playerName}>{state.opponentName}</Text>
            <Text style={styles.playerDetail}>
              {state.opponentLineup.length} artists
            </Text>
            <Text style={styles.playerDetail}>
              {state.opponentVenue.emoji} {state.opponentVenue.name}
            </Text>
          </View>
        </View>

        {/* Rules */}
        <View style={styles.rulesBox}>
          <Text style={styles.rulesTitle}>Battle Rules</Text>
          <Text style={styles.ruleText}>
            Both players have ${state.totalBudget} to build a lineup
          </Text>
          <Text style={styles.ruleText}>
            Highest predicted attendance wins!
          </Text>
          <Text style={styles.ruleText}>
            Winner gets bonus XP + progress toward $20 budget
          </Text>
          <Text style={styles.ruleHighlight}>
            Win 3 matches = unlock Aretha Franklin!
          </Text>
        </View>

        {/* Opponent preview */}
        <View style={styles.opponentPreview}>
          <Text style={styles.previewTitle}>
            {state.opponentName}'s Lineup (Hidden)
          </Text>
          <View style={styles.hiddenArtists}>
            {state.opponentLineup.map((_, i) => (
              <Text key={i} style={styles.hiddenArtist}>❓</Text>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={handleStartBattle}>
          <Text style={styles.startButtonText}>Build Your Lineup!</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => dispatch({ type: 'BACK_TO_MENU' })}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '900',
    color: colors.surprise,
    letterSpacing: 3,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  vsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 400,
    marginBottom: spacing.xl,
  },
  playerSide: {
    flex: 1,
    alignItems: 'center',
  },
  playerEmoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  playerName: {
    fontSize: fontSize.md,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  playerDetail: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  vsCenter: {
    paddingHorizontal: spacing.md,
  },
  vsText: {
    fontSize: fontSize.xxl,
    fontWeight: '900',
    color: colors.surprise,
  },
  rulesBox: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    width: '100%',
    maxWidth: 400,
    marginBottom: spacing.lg,
  },
  rulesTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.primaryLight,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  ruleText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginVertical: 2,
    textAlign: 'center',
  },
  ruleHighlight: {
    fontSize: fontSize.sm,
    color: colors.accentLight,
    fontWeight: '700',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  opponentPreview: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  previewTitle: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  hiddenArtists: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  hiddenArtist: {
    fontSize: 32,
  },
  startButton: {
    backgroundColor: colors.surprise,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    minWidth: 250,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  startButtonText: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: '800',
  },
  cancelButton: {
    paddingVertical: spacing.md,
  },
  cancelButtonText: {
    color: colors.textMuted,
    fontSize: fontSize.md,
  },
});
