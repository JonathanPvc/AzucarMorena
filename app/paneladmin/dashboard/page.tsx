"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Trash2, LogOut, Plus, Pencil, X, ArrowLeft } from "lucide-react"
import { isLoggedIn, clearToken } from "@/lib/auth"
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getHeroImage,
  updateHeroImage,
  type Product,
} from "@/lib/api"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

const emptyForm = { title: "", category: "", description: "", price: "" }

export default function AdminDashboardPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loadingList, setLoadingList] = useState(true)

  // Si editingId es null, el formulario está en modo "crear nuevo".
  // Si tiene un id, está en modo "editar ese producto".
  const [editingId, setEditingId] = useState<string | null>(null)

  const [form, setForm] = useState(emptyForm)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState("")

  // Foto grande de portada (hero)
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null)
  const [heroFile, setHeroFile] = useState<File | null>(null)
  const [heroPreview, setHeroPreview] = useState<string | null>(null)
  const [heroSubmitting, setHeroSubmitting] = useState(false)
  const [heroError, setHeroError] = useState("")

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/paneladmin")
      return
    }
    loadProducts()
    getHeroImage()
      .then((data) => setHeroImageUrl(data.imageUrl))
      .catch(() => {})
  }, [router])

  async function loadProducts() {
    setLoadingList(true)
    try {
      const data = await getProducts()
      setProducts(data)
    } catch {
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

  function handleHeroFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] || null
    setHeroFile(selected)
    setHeroPreview(selected ? URL.createObjectURL(selected) : null)
  }

  async function handleHeroSubmit(e: React.FormEvent) {
    e.preventDefault()
    setHeroError("")

    if (!heroFile) {
      setHeroError("Selecciona una foto primero")
      return
    }

    setHeroSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("image", heroFile)
      const result = await updateHeroImage(formData)
      setHeroImageUrl(result.imageUrl)
      setHeroFile(null)
      setHeroPreview(null)
    } catch (err) {
      setHeroError(err instanceof Error ? err.message : "Error al actualizar la foto")
    } finally {
      setHeroSubmitting(false)
    }
  }

  // Al hacer clic en "Editar" de una tarjeta: llena el formulario con
  // los datos actuales de ese producto y hace scroll arriba para verlo.
  function startEdit(product: Product) {
    setEditingId(product.id)
    setForm({
      title: product.title,
      category: product.category,
      description: product.description || "",
      price: String(product.price),
    })
    setFile(null)
    setPreview(product.imageUrl) // muestra la foto actual mientras no subas una nueva
    setFormError("")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm)
    setFile(null)
    setPreview(null)
    setFormError("")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError("")

    // Al crear, la foto es obligatoria. Al editar, es opcional
    // (si no subes una nueva, se conserva la que ya tenía).
    if (!editingId && !file) {
      setFormError("Selecciona una foto")
      return
    }

    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("title", form.title)
      formData.append("category", form.category)
      formData.append("description", form.description)
      formData.append("price", form.price)
      if (file) formData.append("image", file)

      if (editingId) {
        const updated = await updateProduct(editingId, formData)
        setProducts((prev) => prev.map((p) => (p.id === editingId ? updated : p)))
      } else {
        const created = await createProduct(formData)
        setProducts((prev) => [created, ...prev])
      }

      cancelEdit()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Error al guardar el producto")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Borrar esta foto y su precio? Esta acción no se puede deshacer.")) return
    try {
      await deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
      if (editingId === id) cancelEdit() // por si estabas editando la que acabas de borrar
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
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" className="text-foreground/70">
              <ArrowLeft className="w-4 h-4 mr-2" /> Ver sitio
            </Button>
          </Link>
          <Button variant="ghost" onClick={handleLogout} className="text-foreground/70">
            <LogOut className="w-4 h-4 mr-2" /> Salir
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 pt-8">
        {/* Foto grande de portada (hero) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="font-semibold text-lg mb-1">Foto grande de portada</h2>
          <p className="text-foreground/60 text-sm mb-4">
            Es la primera foto que ve cualquiera que entre a la página principal. Cámbiala
            cuando quieras, sin necesidad de pedirle ayuda a nadie.
          </p>

          <div className="grid sm:grid-cols-[200px_1fr] gap-6 items-start">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-cream">
              {(heroPreview || heroImageUrl) && (
                <Image
                  src={heroPreview || heroImageUrl || ""}
                  alt="Foto de portada actual"
                  fill
                  className="object-cover"
                />
              )}
            </div>

            <form onSubmit={handleHeroSubmit} className="space-y-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleHeroFileChange}
                className="block w-full text-sm text-foreground/70 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blush/10 file:text-blush file:font-medium"
              />
              {heroError && <p className="text-sm text-red-500">{heroError}</p>}
              <Button
                type="submit"
                disabled={heroSubmitting || !heroFile}
                className="bg-blush hover:bg-blush/90 text-white rounded-full px-6"
              >
                {heroSubmitting ? "Subiendo..." : "Usar esta foto"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8 grid lg:grid-cols-[380px_1fr] gap-8">
        {/* Formulario: crear o editar */}
        <div className="bg-white rounded-2xl p-6 shadow-sm h-fit lg:sticky lg:top-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              {editingId ? (
                <>
                  <Pencil className="w-5 h-5 text-blush" /> Editar foto
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 text-blush" /> Nueva foto
                </>
              )}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="text-foreground/50 hover:text-foreground text-sm flex items-center gap-1"
              >
                <X className="w-4 h-4" /> Cancelar
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Foto {editingId && <span className="text-foreground/50 font-normal">(opcional al editar)</span>}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required={!editingId}
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
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Pastel de cumpleaños"
                required
                className="bg-white border-oat rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Categoría</label>
              <Input
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                placeholder="Cumpleaños, Bodas, Graduación..."
                required
                className="bg-white border-oat rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Descripción</label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Sabor, tamaño, porciones, ingredientes especiales..."
                rows={3}
                className="bg-white border-oat rounded-xl resize-none"
              />
              <p className="text-xs text-foreground/50 mt-1">
                Esto lo ve el cliente en la galería, para que sepa qué es el pastel.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Precio (COP)</label>
              <Input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
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
              {submitting
                ? "Guardando..."
                : editingId
                ? "Guardar cambios"
                : "Publicar en la galería"}
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
                <div
                  key={p.id}
                  className={`bg-white rounded-2xl overflow-hidden shadow-sm ${
                    editingId === p.id ? "ring-2 ring-blush" : ""
                  }`}
                >
                  <div className="relative aspect-square">
                    <Image src={p.imageUrl} alt={p.title} fill className="object-cover" />
                  </div>
                  <div className="p-4">
                    <span className="inline-block bg-blush/10 text-blush text-xs font-medium px-2.5 py-1 rounded-full mb-1.5">
                      {p.category}
                    </span>
                    <h3 className="font-semibold text-foreground">{p.title}</h3>
                    {p.description && (
                      <p className="text-foreground/60 text-sm mt-1 line-clamp-2">{p.description}</p>
                    )}
                    <p className="text-foreground/70 text-sm mt-1 mb-3">
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        maximumFractionDigits: 0,
                      }).format(p.price)}
                    </p>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => startEdit(p)}
                        className="flex items-center gap-1.5 text-sm text-sage hover:text-sage/80"
                      >
                        <Pencil className="w-4 h-4" /> Editar
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" /> Borrar
                      </button>
                    </div>
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
