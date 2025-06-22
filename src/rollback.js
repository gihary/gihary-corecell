// Module to handle data rollback operations
import { getFirestore } from 'firebase-admin/firestore';

let db;
function firestore() {
  if (!db) {
    db = getFirestore();
  }
  return db;
}

/**
 * Restore previous data snapshot for a user closest to the given timestamp.
 * @param {string} userId - Unique identifier of the user
 * @param {string|Date} timestamp - Target timestamp
 * @returns {Promise<object|null>} - Restored data or null
 */
export async function rollbackMemory(userId, timestamp) {
  const entriesRef = firestore().collection('core').doc(userId).collection('entries');
  const entriesSnap = await entriesRef.orderBy('timestamp').get();
  if (entriesSnap.empty) return null;

  const target = timestamp ? new Date(timestamp).getTime() : Date.now();
  let closest = null;
  let minDiff = Infinity;
  entriesSnap.forEach((doc) => {
    const entry = doc.data();
    const ts = new Date(entry.timestamp).getTime();
    const diff = Math.abs(ts - target);
    if (diff < minDiff) {
      minDiff = diff;
      closest = entry;
    }
  });

  return closest ? closest.data : null;
}

// Placeholder for future diff/compare utilities
/**
 * Compare two entry objects and return the changed keys with old and new values.
 * @param {object} oldEntry - Original entry
 * @param {object} newEntry - Updated entry
 * @returns {object} Object where each key maps to { old, new }
 */
export function diffEntries(oldEntry = {}, newEntry = {}, options = {}) {
  const { fieldsToIgnore = [] } = options;

  const differences = {};
  const keys = new Set([
    ...Object.keys(oldEntry || {}),
    ...Object.keys(newEntry || {}),
  ]);

  keys.forEach((key) => {
    if (fieldsToIgnore.includes(key)) return;
    if (oldEntry[key] !== newEntry[key]) {
      differences[key] = { old: oldEntry[key], new: newEntry[key] };
    }
  });

  return { differences };
}
