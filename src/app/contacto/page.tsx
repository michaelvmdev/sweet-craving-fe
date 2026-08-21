import type { Metadata } from "next";
import db from "@/data/db.json";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contáctanos por WhatsApp para hacer tus pedidos de postres artesanales Dulce Antojo. Atención personalizada para cada ocasión.",
};

export default function ContactoPage() {
  const { contact } = db;

  return (
    <>
      {/* ── HERO ── */}
      <section className="bg-gradient-to-br from-[#FDF6F0] to-rose-50 py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 bg-rose-100 text-[#8B1A4A] text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-widest mb-5">
            📞 Hablemos
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2d1b1b] mb-4">
            Contáctanos
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Estamos listos para endulzar tu próxima ocasión especial. Escríbenos
            y coordinamos tu pedido.
          </p>
        </div>
      </section>

      {/* ── CONTACT CARDS ── */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* WhatsApp card */}
            <div className="bg-gradient-to-br from-[#FDF6F0] to-rose-50 rounded-3xl p-8 flex flex-col items-center text-center border border-rose-100">
              <div className="w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center mb-5 shadow-md">
                <WhatsAppIcon className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#2d1b1b] mb-2">
                WhatsApp
              </h2>
              <p className="text-gray-500 text-sm mb-5 leading-relaxed">
                La forma más rápida de hacer tu pedido. Respondemos a la brevedad.
              </p>
              <p className="text-[#8B1A4A] font-bold text-xl mb-5">
                {contact.whatsappDisplay}
              </p>
              <a
                href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent("Hola! Quisiera hacer un pedido.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] text-white font-semibold py-3 px-6 rounded-full hover:bg-[#1da851] transition-colors text-center"
              >
                Escribir por WhatsApp
              </a>
            </div>

            {/* Hours card */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-5 mx-auto">
                <ClockIcon className="w-8 h-8 text-[#8B1A4A]" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#2d1b1b] mb-5 text-center">
                Horario de Atención
              </h2>
              <div className="flex flex-col gap-3">
                {contact.hours.map((h) => (
                  <div
                    key={h.day}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                  >
                    <span className="text-gray-600 text-sm font-medium">{h.day}</span>
                    <span className="text-[#8B1A4A] font-semibold text-sm">{h.time}</span>
                  </div>
                ))}
              </div>
              <p className="text-gray-400 text-xs text-center mt-5">
                * Pedidos con anticipación recomendados para fechas especiales
              </p>
            </div>
          </div>

          {/* Social media */}
          <div className="mt-12 bg-gradient-to-r from-[#8B1A4A] to-[#5c1030] rounded-3xl p-8 text-center text-white">
            <h2 className="font-serif text-2xl font-bold mb-3">
              Síguenos en Redes Sociales
            </h2>
            <p className="text-white/70 text-sm mb-7">
              Mira nuestras creaciones, novedades y ofertas especiales
            </p>
            <div className="flex items-center justify-center gap-5">
              <a
                href={`https://facebook.com/${contact.social.facebook}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group"
                aria-label="Facebook"
              >
                <div className="w-14 h-14 rounded-full bg-white/15 group-hover:bg-white/30 flex items-center justify-center transition-colors">
                  <FacebookIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-white/70 text-xs group-hover:text-white transition-colors">
                  Facebook
                </span>
              </a>
              <a
                href={`https://instagram.com/${contact.social.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group"
                aria-label="Instagram"
              >
                <div className="w-14 h-14 rounded-full bg-white/15 group-hover:bg-white/30 flex items-center justify-center transition-colors">
                  <InstagramIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-white/70 text-xs group-hover:text-white transition-colors">
                  Instagram
                </span>
              </a>
              <a
                href={`https://tiktok.com/@${contact.social.tiktok}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group"
                aria-label="TikTok"
              >
                <div className="w-14 h-14 rounded-full bg-white/15 group-hover:bg-white/30 flex items-center justify-center transition-colors">
                  <TikTokIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-white/70 text-xs group-hover:text-white transition-colors">
                  TikTok
                </span>
              </a>
            </div>
          </div>

          {/* How to order */}
          <div className="mt-12">
            <div className="text-center mb-8">
              <p className="text-[#8B1A4A] font-semibold text-xs tracking-widest uppercase mb-2">
                Es muy fácil
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2d1b1b]">
                ¿Cómo hacer tu pedido?
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  step: "01",
                  icon: "🍰",
                  title: "Elige tu postre",
                  desc: "Navega nuestro catálogo y elige el postre que más te guste",
                },
                {
                  step: "02",
                  icon: "💬",
                  title: "Escríbenos",
                  desc: "Contáctanos por WhatsApp indicando tu pedido y la fecha que necesitas",
                },
                {
                  step: "03",
                  icon: "🎁",
                  title: "Recibe tu pedido",
                  desc: "Coordinamos la entrega y recibes tu postre listo para disfrutar",
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-50 mb-4">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-[#8B1A4A] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="font-serif text-base font-semibold text-[#2d1b1b] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}
