import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CakeSlice } from "lucide-react"

export function Hero() {
  return (
    <section id="inicio" className="relative min-h-screen flex flex-col pt-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-cream via-honey/30 to-peach/20" />
      
      {/* Logo Splash */}
      <div className="relative z-10 flex flex-col items-center justify-center py-12 md:py-16">
        <Image
          src="/images/logo.png"
          alt="Azúcar Morena - Dulce Experiencia"
          width={400}
          height={200}
          className="h-32 md:h-44 lg:h-52 w-auto"
          priority
        />
        <div className="mt-4 flex items-center gap-3">
          <span className="h-px w-12 bg-blush/50" />
          <span className="text-sage font-medium tracking-widest text-xs uppercase">
            Pastelería Artesanal
          </span>
          <span className="h-px w-12 bg-blush/50" />
        </div>
      </div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10 flex-1 flex items-center pb-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
          {/* Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 text-balance font-serif">
              Creamos momentos{" "}
              <span className="text-blush italic">dulces</span>{" "}
              e inolvidables
            </h1>
            <p className="text-lg text-foreground/70 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              En Azúcar Morena transformamos tus celebraciones con pasteles artesanales, 
              hechos con amor y los mejores ingredientes. Cada creación es única, 
              diseñada especialmente para ti.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="bg-blush hover:bg-blush/90 text-white rounded-full px-8 text-base"
              >
                <Link href="#contacto">Solicitar Cotización</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-sage text-sage hover:bg-sage hover:text-white rounded-full px-8 text-base"
              >
                <Link href="#trabajos">Ver Trabajos</Link>
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-avocado/30 rounded-full blur-3xl" />
              <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-blush/20 rounded-full blur-3xl" />
              
              {/* Main image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blush/10">
                <Image
                  src="/images/Boda.jpeg"
                  alt="Pastel artesanal de Azúcar Morena"
                  width={600}
                  height={600}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blush/15 rounded-full flex items-center justify-center">
                    <CakeSlice className="w-6 h-6 text-blush" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">+500</p>
                    <p className="text-xs text-foreground/60">Pasteles creados</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
