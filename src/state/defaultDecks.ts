/**
 * Built-in game deck templates
 * "Retribution Deck" (Ript Revenge style) and "Duel Deck" (Ript Showdown style)
 * Generic names to avoid IP issues
 */

import { GameDeck, Chip, CardModifier } from '../types/game';

/**
 * Retribution Deck - Classic chaotic group sabotage
 * Ript Revenge style
 */
export const retributionDeck: GameDeck = {
  id: 'retribution-deck',
  name: 'Retribution Deck',
  description: 'High chaos card-driven sabotage. Best for full groups.',
  isCustom: false,
  chips: [
    {
      id: 'tree-magnet',
      name: 'Tree Magnet',
      type: 'negative',
      weight: 1,
      icon: '🌳',
    },
    {
      id: 'ob-penalty',
      name: 'OB Penalty',
      type: 'negative',
      weight: 1,
      icon: '🚫',
    },
    {
      id: 'birdie-chip',
      name: 'Birdie',
      type: 'positive',
      weight: 1,
      icon: '🎯',
    },
    {
      id: 'ace-chip',
      name: 'Ace',
      type: 'positive',
      weight: 3,
      icon: '🏆',
    },
  ],
  cardTemplates: [
    {
      name: 'Off-Hand Throw',
      description: 'Player must throw with their non-dominant hand',
      timingWindow: 'immediateShot',
      targetVector: 'single',
      engineModification: 'forceRetake',
    },
    {
      name: 'Standstill Shot',
      description: 'Player must throw from a standstill (no run-up)',
      timingWindow: 'immediateShot',
      targetVector: 'single',
      engineModification: 'forceRetake',
    },
    {
      name: 'Roller Only',
      description: 'Shot must be a roller',
      timingWindow: 'immediateShot',
      targetVector: 'single',
      engineModification: 'forceRetake',
    },
    {
      name: 'Putter Only',
      description: 'Must use a putter for this throw',
      timingWindow: 'immediateShot',
      targetVector: 'single',
      engineModification: 'forceRetake',
    },
    {
      name: 'Penalty Stroke',
      description: 'Add one stroke to target player',
      timingWindow: 'currentHole',
      targetVector: 'single',
      engineModification: 'addStroke',
    },
    {
      name: 'Hole Freeze',
      description: 'No skins paid out on this hole',
      timingWindow: 'currentHole',
      targetVector: 'all',
      engineModification: 'freezePayout',
    },
    {
      name: 'Revenge Card',
      description: 'Steal a skin from another player',
      timingWindow: 'endOfRound',
      targetVector: 'single',
      engineModification: 'freezePayout',
    },
  ],
};

/**
 * Duel Deck - Head-to-head tactical strategy
 * Ript Showdown style
 */
export const duelDeck: GameDeck = {
  id: 'duel-deck',
  name: 'The Duel Deck',
  description: 'Tactical timing-restricted head-to-head match play variants.',
  isCustom: false,
  chips: [
    {
      id: 'comeback-chip',
      name: 'Comeback',
      type: 'positive',
      weight: 2,
      icon: '⚡',
    },
    {
      id: 'choke-chip',
      name: 'Choke',
      type: 'negative',
      weight: 2,
      icon: '💀',
    },
  ],
  cardTemplates: [
    {
      name: 'Before Tee',
      description: 'Play before any player tees off',
      timingWindow: 'currentHole',
      targetVector: 'opponent',
      engineModification: 'addStroke',
    },
    {
      name: 'After Shot',
      description: 'Play immediately after opponent throws',
      timingWindow: 'immediateShot',
      targetVector: 'opponent',
      engineModification: 'forceRetake',
    },
    {
      name: 'Double or Nothing',
      description: 'Double the skins value for this hole',
      timingWindow: 'currentHole',
      targetVector: 'all',
      engineModification: 'freezePayout',
    },
    {
      name: 'Format Flip',
      description: 'Change hole to best disc (not first in)',
      timingWindow: 'currentHole',
      targetVector: 'all',
      engineModification: 'freezePayout',
    },
  ],
};

/**
 * Get all default decks
 */
export function getDefaultDecks(): GameDeck[] {
  return [retributionDeck, duelDeck];
}
