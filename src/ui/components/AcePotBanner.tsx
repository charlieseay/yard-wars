/**
 * Ace Pot Banner - Displays current ace pot value and last winner
 * Shown during round setup and active play
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AcePot } from '../../types/game';

interface AcePotBannerProps {
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
      return `${amount} ${amount === 1 ? 'pushup' : 'pushups'}`;
    case 'custom':
      return `${amount} ${customName || 'units'}`;
    default:
      return `${amount}`;
  }
}

export function AcePotBanner({
  acePot,
  currencyType,
  customCurrencyName,
}: AcePotBannerProps) {
  const potValue = formatCurrency(
    acePot.totalValue,
    currencyType,
    customCurrencyName
  );

  const lastWinDate = acePot.lastWinner
    ? new Date(acePot.lastWinner.timestamp).toLocaleDateString()
    : null;

  return (
    <View style={styles.container}>
      <View style={styles.potHeader}>
        <Text style={styles.label}>ACE POT</Text>
        <Text style={styles.value}>{potValue}</Text>
      </View>

      {acePot.lastWinner && (
        <View style={styles.lastWinner}>
          <Text style={styles.winnerText}>
            Last won by {acePot.lastWinner.playerName} on {lastWinDate}
          </Text>
          <Text style={styles.winnerCourse}>
            {acePot.lastWinner.courseName}
          </Text>
        </View>
      )}

      {acePot.totalValue === 0 && !acePot.lastWinner && (
        <Text style={styles.emptyText}>No contributions yet</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    borderWidth: 2,
    borderColor: '#00FF00',
    borderRadius: 8,
    padding: 16,
    marginVertical: 12,
  },
  potHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: '#00FF00',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  value: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  lastWinner: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  winnerText: {
    color: '#FFF',
    fontSize: 14,
  },
  winnerCourse: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
  },
  emptyText: {
    color: '#888',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});
