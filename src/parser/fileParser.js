// Text file parsing utilities
import fs from 'fs';

/**
 * Read and return text from a file path.
 * @param {string} path - File system path
 * @returns {string} - File contents
 */
export function parseTextFile(path) {
  return fs.readFileSync(path, 'utf-8');
}
