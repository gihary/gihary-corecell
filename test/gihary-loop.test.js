import fs from 'fs';
import { jest } from '@jest/globals';

let processIncoming;
let getAgentQueue;
let clearAgentQueue;

beforeEach(async () => {
  jest.resetModules();
  jest.unstable_mockModule('../src/core.js', () => ({
    saveToCore: jest.fn().mockResolvedValue(undefined),
  }));
  jest.unstable_mockModule('../src/meta.js', () => ({
    suggestAgentIfNeeded: () => 'test-agent',
  }));
  ({ getAgentQueue, clearAgentQueue } = await import('../src/agentQueue.js'));
  ({ processIncoming } = await import('../src/gihary-loop.js'));
});

afterEach(() => {
  if (fs.existsSync('gihary.log')) fs.unlinkSync('gihary.log');
  clearAgentQueue();
  jest.resetModules();
});

test('processIncoming returns breakdown, enqueues agents and logs details', async () => {
  // sanity check
  const { logEvent } = await import('../src/logger.js');
  logEvent('pretest', {});
  const result = await processIncoming({
    userId: 'u',
    source: 'test',
    parsed: 'Andr\u00f2 a Roma con Luca',
    analysis: { summary: 'Take action' },
  });
  expect(result).toHaveProperty('scoreBreakdown');
  expect(result.suggestedAgents).toEqual(['test-agent']);
  expect(getAgentQueue().length).toBe(1);

  if (fs.existsSync('gihary.log')) {
    const lines = fs.readFileSync('gihary.log', 'utf-8').trim().split('\n');
    const saveEntry = lines.map(JSON.parse).find(e => e.type === 'loop.save');
    expect(saveEntry).toBeDefined();
    expect(saveEntry.data.scoreBreakdown).toBeDefined();
    expect(saveEntry.data.agents).toContain('test-agent');
  } else {
    throw new Error('log file missing');
  }
});

