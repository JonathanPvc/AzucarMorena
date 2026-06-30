"use client"

import { useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"

const works = [
  {
    id: 1,
    src: "/images/Graduacion.jpeg",
    alt: "Pastel de bodas elegante",
    category: "Graduacion",
    title: "Pastel de Graduacion",
  },
  {
    id: 2,
    src: "/images/Fornite.jpeg",
    alt: "Pastel de Fornite",
    category: "Videojuegos",
    title: "Pastel de Fornite",
  },
  {
    id: 3,
    src: "/images/cumplegreen.jpeg",
    alt: "Pastel de cumpleaños",
    category: "Cumpleaños",
    title: "Pastel de Cumpleaños",
  },
  {
    id: 4,
    src: "/images/Regalo.jpeg",
    alt: "Detalles especiales",
    category: "Detalles especiales",
    title: "Detalles especiales",
  },
  {
    id: 5,
    src: "/images/TortaVareada.jpeg",
    alt: "Pastel de cumpleaños temático",
    category: "Cumpleaños",
    title: "Pastel de cumpleaños temático",
  },
  {
    id: 6,
    src: "/images/TortaGemelas.jpeg",
    alt: "Pastel de cumpleaños stitch",
    category: "Cumpleaños",
    title: "Pastel de cumpleaños stitch",
  },
]

export function Gallery() {
  const [selectedImage, setSelectedImage] = useState<typeof works[0] | null>(null)

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {works.map((work) => (
            <button
              key={work.id}
              onClick={() => setSelectedImage(work)}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-blush focus:ring-offset-2"
            >
              <Image
                src={work.src}
                alt={work.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <span className="inline-block bg-blush/90 text-white text-xs font-medium px-3 py-1 rounded-full mb-2">
                  {work.category}
                </span>
                <h3 className="text-white text-lg font-semibold">{work.title}</h3>
              </div>
            </button>
          ))}
        </div>
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
            className="relative max-w-4xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage.src}
              alt={selectedImage.alt}
              width={1200}
              height={1500}
              className="object-contain w-full h-full rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-foreground/80 to-transparent rounded-b-lg">
              <span className="inline-block bg-blush text-white text-xs font-medium px-3 py-1 rounded-full mb-1">
                {selectedImage.category}
              </span>
              <h3 className="text-white text-xl font-semibold">{selectedImage.title}</h3>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
