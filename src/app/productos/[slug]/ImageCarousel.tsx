"use client";

import Image from "next/image";
import { useState } from "react";

export default function ImageCarousel({ images, name }: { images: string[]; name: string }) {
  const imgs = images.length > 0 ? images : ["/product_image_not_found.webp"];
  const [idx, setIdx] = useState(0);

  return (
    <div className="relative rounded-2xl overflow-hidden bg-rose-50 aspect-square w-full max-w-lg mx-auto shadow-md">
      <Image
        src={imgs[idx]}
        alt={name}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = "/product_image_not_found.webp";
        }}
        priority
      />

      {imgs.length > 1 && (
        <>
          <button
            onClick={() => setIdx((i) => (i - 1 + imgs.length) % imgs.length)}
            aria-label="Anterior"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/35 hover:bg-black/55 text-white rounded-full flex items-center justify-center text-xl transition-colors z-10"
          >
            ‹
          </button>
          <button
            onClick={() => setIdx((i) => (i + 1) % imgs.length)}
            aria-label="Siguiente"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/35 hover:bg-black/55 text-white rounded-full flex items-center justify-center text-xl transition-colors z-10"
          >
            ›
          </button>
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-10">
            {imgs.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Foto ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-colors ${i === idx ? "bg-white" : "bg-white/50"}`}
              />
            ))}
          </div>
        </>
      )}

      <span className="absolute bottom-3 left-3 text-[10px] text-white/90 bg-black/40 px-2 py-0.5 rounded z-10">
        Imagen referencial
      </span>
    </div>
  );
}
