"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/store/wishlist";
import { useToast } from "@/lib/store/toast";

export default function WishlistButton({ productId, className = "" }: { productId: string; className?: string }) {
  const has    = useWishlist((s) => s.has(productId));
  const load   = useWishlist((s) => s.load);
  const toggle = useWishlist((s) => s.toggle);
  const showToast = useToast((s) => s.show);
  const router = useRouter();

  useEffect(() => { load(); }, [load]);

  const handle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await toggle(productId);
    if (res === null) {
      showToast("Хадгалахын тулд нэвтэрнэ үү", "info");
      router.push("/login?next=/shop");
      return;
    }
    showToast(res.added ? "Хадгалсан жагсаалтад нэмэгдлээ" : "Хадгалсан жагсаалтаас хасагдлаа");
  };

  return (
    <button
      onClick={handle}
      aria-label={has ? "Хадгалсан жагсаалтаас хасах" : "Хадгалах"}
      className={`bg-cream/90 backdrop-blur-xs p-2.5 rounded-full transition hover:bg-accent hover:text-cream ${has ? "text-accent" : "text-bark"} ${className}`}
    >
      <Heart size={14} fill={has ? "currentColor" : "none"} />
    </button>
  );
}
