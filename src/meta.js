// Module for higher level orchestration of agents

/**
 * Suggest an additional agent based on analysis if required.
 * @param {object} analysis - Analysis result
 * @returns {string|null} - Suggested agent name or null
 */
export function suggestAgentIfNeeded(analysis) {
  if (analysis.summary && analysis.summary.includes('action')) {
    return 'action-agent';
  }
  return null;
}
