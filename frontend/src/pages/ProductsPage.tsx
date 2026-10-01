import { useCallback, useEffect, useState } from "react";
import { api } from "../api/Client";
import Alert from "../components/Alert";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import ProductFormModal from "../components/ProductFormModal";
import { Product } from "../types/Models";
import { formatRupiah } from "../utils/Format";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      setProducts(await api.getProducts());
      setError("");
    } catch (caught) {
      setError((caught as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function confirmDelete() {
    if (!deleting) {
      return;
    }
    setBusy(true);
    try {
      await api.deleteProduct(deleting.Id);
      setDeleting(null);
      await load();
    } catch (caught) {
      setError((caught as Error).message);
      setDeleting(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Manajemen Produk</h1>
        <button
          type="button"
          className="btn-primary"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          + Tambah Produk
        </button>
      </div>
      <Alert Message={error} />
      <div className="card p-0">
        {loading ? (
          <EmptyState Message="Memuat data..." />
        ) : products.length === 0 ? (
          <EmptyState Message="Belum ada produk. Klik “Tambah Produk” untuk memulai." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="th">Nama</th>
                  <th className="th text-right">Harga</th>
                  <th className="th text-right">Stok</th>
                  <th className="th text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                  <tr key={product.Id}>
                    <td className="td font-medium">{product.Name}</td>
                    <td className="td whitespace-nowrap text-right">{formatRupiah(product.Price)}</td>
                    <td className={`td text-right font-semibold ${product.Stock === 0 ? "text-red-600" : ""}`}>{product.Stock}</td>
                    <td className="td whitespace-nowrap text-right">
                      <button
                        type="button"
                        className="mr-3 text-sm font-medium text-indigo-600 hover:underline"
                        onClick={() => {
                          setEditing(product);
                          setFormOpen(true);
                        }}
                      >
                        Ubah
                      </button>
                      <button type="button" className="text-sm font-medium text-red-600 hover:underline" onClick={() => setDeleting(product)}>
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {formOpen && (
        <ProductFormModal
          Product={editing}
          OnClose={() => setFormOpen(false)}
          OnSaved={() => {
            setFormOpen(false);
            load();
          }}
        />
      )}
      {deleting && (
        <ConfirmDialog
          Title="Hapus Produk"
          Message={`Hapus produk "${deleting.Name}"? Riwayat transaksi yang sudah tercatat tidak ikut terhapus.`}
          Busy={busy}
          OnConfirm={confirmDelete}
          OnCancel={() => setDeleting(null)}
        />
      )}
    </>
  );
}
