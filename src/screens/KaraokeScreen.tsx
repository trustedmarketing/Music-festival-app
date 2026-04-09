import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated,
  Platform,
} from 'react-native';
import { GradientBackground } from '../components/GradientBackground';
import { useGame } from '../context/GameContext';
import { Artist } from '../data/artists';
import { colors, fontSize, spacing, borderRadius } from '../utils/theme';

export function KaraokeScreen() {
  const { state, dispatch } = useGame();
  const [isPlaying, setIsPlaying] = useState(false);
  const [lyricIndex, setLyricIndex] = useState(0);
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Get the highest-priced artist from the last round
  const lastRound = state.roundSelections[state.roundSelections.length - 1] || [];
  const karaokeArtist = lastRound.reduce<Artist | null>(
    (highest, artist) => (!highest || artist.price > highest.price ? artist : highest),
    null
  );

  // Simulated lyrics for karaoke display
  const sampleLyrics = [
    'Get ready to sing...',
    `Now playing: "${karaokeArtist?.karaokeSong || 'Hit Song'}"`,
    'La la la la la...',
    'Sing your heart out!',
    'You\'re a star!',
    'Keep going...',
    'Almost there...',
    'What a performance!',
  ];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    // Bounce animation for the mic
    const bounce = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );
    bounce.start();

    // Progress bar
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 8000,
      useNativeDriver: false,
    }).start();

    // Cycle through lyrics
    const interval = setInterval(() => {
      setLyricIndex(prev => {
        if (prev >= sampleLyrics.length - 1) {
          clearInterval(interval);
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      bounce.stop();
    };
  }, [isPlaying]);

  if (!karaokeArtist) {
    return (
      <GradientBackground variant="karaoke">
        <View style={styles.container}>
          <Text style={styles.skipText}>No artists selected this round</Text>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => dispatch({ type: 'FINISH_KARAOKE' })}
          >
            <Text style={styles.skipButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground variant="karaoke">
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerLabel}>KARAOKE TIME</Text>
          <Text style={styles.roundInfo}>
            Between Round {state.currentRound} & {state.currentRound + 1}
          </Text>
        </View>

        {/* Artist info */}
        <View style={styles.artistSection}>
          <Animated.Text
            style={[styles.artistEmoji, { transform: [{ scale: bounceAnim }] }]}
          >
            {karaokeArtist.imageEmoji}
          </Animated.Text>
          <Text style={styles.artistName}>{karaokeArtist.name}</Text>
          <Text style={styles.songName}>
            "{karaokeArtist.karaokeSong || 'Greatest Hit'}"
          </Text>
        </View>

        {/* Lyrics display */}
        <View style={styles.lyricsContainer}>
          {isPlaying ? (
            <>
              <Text style={styles.lyricText}>{sampleLyrics[lyricIndex]}</Text>
              {/* Karaoke dots */}
              <View style={styles.dotsContainer}>
                {sampleLyrics.map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.dot,
                      i <= lyricIndex && styles.dotActive,
                      i === lyricIndex && styles.dotCurrent,
                    ]}
                  />
                ))}
              </View>
            </>
          ) : lyricIndex >= sampleLyrics.length - 1 ? (
            <View style={styles.scoreSection}>
              <Text style={styles.scoreEmoji}>🌟</Text>
              <Text style={styles.scoreText}>Amazing Performance!</Text>
              <Text style={styles.scoreSubtext}>
                The crowd loved your rendition of "{karaokeArtist.karaokeSong}"
              </Text>
            </View>
          ) : (
            <Text style={styles.tapToStart}>Tap the mic to start singing!</Text>
          )}
        </View>

        {/* Progress bar during playback */}
        {isPlaying && (
          <View style={styles.progressContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
        )}

        {/* Controls */}
        <View style={styles.controls}>
          {!isPlaying && lyricIndex === 0 && (
            <TouchableOpacity
              style={styles.micButton}
              onPress={() => setIsPlaying(true)}
              accessibilityRole="button"
              accessibilityLabel="Start karaoke"
            >
              <Text style={styles.micEmoji}>🎤</Text>
              <Text style={styles.micText}>Tap to Sing!</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.continueButton,
              isPlaying && styles.continueButtonDimmed,
            ]}
            onPress={() => dispatch({ type: 'FINISH_KARAOKE' })}
            accessibilityRole="button"
          >
            <Text style={styles.continueButtonText}>
              {lyricIndex >= sampleLyrics.length - 1
                ? 'Continue to Next Round'
                : 'Skip Karaoke'}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  headerLabel: {
    fontSize: fontSize.xxl,
    fontWeight: '900',
    color: colors.karaoke,
    letterSpacing: 3,
    textShadowColor: 'rgba(236, 72, 153, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  roundInfo: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  artistSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  artistEmoji: {
    fontSize: 80,
    marginBottom: spacing.md,
  },
  artistName: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  songName: {
    fontSize: fontSize.lg,
    color: colors.karaoke,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
  lyricsContainer: {
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
    width: '100%',
    maxWidth: 400,
  },
  lyricText: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    textShadowColor: 'rgba(236, 72, 153, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dotActive: {
    backgroundColor: colors.karaoke,
  },
  dotCurrent: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.white,
  },
  tapToStart: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  scoreSection: {
    alignItems: 'center',
  },
  scoreEmoji: {
    fontSize: 60,
    marginBottom: spacing.sm,
  },
  scoreText: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.accentLight,
  },
  scoreSubtext: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  progressContainer: {
    width: '100%',
    maxWidth: 300,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    marginBottom: spacing.xl,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.karaoke,
    borderRadius: 2,
  },
  controls: {
    alignItems: 'center',
    gap: spacing.md,
  },
  micButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.karaoke,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.karaoke,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: spacing.md,
  },
  micEmoji: {
    fontSize: 36,
  },
  micText: {
    color: colors.white,
    fontSize: fontSize.xs,
    fontWeight: '700',
    marginTop: 2,
  },
  continueButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.6)',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    minWidth: 220,
    alignItems: 'center',
  },
  continueButtonDimmed: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  skipText: {
    color: colors.textSecondary,
    fontSize: fontSize.lg,
    marginBottom: spacing.lg,
  },
  skipButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  skipButtonText: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
});
