import { suggestAgentIfNeeded } from '../src/meta.js';

test('suggestAgentIfNeeded returns null when relevance below threshold', () => {
  const result = suggestAgentIfNeeded({ summary: 'We should take action now' }, 5, ['action']);
  expect(result).toBeNull();
});

test('suggestAgentIfNeeded returns null when keywords do not match', () => {
  const result = suggestAgentIfNeeded({ summary: 'We should take action now' }, 8, ['different']);
  expect(result).toBeNull();
});

test('suggestAgentIfNeeded suggests agent when relevance and keyword match', () => {
  const result = suggestAgentIfNeeded({ summary: 'We should take action now' }, 8, ['action']);
  expect(result).toBe('action-agent');
});
