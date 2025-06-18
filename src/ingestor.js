// Main ingestion module combining parsers and analysis
import { parseEmail } from './parser/emailParser.js';
import { parseWhatsappMessage } from './parser/whatsappParser.js';
import { parseTextFile } from './parser/fileParser.js';
import { analyzeTextWithGemini } from './geminiAnalyzer.js';
import { saveToCore } from './core.js';
import { logEvent } from './logger.js';

/**
 * Ingest raw text from various sources and persist the analysis.
 * @param {string} userId - Unique identifier of the user
 * @param {string} source - Source type ('email', 'whatsapp', 'file')
 * @param {string} raw - Raw input text
 */
export async function ingestText(userId, source, raw) {
  let parsed;
  switch (source) {
    case 'email':
      parsed = parseEmail(raw);
      break;
    case 'whatsapp':
      parsed = parseWhatsappMessage(raw);
      break;
    case 'file':
      parsed = parseTextFile(raw);
      break;
    default:
      throw new Error('Unknown source type');
  }

  const analysis = await analyzeTextWithGemini(parsed);
  await saveToCore(userId, { source, parsed, analysis });
  logEvent('ingest', { userId, source });
  return analysis;
}
