/**
 * Round State Coordinator - The brain of the app
 * Implements Unidirectional Data Flow (UDF) state machine
 * Intercepts events, processes game logic, mutates state, triggers saves
 */

import {
  RoundState,
  HoleState,
  Player,
  CardModifier,
  Chip,
  PlayerLedger,
  PayoutTransaction,
  AceEvent,
  AcePotWinner,
} from '../types/game';
import { RoundRepository } from '../storage/RoundRepository';
import * as AcePotRepository from '../storage/acePotRepository';

export type AppScreenState =
  | { screen: 'setup' }
  | { screen: 'activeRound'; roundState: RoundState }
  | { screen: 'settlement'; roundState: RoundState; ledger: PlayerLedger[] }
  | { screen: 'history' }
  | { screen: 'customDeck' };

/**
 * Events that flow upstream from UI
 */
export type RoundEvent =
  | { type: 'START_ROUND'; roundState: RoundState }
  | { type: 'UPDATE_SCORE'; playerId: string; score: number }
  | { type: 'ASSIGN_CHIP'; chipId: string; playerId: string }
  | { type: 'REMOVE_CHIP'; chipId: string }
  | { type: 'APPLY_MODIFIER'; modifier: CardModifier }
  | { type: 'EXPIRE_MODIFIER'; modifierId: string }
  | { type: 'ADVANCE_HOLE' }
  | { type: 'GO_BACK_HOLE' }
  | { type: 'END_ROUND' }
  | { type: 'RESUME_ROUND'; roundState: RoundState }
  | { type: 'EXIT_TO_SETUP' };

export class RoundCoordinator {
  private screenState: AppScreenState = { screen: 'setup' };
  private listeners: Array<(state: AppScreenState) => void> = [];

