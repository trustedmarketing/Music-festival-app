import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  Platform,
} from 'react-native';
import { GradientBackground } from '../components/GradientBackground';
import { useGame } from '../context/GameContext';
import { VENUES, getNextVenue } from '../data/venues';
import { colors, fontSize, spacing, borderRadius } from '../utils/theme';
import { formatNumber } from '../utils/prediction';

export function VenueSelectScreen() {
  const { state, dispatch } = useGame();
  const nextVenue = getNextVenue(state.playerStats.level);

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Choose Your Venue</Text>
        <Text style={styles.subtitle}>
          Level up to unlock bigger venues with higher attendance multipliers!
        </Text>

        <View style={styles.venueList}>
          {VENUES.map(venue => {
            const isUnlocked = state.unlockedVenues.some(v => v.id === venue.id);
            const isCurrent = state.currentVenue.id === venue.id;

            return (
              <TouchableOpacity
                key={venue.id}
                style={[
                  styles.venueCard,
                  isCurrent && styles.venueCardCurrent,
                  !isUnlocked && styles.venueCardLocked,
                ]}
                disabled={!isUnlocked}
                onPress={() => dispatch({ type: 'SELECT_VENUE', venue })}
              >
                <View style={styles.venueHeader}>
                  <Text style={styles.venueEmoji}>{venue.emoji}</Text>
                  <View style={styles.venueInfo}>
                    <Text style={[
                      styles.venueName,
                      !isUnlocked && styles.venueNameLocked,
                    ]}>
                      {venue.name}
                    </Text>
                    <Text style={styles.venueDesc}>{venue.description}</Text>
                  </View>
                  {isCurrent && (
                    <View style={styles.currentBadge}>
                      <Text style={styles.currentBadgeText}>CURRENT</Text>
                    </View>
                  )}
                </View>

                <View style={styles.venueStats}>
                  <View style={styles.venueStat}>
                    <Text style={styles.venueStatLabel}>Capacity</Text>
                    <Text style={[styles.venueStatValue, { color: venue.color }]}>
                      {formatNumber(venue.capacity)}
                    </Text>
                  </View>
                  <View style={styles.venueStat}>
                    <Text style={styles.venueStatLabel}>Multiplier</Text>
                    <Text style={[styles.venueStatValue, { color: venue.color }]}>
                      x{venue.attendanceMultiplier}
                    </Text>
                  </View>
                  <View style={styles.venueStat}>
                    <Text style={styles.venueStatLabel}>Required</Text>
                    <Text style={[
                      styles.venueStatValue,
                      isUnlocked ? { color: colors.success } : { color: colors.textMuted },
                    ]}>
                      {isUnlocked ? 'Unlocked' : `Lv.${venue.unlockLevel}`}
                    </Text>
                  </View>
                </View>

                {!isUnlocked && (
                  <View style={styles.lockOverlay}>
                    <Text style={styles.lockText}>🔒 Reach Level {venue.unlockLevel}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {nextVenue && (
          <View style={styles.nextUnlock}>
            <Text style={styles.nextUnlockText}>
              Next venue: {nextVenue.emoji} {nextVenue.name} at Level {nextVenue.unlockLevel}
            </Text>
            <View style={styles.progressBar}>
              <View style={[
                styles.progressFill,
                { width: `${Math.min(100, (state.playerStats.level / nextVenue.unlockLevel) * 100)}%` },
              ]} />
            </View>
            <Text style={styles.progressText}>
              Level {state.playerStats.level} / {nextVenue.unlockLevel}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => dispatch({ type: 'BACK_TO_MENU' })}
        >
          <Text style={styles.backButtonText}>Back to Game</Text>
        </TouchableOpacity>
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
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '900',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  venueList: {
    gap: spacing.md,
  },
  venueCard: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    position: 'relative',
    overflow: 'hidden',
  },
  venueCardCurrent: {
    borderColor: colors.accentLight,
    borderWidth: 2,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  venueCardLocked: {
    opacity: 0.6,
  },
  venueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  venueEmoji: {
    fontSize: 40,
    marginRight: spacing.md,
  },
  venueInfo: {
    flex: 1,
  },
  venueName: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  venueNameLocked: {
    color: colors.textMuted,
  },
  venueDesc: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  currentBadge: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  currentBadgeText: {
    color: colors.white,
    fontSize: fontSize.xs,
    fontWeight: '800',
  },
  venueStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  venueStat: {
    alignItems: 'center',
  },
  venueStatLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  venueStatValue: {
    fontSize: fontSize.md,
    fontWeight: '800',
    marginTop: 2,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderBottomLeftRadius: borderRadius.md,
  },
  lockText: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: '700',
  },
  nextUnlock: {
    marginTop: spacing.xl,
    padding: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  nextUnlockText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  progressText: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  backButton: {
    marginTop: spacing.xl,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  backButtonText: {
    color: colors.primaryLight,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
});
