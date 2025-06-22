// Decision loop handling actions after text analysis
import { trainRankingModel } from './ranker.js';
import { suggestAgentIfNeeded } from './meta.js';
import { saveToCore } from './core.js';
import { logEvent } from './logger.js';
import { enqueueAgent } from './agentQueue.js';

/**
 * Decide how to handle analyzed data.
 * Uses ranker and meta modules to determine whether to save
 * the data, trigger a response or send a notification.
 *
 * @param {{ userId: string, source: string, parsed: any, analysis: object }} data
 * @returns {Promise<{score:number,scoreBreakdown:object,suggestedAgents:Array<string>,shouldSave:boolean,shouldRespond:boolean,shouldNotify:boolean}>}
 */
export async function processIncoming(data) {
  const { userId, source, parsed, analysis } = data;
  const text = Array.isArray(parsed)
    ? parsed.map((m) => m.text).join('\n')
    : String(parsed ?? '');
  const { score, breakdown: scoreBreakdown } = trainRankingModel({ text });
  const suggested = suggestAgentIfNeeded(analysis, score);
  const suggestedAgents = suggested ? [suggested] : [];
  suggestedAgents.forEach(enqueueAgent);

  const shouldSave = score >= 5;
  const shouldRespond = Boolean(suggested);
  const shouldNotify = score >= 8;

  if (shouldSave) {
    await saveToCore(userId, {
      source,
      parsed,
      analysis,
      score,
      scoreBreakdown,
      suggestedAgents,
    });
    logEvent('loop.save', {
      userId,
      source,
      score,
      scoreBreakdown,
      agents: suggestedAgents,
    });
  }
  if (shouldRespond) {
    logEvent('loop.respond', { userId, source, agents: suggestedAgents });
  }
  if (shouldNotify) {
    logEvent('loop.notify', { userId, source, score, scoreBreakdown });
  }

  return {
    score,
    scoreBreakdown,
    suggestedAgents,
    shouldSave,
    shouldRespond,
    shouldNotify,
  };
}
