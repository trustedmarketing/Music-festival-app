import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Artist } from '../data/artists';
import { colors, fontSize, spacing, borderRadius } from '../utils/theme';

interface ArtistCardProps {
  artist: Artist;
  isSelected: boolean;
  isAffordable: boolean;
  isSurprise?: boolean;
  onPress: () => void;
}

export function ArtistCard({ artist, isSelected, isAffordable, isSurprise, onPress }: ArtistCardProps) {
  const disabled = !isSelected && !isAffordable;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isSelected && styles.cardSelected,
        isSurprise && styles.cardSurprise,
        disabled && styles.cardDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${artist.name}, ${artist.genre}, $${artist.price}${isSelected ? ', selected' : ''}`}
      accessibilityState={{ selected: isSelected, disabled }}
      {...(Platform.isTV ? { hasTVPreferredFocus: false } : {})}
    >
      {isSurprise && (
        <View style={styles.surpriseBadge}>
          <Text style={styles.surpriseBadgeText}>SURPRISE!</Text>
        </View>
      )}

      <View style={styles.emojiContainer}>
        <Text style={styles.emoji}>{artist.imageEmoji}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{artist.name}</Text>
        <Text style={styles.genre}>{artist.genre}</Text>
      </View>

      <View style={styles.priceContainer}>
        <Text style={[
          styles.price,
          isSelected && styles.priceSelected,
          disabled && styles.priceDisabled,
        ]}>
          ${artist.price}
        </Text>
        {isSelected && <Text style={styles.checkmark}>✓</Text>}
      </View>

      {/* Popularity indicator */}
      <View style={styles.popularityBar}>
        <View style={[styles.popularityFill, { width: `${artist.popularity}%` }]} />
      </View>
    </TouchableOpacity>
  );
}

// Price tag component for displaying price tiers
export function PriceTag({ price }: { price: number }) {
  const tier = price >= 5 ? 'Headliner' : price >= 4 ? 'Major' : price >= 3 ? 'Popular' : price >= 2 ? 'Rising' : 'Emerging';
  const tierColor = price >= 5 ? colors.accent : price >= 4 ? colors.primaryLight : price >= 3 ? colors.success : price >= 2 ? colors.textSecondary : colors.textMuted;

  return (
    <View style={[styles.priceTagContainer, { borderColor: tierColor }]}>
      <Text style={[styles.priceTagText, { color: tierColor }]}>{tier} · ${price}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginVertical: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  cardSelected: {
    backgroundColor: colors.cardSelected,
    borderColor: colors.cardSelectedBorder,
    borderWidth: 2,
  },
  cardSurprise: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: colors.surprise,
    borderWidth: 2,
  },
  cardDisabled: {
    opacity: 0.4,
  },
  surpriseBadge: {
    position: 'absolute',
    top: -1,
    right: -1,
    backgroundColor: colors.surprise,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderBottomLeftRadius: borderRadius.sm,
    borderTopRightRadius: borderRadius.lg,
  },
  surpriseBadgeText: {
    color: colors.white,
    fontSize: fontSize.xs,
    fontWeight: '900',
    letterSpacing: 1,
  },
  emojiContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  emoji: {
    fontSize: 24,
  },
  info: {
    flex: 1,
  },
  name: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  genre: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  priceContainer: {
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  price: {
    color: colors.accent,
    fontSize: fontSize.xl,
    fontWeight: '900',
  },
  priceSelected: {
    color: colors.accentLight,
  },
  priceDisabled: {
    color: colors.textMuted,
  },
  checkmark: {
    color: colors.success,
    fontSize: fontSize.md,
    fontWeight: '800',
    marginTop: 2,
  },
  popularityBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  popularityFill: {
    height: '100%',
    backgroundColor: colors.primaryLight,
    opacity: 0.4,
  },
  priceTagContainer: {
    borderWidth: 1,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  priceTagText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
  },
});
