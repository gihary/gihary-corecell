// Module responsible for relevance ranking of data

// Weighting factors for each ranking dimension. These values can be
// tuned in the future to adjust how much each aspect contributes to the
// final score. The weights should sum roughly to 1.
const RELEVANCE_WEIGHT = 0.4;
const NOVELTY_WEIGHT = 0.2;
const PERSONAL_CONTEXT_WEIGHT = 0.2;
const FUTURE_APPLICABILITY_WEIGHT = 0.2;

/**
 * Evaluate the relevance of the analyzed text using simple heuristics.
 * Each factor contributes to the final numeric score according to the
 * weights defined above. The returned value ranges from 1 to 10.
 *
 * @param {object} analysis - Output from analyzeTextWithGemini
 * @returns {number} - Overall relevance score between 1 and 10
 */
export function evaluateRelevance(analysis) {
  // Basic heuristics for each dimension with fallbacks
  const relevance = Math.min(1, (analysis?.entities?.length || 0) / 10);
  const novelty = Math.min(1, (analysis?.concepts?.length || 0) / 10);
  const personalContext = analysis?.entities?.some(e => /\b(I|me|my)\b/i.test(e)) ? 1 : 0;
  const futureApplicability = Math.min(1, (analysis?.questions?.length || 0) / 5);

  const weighted =
    RELEVANCE_WEIGHT * relevance +
    NOVELTY_WEIGHT * novelty +
    PERSONAL_CONTEXT_WEIGHT * personalContext +
    FUTURE_APPLICABILITY_WEIGHT * futureApplicability;

  // Convert to 1-10 scale and ensure at least 1
  return Math.max(1, Math.round(weighted * 10));
}

/**
 * Placeholder for a future ranking model training routine. It currently does
 * nothing but can be expanded to update the weighting factors or to learn a
 * model from labeled data.
 *
 * @param {Array<object>} _dataset - Training data
 */
export function trainRankingModel(_dataset) {
  // To be implemented in the future
}
