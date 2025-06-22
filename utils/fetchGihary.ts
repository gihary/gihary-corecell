export async function fetchGiharyIngest(input: string, type: string, userId = 'demo-user') {
  const res = await fetch('/gihary-ingest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input, type, userId }),
  });
  return res.json();
}
