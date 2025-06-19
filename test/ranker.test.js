import { evaluateRelevance } from '../src/ranker.js';

test('evaluateRelevance returns value 1-10', () => {
  const score = evaluateRelevance({ entities: [], concepts: [], questions: [] });
  expect(score).toBeGreaterThanOrEqual(1);
  expect(score).toBeLessThanOrEqual(10);
});
