import React, { useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  Platform, Share, Alert,
} from 'react-native';
import { GradientBackground } from '../components/GradientBackground';
import { useGame } from '../context/GameContext';
import { formatNumber } from '../utils/prediction';
import { colors, fontSize, spacing, borderRadius } from '../utils/theme';

export function PosterScreen() {
  const { state, dispatch } = useGame();
  const totalSpent = state.totalBudget - state.remainingBudget;

  const headliners = state.selectedArtists.filter(a => a.price >= 4);
  const mainActs = state.selectedArtists.filter(a => a.price === 3);
  const supporting = state.selectedArtists.filter(a => a.price <= 2);

  const handleShare = async () => {
    const lineupText = state.selectedArtists
      .sort((a, b) => b.price - a.price)
      .map(a => `${a.imageEmoji} ${a.name}`)
      .join('\n');

    const message =
      `🎪 ${state.festivalName} 🎪\n` +
      `📍 ${state.currentVenue.emoji} ${state.currentVenue.name}\n\n` +
      `THE LINEUP:\n${lineupText}\n\n` +
      `🎟️ Predicted attendance: ${formatNumber(state.lastPredictedAttendance)}\n\n` +
      `Would you go? Reply "count me in!" 🙌\n` +
      `Built with Festival Lineup Builder 🎵`;

    try {
      await Share.share({
        message,
        title: `${state.festivalName} - My Dream Festival`,
      });
      dispatch({ type: 'SHARE_POSTER' });
    } catch (error) {
      // User cancelled share
    }
  };

  const simulateSocialEngagement = () => {
    // Simulate receiving likes and DMs (in production this would come from social APIs)
    const likes = Math.floor(Math.random() * 20) + 5;
    const dms = Math.floor(Math.random() * 5) + 1;

    dispatch({ type: 'ADD_SOCIAL_LIKES', count: likes });
    dispatch({ type: 'ADD_SOCIAL_DMS', count: dms });

    Alert.alert(
      '📱 Social Update!',
      `Your poster got ${likes} likes and ${dms} "count me in" DMs!\n\n` +
      `+${likes * 2} XP from likes\n+${dms * 5} XP from DMs\n\n` +
      `Keep sharing to unlock legendary artists!`,
      [{ text: 'Nice!' }]
    );
  };

  return (
    <GradientBackground variant="results">
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Festival Poster */}
        <View style={styles.poster}>
          <View style={styles.posterBorder}>
            {/* Poster header */}
            <View style={styles.posterTop}>
              <Text style={styles.posterDate}>SUMMER 2026</Text>
              <Text style={styles.posterFestName}>{state.festivalName}</Text>
              <Text style={styles.posterVenue}>
                {state.currentVenue.emoji} {state.currentVenue.name}
              </Text>
            </View>

            {/* Headliners */}
            {headliners.length > 0 && (
              <View style={styles.posterTier}>
                {headliners.map(a => (
                  <Text key={a.id} style={styles.posterHeadliner}>
                    {a.imageEmoji} {a.name.toUpperCase()}
                  </Text>
                ))}
              </View>
            )}

            {/* Divider */}
            <View style={styles.posterDivider} />

            {/* Main acts */}
            {mainActs.length > 0 && (
              <View style={styles.posterTier}>
                {mainActs.map(a => (
                  <Text key={a.id} style={styles.posterMainAct}>
                    {a.imageEmoji} {a.name}
                  </Text>
                ))}
              </View>
            )}

            {/* Supporting */}
            {supporting.length > 0 && (
              <View style={[styles.posterTier, styles.posterSupportingRow]}>
                {supporting.map(a => (
                  <Text key={a.id} style={styles.posterSupporting}>
                    {a.name}
                  </Text>
                ))}
              </View>
            )}

            {/* Poster footer */}
            <View style={styles.posterFooter}>
              <Text style={styles.posterAttendance}>
                🎟️ {formatNumber(state.lastPredictedAttendance)} expected
              </Text>
              <Text style={styles.posterCta}>Would you go?</Text>
            </View>
          </View>
        </View>

        {/* Social engagement info */}
        <View style={styles.socialSection}>
          <Text style={styles.socialTitle}>Share & Grow!</Text>
          <Text style={styles.socialDesc}>
            Share your poster on social media. The more likes and "count me in" DMs you get,
            the faster you level up and unlock legendary artists!
          </Text>

          <View style={styles.socialStats}>
            <View style={styles.socialStat}>
              <Text style={styles.socialStatNumber}>{state.playerStats.socialLikes}</Text>
              <Text style={styles.socialStatLabel}>Likes</Text>
            </View>
            <View style={styles.socialStat}>
              <Text style={styles.socialStatNumber}>{state.playerStats.socialDMs}</Text>
              <Text style={styles.socialStatLabel}>Count Me Ins</Text>
            </View>
            <View style={styles.socialStat}>
              <Text style={styles.socialStatNumber}>Lv.{state.playerStats.level}</Text>
              <Text style={styles.socialStatLabel}>Level</Text>
            </View>
          </View>
        </View>

        {/* Action buttons */}
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareButtonText}>📤 Share Poster</Text>
        </TouchableOpacity>

        {state.posterShared && (
          <TouchableOpacity style={styles.simulateButton} onPress={simulateSocialEngagement}>
            <Text style={styles.simulateButtonText}>📱 Check Social Updates</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => dispatch({ type: 'BACK_TO_MENU' })}
        >
          <Text style={styles.backButtonText}>Build New Lineup</Text>
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
    alignItems: 'center',
  },
  poster: {
    width: '100%',
    maxWidth: 400,
    marginBottom: spacing.xl,
  },
  posterBorder: {
    borderWidth: 3,
    borderColor: colors.accentLight,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: spacing.lg,
    alignItems: 'center',
  },
  posterTop: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  posterDate: {
    fontSize: fontSize.sm,
    color: colors.accentLight,
    fontWeight: '700',
    letterSpacing: 3,
  },
  posterFestName: {
    fontSize: fontSize.xxl,
    fontWeight: '900',
    color: colors.white,
    textAlign: 'center',
    marginVertical: spacing.sm,
  },
  posterVenue: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  posterTier: {
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  posterHeadliner: {
    fontSize: fontSize.xl,
    fontWeight: '900',
    color: colors.accentLight,
    textAlign: 'center',
    marginVertical: 2,
  },
  posterMainAct: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginVertical: 1,
  },
  posterSupportingRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  posterSupporting: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  posterDivider: {
    width: '60%',
    height: 1,
    backgroundColor: colors.cardBorder,
    marginVertical: spacing.sm,
  },
  posterFooter: {
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    width: '100%',
  },
  posterAttendance: {
    fontSize: fontSize.md,
    color: colors.primaryLight,
    fontWeight: '700',
  },
  posterCta: {
    fontSize: fontSize.lg,
    color: colors.accentLight,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  socialSection: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  socialTitle: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  socialDesc: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: fontSize.sm * 1.5,
    marginBottom: spacing.md,
  },
  socialStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  socialStat: {
    alignItems: 'center',
  },
  socialStatNumber: {
    fontSize: fontSize.xl,
    fontWeight: '900',
    color: colors.accentLight,
  },
  socialStatLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  shareButton: {
    backgroundColor: '#1DA1F2',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    minWidth: 250,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  shareButtonText: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: '800',
  },
  simulateButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    minWidth: 250,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  simulateButtonText: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  backButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  backButtonText: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
});
