import { ReactNode } from "react";

interface AuthLayoutProps {
  Title: string;
  Subtitle: string;
  children: ReactNode;
}

export default function AuthLayout({ Title, Subtitle, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <p className="text-3xl font-bold text-indigo-600">DagangTrack</p>
          <p className="mt-1 text-sm text-slate-500">Pantau keuangan dan stok usaha Anda</p>
        </div>
        <div className="card p-6">
          <h1 className="text-xl font-semibold">{Title}</h1>
          <p className="mb-4 text-sm text-slate-500">{Subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
