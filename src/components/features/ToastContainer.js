// src/components/features/ToastContainer.js
"use client";
import { useToast } from "@/hooks/useToast";
import { CheckCircle, XCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  const groupedToasts = Array.from(
    toasts
      .reduce((map, toast) => {
        const existing = map.get(toast.message);
        if (existing) {
          existing.latestId = toast.id;
          existing.allIds.push(toast.id);
        } else {
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
    <div className="fixed bottom-4 left-4 right-4 sm:bottom-6 sm:left-auto sm:right-6 z-50 flex flex-col gap-3 pointer-events-none items-center sm:items-end">
      {groupedToasts.map((toastGroup) => (
        <Toast
          key={toastGroup.message}
          toast={toastGroup}
          removeToast={removeToast}
        />
      ))}
    </div>
  );
}

// Toast Component
function Toast({ toast, removeToast }) {
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    setIsLeaving(false);

    const timer = setTimeout(() => {
      setIsLeaving(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast.latestId]);

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
    success: <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />,
    error: <XCircle className="w-5 h-5 text-white flex-shrink-0" />,
  };

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between p-3 sm:p-4 w-full sm:min-w-[300px] sm:w-auto max-w-md rounded-xl shadow-lg border transition-all duration-300 ${styles[toast.type]} ${isLeaving ? "opacity-0 translate-y-4 sm:translate-y-0 sm:translate-x-8 scale-95" : "opacity-100 translate-y-0 translate-x-0 scale-100"}`}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex-shrink-0">{icons[toast.type]}</div>
        <p className="text-sm sm:text-sm font-semibold tracking-wide leading-tight sm:leading-normal">
          {toast.message}
        </p>
      </div>
      <button
        onClick={() => setIsLeaving(true)}
        className="text-white/70 hover:text-white transition-colors ml-3 sm:ml-4 focus:outline-none flex-shrink-0"
        aria-label="Tutup"
      >
        <X className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
}
