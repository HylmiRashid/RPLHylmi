import { ReactNode, useEffect } from "react";

interface ModalProps {
  Title: string;
  OnClose: () => void;
  children: ReactNode;
}

export default function Modal({ Title, OnClose, children }: ModalProps) {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        OnClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [OnClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4" onClick={OnClose}>
      <div
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:max-w-lg sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{Title}</h2>
          <button type="button" className="text-2xl leading-none text-slate-400 hover:text-slate-600" onClick={OnClose} aria-label="Tutup">
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
