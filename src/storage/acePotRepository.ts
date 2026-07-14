/**
 * Ace Pot Repository - Persistent storage for ace pot state
 * Survives across rounds and syncs to iCloud/Google Drive
 * Uses Expo SDK 57 FileSystem API
 */

import { Paths, File } from 'expo-file-system';
import { AcePot, AcePotContribution, AcePotWinner } from '../types/game';

const ACE_POT_FILE = 'ace-pot.json';

/**
 * Default ace pot state
 */
const DEFAULT_ACE_POT: AcePot = {
  totalValue: 0,
  contributionHistory: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

/**
 * Get the ace pot file handle
 */
function getAcePotFile(): File {
  return new File(Paths.document, ACE_POT_FILE);
}

/**
 * Load ace pot from storage
 * Returns default state if file doesn't exist
 */
export async function loadAcePot(): Promise<AcePot> {
  try {
    const file = getAcePotFile();

    // Check if file exists (property, not method)
    if (!file.exists) {
      return DEFAULT_ACE_POT;
    }

    const content = await file.text();
    const acePot: AcePot = JSON.parse(content);
    return acePot;
  } catch (error) {
    console.error('[AcePotRepository] Failed to load ace pot:', error);
    return DEFAULT_ACE_POT;
  }
}

/**
 * Save ace pot to storage with atomic write
 */
export async function saveAcePot(acePot: AcePot): Promise<void> {
  try {
    const file = getAcePotFile();
    const backupFile = new File(Paths.document, `${ACE_POT_FILE}.bak`);

    // Write to backup first
    await backupFile.create({ overwrite: true });
    await backupFile.write(
      JSON.stringify({ ...acePot, updatedAt: Date.now() }, null, 2)
    );

    // Swap backup to main file (atomic operation)
    await backupFile.move(file, { overwrite: true });
  } catch (error) {
    console.error('[AcePotRepository] Failed to save ace pot:', error);
    throw error;
  }
}

/**
 * Add contribution to ace pot
 */
export async function addContribution(
  roundId: string,
  amount: number
): Promise<AcePot> {
  const acePot = await loadAcePot();

  const contribution: AcePotContribution = {
    roundId,
    amount,
    timestamp: Date.now(),
  };

  const updated: AcePot = {
    ...acePot,
    totalValue: acePot.totalValue + amount,
    contributionHistory: [...acePot.contributionHistory, contribution],
    updatedAt: Date.now(),
  };

  await saveAcePot(updated);
  return updated;
}

/**
 * Award ace pot to winner
 */
export async function awardAcePot(winner: AcePotWinner): Promise<AcePot> {
  const acePot = await loadAcePot();

  const updated: AcePot = {
    ...acePot,
    totalValue: 0, // Reset pot after win
    lastWinner: winner,
    updatedAt: Date.now(),
  };

  await saveAcePot(updated);
  return updated;
}

/**
 * Get current ace pot value
 */
export async function getAcePotValue(): Promise<number> {
  const acePot = await loadAcePot();
  return acePot.totalValue;
}

/**
 * Reset ace pot (for testing or manual reset)
 */
export async function resetAcePot(): Promise<void> {
  await saveAcePot(DEFAULT_ACE_POT);
}
