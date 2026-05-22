export default function Contact() {
  return (
    <section id="contacto" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-teal-600 font-bold text-sm uppercase tracking-widest">¿Tienes dudas?</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">Contáctanos</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Datos de contacto */}
          <div className="space-y-5">
            {[
              { icon: '📍', t: 'Dirección',  d: 'Av. Insurgentes Sur 123, Col. Roma Norte, CDMX' },
              { icon: '📞', t: 'Teléfono',   d: '55 1234 5678 / 55 8765 4321' },
              { icon: '✉️', t: 'Email',      d: 'hola@vetcare.mx' },
              { icon: '🕘', t: 'Horario',    d: 'Lun–Vie 8:00–20:00 · Sáb 9:00–18:00 · Dom Urgencias' },
            ].map(i => (
              <div key={i.t} className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl flex-shrink-0">
                  {i.icon}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{i.t}</p>
                  <p className="text-gray-500 text-sm">{i.d}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Formulario */}
          <form className="card space-y-4" onSubmit={e => { e.preventDefault(); alert('¡Mensaje enviado! Te contactaremos pronto.'); }}>
            <h3 className="font-bold text-gray-900">Envíanos un mensaje</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Nombre</label>
                <input className="input" placeholder="Tu nombre" required />
              </div>
              <div>
                <label className="label">Teléfono</label>
                <input className="input" type="tel" placeholder="55 0000 0000" />
              </div>
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" placeholder="tu@email.com" required />
            </div>
            <div>
              <label className="label">Mensaje</label>
              <textarea className="input resize-none" rows={4} placeholder="¿En qué podemos ayudarte?" required />
            </div>
            <button type="submit" className="btn-primary w-full">Enviar mensaje</button>
          </form>
        </div>
      </div>
    </section>
  );
}
