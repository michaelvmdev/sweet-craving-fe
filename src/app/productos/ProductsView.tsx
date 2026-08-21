"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import db from "@/data/db.json";

const WA_BASE = "https://wa.me/51967636632";

const CATEGORY_COLORS: Record<string, string> = {
  tortas: "from-rose-100 to-pink-50",
  queques: "from-pink-100 to-rose-50",
  pies: "from-orange-100 to-amber-50",
  "postres-frios": "from-yellow-50 to-amber-50",
  "desayunos-sorpresa": "from-purple-100 to-pink-50",
  "lunch-pack": "from-teal-50 to-emerald-50",
};

const CATEGORY_ICONS: Record<string, string> = {
  tortas: "🎂",
  queques: "🧁",
  pies: "🥧",
  "postres-frios": "🍮",
  "desayunos-sorpresa": "🎁",
  "lunch-pack": "📦",
};

export default function ProductsView() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("categoria") ?? "all";
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  const filtered =
    activeCategory === "all"
      ? db.products
      : db.products.filter((p) => p.category === activeCategory);

  return (
    <section className="py-10 lg:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === "all"
                ? "bg-[#8B1A4A] text-white shadow-sm"
                : "bg-rose-50 text-[#8B1A4A] hover:bg-[#8B1A4A] hover:text-white"
            }`}
          >
            Todos
          </button>
          {db.categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? "bg-[#8B1A4A] text-white shadow-sm"
                  : "bg-rose-50 text-[#8B1A4A] hover:bg-[#8B1A4A] hover:text-white"
              }`}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => {
            const gradient = CATEGORY_COLORS[product.category] ?? "from-gray-100 to-gray-50";
            const icon = CATEGORY_ICONS[product.category] ?? "🍰";
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col"
              >
                {/* Image area */}
                <div className={`h-44 bg-gradient-to-br ${gradient} flex items-center justify-center relative`}>
                  <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                    {icon}
                  </span>
                  {product.featured && (
                    <span className="absolute top-3 left-3 bg-[#8B1A4A] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                      Popular
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex-1">
                    <p className="text-[#8B1A4A] text-[10px] font-semibold uppercase tracking-wider mb-1">
                      {db.categories.find((c) => c.id === product.category)?.name ?? product.category}
                    </p>
                    <h3 className="font-serif text-base font-semibold text-[#2d1b1b] mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    {product.sizes.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {product.sizes.map((size) => (
                          <span
                            key={size}
                            className="text-[10px] bg-rose-50 text-[#8B1A4A] px-2 py-0.5 rounded-full"
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="font-bold text-[#8B1A4A]">
                      Desde S/ {product.price}
                    </span>
                    <a
                      href={`${WA_BASE}?text=${encodeURIComponent(`Hola! Quisiera pedir: ${product.name}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs bg-[#25D366] text-white px-3.5 py-2 rounded-full hover:bg-[#1da851] transition-colors font-semibold"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Pedir
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500">No hay productos en esta categoría aún.</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-14 text-center bg-[#FDF6F0] rounded-2xl p-8">
          <p className="font-serif text-xl font-semibold text-[#2d1b1b] mb-2">
            ¿No encuentras lo que buscas?
          </p>
          <p className="text-gray-600 text-sm mb-5">
            Contáctanos y creamos el postre perfecto para tu ocasión especial.
          </p>
          <a
            href={`${WA_BASE}?text=${encodeURIComponent("Hola! Quisiera consultar sobre un postre personalizado.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#8B1A4A] text-white px-7 py-3 rounded-full font-semibold hover:bg-[#6B1235] transition-colors"
          >
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
