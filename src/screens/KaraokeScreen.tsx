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
  const [progress, setProgress] = useState(0);
  const [showLyrics, setShowLyrics] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Get the highest-priced artist from the last round's selections
  const lastRoundIndex = state.roundSelections.length - 1;
  const lastRoundPicks = state.roundSelections[lastRoundIndex] || [];
  const karaokeArtist = lastRoundPicks.reduce<Artist | null>(
    (highest, artist) => (!highest || artist.price > highest.price ? artist : highest),
    null
  );

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();

      progressRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            if (progressRef.current) clearInterval(progressRef.current);
            setIsPlaying(false);
            return 100;
          }
          return prev + 2;
        });
      }, 200);

      return () => {
        if (progressRef.current) clearInterval(progressRef.current);
      };
    } else {
      pulseAnim.setValue(1);
    }
  }, [isPlaying]);

  const handleStartKaraoke = () => {
    setIsPlaying(true);
    setShowLyrics(true);
    setProgress(0);
  };

  const handleSkip = () => {
    if (progressRef.current) clearInterval(progressRef.current);
    dispatch({ type: 'FINISH_KARAOKE' });
  };

  const getLyricLine = (): string => {
    if (!karaokeArtist?.karaokeSong) return '';
    const lines = [
      `Now performing: "${karaokeArtist.karaokeSong}"`,
      '...',
      'Sing your heart out!',
      `You're a natural ${karaokeArtist.genre} star!`,
      'The crowd goes wild!',
      'Amazing performance!',
    ];
    const index = Math.min(Math.floor(progress / 18), lines.length - 1);
    return lines[index];
  };

  if (!karaokeArtist) {
    return (
      <GradientBackground variant="karaoke">
        <View style={styles.container}>
          <Text style={styles.skipMessage}>No artists picked this round!</Text>
          <TouchableOpacity style={styles.continueButton} onPress={handleSkip}>
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground variant="karaoke">
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <Text style={styles.karaokeLabel}>KARAOKE TIME</Text>
          <Text style={styles.roundInfo}>
            Between Round {state.currentRound} & {state.currentRound + 1}
          </Text>
        </View>

        <View style={styles.artistSection}>
          <Text style={styles.artistEmoji}>{karaokeArtist.imageEmoji}</Text>
          <Text style={styles.songTitle}>"{karaokeArtist.karaokeSong}"</Text>
          <Text style={styles.artistName}>by {karaokeArtist.name}</Text>
          <Text style={styles.priceNote}>
            Your ${karaokeArtist.price} pick — the highest this round!
          </Text>
        </View>

        <View style={styles.micSection}>
          {!isPlaying && progress === 0 ? (
            <TouchableOpacity
              style={styles.micButton}
              onPress={handleStartKaraoke}
              accessibilityRole="button"
              accessibilityLabel="Start karaoke"
            >
              <Animated.Text style={[styles.micEmoji, { transform: [{ scale: pulseAnim }] }]}>
                🎤
              </Animated.Text>
              <Text style={styles.micLabel}>Tap to Sing!</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.playingSection}>
              <Animated.Text style={[styles.micEmojiPlaying, { transform: [{ scale: pulseAnim }] }]}>
                🎤
              </Animated.Text>

              {showLyrics && (
                <View style={styles.lyricsContainer}>
                  <Text style={styles.lyricsText}>{getLyricLine()}</Text>
                </View>
              )}

              <View style={styles.visualizer}>
                {Array.from({ length: 12 }, (_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.visualizerBar,
                      {
                        height: isPlaying ? 10 + Math.random() * 40 : 10,
                        backgroundColor: i % 2 === 0 ? colors.karaoke : colors.primaryLight,
                      },
                    ]}
                  />
                ))}
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progress}%` }]} />
                </View>
                <Text style={styles.progressText}>
                  {progress >= 100 ? 'Encore!' : `${Math.round(progress)}%`}
                </Text>
              </View>
            </View>
          )}
        </View>

        {progress >= 100 && (
          <View style={styles.scoreSection}>
            <Text style={styles.scoreText}>Standing Ovation!</Text>
            <Text style={styles.scoreSubtext}>The crowd loved your performance</Text>
          </View>
        )}

        <View style={styles.buttonSection}>
          {progress >= 100 ? (
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleSkip}
              accessibilityRole="button"
            >
              <Text style={styles.continueButtonText}>
                On to Round {state.currentRound + 1}!
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkip}
              accessibilityRole="button"
            >
              <Text style={styles.skipButtonText}>
                {isPlaying ? 'Skip Song' : 'Skip Karaoke'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  karaokeLabel: {
    fontSize: fontSize.xxl,
    fontWeight: '900',
    color: colors.karaoke,
    letterSpacing: 3,
    textShadowColor: 'rgba(236, 72, 153, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
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
    fontSize: 64,
    marginBottom: spacing.sm,
  },
  songTitle: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  artistName: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  priceNote: {
    fontSize: fontSize.sm,
    color: colors.accentLight,
    marginTop: spacing.xs,
  },
  micSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButton: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  micEmoji: {
    fontSize: 100,
  },
  micLabel: {
    fontSize: fontSize.lg,
    color: colors.karaoke,
    fontWeight: '700',
    marginTop: spacing.md,
  },
  playingSection: {
    alignItems: 'center',
    width: '100%',
  },
  micEmojiPlaying: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  lyricsContainer: {
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginVertical: spacing.md,
    width: '100%',
    alignItems: 'center',
    minHeight: 60,
    justifyContent: 'center',
  },
  lyricsText: {
    fontSize: fontSize.lg,
    color: colors.textPrimary,
    textAlign: 'center',
    fontWeight: '600',
  },
  visualizer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 50,
    gap: 4,
    marginVertical: spacing.md,
  },
  visualizerBar: {
    width: 8,
    borderRadius: 4,
    minHeight: 10,
  },
  progressContainer: {
    width: '100%',
    marginTop: spacing.md,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.karaoke,
    borderRadius: borderRadius.full,
  },
  progressText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  scoreSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  scoreText: {
    fontSize: fontSize.xl,
    fontWeight: '900',
    color: colors.accentLight,
    marginTop: spacing.sm,
  },
  scoreSubtext: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  buttonSection: {
    paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.lg,
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: colors.karaoke,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    minWidth: 250,
    alignItems: 'center',
  },
  continueButtonText: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: '800',
  },
  skipButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  skipButtonText: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  skipMessage: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
