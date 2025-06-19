import fs from 'fs';
import { logEvent } from '../src/logger.js';

const logFile = 'gihary.log';

afterEach(() => {
  if (fs.existsSync(logFile)) fs.unlinkSync(logFile);
});

test('logEvent creates log file', () => {
  logEvent('test', { ok: true });
  expect(fs.existsSync(logFile)).toBe(true);
});
