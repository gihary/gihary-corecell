// Module responsible for relevance ranking of data

// Weighting factors for each ranking dimension. These values can be
// tuned in the future to adjust how much each aspect contributes to the
// final score. The weights should sum roughly to 1.
const RELEVANCE_WEIGHT = 0.4;
const NOVELTY_WEIGHT = 0.3;
const PERSONAL_CONTEXT_WEIGHT = 0.2;
const FUTURE_APPLICABILITY_WEIGHT = 0.1;

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
 * Analyze an entry and compute a weighted ranking score. This is a very
 * lightweight implementation that relies on simple heuristics for relevance,
 * novelty, personal context and future applicability.
 *
 * @param {{ text: string }} entry - Entry to evaluate
 * @param {object} [options]
 * @param {Array<string>} [options.pastEntries] - Previous texts for novelty
 * @param {Array<string>} [options.personalKeywords] - User keywords
 * @returns {{ score:number, breakdown:{relevance:number,novelty:number,personalContext:number,futureValue:number} }}
 */
export function trainRankingModel(entry = {}, options = {}) {
  const { pastEntries = [], personalKeywords = [] } = options;
  const text = (entry.text || '').toString();

  const relevance = calculateRelevance(text);
  const novelty = estimateNovelty(text, pastEntries);
  const personalContext = detectPersonalContext(text, personalKeywords);
  const futureValue = detectFutureValue(text);

  const weighted =
    (relevance / 10) * RELEVANCE_WEIGHT +
    (novelty / 10) * NOVELTY_WEIGHT +
    (personalContext / 10) * PERSONAL_CONTEXT_WEIGHT +
    (futureValue / 10) * FUTURE_APPLICABILITY_WEIGHT;

  return {
    score: Number((weighted * 10).toFixed(1)),
    breakdown: { relevance, novelty, personalContext, futureValue },
  };
}

function calculateRelevance(text) {
  const words = text.split(/\s+/).filter(Boolean);
  const unique = new Set(words.map((w) => w.toLowerCase())).size;
  if (!words.length) return 1;
  const density = unique / words.length;
  return clamp(Math.round(density * 10), 1, 10);
}

function estimateNovelty(text, pastEntries) {
  if (!pastEntries || pastEntries.length === 0) return 10;
  const sims = pastEntries.map((p) => jaccardSimilarity(text, p));
  const avg = sims.reduce((a, b) => a + b, 0) / sims.length;
  return clamp(Math.round((1 - avg) * 10), 1, 10);
}

function detectPersonalContext(text, keywords) {
  if (!keywords || keywords.length === 0) return 1;
  const lower = text.toLowerCase();
  const found = keywords.filter((k) => lower.includes(k.toLowerCase())).length;
  const ratio = found / keywords.length;
  return clamp(Math.round(ratio * 10) || 1, 1, 10);
}

function detectFutureValue(text) {
  const matches = text.match(/\b(will|shall|going to|devo|andr[oà]|prenoter[oà]|dovr[oà]|far[oà])\b/gi) || [];
  return clamp(matches.length + 1, 1, 10);
}

function jaccardSimilarity(a, b) {
  const setA = new Set(a.toLowerCase().split(/\W+/).filter(Boolean));
  const setB = new Set(b.toLowerCase().split(/\W+/).filter(Boolean));
  const intersection = [...setA].filter((w) => setB.has(w));
  const union = new Set([...setA, ...setB]);
  return union.size === 0 ? 0 : intersection.length / union.size;
}

function clamp(num, min, max) {
  return Math.min(max, Math.max(min, num));
}
