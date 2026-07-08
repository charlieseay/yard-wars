/**
 * Settlement Screen - Final payout matrix
 * Shows who owes whom with Venmo deep-links
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Linking,
} from 'react-native';
import { theme } from '../theme';
import { RoundState, PlayerLedger } from '../../types/game';

interface SettlementScreenProps {
  roundState: RoundState;
  ledger: PlayerLedger[];
  onExitToSetup: () => void;
}

export function SettlementScreen({
  roundState,
  ledger,
  onExitToSetup,
}: SettlementScreenProps) {
  const openVenmo = (toPlayerId: string, amount: number) => {
    const player = roundState.players[toPlayerId];
    if (!player) return;

    // Venmo deep-link format
    // venmo://paycharge?txn=pay&recipients=USERNAME&amount=10.00&note=Disc%20Golf%20Skins
    // For now, we'll just show alert - need Venmo usernames in player profile
    alert(`Would open Venmo to pay ${player.name} $${amount.toFixed(2)}`);
  };

  // Calculate peer-to-peer transactions
  const getTransactions = (): Array<{ from: string; to: string; amount: number }> => {
    const transactions: Array<{ from: string; to: string; amount: number }> = [];

    // Simple algorithm: each loser pays their share to each winner
    const winners = ledger.filter(l => l.totalBalance > 0);
    const losers = ledger.filter(l => l.totalBalance < 0);

    losers.forEach(loser => {
      winners.forEach(winner => {
        const loserShare = Math.abs(loser.totalBalance);
        const winnerShare = winner.totalBalance;
        const totalWinnings = winners.reduce((sum, w) => sum + w.totalBalance, 0);

        if (totalWinnings > 0) {
          const amount = (loserShare * winnerShare) / totalWinnings;
          if (amount > 0.01) {
            // Only show if > 1 cent
            transactions.push({
              from: loser.playerId,
              to: winner.playerId,
              amount,
            });
          }
        }
      });
    });

    return transactions;
  };

  const transactions = getTransactions();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>ROUND COMPLETE</Text>

        {/* Final standings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Final Standings</Text>
          {ledger.map((entry) => {
            const player = roundState.players[entry.playerId];
            const isWinner = entry.totalBalance > 0;
            const isLoser = entry.totalBalance < 0;

            return (
              <View key={entry.playerId} style={styles.standingRow}>
                <Text style={styles.playerName}>{player?.name || 'Unknown'}</Text>
                <View style={styles.balanceContainer}>
                  <Text
                    style={[
                      styles.balance,
                      isWinner && styles.balancePositive,
                      isLoser && styles.balanceNegative,
                    ]}
                  >
                    {entry.totalBalance >= 0 ? '+' : ''}
                    ${entry.totalBalance.toFixed(2)}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Payout matrix */}
        {transactions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Who Owes Whom</Text>
            {transactions.map((tx, index) => {
              const fromPlayer = roundState.players[tx.from];
              const toPlayer = roundState.players[tx.to];

              return (
                <View key={index} style={styles.transactionRow}>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionText}>
                      <Text style={styles.transactionPlayer}>{fromPlayer?.name}</Text>
                      {' owes '}
                      <Text style={styles.transactionPlayer}>{toPlayer?.name}</Text>
                    </Text>
                    <Text style={styles.transactionAmount}>${tx.amount.toFixed(2)}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.venmoButton}
                    onPress={() => openVenmo(tx.to, tx.amount)}
                  >
                    <Text style={styles.venmoButtonText}>PAY</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}

        {/* New round button */}
        <TouchableOpacity style={styles.newRoundButton} onPress={onExitToSetup}>
          <Text style={styles.newRoundButtonText}>NEW ROUND</Text>
        </TouchableOpacity>
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
    padding: theme.spacing.lg,
  },
  title: {
    ...theme.typography.heading1,
    color: theme.colors.neonGreen,
    textAlign: 'center',
    marginVertical: theme.spacing.xl,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.heading2,
    color: theme.colors.neonCyan,
    marginBottom: theme.spacing.md,
  },
  standingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    minHeight: theme.spacing.minTouchTarget,
  },
  playerName: {
    ...theme.typography.heading2,
    color: theme.colors.textPrimary,
  },
  balanceContainer: {
    alignItems: 'flex-end',
  },
  balance: {
    ...theme.typography.heading2,
    color: theme.colors.textSecondary,
  },
  balancePositive: {
    color: theme.colors.neonGreen,
  },
  balanceNegative: {
    color: theme.colors.neonRed,
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: 8,
    marginBottom: theme.spacing.sm,
    minHeight: theme.spacing.minTouchTarget,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  transactionPlayer: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  transactionAmount: {
    ...theme.typography.heading2,
    color: theme.colors.neonGreen,
  },
  venmoButton: {
    backgroundColor: theme.colors.neonCyan,
    borderRadius: 8,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    minWidth: 80,
    alignItems: 'center',
  },
  venmoButtonText: {
    ...theme.typography.button,
    color: theme.colors.background,
    fontWeight: '700',
  },
  newRoundButton: {
    backgroundColor: theme.colors.neonGreen,
    borderRadius: 8,
    padding: theme.spacing.lg,
    alignItems: 'center',
    minHeight: theme.spacing.minTouchTarget + 16,
    marginTop: theme.spacing.xl,
  },
  newRoundButtonText: {
    ...theme.typography.button,
    color: theme.colors.background,
    fontWeight: '700',
  },
});
