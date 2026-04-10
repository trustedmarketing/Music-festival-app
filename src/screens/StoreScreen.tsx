import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  Platform, Alert,
} from 'react-native';
import { GradientBackground } from '../components/GradientBackground';
import { useGame } from '../context/GameContext';
import { STORE_ITEMS, StoreItem } from '../data/store';
import { colors, fontSize, spacing, borderRadius } from '../utils/theme';

export function StoreScreen() {
  const { state, dispatch } = useGame();

  const handlePurchase = (item: StoreItem) => {
    // In production, this would trigger the platform's IAP flow
    // (Apple StoreKit / Google Play Billing)
    Alert.alert(
      'Purchase Points',
      `Add ${item.pointsAwarded} points to your budget for ${item.priceDisplay}?\n\n(In production, this connects to App Store / Google Play)`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Buy',
          onPress: () => {
            dispatch({ type: 'ADD_BUDGET_POINTS', points: item.pointsAwarded });
            Alert.alert(
              'Purchase Complete!',
              `+$${item.pointsAwarded} added to your budget!\n\nNew budget: $${state.remainingBudget + item.pointsAwarded}`,
              [{ text: 'Nice!' }]
            );
          },
        },
      ]
    );
  };

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Point Shop</Text>
        <Text style={styles.subtitle}>
          Need more budget for your dream lineup? Grab some extra points!
        </Text>

        {/* Current balance */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Current Budget</Text>
          <Text style={styles.balanceAmount}>${state.remainingBudget}</Text>
          <Text style={styles.balanceDetail}>
            of ${state.totalBudget} total ({state.totalBudget - state.remainingBudget} spent)
          </Text>
        </View>

        {/* Store items */}
        <View style={styles.storeGrid}>
          {STORE_ITEMS.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.storeCard,
                item.popular && styles.storeCardPopular,
                item.bestValue && styles.storeCardBestValue,
              ]}
              onPress={() => handlePurchase(item)}
              accessibilityRole="button"
              accessibilityLabel={`${item.name}: ${item.description} for ${item.priceDisplay}`}
            >
              {item.popular && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>POPULAR</Text>
                </View>
              )}
              {item.bestValue && (
                <View style={[styles.badge, styles.badgeBestValue]}>
                  <Text style={styles.badgeText}>BEST VALUE</Text>
                </View>
              )}

              <Text style={styles.itemEmoji}>{item.emoji}</Text>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDesc}>{item.description}</Text>

              <View style={styles.priceButton}>
                <Text style={styles.priceButtonText}>{item.priceDisplay}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Earn free points callout */}
        <View style={styles.freePointsCard}>
          <Text style={styles.freePointsTitle}>Earn Free Points!</Text>
          <View style={styles.freePointsRow}>
            <Text style={styles.freePointsEmoji}>📤</Text>
            <Text style={styles.freePointsText}>Share your poster — earn XP and level up for budget increases</Text>
          </View>
          <View style={styles.freePointsRow}>
            <Text style={styles.freePointsEmoji}>⚔️</Text>
            <Text style={styles.freePointsText}>Win H2H battles — earn XP toward budget upgrades</Text>
          </View>
          <View style={styles.freePointsRow}>
            <Text style={styles.freePointsEmoji}>❤️</Text>
            <Text style={styles.freePointsText}>Get social likes & DMs — every engagement grows your balance</Text>
          </View>
        </View>

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
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '900',
    color: colors.accentLight,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    maxWidth: 350,
  },
  balanceCard: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 2,
    borderColor: colors.accent,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    marginBottom: spacing.xl,
  },
  balanceLabel: {
    fontSize: fontSize.sm,
    color: colors.accentLight,
    fontWeight: '600',
    letterSpacing: 2,
  },
  balanceAmount: {
    fontSize: fontSize.xxxl,
    fontWeight: '900',
    color: colors.accentLight,
    marginVertical: spacing.xs,
  },
  balanceDetail: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  storeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'center',
    marginBottom: spacing.xl,
    width: '100%',
    maxWidth: 400,
  },
  storeCard: {
    width: '47%',
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  storeCardPopular: {
    borderColor: colors.primaryLight,
    borderWidth: 2,
  },
  storeCardBestValue: {
    borderColor: colors.accent,
    borderWidth: 2,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderBottomLeftRadius: borderRadius.sm,
  },
  badgeBestValue: {
    backgroundColor: colors.accent,
  },
  badgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  itemEmoji: {
    fontSize: 40,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  itemName: {
    fontSize: fontSize.md,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  itemDesc: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  priceButton: {
    backgroundColor: colors.success,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  priceButtonText: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: '800',
  },
  freePointsCard: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 400,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  freePointsTitle: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.primaryLight,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  freePointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xs,
  },
  freePointsEmoji: {
    fontSize: 20,
    marginRight: spacing.sm,
    width: 30,
  },
  freePointsText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: fontSize.sm * 1.4,
  },
  backButton: {
    paddingVertical: spacing.md,
  },
  backButtonText: {
    color: colors.primaryLight,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
});
