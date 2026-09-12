export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import pool from "@/lib/db";

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

const ABOUT_VALUES = [
  { icon: "🌿", title: "Ingredientes Frescos",  description: "Seleccionamos los mejores ingredientes naturales para cada creación" },
  { icon: "👐", title: "Hecho a Mano",          description: "Cada postre es elaborado artesanalmente con dedicación y cuidado" },
  { icon: "❤️",  title: "Con Amor",              description: "Ponemos amor en cada receta para que sientas la diferencia" },
  { icon: "✨",  title: "Personalizado",          description: "Diseñamos postres únicos para tus momentos más especiales" },
];

export default async function HomePage() {
  const [featuredRes, categoriesRes] = await Promise.all([
    pool.query(`
      SELECT
        p.product_id          AS id,
        p.product_name        AS name,
        p.product_summary     AS summary,
        p.product_unit_price        AS price,
        p.product_promotional_price AS promotional_price,
        c.category_slug,
        c.category_name,
        c.category_icon,
        c.sort_order          AS category_order,
        (
          SELECT url_image FROM product_images
          WHERE product_id = p.product_id
          ORDER BY sort_order LIMIT 1
        )                     AS cover_image
      FROM products p
      JOIN categories c ON c.category_id = p.category_id
      WHERE p.product_active = TRUE AND p.featured = TRUE
      ORDER BY p.sort_order
      LIMIT 4
    `),
    pool.query(`
      SELECT category_slug AS id, category_name AS name, category_icon AS icon
      FROM categories
      WHERE category_active = TRUE
      ORDER BY sort_order
    `),
  ]);

  const featuredProducts = featuredRes.rows;
  const categories       = categoriesRes.rows;

  return (
    <>
      {/* ── HERO ── */}
      <section className="bg-gradient-to-br from-[#FDF6F0] via-white to-rose-50 py-16 lg:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
              <span className="inline-flex items-center gap-2 bg-rose-100 text-[#8B1A4A] text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-widest mb-5">
                ♥ Postres Artesanales
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2d1b1b] leading-tight mb-5">
                Endulza cada
                <br />
                <span className="text-[#8B1A4A]">Momento Especial</span>
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
                Postres artesanales elaborados con ingredientes frescos y mucho
                amor. Tortas, queques, pies y más para hacer tus momentos únicos
                e inolvidables.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/productos"
                  className="px-8 py-3.5 bg-[#8B1A4A] text-white font-semibold rounded-full hover:bg-[#6B1235] transition-colors text-center shadow-sm"
                >
                  Ver Productos
                </Link>
                <a
                  href={WA_BASE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3.5 border-2 border-[#8B1A4A] text-[#8B1A4A] font-semibold rounded-full hover:bg-[#8B1A4A] hover:text-white transition-colors text-center"
                >
                  Hacer un Pedido
                </a>
              </div>
            </div>

            <div className="shrink-0 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="El Dulce Antojo - Postres Artesanales"
                width={420}
                height={420}
                className="w-64 h-64 sm:w-72 sm:h-72 lg:w-96 lg:h-96 drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-[#8B1A4A] py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-4 text-center text-white">
            {[
              { value: "100%",    label: "Artesanal" },
              { value: `${categories.length}+`, label: "Categorías" },
              { value: "★ 5.0",  label: "Calidad" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-serif text-2xl sm:text-3xl font-bold">{stat.value}</p>
                <p className="text-white/70 text-xs sm:text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#8B1A4A] font-semibold text-xs tracking-widest uppercase mb-2">
              Lo más pedido
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2d1b1b]">
              Especialidades de la Casa
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => {
              const gradient =
                COLOR_PALETTE[(product.category_order - 1) % COLOR_PALETTE.length] ??
                "from-rose-50 to-pink-50";
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100"
                >
                  <div className={`relative h-44 bg-gradient-to-br ${gradient}`}>
                    <Image
                      src={product.cover_image ?? "/product_image_not_found.webp"}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-base font-semibold text-[#2d1b1b] mb-1">
                      {product.name}
                    </h3>
                    <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">
                      {product.summary}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        {product.promotional_price != null ? (
                          <>
                            <span className="text-xs text-gray-400 line-through leading-tight">
                              S/ {product.price}
                            </span>
                            <span className="font-bold text-[#8B1A4A] text-sm leading-tight">
                              Desde S/ {product.promotional_price}
                            </span>
                          </>
                        ) : (
                          <span className="font-bold text-[#8B1A4A] text-sm">
                            {product.price != null
                              ? `Desde S/ ${product.price}`
                              : "Consultar"}
                          </span>
                        )}
                      </div>
                      <a
                        href={`${WA_BASE}?text=${encodeURIComponent(
                          `Hola! Me interesa el ${product.name}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-[#25D366] text-white px-3 py-1.5 rounded-full hover:bg-[#1da851] transition-colors font-medium"
                      >
                        Pedir
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/productos"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#8B1A4A] text-white font-semibold rounded-full hover:bg-[#6B1235] transition-colors shadow-sm"
            >
              Ver todos los productos
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="py-16 lg:py-20 bg-[#FDF6F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#8B1A4A] font-semibold text-xs tracking-widest uppercase mb-2">
              Nuestra Promesa
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2d1b1b]">
              ¿Por qué elegir El Dulce Antojo?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ABOUT_VALUES.map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-2xl p-7 text-center shadow-sm hover:shadow-md transition-shadow border border-rose-50"
              >
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-serif text-base font-semibold text-[#2d1b1b] mb-2">
                  {v.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#8B1A4A] font-semibold text-xs tracking-widest uppercase mb-2">
              Explora
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2d1b1b]">
              Nuestros Productos
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/productos?categoria=${cat.id}`}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-rose-50 text-[#8B1A4A] hover:bg-[#8B1A4A] hover:text-white transition-all duration-300 group"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                  {cat.icon}
                </span>
                <span className="text-xs font-semibold text-center leading-tight">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-16 lg:py-20 bg-gradient-to-r from-[#8B1A4A] to-[#5c1030]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
            ¿Tienes un evento especial?
          </h2>
          <p className="text-white/80 text-lg mb-8 leading-relaxed">
            Personalizamos el postre perfecto para tu ocasión. Escríbenos y te
            ayudamos a elegir.
          </p>
          <a
            href={`${WA_BASE}?text=${encodeURIComponent(
              "Hola! Quiero hacer un pedido especial."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-[#1da851] transition-colors shadow-lg"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Escríbenos por WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
