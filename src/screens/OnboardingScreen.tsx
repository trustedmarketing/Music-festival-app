import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, TextInput, StyleSheet,
  ScrollView, Platform, KeyboardAvoidingView,
} from 'react-native';
import { GradientBackground } from '../components/GradientBackground';
import { useGame } from '../context/GameContext';
import { GENRES } from '../data/artists';
import { isSpotifyConfigured } from '../utils/spotify';
import { colors, fontSize, spacing, borderRadius } from '../utils/theme';

type OnboardingStep = 'welcome' | 'name' | 'genres' | 'spotify' | 'ready';

export function OnboardingScreen() {
  const { dispatch } = useGame();
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [festivalName, setFestivalName] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [spotifyConnected, setSpotifyConnected] = useState(false);

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleComplete = () => {
    dispatch({
      type: 'SET_ONBOARDING_COMPLETE',
      favoriteGenres: selectedGenres,
      festivalName: festivalName || 'My Dream Festival',
    });
  };

  const handleSpotifyConnect = async () => {
    // In production, this would trigger the Spotify OAuth flow
    // For now, we simulate a connection
    setSpotifyConnected(true);
    setTimeout(() => setStep('ready'), 1000);
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {step === 'welcome' && (
            <View style={styles.stepContainer}>
              <Text style={styles.festivalEmoji}>🎪</Text>
              <Text style={styles.title}>Festival Lineup Builder</Text>
              <Text style={styles.subtitle}>
                Build your dream music festival lineup with a $15 budget across 5 rounds!
              </Text>
              <View style={styles.featureList}>
                <FeatureItem emoji="🎵" text="Pick artists from $1 to $5" />
                <FeatureItem emoji="🎤" text="Karaoke between rounds" />
                <FeatureItem emoji="✨" text="Surprise legendary artists" />
                <FeatureItem emoji="📊" text="Predict your festival attendance" />
              </View>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => setStep('name')}
                accessibilityRole="button"
              >
                <Text style={styles.primaryButtonText}>Let's Go!</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 'name' && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepEmoji}>🎪</Text>
              <Text style={styles.title}>Name Your Festival</Text>
              <Text style={styles.subtitle}>What will you call your dream festival?</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Starlight Music Fest"
                placeholderTextColor={colors.textMuted}
                value={festivalName}
                onChangeText={setFestivalName}
                maxLength={30}
                autoFocus
                accessibilityLabel="Festival name"
              />
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => setStep('genres')}
                accessibilityRole="button"
              >
                <Text style={styles.primaryButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 'genres' && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepEmoji}>🎶</Text>
              <Text style={styles.title}>Your Favorite Genres</Text>
              <Text style={styles.subtitle}>
                Select genres you love — we'll personalize your artist picks!
              </Text>
              <View style={styles.genreGrid}>
                {GENRES.map(genre => (
                  <TouchableOpacity
                    key={genre}
                    style={[
                      styles.genreChip,
                      selectedGenres.includes(genre) && styles.genreChipSelected,
                    ]}
                    onPress={() => toggleGenre(genre)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: selectedGenres.includes(genre) }}
                  >
                    <Text style={[
                      styles.genreChipText,
                      selectedGenres.includes(genre) && styles.genreChipTextSelected,
                    ]}>
                      {genre}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => setStep(isSpotifyConfigured() ? 'spotify' : 'ready')}
                accessibilityRole="button"
              >
                <Text style={styles.primaryButtonText}>
                  {selectedGenres.length > 0 ? 'Next' : 'Skip'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 'spotify' && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepEmoji}>🎧</Text>
              <Text style={styles.title}>Connect Spotify</Text>
              <Text style={styles.subtitle}>
                Link your Spotify to personalize artist recommendations based on your listening history.
              </Text>
              {!spotifyConnected ? (
                <>
                  <TouchableOpacity
                    style={[styles.primaryButton, styles.spotifyButton]}
                    onPress={handleSpotifyConnect}
                    accessibilityRole="button"
                  >
                    <Text style={styles.primaryButtonText}>Connect Spotify</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => setStep('ready')}
                    accessibilityRole="button"
                  >
                    <Text style={styles.secondaryButtonText}>Skip</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={styles.connectedContainer}>
                  <Text style={styles.connectedText}>Connected!</Text>
                  <Text style={styles.connectedSubtext}>Loading your top artists...</Text>
                </View>
              )}
            </View>
          )}

          {step === 'ready' && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepEmoji}>🚀</Text>
              <Text style={styles.title}>You're All Set!</Text>
              <Text style={styles.subtitle}>
                {festivalName || 'Your festival'} awaits.{'\n'}
                You have $15 to build the ultimate lineup across 5 rounds.
              </Text>
              <View style={styles.rulesContainer}>
                <RuleItem number="1" text="Choose artists each round ($1-$5)" />
                <RuleItem number="2" text="Don't exceed your $15 total budget" />
                <RuleItem number="3" text="Karaoke between rounds!" />
                <RuleItem number="4" text="Watch for surprise artists" />
                <RuleItem number="5" text="See your predicted attendance!" />
              </View>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleComplete}
                accessibilityRole="button"
              >
                <Text style={styles.primaryButtonText}>Start Building! 🎪</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

function FeatureItem({ emoji, text }: { emoji: string; text: string }) {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureEmoji}>{emoji}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

function RuleItem({ number, text }: { number: string; text: string }) {
  return (
    <View style={styles.ruleItem}>
      <View style={styles.ruleNumber}>
        <Text style={styles.ruleNumberText}>{number}</Text>
      </View>
      <Text style={styles.ruleText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
  },
  stepContainer: {
    alignItems: 'center',
  },
  festivalEmoji: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  stepEmoji: {
    fontSize: 60,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '900',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: fontSize.md * 1.5,
    marginBottom: spacing.xl,
    maxWidth: 400,
  },
  featureList: {
    width: '100%',
    maxWidth: 350,
    marginBottom: spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  featureEmoji: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  featureText: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  input: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSize.lg,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
    maxWidth: 400,
  },
  genreChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.cardBg,
  },
  genreChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryLight,
  },
  genreChipText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  genreChipTextSelected: {
    color: colors.white,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    minWidth: 200,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: '800',
  },
  spotifyButton: {
    backgroundColor: '#1DB954',
  },
  secondaryButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
  },
  secondaryButtonText: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  connectedContainer: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  connectedText: {
    color: colors.success,
    fontSize: fontSize.xl,
    fontWeight: '800',
  },
  connectedSubtext: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    marginTop: spacing.sm,
  },
  rulesContainer: {
    width: '100%',
    maxWidth: 350,
    marginBottom: spacing.lg,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  ruleNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  ruleNumberText: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: '800',
  },
  ruleText: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    flex: 1,
  },
});
