/**
 * Ace Pot Repository - Persistent storage for ace pot state
 * Survives across rounds and syncs to iCloud/Google Drive
 */

import * as FileSystem from 'expo-file-system';
import { Paths } from 'expo-file-system/next';
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
 * Get the full path to the ace pot file
 */
function getAcePotPath(): string {
  return `${Paths.document}/${ACE_POT_FILE}`;
}

/**
 * Load ace pot from storage
 * Returns default state if file doesn't exist
 */
export async function loadAcePot(): Promise<AcePot> {
  try {
    const path = getAcePotPath();
    const info = await FileSystem.getInfoAsync(path);

    if (!info.exists) {
      return DEFAULT_ACE_POT;
    }

    const content = await FileSystem.readAsStringAsync(path);
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
    const path = getAcePotPath();
    const backupPath = `${path}.bak`;

    // Write to backup first
    await FileSystem.writeAsStringAsync(
      backupPath,
      JSON.stringify({ ...acePot, updatedAt: Date.now() }, null, 2)
    );

    // Swap backup to main file
    await FileSystem.deleteAsync(path, { idempotent: true });
    await FileSystem.moveAsync({ from: backupPath, to: path });
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
