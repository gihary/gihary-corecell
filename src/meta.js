// Module for higher level orchestration of agents

/**
 * Suggest an additional agent based on summary text and ranking scores.
 *
 * @param {{summary?:string, scoreBreakdown?:{relevance:number}}} analysis
 * @returns {string|null} Suggested agent name or null
 */
export function suggestAgentIfNeeded(analysis = {}) {
  const { summary = '', scoreBreakdown = {} } = analysis;
  const relevance = Number(scoreBreakdown.relevance) || 0;
  const text = summary.toLowerCase();

  const crmKeywords = [
    'appuntamento',
    'contatto',
    'lead',
    'richiesta',
    'invia',
    'chiamare',
    'client',
  ];
  const webKeywords = ['sito', 'pagina', 'url', 'landing'];

  if (relevance >= 7 && crmKeywords.some((k) => text.includes(k))) {
    return 'CRMAgent';
  }

  if (webKeywords.some((k) => text.includes(k))) {
    return 'WebAgent';
  }

  return null;
}
