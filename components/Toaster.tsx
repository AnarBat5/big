"use client";
import { useToast } from "@/lib/store/toast";
import { Check, X, Info, AlertCircle } from "lucide-react";

export default function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 shadow-lg pointer-events-auto animate-slide-in min-w-[280px] ${
            t.type === "success" ? "bg-bark text-cream" :
            t.type === "error" ? "bg-red-700 text-cream" :
            "bg-walnut text-cream"
          }`}
        >
          {t.type === "success" && <Check size={18} className="text-accent flex-shrink-0" />}
          {t.type === "error" && <AlertCircle size={18} className="flex-shrink-0" />}
          {t.type === "info" && <Info size={18} className="flex-shrink-0" />}
          <p className="text-sm flex-1">{t.message}</p>
          <button onClick={() => dismiss(t.id)} className="opacity-70 hover:opacity-100">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
