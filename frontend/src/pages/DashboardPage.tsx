import { useEffect, useState } from "react";
import { api } from "../api/Client";
import Alert from "../components/Alert";
import DateRangeFilter from "../components/DateRangeFilter";
import StatCard from "../components/StatCard";
import TransactionTable from "../components/TransactionTable";
import { DashboardSummary, Transaction } from "../types/Models";
import { currentMonthRange, formatRupiah } from "../utils/Format";

export default function DashboardPage() {
  const [range, setRange] = useState(currentMonthRange);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [recent, setRecent] = useState<Transaction[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!range.StartDate || !range.EndDate) {
      return;
    }
    setLoading(true);
    Promise.all([api.getSummary(range.StartDate, range.EndDate), api.getTransactions({ Limit: 5 })])
      .then(([summaryResult, recentResult]) => {
        setSummary(summaryResult);
        setRecent(recentResult);
        setError("");
      })
      .catch((caught: Error) => setError(caught.message))
      .finally(() => setLoading(false));
  }, [range]);

  const netProfit = summary?.NetProfit ?? 0;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <DateRangeFilter
          StartDate={range.StartDate}
          EndDate={range.EndDate}
          OnChange={(startDate, endDate) => setRange({ StartDate: startDate, EndDate: endDate })}
        />
      </div>
      <Alert Message={error} />
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard Label="Total Pemasukan" Value={formatRupiah(summary?.TotalIncome ?? 0)} Tone="green" />
        <StatCard Label="Total Pengeluaran" Value={formatRupiah(summary?.TotalExpense ?? 0)} Tone="red" />
        <StatCard Label={netProfit < 0 ? "Rugi" : "Laba"} Value={formatRupiah(netProfit)} Tone={netProfit < 0 ? "red" : "blue"} />
      </div>
      <div className="card p-0">
        <h2 className="border-b border-slate-200 px-4 py-3 font-semibold">Transaksi Terbaru</h2>
        {loading ? <div className="px-4 py-10 text-center text-sm text-slate-500">Memuat data...</div> : <TransactionTable Items={recent} />}
      </div>
    </>
  );
}
