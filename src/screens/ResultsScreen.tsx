import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  Animated, Platform,
} from 'react-native';
import { GradientBackground } from '../components/GradientBackground';
import { useGame } from '../context/GameContext';
import { predictAttendance, formatNumber } from '../utils/prediction';
import { colors, fontSize, spacing, borderRadius } from '../utils/theme';

export function ResultsScreen() {
  const { state, dispatch } = useGame();
  const [showPrediction, setShowPrediction] = useState(false);
  const [animatedCount, setAnimatedCount] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const staggerAnims = useRef(state.selectedArtists.map(() => new Animated.Value(0))).current;

  const prediction = predictAttendance(state.selectedArtists);
  const totalSpent = state.totalBudget - state.remainingBudget;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    const staggerAnimations = staggerAnims.map((anim) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      })
    );
    Animated.stagger(100, staggerAnimations).start();

    setTimeout(() => {
      setShowPrediction(true);
      const target = prediction.totalAttendees;
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setAnimatedCount(target);
          clearInterval(timer);
        } else {
          setAnimatedCount(Math.round(current));
        }
      }, 2000 / steps);
    }, state.selectedArtists.length * 100 + 800);
  }, []);

  const tierEmoji: Record<string, string> = {
    'Local Gathering': '🏕️',
    'Community Fest': '🎪',
    'Regional Festival': '🎡',
    'Major Festival': '🏟️',
    'Legendary Festival': '🌍',
  };

  const tierColors: Record<string, string> = {
    'Local Gathering': colors.textMuted,
    'Community Fest': colors.success,
    'Regional Festival': colors.primaryLight,
    'Major Festival': colors.accentLight,
    'Legendary Festival': colors.surprise,
  };

  return (
    <GradientBackground variant="results">
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.festivalEmoji}>🎪</Text>
          <Text style={styles.festivalName}>{state.festivalName}</Text>
          <Text style={styles.subtitle}>Your Festival Lineup</Text>
        </Animated.View>

        <View style={styles.lineupPoster}>
          <View style={styles.posterHeader}>
            <Text style={styles.posterTitle}>THE LINEUP</Text>
            <Text style={styles.posterSubtitle}>
              {state.selectedArtists.length} Artist{state.selectedArtists.length !== 1 ? 's' : ''} · ${totalSpent} Spent
            </Text>
          </View>

          {[5, 4, 3, 2, 1].map(price => {
            const tierArtists = state.selectedArtists.filter(a => a.price === price);
            if (tierArtists.length === 0) return null;

            const tierLabel = price === 5 ? 'HEADLINERS' : price === 4 ? 'MAIN STAGE' : price === 3 ? 'SECOND STAGE' : price === 2 ? 'DISCOVERY' : 'EMERGING';

            return (
              <View key={price} style={styles.tierSection}>
                <Text style={[styles.tierLabel, { fontSize: fontSize.xs + price * 1.5 }]}>
                  {tierLabel}
                </Text>
                <View style={styles.tierArtists}>
                  {tierArtists.map((artist) => {
                    const globalIndex = state.selectedArtists.indexOf(artist);
                    return (
                      <Animated.View
                        key={artist.id}
                        style={[
                          styles.lineupArtist,
                          {
                            opacity: staggerAnims[globalIndex] || new Animated.Value(1),
                            transform: [{
                              translateY: (staggerAnims[globalIndex] || new Animated.Value(1)).interpolate({
                                inputRange: [0, 1],
                                outputRange: [20, 0],
                              }),
                            }],
                          },
                        ]}
                      >
                        <Text style={[styles.lineupArtistName, { fontSize: fontSize.sm + price * 2 }]}>
                          {artist.imageEmoji} {artist.name}
                        </Text>
                        {artist.isSurprise && (
                          <Text style={styles.surpriseTag}>SURPRISE</Text>
                        )}
                      </Animated.View>
                    );
                  })}
                </View>
              </View>
            );
          })}

          {state.selectedArtists.length === 0 && (
            <Text style={styles.emptyLineup}>No artists selected!</Text>
          )}
        </View>

        {showPrediction && (
          <View style={styles.predictionSection}>
            <Text style={styles.predictionLabel}>PREDICTED ATTENDANCE</Text>

            <View style={styles.attendanceContainer}>
              <Text style={styles.attendanceNumber}>
                {formatNumber(animatedCount)}
              </Text>
              <Text style={styles.attendanceSuffix}>people</Text>
            </View>

            <View style={[styles.tierBadge, { borderColor: tierColors[prediction.festivalTier] }]}>
              <Text style={styles.tierBadgeEmoji}>
                {tierEmoji[prediction.festivalTier]}
              </Text>
              <Text style={[styles.tierBadgeText, { color: tierColors[prediction.festivalTier] }]}>
                {prediction.festivalTier}
              </Text>
            </View>

            <Text style={styles.ratingText}>
              Festival Rating: {prediction.festivalRating}
            </Text>

            <View style={styles.breakdownSection}>
              <Text style={styles.breakdownTitle}>How We Calculated</Text>
              <BreakdownRow
                label="Base Artist Draw"
                value={formatNumber(Math.round(prediction.breakdown.baseAttraction / 10))}
              />
              <BreakdownRow
                label="Genre Diversity Bonus"
                value={`+${formatNumber(Math.round(prediction.breakdown.genreDiversityBonus / 10))}`}
              />
              {prediction.breakdown.surpriseBonus > 0 && (
                <BreakdownRow
                  label="Surprise Artist Bonus"
                  value={`+${formatNumber(Math.round(prediction.breakdown.surpriseBonus / 10))}`}
                  highlight
                />
              )}
              {prediction.breakdown.synergyBonus > 0 && (
                <BreakdownRow
                  label="Genre Synergy Bonus"
                  value={`+${formatNumber(Math.round(prediction.breakdown.synergyBonus / 10))}`}
                />
              )}
              <BreakdownRow
                label="Headliner Multiplier"
                value={`x${prediction.breakdown.headlinerMultiplier.toFixed(1)}`}
              />
            </View>

            <View style={styles.efficiencySection}>
              <Text style={styles.efficiencyTitle}>Budget Breakdown</Text>
              <Text style={styles.efficiencyText}>
                ${totalSpent} of ${state.totalBudget} spent
                {state.remainingBudget > 0 ? ` · $${state.remainingBudget} unspent` : ' · Perfect budget!'}
              </Text>
              <Text style={styles.efficiencyText}>
                {totalSpent > 0
                  ? `${formatNumber(Math.round(prediction.totalAttendees / totalSpent))} attendees per dollar`
                  : 'No money spent!'}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => dispatch({ type: 'RESET_GAME' })}
            accessibilityRole="button"
          >
            <Text style={styles.primaryButtonText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

function BreakdownRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={breakdownStyles.row}>
      <Text style={[breakdownStyles.label, highlight && breakdownStyles.highlight]}>{label}</Text>
      <Text style={[breakdownStyles.value, highlight && breakdownStyles.highlight]}>{value}</Text>
    </View>
  );
}

const breakdownStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  value: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  highlight: {
    color: colors.surprise,
  },
});

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  festivalEmoji: {
    fontSize: 64,
    marginBottom: spacing.sm,
  },
  festivalName: {
    fontSize: fontSize.xxl,
    fontWeight: '900',
    color: colors.accentLight,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  lineupPoster: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: spacing.xl,
  },
  posterHeader: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    paddingBottom: spacing.md,
  },
  posterTitle: {
    fontSize: fontSize.xl,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: 4,
  },
  posterSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  tierSection: {
    marginVertical: spacing.sm,
    alignItems: 'center',
  },
  tierLabel: {
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  tierArtists: {
    alignItems: 'center',
  },
  lineupArtist: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  lineupArtistName: {
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  surpriseTag: {
    fontSize: fontSize.xs,
    color: colors.surprise,
    fontWeight: '800',
    marginLeft: spacing.sm,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: spacing.xs,
    paddingVertical: 1,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  emptyLineup: {
    fontSize: fontSize.lg,
    color: colors.textMuted,
    textAlign: 'center',
    padding: spacing.xl,
  },
  predictionSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  predictionLabel: {
    fontSize: fontSize.sm,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 3,
    marginBottom: spacing.md,
  },
  attendanceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.md,
  },
  attendanceNumber: {
    fontSize: fontSize.xxxl,
    fontWeight: '900',
    color: colors.accentLight,
  },
  attendanceSuffix: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  tierBadgeEmoji: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  tierBadgeText: {
    fontSize: fontSize.lg,
    fontWeight: '800',
  },
  ratingText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  breakdownSection: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  breakdownTitle: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textMuted,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  efficiencySection: {
    width: '100%',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  efficiencyTitle: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.accentLight,
    marginBottom: spacing.xs,
  },
  efficiencyText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  actionButtons: {
    alignItems: 'center',
    gap: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    minWidth: 250,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: '800',
  },
});
