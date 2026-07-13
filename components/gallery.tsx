"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { getProducts, getCategories, type Product, type CategoryCount } from "@/lib/api"

const PAGE_SIZE = 9

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price)

export function Gallery() {
  const [categories, setCategories] = useState<CategoryCount[]>([])
  const [activeCategory, setActiveCategory] = useState<string>("Todos")
  const [page, setPage] = useState(1)

  const [works, setWorks] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<Product | null>(null)

  // Categorías: se cargan UNA vez. Es una consulta liviana (solo nombres +
  // conteo), no trae fotos, así que no importa si tienes 10 o 10.000 fotos.
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  // Fotos de la página/categoría actual — el backend hace el filtrado y
  // la paginación, así el navegador nunca descarga más de 9 fotos a la vez.
  useEffect(() => {
    setLoading(true)
    getProducts({ category: activeCategory, page, limit: PAGE_SIZE })
      .then((data) => {
        setWorks(data.items)
        setTotal(data.total)
        setTotalPages(data.totalPages)
      })
      .catch(() => {
        setWorks([])
        setTotal(0)
        setTotalPages(1)
      })
      .finally(() => setLoading(false))
  }, [activeCategory, page])

  function handleCategoryClick(name: string) {
    setActiveCategory(name)
    setPage(1) // siempre vuelve a la página 1 al cambiar de filtro
  }

  function goToPage(n: number) {
    setPage(n)
    // Sube el scroll al inicio de la galería, para que el cambio de página se note
    document.getElementById("trabajos")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const totalPhotos = categories.reduce((sum, c) => sum + c.count, 0)

  return (
    <section id="trabajos" className="py-20 lg:py-32 bg-cream">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
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

        {/* Filtros por categoría */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => handleCategoryClick("Todos")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === "Todos"
                  ? "bg-blush text-white"
                  : "bg-white text-foreground/70 hover:bg-blush/10 hover:text-blush"
              }`}
            >
              Todos <span className="opacity-70">({totalPhotos})</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat.category}
                onClick={() => handleCategoryClick(cat.category)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat.category
                    ? "bg-blush text-white"
                    : "bg-white text-foreground/70 hover:bg-blush/10 hover:text-blush"
                }`}
              >
                {cat.category} <span className="opacity-70">({cat.count})</span>
              </button>
            ))}
          </div>
        )}

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div key={i} className="aspect-[4/5] rounded-2xl bg-oat/40 animate-pulse" />
            ))}
          </div>
        ) : works.length === 0 ? (
          <p className="text-center text-foreground/60">
            {total === 0 && activeCategory === "Todos"
              ? "Muy pronto encontrarás aquí nuestras creaciones."
              : "No hay fotos en esta categoría todavía."}
          </p>
        ) : (
          <>
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
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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

            {/* Paginación numerada — reemplaza las fotos en vez de acumularlas,
                así la página nunca se vuelve interminable sin importar cuántas
                fotos tengas en total. */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-oat text-foreground/60 disabled:opacity-30 disabled:cursor-not-allowed hover:border-blush hover:text-blush transition-colors"
                  aria-label="Página anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  // Si hay muchas páginas, solo muestra alrededor de la actual
                  .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                  .map((n, i, arr) => (
                    <span key={n} className="flex items-center gap-2">
                      {i > 0 && arr[i - 1] !== n - 1 && <span className="text-foreground/40">…</span>}
                      <button
                        onClick={() => goToPage(n)}
                        className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                          n === page
                            ? "bg-blush text-white"
                            : "border border-oat text-foreground/70 hover:border-blush hover:text-blush"
                        }`}
                      >
                        {n}
                      </button>
                    </span>
                  ))}

                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-oat text-foreground/60 disabled:opacity-30 disabled:cursor-not-allowed hover:border-blush hover:text-blush transition-colors"
                  aria-label="Página siguiente"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
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
