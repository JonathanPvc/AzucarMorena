"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Trash2, LogOut, Plus, Pencil, X } from "lucide-react"
import { isLoggedIn, clearToken } from "@/lib/auth"
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
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
        <Button variant="ghost" onClick={handleLogout} className="text-foreground/70">
          <LogOut className="w-4 h-4 mr-2" /> Salir
        </Button>
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
