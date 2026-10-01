import { useEffect, useState } from "react";
import { api } from "../api/Client";
import Alert from "../components/Alert";
import DateRangeFilter from "../components/DateRangeFilter";
import EmptyState from "../components/EmptyState";
import { ProfitLossReport, ReportGroupBy } from "../types/Models";
import { currentMonthRange, formatPeriod, formatRupiah } from "../utils/Format";

export default function ReportPage() {
  const [range, setRange] = useState(currentMonthRange);
  const [groupBy, setGroupBy] = useState<ReportGroupBy>(ReportGroupBy.Daily);
  const [report, setReport] = useState<ProfitLossReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!range.StartDate || !range.EndDate) {
      return;
    }
    setLoading(true);
    api
      .getProfitLoss(range.StartDate, range.EndDate, groupBy)
      .then((result) => {
        setReport(result);
        setError("");
      })
      .catch((caught: Error) => setError(caught.message))
      .finally(() => setLoading(false));
  }, [range, groupBy]);

  const profitClass = (value: number) => (value < 0 ? "text-red-600" : "text-emerald-600");

  return (
    <>
      <h1 className="text-xl font-semibold">Laporan Laba-Rugi</h1>
      <div className="flex flex-wrap items-end gap-3">
        <DateRangeFilter
          StartDate={range.StartDate}
          EndDate={range.EndDate}
          OnChange={(startDate, endDate) => setRange({ StartDate: startDate, EndDate: endDate })}
        />
        <div>
          <label className="label">Kelompokkan</label>
          <select className="input" value={groupBy} onChange={(event) => setGroupBy(event.target.value as ReportGroupBy)}>
            <option value={ReportGroupBy.Daily}>Harian</option>
            <option value={ReportGroupBy.Monthly}>Bulanan</option>
          </select>
        </div>
      </div>
      <Alert Message={error} />
      <div className="card p-0">
        {loading ? (
          <EmptyState Message="Memuat data..." />
        ) : !report || report.Rows.length === 0 ? (
          <EmptyState Message="Tidak ada data pada periode ini." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="th">Periode</th>
                  <th className="th text-right">Pemasukan</th>
                  <th className="th text-right">Pengeluaran</th>
                  <th className="th text-right">Laba/Rugi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {report.Rows.map((row) => (
                  <tr key={row.Period}>
                    <td className="td whitespace-nowrap">{formatPeriod(row.Period)}</td>
                    <td className="td whitespace-nowrap text-right text-emerald-600">{formatRupiah(row.TotalIncome)}</td>
                    <td className="td whitespace-nowrap text-right text-red-600">{formatRupiah(row.TotalExpense)}</td>
                    <td className={`td whitespace-nowrap text-right font-semibold ${profitClass(row.NetProfit)}`}>
                      {formatRupiah(row.NetProfit)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 font-semibold">
                <tr>
                  <td className="td">Total</td>
                  <td className="td whitespace-nowrap text-right text-emerald-600">{formatRupiah(report.TotalIncome)}</td>
                  <td className="td whitespace-nowrap text-right text-red-600">{formatRupiah(report.TotalExpense)}</td>
                  <td className={`td whitespace-nowrap text-right ${profitClass(report.NetProfit)}`}>{formatRupiah(report.NetProfit)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
