import { useCallback, useEffect, useState } from "react";
import { api } from "../api/Client";
import Alert from "../components/Alert";
import ConfirmDialog from "../components/ConfirmDialog";
import DateRangeFilter from "../components/DateRangeFilter";
import ExpenseModal from "../components/ExpenseModal";
import IncomeModal from "../components/IncomeModal";
import TransactionTable from "../components/TransactionTable";
import { Product, Transaction, TransactionType } from "../types/Models";
import { currentMonthRange, formatDate } from "../utils/Format";

export default function TransactionsPage() {
  const [range, setRange] = useState(currentMonthRange);
  const [items, setItems] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<"income" | "expense" | null>(null);
  const [deleting, setDeleting] = useState<Transaction | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      setItems(await api.getTransactions({ StartDate: range.StartDate, EndDate: range.EndDate }));
      setError("");
    } catch (caught) {
      setError((caught as Error).message);
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    load();
  }, [load]);

  async function openIncome() {
    try {
      setProducts(await api.getProducts());
      setModal("income");
    } catch (caught) {
      setError((caught as Error).message);
    }
  }

  async function confirmDelete() {
    if (!deleting) {
      return;
    }
    setBusy(true);
    try {
      await api.deleteTransaction(deleting.Id);
      setDeleting(null);
      await load();
    } catch (caught) {
      setError((caught as Error).message);
      setDeleting(null);
    } finally {
      setBusy(false);
    }
  }

  const deleteMessage = deleting
    ? `Hapus transaksi tanggal ${formatDate(deleting.TransactionDate)}?` +
      (deleting.Type === TransactionType.Income ? " Stok produk akan dikembalikan otomatis." : "")
    : "";

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Manajemen Transaksi</h1>
        <div className="flex gap-2">
          <button type="button" className="btn-success" onClick={openIncome}>
            Catat Pemasukan
          </button>
          <button type="button" className="btn-danger" onClick={() => setModal("expense")}>
            Catat Pengeluaran
          </button>
        </div>
      </div>
      <DateRangeFilter
        StartDate={range.StartDate}
        EndDate={range.EndDate}
        OnChange={(startDate, endDate) => setRange({ StartDate: startDate, EndDate: endDate })}
      />
      <Alert Message={error} />
      <div className="card p-0">
        <h2 className="border-b border-slate-200 px-4 py-3 font-semibold">Riwayat Transaksi</h2>
        {loading ? (
          <div className="px-4 py-10 text-center text-sm text-slate-500">Memuat data...</div>
        ) : (
          <TransactionTable Items={items} OnDelete={setDeleting} />
        )}
      </div>
      {modal === "income" && (
        <IncomeModal
          Products={products}
          OnClose={() => setModal(null)}
          OnSaved={() => {
            setModal(null);
            load();
          }}
        />
      )}
      {modal === "expense" && (
        <ExpenseModal
          OnClose={() => setModal(null)}
          OnSaved={() => {
            setModal(null);
            load();
          }}
        />
      )}
      {deleting && (
        <ConfirmDialog
          Title="Hapus Transaksi"
          Message={deleteMessage}
          Busy={busy}
          OnConfirm={confirmDelete}
          OnCancel={() => setDeleting(null)}
        />
      )}
    </>
  );
}
