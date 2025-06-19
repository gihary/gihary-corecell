let analyzeForContradictions;

beforeAll(async () => {
  delete process.env.GEMINI_API_KEY;
  ({ analyzeForContradictions } = await import('../src/geminiAnalyzer.js'));
});

test('returns error when API key is missing', async () => {
  const result = await analyzeForContradictions('text');
  expect(result.success).toBe(false);
  expect(result.error).toMatch(/GEMINI_API_KEY/);
});
