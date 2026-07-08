/**
 * Atomic file storage for round state
 * Implements crash-proof writes using backup-and-swap pattern
 * Using Expo SDK 57 new FileSystem API
 */

import { Paths, Directory, File } from 'expo-file-system';
import { RoundState, Expedition, GameDeck } from '../types/game';

/**
 * Schema version for migration support
 * Increment when data structure changes
 */
const SCHEMA_VERSION = 1;

interface StorageEnvelope<T> {
  version: number;
  data: T;
  savedAt: number;
}

export class RoundRepository {
  private static storageDir: Directory;
  private static roundsDir: Directory;
  private static expeditionsDir: Directory;
  private static decksDir: Directory;

  /**
   * Initialize storage directories
   * Call this on app startup
   */
  static async initialize(): Promise<void> {
    try {
      this.storageDir = new Directory(Paths.document, 'birdies-bourbon');
      this.roundsDir = new Directory(this.storageDir, 'rounds');
      this.expeditionsDir = new Directory(this.storageDir, 'expeditions');
      this.decksDir = new Directory(this.storageDir, 'decks');

      // Create directories if they don't exist
      await this.storageDir.create();
      await this.roundsDir.create();
      await this.expeditionsDir.create();
      await this.decksDir.create();
    } catch (error) {
      console.error('Failed to initialize storage:', error);
      throw error;
    }
  }

  /**
   * Atomic write: save round to backup file first, then swap
   * Prevents corruption if phone dies mid-write
   */
  static async saveRound(round: RoundState): Promise<void> {
    const file = new File(this.roundsDir, `${round.roundId}.json`);
    const backupFile = new File(this.roundsDir, `${round.roundId}.json.bak`);

    const envelope: StorageEnvelope<RoundState> = {
      version: SCHEMA_VERSION,
      data: round,
      savedAt: Date.now(),
    };

    const json = JSON.stringify(envelope, null, 2);

    try {
      // Step 1: Create backup file and write content
      await backupFile.create({ overwrite: true });
      backupFile.write(json);

      // Step 2: Move backup to main file (atomic operation)
      await backupFile.move(file, { overwrite: true });
    } catch (error) {
      console.error('Failed to save round:', error);
      throw error;
    }
  }

  /**
   * Load round from storage
   * Returns null if not found
   */
  static async loadRound(roundId: string): Promise<RoundState | null> {
    const file = new File(this.roundsDir, `${roundId}.json`);

    try {
      const exists = file.exists;
      if (!exists) {
        return null;
      }

      const json = await file.text();
      const envelope: StorageEnvelope<RoundState> = JSON.parse(json);

      // Schema migration interceptor
      if (envelope.version !== SCHEMA_VERSION) {
        return this.migrateRound(envelope);
      }

      return envelope.data;
    } catch (error) {
      console.error('Failed to load round:', error);
      return null;
    }
  }

  /**
   * Load the most recent unfinished round (for crash recovery)
   */
  static async loadActiveRound(): Promise<RoundState | null> {
    try {
      const items = await this.roundsDir.list();

      // Filter to File instances with .json extension (not .bak)
      const roundFiles = items.filter(item =>
        item instanceof File &&
        item.name.endsWith('.json') &&
        !item.name.endsWith('.bak')
      ) as File[];

      if (roundFiles.length === 0) {
        return null;
      }

      // Load all rounds and find most recent unfinished
      const rounds = await Promise.all(
        roundFiles.map(async (file) => {
          const roundId = file.name.replace('.json', '');
          return this.loadRound(roundId);
        })
      );

      const activeRounds = rounds
        .filter((r): r is RoundState => r !== null && !r.completedAt)
        .sort((a, b) => b.createdAt - a.createdAt);

      return activeRounds[0] || null;
    } catch (error) {
      console.error('Failed to load active round:', error);
      return null;
    }
  }

