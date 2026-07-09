/**
 * iCloud Drive Backup - Automatic backup of round data to iCloud
 * iOS only - uses iCloud Documents directory for automatic sync
 */

import * as FileSystem from 'expo-file-system';
import { Paths } from 'expo-file-system/next';
import { Platform } from 'react-native';
import { CloudBackupConfig } from '../types/game';

const BACKUP_CONFIG_FILE = 'cloud-backup-config.json';
const BACKUP_DIR = 'YardWarsBackup';

/**
 * Default backup configuration
 */
const DEFAULT_CONFIG: CloudBackupConfig = {
  enabled: false,
  provider: 'icloud',
  autoSyncOnWifi: true,
};

/**
 * Check if iCloud is available (iOS only)
 */
export function isICloudAvailable(): boolean {
  return Platform.OS === 'ios';
}

/**
 * Get iCloud Documents directory path
 * Returns null if iCloud not available
 */
function getICloudPath(): string | null {
  if (!isICloudAvailable()) {
    return null;
  }

  // On iOS, Expo file system's document directory is iCloud-enabled
  // if the app has iCloud Documents capability enabled
  return `${Paths.document}/${BACKUP_DIR}`;
}

/**
 * Load backup configuration
 */
export async function loadBackupConfig(): Promise<CloudBackupConfig> {
  try {
    const configPath = `${Paths.document}/${BACKUP_CONFIG_FILE}`;
    const info = await FileSystem.getInfoAsync(configPath);

    if (!info.exists) {
      return DEFAULT_CONFIG;
    }

    const content = await FileSystem.readAsStringAsync(configPath);
    return JSON.parse(content);
  } catch (error) {
    console.error('[iCloudBackup] Failed to load config:', error);
    return DEFAULT_CONFIG;
  }
}

/**
 * Save backup configuration
 */
export async function saveBackupConfig(
  config: CloudBackupConfig
): Promise<void> {
  try {
    const configPath = `${Paths.document}/${BACKUP_CONFIG_FILE}`;
    await FileSystem.writeAsStringAsync(
      configPath,
      JSON.stringify(config, null, 2)
    );
  } catch (error) {
    console.error('[iCloudBackup] Failed to save config:', error);
    throw error;
  }
}

/**
 * Enable iCloud backup
 */
export async function enableICloudBackup(): Promise<void> {
  if (!isICloudAvailable()) {
    throw new Error('iCloud is not available on this platform');
  }

  const icloudPath = getICloudPath();
  if (!icloudPath) {
    throw new Error('Could not get iCloud path');
  }

  // Ensure backup directory exists
  const info = await FileSystem.getInfoAsync(icloudPath);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(icloudPath, { intermediates: true });
  }

  const config: CloudBackupConfig = {
    enabled: true,
    provider: 'icloud',
    autoSyncOnWifi: true,
  };

  await saveBackupConfig(config);
}

/**
 * Disable iCloud backup
 */
export async function disableICloudBackup(): Promise<void> {
  const config: CloudBackupConfig = {
    ...DEFAULT_CONFIG,
    enabled: false,
  };

  await saveBackupConfig(config);
}

/**
 * Backup a file to iCloud
 */
export async function backupFile(localFilePath: string): Promise<void> {
  const config = await loadBackupConfig();

  if (!config.enabled || config.provider !== 'icloud') {
    return; // Backup disabled or wrong provider
  }

  if (!isICloudAvailable()) {
    return;
  }

  const icloudPath = getICloudPath();
  if (!icloudPath) {
    return;
  }

  try {
    const fileName = localFilePath.split('/').pop();
    if (!fileName) {
      return;
    }

    const backupPath = `${icloudPath}/${fileName}`;

    // Copy file to iCloud directory
    // iOS automatically syncs files in this directory to iCloud Drive
    await FileSystem.copyAsync({
      from: localFilePath,
      to: backupPath,
    });

    // Update last sync timestamp
    await saveBackupConfig({
      ...config,
      lastSyncTimestamp: Date.now(),
    });
  } catch (error) {
    console.error('[iCloudBackup] Failed to backup file:', error);
  }
}

/**
 * Restore a file from iCloud
 */
export async function restoreFile(
  fileName: string,
  destinationPath: string
): Promise<boolean> {
  const config = await loadBackupConfig();

  if (!config.enabled || config.provider !== 'icloud') {
    return false;
  }

  const icloudPath = getICloudPath();
  if (!icloudPath) {
    return false;
  }

  try {
    const backupPath = `${icloudPath}/${fileName}`;
    const info = await FileSystem.getInfoAsync(backupPath);

    if (!info.exists) {
      return false;
    }

    await FileSystem.copyAsync({
      from: backupPath,
      to: destinationPath,
    });

    return true;
  } catch (error) {
    console.error('[iCloudBackup] Failed to restore file:', error);
    return false;
  }
}

/**
 * List all backed up files
 */
export async function listBackupFiles(): Promise<string[]> {
  const icloudPath = getICloudPath();
  if (!icloudPath) {
    return [];
  }

  try {
    const info = await FileSystem.getInfoAsync(icloudPath);
    if (!info.exists) {
      return [];
    }

    const files = await FileSystem.readDirectoryAsync(icloudPath);
    return files;
  } catch (error) {
    console.error('[iCloudBackup] Failed to list backup files:', error);
    return [];
  }
}

/**
 * Get backup status (for UI display)
 */
export async function getBackupStatus(): Promise<{
  enabled: boolean;
  lastSync?: number;
  fileCount: number;
}> {
  const config = await loadBackupConfig();
  const files = await listBackupFiles();

  return {
    enabled: config.enabled && config.provider === 'icloud',
    lastSync: config.lastSyncTimestamp,
    fileCount: files.length,
  };
}
