import { setVerbose, toggleSilent } from '../src/debugger.js';

test('toggleSilent toggles verbosity', () => {
  setVerbose(false);
  const result = toggleSilent();
  expect(result).toBe(true);
});