  /**
   * List all completed rounds
   */
  static async listCompletedRounds(): Promise<RoundState[]> {
    try {
      const items = await this.roundsDir.list();
      const roundFiles = items.filter(item =>
        item instanceof File &&
        item.name.endsWith('.json') &&
        !item.name.endsWith('.bak')
      ) as File[];

      const rounds = await Promise.all(
        roundFiles.map(async (file) => {
          const roundId = file.name.replace('.json', '');
          return this.loadRound(roundId);
        })
      );

      return rounds
        .filter((r): r is RoundState => r !== null && !!r.completedAt)
        .sort((a, b) => b.completedAt! - a.completedAt!);
    } catch (error) {
      console.error('Failed to list rounds:', error);
      return [];
    }
  }

  /**
   * Delete a round
   */
  static async deleteRound(roundId: string): Promise<void> {
    const file = new File(this.roundsDir, `${roundId}.json`);
    const backupFile = new File(this.roundsDir, `${roundId}.json.bak`);

    try {
      if (file.exists) {
        file.delete();
      }

      if (backupFile.exists) {
        backupFile.delete();
      }
    } catch (error) {
      console.error('Failed to delete round:', error);
      throw error;
    }
  }

  /**
   * Save expedition
   */
  static async saveExpedition(expedition: Expedition): Promise<void> {
    const file = new File(this.expeditionsDir, `${expedition.id}.json`);
    const backupFile = new File(this.expeditionsDir, `${expedition.id}.json.bak`);

    const envelope: StorageEnvelope<Expedition> = {
      version: SCHEMA_VERSION,
      data: expedition,
      savedAt: Date.now(),
    };

    const json = JSON.stringify(envelope, null, 2);

    try {
      await backupFile.create({ overwrite: true });
      backupFile.write(json);
      await backupFile.move(file, { overwrite: true });
    } catch (error) {
      console.error('Failed to save expedition:', error);
      throw error;
    }
  }

  /**
   * Load expedition
   */
  static async loadExpedition(expeditionId: string): Promise<Expedition | null> {
    const file = new File(this.expeditionsDir, `${expeditionId}.json`);

    try {
      const exists = file.exists;
      if (!exists) {
        return null;
      }

      const json = await file.text();
      const envelope: StorageEnvelope<Expedition> = JSON.parse(json);

      return envelope.data;
    } catch (error) {
      console.error('Failed to load expedition:', error);
      return null;
    }
  }

  /**
   * Save custom game deck
   */
  static async saveDeck(deck: GameDeck): Promise<void> {
    const file = new File(this.decksDir, `${deck.id}.json`);
    const backupFile = new File(this.decksDir, `${deck.id}.json.bak`);

    const envelope: StorageEnvelope<GameDeck> = {
      version: SCHEMA_VERSION,
      data: deck,
      savedAt: Date.now(),
    };

    const json = JSON.stringify(envelope, null, 2);

    try {
      await backupFile.create({ overwrite: true });
      backupFile.write(json);
      await backupFile.move(file, { overwrite: true });
    } catch (error) {
      console.error('Failed to save deck:', error);
      throw error;
    }
  }

  /**
   * Load all game decks (built-in + custom)
   */
  static async loadAllDecks(): Promise<GameDeck[]> {
    try {
      const items = await this.decksDir.list();
      const deckFiles = items.filter(item =>
        item instanceof File &&
        item.name.endsWith('.json') &&
        !item.name.endsWith('.bak')
      ) as File[];

      const decks = await Promise.all(
        deckFiles.map(async (file) => {
          const json = await file.text();
          const envelope: StorageEnvelope<GameDeck> = JSON.parse(json);
          return envelope.data;
        })
      );

      return decks;
    } catch (error) {
      console.error('Failed to load decks:', error);
      return [];
    }
  }

  /**
   * Schema migration handler
   * Add version-specific transformations here
   */
  private static migrateRound(envelope: StorageEnvelope<any>): RoundState {
    let data = envelope.data;

    // Example migration from v0 to v1
    // if (envelope.version < 1) {
    //   data = {
    //     ...data,
    //     newField: defaultValue,
    //   };
    // }

    return data as RoundState;
  }
}
