import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Lato } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { WhatsAppButton } from '@/components/whatsapp-button'
import './globals.css'

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const lato = Lato({ 
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-lato",
  display: "swap",
})

export const metadata: Metadata = {
  title: 'Azúcar Morena | Pastelería Artesanal',
  description: 'Creamos momentos dulces e inolvidables. Pasteles artesanales hechos con amor para bodas, cumpleaños y eventos especiales. Solicita tu cotización.',
  keywords: ['pastelería', 'pasteles artesanales', 'bodas', 'cumpleaños', 'cupcakes', 'galletas decoradas', 'México'],
  authors: [{ name: 'Azúcar Morena' }],
  openGraph: {
    title: 'Azúcar Morena | Pastelería Artesanal',
    description: 'Creamos momentos dulces e inolvidables. Pasteles artesanales hechos con amor.',
    type: 'website',
    locale: 'es_MX',
  },
}

export const viewport: Viewport = {
  themeColor: '#DD8AAE',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="bg-[#FFFAF2]">
      <body className={`${playfair.variable} ${lato.variable} font-sans antialiased`}>
        {children}
        <WhatsAppButton />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
