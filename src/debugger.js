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
 * Capture a variable value for later debugging.
 * @param {string} name
 * @param {any} value
 */
export function captureVar(name, value) {
  const entry = {
    timestamp: new Date().toISOString(),
    type: 'var',
    name,
    value,
  };
  memoryLogs.push(entry);
  fs.appendFileSync(logFile, JSON.stringify(entry) + '\n');
  if (verbose) {
    console.log(`[VAR] ${name}=`, value);
  }
}

/**
 * Retrieve the in-memory log list.
 * @returns {Array<object>}
 */
export function getLogs() {
  return memoryLogs;
}

/**
 * Perform basic environment checks and return status.
 * @returns {object} - Information about the running environment
 */
export function checkEnvironment() {
  const nodeVersion = process.version;
  const envLoaded = fs.existsSync('.env');
  return { nodeVersion, envLoaded };
}
