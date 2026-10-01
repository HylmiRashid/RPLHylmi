import { TransactionType } from "../types/Models";

export default function Badge({ Type }: { Type: TransactionType }) {
  const isIncome = Type === TransactionType.Income;
  const color = isIncome ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700";
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${color}`}>
      {isIncome ? "Pemasukan" : "Pengeluaran"}
    </span>
  );
}
