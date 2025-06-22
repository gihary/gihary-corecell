import BreakdownCard from './BreakdownCard';

interface ResultProps {
  data: {
    score: number;
    agent: string;
    breakdown: Record<string, number>;
    differences?: string[];
  };
}

export default function AgentResult({ data }: ResultProps) {
  return (
    <div className="space-y-2">
      <div className="text-lg font-semibold">Score: {data.score}</div>
      <div className="text-sm text-gray-600">Agent: {data.agent}</div>
      <BreakdownCard breakdown={data.breakdown} />
      {data.differences && data.differences.length > 0 && (
        <div className="mt-2">
          <div className="font-medium">Differences</div>
          <ul className="list-disc list-inside">
            {data.differences.map((d, idx) => (
              <li key={idx}>{d}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
