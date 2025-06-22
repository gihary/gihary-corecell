import { jest } from '@jest/globals';

let analyzeForContradictions;

beforeEach(() => {
  jest.resetModules();
  delete process.env.GEMINI_API_KEY;
  if (global.fetch && jest.isMockFunction(global.fetch)) {
    global.fetch.mockRestore();
  }
});

test('returns error when API key is missing', async () => {
  ({ analyzeForContradictions } = await import('../src/geminiAnalyzer.js'));
  const result = await analyzeForContradictions('text');
  expect(result.success).toBe(false);
  expect(result.error).toMatch(/GEMINI_API_KEY/);
});

test('handles API request errors', async () => {
  process.env.GEMINI_API_KEY = 'key';
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    status: 500,
    text: async () => 'server error',
  });
  ({ analyzeForContradictions } = await import('../src/geminiAnalyzer.js'));
  const result = await analyzeForContradictions('text');
  expect(result.success).toBe(false);
  expect(result.error).toMatch(/Gemini request failed/);
});

test('returns error on invalid response', async () => {
  process.env.GEMINI_API_KEY = 'key';
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({}),
  });
  ({ analyzeForContradictions } = await import('../src/geminiAnalyzer.js'));
  const result = await analyzeForContradictions('text');
  expect(result.success).toBe(false);
  expect(result.error).toMatch(/Empty or invalid/);
});

test('returns contradictions array on success', async () => {
  process.env.GEMINI_API_KEY = 'key';
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      candidates: [
        { content: { parts: [{ text: '{"contradictions":["x"]}' }] } },
      ],
    }),
  });
  ({ analyzeForContradictions } = await import('../src/geminiAnalyzer.js'));
  const result = await analyzeForContradictions('text');
  expect(result.success).toBe(true);
  expect(result.contradictions).toEqual(['x']);
});
