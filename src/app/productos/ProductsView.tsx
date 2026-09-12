"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const WA_BASE = "https://wa.me/51967636632";

const COLOR_PALETTE = [
  "from-rose-100 to-pink-50",
  "from-pink-100 to-rose-50",
  "from-orange-100 to-amber-50",
  "from-yellow-100 to-amber-50",
  "from-yellow-50 to-orange-50",
  "from-purple-100 to-pink-50",
  "from-green-100 to-emerald-50",
  "from-amber-100 to-yellow-50",
  "from-cyan-100 to-blue-50",
  "from-violet-100 to-purple-50",
  "from-teal-100 to-green-50",
  "from-lime-100 to-green-50",
  "from-fuchsia-100 to-pink-50",
  "from-sky-100 to-cyan-50",
  "from-indigo-100 to-violet-50",
  "from-red-100 to-rose-50",
  "from-emerald-100 to-teal-50",
  "from-orange-50 to-amber-50",
];

interface Category {
  id: string;
  name: string;
  icon: string;
  sort_order: number;
}

interface Product {
  id: string;
  name: string;
  summary: string;
  price: number | null;
  promotional_price: number | null;
  category_slug: string;
  category_name: string;
  category_icon: string;
  category_order: number;
  featured: boolean;
  slug: string;
  images: string[];
  sizes: string[];
}

// ── Carrusel por tarjeta ──────────────────────────────────────────────────────
function ProductCard({ product }: { product: Product }) {
  const imgs =
    product.images.length > 0
      ? product.images
      : ["/product_image_not_found.webp"];
  const [idx, setIdx] = useState(0);

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIdx((i) => (i - 1 + imgs.length) % imgs.length);
  };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIdx((i) => (i + 1) % imgs.length);
  };

  const gradient =
    COLOR_PALETTE[(product.category_order - 1) % COLOR_PALETTE.length] ??
    "from-rose-50 to-pink-50";

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col">
      {/* ── Carrusel ── */}
      <Link href={`/productos/${product.slug}`} className="block">
      <div className={`relative h-48 overflow-hidden bg-gradient-to-br ${gradient}`}>
        <Image
          src={imgs[idx]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-opacity duration-300"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "/product_image_not_found.webp";
          }}
        />

        {imgs.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Imagen anterior"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/30 hover:bg-black/55 text-white rounded-full flex items-center justify-center transition-colors z-10 text-lg leading-none"
            >
              ‹
            </button>
            <button
              onClick={next}
              aria-label="Imagen siguiente"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/30 hover:bg-black/55 text-white rounded-full flex items-center justify-center transition-colors z-10 text-lg leading-none"
            >
              ›
            </button>
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
              {imgs.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIdx(i);
                  }}
                  aria-label={`Foto ${i + 1}`}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i === idx ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {product.featured && (
          <span className="absolute top-3 left-3 bg-[#8B1A4A] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide z-10">
            Popular
          </span>
        )}
        {product.promotional_price != null && (
          <span className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide z-10">
            Oferta
          </span>
        )}
        <span className="absolute bottom-2 left-2 text-[9px] text-white/90 bg-black/40 px-2 py-0.5 rounded z-10">
          Imagen referencial
        </span>
      </div>
      </Link>

      {/* ── Contenido ── */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex-1">
          <p className="text-[#8B1A4A] text-[10px] font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
            <span>{product.category_icon}</span>
            {product.category_name}
          </p>
          <Link href={`/productos/${product.slug}`}>
            <h3 className="font-serif text-base font-semibold text-[#2d1b1b] mb-2 hover:text-[#8B1A4A] transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2">
            {product.summary}
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
          <div className="flex flex-col">
            {product.promotional_price != null ? (
              <>
                <span className="text-xs text-gray-400 line-through leading-tight">
                  S/ {product.price}
                </span>
                <span className="font-bold text-[#8B1A4A] text-base leading-tight">
                  Desde S/ {product.promotional_price}
                </span>
              </>
            ) : (
              <span className="font-bold text-[#8B1A4A]">
                {product.price != null ? `Desde S/ ${product.price}` : "Consultar"}
              </span>
            )}
          </div>
          <a
            href={`${WA_BASE}?text=${encodeURIComponent(
              `Hola! Quisiera pedir: ${product.name}`
            )}`}
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
}

// ── Skeleton de carga ────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="h-48 bg-rose-50" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-gray-100 rounded w-1/3" />
        <div className="h-4 bg-gray-100 rounded w-2/3" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-4/5" />
      </div>
    </div>
  );
}

// ── Componente principal ─────────────────────────────────────────────────────
export default function ProductsView() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("categoria") ?? "all";

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/products").then((r) => r.json()),
    ]).then(([cats, prods]: [Category[], Product[]]) => {
      setCategories(cats);
      setProducts(prods);
      setLoading(false);
    });
  }, []);

  const filtered =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category_slug === activeCategory);

  return (
    <section className="py-10 lg:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Tabs de categoría ── */}
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
          {categories.map((cat) => (
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

        {/* ── Grid de productos ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500">No hay productos en esta categoría aún.</p>
          </div>
        )}

        {/* ── CTA ── */}
        <div className="mt-14 text-center bg-[#FDF6F0] rounded-2xl p-8">
          <p className="font-serif text-xl font-semibold text-[#2d1b1b] mb-2">
            ¿No encuentras lo que buscas?
          </p>
          <p className="text-gray-600 text-sm mb-5">
            Contáctanos y creamos el postre perfecto para tu ocasión especial.
          </p>
          <a
            href={`${WA_BASE}?text=${encodeURIComponent(
              "Hola! Quisiera consultar sobre un postre personalizado."
            )}`}
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
