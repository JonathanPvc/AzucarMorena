import Image from "next/image"
import Link from "next/link"
import { Instagram, Facebook } from "lucide-react"

// TikTok no está en lucide-react — usamos su SVG oficial
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
    </svg>
  )
}

const footerLinks = [
  { href: "#inicio", label: "Inicio" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#trabajos", label: "Trabajos" },
  { href: "#contacto", label: "Contacto" },
]

// Cambia esta URL por la de tu portafolio real
const DEVELOPER_PORTFOLIO_URL = "https://tu-portafolio.com"

const socialLinks = [
  { href: "https://www.instagram.com/azucarmorena.cali?igsh=d285OXRwMGM0ajFu", icon: Instagram, label: "Instagram" },
  { href: "https://www.facebook.com/share/1PDkAwXLjr/?mibextid=wwXIfr", icon: Facebook, label: "Facebook" },
  { href: "https://www.tiktok.com/@azucarmorena_cali?_r=1&_t=ZS-97d4M0Rj5LZ", icon: TikTokIcon, label: "Tiktok" },
]

export function Footer() {
  return (
    <footer className="bg-sage text-cream py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="flex flex-col justify-center items-center text-center">
            <Image
              src="/images/logo.png"
              alt="Azúcar Morena"
              width={420}
              height={180}
              className="h-24 md:h-32 lg:h-36 w-auto mx-auto mb-4 brightness-0 invert opacity-90"
            />
            <p className="text-cream/70 leading-relaxed max-w-sm">
              Creando momentos dulces e inolvidables para tus celebraciones más especiales.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Enlaces</h3>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream/70 hover:text-cream transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Síguenos</h3>
            <div className="flex gap-4 mb-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-cream/10 rounded-full flex items-center justify-center hover:bg-blush transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            <p className="text-cream/70 text-sm">
              <a href="mailto:azucarmorenapc@gmail.com" className="hover:text-cream transition-colors">
                azucarmorenapc@gmail.com
              </a>
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-cream/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-cream/60 text-sm" suppressHydrationWarning>
            © {new Date().getFullYear()} Azúcar Morena. Todos los derechos reservados.
          </p>
          <p className="text-cream/60 text-sm">
            Hecho con 💕 en Cali - Colombia por{" "}
            <a
              href={DEVELOPER_PORTFOLIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-cream transition-colors"
            >
              Jonathan Uribe Agredo
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
