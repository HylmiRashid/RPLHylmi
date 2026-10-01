import Modal from "./Modal";

interface ConfirmDialogProps {
  Title: string;
  Message: string;
  Busy: boolean;
  OnConfirm: () => void;
  OnCancel: () => void;
}

export default function ConfirmDialog({ Title, Message, Busy, OnConfirm, OnCancel }: ConfirmDialogProps) {
  return (
    <Modal Title={Title} OnClose={OnCancel}>
      <p className="text-sm text-slate-600">{Message}</p>
      <div className="mt-6 flex justify-end gap-2">
        <button type="button" className="btn-light" onClick={OnCancel} disabled={Busy}>
          Batal
        </button>
        <button type="button" className="btn-danger" onClick={OnConfirm} disabled={Busy}>
          {Busy ? "Menghapus..." : "Ya, Hapus"}
        </button>
      </div>
    </Modal>
  );
}
