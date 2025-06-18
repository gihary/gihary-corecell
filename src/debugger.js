// Environment check and debugging utilities
import fs from 'fs';

/**
 * Perform basic environment checks and return status.
 * @returns {object} - Information about the running environment
 */
export function checkEnvironment() {
  const nodeVersion = process.version;
  const envLoaded = fs.existsSync('.env');
  return { nodeVersion, envLoaded };
}
