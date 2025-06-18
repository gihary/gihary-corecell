// Minimal Express server exposing the ingestion endpoint
import express from 'express';
import dotenv from 'dotenv';
import { ingestText } from './ingestor.js';

dotenv.config();

const app = express();
app.use(express.json());

app.post('/gihary-ingest', async (req, res) => {
  const { userId, source, text } = req.body;
  if (!userId || !source || !text) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    const result = await ingestText(userId, source, text);
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Gihary CoreCell listening on port ${PORT}`);
});
