import { suggestAgentIfNeeded } from '../src/meta.js';

test('suggestAgentIfNeeded detects action need', () => {
  const result = suggestAgentIfNeeded({ summary: 'We should take action now' });
  expect(result).toBe('action-agent');
});
