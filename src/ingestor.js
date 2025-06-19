// Main ingestion module combining parsers and analysis
import { parseEmail } from './parser/emailParser.js';
import { parseWhatsappMessage } from './parser/whatsappParser.js';
import { parseTextFile } from './parser/fileParser.js';
import { parseClipboard } from './parser/clipboardParser.js';
import { analyzeTextWithGemini } from './geminiAnalyzer.js';
import { processIncoming } from './gihary-loop.js';
import { logEvent } from './logger.js';
import { setupDebugger, logState, logError } from './debugger.js';
import { rollbackMemory } from './rollback.js';

/**
 * Ingest raw text from various sources and persist the analysis.
 * @param {string} userId - Unique identifier of the user
 * @param {string} source - Source type ('email', 'whatsapp', 'file', 'clipboard')
 * @param {string} raw - Raw input text
 * @returns {Promise<object>} - Object containing analysis, score and suggestedAgents
 */
export async function ingestText(userId, source, raw, options = {}) {
  const { rollbackOnError = false, rollbackTimestamp } = options;
  logEvent('ingest.start', { userId, source });
  logState('ingest.start', { userId, source });
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

  try {
    const analysis = await analyzeTextWithGemini(parsed);
    logEvent('ingest.analyze', { userId, source });

    const loopResult = await processIncoming({
      userId,
      source,
      parsed,
      analysis,
    });
    logEvent('ingest.loop', {
      userId,
      source,
      score: loopResult.score,
      suggestedAgents: loopResult.suggestedAgents,
    });

    return {
      analysis,
      score: loopResult.score,
      suggestedAgents: loopResult.suggestedAgents,
    };
  } catch (error) {
    logEvent('ingest.error', { userId, source, error: error.message });
    logError(error);
    if (rollbackOnError) {
      await rollbackMemory(userId, rollbackTimestamp);
    }
    throw error;
  }
}
