/**
 * Device Health Check
 *
 * Validates critical APIs on device load:
 * - File System API (expo-file-system)
 * - SQLite API (expo-sqlite)
 * - Storage read/write capability
 *
 * Auto-runs on app load, reports results to console
 */

import * as SQLite from 'expo-sqlite';
import { Paths, File } from 'expo-file-system';

export interface HealthCheckResult {
  timestamp: string;
  platform: string;
  checks: {
    fileSystemAvailable: boolean;
    sqliteAvailable: boolean;
    storageWritable: boolean;
    storageReadable: boolean;
  };
  errors: string[];
  success: boolean;
}

/**
 * Run full health check suite
 */
export async function runHealthCheck(): Promise<HealthCheckResult> {
  const result: HealthCheckResult = {
    timestamp: new Date().toISOString(),
    platform: 'unknown',
    checks: {
      fileSystemAvailable: false,
      sqliteAvailable: false,
      storageWritable: false,
      storageReadable: false,
    },
    errors: [],
    success: false,
  };

  // Detect platform
  try {
    const { Platform } = require('react-native');
    result.platform = Platform.OS;
  } catch (err) {
    result.errors.push('Could not detect platform');
  }

  // Check 1: File System API
  try {
    const docDir = Paths.document;
    if (docDir) {
      result.checks.fileSystemAvailable = true;
      console.log('✓ File System API available:', docDir.uri);
    } else {
      result.errors.push('Paths.document is null');
    }
  } catch (err) {
    result.errors.push(`File System check failed: ${err}`);
    console.error('❌ File System API failed:', err);
  }

  // Check 2: SQLite API
  try {
    const db = await SQLite.openDatabaseAsync('health-check.db');
    if (db) {
      result.checks.sqliteAvailable = true;
      console.log('✓ SQLite API available');
      // Clean up test DB
      await db.closeAsync();
    }
  } catch (err) {
    result.errors.push(`SQLite check failed: ${err}`);
    console.error('❌ SQLite API failed:', err);
  }

  // Check 3: Storage Write
  try {
    const testFile = new File(Paths.document, `health-check-${Date.now()}.json`);
    const testData = JSON.stringify({ test: true, timestamp: Date.now() });
    await testFile.write(testData);
    result.checks.storageWritable = true;
    console.log('✓ Storage write OK');

    // Check 4: Storage Read (depends on write success)
    const readData = await testFile.text();
    if (readData === testData) {
      result.checks.storageReadable = true;
      console.log('✓ Storage read OK');
    } else {
      result.errors.push('Storage read returned incorrect data');
    }

    // Clean up test file
    await testFile.delete();
  } catch (err) {
    result.errors.push(`Storage read/write failed: ${err}`);
    console.error('❌ Storage read/write failed:', err);
  }

  // Overall success
  result.success = Object.values(result.checks).every((v) => v === true);

  return result;
}

/**
 * Auto-run health check and log results
 * Call this from App.tsx useEffect on mount
 */
export async function autoHealthCheck(): Promise<void> {
  console.log('🔍 Running device health check...');
  console.log('===================================');

  const result = await runHealthCheck();

  console.log('');
  console.log('Platform:', result.platform);
  console.log('Checks:');
  console.log('  File System API:', result.checks.fileSystemAvailable ? '✅' : '❌');
  console.log('  SQLite API:', result.checks.sqliteAvailable ? '✅' : '❌');
  console.log('  Storage Write:', result.checks.storageWritable ? '✅' : '❌');
  console.log('  Storage Read:', result.checks.storageReadable ? '✅' : '❌');

  if (result.errors.length > 0) {
    console.log('');
    console.log('Errors:');
    result.errors.forEach((err) => console.log('  -', err));
  }

  console.log('');
  if (result.success) {
    console.log('✅ All health checks passed');
  } else {
    console.log('❌ Some health checks failed - see errors above');
  }
  console.log('===================================');

  // Write result to file for external inspection
  try {
    const resultFile = new File(Paths.document, 'health-check-result.json');
    await resultFile.write(JSON.stringify(result, null, 2));
    console.log('📝 Health check results saved to:', resultFile.uri);
  } catch (err) {
    console.error('Failed to save health check results:', err);
  }
}
