import { ingestText } from '../src/ingestor.js';

test('rejects unknown source type', async () => {
  await expect(ingestText('u', 'unknown', 'text')).rejects.toThrow('Unknown source type');
});
