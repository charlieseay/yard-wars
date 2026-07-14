/**
 * Yard Wars - Multi-sport Yard Games Companion
 * Disc Golf, Cornhole, Horseshoes, Custom Games
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { RoundRepository } from './src/storage/RoundRepository';
import { RoundCoordinator, AppScreenState } from './src/state/RoundCoordinator';
import { GameTypeSelectScreen } from './src/ui/screens/GameTypeSelectScreen';
import { SetupScreen } from './src/ui/screens/SetupScreen';
import { ActiveRoundScreen } from './src/ui/screens/ActiveRoundScreen';
import { SettlementScreen } from './src/ui/screens/SettlementScreen';
import { CustomGameScreen } from './src/ui/screens/CustomGameScreen';
import { theme } from './src/ui/theme';
import { RoundState, GameDeck } from './src/types/game';
import { GameType } from './src/types/gameTypes';
import { autoHealthCheck } from './src/utils/deviceHealth';

const coordinator = new RoundCoordinator();

type AppScreen = AppScreenState | { screen: 'gameTypeSelect' } | { screen: 'setupWithGame'; gameType: GameType };

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [screenState, setScreenState] = useState<AppScreen>({ screen: 'gameTypeSelect' });
  const [selectedGameType, setSelectedGameType] = useState<GameType | null>(null);
  const coordinatorState = coordinator.getState();

  useEffect(() => {
    // Initialize storage and load any active round
    async function init() {
      try {
        // Run health check first
        await autoHealthCheck();
      } catch (error) {
        console.warn('Health check failed:', error);
      }

      try {
        await RoundRepository.initialize();
      } catch (error) {
        console.error('RoundRepository init failed:', error);
      }

      // Check for crash recovery
      try {
        const activeRound = await RoundRepository.loadActiveRound();
        if (activeRound) {
          await coordinator.handleEvent({
            type: 'RESUME_ROUND',
            roundState: activeRound,
          });
          // Get the updated state AFTER the coordinator processed the event
          const resumedState = coordinator.getState();
          setScreenState(resumedState);
        } else {
          // Otherwise start with game type selection
          setScreenState({ screen: 'gameTypeSelect' });
        }
      } catch (error) {
        console.error('Failed to load active round:', error);
        // Clear any corrupted active round and start fresh
        try {
          const activeRound = await RoundRepository.loadActiveRound();
          if (activeRound) {
            await RoundRepository.deleteRound(activeRound.roundId);
          }
        } catch (cleanupError) {
          console.warn('Failed to clean up corrupted round:', cleanupError);
        }
        // Fallback to game type selection
        setScreenState({ screen: 'gameTypeSelect' });
      }

      setIsInitialized(true);
    }

    init();

    // Subscribe to coordinator state changes
    const unsubscribe = coordinator.subscribe((newState) => {
      setScreenState(newState);
    });

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

      {screenState.screen === 'gameTypeSelect' && (
        <GameTypeSelectScreen
          onSelectGame={(gameType) => {
            setSelectedGameType(gameType);
            setScreenState({ screen: 'setupWithGame', gameType });
          }}
        />
      )}

      {screenState.screen === 'setupWithGame' && selectedGameType && (
        <SetupScreen
          gameType={selectedGameType}
          onStartRound={async (roundState: RoundState) => {
            await coordinator.handleEvent({
              type: 'START_ROUND',
              roundState,
            });
          }}
          onBack={() => setScreenState({ screen: 'gameTypeSelect' })}
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
            setScreenState({ screen: 'gameTypeSelect' });
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
            setScreenState({ screen: 'gameTypeSelect' });
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
