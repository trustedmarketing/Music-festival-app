import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  Platform,
} from 'react-native';
import { GradientBackground } from '../components/GradientBackground';
import { useGame } from '../context/GameContext';
import { getUnlockedLegendaries, getNextUnlockable, LEGENDARY_ARTISTS } from '../data/legendaryArtists';
import { formatNumber } from '../utils/prediction';
import { colors, fontSize, spacing, borderRadius } from '../utils/theme';

export function ProfileScreen() {
  const { state, dispatch } = useGame();
  const { playerStats } = state;

  const unlockedLegendaries = getUnlockedLegendaries(playerStats);
  const nextUnlockable = getNextUnlockable(playerStats);
  const xpProgress = ((100 - playerStats.xpToNextLevel) / 100) * 100;

  const budgetInfo = playerStats.level >= 6
    ? '$25' : playerStats.level >= 3
    ? '$20' : '$15';

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Player card */}
        <View style={styles.playerCard}>
          <Text style={styles.playerEmoji}>🎪</Text>
          <Text style={styles.playerName}>{state.festivalName}</Text>
          <Text style={styles.levelBadge}>Level {playerStats.level}</Text>

          {/* XP bar */}
          <View style={styles.xpSection}>
            <View style={styles.xpBar}>
              <View style={[styles.xpFill, { width: `${xpProgress}%` }]} />
            </View>
            <Text style={styles.xpText}>
              {100 - playerStats.xpToNextLevel}/{100} XP to Level {playerStats.level + 1}
            </Text>
          </View>
        </View>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          <StatCard label="Games Played" value={playerStats.gamesPlayed.toString()} emoji="🎮" />
          <StatCard label="Total Attendance" value={formatNumber(playerStats.totalAttendanceGenerated)} emoji="🎟️" />
          <StatCard label="H2H Wins" value={playerStats.h2hWins.toString()} emoji="🏆" />
          <StatCard label="Budget" value={budgetInfo} emoji="💰" />
          <StatCard label="Social Likes" value={playerStats.socialLikes.toString()} emoji="❤️" />
          <StatCard label="Count Me Ins" value={playerStats.socialDMs.toString()} emoji="💬" />
        </View>

        {/* Current venue */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Venue</Text>
          <View style={styles.venueCard}>
            <Text style={styles.venueEmoji}>{state.currentVenue.emoji}</Text>
            <View>
              <Text style={styles.venueName}>{state.currentVenue.name}</Text>
              <Text style={styles.venueDetail}>
                Capacity: {formatNumber(state.currentVenue.capacity)} · x{state.currentVenue.attendanceMultiplier} multiplier
              </Text>
            </View>
          </View>
        </View>

        {/* Unlocked legendaries */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Legendary Artists ({unlockedLegendaries.length}/{LEGENDARY_ARTISTS.length})
          </Text>

          {unlockedLegendaries.length > 0 ? (
            <View style={styles.legendaryList}>
              {unlockedLegendaries.map(lu => (
                <View key={lu.artist.id} style={styles.legendaryCard}>
                  <Text style={styles.legendaryEmoji}>{lu.artist.imageEmoji}</Text>
                  <View style={styles.legendaryInfo}>
                    <Text style={styles.legendaryName}>{lu.artist.name}</Text>
                    <Text style={styles.legendaryUnlock}>{lu.description}</Text>
                  </View>
                  <Text style={styles.legendaryCheck}>✓</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>
              No legendary artists unlocked yet. Keep playing and sharing!
            </Text>
          )}

          {/* Next unlock hint */}
          {nextUnlockable && (
            <View style={styles.nextHint}>
              <Text style={styles.nextHintTitle}>Next Unlock</Text>
              <Text style={styles.nextHintArtist}>
                {nextUnlockable.artist.imageEmoji} {nextUnlockable.artist.name}
              </Text>
              <Text style={styles.nextHintDesc}>{nextUnlockable.description}</Text>
            </View>
          )}

          {/* Locked legendaries preview */}
          <View style={styles.lockedList}>
            {LEGENDARY_ARTISTS.filter(
              lu => !unlockedLegendaries.some(u => u.artist.id === lu.artist.id)
            ).map(lu => (
              <View key={lu.artist.id} style={styles.lockedCard}>
                <Text style={styles.lockedEmoji}>🔒</Text>
                <View style={styles.legendaryInfo}>
                  <Text style={styles.lockedName}>???</Text>
                  <Text style={styles.lockedHint}>{lu.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => dispatch({ type: 'BACK_TO_MENU' })}
        >
          <Text style={styles.backButtonText}>← Dashboard</Text>
        </TouchableOpacity>
      </ScrollView>
    </GradientBackground>
  );
}

function StatCard({ label, value, emoji }: { label: string; value: string; emoji: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  playerCard: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  playerEmoji: {
    fontSize: 64,
    marginBottom: spacing.sm,
  },
  playerName: {
    fontSize: fontSize.xxl,
    fontWeight: '900',
    color: colors.accentLight,
  },
  levelBadge: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.primaryLight,
    marginTop: spacing.xs,
  },
  xpSection: {
    width: '100%',
    maxWidth: 300,
    marginTop: spacing.md,
  },
  xpBar: {
    height: 10,
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
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  statCard: {
    width: '31%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: fontSize.lg,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  venueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.md,
  },
  venueEmoji: {
    fontSize: 40,
  },
  venueName: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  venueDetail: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  legendaryList: {
    gap: spacing.sm,
  },
  legendaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  legendaryEmoji: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  legendaryInfo: {
    flex: 1,
  },
  legendaryName: {
    fontSize: fontSize.md,
    fontWeight: '800',
    color: colors.accentLight,
  },
  legendaryUnlock: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  legendaryCheck: {
    fontSize: fontSize.lg,
    color: colors.success,
    fontWeight: '800',
  },
  emptyText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
    padding: spacing.lg,
  },
  nextHint: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  nextHintTitle: {
    fontSize: fontSize.xs,
    color: colors.primaryLight,
    fontWeight: '700',
    letterSpacing: 2,
  },
  nextHintArtist: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  nextHintDesc: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  lockedList: {
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  lockedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    gap: spacing.md,
  },
  lockedEmoji: {
    fontSize: 24,
  },
  lockedName: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textMuted,
  },
  lockedHint: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 1,
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  backButtonText: {
    color: colors.primaryLight,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
});
