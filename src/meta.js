// Module for higher level orchestration of agents

/**
 * Suggest an additional agent based on analysis if required.
 *
 * A suggestion is made when the provided relevance score is higher than a
 * predefined threshold and at least one of the supplied keywords is detected
 * in the analysis summary. Keyword matching is case-insensitive.
 *
 * @param {object} analysis - Analysis result
 * @param {number} relevanceScore - Computed relevance of the analysis
 * @param {Array<string>} keywords - List of keywords to look for
 * @returns {string|null} - Suggested agent name or null
 */
export function suggestAgentIfNeeded(analysis, relevanceScore = 0, keywords = []) {
  const RELEVANCE_THRESHOLD = 7;
  const summary = (analysis.summary || '').toLowerCase();

  const keywordMatch = Array.isArray(keywords)
    ? keywords.some((k) => summary.includes(k.toLowerCase()))
    : false;

  if (relevanceScore > RELEVANCE_THRESHOLD && keywordMatch) {
    return 'action-agent';
  }

  return null;
}
