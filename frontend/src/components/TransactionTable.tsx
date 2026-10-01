import { Transaction, TransactionType } from "../types/Models";
import { formatDate, formatRupiah } from "../utils/Format";
import Badge from "./Badge";
import EmptyState from "./EmptyState";

interface TransactionTableProps {
  Items: Transaction[];
  OnDelete?: (item: Transaction) => void;
}

function describe(item: Transaction): string {
  const products = item.Items.map((entry) => `${entry.ProductName} x${entry.Quantity}`).join(", ");
  return [item.Description, products].filter(Boolean).join(" · ") || "-";
}

export default function TransactionTable({ Items, OnDelete }: TransactionTableProps) {
  if (Items.length === 0) {
    return <EmptyState Message="Belum ada transaksi." />;
  }
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="th">Tanggal</th>
            <th className="th">Jenis</th>
            <th className="th">Keterangan</th>
            <th className="th text-right">Total</th>
            {OnDelete && <th className="th text-right">Aksi</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {Items.map((item) => {
            const isIncome = item.Type === TransactionType.Income;
            return (
              <tr key={item.Id}>
                <td className="td whitespace-nowrap">{formatDate(item.TransactionDate)}</td>
                <td className="td">
                  <Badge Type={item.Type} />
                </td>
                <td className="td min-w-[200px]">{describe(item)}</td>
                <td className={`td whitespace-nowrap text-right font-semibold ${isIncome ? "text-emerald-600" : "text-red-600"}`}>
                  {isIncome ? "+" : "-"} {formatRupiah(item.TotalAmount)}
                </td>
                {OnDelete && (
                  <td className="td text-right">
                    <button type="button" className="text-sm font-medium text-red-600 hover:underline" onClick={() => OnDelete(item)}>
                      Hapus
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
