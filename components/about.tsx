import { Cake, Heart, Sparkles, Award } from "lucide-react"

const features = [
  {
    icon: Cake,
    title: "Pasteles Artesanales",
    description: "Cada pastel es una obra de arte, elaborado a mano con técnicas tradicionales y creativas.",
  },
  {
    icon: Heart,
    title: "Hecho con Amor",
    description: "Ponemos corazón en cada detalle, desde la selección de ingredientes hasta la decoración final.",
  },
  {
    icon: Sparkles,
    title: "Diseños Únicos",
    description: "Personalizamos cada creación según tu visión, haciendo realidad tus ideas más dulces.",
  },
  {
    icon: Award,
    title: "Calidad Premium",
    description: "Utilizamos ingredientes de primera calidad para garantizar un sabor excepcional.",
  },
]

export function About() {
  return (
    <section id="nosotros" className="py-20 lg:py-32 bg-honey/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-sage font-medium tracking-widest text-sm uppercase mb-4">
            Sobre Nosotros
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance font-serif">
            Endulzando <span className="text-blush italic">momentos</span> desde el corazón
          </h2>
          <p className="text-foreground/70 text-lg leading-relaxed">
            Somos una pastelería artesanal dedicada a crear experiencias dulces inolvidables. 
            Cada pieza que sale de nuestra cocina está diseñada con pasión y dedicación 
            para hacer de tus celebraciones algo extraordinario.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-cream rounded-2xl p-6 text-center hover:shadow-lg transition-shadow duration-300 group"
            >
              <div className="w-16 h-16 bg-blush/10 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:bg-blush/20 transition-colors">
                <feature.icon className="w-7 h-7 text-blush" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-foreground/60 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
