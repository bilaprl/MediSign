// src/components/features/ToastContainer.js
"use client";
import { useToast } from "@/hooks/useToast";
import { CheckCircle, XCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  // Mengelompokkan toast berdasarkan pesannya
  const groupedToasts = Array.from(
    toasts
      .reduce((map, toast) => {
        const existing = map.get(toast.message);
        if (existing) {
          // Jika pesan sudah ada, catat ID terbarunya dan simpan semua ID untuk dihapus nanti
          existing.latestId = toast.id;
          existing.allIds.push(toast.id);
        } else {
          // Jika pesan baru, buat grup baru
          map.set(toast.message, {
            ...toast,
            latestId: toast.id,
            allIds: [toast.id],
          });
        }
        return map;
      }, new Map())
      .values(),
  );

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {groupedToasts.map((toastGroup) => (
        <Toast
          // Menggunakan message sebagai key mencegah React me-mount ulang komponen,
          // sehingga posisinya tetap statis dan tidak ada animasi kedap-kedip
          key={toastGroup.message}
          toast={toastGroup}
          removeToast={removeToast}
        />
      ))}
    </div>
  );
}

function Toast({ toast, removeToast }) {
  const [isLeaving, setIsLeaving] = useState(false);

  // Efek untuk mengatur Timer utama (3 detik)
  useEffect(() => {
    // Memastikan status animasi "keluar" dibatalkan jika user menekan tombol berulang kali
    setIsLeaving(false);

    const timer = setTimeout(() => {
      setIsLeaving(true);
    }, 3000);

    // Jika toast.latestId berubah (tombol diklik lagi), timer lama dibersihkan dan mengulang dari 0
    return () => clearTimeout(timer);
  }, [toast.latestId]);

  // Efek untuk menghapus semua data dari global state setelah animasi keluar (300ms) selesai
  useEffect(() => {
    if (isLeaving) {
      const exitTimer = setTimeout(() => {
        toast.allIds.forEach((id) => removeToast(id));
      }, 300);
      return () => clearTimeout(exitTimer);
    }
  }, [isLeaving, toast.allIds, removeToast]);

  const styles = {
    success:
      "bg-emerald-500 shadow-emerald-500/40 border-emerald-400 text-white",
    error: "bg-rose-500 shadow-rose-500/40 border-rose-400 text-white",
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-white" />,
    error: <XCircle className="w-5 h-5 text-white" />,
  };

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between p-4 min-w-[300px] max-w-md rounded-xl shadow-lg border transition-all duration-300 ${styles[toast.type]} ${isLeaving ? "opacity-0 translate-x-8 scale-95" : "opacity-100 translate-x-0 scale-100"}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">{icons[toast.type]}</div>
        <p className="text-sm font-semibold tracking-wide">{toast.message}</p>
      </div>
      <button
        onClick={() => setIsLeaving(true)}
        className="text-white/70 hover:text-white transition-colors ml-4 focus:outline-none"
        aria-label="Tutup"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