  /**
   * Subscribe to state changes
   */
  subscribe(listener: (state: AppScreenState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Get current screen state
   */
  getState(): AppScreenState {
    return this.screenState;
  }

  /**
   * Main event handler - processes events and updates state
   */
  async handleEvent(event: RoundEvent): Promise<void> {
    const currentState = this.screenState;

    switch (event.type) {
      case 'START_ROUND':
        await this.startRound(event.roundState);
        break;

      case 'RESUME_ROUND':
        await this.resumeRound(event.roundState);
        break;

      case 'UPDATE_SCORE':
        if (currentState.screen === 'activeRound') {
          await this.updateScore(currentState.roundState, event.playerId, event.score);
        }
        break;

      case 'ASSIGN_CHIP':
        if (currentState.screen === 'activeRound') {
          await this.assignChip(currentState.roundState, event.chipId, event.playerId);
        }
        break;

      case 'REMOVE_CHIP':
        if (currentState.screen === 'activeRound') {
          await this.removeChip(currentState.roundState, event.chipId);
        }
        break;

      case 'APPLY_MODIFIER':
        if (currentState.screen === 'activeRound') {
          await this.applyModifier(currentState.roundState, event.modifier);
        }
        break;

      case 'EXPIRE_MODIFIER':
        if (currentState.screen === 'activeRound') {
          await this.expireModifier(currentState.roundState, event.modifierId);
        }
        break;

      case 'ADVANCE_HOLE':
        if (currentState.screen === 'activeRound') {
          await this.advanceHole(currentState.roundState);
        }
        break;

      case 'GO_BACK_HOLE':
        if (currentState.screen === 'activeRound') {
          await this.goBackHole(currentState.roundState);
        }
        break;

      case 'END_ROUND':
        if (currentState.screen === 'activeRound') {
          await this.endRound(currentState.roundState);
        }
        break;

      case 'EXIT_TO_SETUP':
        this.exitToSetup();
        break;
    }
  }

  /**
   * Start a new round
   */
  private async startRound(roundState: RoundState): Promise<void> {
    // Initialize all holes with default state
    const holes: HoleState[] = Array.from({ length: 18 }, (_, i) => ({
      holeNumber: i + 1,
      par: 3, // Default, should come from course data
      playerScores: {},
      activeModifiers: [],
      chipLocations: {},
      pushedSkins: i === 0 ? 0 : undefined as any, // Will be set during play
      isResolved: false,
    }));

    // Pre-fill scores to par (smart default)
    const playerIds = Object.keys(roundState.players);
    holes.forEach(hole => {
      playerIds.forEach(playerId => {
        hole.playerScores[playerId] = hole.par;
      });
    });

    // Add ace pot contribution if enabled
    let acePotSnapshot = 0;
    if (roundState.config.acePotEnabled && roundState.config.acePotContribution > 0) {
      const contributionAmount = roundState.config.acePotContribution * playerIds.length;
      const updatedPot = await AcePotRepository.addContribution(
        roundState.roundId,
        contributionAmount
      );
      acePotSnapshot = updatedPot.totalValue;
    } else {
      // Still snapshot current value even if not contributing this round
      acePotSnapshot = await AcePotRepository.getAcePotValue();
    }

    const initializedRound: RoundState = {
      ...roundState,
      holes,
      currentHoleIndex: 0,
      createdAt: Date.now(),
      acePotSnapshot,
    };

    await RoundRepository.saveRound(initializedRound);

    this.updateScreenState({
      screen: 'activeRound',
      roundState: initializedRound,
    });
  }

  /**
   * Resume an existing round (crash recovery)
   */
  private async resumeRound(roundState: RoundState): Promise<void> {
    this.updateScreenState({
      screen: 'activeRound',
      roundState,
    });
  }

  /**
   * Update a player's score on the current hole
   */
  private async updateScore(
    roundState: RoundState,
    playerId: string,
    score: number
  ): Promise<void> {
    const currentHole = roundState.holes[roundState.currentHoleIndex];
    currentHole.playerScores[playerId] = score;

    // Ace detection: score = 1 on par 3+
    if (score === 1 && currentHole.par >= 3) {
      const player = roundState.players[playerId];
      const aceEvent: AceEvent = {
        playerId,
        playerName: player.name,
        timestamp: Date.now(),
        holeNumber: currentHole.holeNumber,
        par: currentHole.par,
      };
      currentHole.aceScored = aceEvent;

      // Award ace pot if enabled
      if (roundState.config.acePotEnabled) {
        const currentPotValue = await AcePotRepository.getAcePotValue();
        if (currentPotValue > 0) {
          const winner: AcePotWinner = {
            playerId,
            playerName: player.name,
            roundId: roundState.roundId,
            courseId: roundState.courseId,
            courseName: roundState.courseName,
            timestamp: Date.now(),
            amount: currentPotValue,
          };
          await AcePotRepository.awardAcePot(winner);

          // Update snapshot to show pot was won
          roundState.acePotSnapshot = 0;
        }
      }
    }

    await RoundRepository.saveRound(roundState);
    this.updateScreenState({ screen: 'activeRound', roundState });
  }

  /**
   * Assign a chip to a player
   */
  private async assignChip(
    roundState: RoundState,
    chipId: string,
    playerId: string
  ): Promise<void> {
    const currentHole = roundState.holes[roundState.currentHoleIndex];
    currentHole.chipLocations[chipId] = playerId;

    await RoundRepository.saveRound(roundState);
    this.updateScreenState({ screen: 'activeRound', roundState });
  }

  /**
   * Remove a chip from play
   */
  private async removeChip(roundState: RoundState, chipId: string): Promise<void> {
    const currentHole = roundState.holes[roundState.currentHoleIndex];
    delete currentHole.chipLocations[chipId];

    await RoundRepository.saveRound(roundState);
    this.updateScreenState({ screen: 'activeRound', roundState });
  }

  /**
   * Apply a card modifier
   */
  private async applyModifier(
    roundState: RoundState,
    modifier: CardModifier
  ): Promise<void> {
    const currentHole = roundState.holes[roundState.currentHoleIndex];
    currentHole.activeModifiers.push(modifier);

    await RoundRepository.saveRound(roundState);
    this.updateScreenState({ screen: 'activeRound', roundState });
  }

  /**
   * Expire a modifier (timing window elapsed)
   */
  private async expireModifier(roundState: RoundState, modifierId: string): Promise<void> {
    const currentHole = roundState.holes[roundState.currentHoleIndex];
    const modifier = currentHole.activeModifiers.find(m => m.id === modifierId);
    if (modifier) {
      modifier.isExpired = true;
    }

    await RoundRepository.saveRound(roundState);
    this.updateScreenState({ screen: 'activeRound', roundState });
  }

  /**
   * Advance to next hole
   * Resolves current hole and handles modifier cleanup
   */
  private async advanceHole(roundState: RoundState): Promise<void> {
    const currentHole = roundState.holes[roundState.currentHoleIndex];

    // Step 1: Mark hole as resolved
    currentHole.isResolved = true;

    // Step 2: Calculate skins for this hole
    const { skinsWinnerId, isPush } = this.calculateHoleSkins(currentHole, roundState.players);

    // Step 3: Update skins pot
    let pushedSkins = currentHole.pushedSkins || 0;
    if (isPush) {
      pushedSkins += 1;
    } else {
      pushedSkins = 0; // Winner takes all
    }

    // Step 4: Clean up current-hole modifiers
    currentHole.activeModifiers = currentHole.activeModifiers.filter(
      m => m.timingWindow === 'endOfRound'
    );

    // Step 5: Advance to next hole or end round
    if (roundState.currentHoleIndex < roundState.holes.length - 1) {
      roundState.currentHoleIndex += 1;

      const nextHole = roundState.holes[roundState.currentHoleIndex];
      nextHole.pushedSkins = pushedSkins;

      // Pre-fill next hole scores to par
      const playerIds = Object.keys(roundState.players);
      playerIds.forEach(playerId => {
        nextHole.playerScores[playerId] = nextHole.par;
      });

      await RoundRepository.saveRound(roundState);
      this.updateScreenState({ screen: 'activeRound', roundState });
    } else {
      // Final hole complete - go to settlement
      await this.endRound(roundState);
    }
  }

  /**
   * Go back to previous hole (undo)
   */
  private async goBackHole(roundState: RoundState): Promise<void> {
    if (roundState.currentHoleIndex > 0) {
      const currentHole = roundState.holes[roundState.currentHoleIndex];
      currentHole.isResolved = false;

      roundState.currentHoleIndex -= 1;

      const prevHole = roundState.holes[roundState.currentHoleIndex];
      prevHole.isResolved = false;

      await RoundRepository.saveRound(roundState);
      this.updateScreenState({ screen: 'activeRound', roundState });
    }
  }

  /**
   * End the round and calculate final settlement
   */
  private async endRound(roundState: RoundState): Promise<void> {
    roundState.completedAt = Date.now();
    await RoundRepository.saveRound(roundState);

    const ledger = this.calculateFinalLedger(roundState);

    this.updateScreenState({
      screen: 'settlement',
      roundState,
      ledger,
    });
  }

  /**
   * Exit to setup screen
   */
  private exitToSetup(): void {
    this.updateScreenState({ screen: 'setup' });
  }

  /**
   * Calculate skins winner for a hole
   */
  private calculateHoleSkins(
    hole: HoleState,
    players: Record<string, Player>
  ): { skinsWinnerId: string | null; isPush: boolean } {
    const scores = Object.entries(hole.playerScores);
    if (scores.length === 0) {
      return { skinsWinnerId: null, isPush: true };
    }

    const minScore = Math.min(...scores.map(([_, score]) => score));
    const winners = scores.filter(([_, score]) => score === minScore);

    if (winners.length === 1) {
      return { skinsWinnerId: winners[0][0], isPush: false };
    } else {
      return { skinsWinnerId: null, isPush: true };
    }
  }

  /**
   * Calculate final ledger for all players
   * Pure function - derives from hole history
   */
  private calculateFinalLedger(roundState: RoundState): PlayerLedger[] {
    const playerIds = Object.keys(roundState.players);
    const ledger: Record<string, PlayerLedger> = {};

    // Initialize ledger
    playerIds.forEach(playerId => {
      ledger[playerId] = {
        playerId,
        skinsWon: 0,
        skinsLost: 0,
        chipsEarned: 0,
        chipsPaid: 0,
        totalBalance: 0,
      };
    });

    // Calculate skins
    roundState.holes.forEach(hole => {
      if (!hole.isResolved) return;

      const { skinsWinnerId, isPush } = this.calculateHoleSkins(hole, roundState.players);

      if (!isPush && skinsWinnerId) {
        const skinsValue = roundState.config.skinsValue * (1 + (hole.pushedSkins || 0));
        ledger[skinsWinnerId].skinsWon += skinsValue;

        // Split loss among other players
        const losers = playerIds.filter(id => id !== skinsWinnerId);
        const lossPerPlayer = skinsValue / losers.length;
        losers.forEach(loserId => {
          ledger[loserId].skinsLost += lossPerPlayer;
        });
      }

      // Calculate chip earnings/penalties
      // For now, simplified: each chip is worth $1 per other player
      // TODO: Load actual game deck to get chip weights
      Object.entries(hole.chipLocations || {}).forEach(([chipId, playerId]) => {
        const isNegativeChip = chipId.includes('penalty') || chipId.includes('ob') || chipId.includes('tree');
        const chipValue = 1; // Default weight

        if (isNegativeChip) {
          // Negative chip: holder pays all other players
          ledger[playerId].chipsPaid += chipValue * (playerIds.length - 1);
          playerIds.forEach(otherId => {
            if (otherId !== playerId) {
              ledger[otherId].chipsEarned += chipValue;
            }
          });
        } else {
          // Positive chip: holder receives from all other players
          ledger[playerId].chipsEarned += chipValue * (playerIds.length - 1);
          playerIds.forEach(otherId => {
            if (otherId !== playerId) {
              ledger[otherId].chipsPaid += chipValue;
            }
          });
        }
      });
    });

    // Calculate total balance
    Object.values(ledger).forEach(entry => {
      entry.totalBalance =
        entry.skinsWon - entry.skinsLost + entry.chipsEarned - entry.chipsPaid;
    });

    return Object.values(ledger).sort((a, b) => b.totalBalance - a.totalBalance);
  }

  /**
   * Update screen state and notify listeners
   */
  private updateScreenState(state: AppScreenState): void {
    this.screenState = state;
    this.listeners.forEach(listener => listener(state));
  }
}
