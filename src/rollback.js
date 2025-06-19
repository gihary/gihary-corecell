// Module to handle data rollback operations
import { getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();

/**
 * Restore previous data snapshot for a user closest to the given timestamp.
 * @param {string} userId - Unique identifier of the user
 * @param {string|Date} timestamp - Target timestamp
 * @returns {Promise<object|null>} - Restored data or null
 */
export async function rollbackMemory(userId, timestamp) {
  const entriesRef = db.collection('core').doc(userId).collection('entries');
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
export function diffEntries(oldEntry, newEntry) {
  // TODO: Implement diff logic
  return {};
}
