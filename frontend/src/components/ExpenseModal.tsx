import { FormEvent, useState } from "react";
import { api } from "../api/Client";
import { toDateInput } from "../utils/Format";
import Alert from "./Alert";
import Modal from "./Modal";

interface ExpenseModalProps {
  OnClose: () => void;
  OnSaved: () => void;
}

export default function ExpenseModal({ OnClose, OnSaved }: ExpenseModalProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(toDateInput(new Date()));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!amount || Number(amount) <= 0) {
      setError("Nominal harus lebih dari 0.");
      return;
    }
    if (!description.trim()) {
      setError("Keterangan wajib diisi.");
      return;
    }
    if (!date) {
      setError("Tanggal wajib diisi.");
      return;
    }
    setSaving(true);
    try {
      await api.createExpense({ TotalAmount: Number(amount), Description: description.trim(), TransactionDate: date });
      OnSaved();
    } catch (caught) {
      setError((caught as Error).message);
      setSaving(false);
    }
  }

  return (
    <Modal Title="Catat Pengeluaran" OnClose={OnClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Alert Message={error} />
        <div>
          <label className="label">Nominal (Rp)</label>
          <input type="number" min="1" className="input" value={amount} onChange={(event) => setAmount(event.target.value)} />
        </div>
        <div>
          <label className="label">Keterangan</label>
          <input
            className="input"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Contoh: Belanja stok barang"
          />
        </div>
        <div>
          <label className="label">Tanggal</label>
          <input type="date" className="input" value={date} onChange={(event) => setDate(event.target.value)} />
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-light" onClick={OnClose} disabled={saving}>
            Batal
          </button>
          <button type="submit" className="btn-danger" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan Pengeluaran"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
