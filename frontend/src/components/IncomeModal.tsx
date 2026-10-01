import { FormEvent, useState } from "react";
import { api } from "../api/Client";
import { Product } from "../types/Models";
import { formatRupiah, toDateInput } from "../utils/Format";
import Alert from "./Alert";
import Modal from "./Modal";

interface IncomeModalProps {
  Products: Product[];
  OnClose: () => void;
  OnSaved: () => void;
}

interface IncomeRow {
  Key: number;
  ProductId: string;
  Quantity: string;
}

export default function IncomeModal({ Products, OnClose, OnSaved }: IncomeModalProps) {
  const [rows, setRows] = useState<IncomeRow[]>([{ Key: 1, ProductId: "", Quantity: "1" }]);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(toDateInput(new Date()));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const total = rows.reduce((sum, row) => {
    const product = Products.find((item) => item.Id === row.ProductId);
    return sum + (product ? product.Price * (Number(row.Quantity) || 0) : 0);
  }, 0);

  function updateRow(key: number, changes: Partial<IncomeRow>) {
    setRows((current) => current.map((row) => (row.Key === key ? { ...row, ...changes } : row)));
  }

  function addRow() {
    setRows((current) => [...current, { Key: Math.max(...current.map((row) => row.Key)) + 1, ProductId: "", Quantity: "1" }]);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (rows.some((row) => !row.ProductId)) {
      setError("Pilih produk pada setiap baris.");
      return;
    }
    if (rows.some((row) => !Number.isInteger(Number(row.Quantity)) || Number(row.Quantity) < 1)) {
      setError("Jumlah harus berupa bilangan bulat minimal 1.");
      return;
    }
    if (!date) {
      setError("Tanggal wajib diisi.");
      return;
    }
    setSaving(true);
    try {
      await api.createIncome({
        TransactionDate: date,
        Description: description.trim(),
        Items: rows.map((row) => ({ ProductId: row.ProductId, Quantity: Number(row.Quantity) })),
      });
      OnSaved();
    } catch (caught) {
      setError((caught as Error).message);
      setSaving(false);
    }
  }

  return (
    <Modal Title="Catat Pemasukan" OnClose={OnClose}>
      {Products.length === 0 ? (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Belum ada produk. Tambahkan produk terlebih dahulu di halaman Produk.</p>
          <div className="flex justify-end">
            <button type="button" className="btn-light" onClick={OnClose}>
              Tutup
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Alert Message={error} />
          <div className="space-y-2">
            <label className="label">Produk Terjual</label>
            {rows.map((row) => (
              <div key={row.Key} className="flex gap-2">
                <select className="input" value={row.ProductId} onChange={(event) => updateRow(row.Key, { ProductId: event.target.value })}>
                  <option value="">Pilih produk</option>
                  {Products.map((product) => (
                    <option key={product.Id} value={product.Id}>
                      {product.Name} (stok {product.Stock}) - {formatRupiah(product.Price)}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  className="input w-20"
                  value={row.Quantity}
                  onChange={(event) => updateRow(row.Key, { Quantity: event.target.value })}
                  aria-label="Jumlah"
                />
                {rows.length > 1 && (
                  <button
                    type="button"
                    className="px-2 text-xl text-slate-400 hover:text-red-600"
                    onClick={() => setRows((current) => current.filter((item) => item.Key !== row.Key))}
                    aria-label="Hapus baris"
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="text-sm font-medium text-indigo-600 hover:underline" onClick={addRow}>
              + Tambah produk lain
            </button>
          </div>
          <div>
            <label className="label">Keterangan (opsional)</label>
            <input className="input" value={description} onChange={(event) => setDescription(event.target.value)} />
          </div>
          <div>
            <label className="label">Tanggal</label>
            <input type="date" className="input" value={date} onChange={(event) => setDate(event.target.value)} />
          </div>
          <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2">
            <span className="text-sm text-emerald-800">Total</span>
            <span className="font-bold text-emerald-700">{formatRupiah(total)}</span>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-light" onClick={OnClose} disabled={saving}>
              Batal
            </button>
            <button type="submit" className="btn-success" disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan Pemasukan"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
