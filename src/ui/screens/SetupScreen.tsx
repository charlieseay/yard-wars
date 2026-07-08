/**
 * Setup Screen - Configure new round
 * Player entry, game selection, course picker
 */

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../theme';
import { RoundState, Player } from '../../types/game';
import { getDefaultDecks } from '../../state/defaultDecks';

interface SetupScreenProps {
  onStartRound: (roundState: RoundState) => void;
}

export function SetupScreen({ onStartRound }: SetupScreenProps) {
  const [playerNames, setPlayerNames] = useState<string[]>(['', '', '', '']);
  const [selectedDeckId, setSelectedDeckId] = useState('retribution-deck');
  const [skinsValue, setSkinsValue] = useState('5');

  const decks = getDefaultDecks();

  const handleStartRound = () => {
    // Filter out empty player names
    const activePlayers = playerNames.filter(name => name.trim() !== '');

    if (activePlayers.length < 2) {
      // TODO: Show error - need at least 2 players
      return;
    }

    // Create player objects with UUIDs
    const players: Record<string, Player> = {};
    activePlayers.forEach((name, index) => {
      const playerId = `player-${Date.now()}-${index}`;
      players[playerId] = {
        id: playerId,
        name: name.trim(),
        color: theme.colors.playerColors[index % theme.colors.playerColors.length],
      };
    });

    const roundState: RoundState = {
      roundId: `round-${Date.now()}`,
      courseId: 'default-course',
      courseName: 'Default Course',
      players,
      config: {
        skinsValue: parseFloat(skinsValue) || 5,
        currencyType: 'dollars',
        gameDeckId: selectedDeckId,
      },
      currentHoleIndex: 0,
      holes: [], // Will be initialized by coordinator
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Birdies & Bourbon</Text>
      <Text style={styles.subtitle}>Disc Golf Companion</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Players (2-6)</Text>
        {playerNames.map((name, index) => (
          <TextInput
            key={index}
            style={styles.input}
            placeholder={`Player ${index + 1}${index < 2 ? ' (required)' : ''}`}
            placeholderTextColor={theme.colors.textDisabled}
            value={name}
            onChangeText={(text) => updatePlayerName(index, text)}
            autoCapitalize="words"
          />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Game Deck</Text>
        {decks.map((deck) => (
          <TouchableOpacity
            key={deck.id}
            style={[
              styles.deckButton,
              selectedDeckId === deck.id && styles.deckButtonSelected,
            ]}
            onPress={() => setSelectedDeckId(deck.id)}
          >
            <Text style={styles.deckButtonText}>{deck.name}</Text>
            <Text style={styles.deckDescription}>{deck.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skins Value ($)</Text>
        <TextInput
          style={styles.input}
          placeholder="5.00"
          placeholderTextColor={theme.colors.textDisabled}
          value={skinsValue}
          onChangeText={setSkinsValue}
          keyboardType="decimal-pad"
        />
      </View>

      <TouchableOpacity style={styles.startButton} onPress={handleStartRound}>
        <Text style={styles.startButtonText}>START ROUND</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
  },
  title: {
    ...theme.typography.heading1,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginTop: theme.spacing.xxl,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.heading2,
    color: theme.colors.neonCyan,
    textAlign: 'center',
    marginBottom: theme.spacing.xxl,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.heading2,
    color: theme.colors.neonGreen,
    marginBottom: theme.spacing.md,
  },
  input: {
    ...theme.typography.body,
    backgroundColor: theme.colors.border,
    color: theme.colors.textPrimary,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    minHeight: theme.spacing.minTouchTarget,
  },
  deckButton: {
    backgroundColor: theme.colors.border,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    minHeight: theme.spacing.minTouchTarget,
  },
  deckButtonSelected: {
    borderColor: theme.colors.neonGreen,
    backgroundColor: '#001100',
  },
  deckButtonText: {
    ...theme.typography.heading2,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  deckDescription: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  startButton: {
    backgroundColor: theme.colors.neonGreen,
    borderRadius: 8,
    padding: theme.spacing.lg,
    alignItems: 'center',
    minHeight: theme.spacing.minTouchTarget + 16,
    marginTop: theme.spacing.lg,
  },
  startButtonText: {
    ...theme.typography.button,
    color: theme.colors.background,
    fontWeight: '700',
  },
});
