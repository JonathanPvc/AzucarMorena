"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { getProducts, type Product } from "@/lib/api"

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price)

export function Gallery() {
  const [works, setWorks] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<Product | null>(null)

  useEffect(() => {
    getProducts()
      .then(setWorks)
      .catch(() => setWorks([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="trabajos" className="py-20 lg:py-32 bg-cream">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-sage font-medium tracking-widest text-sm uppercase mb-4">
            Nuestros Trabajos
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance font-serif">
            Galería de <span className="text-blush italic">creaciones</span>
          </h2>
          <p className="text-foreground/70 text-lg leading-relaxed">
            Explora algunas de nuestras creaciones más especiales. Cada pastel cuenta
            una historia y refleja el amor que ponemos en nuestro trabajo.
          </p>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <p className="text-center text-foreground/60">Cargando galería...</p>
        ) : works.length === 0 ? (
          <p className="text-center text-foreground/60">
            Muy pronto encontrarás aquí nuestras creaciones.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {works.map((work) => (
              <button
                key={work.id}
                onClick={() => setSelectedImage(work)}
                className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-blush focus:ring-offset-2"
              >
                <Image
                  src={work.imageUrl}
                  alt={work.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="inline-block bg-blush/90 text-white text-xs font-medium px-3 py-1 rounded-full mb-2">
                    {work.category}
                  </span>
                  <h3 className="text-white text-lg font-semibold">{work.title}</h3>
                  <p className="text-white/90 text-sm mt-1">{formatPrice(work.price)}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-blush transition-colors"
            onClick={() => setSelectedImage(null)}
            aria-label="Cerrar"
          >
            <X size={32} />
          </button>
          <div
            className="relative w-full max-w-3xl"
            style={{ maxHeight: "85vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full" style={{ maxHeight: "85vh", aspectRatio: "auto" }}>
              <Image
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                width={900}
                height={1100}
                className="object-contain w-full rounded-lg"
                style={{ maxHeight: "80vh", width: "auto", margin: "0 auto", display: "block" }}
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-foreground/80 to-transparent rounded-b-lg">
              <span className="inline-block bg-blush text-white text-xs font-medium px-3 py-1 rounded-full mb-1">
                {selectedImage.category}
              </span>
              <h3 className="text-white text-xl font-semibold">{selectedImage.title}</h3>
              {selectedImage.description && (
                <p className="text-white/80 text-sm mt-1 max-w-xl">{selectedImage.description}</p>
              )}
              <p className="text-white/90 text-sm mt-1">{formatPrice(selectedImage.price)}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
