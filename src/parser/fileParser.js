// Text file parsing utilities
import fs from 'fs';

/**
 * Read and return text from a file path.
 * @param {string} path - File system path
 * @returns {Promise<string>} - File contents
*/
export async function parseTextFile(path) {
  return await fs.promises.readFile(path, 'utf-8');
}
