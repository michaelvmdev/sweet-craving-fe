import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import db from "@/data/db.json";

export const metadata: Metadata = {
  title: "Quiénes Somos",
  description:
    "Conoce la historia de El Dulce Antojo, nuestra misión y los valores que guían cada postre artesanal que elaboramos.",
};

export default function NosotrosPage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="bg-gradient-to-br from-[#FDF6F0] to-rose-50 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 bg-rose-100 text-[#8B1A4A] text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-widest mb-5">
            ♥ Nuestra Historia
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2d1b1b] mb-6">
            Quiénes Somos
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
            {db.about.story}
          </p>
        </div>
      </section>

      {/* ── STORY + LOGO ── */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-14">
            {/* Logo visual */}
            <div className="shrink-0">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full overflow-hidden shadow-xl ring-4 ring-rose-100 ring-offset-4">
                <Image
                  src="/logo.png"
                  alt="El Dulce Antojo"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Mission */}
            <div className="flex-1">
              <p className="text-[#8B1A4A] font-semibold text-xs tracking-widest uppercase mb-3">
                Nuestra Misión
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2d1b1b] mb-5">
                Endulzar cada Momento con Amor
              </h2>
              <p className="text-gray-600 text-base leading-relaxed mb-6">
                {db.about.mission}
              </p>
              <p className="text-gray-600 text-base leading-relaxed mb-8">
                Cada postre que sale de nuestra cocina lleva el cuidado de manos
                que saben lo que hacen y el amor de quienes entienden que un
                postre no es solo comida — es el dulce que acompaña los momentos
                que más recordamos.
              </p>
              <Link
                href="/productos"
                className="inline-flex items-center gap-2 px-7 py-3 bg-[#8B1A4A] text-white font-semibold rounded-full hover:bg-[#6B1235] transition-colors"
              >
                Explorar nuestros postres
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-16 lg:py-20 bg-[#FDF6F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#8B1A4A] font-semibold text-xs tracking-widest uppercase mb-2">
              Lo que nos define
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2d1b1b]">
              Nuestros Valores
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {db.about.values.map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow border border-rose-50"
              >
                <div className="text-5xl mb-5">{v.icon}</div>
                <h3 className="font-serif text-lg font-semibold text-[#2d1b1b] mb-3">
                  {v.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROMISE ── */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#8B1A4A] to-[#5c1030] rounded-3xl px-8 py-12 text-center text-white">
            <div className="text-5xl mb-5">🎂</div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-4">
              Nuestra Promesa
            </h2>
            <p className="text-white/80 text-base leading-relaxed max-w-2xl mx-auto mb-8">
              Cada pedido recibe el mismo cuidado y dedicación, sin importar el
              tamaño. Tu satisfacción y la alegría de quienes disfrutan nuestros
              postres es nuestra mayor recompensa.
            </p>
            <a
              href="https://wa.me/51967636632"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-[#8B1A4A] font-semibold px-7 py-3 rounded-full hover:bg-rose-50 transition-colors"
            >
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
