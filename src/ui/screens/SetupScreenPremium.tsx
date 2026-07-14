/**
 * Premium Setup Screen
 * Polished, professional UI with refined design system
 * Note: Updated to support game types (defaults to Disc Golf)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { theme } from '../theme';
import { RoundState, Player } from '../../types/game';
import { GameType, DEFAULT_CONFIGS } from '../../types/gameTypes';
import { getDefaultDecks } from '../../state/defaultDecks';
import { generateUUID } from '../../utils/uuid';

interface SetupScreenPremiumProps {
  gameType?: GameType;
  onStartRound: (roundState: RoundState) => void;
  onCustomGame?: () => void;
  onHistory?: () => void;
}

export function SetupScreenPremium({
  gameType = GameType.DISC_GOLF,
  onStartRound,
  onCustomGame,
  onHistory,
}: SetupScreenPremiumProps) {
  const [playerNames, setPlayerNames] = useState<string[]>(['', '', '', '']);
  const [selectedDeckId, setSelectedDeckId] = useState('retribution-deck');
  const [skinsValue, setSkinsValue] = useState('5');

  const decks = getDefaultDecks();
  const gameSpecificConfig = DEFAULT_CONFIGS[gameType];

  const handleStartRound = () => {
    const activePlayers = playerNames.filter((name) => name.trim() !== '');

    if (activePlayers.length < 2) {
      return;
    }

    const players: Record<string, Player> = {};
    activePlayers.forEach((name, index) => {
      const playerId = generateUUID();
      players[playerId] = {
        id: playerId,
        name: name.trim(),
        color: theme.colors.playerColors[index % theme.colors.playerColors.length],
      };
    });

    const roundState: RoundState = {
      roundId: generateUUID(),
      courseId: 'default-course',
      courseName: 'Default Course',
      players,
      config: {
        gameType,
        skinsValue: parseFloat(skinsValue) || 5,
        currencyType: 'dollars',
        gameDeckId: selectedDeckId,
        gameSpecificConfig,
      },
      currentHoleIndex: 0,
      holes: [],
      createdAt: Date.now(),
    };

    onStartRound(roundState);
  };

  const updatePlayerName = (index: number, name: string) => {
    const updated = [...playerNames];
    updated[index] = name;
    setPlayerNames(updated);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Birdies & Bourbon</Text>
          <Text style={styles.subtitle}>Disc Golf Companion</Text>
        </View>

        {/* Players Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PLAYERS</Text>
          <Text style={styles.sectionHint}>2-6 players required</Text>

          <View style={styles.playerGrid}>
            {playerNames.map((name, index) => (
              <View key={index} style={styles.playerInputWrapper}>
                <View
                  style={[
                    styles.playerColorIndicator,
                    { backgroundColor: theme.colors.playerColors[index] },
                  ]}
                />
                <TextInput
                  style={styles.playerInput}
                  placeholder={index < 2 ? `Player ${index + 1} *` : `Player ${index + 1}`}
                  placeholderTextColor={theme.colors.textTertiary}
                  value={name}
                  onChangeText={(text) => updatePlayerName(index, text)}
                  autoCapitalize="words"
                />
              </View>
            ))}
          </View>
        </View>

        {/* Game Deck Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>GAME DECK</Text>
          <Text style={styles.sectionHint}>Choose your play style</Text>

          {decks.map((deck) => {
            const isSelected = selectedDeckId === deck.id;
            return (
              <TouchableOpacity
                key={deck.id}
                style={[styles.deckCard, isSelected && styles.deckCardSelected]}
                onPress={() => setSelectedDeckId(deck.id)}
                activeOpacity={0.7}
              >
                <View style={styles.deckCardContent}>
                  <View style={styles.deckHeader}>
                    <Text style={styles.deckName}>{deck.name}</Text>
                    {isSelected && <View style={styles.selectedBadge} />}
                  </View>
                  <Text style={styles.deckDescription}>{deck.description}</Text>
                  <View style={styles.deckMeta}>
                    <Text style={styles.deckMetaText}>
                      {deck.chips.length} chips · {deck.cardTemplates.length} cards
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Skins Value Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SKINS VALUE</Text>
          <Text style={styles.sectionHint}>Price per skin in dollars</Text>

          <View style={styles.skinsInputWrapper}>
            <Text style={styles.dollarSign}>$</Text>
            <TextInput
              style={styles.skinsInput}
              placeholder="5.00"
              placeholderTextColor={theme.colors.textTertiary}
              value={skinsValue}
              onChangeText={setSkinsValue}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleStartRound}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Start Round</Text>
          </TouchableOpacity>

          <View style={styles.secondaryActions}>
            {onCustomGame && (
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={onCustomGame}
                activeOpacity={0.7}
              >
                <Text style={styles.secondaryButtonText}>🎨 Custom Game</Text>
              </TouchableOpacity>
            )}

            {onHistory && (
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={onHistory}
                activeOpacity={0.7}
              >
                <Text style={styles.secondaryButtonText}>🥃 Passport</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingBottom: theme.spacing.xxxl,
  },
  header: {
    paddingTop: theme.spacing.xxxl,
    paddingBottom: theme.spacing.xl,
    alignItems: 'center',
  },
  title: {
    ...theme.typography.display,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.bodyLarge,
    color: theme.colors.textSecondary,
  },
  section: {
    marginBottom: theme.spacing.sectionSpacing,
  },
  sectionLabel: {
    ...theme.typography.label,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  sectionHint: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
    marginBottom: theme.spacing.lg,
  },

  // Players
  playerGrid: {
    gap: theme.spacing.md,
  },
  playerInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.spacing.radiusMedium,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  playerColorIndicator: {
    width: 4,
    height: 32,
    borderRadius: 2,
    marginRight: theme.spacing.md,
  },
  playerInput: {
    ...theme.typography.bodyLarge,
    color: theme.colors.textPrimary,
    flex: 1,
    paddingVertical: theme.spacing.sm,
  },

  // Deck cards
  deckCard: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.spacing.radiusLarge,
    borderWidth: 2,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
  },
  deckCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryGlow,
  },
  deckCardContent: {
    padding: theme.spacing.lg,
  },
  deckHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  deckName: {
    ...theme.typography.heading3,
    color: theme.colors.textPrimary,
  },
  selectedBadge: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
  },
  deckDescription: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  deckMeta: {
    marginTop: theme.spacing.xs,
  },
  deckMetaText: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
  },

  // Skins input
  skinsInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.spacing.radiusMedium,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  dollarSign: {
    ...theme.typography.heading2,
    color: theme.colors.primary,
    marginRight: theme.spacing.sm,
  },
  skinsInput: {
    ...theme.typography.heading2,
    color: theme.colors.textPrimary,
    flex: 1,
  },

  // Actions
  actions: {
    marginTop: theme.spacing.xl,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.spacing.radiusLarge,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    shadowColor: theme.colors.glowPrimary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryButtonText: {
    ...theme.typography.buttonLarge,
    color: theme.colors.background,
    textTransform: 'uppercase',
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.spacing.radiusMedium,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  secondaryButtonText: {
    ...theme.typography.button,
    color: theme.colors.textSecondary,
  },
});
