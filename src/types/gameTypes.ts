/**
 * Game Type System - Multi-sport support for Yard Wars
 * Supports: Disc Golf, Cornhole, Horseshoes, Custom games
 */

export enum GameType {
  DISC_GOLF = 'disc_golf',
  CORNHOLE = 'cornhole',
  HORSESHOES = 'horseshoes',
  CUSTOM = 'custom',
}

/**
 * Disc Golf Configuration
 * - Ript card game decks (Retribution/Duel)
 * - Ace Pot tracking (winner-takes-all)
 * - Par-based scoring
 */
export interface DiscGolfConfig {
  riptDeckId: string; // 'retribution-deck' | 'duel-deck'
  acePotEnabled: boolean;
  acePotContribution: number; // Per-round contribution (e.g., $1)
  coursePar: number[]; // Par for each hole [3, 4, 3, 5, ...]
}

/**
 * Cornhole Configuration
 * Standard ACL/ACA tournament rules:
 * - 21 points to win
 * - Cancellation scoring (bags cancel between teams)
 * - Bag in hole = 3 pts, on board = 1 pt
 */
export interface CornholeConfig {
  pointsToWin: 21; // ACL standard
  cancellationScoring: true; // Opponent bags cancel
  bagInHoleValue: 3;
  bagOnBoardValue: 1;
  inningsToTrack: boolean; // Track frames/innings
}

/**
 * Horseshoes Configuration
 * Standard NHPA rules:
 * - 40 points to win (or 50 shoes)
 * - Ringer = 3 pts, Leaner = 1 pt
 * - Closest shoe = 1 pt (if no ringers)
 */
export interface HorseshoesConfig {
  pointsToWin: 40; // NHPA standard
  ringerValue: 3;
  leanerValue: 1;
  closestShoeValue: 1;
  pitchLimit?: number; // Optional shoe count limit (e.g., 50 shoes)
}

/**
 * Custom Game Configuration
 * User-defined scoring rules
 */
export interface CustomConfig {
  gameName: string;
  scoringType: 'points' | 'strokes' | 'time';
  winCondition: number; // Points to win, strokes to complete, time limit
  playerMin: number;
  playerMax: number;
  customRules?: string; // Freeform text description
}

/**
 * Game-specific config union type
 */
export type GameSpecificConfig =
  | DiscGolfConfig
  | CornholeConfig
  | HorseshoesConfig
  | CustomConfig;

/**
 * Type guard: Check if config is Disc Golf
 */
export function isDiscGolfConfig(
  config: GameSpecificConfig,
  gameType: GameType
): config is DiscGolfConfig {
  return gameType === GameType.DISC_GOLF;
}

/**
 * Type guard: Check if config is Cornhole
 */
export function isCornholeConfig(
  config: GameSpecificConfig,
  gameType: GameType
): config is CornholeConfig {
  return gameType === GameType.CORNHOLE;
}

/**
 * Type guard: Check if config is Horseshoes
 */
export function isHorseshoesConfig(
  config: GameSpecificConfig,
  gameType: GameType
): config is HorseshoesConfig {
  return gameType === GameType.HORSESHOES;
}

/**
 * Type guard: Check if config is Custom
 */
export function isCustomConfig(
  config: GameSpecificConfig,
  gameType: GameType
): config is CustomConfig {
  return gameType === GameType.CUSTOM;
}

/**
 * Default configurations for each game type
 */
export const DEFAULT_CONFIGS: Record<GameType, GameSpecificConfig> = {
  [GameType.DISC_GOLF]: {
    riptDeckId: 'retribution-deck',
    acePotEnabled: false,
    acePotContribution: 1,
    coursePar: Array(18).fill(3), // Default 18-hole par 3 course
  },
  [GameType.CORNHOLE]: {
    pointsToWin: 21,
    cancellationScoring: true,
    bagInHoleValue: 3,
    bagOnBoardValue: 1,
    inningsToTrack: true,
  },
  [GameType.HORSESHOES]: {
    pointsToWin: 40,
    ringerValue: 3,
    leanerValue: 1,
    closestShoeValue: 1,
    pitchLimit: 50,
  },
  [GameType.CUSTOM]: {
    gameName: 'My Custom Game',
    scoringType: 'points',
    winCondition: 100,
    playerMin: 2,
    playerMax: 8,
  },
};

/**
 * Human-readable game type labels
 */
export const GAME_TYPE_LABELS: Record<GameType, string> = {
  [GameType.DISC_GOLF]: 'Disc Golf',
  [GameType.CORNHOLE]: 'Cornhole',
  [GameType.HORSESHOES]: 'Horseshoes',
  [GameType.CUSTOM]: 'Custom Game',
};

/**
 * Game type descriptions for setup screen
 */
export const GAME_TYPE_DESCRIPTIONS: Record<GameType, string> = {
  [GameType.DISC_GOLF]: 'Ript card games, Ace Pot, skins tracking',
  [GameType.CORNHOLE]: 'ACL tournament scoring, 21 points to win',
  [GameType.HORSESHOES]: 'NHPA rules, ringers and leaners',
  [GameType.CUSTOM]: 'Build your own scoring rules',
};
