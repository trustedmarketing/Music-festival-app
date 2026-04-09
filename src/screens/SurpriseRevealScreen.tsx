import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated,
  Platform,
} from 'react-native';
import { GradientBackground } from '../components/GradientBackground';
import { useGame } from '../context/GameContext';
import { colors, fontSize, spacing, borderRadius } from '../utils/theme';

export function SurpriseRevealScreen() {
  const { state, dispatch } = useGame();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation sequence
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulsing glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <GradientBackground variant="karaoke">
      <View style={styles.container}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Surprise header */}
          <Text style={styles.surpriseLabel}>SURPRISE!</Text>
          <Text style={styles.title}>Legendary Artists Unlocked!</Text>
          <Text style={styles.subtitle}>
            These icons are now available for your lineup
          </Text>

          {/* Surprise artist cards */}
          {state.revealedSurprises.map((artist, index) => (
            <Animated.View
              key={artist.id}
              style={[
                styles.surpriseCard,
                {
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <Animated.View style={[styles.glowBorder, { opacity: glowAnim }]} />

              <View style={styles.cardContent}>
                <Text style={styles.artistEmoji}>{artist.imageEmoji}</Text>
                <View style={styles.artistInfo}>
                  <Text style={styles.artistName}>{artist.name}</Text>
                  <Text style={styles.artistGenre}>{artist.genre}</Text>
                  {artist.karaokeSong && (
                    <Text style={styles.karaokeSong}>
                      🎤 "{artist.karaokeSong}"
                    </Text>
                  )}
                </View>
                <View style={styles.priceTag}>
                  <Text style={styles.priceText}>${artist.price}</Text>
                </View>
              </View>
            </Animated.View>
          ))}

          {/* Budget reminder */}
          <View style={styles.budgetReminder}>
            <Text style={styles.budgetText}>
              You have ${state.remainingBudget} remaining
            </Text>
            <Text style={styles.budgetSubtext}>
              {state.remainingBudget >= 5
                ? 'Enough for a legendary pick!'
                : state.remainingBudget >= 3
                  ? 'Choose wisely...'
                  : 'Every dollar counts!'}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => dispatch({ type: 'ACKNOWLEDGE_SURPRISE' })}
            accessibilityRole="button"
          >
            <Text style={styles.continueButtonText}>
              Continue to Round {state.currentRound}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  content: {
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
  },
  surpriseLabel: {
    fontSize: fontSize.xxxl,
    fontWeight: '900',
    color: colors.surprise,
    textAlign: 'center',
    letterSpacing: 4,
    marginBottom: spacing.sm,
    textShadowColor: colors.surpriseGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.accentLight,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  surpriseCard: {
    width: '100%',
    marginVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  glowBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 2,
    borderColor: colors.surprise,
    borderRadius: borderRadius.lg,
    shadowColor: colors.surprise,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  artistEmoji: {
    fontSize: 48,
    marginRight: spacing.md,
  },
  artistInfo: {
    flex: 1,
  },
  artistName: {
    fontSize: fontSize.xl,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  artistGenre: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  karaokeSong: {
    fontSize: fontSize.xs,
    color: colors.karaoke,
    marginTop: 4,
  },
  priceTag: {
    backgroundColor: colors.surprise,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  priceText: {
    color: colors.white,
    fontSize: fontSize.xl,
    fontWeight: '900',
  },
  budgetReminder: {
    marginTop: spacing.xl,
    padding: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: borderRadius.md,
    alignItems: 'center',
    width: '100%',
  },
  budgetText: {
    color: colors.accentLight,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  budgetSubtext: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  continueButton: {
    backgroundColor: colors.surprise,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    marginTop: spacing.xl,
    minWidth: 250,
    alignItems: 'center',
  },
  continueButtonText: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: '800',
  },
});
