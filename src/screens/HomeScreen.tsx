import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  Platform,
} from 'react-native';
import { GradientBackground } from '../components/GradientBackground';
import { useGame } from '../context/GameContext';
import { getNextUnlockable } from '../data/legendaryArtists';
import { getNextVenue } from '../data/venues';
import { formatNumber } from '../utils/prediction';
import { colors, fontSize, spacing, borderRadius } from '../utils/theme';

export function HomeScreen() {
  const { state, dispatch } = useGame();
  const { playerStats } = state;
  const nextVenue = getNextVenue(playerStats.level);
  const nextLegendary = getNextUnlockable(playerStats);
  const xpProgress = ((100 - playerStats.xpToNextLevel) / 100) * 100;

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>Festival Lineup Builder</Text>
          <Text style={styles.festivalName}>{state.festivalName}</Text>
        </View>

        {/* Player card */}
        <View style={styles.playerCard}>
          <View style={styles.playerRow}>
            <View style={styles.playerInfo}>
              <Text style={styles.levelText}>Level {playerStats.level}</Text>
              <View style={styles.xpBar}>
                <View style={[styles.xpFill, { width: `${xpProgress}%` }]} />
              </View>
              <Text style={styles.xpText}>{100 - playerStats.xpToNextLevel}/100 XP</Text>
            </View>
            <View style={styles.playerStats}>
              <Text style={styles.statValue}>${state.totalBudget}</Text>
              <Text style={styles.statLabel}>Budget</Text>
            </View>
            <View style={styles.playerStats}>
              <Text style={styles.statValue}>{playerStats.gamesPlayed}</Text>
              <Text style={styles.statLabel}>Games</Text>
            </View>
          </View>
        </View>

        {/* Main actions */}
        <Text style={styles.sectionLabel}>PLAY</Text>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => dispatch({ type: 'START_GAME' })}
        >
          <View style={styles.playButtonContent}>
            <Text style={styles.playButtonEmoji}>🎪</Text>
            <View style={styles.playButtonText}>
              <Text style={styles.playButtonTitle}>Build Your Festival</Text>
              <Text style={styles.playButtonDesc}>
                5 rounds · ${state.totalBudget} budget · 1 pick per round
              </Text>
            </View>
            <Text style={styles.playButtonArrow}>→</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuCard}
          onPress={() => dispatch({ type: 'START_H2H' })}
        >
          <Text style={styles.menuCardEmoji}>⚔️</Text>
          <View style={styles.menuCardText}>
            <Text style={styles.menuCardTitle}>Head to Head</Text>
            <Text style={styles.menuCardDesc}>
              Battle an opponent · W: {playerStats.h2hWins} / L: {playerStats.h2hLosses}
            </Text>
          </View>
          <Text style={styles.menuCardArrow}>→</Text>
        </TouchableOpacity>

        {/* Venue & Shop */}
        <Text style={styles.sectionLabel}>YOUR FESTIVAL</Text>
        <View style={styles.menuRow}>
          <TouchableOpacity
            style={styles.menuSquare}
            onPress={() => dispatch({ type: 'SHOW_VENUE_SELECT' })}
          >
            <Text style={styles.menuSquareEmoji}>{state.currentVenue.emoji}</Text>
            <Text style={styles.menuSquareTitle}>{state.currentVenue.name}</Text>
            <Text style={styles.menuSquareDesc}>
              {nextVenue ? `Next: Lv.${nextVenue.unlockLevel}` : 'Max venue!'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuSquare}
            onPress={() => dispatch({ type: 'SHOW_STORE' })}
          >
            <Text style={styles.menuSquareEmoji}>💰</Text>
            <Text style={styles.menuSquareTitle}>Point Shop</Text>
            <Text style={styles.menuSquareDesc}>Buy extra budget</Text>
          </TouchableOpacity>
        </View>

        {/* Social & Profile */}
        <Text style={styles.sectionLabel}>COMMUNITY</Text>
        <View style={styles.menuRow}>
          <TouchableOpacity
            style={styles.menuSquare}
            onPress={() => dispatch({ type: 'SHOW_PROFILE' })}
          >
            <Text style={styles.menuSquareEmoji}>👤</Text>
            <Text style={styles.menuSquareTitle}>Profile</Text>
            <Text style={styles.menuSquareDesc}>Stats & unlocks</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuSquare, !state.lastPredictedAttendance && styles.menuSquareDisabled]}
            onPress={() => {
              if (state.lastPredictedAttendance) dispatch({ type: 'SHOW_POSTER' });
            }}
            disabled={!state.lastPredictedAttendance}
          >
            <Text style={styles.menuSquareEmoji}>📤</Text>
            <Text style={styles.menuSquareTitle}>Share Poster</Text>
            <Text style={styles.menuSquareDesc}>
              {state.lastPredictedAttendance
                ? `${formatNumber(state.lastPredictedAttendance)} fans`
                : 'Play first!'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Next unlock hint */}
        {nextLegendary && (
          <View style={styles.unlockHint}>
            <Text style={styles.unlockHintLabel}>NEXT UNLOCK</Text>
            <Text style={styles.unlockHintArtist}>
              {nextLegendary.artist.imageEmoji} {nextLegendary.artist.name}
            </Text>
            <Text style={styles.unlockHintDesc}>{nextLegendary.description}</Text>
          </View>
        )}

        {/* Quick stats */}
        {playerStats.totalAttendanceGenerated > 0 && (
          <View style={styles.lifetimeStats}>
            <Text style={styles.lifetimeLabel}>LIFETIME STATS</Text>
            <View style={styles.lifetimeRow}>
              <View style={styles.lifetimeStat}>
                <Text style={styles.lifetimeValue}>
                  {formatNumber(playerStats.totalAttendanceGenerated)}
                </Text>
                <Text style={styles.lifetimeStatLabel}>Total Fans</Text>
              </View>
              <View style={styles.lifetimeStat}>
                <Text style={styles.lifetimeValue}>{playerStats.socialLikes}</Text>
                <Text style={styles.lifetimeStatLabel}>Likes</Text>
              </View>
              <View style={styles.lifetimeStat}>
                <Text style={styles.lifetimeValue}>{playerStats.socialDMs}</Text>
                <Text style={styles.lifetimeStatLabel}>Count Me Ins</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  appTitle: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  festivalName: {
    fontSize: fontSize.xxl,
    fontWeight: '900',
    color: colors.accentLight,
    marginTop: spacing.xs,
  },
  playerCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerInfo: {
    flex: 1,
  },
  levelText: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.primaryLight,
    marginBottom: spacing.xs,
  },
  xpBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  xpText: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 3,
  },
  playerStats: {
    alignItems: 'center',
    marginLeft: spacing.lg,
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 1,
  },
  sectionLabel: {
    fontSize: fontSize.xs,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 2,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  playButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  playButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButtonEmoji: {
    fontSize: 40,
    marginRight: spacing.md,
  },
  playButtonText: {
    flex: 1,
  },
  playButtonTitle: {
    fontSize: fontSize.xl,
    fontWeight: '900',
    color: colors.white,
  },
  playButtonDesc: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  playButtonArrow: {
    fontSize: fontSize.xl,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '300',
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: spacing.md,
  },
  menuCardEmoji: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  menuCardText: {
    flex: 1,
  },
  menuCardTitle: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  menuCardDesc: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: 1,
  },
  menuCardArrow: {
    fontSize: fontSize.lg,
    color: colors.textMuted,
  },
  menuRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  menuSquare: {
    flex: 1,
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    minHeight: 120,
    justifyContent: 'center',
  },
  menuSquareDisabled: {
    opacity: 0.4,
  },
  menuSquareEmoji: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  menuSquareTitle: {
    fontSize: fontSize.sm,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  menuSquareDesc: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  unlockHint: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    marginBottom: spacing.md,
  },
  unlockHintLabel: {
    fontSize: fontSize.xs,
    color: colors.primaryLight,
    fontWeight: '700',
    letterSpacing: 2,
  },
  unlockHintArtist: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  unlockHintDesc: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  lifetimeStats: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  lifetimeLabel: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  lifetimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  lifetimeStat: {
    alignItems: 'center',
  },
  lifetimeValue: {
    fontSize: fontSize.lg,
    fontWeight: '900',
    color: colors.accentLight,
  },
  lifetimeStatLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
});
