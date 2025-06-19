// Minimal Express server exposing the ingestion endpoint
import express from 'express';
import dotenv from 'dotenv';
import { ingestText } from './ingestor.js';

dotenv.config();

const app = express();
app.use(express.json());

app.post('/gihary-ingest', async (req, res) => {
  const { input, type } = req.body;
  if (!input || !type) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    // Use a placeholder user id for this demo endpoint
    const result = await ingestText('demo', type, input);
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Gihary CoreCell listening on port ${PORT}`);
});
