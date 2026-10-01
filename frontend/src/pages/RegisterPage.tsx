import { FormEvent, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { User, register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (User) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!name.trim() || !storeName.trim() || !email.trim()) {
      setError("Nama, nama toko, dan email wajib diisi.");
      return;
    }
    if (password.length < 6) {
      setError("Kata sandi minimal 6 karakter.");
      return;
    }
    setLoading(true);
    try {
      await register(name.trim(), storeName.trim(), email.trim(), password);
      navigate("/");
    } catch (caught) {
      setError((caught as Error).message);
      setLoading(false);
    }
  }

  return (
    <AuthLayout Title="Daftar" Subtitle="Buat akun untuk mulai mencatat keuangan usaha Anda.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Alert Message={error} />
        <div>
          <label className="label">Nama Lengkap</label>
          <input className="input" value={name} onChange={(event) => setName(event.target.value)} />
        </div>
        <div>
          <label className="label">Nama Toko / Warung</label>
          <input className="input" value={storeName} onChange={(event) => setStoreName(event.target.value)} />
        </div>
        <div>
          <label className="label">Email</label>
          <input type="email" className="input" value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
        <div>
          <label className="label">Kata Sandi</label>
          <input type="password" className="input" value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Memproses..." : "Daftar"}
        </button>
        <p className="text-center text-sm text-slate-500">
          Sudah punya akun?{" "}
          <Link to="/masuk" className="font-medium text-indigo-600 hover:underline">
            Masuk
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
