// Module to interact with Gemini AI for text analysis
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

/**
 * Low level helper to call Gemini API.
 * @param {string} prompt - Prompt sent to Gemini
 * @returns {Promise<object>} - Raw JSON response
 */
async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const response = await fetch(`${GEMINI_URL}?key=${apiKey}` , {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: { temperature: 0.2 },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini request failed: ${response.status} ${err}`);
  }

  return response.json();
}

/**
 * Extract structured information from Gemini response.
 * @param {object} raw - Raw JSON response from Gemini
 * @returns {object}
 */
function parseGeminiResponse(raw) {
  const text = raw?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  try {
    return JSON.parse(text);
  } catch (err) {
    return { raw: text };
  }
}

/**
 * Analyze text using Gemini AI.
 * The API is instructed to return JSON with keys: entities,
 * concepts, questions and citations.
 *
 * @param {string} text - Plain text to analyze
 * @returns {Promise<object>} - Analysis result
 */
export async function analyzeTextWithGemini(text) {
  const prompt = `Analyze the following text and return JSON with keys: entities, concepts, questions, citations. Text:\n${text}`;
  const raw = await callGemini(prompt);
  return parseGeminiResponse(raw);
}

/**
 * Placeholder for future advanced analysis steps.
 * @param {string} _text
 * @returns {null}
 */
export async function analyzeForContradictions(text, options = {}) {
  const { verbose = false } = options;

  if (!process.env.GEMINI_API_KEY) {
    if (verbose) console.log('Missing GEMINI_API_KEY');
    return { success: false, error: 'Missing GEMINI_API_KEY' };
  }

  const prompt =
    `Identify contradictions, logical inconsistencies or dubious claims in the following text. ` +
    `Respond ONLY with JSON in the form {"contradictions": ["..."]}. ` +
    `Return an empty array if none are found.\nText:\n${text}`;

  try {
    const raw = await callGemini(prompt);
    const parsed = parseGeminiResponse(raw);
    if (!Array.isArray(parsed?.contradictions)) {
      if (verbose) console.log('Invalid response from Gemini', parsed);
      return { success: false, error: 'Empty or invalid response from Gemini' };
    }
    return { success: true, contradictions: parsed.contradictions };
  } catch (error) {
    if (verbose) console.log('Gemini API error', error);
    return { success: false, error: error.message };
  }
}
