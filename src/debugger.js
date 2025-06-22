// Environment check and advanced debugging utilities
import fs from 'fs';

const logFile = 'debug.log';
const memoryLogs = [];
let verbose = false;

/**
 * Initialize the debugger with configuration options.
 * @param {{ verbose?: boolean }} config
 */
export function setupDebugger(config = {}) {
  verbose = Boolean(config.verbose);
}

/**
 * Enable or disable verbose output at runtime.
 * @param {boolean} flag
 */
export function setVerbose(flag) {
  verbose = Boolean(flag);
}

/**
 * Toggle the current verbose setting.
 * @returns {boolean} - The new verbose state
 */
export function toggleSilent() {
  verbose = !verbose;
  return verbose;
}

/**
 * Log an arbitrary state message.
 * @param {string} message
 * @param {object} [payload]
 */
export function logState(message, payload = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    type: 'state',
    message,
    payload,
  };
  memoryLogs.push(entry);
  fs.appendFileSync(logFile, JSON.stringify(entry) + '\n');
  if (verbose) {
    console.log('[STATE]', message, payload);
  }
}

/**
 * Log an error with stack trace information.
 * @param {Error|string} error
 */
export function logError(error) {
  const entry = {
    timestamp: new Date().toISOString(),
    type: 'error',
    error: error?.stack || error?.toString(),
  };
  memoryLogs.push(entry);
  fs.appendFileSync(logFile, JSON.stringify(entry) + '\n');
  if (verbose) {
    console.error('[ERROR]', error);
  }
}


/**
 * Retrieve the in-memory log list.
 * @returns {Array<object>}
 */
export function getLogs() {
  return memoryLogs;
}

