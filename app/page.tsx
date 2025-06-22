'use client';

import { useState } from 'react';
import { fetchGiharyIngest } from '../utils/fetchGihary';
import AgentResult from '../components/AgentResult';
import LoginButton from '../components/LoginButton';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [input, setInput] = useState('');
  const [type, setType] = useState('email');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await fetchGiharyIngest(input, type, user?.uid);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {user ? (
        <div className="p-2 bg-green-100 rounded text-sm">
          {user.displayName} - {user.uid}
        </div>
      ) : (
        <LoginButton />
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Input</label>
          <textarea
            className="w-full border rounded p-2"
            rows={5}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Type</label>
          <select
            className="w-full border rounded p-2"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="email">Email</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="file">File</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>

      {result && (
        <div className="space-y-4">
          <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
          {result.success && result.data && (
            <AgentResult data={result.data} />
          )}
        </div>
      )}
    </div>
  );
}
