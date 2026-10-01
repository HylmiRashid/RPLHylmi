import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Links = [
  { To: "/", Label: "Dashboard" },
  { To: "/produk", Label: "Produk" },
  { To: "/transaksi", Label: "Transaksi" },
  { To: "/laporan", Label: "Laporan" },
];

export default function Layout() {
  const { User, logout } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div>
            <p className="text-lg font-bold text-indigo-600">DagangTrack</p>
            <p className="text-xs text-slate-500">{User?.StoreName}</p>
          </div>
          <button type="button" className="btn-light" onClick={logout}>
            Keluar
          </button>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 pb-2">
          {Links.map((link) => (
            <NavLink
              key={link.To}
              to={link.To}
              end={link.To === "/"}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium ${
                  isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              {link.Label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-5xl space-y-4 px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
