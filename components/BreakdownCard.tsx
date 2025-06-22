interface BreakdownCardProps {
  breakdown: Record<string, number>;
}

export default function BreakdownCard({ breakdown }: BreakdownCardProps) {
  return (
    <div className="bg-white border rounded p-2">
      {Object.entries(breakdown).map(([key, value]) => (
        <div key={key} className="flex justify-between">
          <span className="font-medium capitalize">{key}</span>
          <span>{value}</span>
        </div>
      ))}
    </div>
  );
}
