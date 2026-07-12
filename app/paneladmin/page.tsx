// Nota: como este archivo es "use client", el metadata de Next.js (para
// bloquear la indexación en Google) hay que ponerlo en un layout.tsx server
// component dentro de /paneladmin. Ver app/paneladmin/layout.tsx

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { login } from "@/lib/api"
import { saveToken, isLoggedIn } from "@/lib/auth"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Si ya hay una sesión activa, mándalo directo al dashboard
  useEffect(() => {
    if (isLoggedIn()) router.replace("/paneladmin/dashboard")
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const data = await login(email, password)
      saveToken(data.accessToken)
      router.push("/paneladmin/dashboard")
    } catch {
      setError("Correo o contraseña incorrectos")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-lg p-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-foreground/60 hover:text-blush transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a la web
        </Link>

        <h1 className="text-2xl font-bold text-foreground mb-1 font-serif">Panel Admin</h1>
        <p className="text-foreground/60 text-sm mb-6">Azúcar Morena — acceso privado</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Correo</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              className="bg-white border-oat rounded-xl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Contraseña</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="bg-white border-oat rounded-xl"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blush hover:bg-blush/90 text-white rounded-full py-5"
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  )
}
