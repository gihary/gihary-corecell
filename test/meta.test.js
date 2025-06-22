import { suggestAgentIfNeeded } from '../src/meta.js';

test('suggests CRMAgent when relevance high and CRM keyword found', () => {
  const result = suggestAgentIfNeeded({
    summary: 'Devo fissare un appuntamento con il nuovo lead',
    scoreBreakdown: { relevance: 8 },
  });
  expect(result).toBe('CRMAgent');
});

test('suggests WebAgent when web keyword found', () => {
  const result = suggestAgentIfNeeded({
    summary: 'Visita il nostro nuovo sito per maggiori info',
    scoreBreakdown: { relevance: 3 },
  });
  expect(result).toBe('WebAgent');
});

test('returns null when no conditions met', () => {
  const result = suggestAgentIfNeeded({
    summary: 'Test generico senza parole chiave',
    scoreBreakdown: { relevance: 5 },
  });
  expect(result).toBeNull();
});
