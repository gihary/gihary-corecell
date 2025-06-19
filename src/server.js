// Minimal Express server exposing the ingestion endpoint
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ingestText } from './ingestor.js';
import { logEvent } from './logger.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.post('/gihary-ingest', async (req, res) => {
const { input, type, userId = 'anonymous' } = req.body;

if (!input || !type) {
  return res.status(400).json({ success: false, error: 'Missing parameters' });
}

try {
  logEvent('api.request', { userId, type });
  const data = await ingestText(userId, type, input);
  logEvent('api.success', { userId, type });
  res.json({ success: true, data });
} catch (error) {
  logEvent('api.error', { userId, type, error: error.message });
  res.status(500).json({ success: false, error: error.message });
}

  } catch (err) {
    logEvent('api.error', { userId, type, message: err.message });
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Gihary CoreCell listening on port ${PORT}`);
});
