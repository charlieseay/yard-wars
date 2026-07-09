/**
 * Premium Settlement Screen
 * Professional final standings with refined payouts
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { theme } from '../theme';
import { RoundState, PlayerLedger } from '../../types/game';

interface SettlementScreenPremiumProps {
  roundState: RoundState;
  ledger: PlayerLedger[];
  onExitToSetup: () => void;
}

export function SettlementScreenPremium({
  roundState,
  ledger,
  onExitToSetup,
}: SettlementScreenPremiumProps) {
  // Calculate stats
  const totalHoles = roundState.holes.length;
  const totalSkins = roundState.holes.filter((h) => h.isResolved).length;
  const totalPot = totalSkins * roundState.config.skinsValue;

  // Convert ledger array to map for easier lookup
  const ledgerMap: Record<string, number> = {};
  ledger.forEach((entry) => {
    ledgerMap[entry.playerId] = entry.totalBalance;
  });

  // Sort players by payout
  const sortedPlayers = Object.keys(roundState.players).sort(
    (a, b) => (ledgerMap[b] || 0) - (ledgerMap[a] || 0)
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Round Complete</Text>
        <Text style={styles.subtitle}>{roundState.courseName}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalHoles}</Text>
            <Text style={styles.statLabel}>HOLES</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalSkins}</Text>
            <Text style={styles.statLabel}>SKINS</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>${totalPot}</Text>
            <Text style={styles.statLabel}>TOTAL POT</Text>
          </View>
        </View>

        {/* Payouts Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>FINAL PAYOUTS</Text>
          <Text style={styles.sectionHint}>Individual Ledger Method</Text>

          <View style={styles.payoutList}>
            {sortedPlayers.map((playerId, index) => {
              const player = roundState.players[playerId];
              const amount = ledgerMap[playerId] || 0;
              const isPositive = amount > 0;
              const isNegative = amount < 0;

              return (
                <View key={playerId} style={styles.payoutCard}>
                  <View style={styles.payoutLeft}>
                    <View style={styles.rankBadge}>
                      <Text style={styles.rankText}>#{index + 1}</Text>
                    </View>
                    <View
                      style={[styles.playerColorBar, { backgroundColor: player.color }]}
                    />
                    <Text style={styles.payoutPlayerName}>{player.name}</Text>
                  </View>

                  <Text
                    style={[
                      styles.payoutAmount,
                      isPositive && styles.payoutPositive,
                      isNegative && styles.payoutNegative,
                    ]}
                  >
                    {amount > 0 ? '+' : ''}${Math.abs(amount).toFixed(2)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Round Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Round Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Started</Text>
            <Text style={styles.summaryValue}>
              {new Date(roundState.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Completed</Text>
            <Text style={styles.summaryValue}>
              {roundState.completedAt
                ? new Date(roundState.completedAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Now'}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Game Deck</Text>
            <Text style={styles.summaryValue}>{roundState.config.gameDeckId}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.primaryButton} onPress={onExitToSetup} activeOpacity={0.8}>
          <Text style={styles.primaryButtonText}>New Round</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.7}>
          <Text style={styles.secondaryButtonText}>💸 Send Venmo Requests</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.7}>
          <Text style={styles.secondaryButtonText}>📊 View Details</Text>
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
    paddingTop: theme.spacing.xxxl,
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.screenPadding,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderSubtle,
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
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.screenPadding,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.sectionSpacing,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.radiusLarge,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  statValue: {
    ...theme.typography.scoreDisplay,
    fontSize: 36,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    ...theme.typography.label,
    color: theme.colors.textTertiary,
    fontSize: 10,
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
  payoutList: {
    gap: theme.spacing.md,
  },
  payoutCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.radiusMedium,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
  },
  payoutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    flex: 1,
  },
  rankBadge: {
    width: 32,
    height: 32,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.spacing.radiusFull,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '700',
  },
  playerColorBar: {
    width: 4,
    height: 32,
    borderRadius: 2,
  },
  payoutPlayerName: {
    ...theme.typography.bodyLarge,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  payoutAmount: {
    ...theme.typography.heading2,
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  payoutPositive: {
    color: theme.colors.success,
  },
  payoutNegative: {
    color: theme.colors.error,
  },
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.radiusLarge,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  summaryTitle: {
    ...theme.typography.heading3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  summaryLabel: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  summaryValue: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  bottomActions: {
    padding: theme.spacing.screenPadding,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderSubtle,
    gap: theme.spacing.md,
  },
  primaryButton: {
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
  primaryButtonText: {
    ...theme.typography.buttonLarge,
    color: theme.colors.background,
  },
  secondaryButton: {
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
