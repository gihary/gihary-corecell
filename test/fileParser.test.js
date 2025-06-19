import fs from 'fs';
import { parseTextFile } from '../src/parser/fileParser.js';

test('parseTextFile reads file contents', () => {
  const tmp = 'tmp_test.txt';
  fs.writeFileSync(tmp, 'hello');
  expect(parseTextFile(tmp)).toBe('hello');
  fs.unlinkSync(tmp);
});
