import * as core from '../src/core.js';

test('exports saveToCore function', () => {
  expect(typeof core.saveToCore).toBe('function');
});
