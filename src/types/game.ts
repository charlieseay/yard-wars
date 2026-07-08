/**
 * Core data models for Birdies and Bourbon
 * Following the architecture from NotebookLM spec
 */

export type TimingWindow = 'immediateShot' | 'currentHole' | 'endOfRound';
export type TargetVector = 'single' | 'opponent' | 'all';
export type EngineModification = 'forceRetake' | 'addStroke' | 'freezePayout';
export type ChipType = 'positive' | 'negative';
export type CurrencyType = 'dollars' | 'drinks' | 'points' | 'custom';

/**
 * Card modifier that affects gameplay
 * Can force retakes, add penalties, or freeze payouts
 */
export interface CardModifier {
  id: string;
  name: string;
  description?: string;
  timingWindow: TimingWindow;
  targetVector: TargetVector;
  engineModification: EngineModification;
  isExpired: boolean;
  targetPlayerId?: string; // For single-target modifiers
}

/**
 * Chip/token with monetary or point value
 * Used for penalties (negative) and rewards (positive)
 */
export interface Chip {
  id: string;
  name: string;
  type: ChipType;
  weight: number; // Multiplied against base currency
  icon?: string;
}

/**
 * Single hole state including scores, modifiers, and chips
 */
export interface HoleState {
  holeNumber: number;
  par: number;
  distance?: number;
  playerScores: Record<string, number>; // playerId -> score
  activeModifiers: CardModifier[];
  chipLocations: Record<string, string>; // chipId -> playerId
  pushedSkins: number; // Skins carried over from previous holes
  isResolved: boolean;
}

/**
 * Player in the round
 */
export interface Player {
  id: string;
  name: string;
  color?: string; // Optional UI color for visual distinction
}

/**
 * Round configuration
 */
export interface RoundConfig {
  skinsValue: number;
  currencyType: CurrencyType;
  customCurrencyName?: string;
  gameDeckId: string; // Which game deck template is being used
}

/**
 * Complete round state
 * Immutable - earnings calculated from hole history
 */
export interface RoundState {
  roundId: string;
  courseId: string;
  courseName: string;
  players: Record<string, Player>; // playerId -> Player
  config: RoundConfig;
  currentHoleIndex: number;
  holes: HoleState[];
  createdAt: number; // Unix timestamp
  completedAt?: number; // Unix timestamp
  expeditionId?: string; // Optional link to multi-course trip
}

/**
 * Game deck template (Retribution, Duel, or custom)
 */
export interface GameDeck {
  id: string;
  name: string;
  description: string;
  isCustom: boolean;
  chips: Chip[];
  cardTemplates: Omit<CardModifier, 'id' | 'isExpired' | 'targetPlayerId'>[];
}

/**
 * Player ledger entry for settlement
 */
export interface PlayerLedger {
  playerId: string;
  skinsWon: number;
  skinsLost: number;
  chipsEarned: number;
  chipsPaid: number;
  totalBalance: number; // Net earnings for the round
}

/**
 * Peer-to-peer payout transaction
 */
export interface PayoutTransaction {
  fromPlayerId: string;
  toPlayerId: string;
  amount: number;
  reason: string; // e.g., "Skins + Chips"
}

/**
 * Bourbon distillery check-in
 */
export interface DistilleryCheckIn {
  distilleryId: string;
  distilleryName: string;
  timestamp: number;
  notes?: string;
  roundId: string; // Link to the round played that day
}

/**
 * Multi-course expedition container
 */
export interface Expedition {
  id: string;
  name: string;
  region: string;
  startDate: number;
  endDate?: number;
  roundIds: string[];
  distilleryCheckIns: DistilleryCheckIn[];
}

/**
 * Course definition for regional atlas
 */
export interface Course {
  id: string;
  name: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  holes: number;
  layout?: {
    holeNumber: number;
    par: number;
    distance: number; // feet
  }[];
}

/**
 * Distillery definition for bourbon passport
 */
export interface Distillery {
  id: string;
  name: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  description?: string;
}

/**
 * Regional pack containing courses and distilleries
 */
export interface RegionalPack {
  id: string;
  name: string;
  region: string;
  courses: Course[];
  distilleries: Distillery[];
}

/**
 * Minified round state for QR sync
 * Short keys to minimize payload size
 */
export interface SyncPayload {
  r: string; // roundId (8 chars)
  c: string; // courseId
  p: string[]; // player names (index = playerId)
  h: number; // currentHoleIndex
  s: number[][]; // scores matrix [holeIdx][playerIdx]
  k: number; // current skins pot
}
