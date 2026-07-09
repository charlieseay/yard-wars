/**
 * Premium Active Round Screen
 * Professional scoring interface with refined design
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { theme } from '../theme';
import { RoundState, Chip, CardModifier } from '../../types/game';

interface ActiveRoundScreenPremiumProps {
  roundState: RoundState;
  onUpdateScore: (playerId: string, score: number) => void;
  onAssignChip: (chipId: string, playerId: string) => void;
  onRemoveChip: (chipId: string) => void;
  onApplyModifier: (modifier: CardModifier) => void;
  onExpireModifier: (modifierId: string) => void;
  onAdvanceHole: () => void;
  onGoBackHole: () => void;
  onEndRound: () => void;
}

export function ActiveRoundScreenPremium({
  roundState,
  onUpdateScore,
  onAdvanceHole,
  onGoBackHole,
  onEndRound,
}: ActiveRoundScreenPremiumProps) {
  const [showChipTray, setShowChipTray] = useState(false);
  const [showCards, setShowCards] = useState(false);

  const currentHole = roundState.holes[roundState.currentHoleIndex];
  const holeNumber = roundState.currentHoleIndex + 1;
  const par = currentHole?.par || 3;

  // Calculate skins pot
  const skinsPot = roundState.holes
    .slice(0, roundState.currentHoleIndex)
    .reduce((sum, hole) => sum + (hole.pushedSkins || 0), 0) * roundState.config.skinsValue;

  const playerIds = Object.keys(roundState.players);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.holeNumber}>HOLE {holeNumber}</Text>
          <Text style={styles.parInfo}>PAR {par}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.potLabel}>POT</Text>
          <Text style={styles.potValue}>${skinsPot}</Text>
        </View>
      </View>

      {/* Player Rows */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.playerList}>
          {playerIds.map((playerId) => {
            const player = roundState.players[playerId];
            const score = currentHole?.playerScores[playerId] || 0;
            const relativeScore = score - par;

            return (
              <View key={playerId} style={styles.playerCard}>
                <View style={styles.playerInfo}>
                  <View
                    style={[styles.playerColorBar, { backgroundColor: player.color }]}
                  />
                  <View style={styles.playerDetails}>
                    <Text style={styles.playerName}>{player.name}</Text>
                    {relativeScore !== 0 && (
                      <Text
                        style={[
                          styles.relativeScore,
                          relativeScore < 0 ? styles.underPar : styles.overPar,
                        ]}
                      >
                        {relativeScore > 0 ? '+' : ''}{relativeScore}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.scoreControls}>
                  <TouchableOpacity
                    style={styles.scoreButton}
                    onPress={() => onUpdateScore(playerId, Math.max(0, score - 1))}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.scoreButtonText}>−</Text>
                  </TouchableOpacity>

                  <View style={styles.scoreDisplay}>
                    <Text style={styles.scoreText}>{score}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.scoreButton}
                    onPress={() => onUpdateScore(playerId, score + 1)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.scoreButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>HOLES LEFT</Text>
            <Text style={styles.statValue}>{18 - holeNumber}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>SKINS WON</Text>
            <Text style={styles.statValue}>
              {roundState.holes.slice(0, roundState.currentHoleIndex).filter(h => h.isResolved).length}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>PUSHED</Text>
            <Text style={styles.statValue}>
              {roundState.holes.slice(0, roundState.currentHoleIndex).reduce((sum, h) => sum + (h.pushedSkins || 0), 0)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.secondaryAction}
            onPress={onGoBackHole}
            disabled={roundState.currentHoleIndex === 0}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryActionText}>← Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryAction}
            onPress={() => setShowChipTray(!showChipTray)}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryActionText}>🎯 Chips</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryAction}
            onPress={() => setShowCards(!showCards)}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryActionText}>🎴 Cards</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.primaryAction}
          onPress={holeNumber === 18 ? onEndRound : onAdvanceHole}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryActionText}>
            {holeNumber === 18 ? 'Finish Round' : 'Next Hole →'}
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
    paddingHorizontal: theme.spacing.screenPadding,
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderSubtle,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: theme.spacing.sm,
  },
  holeNumber: {
    ...theme.typography.heading2,
    color: theme.colors.info,
  },
  parInfo: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  potLabel: {
    ...theme.typography.label,
    color: theme.colors.textTertiary,
    fontSize: 10,
  },
  potValue: {
    ...theme.typography.heading3,
    color: theme.colors.warning,
  },
  content: {
    flex: 1,
  },
  playerList: {
    padding: theme.spacing.screenPadding,
    gap: theme.spacing.md,
  },
  playerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.radiusMedium,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  playerColorBar: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: theme.spacing.md,
  },
  playerDetails: {
    flex: 1,
  },
  playerName: {
    ...theme.typography.bodyLarge,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  relativeScore: {
    ...theme.typography.caption,
    fontWeight: '600',
    marginTop: 2,
  },
  underPar: {
    color: theme.colors.success,
  },
  overPar: {
    color: theme.colors.error,
  },
  scoreControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  scoreButton: {
    width: 44,
    height: 44,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.spacing.radiusSmall + 2,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreButtonText: {
    ...theme.typography.heading2,
    color: theme.colors.textPrimary,
  },
  scoreDisplay: {
    minWidth: 50,
    alignItems: 'center',
  },
  scoreText: {
    ...theme.typography.scoreDisplay,
    fontSize: 40,
    color: theme.colors.primary,
  },
  quickStats: {
    flexDirection: 'row',
    marginHorizontal: theme.spacing.screenPadding,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  statItem: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.radiusMedium,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  statLabel: {
    ...theme.typography.label,
    color: theme.colors.textTertiary,
    fontSize: 10,
    marginBottom: 4,
  },
  statValue: {
    ...theme.typography.heading2,
    color: theme.colors.textPrimary,
  },
  bottomActions: {
    padding: theme.spacing.screenPadding,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderSubtle,
  },
  actionRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  secondaryAction: {
    flex: 1,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.spacing.radiusMedium,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  secondaryActionText: {
    ...theme.typography.button,
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  primaryAction: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.spacing.radiusLarge,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
    shadowColor: theme.colors.glowPrimary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryActionText: {
    ...theme.typography.buttonLarge,
    color: theme.colors.background,
  },
});
