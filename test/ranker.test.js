import { evaluateRelevance, trainRankingModel } from '../src/ranker.js';

test('evaluateRelevance returns value 1-10', () => {
  const score = evaluateRelevance({ entities: [], concepts: [], questions: [] });
  expect(score).toBeGreaterThanOrEqual(1);
  expect(score).toBeLessThanOrEqual(10);
});

test('trainRankingModel returns structured score', () => {
  const result = trainRankingModel({ text: 'Andr\u00f2 a Roma con Luca' }, {
    pastEntries: ['I was in Milan last year'],
    personalKeywords: ['Luca', 'Roma'],
  });
  expect(result).toHaveProperty('score');
  expect(result).toHaveProperty('breakdown');
  expect(result.breakdown).toHaveProperty('relevance');
  expect(result.breakdown).toHaveProperty('novelty');
  expect(result.breakdown).toHaveProperty('personalContext');
  expect(result.breakdown).toHaveProperty('futureValue');
  expect(result.score).toBeGreaterThanOrEqual(1);
  expect(result.score).toBeLessThanOrEqual(10);
});
