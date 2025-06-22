import { enqueueAgent, getAgentQueue, clearAgentQueue } from '../src/agentQueue.js';

afterEach(() => {
  clearAgentQueue();
});

test('enqueueAgent adds agent to queue', () => {
  enqueueAgent('test-agent');
  const q = getAgentQueue();
  expect(q.length).toBe(1);
  expect(q[0].name).toBe('test-agent');
});

