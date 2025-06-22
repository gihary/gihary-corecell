// Core module to manage Firestore persistence
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import './env.js';
import fs from 'fs';
import path from 'path';

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

  // Persist a local copy in core/{userId}/entries/YYYY-MM-DD.json
  const dir = path.join('core', userId, 'entries');
  fs.mkdirSync(dir, { recursive: true });
  const file = new Date().toISOString().slice(0, 10) + '.json';
  fs.writeFileSync(path.join(dir, file), JSON.stringify(payload, null, 2));
}
