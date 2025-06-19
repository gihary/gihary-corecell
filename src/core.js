// Core module to manage Firestore persistence
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

dotenv.config();

const app = initializeApp({
  credential: applicationDefault(),
  projectId: process.env.FIREBASE_PROJECT_ID,
});

const db = getFirestore(app);

/**
 * Save arbitrary data to the Firestore core collection.
 * @param {string} userId - Unique identifier of the user
 * @param {object} payload - Data to store
 * @returns {Promise<void>} - Resolves when saved
 */
export async function saveToCore(userId, payload) {
  await db.collection('core').doc(userId).set(payload, { merge: true });

  // Also keep a timestamped backup entry for rollback
  const entry = {
    timestamp: new Date().toISOString(),
    data: payload,
  };
  await db.collection('core').doc(userId).collection('entries').add(entry);
}
