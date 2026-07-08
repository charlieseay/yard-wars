/**
 * Birdies and Bourbon - Main App Entry
 * Offline-first disc golf companion for skins, chips, and bourbon passport
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { RoundRepository } from './src/storage/RoundRepository';
import { RoundCoordinator, AppScreenState } from './src/state/RoundCoordinator';
import { SetupScreen } from './src/ui/screens/SetupScreen';
import { ActiveRoundScreen } from './src/ui/screens/ActiveRoundScreen';
import { SettlementScreen } from './src/ui/screens/SettlementScreen';
import { theme } from './src/ui/theme';
import { RoundState } from './src/types/game';

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
        <SetupScreen
          onStartRound={async (roundState: RoundState) => {
            await coordinator.handleEvent({
              type: 'START_ROUND',
              roundState,
            });
          }}
        />
      )}

      {screenState.screen === 'activeRound' && (
        <ActiveRoundScreen
          roundState={screenState.roundState}
          onUpdateScore={async (playerId: string, score: number) => {
            await coordinator.handleEvent({
              type: 'UPDATE_SCORE',
              playerId,
              score,
            });
          }}
          onAssignChip={async (chipId: string, playerId: string) => {
            await coordinator.handleEvent({
              type: 'ASSIGN_CHIP',
              chipId,
              playerId,
            });
          }}
          onRemoveChip={async (chipId: string) => {
            await coordinator.handleEvent({
              type: 'REMOVE_CHIP',
              chipId,
            });
          }}
          onAdvanceHole={async () => {
            await coordinator.handleEvent({ type: 'ADVANCE_HOLE' });
          }}
          onGoBackHole={async () => {
            await coordinator.handleEvent({ type: 'GO_BACK_HOLE' });
          }}
          onEndRound={async () => {
            await coordinator.handleEvent({ type: 'END_ROUND' });
          }}
        />
      )}

      {screenState.screen === 'settlement' && (
        <SettlementScreen
          roundState={screenState.roundState}
          ledger={screenState.ledger}
          onExitToSetup={async () => {
            await coordinator.handleEvent({ type: 'EXIT_TO_SETUP' });
          }}
        />
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
