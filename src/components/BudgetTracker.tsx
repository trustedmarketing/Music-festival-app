import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontSize, spacing, borderRadius } from '../utils/theme';

interface BudgetTrackerProps {
  total: number;
  remaining: number;
  currentRound: number;
  totalRounds: number;
}

export function BudgetTracker({ total, remaining, currentRound, totalRounds }: BudgetTrackerProps) {
  const spent = total - remaining;
  const percentage = (remaining / total) * 100;

  const budgetColor = percentage > 50 ? colors.budgetGood
    : percentage > 20 ? colors.budgetWarning
    : colors.budgetLow;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.roundText}>Round {currentRound}/{totalRounds}</Text>
        <Text style={[styles.budgetText, { color: budgetColor }]}>
          ${remaining} remaining
        </Text>
      </View>

      {/* Budget bar */}
      <View style={styles.barContainer}>
        <View style={styles.barBackground}>
          <View
            style={[
              styles.barFill,
              {
                width: `${percentage}%`,
                backgroundColor: budgetColor,
              },
            ]}
          />
          {/* Spent segments */}
          {Array.from({ length: total }, (_, i) => (
            <View
              key={i}
              style={[
                styles.barSegment,
                { left: `${(i / total) * 100}%` },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Dollar indicators */}
      <View style={styles.dollarRow}>
        {Array.from({ length: total }, (_, i) => (
          <Text
            key={i}
            style={[
              styles.dollarSign,
              { color: i < spent ? colors.textMuted : budgetColor },
            ]}
          >
            $
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  roundText: {
    color: colors.primaryLight,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  budgetText: {
    fontSize: fontSize.lg,
    fontWeight: '800',
  },
  barContainer: {
    marginVertical: spacing.xs,
  },
  barBackground: {
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    position: 'relative',
  },
  barFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  barSegment: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  dollarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  dollarSign: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
});
