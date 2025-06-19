import fs from 'fs';
import { parseTextFile } from '../src/parser/fileParser.js';

test('parseTextFile reads file contents', async () => {
  const tmp = 'tmp_test.txt';
  fs.writeFileSync(tmp, 'hello');
  const content = await parseTextFile(tmp);
  expect(content).toBe('hello');
  fs.unlinkSync(tmp);
});
