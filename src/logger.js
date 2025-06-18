// Simple logging module
import fs from 'fs';

const logFile = 'gihary.log';

/**
 * Append an event to the log file.
 * @param {string} type - Event type
 * @param {object} data - Arbitrary event data
 */
export function logEvent(type, data) {
  const entry = { timestamp: new Date().toISOString(), type, data };
  fs.appendFileSync(logFile, JSON.stringify(entry) + '\n');
}
