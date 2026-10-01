import { FormEvent, useState } from "react";
import { api } from "../api/Client";
import { Product } from "../types/Models";
import Alert from "./Alert";
import Modal from "./Modal";

interface ProductFormModalProps {
  Product: Product | null;
  OnClose: () => void;
  OnSaved: () => void;
}

export default function ProductFormModal({ Product, OnClose, OnSaved }: ProductFormModalProps) {
  const [name, setName] = useState(Product?.Name ?? "");
  const [price, setPrice] = useState(Product ? String(Product.Price) : "");
  const [stock, setStock] = useState(Product ? String(Product.Stock) : "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Nama produk wajib diisi.");
      return;
    }
    if (price === "" || Number(price) < 0) {
      setError("Harga harus berupa angka dan tidak boleh negatif.");
      return;
    }
    if (stock === "" || !Number.isInteger(Number(stock)) || Number(stock) < 0) {
      setError("Stok harus berupa bilangan bulat dan tidak boleh negatif.");
      return;
    }
    const body = { Name: name.trim(), Price: Number(price), Stock: Number(stock) };
    setSaving(true);
    try {
      if (Product) {
        await api.updateProduct(Product.Id, body);
      } else {
        await api.createProduct(body);
      }
      OnSaved();
    } catch (caught) {
      setError((caught as Error).message);
      setSaving(false);
    }
  }

  return (
    <Modal Title={Product ? "Ubah Produk" : "Tambah Produk"} OnClose={OnClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Alert Message={error} />
        <div>
          <label className="label">Nama Produk</label>
          <input className="input" value={name} onChange={(event) => setName(event.target.value)} placeholder="Contoh: Indomie Goreng" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Harga (Rp)</label>
            <input type="number" min="0" className="input" value={price} onChange={(event) => setPrice(event.target.value)} />
          </div>
          <div>
            <label className="label">Stok</label>
            <input type="number" min="0" className="input" value={stock} onChange={(event) => setStock(event.target.value)} />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-light" onClick={OnClose} disabled={saving}>
            Batal
          </button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
