import React, { useEffect, useRef } from 'react';
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
  const prediction = predictAttendance(state.selectedArtists);

  const countAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnims = useRef(
    state.selectedArtists.map(() => new Animated.Value(50))
  ).current;
  const slideOpacities = useRef(
    state.selectedArtists.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    // Fade in header
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Animate attendance counter
    Animated.timing(countAnim, {
      toValue: prediction.totalAttendees,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    // Stagger animate lineup cards
    const animations = state.selectedArtists.map((_, i) =>
      Animated.parallel([
        Animated.timing(slideAnims[i], {
          toValue: 0,
          duration: 400,
          delay: 800 + i * 100,
          useNativeDriver: true,
        }),
        Animated.timing(slideOpacities[i], {
          toValue: 1,
          duration: 400,
          delay: 800 + i * 100,
          useNativeDriver: true,
        }),
      ])
    );
    Animated.parallel(animations).start();
  }, []);

  const totalSpent = state.totalBudget - state.remainingBudget;

  // Tier display config
  const tierConfig = {
    'Local Gathering': { emoji: '🏕️', color: colors.textMuted },
    'Community Fest': { emoji: '🎪', color: colors.textSecondary },
    'Regional Festival': { emoji: '🎡', color: colors.primaryLight },
    'Major Festival': { emoji: '🎆', color: colors.accentLight },
    'Legendary Festival': { emoji: '👑', color: colors.accent },
  };

  const tier = tierConfig[prediction.festivalTier];

  return (
    <GradientBackground variant="results">
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.headerSection, { opacity: fadeAnim }]}>
          <Text style={styles.festivalName}>{state.festivalName}</Text>
          <Text style={styles.headerLabel}>FESTIVAL RESULTS</Text>
        </Animated.View>

        {/* Attendance prediction hero */}
        <Animated.View style={[styles.predictionHero, { opacity: fadeAnim }]}>
          <Text style={styles.predictionLabel}>Predicted Attendance</Text>
          <AnimatedCounter value={prediction.totalAttendees} />
          <Text style={styles.predictionSubtext}>
            music fans would attend your festival!
          </Text>
        </Animated.View>

        {/* Festival tier */}
        <Animated.View style={[styles.tierCard, { opacity: fadeAnim }]}>
          <Text style={styles.tierEmoji}>{tier.emoji}</Text>
          <Text style={[styles.tierName, { color: tier.color }]}>
            {prediction.festivalTier}
          </Text>
          <Text style={styles.tierRating}>Rating: {prediction.festivalRating}</Text>
        </Animated.View>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          <StatCard
            label="Artists Booked"
            value={`${state.selectedArtists.length}`}
            icon="🎵"
          />
          <StatCard
            label="Budget Used"
            value={`$${totalSpent}/$${state.totalBudget}`}
            icon="💰"
          />
          <StatCard
            label="Genres"
            value={`${new Set(state.selectedArtists.flatMap(a => a.genre.split('/'))).size}`}
            icon="🎶"
          />
          <StatCard
            label="Legends"
            value={`${state.selectedArtists.filter(a => a.isSurprise).length}`}
            icon="⭐"
          />
        </View>

        {/* Prediction breakdown */}
        <View style={styles.breakdownSection}>
          <Text style={styles.sectionTitle}>How We Calculated</Text>
          <BreakdownRow
            label="Base Artist Appeal"
            value={formatNumber(prediction.breakdown.baseAttraction)}
          />
          <BreakdownRow
            label="Genre Diversity Bonus"
            value={`+${formatNumber(prediction.breakdown.genreDiversityBonus)}`}
          />
          <BreakdownRow
            label="Surprise Artist Bonus"
            value={`+${formatNumber(prediction.breakdown.surpriseBonus)}`}
          />
          <BreakdownRow
            label="Genre Synergy Bonus"
            value={`+${formatNumber(prediction.breakdown.synergyBonus)}`}
          />
          <BreakdownRow
            label="Headliner Multiplier"
            value={`x${prediction.breakdown.headlinerMultiplier.toFixed(1)}`}
            highlight
          />
        </View>

        {/* Full lineup */}
        <View style={styles.lineupSection}>
          <Text style={styles.sectionTitle}>Your Lineup</Text>
          {state.selectedArtists.map((artist, i) => (
            <Animated.View
              key={artist.id}
              style={[
                styles.lineupCard,
                artist.isSurprise && styles.lineupCardSurprise,
                {
                  transform: [{ translateY: slideAnims[i] || new Animated.Value(0) }],
                  opacity: slideOpacities[i] || new Animated.Value(1),
                },
              ]}
            >
              <Text style={styles.lineupPosition}>{i + 1}</Text>
              <Text style={styles.lineupEmoji}>{artist.imageEmoji}</Text>
              <View style={styles.lineupInfo}>
                <Text style={styles.lineupName}>{artist.name}</Text>
                <Text style={styles.lineupGenre}>{artist.genre}</Text>
              </View>
              <Text style={styles.lineupPrice}>${artist.price}</Text>
              {artist.isSurprise && (
                <Text style={styles.lineupSurprise}>LEGEND</Text>
              )}
            </Animated.View>
          ))}
        </View>

        {/* Play again */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.playAgainButton}
            onPress={() => dispatch({ type: 'RESET_GAME' })}
            accessibilityRole="button"
          >
            <Text style={styles.playAgainText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

function AnimatedCounter({ value }: { value: number }) {
  const animValue = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = React.useState('0');

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: value,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    const listener = animValue.addListener(({ value: v }) => {
      setDisplay(formatNumber(Math.round(v)));
    });

    return () => animValue.removeListener(listener);
  }, [value]);

  return <Text style={styles.attendeeCount}>{display}</Text>;
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function BreakdownRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={[styles.breakdownRow, highlight && styles.breakdownRowHighlight]}>
      <Text style={styles.breakdownLabel}>{label}</Text>
      <Text style={[styles.breakdownValue, highlight && styles.breakdownValueHighlight]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: spacing.xxl,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  festivalName: {
    fontSize: fontSize.xl,
    fontWeight: '900',
    color: colors.accentLight,
    marginBottom: spacing.xs,
  },
  headerLabel: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 3,
  },
  predictionHero: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    padding: spacing.xl,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  predictionLabel: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  attendeeCount: {
    fontSize: 64,
    fontWeight: '900',
    color: colors.accentLight,
    textShadowColor: 'rgba(245, 158, 11, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  predictionSubtext: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  tierCard: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    padding: spacing.lg,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  tierEmoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  tierName: {
    fontSize: fontSize.xl,
    fontWeight: '900',
  },
  tierRating: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  breakdownSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  breakdownRowHighlight: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 0,
    marginTop: spacing.xs,
  },
  breakdownLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  breakdownValue: {
    color: colors.textPrimary,
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  breakdownValueHighlight: {
    color: colors.accentLight,
    fontWeight: '800',
  },
  lineupSection: {
    marginBottom: spacing.xl,
  },
  lineupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  lineupCardSurprise: {
    borderColor: colors.surprise,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  lineupPosition: {
    width: 24,
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  lineupEmoji: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  lineupInfo: {
    flex: 1,
  },
  lineupName: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  lineupGenre: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  lineupPrice: {
    color: colors.accent,
    fontSize: fontSize.lg,
    fontWeight: '800',
    marginLeft: spacing.sm,
  },
  lineupSurprise: {
    color: colors.surprise,
    fontSize: fontSize.xs,
    fontWeight: '900',
    marginLeft: spacing.sm,
    letterSpacing: 1,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  playAgainButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    minWidth: 200,
    alignItems: 'center',
  },
  playAgainText: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: '800',
  },
});
