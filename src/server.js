// Minimal Express server exposing the ingestion endpoint
import express from 'express';
import cors from 'cors';
import './env.js';
import { ingestText } from './ingestor.js';
import { logEvent } from './logger.js';
import { setupDebugger, logState, logError } from './debugger.js';

setupDebugger({ verbose: true });

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
    logError(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logState('server.start', { port: PORT });
  console.log(`Gihary CoreCell listening on port ${PORT}`);
});
