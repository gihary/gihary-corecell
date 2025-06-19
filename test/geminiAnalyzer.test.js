import { analyzeForContradictions } from '../src/geminiAnalyzer.js';

test('analyzeForContradictions returns null', () => {
  expect(analyzeForContradictions('text')).toBeNull();
});
