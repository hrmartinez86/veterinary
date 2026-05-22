export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p className="text-white font-bold text-lg mb-2">🐾 VetCare</p>
          <p className="text-sm">Cuidamos a tu mascota con amor y profesionalismo desde 2010.</p>
        </div>
        <div>
          <p className="text-white font-semibold mb-2">Servicios</p>
          <ul className="text-sm space-y-1">
            <li>Consultas médicas</li>
            <li>Vacunación</li>
            <li>Estética y grooming</li>
            <li>Venta de productos</li>
          </ul>
        </div>
        <div>
          <p className="text-white font-semibold mb-2">Contacto</p>
          <ul className="text-sm space-y-1">
            <li>📍 Av. Reforma 123, CDMX</li>
            <li>📞 55 1234 5678</li>
            <li>✉️ hola@vetcare.mx</li>
            <li>🕘 Lun-Sáb 9:00–19:00</li>
          </ul>
        </div>
      </div>
      <p className="text-center text-xs mt-8 text-gray-600">© {new Date().getFullYear()} VetCare — Todos los derechos reservados</p>
    </footer>
  );
}
