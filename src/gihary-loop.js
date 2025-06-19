// Decision loop handling actions after text analysis
import { evaluateRelevance } from './ranker.js';
import { suggestAgentIfNeeded } from './meta.js';
import { saveToCore } from './core.js';
import { logEvent } from './logger.js';

/**
 * Decide how to handle analyzed data.
 * Uses ranker and meta modules to determine whether to save
 * the data, trigger a response or send a notification.
 *
 * @param {{ userId: string, source: string, parsed: any, analysis: object }} data
 * @returns {Promise<{score:number,suggestedAgents:Array<string>,shouldSave:boolean,shouldRespond:boolean,shouldNotify:boolean}>}
 */
export async function processIncoming(data) {
  const { userId, source, parsed, analysis } = data;
  const score = evaluateRelevance(analysis);
  const suggested = suggestAgentIfNeeded(analysis);
  const suggestedAgents = suggested ? [suggested] : [];

  const shouldSave = score >= 5;
  const shouldRespond = Boolean(suggested);
  const shouldNotify = score >= 8;

  if (shouldSave) {
    await saveToCore(userId, { source, parsed, analysis, score, suggestedAgents });
    logEvent('loop.save', { userId, source, score });
  }
  if (shouldRespond) {
    logEvent('loop.respond', { userId, source, agent: suggested });
  }
  if (shouldNotify) {
    logEvent('loop.notify', { userId, source, score });
  }

  return { score, suggestedAgents, shouldSave, shouldRespond, shouldNotify };
}
