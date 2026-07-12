// URL del backend NestJS. En Vercel la defines como variable de entorno
// NEXT_PUBLIC_API_URL (debe empezar con NEXT_PUBLIC_ porque se usa en el navegador).
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

export type Product = {
  id: string
  title: string
  category: string
  price: number
  imageUrl: string
  cloudinaryPublicId: string
  createdAt: string
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
export const getProducts = (category?: string): Promise<Product[]> =>
  apiFetch(category ? `/products?category=${encodeURIComponent(category)}` : "/products")

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
