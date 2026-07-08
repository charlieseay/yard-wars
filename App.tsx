/**
 * Birdies and Bourbon - Main App Entry
 * Offline-first disc golf companion for skins, chips, and bourbon passport
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { RoundRepository } from './src/storage/RoundRepository';
import { RoundCoordinator, AppScreenState } from './src/state/RoundCoordinator';
import { theme } from './src/ui/theme';

const coordinator = new RoundCoordinator();

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [screenState, setScreenState] = useState<AppScreenState>(coordinator.getState());

  useEffect(() => {
    // Initialize storage and load any active round
    async function init() {
      await RoundRepository.initialize();

      // Check for crash recovery
      const activeRound = await RoundRepository.loadActiveRound();
      if (activeRound) {
        await coordinator.handleEvent({
          type: 'RESUME_ROUND',
          roundState: activeRound,
        });
      }

      setIsInitialized(true);
    }

    init();

    // Subscribe to state changes
    const unsubscribe = coordinator.subscribe(setScreenState);

    return () => {
      unsubscribe();
    };
  }, []);

  if (!isInitialized) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />

      {screenState.screen === 'setup' && (
        <View style={styles.screenContainer}>
          <Text style={styles.titleText}>Birdies & Bourbon</Text>
          <Text style={styles.subtitleText}>Disc Golf Companion</Text>
          <Text style={styles.bodyText}>
            {'\n'}
            ✅ Project scaffolded{'\n'}
            ✅ TypeScript configured{'\n'}
            ✅ OLED theme created{'\n'}
            ✅ Atomic storage implemented{'\n'}
            ✅ State coordinator built{'\n'}
            ✅ Game decks defined{'\n'}
            {'\n'}
            Next: Build UI screens
          </Text>
        </View>
      )}

      {screenState.screen === 'activeRound' && (
        <View style={styles.screenContainer}>
          <Text style={styles.titleText}>Active Round</Text>
          <Text style={styles.bodyText}>
            Round ID: {screenState.roundState.roundId.slice(0, 8)}{'\n'}
            Hole: {screenState.roundState.currentHoleIndex + 1} of 18
          </Text>
        </View>
      )}

      {screenState.screen === 'settlement' && (
        <View style={styles.screenContainer}>
          <Text style={styles.titleText}>Settlement</Text>
          <Text style={styles.bodyText}>Round complete!</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  titleText: {
    ...theme.typography.heading1,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  subtitleText: {
    ...theme.typography.heading2,
    color: theme.colors.neonCyan,
    marginBottom: theme.spacing.lg,
  },
  bodyText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingText: {
    ...theme.typography.heading2,
    color: theme.colors.textPrimary,
  },
});
