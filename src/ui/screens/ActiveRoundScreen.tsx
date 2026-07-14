/**
 * Active Round Screen - Main scoring interface
 * Multi-sport scoring: Disc Golf, Cornhole, Horseshoes, Custom
 * OLED-optimized for outdoor play
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Alert, Modal } from 'react-native';
import { theme } from '../theme';
import { RoundState, HoleState } from '../../types/game';
import { GameType, isDiscGolfConfig } from '../../types/gameTypes';
import { ChipTray } from '../components/ChipTray';
import { CardModifierPanel } from '../components/CardModifierPanel';
import { QRSyncModal } from '../components/QRSyncModal';
import { getDefaultDecks } from '../../state/defaultDecks';
import { generateUUID } from '../../utils/uuid';
import { ScorePlusIcon, ScoreMinusIcon, SettingsIcon } from '../icons';

interface ActiveRoundScreenProps {
  roundState: RoundState;
  onUpdateScore: (playerId: string, score: number) => void;
  onAssignChip: (chipId: string, playerId: string) => void;
  onRemoveChip: (chipId: string) => void;
  onApplyModifier: (modifier: any) => void;
  onExpireModifier: (modifierId: string) => void;
  onAdvanceHole: () => void;
  onGoBackHole: () => void;
  onEndRound: () => void;
}

export function ActiveRoundScreen({
  roundState,
  onUpdateScore,
  onAssignChip,
  onRemoveChip,
  onApplyModifier,
  onExpireModifier,
  onAdvanceHole,
  onGoBackHole,
  onEndRound,
}: ActiveRoundScreenProps) {
  const [selectedChipId, setSelectedChipId] = useState<string | null>(null);
  const [showQRSync, setShowQRSync] = useState(false);
  const [showPauseMenu, setShowPauseMenu] = useState(false);

  const currentHole = roundState.holes[roundState.currentHoleIndex];
  const playerIds = Object.keys(roundState.players);
  const isLastHole = roundState.currentHoleIndex === roundState.holes.length - 1;

  // Load game deck to get available chips and cards
  const decks = getDefaultDecks();
  const gameDeck = decks.find(d => d.id === roundState.config.gameDeckId);
  const availableChips = gameDeck?.chips || [];
  const availableCards = gameDeck?.cardTemplates || [];

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
      // Deselect if tapping the same chip
      setSelectedChipId(null);
    } else {
      // Select chip - visual feedback only, no blocking alert
      setSelectedChipId(chipId);
    }
  };

  const handlePlayerPress = (playerId: string) => {
    if (selectedChipId) {
      onAssignChip(selectedChipId, playerId);
      setSelectedChipId(null);
      // Show success feedback
      Alert.alert('Chip Assigned', `Chip assigned to ${roundState.players[playerId].name}`, [{ text: 'OK' }]);
    }
  };

  const handlePlayCard = (cardTemplate: any) => {
    // For single-target cards, prompt for player selection
    if (cardTemplate.targetVector === 'single' || cardTemplate.targetVector === 'opponent') {
      Alert.alert(
        'Play Card',
        `${cardTemplate.name}\n\nTap a player to apply this card.`,
        [{ text: 'Cancel' }]
      );
      // TODO: Set card selection mode and wait for player tap
      // For now, just apply to first player as demo
      const modifier = {
        ...cardTemplate,
        id: generateUUID(),
        isExpired: false,
        targetPlayerId: playerIds[0],
      };
      onApplyModifier(modifier);
    } else {
      // All-players cards apply immediately
      const modifier = {
        ...cardTemplate,
        id: generateUUID(),
        isExpired: false,
      };
      onApplyModifier(modifier);
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
      {/* Game-specific UI - Disc Golf only */}
      {roundState.config.gameType === GameType.DISC_GOLF && (
        <>
          {/* Card modifier panel */}
          <CardModifierPanel
            activeModifiers={currentHole.activeModifiers || []}
            availableCards={availableCards}
            onPlayCard={handlePlayCard}
            onExpireModifier={onExpireModifier}
          />

          {/* Chip tray */}
          <ChipTray
            chips={availableChips}
            onChipPress={handleChipPress}
            selectedChipId={selectedChipId}
          />
        </>
      )}

      {/* Header - Hole info, skins pot, and menu */}
      <View style={styles.header}>
        <View style={styles.holeInfo}>
          <Text style={styles.holeNumber}>HOLE {currentHole.holeNumber}</Text>
          <Text style={styles.holePar}>Par {currentHole.par}</Text>
        </View>
        <View style={styles.skinsPot}>
          <Text style={styles.skinsPotLabel}>SKINS POT</Text>
          <Text style={styles.skinsPotValue}>${skinsInPot.toFixed(2)}</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.headerIconButton}
              onPress={() => setShowQRSync(true)}
            >
              <Text style={styles.headerIconText}>📱</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerIconButton}
              onPress={() => setShowPauseMenu(true)}
            >
              <SettingsIcon size={24} color={theme.colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* QR Sync Modal */}
      <QRSyncModal
        visible={showQRSync}
        roundState={roundState}
        onClose={() => setShowQRSync(false)}
      />

      {/* Pause Menu Modal */}
      <Modal
        visible={showPauseMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPauseMenu(false)}
      >
        <View style={styles.pauseOverlay}>
          <View style={styles.pauseModal}>
            <TouchableOpacity
              style={styles.pauseCloseButton}
              onPress={() => setShowPauseMenu(false)}
            >
              <Text style={styles.pauseCloseText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.pauseTitle}>PAUSED</Text>

            <TouchableOpacity
              style={[styles.pauseButton, styles.pauseButtonPrimary]}
              onPress={() => setShowPauseMenu(false)}
            >
              <Text style={styles.pauseButtonText}>Resume Round</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.pauseButton, styles.pauseButtonSecondary]}
              onPress={() => {
                Alert.alert(
                  'Save & Exit',
                  'Your progress will be saved. You can continue this round later.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Save & Exit',
                      onPress: () => {
                        setShowPauseMenu(false);
                        onEndRound();  // This should save the round
                      },
                    },
                  ]
                );
              }}
            >
              <Text style={styles.pauseButtonText}>Save & Exit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.pauseButton, styles.pauseButtonDanger]}
              onPress={() => {
                Alert.alert(
                  'Abandon Round?',
                  'This will discard your current round. This action cannot be undone.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Abandon',
                      style: 'destructive',
                      onPress: () => {
                        setShowPauseMenu(false);
                        // TODO: Add abandon round handler that deletes without saving
                        onEndRound();
                      },
                    },
                  ]
                );
              }}
            >
              <Text style={[styles.pauseButtonText, styles.pauseButtonDangerText]}>
                Abandon Round
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
                  <ScoreMinusIcon size={28} color={theme.colors.accentPenalties} />
                </TouchableOpacity>

                <Text style={styles.scoreDisplay}>{score}</Text>

                <TouchableOpacity
                  style={styles.scoreButton}
                  onPress={() => onUpdateScore(playerId, score + 1)}
                >
                  <ScorePlusIcon size={28} color={theme.colors.accentSkins} />
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
  qrButton: {
    backgroundColor: theme.colors.neonCyan,
    borderRadius: 4,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    marginTop: theme.spacing.xs,
  },
  qrButtonText: {
    ...theme.typography.caption,
    color: theme.colors.background,
    fontWeight: '700',
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
    borderColor: theme.colors.neonCyan,
    borderWidth: 2,
    borderRadius: 8,
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
  // Header buttons
  headerButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: theme.colors.neonCyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconText: {
    fontSize: 20,
  },
  // Pause menu
  pauseOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseModal: {
    width: '85%',
    backgroundColor: '#111',
    borderRadius: 16,
    padding: theme.spacing.xl,
    borderWidth: 2,
    borderColor: theme.colors.neonCyan,
  },
  pauseCloseButton: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseCloseText: {
    fontSize: 24,
    color: theme.colors.textSecondary,
  },
  pauseTitle: {
    ...theme.typography.heading1,
    color: theme.colors.neonCyan,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  pauseButton: {
    borderRadius: 8,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    minHeight: theme.spacing.minTouchTarget,
  },
  pauseButtonPrimary: {
    backgroundColor: theme.colors.neonGreen,
  },
  pauseButtonSecondary: {
    backgroundColor: '#333',
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  pauseButtonDanger: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.neonRed,
  },
  pauseButtonText: {
    ...theme.typography.button,
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  pauseButtonDangerText: {
    color: theme.colors.neonRed,
  },
});
