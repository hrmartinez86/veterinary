export default function About() {
  return (
    <section id="nosotros" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Imagen / ilustración */}
        <div className="relative">
          <div className="bg-gradient-to-br from-teal-400 to-emerald-500 rounded-3xl h-80 flex items-center justify-center text-8xl shadow-xl">
            🐶🐱
          </div>
          <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-lg p-4 text-center">
            <p className="text-3xl font-extrabold text-teal-600">15+</p>
            <p className="text-xs text-gray-500 font-medium">Años de experiencia</p>
          </div>
          <div className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-lg p-4 text-center">
            <p className="text-3xl font-extrabold text-teal-600">12</p>
            <p className="text-xs text-gray-500 font-medium">Veterinarios expertos</p>
          </div>
        </div>

        {/* Texto */}
        <div>
          <span className="text-teal-600 font-bold text-sm uppercase tracking-widest">Sobre nosotros</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-4">
            Somos VetCare
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Desde 2010, somos la veterinaria de referencia en la Ciudad de México. Contamos con un equipo
            de veterinarios altamente capacitados y apasionados por el bienestar animal.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            Nuestras instalaciones cuentan con tecnología de punta: equipo de rayos X, laboratorio propio,
            quirófano y área de hospitalización con cuidados 24 horas.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: '🏆', t: 'Certificados', d: 'Por CONEVET y AMMVEPE' },
              { icon: '❤️', t: 'Trato humano', d: 'Amor y paciencia siempre' },
              { icon: '💊', t: 'Medicamentos', d: 'Farmacia interna completa' },
              { icon: '🚑', t: 'Urgencias', d: 'Atención de emergencias' },
            ].map(i => (
              <div key={i.t} className="flex gap-3 items-start">
                <span className="text-xl">{i.icon}</span>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{i.t}</p>
                  <p className="text-xs text-gray-500">{i.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
