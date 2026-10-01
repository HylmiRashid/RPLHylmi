interface StatCardProps {
  Label: string;
  Value: string;
  Tone: "green" | "red" | "blue";
}

const Tones = {
  green: "text-emerald-600",
  red: "text-red-600",
  blue: "text-indigo-600",
};

export default function StatCard({ Label, Value, Tone }: StatCardProps) {
  return (
    <div className="card">
      <p className="text-sm text-slate-500">{Label}</p>
      <p className={`mt-1 text-2xl font-bold ${Tones[Tone]}`}>{Value}</p>
    </div>
  );
}
