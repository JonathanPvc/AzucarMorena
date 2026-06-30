"use client"

import { useState } from "react"
import { Send, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// ── Validation helpers ──────────────────────────────────────
const validators = {
  name: (v: string) => {
    if (!v.trim()) return "El nombre es obligatorio"
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/.test(v))
      return "Solo se permiten letras y espacios"
    if (v.trim().length < 2) return "Mínimo 2 caracteres"
    return ""
  },
  email: (v: string) => {
    if (!v.trim()) return "El email es obligatorio"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
      return "Ingresa un email válido (ej: tu@email.com)"
    return ""
  },
  phone: (v: string) => {
    if (!v.trim()) return "El teléfono es obligatorio"
    if (!/^\d+$/.test(v)) return "Solo se permiten números, sin espacios ni guiones"
    if (v.length < 7) return "Mínimo 7 dígitos"
    if (v.length > 15) return "Máximo 15 dígitos"
    return ""
  },
  event: (v: string) => {
    if (!v.trim()) return "Indica el tipo de evento"
    return ""
  },
  message: (v: string) => {
    if (!v.trim()) return "El mensaje es obligatorio"
    if (v.trim().length < 10) return "Cuéntanos un poco más (mínimo 10 caracteres)"
    return ""
  },
}

type Fields = keyof typeof validators

const initialValues = { name: "", email: "", phone: "", event: "", message: "" }
const initialErrors = { name: "", email: "", phone: "", event: "", message: "" }
const initialTouched = { name: false, email: false, phone: false, event: false, message: false }

export function Contact() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState(initialErrors)
  const [touched, setTouched] = useState(initialTouched)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Validate a single field
  const validate = (field: Fields, value: string) => validators[field](value)

  // Handle text/email/textarea change
  const handleChange = (field: Fields, value: string) => {
    // For phone: block any non-digit character from being typed
    if (field === "phone" && value !== "" && !/^\d*$/.test(value)) return

    setValues((prev) => ({ ...prev, [field]: value }))
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validate(field, value) }))
    }
  }

  // Mark field as touched and validate on blur
  const handleBlur = (field: Fields) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    setErrors((prev) => ({ ...prev, [field]: validate(field, values[field]) }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Touch & validate all fields
    const allTouched = { name: true, email: true, phone: true, event: true, message: true }
    const allErrors = {
      name: validate("name", values.name),
      email: validate("email", values.email),
      phone: validate("phone", values.phone),
      event: validate("event", values.event),
      message: validate("message", values.message),
    }

    setTouched(allTouched)
    setErrors(allErrors)

    if (Object.values(allErrors).some((err) => err !== "")) return

    setIsSubmitting(true)

    // Build WhatsApp message with all form data
    const text = [
      "Hola! Solicito una cotizacion:",
      "",
      "Nombre: " + values.name,
      "Email: " + values.email,
      "Telefono: " + values.phone,
      "Tipo de evento: " + values.event,
      "Mensaje: " + values.message,
    ].join("\n")

    const waUrl = `https://wa.me/573154357707?text=${encodeURIComponent(text)}`
    window.open(waUrl, "_blank", "noopener,noreferrer")

    setIsSubmitting(false)
    setIsSubmitted(true)

    setTimeout(() => {
      setIsSubmitted(false)
      setValues(initialValues)
      setErrors(initialErrors)
      setTouched(initialTouched)
    }, 3500)
  }

  // Helper for field styling
  const fieldClass = (field: Fields) =>
    `bg-white border rounded-xl transition-colors ${
      touched[field] && errors[field]
        ? "border-red-400 focus:border-red-400 focus:ring-red-300"
        : "border-oat focus:border-blush focus:ring-blush"
    }`

  return (
    <section id="contacto" className="py-20 lg:py-32 bg-peach/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Info */}
          <div>
            <span className="inline-block text-sage font-medium tracking-widest text-sm uppercase mb-4">
              Contacto
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance font-serif">
              Hagamos realidad tu{" "}
              <span className="text-blush italic">dulce sueño</span>
            </h2>
            <p className="text-foreground/70 text-lg leading-relaxed mb-8">
              ¿Tienes un evento especial en mente? Cuéntanos tu idea y te ayudaremos
              a crear el pastel perfecto. Solicita tu cotización sin compromiso.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blush/10 rounded-full flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-blush" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Email</h3>
                  <a
                    href="mailto:azucarmorenapc@gmail.com"
                    className="text-foreground/70 hover:text-blush transition-colors"
                  >
                    azucarmorenapc@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-avocado/20 rounded-full flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-sage" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Teléfono</h3>
                  <a
                    href="tel:+573154357707"
                    className="text-foreground/70 hover:text-blush transition-colors"
                  >
                    +57 315 4357 707
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-honey rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-foreground/70" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Ubicación</h3>
                  <p className="text-foreground/70">Cali, Colombia</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-cream rounded-3xl p-8 lg:p-10 shadow-lg">
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Solicitar Cotización
            </h3>

            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-avocado/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✓</span>
                </div>
                <h4 className="text-xl font-semibold text-foreground mb-2">
                  ¡Mensaje enviado!
                </h4>
                <p className="text-foreground/70">Te contactaremos pronto.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Name + Email */}
                <div className="grid sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Nombre <span className="text-red-400">*</span>
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Tu nombre"
                      value={values.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      onBlur={() => handleBlur("name")}
                      className={fieldClass("name")}
                      autoComplete="name"
                    />
                    {touched.name && errors.name && (
                      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                        <span>⚠</span> {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={values.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      onBlur={() => handleBlur("email")}
                      className={fieldClass("email")}
                      autoComplete="email"
                    />
                    {touched.email && errors.email && (
                      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                        <span>⚠</span> {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Teléfono <span className="text-red-400">*</span>
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    placeholder="Ej: 3154357707"
                    value={values.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    onBlur={() => handleBlur("phone")}
                    className={fieldClass("phone")}
                    autoComplete="tel"
                  />
                  {touched.phone && errors.phone && (
                    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                      <span>⚠</span> {errors.phone}
                    </p>
                  )}
                </div>

                {/* Event */}
                <div>
                  <label htmlFor="event" className="block text-sm font-medium text-foreground mb-2">
                    Tipo de Evento <span className="text-red-400">*</span>
                  </label>
                  <Input
                    id="event"
                    name="event"
                    type="text"
                    placeholder="Boda, cumpleaños, bautizo..."
                    value={values.event}
                    onChange={(e) => handleChange("event", e.target.value)}
                    onBlur={() => handleBlur("event")}
                    className={fieldClass("event")}
                  />
                  {touched.event && errors.event && (
                    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                      <span>⚠</span> {errors.event}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Mensaje <span className="text-red-400">*</span>
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Cuéntanos sobre tu evento, fecha, número de personas, ideas de diseño..."
                    rows={4}
                    value={values.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    onBlur={() => handleBlur("message")}
                    className={`${fieldClass("message")} resize-none`}
                  />
                  {touched.message && errors.message && (
                    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                      <span>⚠</span> {errors.message}
                    </p>
                  )}
                </div>

                <p className="text-xs text-foreground/50">
                  <span className="text-red-400">*</span> Campos obligatorios
                </p>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blush hover:bg-blush/90 text-white rounded-full py-6 text-base font-medium"
                >
                  {isSubmitting ? (
                    "Enviando..."
                  ) : (
                    <>
                      Enviar Solicitud
                      <Send className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
