import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Fondo degradado */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-500" />
      {/* Patrón de puntos */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      {/* Círculos decorativos */}
      <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white opacity-5" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-white opacity-5" />

      <div className="relative max-w-7xl mx-auto px-4 py-24 text-center text-white">
        <span className="inline-block bg-white/20 rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
          🐾 Tu veterinaria de confianza en CDMX
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight mb-6">
          El mejor cuidado<br />para tu mascota
        </h1>
        <p className="text-white/80 text-lg max-w-xl mx-auto mb-10">
          Consultas médicas, vacunación, estética y productos premium.
          Porque tu mejor amigo merece lo mejor.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-teal-700 font-bold px-8 py-3 rounded-xl hover:bg-teal-50 transition-colors shadow-lg">
            Ver servicios
          </button>
          <button onClick={() => navigate('/mascotas')}
            className="bg-transparent border-2 border-white text-white font-bold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors">
            Sistema de mascotas
          </button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
          {[
            { n: '+5,000', l: 'Mascotas atendidas' },
            { n: '15+',   l: 'Años de experiencia' },
            { n: '100%',  l: 'Amor y cuidado' },
          ].map(s => (
            <div key={s.l}>
              <p className="text-3xl font-extrabold">{s.n}</p>
              <p className="text-sm text-white/70">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Wave separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80L1440 80L1440 40C1200 0 960 80 720 40C480 0 240 80 0 40L0 80Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}
