// Module responsible for relevance ranking of data

/**
 * Evaluate the relevance of the analyzed text.
 * @param {object} analysis - Output from analyzeTextWithGemini
 * @returns {number} - Relevance score between 0 and 1
 */
export function evaluateRelevance(analysis) {
  // Placeholder logic for ranking
  const length = analysis?.summary?.length || 0;
  return Math.min(1, length / 1000);
}
