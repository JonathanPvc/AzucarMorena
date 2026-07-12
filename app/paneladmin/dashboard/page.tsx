"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Trash2, LogOut, Plus } from "lucide-react"
import { isLoggedIn, clearToken } from "@/lib/auth"
import { getProducts, createProduct, deleteProduct, type Product } from "@/lib/api"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loadingList, setLoadingList] = useState(true)

  // Estado del formulario "nuevo producto"
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState("")

  // Protege la ruta: si no hay token, fuera de aquí.
  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/paneladmin")
      return
    }
    loadProducts()
  }, [router])

  async function loadProducts() {
    setLoadingList(true)
    try {
      const data = await getProducts()
      setProducts(data)
    } catch {
      // Si el token expiró, el backend devuelve 401 → mandamos a login
      clearToken()
      router.replace("/paneladmin")
    } finally {
      setLoadingList(false)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] || null
    setFile(selected)
    setPreview(selected ? URL.createObjectURL(selected) : null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError("")

    if (!file) {
      setFormError("Selecciona una foto")
      return
    }

    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("category", category)
      formData.append("price", price)
      formData.append("image", file)

      const newProduct = await createProduct(formData)
      setProducts((prev) => [newProduct, ...prev])

      // Reset del formulario
      setTitle("")
      setCategory("")
      setPrice("")
      setFile(null)
      setPreview(null)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Error al subir el producto")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Borrar esta foto y su precio? Esta acción no se puede deshacer.")) return
    try {
      await deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch {
      alert("No se pudo borrar. Intenta de nuevo.")
    }
  }

  function handleLogout() {
    clearToken()
    router.replace("/paneladmin")
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-white border-b border-oat px-4 lg:px-8 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground font-serif">Panel Admin — Azúcar Morena</h1>
        <Button variant="ghost" onClick={handleLogout} className="text-foreground/70">
          <LogOut className="w-4 h-4 mr-2" /> Salir
        </Button>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8 grid lg:grid-cols-[380px_1fr] gap-8">
        {/* Formulario: agregar nueva foto */}
        <div className="bg-white rounded-2xl p-6 shadow-sm h-fit">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blush" /> Nueva foto
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Foto</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="block w-full text-sm text-foreground/70 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blush/10 file:text-blush file:font-medium"
              />
              {preview && (
                <div className="relative w-full aspect-square mt-3 rounded-xl overflow-hidden">
                  <Image src={preview} alt="Vista previa" fill className="object-cover" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Título</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Pastel de cumpleaños"
                required
                className="bg-white border-oat rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Categoría</label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Cumpleaños, Bodas, Graduación..."
                required
                className="bg-white border-oat rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Precio (COP)</label>
              <Input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="150000"
                required
                className="bg-white border-oat rounded-xl"
              />
            </div>

            {formError && <p className="text-sm text-red-500">{formError}</p>}

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-blush hover:bg-blush/90 text-white rounded-full py-5"
            >
              {submitting ? "Subiendo..." : "Publicar en la galería"}
            </Button>
          </form>
        </div>

        {/* Lista de productos existentes */}
        <div>
          <h2 className="font-semibold text-lg mb-4">
            Fotos publicadas {!loadingList && `(${products.length})`}
          </h2>

          {loadingList ? (
            <p className="text-foreground/60">Cargando...</p>
          ) : products.length === 0 ? (
            <p className="text-foreground/60">Todavía no has subido ninguna foto.</p>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {products.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                  <div className="relative aspect-square">
                    <Image src={p.imageUrl} alt={p.title} fill className="object-cover" />
                  </div>
                  <div className="p-4">
                    <span className="inline-block bg-blush/10 text-blush text-xs font-medium px-2.5 py-1 rounded-full mb-1.5">
                      {p.category}
                    </span>
                    <h3 className="font-semibold text-foreground">{p.title}</h3>
                    <p className="text-foreground/70 text-sm mb-3">
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        maximumFractionDigits: 0,
                      }).format(p.price)}
                    </p>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" /> Borrar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
