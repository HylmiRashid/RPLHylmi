export default function EmptyState({ Message }: { Message: string }) {
  return <div className="px-4 py-10 text-center text-sm text-slate-500">{Message}</div>;
}
