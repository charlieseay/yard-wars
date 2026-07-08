/**
 * Active Round Screen - Main scoring interface
 * Hole-by-hole scoring with chip assignment and modifiers
 * OLED-optimized for outdoor play
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import { theme } from '../theme';
import { RoundState, HoleState } from '../../types/game';
import { ChipTray } from '../components/ChipTray';
import { getDefaultDecks } from '../../state/defaultDecks';

interface ActiveRoundScreenProps {
  roundState: RoundState;
  onUpdateScore: (playerId: string, score: number) => void;
  onAssignChip: (chipId: string, playerId: string) => void;
  onRemoveChip: (chipId: string) => void;
  onAdvanceHole: () => void;
  onGoBackHole: () => void;
  onEndRound: () => void;
}

export function ActiveRoundScreen({
  roundState,
  onUpdateScore,
  onAssignChip,
  onRemoveChip,
  onAdvanceHole,
  onGoBackHole,
  onEndRound,
}: ActiveRoundScreenProps) {
  const [selectedChipId, setSelectedChipId] = useState<string | null>(null);

  const currentHole = roundState.holes[roundState.currentHoleIndex];
  const playerIds = Object.keys(roundState.players);
  const isLastHole = roundState.currentHoleIndex === roundState.holes.length - 1;

  // Load game deck to get available chips
  const decks = getDefaultDecks();
  const gameDeck = decks.find(d => d.id === roundState.config.gameDeckId);
  const availableChips = gameDeck?.chips || [];

  if (!currentHole) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: No hole data</Text>
      </View>
    );
  }

  const skinsInPot = roundState.config.skinsValue * (1 + (currentHole.pushedSkins || 0));

  const handleChipPress = (chipId: string) => {
    if (selectedChipId === chipId) {
      setSelectedChipId(null);
    } else {
      setSelectedChipId(chipId);
      Alert.alert(
        'Assign Chip',
        'Tap a player to assign this chip',
        [{ text: 'Cancel', onPress: () => setSelectedChipId(null) }]
      );
    }
  };

  const handlePlayerPress = (playerId: string) => {
    if (selectedChipId) {
      onAssignChip(selectedChipId, playerId);
      setSelectedChipId(null);
    }
  };

  const getPlayerChips = (playerId: string) => {
    return Object.entries(currentHole.chipLocations || {})
      .filter(([_, pid]) => pid === playerId)
      .map(([chipId]) => availableChips.find(c => c.id === chipId))
      .filter(Boolean);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Chip tray */}
      <ChipTray chips={availableChips} onChipPress={handleChipPress} />

      {/* Header - Hole info and skins pot */}
      <View style={styles.header}>
        <View style={styles.holeInfo}>
          <Text style={styles.holeNumber}>HOLE {currentHole.holeNumber}</Text>
          <Text style={styles.holePar}>Par {currentHole.par}</Text>
        </View>
        <View style={styles.skinsPot}>
          <Text style={styles.skinsPotLabel}>SKINS POT</Text>
          <Text style={styles.skinsPotValue}>${skinsInPot.toFixed(2)}</Text>
        </View>
      </View>

      {/* Player scores */}
      <ScrollView style={styles.playersContainer}>
        {playerIds.map((playerId) => {
          const player = roundState.players[playerId];
          const score = currentHole.playerScores[playerId] || currentHole.par;
          const diff = score - currentHole.par;

          const playerChips = getPlayerChips(playerId);

          return (
            <TouchableOpacity
              key={playerId}
              style={[
                styles.playerRow,
                { borderLeftColor: player.color || theme.colors.neonGreen },
                selectedChipId && styles.playerRowSelectable,
              ]}
              onPress={() => handlePlayerPress(playerId)}
              activeOpacity={selectedChipId ? 0.7 : 1}
            >
              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{player.name}</Text>
                {playerChips.length > 0 && (
                  <View style={styles.playerChipsContainer}>
                    {playerChips.map((chip: any) => (
                      <Text key={chip.id} style={styles.playerChipIcon}>
                        {chip.icon || '•'}
                      </Text>
                    ))}
                  </View>
                )}
                <Text
                  style={[
                    styles.playerDiff,
                    diff === 0 && styles.diffPar,
                    diff < 0 && styles.diffUnder,
                    diff > 0 && styles.diffOver,
                  ]}
                >
                  {diff === 0 ? 'PAR' : diff > 0 ? `+${diff}` : `${diff}`}
                </Text>
              </View>

              {/* Score controls */}
              <View style={styles.scoreControls}>
                <TouchableOpacity
                  style={styles.scoreButton}
                  onPress={() => onUpdateScore(playerId, score - 1)}
                >
                  <Text style={styles.scoreButtonText}>−</Text>
                </TouchableOpacity>

                <Text style={styles.scoreDisplay}>{score}</Text>

                <TouchableOpacity
                  style={styles.scoreButton}
                  onPress={() => onUpdateScore(playerId, score + 1)}
                >
                  <Text style={styles.scoreButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Navigation buttons */}
      <View style={styles.navigation}>
        {roundState.currentHoleIndex > 0 && (
          <TouchableOpacity style={styles.navButtonBack} onPress={onGoBackHole}>
            <Text style={styles.navButtonText}>← BACK</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.navButton, isLastHole && styles.navButtonEnd]}
          onPress={isLastHole ? onEndRound : onAdvanceHole}
        >
          <Text style={styles.navButtonText}>
            {isLastHole ? 'END ROUND' : `NEXT HOLE →`}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.border,
  },
  holeInfo: {
    flex: 1,
  },
  holeNumber: {
    ...theme.typography.heading1,
    color: theme.colors.textPrimary,
  },
  holePar: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  skinsPot: {
    alignItems: 'flex-end',
  },
  skinsPotLabel: {
    ...theme.typography.caption,
    color: theme.colors.neonGreen,
  },
  skinsPotValue: {
    ...theme.typography.heading1,
    color: theme.colors.neonGreen,
  },
  playersContainer: {
    flex: 1,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    borderLeftWidth: 4,
    minHeight: theme.spacing.minTouchTarget + theme.spacing.lg,
  },
  playerRowSelectable: {
    backgroundColor: '#001111',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    ...theme.typography.heading2,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  playerDiff: {
    ...theme.typography.caption,
  },
  diffPar: {
    color: theme.colors.textSecondary,
  },
  diffUnder: {
    color: theme.colors.neonGreen,
  },
  diffOver: {
    color: theme.colors.neonRed,
  },
  playerChipsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  playerChipIcon: {
    fontSize: 16,
  },
  scoreControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  scoreButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.border,
    borderWidth: 2,
    borderColor: theme.colors.neonCyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreButtonText: {
    ...theme.typography.scoreDisplay,
    fontSize: 36,
    color: theme.colors.neonCyan,
    lineHeight: 40,
  },
  scoreDisplay: {
    ...theme.typography.scoreDisplay,
    color: theme.colors.textPrimary,
    minWidth: 80,
    textAlign: 'center',
  },
  navigation: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    borderTopWidth: 2,
    borderTopColor: theme.colors.border,
  },
  navButtonBack: {
    flex: 1,
    backgroundColor: theme.colors.border,
    borderRadius: 8,
    padding: theme.spacing.lg,
    alignItems: 'center',
    minHeight: theme.spacing.minTouchTarget,
  },
  navButton: {
    flex: 2,
    backgroundColor: theme.colors.neonCyan,
    borderRadius: 8,
    padding: theme.spacing.lg,
    alignItems: 'center',
    minHeight: theme.spacing.minTouchTarget,
  },
  navButtonEnd: {
    backgroundColor: theme.colors.neonGreen,
  },
  navButtonText: {
    ...theme.typography.button,
    color: theme.colors.background,
    fontWeight: '700',
  },
  errorText: {
    ...theme.typography.heading2,
    color: theme.colors.neonRed,
    textAlign: 'center',
    padding: theme.spacing.lg,
  },
});
