// URL del backend NestJS. En Vercel la defines como variable de entorno
// NEXT_PUBLIC_API_URL (debe empezar con NEXT_PUBLIC_ porque se usa en el navegador).
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

export type Product = {
  id: string
  title: string
  category: string
  description: string
  price: number
  imageUrl: string
  cloudinaryPublicId: string
  createdAt: string
}

export type CategoryCount = { category: string; count: number }

export type PaginatedProducts = {
  items: Product[]
  total: number
  page: number
  totalPages: number
}

function getToken(): string | null {
  if (typeof window === "undefined") return null // en el servidor no hay localStorage
  return localStorage.getItem("admin_token")
}

// Wrapper genérico de fetch: agrega la URL base, el token (si existe) y
// maneja errores de forma consistente en toda la app.
async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken()
  const isFormData = options.body instanceof FormData

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      // Si el body es FormData (subida de imagen), NO ponemos Content-Type
      // manualmente — el navegador lo arma solo con el "boundary" correcto.
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}))
    throw new Error(errorBody.message || `Error ${res.status}`)
  }

  if (res.status === 204) return null
  return res.json()
}

// ── Públicas (las usa la galería) ──

// page/limit permiten traer solo lo que se va a mostrar, no todo el catálogo.
export const getProducts = (opts?: {
  category?: string
  page?: number
  limit?: number
}): Promise<PaginatedProducts> => {
  const params = new URLSearchParams()
  if (opts?.category && opts.category !== "Todos") params.set("category", opts.category)
  if (opts?.page) params.set("page", String(opts.page))
  if (opts?.limit) params.set("limit", String(opts.limit))
  const query = params.toString()
  return apiFetch(`/products${query ? `?${query}` : ""}`)
}

// Trae solo los nombres de categoría + conteo, sin cargar las fotos.
export const getCategories = (): Promise<CategoryCount[]> => apiFetch("/products/categories/list")

export const getProduct = (id: string): Promise<Product> => apiFetch(`/products/${id}`)

// ── Auth ──
export const login = (email: string, password: string) =>
  apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })

// ── Protegidas (solo admin logueado) ──
export const createProduct = (formData: FormData): Promise<Product> =>
  apiFetch("/products", { method: "POST", body: formData })

export const updateProduct = (id: string, formData: FormData): Promise<Product> =>
  apiFetch(`/products/${id}`, { method: "PATCH", body: formData })

export const deleteProduct = (id: string) => apiFetch(`/products/${id}`, { method: "DELETE" })

// ── Foto grande de portada (hero) ──
export const getHeroImage = (): Promise<{ imageUrl: string | null }> =>
  apiFetch("/settings/hero-image")

export const updateHeroImage = (formData: FormData): Promise<{ imageUrl: string }> =>
  apiFetch("/settings/hero-image", { method: "PATCH", body: formData })
