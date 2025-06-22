const queue = [];

export function enqueueAgent(name) {
  queue.push({ name, timestamp: new Date().toISOString() });
}

export function getAgentQueue() {
  return queue;
}

export function clearAgentQueue() {
  queue.length = 0;
}

