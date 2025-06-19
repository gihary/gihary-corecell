// Main ingestion module combining parsers and analysis
import { parseEmail } from './parser/emailParser.js';
import { parseWhatsappMessage } from './parser/whatsappParser.js';
import { parseTextFile } from './parser/fileParser.js';
import { parseClipboard } from './parser/clipboardParser.js';
import { analyzeTextWithGemini } from './geminiAnalyzer.js';
import { evaluateRelevance } from './ranker.js';
import { suggestAgentIfNeeded } from './meta.js';
import { saveToCore } from './core.js';
import { logEvent } from './logger.js';

/**
 * Ingest raw text from various sources and persist the analysis.
 * @param {string} userId - Unique identifier of the user
 * @param {string} source - Source type ('email', 'whatsapp', 'file', 'clipboard')
 * @param {string} raw - Raw input text
 * @returns {Promise<object>} - Object containing analysis, score and suggestedAgents
 */
export async function ingestText(userId, source, raw) {
  logEvent('ingest.start', { userId, source });
  let parsed;
  switch (source) {
    case 'email':
      parsed = parseEmail(raw);
      logEvent('ingest.parse', { userId, source: 'email' });
      break;
    case 'whatsapp':
      parsed = parseWhatsappMessage(raw);
      logEvent('ingest.parse', { userId, source: 'whatsapp' });
      break;
    case 'file':
      parsed = parseTextFile(raw);
      logEvent('ingest.parse', { userId, source: 'file' });
      break;
    case 'clipboard':
      parsed = parseClipboard(raw);
      logEvent('ingest.parse', { userId, source: 'clipboard' });
      break;
    default:
      logEvent('ingest.error', { userId, source });
      throw new Error('Unknown source type');
  }

  const analysis = await analyzeTextWithGemini(parsed);
  logEvent('ingest.analyze', { userId, source });
  const score = evaluateRelevance(analysis);
  const suggested = suggestAgentIfNeeded(analysis);
  const suggestedAgents = suggested ? [suggested] : [];

  await saveToCore(userId, { source, parsed, analysis, score, suggestedAgents });
  logEvent('ingest.save', { userId, source, score, suggestedAgents });
  return { analysis, score, suggestedAgents };
}
