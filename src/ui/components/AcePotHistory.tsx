/**
 * Ace Pot History - Shows contribution history and past winners
 * Accessible from settings/stats screen
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { AcePot } from '../../types/game';

interface AcePotHistoryProps {
  acePot: AcePot;
  currencyType: 'dollars' | 'drinks' | 'points' | 'pushups' | 'custom';
  customCurrencyName?: string;
}

function formatCurrency(
  amount: number,
  type: string,
  customName?: string
): string {
  switch (type) {
    case 'dollars':
      return `$${amount.toFixed(2)}`;
    case 'drinks':
      return `${amount} ${amount === 1 ? 'drink' : 'drinks'}`;
    case 'points':
      return `${amount} ${amount === 1 ? 'point' : 'points'}`;
    case 'pushups':
      return `${amount} ${amount === 1 ? 'pushup' : 'pushup s'}`;
    case 'custom':
      return `${amount} ${customName || 'units'}`;
    default:
      return `${amount}`;
  }
}

export function AcePotHistory({
  acePot,
  currencyType,
  customCurrencyName,
}: AcePotHistoryProps) {
  const sortedContributions = [...acePot.contributionHistory].sort(
    (a, b) => b.timestamp - a.timestamp
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ACE POT HISTORY</Text>
        <Text style={styles.currentValue}>
          Current: {formatCurrency(acePot.totalValue, currencyType, customCurrencyName)}
        </Text>
      </View>

      {acePot.lastWinner && (
        <View style={styles.lastWinnerCard}>
          <Text style={styles.sectionLabel}>LAST WINNER</Text>
          <Text style={styles.winnerName}>{acePot.lastWinner.playerName}</Text>
          <Text style={styles.winnerDetails}>
            {new Date(acePot.lastWinner.timestamp).toLocaleDateString()}
          </Text>
          <Text style={styles.winnerDetails}>
            {acePot.lastWinner.courseName}
          </Text>
          <Text style={styles.winAmount}>
            Won: {formatCurrency(acePot.lastWinner.amount, currencyType, customCurrencyName)}
          </Text>
        </View>
      )}

      <View style={styles.contributionsSection}>
        <Text style={styles.sectionLabel}>CONTRIBUTION HISTORY</Text>
        {sortedContributions.length === 0 ? (
          <Text style={styles.emptyText}>No contributions yet</Text>
        ) : (
          sortedContributions.map((contribution, index) => (
            <View key={`${contribution.roundId}-${index}`} style={styles.contributionRow}>
              <Text style={styles.contributionDate}>
                {new Date(contribution.timestamp).toLocaleDateString()}
              </Text>
              <Text style={styles.contributionAmount}>
                +{formatCurrency(contribution.amount, currencyType, customCurrencyName)}
              </Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.stats}>
        <Text style={styles.statsLabel}>Total Contributions:</Text>
        <Text style={styles.statsValue}>
          {acePot.contributionHistory.length} rounds
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    color: '#00FF00',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  currentValue: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  lastWinnerCard: {
    backgroundColor: '#111',
    borderWidth: 2,
    borderColor: '#00FF00',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  sectionLabel: {
    color: '#00FF00',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 12,
  },
  winnerName: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  winnerDetails: {
    color: '#888',
    fontSize: 14,
    marginBottom: 4,
  },
  winAmount: {
    color: '#00FF00',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  contributionsSection: {
    marginBottom: 24,
  },
  contributionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  contributionDate: {
    color: '#FFF',
    fontSize: 14,
  },
  contributionAmount: {
    color: '#00FF00',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderTopWidth: 2,
    borderTopColor: '#333',
  },
  statsLabel: {
    color: '#888',
    fontSize: 14,
  },
  statsValue: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
