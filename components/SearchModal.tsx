"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { useProducts } from "@/lib/store/products";
import { formatPrice } from "@/lib/products";

export default function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const products = useProducts((s) => s.products);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const results = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.categoryName.toLowerCase().includes(query.toLowerCase()) ||
          p.material.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-[60] bg-charcoal/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-cream max-w-2xl mx-auto mt-20 mx-4 max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-sand p-4">
          <Search size={20} className="text-muted" />
          <input
            autoFocus
            type="text"
            placeholder="Бүтээгдэхүүн хайх..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent focus:outline-none text-bark"
          />
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <div className="overflow-y-auto flex-1">
          {query && results.length === 0 && (
            <p className="text-center py-12 text-muted">Илэрц олдсонгүй</p>
          )}
          {results.map((p) => (
            <Link
              key={p.id}
              href={`/product/${p.id}`}
              onClick={onClose}
              className="flex gap-4 p-4 hover:bg-sand/40 transition border-b border-sand/50"
            >
              <div className="w-16 h-16 bg-sand flex-shrink-0">
                <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted uppercase tracking-wider">{p.categoryName}</p>
                <p className="font-serif text-lg text-bark">{p.name}</p>
                <p className="text-sm text-bark mt-1">{formatPrice(p.price)}</p>
              </div>
            </Link>
          ))}
          {!query && (
            <p className="text-center py-12 text-muted text-sm">Хайхын тулд бичнэ үү</p>
          )}
        </div>
      </div>
    </div>
  );
}
