// Pequeño helper para manejar la "sesión" del admin en el navegador.
// Guardamos el JWT en localStorage bajo la llave "admin_token".

export function saveToken(token: string) {
  localStorage.setItem("admin_token", token)
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("admin_token")
}

export function clearToken() {
  localStorage.removeItem("admin_token")
}

export function isLoggedIn(): boolean {
  return !!getToken()
}
