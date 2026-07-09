/**
 * Ace Celebration - Full-screen celebration when ace is scored
 * Shows animation, pot value won, and winner info
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { AceEvent } from '../../types/game';

interface AceCelebrationProps {
  aceEvent: AceEvent;
  potValue: number;
  currencyType: 'dollars' | 'drinks' | 'points' | 'pushups' | 'custom';
  customCurrencyName?: string;
  onDismiss: () => void;
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

export function AceCelebration({
  aceEvent,
  potValue,
  currencyType,
  customCurrencyName,
  onDismiss,
}: AceCelebrationProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Fade in + scale animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-dismiss after 5 seconds
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, []);

  const formattedPot = formatCurrency(potValue, currencyType, customCurrencyName);

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          opacity: fadeAnim,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.emoji}>🎯</Text>
        <Text style={styles.title}>ACE!</Text>
        <Text style={styles.playerName}>{aceEvent.playerName}</Text>
        <Text style={styles.holeInfo}>
          Hole {aceEvent.holeNumber} • Par {aceEvent.par}
        </Text>

        {potValue > 0 && (
          <View style={styles.potWin}>
            <Text style={styles.potLabel}>ACE POT WON</Text>
            <Text style={styles.potValue}>{formattedPot}</Text>
          </View>
        )}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  card: {
    backgroundColor: '#000',
    borderWidth: 3,
    borderColor: '#00FF00',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    minWidth: '80%',
  },
  emoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    color: '#00FF00',
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: 4,
    marginBottom: 16,
  },
  playerName: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  holeInfo: {
    color: '#888',
    fontSize: 18,
    marginBottom: 24,
  },
  potWin: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 2,
    borderTopColor: '#333',
    width: '100%',
    alignItems: 'center',
  },
  potLabel: {
    color: '#00FF00',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 8,
  },
  potValue: {
    color: '#FFF',
    fontSize: 40,
    fontWeight: 'bold',
  },
});
