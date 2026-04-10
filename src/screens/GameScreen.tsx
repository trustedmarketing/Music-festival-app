import React, { useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, FlatList,
  Platform,
} from 'react-native';
import { GradientBackground } from '../components/GradientBackground';
import { BudgetTracker } from '../components/BudgetTracker';
import { ArtistCard } from '../components/ArtistCard';
import { useGame } from '../context/GameContext';
import { Artist } from '../data/artists';
import { colors, fontSize, spacing, borderRadius } from '../utils/theme';

export function GameScreen() {
  const { state, dispatch } = useGame();
  const scrollRef = useRef<FlatList>(null);

  const currentRoundStart = state.roundSelections.flat().length;
  const currentRoundSelections = state.selectedArtists.slice(currentRoundStart);
  const currentRoundSpend = currentRoundSelections.reduce((s, a) => s + a.price, 0);

  // Artists are already limited to 5 per round (one at each $1-$5 price)
  const displayArtists = state.availableArtists;

  const handleSelectArtist = (artist: Artist) => {
    if (state.selectedArtists.find(a => a.id === artist.id)) {
      dispatch({ type: 'DESELECT_ARTIST', artistId: artist.id });
    } else {
      dispatch({ type: 'SELECT_ARTIST', artist });
    }
  };

  const handleConfirmRound = () => {
    dispatch({ type: 'CONFIRM_ROUND' });
  };

  const renderArtist = ({ item }: { item: Artist }) => {
    const isSelected = state.selectedArtists.some(a => a.id === item.id);
    const isAffordable = state.remainingBudget >= item.price;
    const isSurprise = item.isSurprise;

    return (
      <ArtistCard
        artist={item}
        isSelected={isSelected}
        isAffordable={isAffordable}
        isSurprise={isSurprise}
        onPress={() => handleSelectArtist(item)}
      />
    );
  };

  const renderHeader = () => (
    <View>
      <BudgetTracker
        total={state.totalBudget}
        remaining={state.remainingBudget}
        currentRound={state.currentRound}
        totalRounds={5}
      />

      {/* Current Round Selections Summary */}
      {currentRoundSelections.length > 0 && (
        <View style={styles.selectionSummary}>
          <Text style={styles.selectionTitle}>
            This round: {currentRoundSelections.length} artist{currentRoundSelections.length !== 1 ? 's' : ''} (${currentRoundSpend})
          </Text>
          <View style={styles.selectedChips}>
            {currentRoundSelections.map(a => (
              <TouchableOpacity
                key={a.id}
                style={styles.selectedChip}
                onPress={() => dispatch({ type: 'DESELECT_ARTIST', artistId: a.id })}
              >
                <Text style={styles.selectedChipText}>
                  {a.imageEmoji} {a.name} · ${a.price} ✕
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Previously selected artists */}
      {state.roundSelections.length > 0 && (
        <View style={styles.previousSelections}>
          <Text style={styles.previousTitle}>Lineup so far:</Text>
          <View style={styles.previousChips}>
            {state.roundSelections.flat().map(a => (
              <View key={a.id} style={styles.previousChip}>
                <Text style={styles.previousChipText}>{a.imageEmoji} {a.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>
        Pick Your Artist — Round {state.currentRound}
      </Text>
      <Text style={styles.sectionSubtitle}>
        One option at each price point ($1–$5)
      </Text>
    </View>
  );

  return (
    <GradientBackground>
      <View style={styles.container}>
        {/* Header with back and festival name */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => dispatch({ type: 'BACK_TO_MENU' })}
          >
            <Text style={styles.homeButtonText}>← Home</Text>
          </TouchableOpacity>
          <Text style={styles.festivalName}>{state.festivalName}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <FlatList
          ref={scrollRef}
          data={displayArtists}
          keyExtractor={item => item.id}
          renderItem={renderArtist}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        {/* Confirm Round Button — must pick at least 1 artist */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.confirmButton,
              currentRoundSelections.length === 0 && styles.confirmButtonDisabled,
            ]}
            onPress={handleConfirmRound}
            disabled={currentRoundSelections.length === 0}
            accessibilityRole="button"
            accessibilityLabel={
              state.currentRound >= 5
                ? 'Finish lineup'
                : `Confirm round ${state.currentRound} selections`
            }
          >
            <Text style={styles.confirmButtonText}>
              {currentRoundSelections.length === 0
                ? 'Pick at least 1 artist!'
                : state.currentRound >= 5
                  ? `Finish Lineup! (${state.selectedArtists.length} artists)`
                  : `Lock In Round ${state.currentRound} (${currentRoundSelections.length} pick${currentRoundSelections.length !== 1 ? 's' : ''})`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  homeButton: {
    paddingVertical: spacing.xs,
    paddingRight: spacing.sm,
    minWidth: 70,
  },
  homeButtonText: {
    color: colors.primaryLight,
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  headerSpacer: {
    minWidth: 70,
  },
  festivalName: {
    fontSize: fontSize.lg,
    fontWeight: '900',
    color: colors.accentLight,
    textAlign: 'center',
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: 100,
  },
  selectionSummary: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  selectionTitle: {
    color: colors.accentLight,
    fontSize: fontSize.sm,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  selectedChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  selectedChip: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  selectedChipText: {
    color: colors.accentLight,
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  previousSelections: {
    padding: spacing.md,
    marginVertical: spacing.xs,
  },
  previousTitle: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  previousChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  previousChip: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  previousChipText: {
    color: colors.primaryLight,
    fontSize: fontSize.xs,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: '800',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginBottom: spacing.sm,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.md,
    backgroundColor: 'rgba(13, 13, 43, 0.95)',
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: 'rgba(139, 92, 246, 0.25)',
    opacity: 0.6,
  },
  confirmButtonText: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: '800',
  },
});
