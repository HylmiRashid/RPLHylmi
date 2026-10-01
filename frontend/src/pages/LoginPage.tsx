import { FormEvent, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { User, login } = useAuth();
  const navigate = useNavigate();
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
    if (!email.trim() || !password) {
      setError("Email dan kata sandi wajib diisi.");
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate("/");
    } catch (caught) {
      setError((caught as Error).message);
      setLoading(false);
    }
  }

  return (
    <AuthLayout Title="Masuk" Subtitle="Silakan masuk ke akun toko Anda.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Alert Message={error} />
        <div>
          <label className="label">Email</label>
          <input type="email" className="input" value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
        <div>
          <label className="label">Kata Sandi</label>
          <input type="password" className="input" value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Memproses..." : "Masuk"}
        </button>
        <p className="text-center text-sm text-slate-500">
          Belum punya akun?{" "}
          <Link to="/daftar" className="font-medium text-indigo-600 hover:underline">
            Daftar
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
