import type { Metadata } from "next";
import { Suspense } from "react";
import ProductsView from "./ProductsView";

export const metadata: Metadata = {
  title: "Productos",
  description:
    "Explora nuestra selección de postres artesanales: tortas, queques, pies de limón y manzana, crema volteada, desayunos sorpresa y lunch packs.",
};

export default function ProductosPage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="bg-gradient-to-br from-[#FDF6F0] to-rose-50 py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 bg-rose-100 text-[#8B1A4A] text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
            🍰 Nuestro Menú
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2d1b1b] mb-4">
            Nuestros Productos
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Cada postre es elaborado con ingredientes frescos y técnicas
            artesanales. Elige tu favorito y pídelo por WhatsApp.
          </p>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="text-4xl animate-bounce mb-4">🎂</div>
              <p className="text-gray-500">Cargando productos...</p>
            </div>
          </div>
        }
      >
        <ProductsView />
      </Suspense>
    </>
  );
}
