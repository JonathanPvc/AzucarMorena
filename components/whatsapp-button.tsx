"use client"

export function WhatsAppButton() {
  const phone = "573154357707"
  const message = encodeURIComponent("Hola! Me gustaria cotizar con ustedes. Podrian darme mas informacion.?")
  const href = `https://wa.me/${phone}?text=${message}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contáctanos por WhatsApp"
      className="whatsapp-float"
    >
      {/* Tooltip */}
      <span className="whatsapp-tooltip">¡Escríbenos!</span>

      {/* Pulse ring */}
      <span className="whatsapp-pulse" />

      {/* WhatsApp SVG icon */}
      <svg
        viewBox="0 0 32 32"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className="whatsapp-icon"
      >
        <path d="M16.003 2.667C8.639 2.667 2.667 8.639 2.667 16c0 2.364.636 4.667 1.846 6.677L2.667 29.333l6.865-1.807A13.267 13.267 0 0 0 16.003 29.333c7.364 0 13.33-5.972 13.33-13.333S23.367 2.667 16.003 2.667zm0 24.267a11 11 0 0 1-5.627-1.547l-.403-.24-4.073 1.072 1.087-3.973-.263-.408A10.993 10.993 0 0 1 5.003 16c0-6.075 4.924-11 11-11s11 4.925 11 11-4.924 11-11 11zm6.04-8.213c-.33-.165-1.953-.963-2.256-1.073-.303-.11-.523-.165-.743.165-.22.33-.853 1.073-1.046 1.293-.193.22-.386.247-.716.083-.33-.165-1.394-.514-2.655-1.638-.981-.874-1.643-1.953-1.836-2.283-.193-.33-.02-.508.145-.672.149-.148.33-.385.495-.578.165-.192.22-.33.33-.55.11-.22.055-.413-.028-.578-.083-.165-.743-1.79-1.018-2.452-.268-.643-.54-.556-.743-.566l-.633-.011c-.22 0-.578.082-.881.413-.303.33-1.155 1.128-1.155 2.752 0 1.623 1.183 3.192 1.348 3.412.165.22 2.328 3.556 5.642 4.988.788.34 1.403.543 1.882.695.79.252 1.51.216 2.079.131.634-.095 1.953-.798 2.228-1.568.275-.77.275-1.43.193-1.568-.083-.138-.303-.22-.633-.385z" />
      </svg>
    </a>
  )
}
