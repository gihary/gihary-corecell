import { parseWhatsappMessage } from '../src/parser/whatsappParser.js';

test('parseWhatsappMessage returns array with sender', () => {
  const raw = '12/03/24, 15:22 - Alice: Hello';
  const result = parseWhatsappMessage(raw);
  expect(Array.isArray(result)).toBe(true);
  expect(result[0].sender).toBe('Alice');
});
