import { parseEmail } from '../src/parser/emailParser.js';

test('parseEmail returns array with sender', () => {
  const raw = 'From: Bob\nDate: Wed, 1 Jan 2020 10:00:00 +0000\n\nHello';
  const result = parseEmail(raw);
  expect(Array.isArray(result)).toBe(true);
  expect(result[0].sender).toBe('Bob');
});
