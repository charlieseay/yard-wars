/**
 * Setup Screen - Game-aware round configuration
 * Player entry, game-specific settings, rules configuration
 */

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../theme';
import { RoundState, Player } from '../../types/game';
import {
  GameType,
  DEFAULT_CONFIGS,
  isDiscGolfConfig,
  isCornholeConfig,
  isHorseshoesConfig,
  isCustomConfig,
} from '../../types/gameTypes';
import { getDefaultDecks } from '../../state/defaultDecks';
import { generateUUID } from '../../utils/uuid';

interface SetupScreenProps {
  gameType: GameType;
  onStartRound: (roundState: RoundState) => void;
  onBack?: () => void;
}

export function SetupScreen({ gameType, onStartRound, onBack }: SetupScreenProps) {
  const [playerNames, setPlayerNames] = useState<string[]>(['', '', '', '']);
  const [selectedDeckId, setSelectedDeckId] = useState('retribution-deck');
  const [skinsValue, setSkinsValue] = useState('5');

  // Game-specific config state
  const [riptDeckId, setRiptDeckId] = useState('retribution-deck');
  const [acePotEnabled, setAcePotEnabled] = useState(false);
  const [acePotContribution, setAcePotContribution] = useState('1');
  const [cornholePointsToWin, setCornholePointsToWin] = useState('21');
  const [cornholeCancellation, setCornholeCancellation] = useState(true);
  const [horseshoesPointsToWin, setHorseshoesPointsToWin] = useState('40');
  const [customGameName, setCustomGameName] = useState('My Custom Game');
  const [customScoringType, setCustomScoringType] = useState<'points' | 'strokes' | 'time'>('points');
  const [customWinCondition, setCustomWinCondition] = useState('100');

  const decks = getDefaultDecks();
  const gameSpecificConfig = DEFAULT_CONFIGS[gameType];

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
      const playerId = generateUUID();
      players[playerId] = {
        id: playerId,
        name: name.trim(),
        color: theme.colors.playerColors[index % theme.colors.playerColors.length],
      };
    });

    // Build game-specific config based on gameType
    let finalGameConfig = gameSpecificConfig;
    if (gameType === GameType.DISC_GOLF) {
      finalGameConfig = {
        riptDeckId,
        acePotEnabled,
        acePotContribution: parseFloat(acePotContribution) || 1,
        coursePar: Array(18).fill(3), // Default 18-hole par 3
      };
    } else if (gameType === GameType.CORNHOLE) {
      finalGameConfig = {
        pointsToWin: parseInt(cornholePointsToWin) || 21,
        cancellationScoring: cornholeCancellation,
        bagInHoleValue: 3,
        bagOnBoardValue: 1,
        inningsToTrack: true,
      };
    } else if (gameType === GameType.HORSESHOES) {
      finalGameConfig = {
        pointsToWin: parseInt(horseshoesPointsToWin) || 40,
        ringerValue: 3,
        leanerValue: 1,
        closestShoeValue: 1,
        pitchLimit: 50,
      };
    } else if (gameType === GameType.CUSTOM) {
      finalGameConfig = {
        gameName: customGameName,
        scoringType: customScoringType,
        winCondition: parseInt(customWinCondition) || 100,
        playerMin: 2,
        playerMax: 8,
      };
    }

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
        gameSpecificConfig: finalGameConfig,
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
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>← BACK</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.title}>YARD WARS</Text>
        <Text style={styles.subtitle}>{gameType.toUpperCase().replace('_', ' ')}</Text>
      </View>

      {/* Players Section */}
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

      {/* Game-Specific Config */}
      {gameType === GameType.DISC_GOLF && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Game Deck</Text>
            {decks.map((deck) => (
              <TouchableOpacity
                key={deck.id}
                style={[
                  styles.deckButton,
                  riptDeckId === deck.id && styles.deckButtonSelected,
                ]}
                onPress={() => setRiptDeckId(deck.id)}
              >
                <Text style={styles.deckButtonText}>{deck.name}</Text>
                <Text style={styles.deckDescription}>{deck.description}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ace Pot</Text>
            <TouchableOpacity
              style={[styles.toggleButton, acePotEnabled && styles.toggleButtonActive]}
              onPress={() => setAcePotEnabled(!acePotEnabled)}
            >
              <Text style={styles.toggleButtonText}>
                {acePotEnabled ? '✓ ENABLED' : '○ DISABLED'}
              </Text>
            </TouchableOpacity>

            {acePotEnabled && (
              <View style={styles.nestedSection}>
                <Text style={styles.label}>Contribution per player ($)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="1.00"
                  placeholderTextColor={theme.colors.textDisabled}
                  value={acePotContribution}
                  onChangeText={setAcePotContribution}
                  keyboardType="decimal-pad"
                />
              </View>
            )}
          </View>
        </>
      )}

      {gameType === GameType.CORNHOLE && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cornhole Rules</Text>
          <View style={styles.configItem}>
            <Text style={styles.label}>Points to Win</Text>
            <TextInput
              style={styles.configInput}
              placeholder="21"
              placeholderTextColor={theme.colors.textDisabled}
              value={cornholePointsToWin}
              onChangeText={setCornholePointsToWin}
              keyboardType="number-pad"
            />
          </View>
          <TouchableOpacity
            style={[styles.toggleButton, cornholeCancellation && styles.toggleButtonActive]}
            onPress={() => setCornholeCancellation(!cornholeCancellation)}
          >
            <Text style={styles.toggleButtonText}>
              {cornholeCancellation ? '✓ CANCELLATION SCORING' : '○ CUMULATIVE SCORING'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {gameType === GameType.HORSESHOES && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horseshoes Rules</Text>
          <View style={styles.configItem}>
            <Text style={styles.label}>Points to Win</Text>
            <TextInput
              style={styles.configInput}
              placeholder="40"
              placeholderTextColor={theme.colors.textDisabled}
              value={horseshoesPointsToWin}
              onChangeText={setHorseshoesPointsToWin}
              keyboardType="number-pad"
            />
          </View>
          <Text style={styles.ruleText}>Ringer: 3 pts • Leaner: 1 pt • Closest: 1 pt</Text>
        </View>
      )}

      {gameType === GameType.CUSTOM && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Custom Game</Text>
          <View style={styles.configItem}>
            <Text style={styles.label}>Game Name</Text>
            <TextInput
              style={styles.input}
              placeholder="My Custom Game"
              placeholderTextColor={theme.colors.textDisabled}
              value={customGameName}
              onChangeText={setCustomGameName}
            />
          </View>
          <View style={styles.configItem}>
            <Text style={styles.label}>Scoring Type</Text>
            <View style={styles.buttonGroup}>
              {(['points', 'strokes', 'time'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.buttonOption,
                    customScoringType === type && styles.buttonOptionActive,
                  ]}
                  onPress={() => setCustomScoringType(type)}
                >
                  <Text style={styles.buttonOptionText}>{type.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.configItem}>
            <Text style={styles.label}>Win Condition</Text>
            <TextInput
              style={styles.configInput}
              placeholder="100"
              placeholderTextColor={theme.colors.textDisabled}
              value={customWinCondition}
              onChangeText={setCustomWinCondition}
              keyboardType="number-pad"
            />
          </View>
        </View>
      )}

      {/* Universal Skins Value */}
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
    paddingBottom: theme.spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  backButtonText: {
    ...theme.typography.body,
    color: theme.colors.neonCyan,
    fontWeight: '600',
  },
  title: {
    ...theme.typography.heading1,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    fontSize: 36,
    letterSpacing: 1,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.heading2,
    color: theme.colors.neonGreen,
    textAlign: 'center',
    fontSize: 16,
    letterSpacing: 1,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  nestedSection: {
    marginTop: theme.spacing.md,
    paddingLeft: theme.spacing.md,
    borderLeftWidth: 2,
    borderLeftColor: theme.colors.neonGreen,
  },
  sectionTitle: {
    ...theme.typography.heading2,
    color: theme.colors.neonGreen,
    marginBottom: theme.spacing.md,
    fontSize: 16,
  },
  label: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    fontSize: 14,
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
  configInput: {
    ...theme.typography.body,
    backgroundColor: theme.colors.border,
    color: theme.colors.textPrimary,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: theme.spacing.md,
    minHeight: 44,
  },
  configItem: {
    marginBottom: theme.spacing.lg,
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
    fontSize: 14,
  },
  deckDescription: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  toggleButton: {
    backgroundColor: theme.colors.border,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: theme.spacing.md,
    alignItems: 'center',
    minHeight: theme.spacing.minTouchTarget,
    marginBottom: theme.spacing.sm,
  },
  toggleButtonActive: {
    borderColor: theme.colors.neonGreen,
    backgroundColor: '#001100',
  },
  toggleButtonText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  buttonOption: {
    flex: 1,
    backgroundColor: theme.colors.border,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: theme.spacing.md,
    alignItems: 'center',
    minHeight: 44,
  },
  buttonOptionActive: {
    borderColor: theme.colors.neonCyan,
    backgroundColor: '#001a1a',
  },
  buttonOptionText: {
    ...theme.typography.button,
    color: theme.colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  ruleText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    fontSize: 12,
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
    fontSize: 16,
  },
});
