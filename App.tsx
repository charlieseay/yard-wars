/**
 * Birdies and Bourbon - Main App Entry
 * Offline-first disc golf companion for skins, chips, and bourbon passport
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { RoundRepository } from './src/storage/RoundRepository';
import { RoundCoordinator, AppScreenState } from './src/state/RoundCoordinator';
import { SetupScreenPremium as SetupScreen } from './src/ui/screens/SetupScreenPremium';
import { ActiveRoundScreenPremium as ActiveRoundScreen } from './src/ui/screens/ActiveRoundScreenPremium';
import { SettlementScreenPremium as SettlementScreen } from './src/ui/screens/SettlementScreenPremium';
import { CustomGameScreenPremium as CustomGameScreen } from './src/ui/screens/CustomGameScreenPremium';
import { BourbonPassportScreen } from './src/ui/screens/BourbonPassportScreen';
import { theme } from './src/ui/theme';
import { RoundState, GameDeck } from './src/types/game';
import { autoHealthCheck } from './src/utils/deviceHealth';

const coordinator = new RoundCoordinator();

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [screenState, setScreenState] = useState<AppScreenState>(coordinator.getState());
  const [showBourbonPassport, setShowBourbonPassport] = useState(false);

  useEffect(() => {
    // Initialize storage and load any active round
    async function init() {
      // Run health check first
      await autoHealthCheck();

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

      {showBourbonPassport ? (
        <BourbonPassportScreen onBack={() => setShowBourbonPassport(false)} />
      ) : screenState.screen === 'setup' ? (
        <SetupScreen
          onStartRound={async (roundState: RoundState) => {
            await coordinator.handleEvent({
              type: 'START_ROUND',
              roundState,
            });
          }}
          onCustomGame={() => {
            setScreenState({ screen: 'customDeck' });
          }}
          onHistory={() => setShowBourbonPassport(true)}
        />
      ) : null}

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
          onApplyModifier={async (modifier: any) => {
            await coordinator.handleEvent({
              type: 'APPLY_MODIFIER',
              modifier,
            });
          }}
          onExpireModifier={async (modifierId: string) => {
            await coordinator.handleEvent({
              type: 'EXPIRE_MODIFIER',
              modifierId,
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

      {screenState.screen === 'customDeck' && (
        <CustomGameScreen
          onSaveDeck={async (deck: GameDeck) => {
            await RoundRepository.saveDeck(deck);
          }}
          onBack={async () => {
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
