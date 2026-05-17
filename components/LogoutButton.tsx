"use client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const handle = async () => {
    const sb = createClient();
    await sb.auth.signOut();
    router.refresh();
    router.push("/");
  };
  return (
    <button
      onClick={handle}
      className="flex items-center gap-3 px-4 py-2.5 text-xs tracking-widest uppercase text-bark/70 hover:text-accent transition whitespace-nowrap"
    >
      <LogOut size={14} /> Гарах
    </button>
  );
}
